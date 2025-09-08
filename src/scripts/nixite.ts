import {saveAs} from "file-saver"
import hooks_ from "../../public/hooks.json"
import registry_ from "../../public/registry.json"

function onInstallClick() {
    const selection: string[] = ["nixite-updater"]
    document.querySelectorAll(".Pkg>input").forEach((checkbox_) => {
        const checkbox = checkbox_ as HTMLInputElement
        if (checkbox.checked) {
            selection.push(checkbox.dataset.id!)
        }
    })
    const distros = ["ubuntu", "arch"]
    const scripts = distros.map(
        (distro) =>
            `nixite_installer_for_${distro}() {\n${createScript(distro, selection)}\n}\n`,
    )
    let script = scripts.join("\n") + hooks.common + "\n"
    const blob = new Blob([script], {type: "text/plain;charset=utf-8"})
    saveAs(blob, "nixite.sh")
}

const installBtn = document.getElementById("install-btn") as HTMLButtonElement
installBtn.addEventListener("click", onInstallClick)

interface Pkg {
    dependencies?: string[]
    install_system?: string
    install_command?: string
    skip_if_exists?: string
    flatpak?: boolean
    snap?: "classic" | true
}

type Hooks = Record<string, string>
type Registry = Record<string, Record<string, Pkg>>

const hooks: Hooks = hooks_ as any
const registry: Registry = registry_ as any

export function createScript(distro: string, selection: string[]) {
    const pkgs: Pkg[] = []

    function resolvePkg(pkgName: string) {
        const pkg = registry[pkgName][distro]
        for (const depName of pkg.dependencies || []) {
            resolvePkg(depName)
        }
        if (pkgs.includes(pkg)) return
        pkgs.push(pkg)
    }

    for (const pkgName of selection) {
        resolvePkg(pkgName)
    }

    let s = hooks[distro]

    for (const pkg of pkgs) {
        if (pkg.skip_if_exists) {
            s += `if [[ ! -f "${pkg.skip_if_exists}" ]]; then\n`
        }

        if (pkg.install_system) {
            if (pkg.flatpak) {
                s += `install_flatpak ${pkg.install_system}\n`
            } else if (pkg.snap) {
                s += `install_snap ${pkg.snap == "classic" ? "--classic " : ""}${pkg.install_system}\n`
            } else {
                s += `install_system ${pkg.install_system}\n`
            }
        } else if (pkg.install_command) {
            s += `${pkg.install_command}\n`
        }

        if (pkg.skip_if_exists) {
            s += "fi\n"
        }
    }

    return s
}
