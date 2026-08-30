import { describe, expect, test, beforeEach } from "bun:test";
import { Task, UrgentTask } from "../src/model/task.js";

describe("Task", () => {

    beforeEach(() => {
        Task.counter = 0;
    });

    test("creates a task with correct values", () => {
        const task = new Task(
            "Learn JavaScript",
            "Study classes",
            "todo",
            "medium"
        );

        expect(task.title).toBe("Learn JavaScript");
        expect(task.description).toBe("Study classes");
        expect(task.status).toBe("todo");
        expect(task.priority).toBe("medium");
    });

    test("uses todo as default status", () => {
        const task = new Task(
            "Test task",
            "Test description"
        );

        expect(task.status).toBe("todo");
    });

    test("generates an id", () => {
        const task = new Task(
            "Task",
            "Description"
        );

        expect(task.id).toBe("0");
    });

    test("generates unique ids", () => {
        const task1 = new Task("Task 1", "Description");
        const task2 = new Task("Task 2", "Description");

        expect(task1.id).toBe("0");
        expect(task2.id).toBe("1");
    });

    test("changes status", () => {
        const task = new Task(
            "Task",
            "Description",
            "todo",
            "low"
        );

        task.changeStatus("done");

        expect(task.status).toBe("done");
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

    test("detects overdue task", () => {
        const task = new UrgentTask(
            "Old task",
            "Already expired",
            "todo",
            "2020-01-01T00:00:00"
        );

        expect(task.isOverdue()).toBe(true);
    });

    test("detects non-overdue task", () => {
        const task = new UrgentTask(
            "Future task",
            "Not expired",
            "todo",
            "2099-01-01T00:00:00"
        );

        expect(task.isOverdue()).toBe(false);
    });

});