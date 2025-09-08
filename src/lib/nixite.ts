import hooks_ from "@/assets/hooks.json"
import registry_ from "@/assets/registry.json"

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

const hooks: Hooks = hooks_
const registry: Registry = registry_

export function createScript(distro: string, selection: string[]) {
    const pkgs: Pkg[] = []

    function resolvePkg(pkgName: string) {
        const pkg = registry[pkgName][distro]
        for (const depName of pkg.dependencies || []) {
            resolvePkg(depName)
        }
        pkgs.push(pkg)
    }

    for (const pkgName of selection) {
        resolvePkg(pkgName)
    }

    let s = hooks.common + hooks[distro]

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
            s += "fi"
        }
    }

    return s
}
