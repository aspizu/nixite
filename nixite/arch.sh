flatpakinstall() {
    if command -v flatpak > /dev/null 2>&1; then
        flatpak install flathub "$@"
    fi
        sudo pacman -S --needed --noconfirm flatpak
        flatpak install flathub "$@"
    fi
}

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
