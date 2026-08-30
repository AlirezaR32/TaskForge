const appState = document.querySelector("#app-state");

export function renderState(state) {
    if (!appState) return;

    switch (state) {
        case "loading":
            appState.textContent = "Loading tasks...";
            break;

        case "empty-data":
            appState.textContent = "No tasks yet. Click \"Add Task\" to create your first one.";
            break;

        case "empty-result":
            appState.textContent = "No tasks match your current filters.";
            break;

        case "error":
            appState.textContent = "Failed to load tasks.";
            break;

        case "success":
            appState.textContent = "Fetch data successfully";
            break;

        default:
            appState.textContent = "";
    }

    appState.classList.toggle("hidden", appState.textContent === "");
}
