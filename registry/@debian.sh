export DEBIAN_FRONTEND=noninteractive
sudo apt update

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

install_snap() {
    if ! command -v snap &> /dev/null; then
        sudo apt install snapd -y
        sudo snap install snapd
    fi
    sudo snap install "$@"
}
