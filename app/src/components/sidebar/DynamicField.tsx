import { useState } from "react";
import type { FieldSpec } from "@/constants/nodeConfigs";

interface DynamicFieldProps {
  field: FieldSpec;
  value: string;
  onChange: (value: string) => void;
}

export default function DynamicField({ field, value, onChange }: DynamicFieldProps) {
  const [toggleVal, setToggleVal] = useState(value === "true");

  const labelEl = (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
      {field.label}
      {field.required && <span className="text-error ml-1">*</span>}
    </label>
  );

  switch (field.type) {
    case "text":
      return (
        <div>
          {labelEl}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-heading outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            placeholder={field.placeholder}
          />
          {field.helpText && (
            <p className="mt-1 text-[10px] text-muted">{field.helpText}</p>
          )}
        </div>
      );

    case "number":
      return (
        <div>
          {labelEl}
          <input
            type="number"
            value={value || field.defaultValue || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-heading outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            placeholder={field.placeholder}
          />
        </div>
      );

    case "select":
      return (
        <div>
          {labelEl}
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-heading outline-none focus:border-primary/50 appearance-none cursor-pointer"
          >
            <option value="">Select...</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "textarea":
      return (
        <div>
          {labelEl}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-heading outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none custom-scrollbar"
            placeholder={field.placeholder}
          />
        </div>
      );

    case "json":
      return (
        <div>
          {labelEl}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 font-mono text-xs text-heading outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none custom-scrollbar"
            placeholder={field.placeholder}
            spellCheck={false}
          />
          <div className="mt-1 flex items-center justify-between">
            <p className="text-[10px] text-muted">JSON format</p>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
              JSON
            </span>
          </div>
        </div>
      );

    case "toggle":
      return (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">
            {field.label}
          </label>
          <button
            onClick={() => {
              const next = !toggleVal;
              setToggleVal(next);
              onChange(String(next));
            }}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              toggleVal ? "bg-primary" : "bg-border-dark"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-sm ${
                toggleVal ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      );

    case "tags":
      return (
        <div>
          {labelEl}
          <div className="flex min-h-20 flex-wrap gap-2 rounded-lg border border-dashed border-border-dark bg-bg-dark p-3">
            {value && value.split(",").filter(Boolean).map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 rounded border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                <span className="material-icons text-xs">data_object</span>
                {tag}
                <button
                  onClick={() => {
                    const tags = value.split(",").filter((_, i) => i !== idx);
                    onChange(tags.join(","));
                  }}
                  className="ml-0.5 hover:text-error transition-colors"
                >
                  <span className="material-icons text-xs">close</span>
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Type or drop..."
              className="flex-1 border-none bg-transparent text-xs text-body outline-none min-w-24 placeholder:text-muted"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  const newTags = value ? `${value},${e.currentTarget.value.trim()}` : e.currentTarget.value.trim();
                  onChange(newTags);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
