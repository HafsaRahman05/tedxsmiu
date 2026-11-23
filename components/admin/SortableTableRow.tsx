"use client";

import { useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

interface SortableTableRowProps {
  id: string;
  ids: string[];
  disabled?: boolean;
  className?: string;
  onReorder: (ids: string[]) => void;
  children: ReactNode;
}

export async function persistSortableOrder(
  entity: "team" | "speakers" | "guests" | "sponsors",
  ids: string[],
) {
  const response = await fetch("/api/admin/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entity, ids }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Unable to save display order");
  }
}

export default function SortableTableRow({
  id,
  ids,
  disabled = false,
  className = "",
  onReorder,
  children,
}: SortableTableRowProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <TableRow
      draggable={!disabled}
      onDragStart={(event) => {
        // Prevent accidental drag when clicking interactive elements
        const target = event.target as HTMLElement;
        if (target.closest("button, a, input, select, textarea")) {
          event.preventDefault();
          return;
        }
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        if (!isDragOver) setIsDragOver(true);
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => {
        setIsDragOver(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        const draggedId = event.dataTransfer.getData("text/plain");
        const fromIndex = ids.indexOf(draggedId);
        const toIndex = ids.indexOf(id);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

        const reorderedIds = [...ids];
        reorderedIds.splice(fromIndex, 1);
        reorderedIds.splice(toIndex, 0, draggedId);
        onReorder(reorderedIds);
      }}
      className={`${className} ${
        isDragOver ? "bg-primary/10 border-t-2 border-primary" : ""
      }`}
    >
      <TableCell className="w-10 px-2">
        <span
          aria-label="Drag to change display order"
          title="Drag to change display order"
          className="inline-flex cursor-grab items-center text-muted-foreground active:cursor-grabbing hover:text-primary transition-colors"
        >
          <GripVertical className="h-4 w-4" />
        </span>
      </TableCell>
      {children}
    </TableRow>
  );
}
