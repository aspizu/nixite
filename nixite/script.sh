#!/bin/bash

paruinstall() {
    if command -v paru > /dev/null 2>&1; then
        paru -S --needed --noconfirm "$@"
    else
        sudo pacman -S --needed --noconfirm git base-devel
        git clone https://aur.archlinux.org/paru-bin.git
        cd paru-bin
        makepkg -si
        cd ..
        rm -rf paru-bin
        paru -S --needed --noconfirm "$@"
    fi
}
paruinstall curl
paruinstall unzip
if [ ! -f "$HOME/.bun/bin/bun" ]; then
    curl -fsSL https://bun.com/install | bash
fi
if [ ! -f "$HOME/.cargo/bin/rustup" ]; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
fi
paruinstall zen-browser-bin
if [ ! -f "$HOME/.local/bin/uv" ]; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi
if [ ! -f "$HOME/.local/bin/ruff" ]; then
    $HOME/.local/bin/uv tool install ruff
fi
