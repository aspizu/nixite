import hooks_ from "../hooks.json"
import registry_ from "../registry.json"

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

export const hooks: Hooks = hooks_ as any
export const registry: Registry = registry_ as any

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

    let s = hooks.common

    s += `
if [[ -f /etc/os-release ]]; then
    source /etc/os-release
    FAMILY=\${ID_LIKE:-$ID}
    if [[ "$FAMILY" != *"${distro}"* ]]; then
        echo "This script was designed to run on ${distro}, but the current system is running $ID, select $ID in Nixite and download again."
        exit 1
    fi
else
    echo "File not found: /etc/os-release, are you running Linux?"
    exit 1
fi

`

    s += hooks[distro] + "\n"

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
