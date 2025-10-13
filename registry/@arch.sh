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

install_snap() {
    if ! command -v snap &> /dev/null; then
        sudo pacman -S --needed --noconfirm git base-devel apparmor audit
        cd /tmp || return
        git clone https://aur.archlinux.org/snapd.git
        cd snapd
        makepkg -si --needed --noconfirm
        sudo systemctl enable --now snapd.socket
        sudo systemctl enable --now snapd.apparmor.service
        sudo ln -s /var/lib/snapd/snap /snap
        echo "Snap installed. Initializing snapd ..."
        sudo snap wait system seed || { echo "Failed to initialize snapd. Please run the script again, or reboot."; exit 1; }
        echo "snapd initialized."
    fi
    sudo snap install "$@"
}
