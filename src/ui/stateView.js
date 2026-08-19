const appState = document.querySelector("#app-state");
export function renderState(state) {
    switch (state) {
        case "loading":
            appState.textContent = "Loading tasks...";
            break;

        case "empty-data":
            appState.textContent = "No tasks found.";
            break;

        case "empty-result":
            appState.textContent = "No tasks match your filters.";
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
}