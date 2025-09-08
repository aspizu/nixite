printf "\e[0;30m"
echo '        .__         .__   __            '
echo '  ____  |__|___  ___|__|_/  |_   ____   '
echo ' /    \ |  |\  \/  /|  |\   __\_/ __ \  '
echo '|   |  \|  | >    < |  | |  |  \  ___/  '
echo '|__|  /|__|/__/\_ \|__| |__|   \___  >  '
echo '    \/           \/                \/   '
printf "\e[1;34mSit back while we install your linux software.\n"
printf "\e[1;0mReport bugs to https://github.com/aspizu/nixite/issues\n"
printf "\e[0;0m\n"

if [[ -f "/etc/os-release" ]]; then
    source /etc/os-release
    FAMILY=${ID_LIKE:-$ID}
    case "$FAMILY" in
        *ubuntu*)
            nixite_installer_for_ubuntu
            ;;
        *arch*)
            nixite_installer_for_arch
            ;;
        *)
            echo "Your Linux distribution ($FAMILY) is not supported yet. Please open an issue at https://github.com/aspizu/nixite/issues"
            exit 1
            ;;
    esac
else
    echo "/etc/os-release not found. Are you running Linux?"
    exit 1
fi
