import contextlib
import json
import itertools
from pathlib import Path

with open("src/assets/registry.json") as f:
    icons = list(itertools.chain(*(i.values() for i in json.load(f).values())))

base = Path("/usr/share/icons/Papirus/24x24/apps/")

for icon in icons:
    with contextlib.suppress(FileNotFoundError, FileExistsError):
        print(icon)
        p=base.joinpath(icon).with_suffix(".svg")
        if icon == 'proton-vpn':
            p = base.joinpath('proton-vpn-logo.svg')
        d=f"public/icons/{icon}.svg"
        with open(p) as f:
            with open(d, "w") as ff:
                ff.write(f.read())
