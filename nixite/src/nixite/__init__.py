from typing_extensions import Literal
import msgspec
import msgspec.toml
import enum
import importlib.resources
from . import res
from .string_builder import StringBuilder


class Distro(enum.StrEnum):
    UBUNTU = enum.auto()
    ARCH = enum.auto()


class Package(msgspec.Struct):
    hidden: bool = False
    dependencies: list[str] = msgspec.field(default_factory=list)
    install_command: str | None = None
    install_system: str | None = None
    update_command: str | None = None
    skip_if_exists: str | None = None
    flatpak: bool = False
    snap: Literal["classic"]|bool = False


class DistroWisePackage(msgspec.Struct):
    ubuntu: Package | None = None
    arch: Package | None = None


type Registry = dict[str, Package | DistroWisePackage]

registry: Registry = {}
for pkg_name, pkg in msgspec.toml.decode(
    importlib.resources.read_text(res, "registry.toml")
).items():
    if "ubuntu" in pkg or "arch" in pkg:
        registry[pkg_name] = DistroWisePackage(
            ubuntu=msgspec.json.decode(
                msgspec.json.encode(pkg.get("ubuntu")), type=Package
            ),
            arch=msgspec.json.decode(
                msgspec.json.encode(pkg.get("arch")), type=Package
            ),
        )
    else:
        registry[pkg_name] = msgspec.json.decode(msgspec.json.encode(pkg), type=Package)


def get_package_for_distro(
    package: Package | DistroWisePackage, distro: Distro
) -> Package:
    if isinstance(package, Package):
        return package
    return getattr(package, distro.lower())


def resolve_dependencies(
    distro: Distro,
    package_name: str,
    registry: Registry,
    resolved: list[str],
    visited: set[str],
):
    if package_name in visited:
        return
    visited.add(package_name)

    for dependency_name in get_package_for_distro(
        registry[package_name], distro
    ).dependencies:
        resolve_dependencies(distro, dependency_name, registry, resolved, visited)

    resolved.append(package_name)


def build(distro: Distro, selection: set[str]) -> str:
    package_names: list[str] = []
    visited: set[str] = set()

    for package_name in selection:
        resolve_dependencies(distro, package_name, registry, package_names, visited)

    script = StringBuilder()
    script.iprintln("#!/bin/bash")

    script.iprintln(importlib.resources.read_text(res, f"{distro.lower()}.sh"))

    for package_name in package_names:
        package = get_package_for_distro(registry[package_name], distro)

        if package.skip_if_exists:
            script.iprintln(f'if [ ! -f "{package.skip_if_exists}" ]; then')
            script.indent_level += 1

        if package.install_system:
            if package.flatpak:
                script.iprintln("flatpakinstall ", package.install_system)
            else:
                match distro:
                    case Distro.UBUNTU:
                        if package.snap:
                            script.iprintln("sudo snap install ", "--classic " if package.snap == "classic" else "", package.install_system)
                        else:
                            script.iprintln("sudo apt -y ", package.install_system)
                    case Distro.ARCH:
                        script.iprintln("paruinstall ", package.install_system)

        elif package.install_command:
            script.iprintln(package.install_command)

        if package.skip_if_exists:
            script.indent_level -= 1
            script.iprintln("fi")

    return str(script)
