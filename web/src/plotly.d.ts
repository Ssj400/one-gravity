declare module "plotly.js-dist-min" {
  import * as Plotly from "plotly.js";
  export = Plotly;
}

declare module "*.py?raw" {
  const src: string;
  export default src;
}
