const API_URL = "https://jsonplaceholder.typicode.com/todos";

export async function fetchTasks() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();

    return data.map(task => ({
        id: String(task.id),
        title: task.title,
        status: task.compeleted? "done" : "doing",
        priority: "low"
    }));
}

