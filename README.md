# Nixite

> **★ Star the repo to support the project!**

[![image](https://img.shields.io/github/license/aspizu/nixite)](https://github.com/aspizu/tshu/blob/main/LICENSE)
[![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?logo=discord&logoColor=white)](https://discord.gg/MMfMkRuhAf)

[**Open Nixite**](https://aspizu.github.io/nixite/)

Nixite generates a bash script to unattendedly install all your Linux software.
Nixite automatically configures your system and installs software using the best method available.
Nixite tries to suppress confirmation prompts.

Inspired by [**Ninite**](https://Ninite.com/), [**PackagePicker.co**](https://PackagePicker.co/)

### Nixite supports the following Linux distributions:

- Debian Stable
- Ubuntu Desktop
- Fedora Workstation
- Arch Linux

## Contributing

To add a new package, create a file `app_name.toml` inside `registry/`

You can add common instructions for all distros, or separate instructions for each distro.

```toml
install_system = "package_name" # uses apt on Ubuntu, pacman on Arch Linux
```

```toml
[ubuntu]
install_system = "package_name_on_apt"

[arch]
install_system = "package_name_on_pacman"
```

Use `search_pkgs.py` to find package names on various Linux distro repositories.

Install Papirus icon theme and run:

```shell
python registry.py && prettier -uwu public/*.json
```

`flatpak = true` to install using flatpak, `install_system` should be the flathub package name.
`snap = "classic"` or `snap = true` to install using Snap. `install_system` should be the snap name.

`install_command = "bash command here..."` for custom installers.
When using this, add a `skip_if_exists = "filepath"` to prevent the installer from running again.

Add the package entry `<Pkg id="app-name" name="App Name" />` in `src/pages/index.astro`
