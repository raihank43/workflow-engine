import { useState } from "react";

interface TagItem {
  icon: string;
  value: string;
}

export default function ConfigStep() {
  const [column, setColumn] = useState("");
  const [logic, setLogic] = useState("");
  const [tags, setTags] = useState<TagItem[]>([
    { icon: "data_object", value: "{{node_1.user_id}}" },
    { icon: "link", value: "{{node_1.payload.url}}" },
  ]);
  const [tagInput, setTagInput] = useState("");

  const removeTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, { icon: "data_object", value: tagInput.trim() }]);
      setTagInput("");
    }
  };

  return (
    <div className="space-y-5">
      {/* Source Data Node */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Source Data Node
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-border-dark bg-bg-dark p-3">
          <span className="material-icons text-primary text-sm">bolt</span>
          <span className="text-sm font-medium italic text-white">
            Webform Trigger (Node_1)
          </span>
        </div>
      </div>

      {/* Column Select */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Select Column
          </label>
          <button className="text-slate-500 hover:text-primary transition-colors">
            <span className="material-icons text-sm">help_outline</span>
          </button>
        </div>
        <select
          value={column}
          onChange={(e) => setColumn(e.target.value)}
          className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-white outline-none focus:border-primary/50 appearance-none cursor-pointer"
        >
          <option value="">Select column...</option>
          <option value="user_email">User Email</option>
          <option value="plan_type">Plan Type</option>
          <option value="signup_date">Signup Date</option>
          <option value="country">Country</option>
        </select>
      </div>

      {/* Transformation Logic */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Transformation Logic
          </label>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            JSON
          </span>
        </div>
        <textarea
          value={logic}
          onChange={(e) => setLogic(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 font-mono text-xs text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors resize-none custom-scrollbar"
          placeholder='{"transform": "uppercase", "field": "email"}'
        />
      </div>

      {/* Tag Input — Map Output Value */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Map Output Value
        </label>
        <div className="flex min-h-25 flex-wrap gap-2 rounded-lg border border-dashed border-border-dark bg-bg-dark p-3">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1.5 rounded border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            >
              <span className="material-icons text-xs">{tag.icon}</span>
              {tag.value}
              <button
                onClick={() => removeTag(idx)}
                className="ml-0.5 hover:text-error transition-colors"
              >
                <span className="material-icons text-xs">close</span>
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Type or drop..."
            className="flex-1 border-none bg-transparent text-xs text-slate-400 outline-none min-w-30 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Pro Tip */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-start gap-2">
          <span className="material-icons text-sm text-primary mt-0.5">
            lightbulb
          </span>
          <div>
            <p className="text-xs font-semibold text-primary">Pro Tip</p>
            <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">
              You can use JavaScript expressions inside{" "}
              <code className="rounded bg-primary/10 px-1 py-0.5 font-mono text-[10px] text-primary">
                {"{{ }}"}
              </code>{" "}
              brackets to transform data between nodes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
