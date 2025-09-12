install_system() {
    sudo dnf install -y "$@"
}

install_flatpak() {
    flatpak install flathub -y "$@"
}
