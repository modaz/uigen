import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

export function getToolLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;

  if (toolName === "str_replace_editor") {
    const fileName = args?.path ? getFileName(args.path) : "file";
    switch (args?.command) {
      case "create":
        return `Creating ${fileName}`;
      case "str_replace":
        return `Editing ${fileName}`;
      case "insert":
        return `Inserting into ${fileName}`;
      case "view":
        return `Viewing ${fileName}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    switch (args?.command) {
      case "rename": {
        const oldName = args?.old_path ? getFileName(args.old_path) : "file";
        const newName = args?.new_path ? getFileName(args.new_path) : "file";
        return `Renaming ${oldName} to ${newName}`;
      }
      case "delete": {
        const fileName = args?.path ? getFileName(args.path) : "file";
        return `Deleting ${fileName}`;
      }
      default:
        return toolName;
    }
  }

  return toolName;
}

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationDisplay({ toolInvocation }: ToolInvocationDisplayProps) {
  const label = getToolLabel(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {toolInvocation.state === "result" ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
