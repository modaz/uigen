import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay, getToolLabel } from "../ToolInvocationDisplay";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeToolInvocation(
  overrides: Partial<ToolInvocation> & { toolName: string; args: Record<string, unknown> }
): ToolInvocation {
  return {
    toolCallId: "test-id",
    state: "result",
    result: "Success",
    ...overrides,
  } as ToolInvocation;
}

test("getToolLabel returns 'Creating X' for str_replace_editor create", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "str_replace_editor",
      args: { command: "create", path: "/src/components/Button.tsx" },
    })
  );
  expect(label).toBe("Creating Button.tsx");
});

test("getToolLabel returns 'Editing X' for str_replace_editor str_replace", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "str_replace_editor",
      args: { command: "str_replace", path: "/src/App.jsx" },
    })
  );
  expect(label).toBe("Editing App.jsx");
});

test("getToolLabel returns 'Inserting into X' for str_replace_editor insert", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "str_replace_editor",
      args: { command: "insert", path: "/src/utils/helpers.ts" },
    })
  );
  expect(label).toBe("Inserting into helpers.ts");
});

test("getToolLabel returns 'Viewing X' for str_replace_editor view", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "str_replace_editor",
      args: { command: "view", path: "/src/index.tsx" },
    })
  );
  expect(label).toBe("Viewing index.tsx");
});

test("getToolLabel returns 'Renaming X to Y' for file_manager rename", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "file_manager",
      args: { command: "rename", old_path: "/src/Old.tsx", new_path: "/src/New.tsx" },
    })
  );
  expect(label).toBe("Renaming Old.tsx to New.tsx");
});

test("getToolLabel returns 'Deleting X' for file_manager delete", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "file_manager",
      args: { command: "delete", path: "/src/Unused.tsx" },
    })
  );
  expect(label).toBe("Deleting Unused.tsx");
});

test("getToolLabel falls back to raw tool name for unknown tools", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "unknown_tool",
      args: { command: "do_something" },
    })
  );
  expect(label).toBe("unknown_tool");
});

test("getToolLabel extracts filename from deep paths", () => {
  const label = getToolLabel(
    makeToolInvocation({
      toolName: "str_replace_editor",
      args: { command: "create", path: "/src/components/ui/forms/TextField.tsx" },
    })
  );
  expect(label).toBe("Creating TextField.tsx");
});

test("renders green dot when state is result", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolInvocation={makeToolInvocation({
        toolName: "str_replace_editor",
        args: { command: "create", path: "/src/Button.tsx" },
        state: "result",
        result: "Success",
      })}
    />
  );

  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("renders spinner when state is call", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolInvocation={makeToolInvocation({
        toolName: "str_replace_editor",
        args: { command: "str_replace", path: "/src/App.tsx" },
        state: "call",
      } as unknown as ToolInvocation)}
    />
  );

  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
  expect(screen.getByText("Editing App.tsx")).toBeDefined();
});
