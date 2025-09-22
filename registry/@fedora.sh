install_system() {
    sudo dnf install -y --allowerasing "$@"
}

install_flatpak() {
    flatpak install flathub -y "$@"
}
