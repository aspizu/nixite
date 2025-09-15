import argparse

import httpx


def check_debian(package: str):
    res = httpx.get(f"https://packages.debian.org/trixie/{package}")
    res.raise_for_status()
    if "<p>No such package.</p>" in res.text:
        return False
    return True


def check_ubuntu(package: str):
    res = httpx.get(f"https://packages.ubuntu.com/noble/{package}")
    res.raise_for_status()
    if "<p>No such package.</p>" in res.text:
        return False
    return True


def check_fedora(package: str):
    res = httpx.get(
        f"https://packages.fedoraproject.org/pkgs/{package}/{package}",
        follow_redirects=True,
    )
    if res.status_code == 404:
        return False
    res.raise_for_status()
    if '<a href="fedora-42.html">' not in res.text:
        return False
    return True


def check_archlinux(package: str, registry: str = "core"):
    res = httpx.get(
        f"https://archlinux.org/packages/{registry}/x86_64/{package}",
        follow_redirects=True,
    )
    if res.status_code == 404:
        return False
    res.raise_for_status()
    return True


argparser = argparse.ArgumentParser()
argparser.add_argument("PACKAGE")
args = argparser.parse_args()
package: str = args.PACKAGE


print(f"Debian (trixie) [{check_debian(package)}]")
print(f"Ubuntu (noble) [{check_ubuntu(package)}]")
print(f"Fedora (42) [{check_fedora(package)}]")
print(
    f"Arch Linux (x86_64) [{ {'core': check_archlinux(package, 'core'), 'extra': check_archlinux(package, 'extra'), 'multilib': check_archlinux(package, 'multilib')} }]"
)
