"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Quote,
  Eye,
  Edit3,
  Eraser,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write detailed event description...",
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 0);
  };

  const applyLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = value.substring(0, start);
    const selected = value.substring(start, end);
    const after = value.substring(end);

    const lines = selected.split("\n");
    const formatted = lines.map((line) => `${prefix} ${line}`).join("\n");

    const newValue = before + formatted + after;
    onChange(newValue);
  };

  const addLink = () => {
    const url = prompt("Enter link URL:");
    if (!url) return;
    applyFormat("[", `](${url})`);
  };

  return (
    <div className="border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-border bg-secondary/50 p-2">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyFormat("**", "**")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyFormat("*", "*")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyFormat("<u>", "</u>")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyLinePrefix("#")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyLinePrefix("##")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyLinePrefix("-")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyLinePrefix("1.")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={addLink}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => applyLinePrefix(">")}
            className="h-8 w-8 rounded-none hover:bg-background text-foreground"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
            className="h-8 w-8 rounded-none hover:bg-background text-muted-foreground hover:text-destructive"
            title="Clear All"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        {/* Edit / Preview Toggle */}
        <div className="flex border border-border bg-background p-0.5">
          <button
            type="button"
            onClick={() => setActiveTab("edit")}
            className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] font-bold uppercase transition-colors ${
              activeTab === "edit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Edit3 className="h-3 w-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] font-bold uppercase transition-colors ${
              activeTab === "preview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {activeTab === "edit" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={6}
          className="flex w-full bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono resize-y leading-relaxed"
        />
      ) : (
        <div className="p-4 bg-background text-foreground min-h-[160px] text-sm prose prose-invert max-w-none">
          {value ? (
            <div className="whitespace-pre-wrap leading-relaxed font-sans">{value}</div>
          ) : (
            <p className="text-muted-foreground italic font-mono text-xs">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
