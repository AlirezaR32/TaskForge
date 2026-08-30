import { describe, expect, test } from "bun:test";
import { getFilteredTasks } from "../src/features/taskFilters.js";

const tasks = [
    { id: "1", title: "Learn JavaScript", description: "Study arrays", status: "todo", priority: "high" },
    { id: "2", title: "Build TaskForge", description: "Kanban app", status: "doing", priority: "medium" },
    { id: "3", title: "Fix login bug", description: "Authentication", status: "done", priority: "high" },
];

describe("Task filters", () => {
    test("filters tasks by search text case-insensitively", () => {
        const result = getFilteredTasks(tasks, "JAVASCRIPT", "all", "all");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Learn JavaScript");
    });

    test("filters tasks by status", () => {
        const result = getFilteredTasks(tasks, "", "doing", "all");

        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("doing");
    });

    test("filters tasks by priority", () => {
        const result = getFilteredTasks(tasks, "", "all", "high");

        expect(result).toHaveLength(2);
    });

    test("combines search, status, and priority filters", () => {
        const result = getFilteredTasks(tasks, "bug", "done", "high");

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("3");
    });

    test("returns all tasks when filters are all", () => {
        expect(getFilteredTasks(tasks, "", "all", "all")).toHaveLength(3);
    });

    test("returns empty array when nothing matches", () => {
        expect(getFilteredTasks(tasks, "does-not-exist", "all", "all")).toHaveLength(0);
    });

    test("does not mutate the original task list", () => {
        const original = [...tasks];

        getFilteredTasks(tasks, "task", "all", "all");

        expect(tasks).toEqual(original);
    });
});
