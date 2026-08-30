import { describe, expect, test, beforeEach } from "bun:test";
import { Task, UrgentTask } from "../src/model/task.js";
import { saveTasks, getTasks, clearTasks } from "../src/services/storage.js";

function createLocalStorageMock() {
    const store = new Map();

    return {
        getItem(key) {
            return store.has(key) ? store.get(key) : null;
        },
        setItem(key, value) {
            store.set(key, String(value));
        },
        removeItem(key) {
            store.delete(key);
        },
        clear() {
            store.clear();
        },
    };
}

globalThis.localStorage = createLocalStorageMock();

describe("Task storage", () => {
    beforeEach(() => {
        localStorage.clear();
        Task.counter = 0;
    });

    test("returns an empty array when storage is empty", () => {
        expect(getTasks()).toEqual([]);
    });

    test("serializes and rehydrates normal tasks", () => {
        const task = new Task("Learn JS", "Classes", "doing", "medium");
        const createdAt = task.createdAt;

        saveTasks([task]);
        const loaded = getTasks();

        expect(loaded).toHaveLength(1);
        expect(loaded[0]).toBeInstanceOf(Task);
        expect(loaded[0].id).toBe(task.id);
        expect(loaded[0].title).toBe(task.title);
        expect(loaded[0].description).toBe(task.description);
        expect(loaded[0].status).toBe("doing");
        expect(loaded[0].priority).toBe("medium");
        expect(loaded[0].createdAt).toEqual(createdAt);
    });

    test("serializes and rehydrates urgent tasks", () => {
        const task = new UrgentTask(
            "Fix production bug",
            "Critical issue",
            "todo",
            "2099-01-01T12:00:00"
        );

        saveTasks([task]);
        const loaded = getTasks();

        expect(loaded[0]).toBeInstanceOf(UrgentTask);
        expect(loaded[0].priority).toBe("high");
        expect(loaded[0].deadline).toBe("2099-01-01T12:00:00");
        expect(loaded[0].isOverdue()).toBe(false);
    });

    test("keeps the id counter ahead of restored tasks", () => {
        const task = new Task("Existing task");
        task.id = "42";

        saveTasks([task]);
        getTasks();

        const nextTask = new Task("New task");
        expect(nextTask.id).toBe("43");
    });

    test("falls back to safe values for legacy malformed task data", () => {
        localStorage.setItem("taskforge_tasks", JSON.stringify([
            {
                id: "7",
                title: "Legacy task",
                description: "Old data",
                status: "low"
            }
        ]));

        const loaded = getTasks();

        expect(loaded[0].status).toBe("todo");
        expect(loaded[0].priority).toBe("low");
    });

    test("clearTasks removes stored tasks", () => {
        saveTasks([new Task("Task")]);
        clearTasks();

        expect(getTasks()).toEqual([]);
    });
});
