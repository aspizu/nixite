import * as nixite from "./nixite"
import {saveAs} from "file-saver"

const installBtn = document.getElementById("install-btn") as HTMLButtonElement
const distroSelect = document.getElementById("distro") as HTMLSelectElement
installBtn.addEventListener("click", onInstallClick)

function onInstallClick() {
    const selection: string[] = ["nixite-updater"]
    document.querySelectorAll(".pkg-checkbox").forEach((checkbox_) => {
        const checkbox = checkbox_ as HTMLInputElement
        if (checkbox.checked) {
            selection.push(checkbox.dataset.id!)
        }
    })
    const script = nixite.createScript(distroSelect.value, selection)
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
    }
})
