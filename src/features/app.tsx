import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {createScript} from "@/lib/nixite"
import {useStore} from "@/state/store"
import {saveAs} from "file-saver"
import {PlusIcon} from "lucide-react"

const linkStyle =
    "underline transition-colors decoration-foreground/50 hover:decoration-foreground"

function onInstall() {
    const store = useStore.getState()
    const script = createScript(store.distro, [...store.selection])
    const blob = new Blob([script], {type: "text/plain"})
    saveAs(blob, "nixite.sh")
}

function Pkg({id, name}: {id: string; name: string}) {
    const isSelected = useStore((store) => store.selection.includes(id))
    const setSelection = useStore((store) => store.setSelection)
    return (
        <label className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors select-none">
            <Checkbox
                checked={isSelected}
                onCheckedChange={(value) => setSelection(id, Boolean(value))}
            />
            <img
                src={`icons/${id}.svg`}
                width={24}
                height={24}
                onError={(event) => {
                    ;(event.target as HTMLImageElement).src = "icons/unknown.svg"
                }}
            />
            <span className={`text-sm ${isSelected ? "" : "text-foreground/70"}`}>
                {name}
            </span>
        </label>
    )
}

function Category({name, children}: {name: string; children: React.ReactNode}) {
    return (
        <div className="mb-3 flex flex-col gap-1">
            <h2 className="text-foreground/90 text-sm font-semibold">{name}</h2>
            <div className="flex flex-col">{children}</div>
        </div>
    )
}

export function App() {
    const distro = useStore((store) => store.distro)
    const setDistro = useStore((store) => store.setDistro)

    return (
        <div className="flex flex-col gap-3">
            <header className="bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3 backdrop-blur">
                <div className="flex flex-col">
                    <h1 className="text-3xl tracking-tight">Nixite</h1>
                    <p className="text-muted-foreground text-xs">
                        installs your linux software
                    </p>
                </div>
                <div className="text-foreground/75 hidden max-w-sm text-xs md:block">
                    Generates a bash script to install your linux software unattendedly.
                    Made with ❤️ by{" "}
                    <a href="https://github.com/aspizu" className={linkStyle}>
                        aspizu
                    </a>
                    . Star the project on{" "}
                    <a href="https://github.com/aspizu/nixite" className={linkStyle}>
                        GitHub
                    </a>
                    .
                </div>
            </header>

            <div className="flex items-center gap-3 px-4 pb-2">
                <Button size="sm" onClick={onInstall} className="shadow">
                    Install
                </Button>
                <Select value={distro} onValueChange={setDistro}>
                    <SelectTrigger size="sm" className="w-40">
                        <SelectValue placeholder="Select distro" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ubuntu">Ubuntu</SelectItem>
                        <SelectItem value="arch">Arch Linux</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-muted-foreground text-xs">
                    Run{" "}
                    <code className="bg-muted rounded px-1 font-mono">
                        nixite-updater
                    </code>{" "}
                    to update your system
                </span>
            </div>

            <div className="flex max-h-[720px] flex-col flex-wrap px-4">
                <Category name="Web Browsers">
                    <Pkg id="firefox" name="Firefox" />
                    <Pkg id="google-chrome" name="Google Chrome" />
                    <Pkg id="zen-browser" name="Zen Browser" />
                    <Pkg id="tor-browser" name="Tor Browser" />
                </Category>
                <Category name="Communication">
                    <Pkg id="discord" name="Discord" />
                    <Pkg id="zoom-desktop" name="Zoom" />
                    <Pkg id="telegram" name="Telegram" />
                </Category>
                <Category name="Media & Entertainment">
                    <Pkg id="audacity" name="Audacity" />
                    <Pkg id="spotify" name="Spotify" />
                    <Pkg id="stremio" name="Stremio" />
                    <Pkg id="vlc" name="VLC Media Player" />
                </Category>
                <Category name="Gaming">
                    <Pkg id="retroarch" name="RetroArch" />
                    <Pkg id="steam" name="Steam" />
                    <Pkg id="sober" name="Sober" />
                    <Pkg id="lutris" name="Lutris" />
                </Category>
                <Category name="Graphics & Design">
                    <Pkg id="blender" name="Blender" />
                    <Pkg id="gimp" name="GIMP" />
                    <Pkg id="inkscape" name="Inkscape" />
                    <Pkg id="krita" name="Krita" />
                </Category>
                <Category name="Office & Productivity">
                    <Pkg id="libreoffice" name="LibreOffice" />
                    <Pkg id="notion" name="Notion" />
                    <Pkg id="obsidian" name="Obsidian" />
                </Category>
                <Category name="Development Tools">
                    <Pkg id="bun" name="Bun" />
                    <Pkg id="git" name="Git" />
                    <Pkg id="helix" name="Helix Editor" />
                    <Pkg id="ruff" name="Ruff" />
                    <Pkg id="rustup" name="rustup" />
                    <Pkg id="uv" name="uv" />
                    <Pkg id="vscode" name="Visual Studio Code" />
                    <Pkg id="zed" name="Zed Editor" />
                </Category>
                <Category name="Utilities">
                    <Pkg id="obs" name="OBS Studio" />
                    <Pkg id="proton-vpn" name="Proton VPN" />
                    <Pkg id="transmission" name="Transmission" />
                </Category>
                <Category name="File Sharing">
                    <Pkg id="nicotine-plus" name="Nicotine+" />
                </Category>
                <a href="https://github.com/aspizu/nixite/issues" target="_blank">
                    <Button size="sm" variant="ghost">
                        Suggest an app
                        <PlusIcon />
                    </Button>
                </a>
            </div>
        </div>
    )
}
