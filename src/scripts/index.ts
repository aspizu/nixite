import * as nixite from "./nixite"
import {saveAs} from "file-saver"

const installBtn = document.getElementById("install-btn") as HTMLButtonElement
const distroSelect = document.getElementById("distro") as HTMLSelectElement
installBtn.addEventListener("click", onInstallClick)

function renderBadges() {
    document.querySelectorAll(".pkg-checkbox").forEach((checkbox_) => {
        const checkbox = checkbox_ as HTMLInputElement
        const id = checkbox.dataset.id!
        const pkg = nixite.registry[id][distroSelect.value]
        const badge = checkbox.parentElement!.querySelector(
            ".Badge",
        )! as HTMLSpanElement
        badge.textContent = ""
        function setColor(newColor: string) {
            const oldColor = badge.dataset.color!
            badge.classList.remove(oldColor)
            badge.dataset.color = newColor
            badge.classList.add(newColor)
        }
        if (
            pkg.install_command ||
            pkg.dependencies?.find(
                (e) => e.startsWith("apt-") || e.startsWith("fedora-"),
            )
        ) {
            badge.textContent = "3rd party"
            setColor("bg-red-300")
        }
        if (pkg.snap) {
            badge.textContent = "snap"
            setColor("bg-yellow-300")
        }
        if (pkg.flatpak) {
            badge.textContent = "flatpak"
            setColor("bg-green-300")
        }
    })
}

const preview = document.getElementById("preview")!

function renderPreview() {
    preview.textContent = generateScript()
}

renderBadges()
renderPreview()

distroSelect.oninput = () => {
    renderBadges()
    renderPreview()
}

document.querySelectorAll(".pkg-checkbox").forEach((box) => {
    box.addEventListener("input", () => {
        renderPreview()
    })
})

function generateScript(): string {
    const selection: string[] = []
    document.querySelectorAll(".pkg-checkbox").forEach((checkbox_) => {
        const checkbox = checkbox_ as HTMLInputElement
        if (checkbox.checked) {
            selection.push(checkbox.dataset.id!)
        }
    })
    const script = nixite.createScript(distroSelect.value, selection)
    return script
}

function onInstallClick() {
    const script = generateScript()
    const blob = new Blob([script], {type: "text/plain;charset=utf-8"})
    saveAs(blob, "nixite.sh")
}

let defaults = false
addEventListener("keyup", (event: KeyboardEvent) => {
    if (event.key == "a") {
        document
            .querySelectorAll('.pkg-checkbox[data-default="true"]')
            .forEach((box) => ((box as HTMLInputElement).checked = !defaults))
        defaults = !defaults
        renderPreview()
    }
})
