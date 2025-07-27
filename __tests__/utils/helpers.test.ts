import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  cn,
  debounce,
  throttle,
  generateId,
  formatDate,
  formatRelativeTime,
  capitalize,
  camelCaseToTitleCase,
  safeJsonParse,
  isEmpty,
  deepClone,
} from "@/utils/helpers";

describe("Helper Utilities", () => {
  describe("cn (className combiner)", () => {
    it("combines valid class names", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
      expect(cn("a", "b", "c")).toBe("a b c");
    });

    it("filters out falsy values", () => {
      expect(cn("class1", null, "class2", undefined, false)).toBe(
        "class1 class2"
      );
      expect(cn("", "class1", null)).toBe("class1");
    });

    it("handles empty input", () => {
      expect(cn()).toBe("");
      expect(cn(null, undefined, false)).toBe("");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("delays function execution", () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc("arg1");
      expect(func).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledWith("arg1");
    });

    it("cancels previous calls", () => {
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc("arg1");
      debouncedFunc("arg2");

      vi.advanceTimersByTime(100);
      expect(func).toHaveBeenCalledTimes(1);
      expect(func).toHaveBeenCalledWith("arg2");
    });
  });

  describe("throttle", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("limits function execution rate", () => {
      const func = vi.fn();
      const throttledFunc = throttle(func, 100);

      throttledFunc("arg1");
      expect(func).toHaveBeenCalledWith("arg1");

      throttledFunc("arg2");
      expect(func).toHaveBeenCalledTimes(1); // Should not call again immediately

      vi.advanceTimersByTime(100);
      throttledFunc("arg3");
      expect(func).toHaveBeenCalledWith("arg3");
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe("generateId", () => {
    it("generates unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe("string");
    });
  });

  describe("formatDate", () => {
    it("formats dates correctly", () => {
      const date = new Date("2024-01-15T08:30:00Z");
      const formatted = formatDate(date);

      expect(formatted).toContain("2024");
      expect(formatted).toContain("January");
      expect(formatted).toContain("15");
    });

    it("handles string dates", () => {
      const formatted = formatDate("2024-01-15T08:30:00Z");
      expect(formatted).toContain("2024");
    });
  });

  describe("formatRelativeTime", () => {
    it("formats recent times", () => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      expect(formatRelativeTime(fiveMinutesAgo)).toBe("5 minutes ago");
    });

    it("formats very recent times", () => {
      const now = new Date();
      const justNow = new Date(now.getTime() - 30 * 1000);

      expect(formatRelativeTime(justNow)).toBe("Just now");
    });

    it("formats longer periods", () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      expect(formatRelativeTime(twoDaysAgo)).toBe("2 days ago");
    });
  });

  describe("capitalize", () => {
    it("capitalizes first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("WORLD")).toBe("World");
      expect(capitalize("tEST")).toBe("Test");
    });

    it("handles empty string", () => {
      expect(capitalize("")).toBe("");
    });
  });

  describe("camelCaseToTitleCase", () => {
    it("converts camelCase to Title Case", () => {
      expect(camelCaseToTitleCase("camelCase")).toBe("Camel Case");
      expect(camelCaseToTitleCase("someVariableName")).toBe(
        "Some Variable Name"
      );
      expect(camelCaseToTitleCase("HTML")).toBe("H T M L");
    });

    it("handles single words", () => {
      expect(camelCaseToTitleCase("word")).toBe("Word");
    });
  });

  describe("safeJsonParse", () => {
    it("parses valid JSON", () => {
      const validJson = '{"key": "value"}';
      const result = safeJsonParse(validJson, {});

      expect(result).toEqual({ key: "value" });
    });

    it("returns fallback for invalid JSON", () => {
      const invalidJson = '{"key": invalid}';
      const fallback = { default: true };
      const result = safeJsonParse(invalidJson, fallback);

      expect(result).toBe(fallback);
    });
  });

  describe("isEmpty", () => {
    it("identifies empty values", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it("identifies non-empty values", () => {
      expect(isEmpty("hello")).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: "value" })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe("deepClone", () => {
    it("clones primitive values", () => {
      expect(deepClone(42)).toBe(42);
      expect(deepClone("string")).toBe("string");
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
    });

    it("clones arrays", () => {
      const original = [1, 2, { nested: true }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
    });

    it("clones objects", () => {
      const original = {
        string: "value",
        number: 42,
        nested: { deep: true },
        array: [1, 2, 3],
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
    });

    it("clones dates", () => {
      const originalDate = new Date("2024-01-15");
      const clonedDate = deepClone(originalDate);

      expect(clonedDate).toEqual(originalDate);
      expect(clonedDate).not.toBe(originalDate);
    });
  });
});
