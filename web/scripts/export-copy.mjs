// Extract visible copy, not code: source locations and expressions stay in JSON.
// Run from web/: node scripts/export-copy.mjs
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const groups = [
  ['GEN', 'Portada, navegación y pie de página', 'src/App.tsx'],
  ['SOL', 'Sistema Solar', 'src/tabs/Solar.tsx'],
  ['GAL', 'Galaxia', 'src/tabs/Galaxy.tsx'],
  ['UNI', 'Universo', 'src/tabs/Universe.tsx'],
  ['SUP', 'Supernovas', 'src/tabs/Supernovae.tsx'],
  ['COM', 'Rótulos compartidos', 'src/components/Story.tsx'],
  ['EST', 'Mensajes y estados', 'src/components/Controls.tsx'],
  ['INI', 'Inicio del motor', 'src/worker.ts'],
  ['CAR', 'Estado inicial de carga', 'src/engine.ts'],
];
const result = {version: 1, offsetEncoding: 'utf16-code-units', purpose: 'Editable website copy; not the report', files: {}, groups: []};
const labels = {
  question:'Pregunta de entrada', did:'Qué hicimos', found:'Qué encontramos',
  caption:'Pie de figura', label:'Etiqueta de control o navegación',
  title:'Ayuda o título', 'aria-label':'Descripción accesible', unit:'Unidad del control',
  name:'Nombre de modelo o serie', fate:'Destino del escenario',
  where:'Referencia de distancia', text:'Texto del gráfico',
};
const tagLabels = {h1:'Título principal',h2:'Título',h3:'Subtítulo',p:'Párrafo',
  th:'Encabezado de tabla',td:'Texto de tabla',summary:'Texto desplegable',
  footer:'Pie de página',span:'Etiqueta',strong:'Aviso',a:'Enlace',button:'Botón'};
const allowedTags = new Set(Object.keys(tagLabels));
const inlineTags = new Set(['sub','sup','em','strong','code','br','pre']);
const decode = s => s.replace(/&gt;/g,'>').replace(/&lt;/g,'<').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");

for (const [prefix,title,filename] of groups) {
  const source = fs.readFileSync(path.join(root,filename),'utf8');
  const sf = ts.createSourceFile(filename,source,ts.ScriptTarget.Latest,true,filename.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  result.files[filename] = {sha256:sha(source)};
  const entries = [], covered = [], seen = new Set();
  const tokenFor = (expr,index) => {
    const code = expr.getText(sf);
    const names = [
      [/result\??\.planet/,'PLANETA'],[/years/,'AÑOS'],[/fmtAuto\(dt\)/,'PASO_AÑOS'],
      [/euler\.r_final/,'DISTANCIA_EULER'],[/leapfrog\.r_final/,'DISTANCIA_LEAPFROG'],
      [/distance_mpc/,'DISTANCIA_MPC'],[/m_vis \/ result.m_dyn/,'PORCENTAJE_OSCURO'],
      [/r_last/,'RADIO_KPC'],[/upsDisk/,'MASA_LUZ_DISCO'],[/r_core/,'RADIO_HALO'],
      [/v_inf/,'VELOCIDAD_HALO'],[/result\.models\[3\]/,'COMPARACIÓN_CHI2'],
      [/fmt\(result.n/,'NÚMERO_MEDICIONES'],[/result\.n/,'NÚMERO_MEDICIONES'],
      [/fit \?/,'TIPO_DE_AJUSTE'],[/h0/,'CONSTANTE_HUBBLE'],[/error.what/,'FUNCIÓN_PENDIENTE'],
      [/error.message/,'DETALLE_ERROR'],[/mode ===/,'BOTÓN_DE_TEMA'],
      [/status.ready/,'ESTADO_PYTHON'],[/current.label/,'ESCALA_ACTUAL'],
      [/current.where/,'DISTANCIA_ACTUAL'],[/m.recollapses/,'DESTINO_PERSONALIZADO'],
      [/m.age_exact/,'EDAD_EXACTA'],[/fmtMass/,'MASA_CALCULADA'],
      [/om/,'MATERIA'],[/ol/,'ENERGÍA_OSCURA'],[/b.n/,'MEDICIONES_DEL_INTERVALO'],
      [/path/,'ARCHIVO'],[/res.status/,'CÓDIGO_HTTP'],[/String\(e\)/,'DETALLE_ERROR'],
    ];
    return `⟦${names.find(([re])=>re.test(code))?.[1] ?? `VALOR_${index+1}`}⟧`;
  };
  function add(node,text,kind,tokens=[],start=node.getStart(sf),end=node.end) {
    if (!text.trim() || seen.has(`${start}:${end}`)) return;
    seen.add(`${start}:${end}`);
    entries.push({file:filename,start,end,original:source.slice(start,end),text:decode(text),kind,tokens,
      line:sf.getLineAndCharacterOfPosition(start).line+1});
  }
  function token(expr,tokens) {
    let marker=tokenFor(expr,tokens.length);
    if (tokens.some(t=>t.marker===marker)) marker=marker.replace('⟧',`_${tokens.length+1}⟧`);
    tokens.push({marker,expression:expr.getText(sf)});
    return marker;
  }
  function flatten(children,tokens) {
    return children.map(n=>{
      if (ts.isJsxText(n)) return n.text;
      if (ts.isJsxExpression(n)) {
        if (!n.expression) return '';
        if (ts.isStringLiteral(n.expression)) return n.expression.text;
        return token(n.expression,tokens);
      }
      if (ts.isJsxElement(n)) {
        const tag=n.openingElement.tagName.getText(sf);
        const text=flatten(n.children,tokens);
        if (tag==='sub') return `_${text}`;
        if (tag==='sup') return `^${text}`;
        return text;
      }
      if (ts.isJsxSelfClosingElement(n) && n.tagName.getText(sf)==='br') return '\n';
      return '';
    }).join('');
  }
  function plainChildren(children) {
    return children.every(n=>ts.isJsxText(n)||ts.isJsxExpression(n)||
      (ts.isJsxElement(n)&&inlineTags.has(n.openingElement.tagName.getText(sf)))||
      (ts.isJsxSelfClosingElement(n)&&n.tagName.getText(sf)==='br'));
  }
  function jsxBlock(node,children,start,end,kind) {
    const tokens=[];
    const text=flatten(children,tokens).split('\n').map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean).join(' ');
    // Pure dynamic fields are output from calculations, not editable copy.
    const literals=children.some(n=>ts.isJsxText(n)&&n.text.trim() || ts.isJsxElement(n));
    if (literals) {
      add(node,text,kind,tokens,start,end);
      covered.push([start,end]);
    }
  }
  function visitJsx(n) {
    if (ts.isJsxElement(n)) {
      const tag=n.openingElement.tagName.getText(sf);
      const notice=tag==='div'&&n.openingElement.attributes.properties.some(a=>ts.isJsxAttribute(a)&&a.name.getText(sf)==='className'&&a.initializer?.text?.startsWith('notice '));
      const inside=covered.some(([start,end])=>n.getStart(sf)>=start&&n.end<=end);
      if (!inside&&(allowedTags.has(tag)||notice)&&plainChildren(n.children)) {
        jsxBlock(n,n.children,n.openingElement.end,n.closingElement.getStart(sf),notice?'Aviso completo':tagLabels[tag]);
      }
    } else if (ts.isJsxFragment(n) && ts.isJsxExpression(n.parent) && ts.isJsxAttribute(n.parent.parent)) {
      const attr=n.parent.parent.name.getText(sf);
      jsxBlock(n,n.children,n.openingFragment.end,n.closingFragment.getStart(sf),labels[attr]??attr);
    }
    ts.forEachChild(n,visitJsx);
  }
  visitJsx(sf);
  function humanContext(n) {
    let p=n.parent;
    let jsx=false;
    for (let i=0;p&&i<14;i++,p=p.parent) {
      if (ts.isBinaryExpression(p)) return null;
      if (ts.isJsxAttribute(p)) return labels[p.name.getText(sf)]??null;
      if (ts.isPropertyAssignment(p)) {
        const key=p.name.getText(sf).replaceAll('"','');
        if (labels[key]) return labels[key];
        if (key==='text') return 'Texto del gráfico';
        return null;
      }
      if (ts.isCallExpression(p)) {
        const fn=p.expression.getText(sf);
        if (fn==='status') return 'Mensaje de carga';
        if (fn==='String'||fn.endsWith('.map')) continue;
        if (fn==='Error' || fn==='PendingError') return 'Detalle de error';
        return null;
      }
      if (ts.isNewExpression(p)) {
        return p.expression.getText(sf)==='Error'?'Detalle de error':null;
      }
      if (ts.isVariableDeclaration(p)) {
        const name=p.name.getText(sf);
        if (name==='PLANETS') return 'Nombre de planeta';
        if (name==='fmtMass') return 'Formato de masa';
        if (name==='state') return 'Estado de carga';
        return null;
      }
      if (ts.isJsxExpression(p)) jsx=true;
      if (jsx&&ts.isJsxElement(p)) return 'Texto alternativo o dinámico';
    }
    return null;
  }
  function visitStrings(n) {
    if (ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n)||ts.isTemplateExpression(n)) {
      const kind=humanContext(n);
      const inside=covered.some(([start,end])=>n.getStart(sf)>=start&&n.end<=end);
      // A literal expression like {" "} already belongs to its paragraph.
      const literalExpression=ts.isJsxExpression(n.parent)&&ts.isStringLiteral(n);
      if (kind && !(inside&&literalExpression)) {
        if (ts.isTemplateExpression(n)) {
          const tokens=[];
          const text=n.head.text+n.templateSpans.map(s=>token(s.expression,tokens)+s.literal.text).join('');
          if (text.replace(/⟦[^⟧]+⟧/g,'').trim()) add(n,text,kind,tokens);
        } else {
          // Code-only punctuation/strings in a template expression are not copy.
          const inTemplate = ts.isTemplateExpression(n.parent)||ts.isTemplateSpan(n.parent);
          if (!inTemplate) add(n,n.text,kind);
        }
      }
      // Its placeholders are code, not additional visible copy.
      if (ts.isTemplateExpression(n)) return;
    }
    ts.forEachChild(n,visitStrings);
  }
  visitStrings(sf);
  entries.sort((a,b)=>a.start-b.start||b.end-a.end);
  entries.forEach((e,i)=>e.id=`${prefix}-${String(i+1).padStart(3,'0')}`);
  function checkCoverage(n) {
    if (ts.isJsxText(n)&&n.text.trim()&&!entries.some(e=>e.start<=n.getStart(sf)&&e.end>=n.end)) {
      throw new Error(`Texto visible sin exportar en ${filename}: ${n.text.trim()}`);
    }
    ts.forEachChild(n,checkCoverage);
  }
  checkCoverage(sf);
  result.groups.push({prefix,title,entries});
}

// Browser tab / search description live in HTML, not React.
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
result.files['index.html']={sha256:sha(index)};
const htmlEntries=[];
for (const [re,kind] of [[/<title>(.*?)<\/title>/s,'Título de la pestaña del navegador'],[/<meta name="description" content="([^"]*)"/,'Descripción para buscadores']]) {
  const m=re.exec(index);
  const start=m.index+m[0].indexOf(m[1]);
  htmlEntries.push({id:`MET-${String(htmlEntries.length+1).padStart(3,'0')}`,file:'index.html',start,end:start+m[1].length,original:m[1],text:m[1],kind,tokens:[]});
}
result.groups.push({prefix:'MET',title:'Título del navegador y descripción',entries:htmlEntries});
fs.mkdirSync(path.join(root,'textos'),{recursive:true});
const out=path.join(root,'textos','mapa-textos.json');
const serialized=JSON.stringify(result,null,2)+'\n';
if (fs.existsSync(path.join(root,'textos','textos-pagina.docx'))&&fs.existsSync(out)&&fs.readFileSync(out,'utf8')!==serialized) {
  throw new Error('Ya existe una revisión Word/mapa. Archivar ambos antes de crear otra; no sobrescribir una posible edición de José.');
}
fs.writeFileSync(out,serialized);
console.log(`${result.groups.reduce((n,g)=>n+g.entries.length,0)} textos exportados a ${out}`);
