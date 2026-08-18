const UI_STATE_KEY = "taskforge_ui_state";

export function getUIState() {
    try {
        const data = sessionStorage.getItem(UI_STATE_KEY);

        if (!data) {
            return {"status":"all","priority":"all","search":""};
        }
        return JSON.parse(data);
    } catch (e){
        console.error(e);
        return {"status":"all","priority":"all","search":""};
    }
}

export function saveUIState(state) {
    try{
        sessionStorage.setItem(UI_STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error(e);
    } finally{
        console.log(JSON.parse(sessionStorage.getItem(UI_STATE_KEY)))
    }

}

export function clearUIState() {
    sessionStorage.removeItem(UI_STATE_KEY);
}