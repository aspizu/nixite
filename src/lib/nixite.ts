// @ts-ignore
let pyodide = await loadPyodide();
await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");
await micropip.install("nixite-0.1.0-py3-none-any.whl");
const nixite = pyodide.pyimport("nixite");

export type Distro = "UBUNTU" | "ARCH";

export function build(distro: Distro, selection: string[]): string {
  return nixite.build(distro, selection);
}
