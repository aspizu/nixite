import * as nixite from "./src/scripts/nixite.ts"
const distro = process.argv[2]
let selection = Object.keys(nixite.registry)
if (process.argv[3] != "--all") {
    selection = process.argv[3].split(",").map((s) => s.trim())
}
const script = nixite.createScript(distro, selection)
await Bun.file("nixite.sh").write(script)
