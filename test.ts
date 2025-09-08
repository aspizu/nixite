import {createScript} from "./src/lib/nixite.ts"

const script = createScript("ubuntu", ["firefox"])

await Bun.file("test-installer.sh").write(script)
