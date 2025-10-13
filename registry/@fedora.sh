install_system() {
    sudo dnf install -y --allowerasing "$@"
}

install_flatpak() {
    flatpak install flathub -y "$@"
}

install_snap() {
    if ! command -v snap &> /dev/null; then
        sudo dnf install snapd -y
        sudo ln -s /var/lib/snapd/snap /snap
        echo "Snap installed. Initializing snapd ..."
        sudo snap wait system seed || { echo "Failed to initialize snapd. Please run the script again, or reboot."; exit 1; }
        echo "snapd initialized."
    fi
    sudo snap install "$@"
}