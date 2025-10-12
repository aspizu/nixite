import argparse
import httpx
from bs4 import BeautifulSoup

TIMEOUT = 30 # timeout of 30 secondes

W_COL = "\033[0;33m" # Warning color
E_COL = "\033[0;31m" # Error color
I_COL = "\033[0;32m" # Info color
R_COL = "\033[0m" # Reset color

FOUND = f"{I_COL}True{R_COL}"
NOT_FOUND = f"{W_COL}False{R_COL}"

def check_debian(package: str):
    try:
        res = httpx.get(f"https://packages.debian.org/trixie/{package}", timeout=TIMEOUT)
        
        res.raise_for_status()
        
        if "<p>No such package.</p>" in res.text:
            return NOT_FOUND
        return FOUND
    
    except httpx.ReadTimeout:
        return f"{E_COL}Timeout reached: {TIMEOUT} second(s){R_COL}"
    except httpx.HTTPStatusError as err:
        if err.response.status_code == 404:
            return NOT_FOUND
        else:
            return f"{E_COL}Error Status code: {err.response.status_code}{R_COL}"
    except Exception as err:
        return f"{E_COL}Error: {type(err).__name__}{R_COL}"    


def check_ubuntu(package: str):
    try:
        res = httpx.get(f"https://packages.ubuntu.com/noble/{package}", timeout=TIMEOUT)
        
        res.raise_for_status()
        
        if "<p>No such package.</p>" in res.text:
            return NOT_FOUND
        return FOUND

    except httpx.ReadTimeout:
        return f"{E_COL}Timeout reached: {TIMEOUT} second(s){R_COL}"
    except httpx.HTTPStatusError as err:
        if err.response.status_code == 404:
            return NOT_FOUND
        else:
            return f"{E_COL}Error Status code: {err.response.status_code}{R_COL}"
    except Exception as err:
        return f"{E_COL}Error: {type(err).__name__}{R_COL}"


def check_fedora(package: str):
    try:
        res = httpx.get(
            f"https://packages.fedoraproject.org/search?query={package}&releases=Fedora+42&start=0",
            follow_redirects=True,
            timeout=TIMEOUT
        )

        res.raise_for_status()
        
        html = BeautifulSoup(res.text, 'html.parser')
        pkgs = html.select('a span')
        pkgFound = NOT_FOUND
        for pkg in pkgs:
            if pkg.get_text().strip() == package:
                pkgFound = FOUND
        
        return pkgFound
    except httpx.ReadTimeout:
        return f"{E_COL}Timeout reached: {TIMEOUT} second(s){R_COL}"        
    except httpx.HTTPStatusError as err:
        if err.response.status_code == 404:
            return NOT_FOUND
        else:
            return f"{E_COL}Error Status code: {err.response.status_code}{R_COL}"
    except Exception as err:
        return f"{E_COL}Error: {type(err).__name__}{R_COL}"


def check_archlinux(package: str, registry: str = "core"):
    try:
        res = httpx.get(
            f"https://archlinux.org/packages/{registry}/x86_64/{package}",
            follow_redirects=True,
            timeout=TIMEOUT
        )

        res.raise_for_status()    

        return FOUND
    except httpx.ReadTimeout:
        return f"{E_COL}Timeout reached: {TIMEOUT} second(s){R_COL}"
    except httpx.HTTPStatusError as err:
        if err.response.status_code == 404:
            return NOT_FOUND
        else:
            return f"{E_COL}Error Status code: {err.response.status_code}{R_COL}"
    except Exception as err:
        return f"{E_COL}Error: {type(err).__name__}{R_COL}"


argparser = argparse.ArgumentParser()
argparser.add_argument("PACKAGE")
args = argparser.parse_args()
package: str = args.PACKAGE


print(f"Debian (trixie) [{check_debian(package)}]")
print(f"Ubuntu (noble) [{check_ubuntu(package)}]")
print(f"Fedora (42) [{check_fedora(package)}]")
print(f"Arch Linux (x86_64) [{{ 'core': {check_archlinux(package, 'core')}, 'extra': {check_archlinux(package, 'extra')}, 'multilib': {check_archlinux(package, 'multilib')} }}]")
