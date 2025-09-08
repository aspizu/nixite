import contextlib
import json
import shutil
from pathlib import Path

import tomllib


def copy_icon_for_pkg(pkg_name: str):
    with contextlib.suppress(FileNotFoundError, FileExistsError):
        shutil.copy(
            f"/usr/share/icons/Papirus/24x24/apps/{pkg_name}.svg",
            f"public/icons/{pkg_name}.svg",
        )


registry_path = Path("registry")
registry = {}
for pkg_path in registry_path.glob("*.toml"):
    with pkg_path.open("rb") as pkg_file:
        pkg = tomllib.load(pkg_file)
        if pkg_path.stem == "$common":
            for common_pkg in pkg["packages"]:
                pkg = {"install_system": common_pkg}
                pkg = {"ubuntu": pkg, "arch": pkg}
                registry[common_pkg] = pkg
                copy_icon_for_pkg(common_pkg)
        else:
            if "ubuntu" not in pkg:
                pkg = {"ubuntu": pkg, "arch": pkg}
            registry[pkg_path.stem] = pkg
        copy_icon_for_pkg(pkg_path.stem)


hooks = {}
for hooks_path in registry_path.glob("@*.sh"):
    hooks[hooks_path.stem.removeprefix("@")] = hooks_path.read_text()

with open("src/assets/hooks.json", "w") as hooks_file:
    json.dump(hooks, hooks_file)

with open("src/assets/registry.json", "w") as registry_file:
    json.dump(registry, registry_file)
