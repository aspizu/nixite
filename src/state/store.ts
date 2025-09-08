import {create} from "zustand"
import {immer} from "zustand/middleware/immer"

type State = {
    distro: string
    selection: string[]
}

type Actions = {
    setDistro(distro: string): void
    setSelection(key: string, value: boolean): void
}

export const useStore = create<State & Actions>()(
    immer((set) => ({
        distro: "ubuntu",
        selection: [],
        setDistro: (distro) => set({distro}),
        setSelection: (key, value) =>
            set((state) => {
                const idx = state.selection.indexOf(key)
                if (value) {
                    if (idx != -1) return
                    state.selection.push(key)
                } else {
                    if (idx == -1) return
                    state.selection.splice(idx, 1)
                }
            }),
    })),
)
