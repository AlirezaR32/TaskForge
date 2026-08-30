import { describe, expect, test, beforeEach } from "bun:test";
import { Task, UrgentTask } from "../src/model/task.js";

describe("Task", () => {
    beforeEach(() => {
        Task.counter = 0;
    });

    test("creates a task with correct values", () => {
        const task = new Task("Learn JavaScript", "Study classes", "todo", "medium");

        expect(task.title).toBe("Learn JavaScript");
        expect(task.description).toBe("Study classes");
        expect(task.status).toBe("todo");
        expect(task.priority).toBe("medium");
        expect(task.createdAt).toBeInstanceOf(Date);
    });

    test("uses todo and low as default status and priority", () => {
        const task = new Task("Test task");

        expect(task.status).toBe("todo");
        expect(task.priority).toBe("low");
        expect(task.description).toBe("");
    });

    test("generates unique ids", () => {
        const task1 = new Task("Task 1");
        const task2 = new Task("Task 2");

        expect(task1.id).toBe("0");
        expect(task2.id).toBe("1");
    });

    test("changes status", () => {
        const task = new Task("Task", "Description", "todo", "low");

        task.changeStatus("done");

        expect(task.status).toBe("done");
    });

    test("rejects an invalid status during creation", () => {
        expect(() => new Task("Task", "Description", "invalid", "low"))
            .toThrow("Invalid task status");
    });

    test("rejects an invalid priority during creation", () => {
        expect(() => new Task("Task", "Description", "todo", "urgent"))
            .toThrow("Invalid task priority");
    });

    test("rejects an invalid status change", () => {
        const task = new Task("Task");

        expect(() => task.changeStatus("invalid"))
            .toThrow("Invalid task status");
    });
});

describe("UrgentTask", () => {
    beforeEach(() => {
        Task.counter = 0;
    });

    test("creates an urgent task with high priority", () => {
        const task = new UrgentTask(
            "Fix bug",
            "Critical bug",
            "todo",
            "2026-12-31T12:00:00"
        );

        expect(task.priority).toBe("high");
        expect(task.deadline).toBe("2026-12-31T12:00:00");
    });

    test("uses todo as the default status", () => {
        const task = new UrgentTask("Fix bug", "Critical bug", undefined, "2099-01-01T00:00:00");

        expect(task.status).toBe("todo");
        expect(task.priority).toBe("high");
    });

    test("detects overdue task", () => {
        const task = new UrgentTask("Old task", "Already expired", "todo", "2020-01-01T00:00:00");

        expect(task.isOverdue()).toBe(true);
    });

    test("detects non-overdue task", () => {
        const task = new UrgentTask("Future task", "Not expired", "todo", "2099-01-01T00:00:00");

        expect(task.isOverdue()).toBe(false);
    });
});
