const UI_STATE_KEY = "taskforge_ui_state";
const DEFAULT_UI_STATE = {
    status: "all",
    priority: "all",
    search: "",
    mobileNavOpen: false,
};

export function getUIState() {
    try {
        const data = sessionStorage.getItem(UI_STATE_KEY);

        if (!data) {
            return { ...DEFAULT_UI_STATE };
        }
        return { ...DEFAULT_UI_STATE, ...JSON.parse(data) };
    } catch (e) {
        console.error(e);
        return { ...DEFAULT_UI_STATE };
    }
}

export function saveUIState(state) {
    try {
        sessionStorage.setItem(UI_STATE_KEY, JSON.stringify({ ...DEFAULT_UI_STATE, ...state }));
    } catch (e) {
        console.error(e);
    }
}

export function clearUIState() {
    sessionStorage.removeItem(UI_STATE_KEY);
}