import { describe, expect, test } from "bun:test";
import { getFilteredTasks } from "../src/features/taskFilters.js";

const tasks = [
    {
        id: "1",
        title: "Learn JavaScript",
        status: "todo",
        priority: "high"
    },
    {
        id: "2",
        title: "Build TaskForge",
        status: "doing",
        priority: "medium"
    },
    {
        id: "3",
        title: "Fix login bug",
        status: "done",
        priority: "high"
    }
];

describe("Task filters", () => {

    test("filters tasks by search text", () => {
        const result = getFilteredTasks(
            tasks,
            "javascript",
            "all",
            "all"
        );

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Learn JavaScript");
    });

    test("filters tasks by status", () => {
        const result = getFilteredTasks(
            tasks,
            "",
            "doing",
            "all"
        );

        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("doing");
    });

    test("filters tasks by priority", () => {
        const result = getFilteredTasks(
            tasks,
            "",
            "all",
            "high"
        );

        expect(result).toHaveLength(2);
    });

    test("returns all tasks when filters are all", () => {
        const result = getFilteredTasks(
            tasks,
            "",
            "all",
            "all"
        );

        expect(result).toHaveLength(3);
    });

    test("returns empty array when nothing matches", () => {
        const result = getFilteredTasks(
            tasks,
            "does-not-exist",
            "all",
            "all"
        );

        expect(result).toHaveLength(0);
    });

});