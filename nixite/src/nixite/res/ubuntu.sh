flatpakinstall() {
    if command -v flatpak > /dev/null 2>&1; then
        flatpak install flathub "$@"
    fi
        sudo apt install -y flatpak
        flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
        flatpak install flathub "$@"
    fi
}
