"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/practice/questions";

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const languageLabels: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
};

export function CodeEditor({ language, value, onChange, readOnly }: CodeEditorProps) {
  return (
    <div className="relative">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{languageLabels[language]}</span>
        {readOnly && <span className="text-xs text-red-600">Time's up! Submission locked.</span>}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={cn(
          "font-mono text-sm",
          "min-h-[400px] resize-none",
          readOnly && "bg-slate-100 cursor-not-allowed"
        )}
        placeholder={`Write your ${languageLabels[language]} solution here...`}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Lines: {value.split("\n").length}</span>
        <span>Characters: {value.length}</span>
      </div>
    </div>
  );
}
