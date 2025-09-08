#!/bin/bash

if command -v apt &> /dev/null; then
    sudo apt update -y && sudo apt upgrade -y && sudo apt autoremove
fi

if command -v pacman &> /dev/null; then
    sudo pacman -Syyu --noconfirm
fi

if command -v paru &> /dev/null; then
    paru -Syyu --noconfirm
fi

if command -v flatpak &> /dev/null; then
    flatpak update -y
fi

if command -v snap &> /dev/null; then
    sudo snap refresh
fi

if command -v rustup &> /dev/null; then
    rustup update
fi

if command -v bun &> /dev/null; then
    bun upgrade
fi

if command -v uv &> /dev/null; then
    uv self update
    uv tool upgrade --all
fi
