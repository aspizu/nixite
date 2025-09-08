import contextlib
import json
import shutil
from pathlib import Path

import tomllib


def copy_icon_for_pkg(pkg_name: str):
    icon_name = pkg_name
    if pkg_name == "proton-vpn":
        icon_name = "proton-vpn-logo"
    with contextlib.suppress(FileNotFoundError, FileExistsError):
        shutil.copy(
            f"/usr/share/icons/Papirus/24x24/apps/{icon_name}.svg",
            f"public/icons/{pkg_name}.svg",
        )


registry_path = Path("registry")
registry = {}
for pkg_path in registry_path.glob("*.toml"):
    with pkg_path.open("rb") as pkg_file:
        pkg = tomllib.load(pkg_file)
        if "ubuntu" not in pkg:
            pkg = {"ubuntu": pkg, "arch": pkg}
        registry[pkg_path.stem] = pkg
        copy_icon_for_pkg(pkg_path.stem)


hooks = {}
for hooks_path in registry_path.glob("@*.sh"):
    hooks[hooks_path.stem.removeprefix("@")] = hooks_path.read_text()

with open("public/hooks.json", "w") as hooks_file:
    json.dump(hooks, hooks_file)

with open("public/registry.json", "w") as registry_file:
    json.dump(registry, registry_file)


for pkg_name, pkg in registry.items():
    for pkg in pkg.values():
        for dep_name in pkg.get("dependencies", []):
            if dep_name not in registry:
                print(f"Warning: {pkg_name} depends on unknown package {dep_name}")
        if "curl" in pkg.get("install_command", ""):
            if "curl" not in pkg.get("dependencies", []):
                print(
                    f"Warning: {pkg_name} uses curl in install_command but does not list it as a dependency"
                )
        if "install_command" in pkg and "install_system" in pkg:
            print(
                f"Warning: {pkg_name} has both install_command and install_system defined"
            )
        if "flatpak" in pkg and "snap" in pkg:
            print(f"Warning: {pkg_name} has both flatpak and snap defined")
