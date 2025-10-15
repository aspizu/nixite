install_system() {
    if ! command -v paru &> /dev/null; then
        sudo pacman -S --needed --noconfirm git base-devel
        cd /tmp || return
        git clone https://aur.archlinux.org/paru-bin.git
        cd paru-bin || return
        makepkg -si --needed --noconfirm
    fi
    paru -S --needed --noconfirm "$@"
}

install_flatpak() {
    if ! command -v flatpak &> /dev/null; then
        sudo pacman -S --needed --noconfirm flatpak
    fi
    flatpak install flathub -y "$@"
}
