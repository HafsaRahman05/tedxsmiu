"use client";

import type { ReactNode } from "react";
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
  className,
  onReorder,
  children,
}: SortableTableRowProps) {
  return (
    <TableRow
      draggable={!disabled}
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text/plain");
        const fromIndex = ids.indexOf(draggedId);
        const toIndex = ids.indexOf(id);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

        const reorderedIds = [...ids];
        reorderedIds.splice(fromIndex, 1);
        reorderedIds.splice(toIndex, 0, draggedId);
        onReorder(reorderedIds);
      }}
      className={className}
    >
      <TableCell className="w-10 px-2">
        <span
          aria-label="Drag to change display order"
          title="Drag to change display order"
          className="inline-flex cursor-grab items-center text-muted-foreground active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </span>
      </TableCell>
      {children}
    </TableRow>
  );
}
