#!/usr/bin/env bash
set -e

# Colors
BLACK="\e[0;30m"
BLUE="\e[1;34m"
CYAN="\e[36m"
RESET="\e[0m"
UNDERLINE="\e[4m"
NO_UNDERLINE="\e[24m"

# ASCII art
echo -e "${BLACK}"
cat <<'EOF'
                .__         .__   __
        ____  |__|___  ___|__|_/  |_   ____
        /    \ |  |\  \/  /|  |\   __\_/ __ \
        |   |  \|  | >    < |  | |  |  \  ___/
        |__|  /|__|/__/\_ \|__| |__|   \___  >
            \/           \/                \/
EOF

# Messages
echo -e "${BLUE}    Sit back while we install your linux software"
echo -e "${RESET}Report bugs to ${CYAN}${UNDERLINE}https://github.com/aspizu/nixite/issues${NO_UNDERLINE}${RESET}"
echo
