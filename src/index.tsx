// @ts-expect-error Types don't exist
import "@fontsource-variable/ubuntu-sans"
// @ts-expect-error Types don't exist
import "@fontsource/cascadia-code"
// @ts-expect-error Types don't exist
import "@fontsource-variable/gelasio"

import "@/styles/index.css"

import {App} from "@/features/app"
import {createRoot} from "react-dom/client"

const root = document.getElementById("root") as HTMLDivElement
createRoot(root).render(<App />)

const theme = window.matchMedia("(prefers-color-scheme: dark)")

function updateTheme() {
    if (theme.matches) {
        document.documentElement.classList.add("dark")
    } else {
        document.documentElement.classList.remove("dark")
    }
}

theme.addEventListener("change", updateTheme)
updateTheme()
