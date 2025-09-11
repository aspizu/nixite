export DEBIAN_FRONTEND=noninteractive

install_system() {
    sudo apt install -y "$@"
}

install_flatpak() {
    if ! command -v flatpak &> /dev/null; then
        install_system flatpak
        flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
    fi
    flatpak install flathub -y "$@"
}
