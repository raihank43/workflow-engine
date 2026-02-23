import { useState } from "react";

interface Section {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const sections: Section[] = [
  { id: "profile", icon: "person", title: "Profile Information", description: "Manage your personal details and avatar" },
  { id: "password", icon: "lock", title: "Password & Security", description: "Update your password and enable 2FA" },
  { id: "notifications", icon: "notifications", title: "Notification Preferences", description: "Choose what alerts you receive" },
  { id: "api", icon: "vpn_key", title: "API Keys & Integrations", description: "Manage API access tokens" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your account preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Section nav */}
        <nav className="w-56 shrink-0 space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeSection === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-body hover:bg-hover-bg hover:text-heading"
              }`}
            >
              <span className="material-icons text-lg">{s.icon}</span>
              {s.title.split(" ")[0]}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 rounded-xl border border-border-dark bg-surface-dark p-6">
          {activeSection === "profile" && <ProfileSection />}
          {activeSection === "password" && <PasswordSection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "api" && <ApiKeysSection />}
        </div>
      </div>
    </div>
  );
}

// ─── Profile ───
function ProfileSection() {
  const [name, setName] = useState("Raihan K.");
  const [email, setEmail] = useState("raihan@example.com");
  const [role] = useState("Administrator");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-heading">Profile Information</h2>
        <p className="mt-1 text-sm text-muted">Update your personal details below.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <span className="text-xl font-bold text-primary">RK</span>
        </div>
        <div>
          <button className="rounded-lg border border-border-dark bg-bg-dark px-3 py-1.5 text-xs font-medium text-body hover:text-heading transition-colors">
            Change avatar
          </button>
          <p className="mt-1 text-xs text-muted">JPG, PNG up to 2MB</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name" value={name} onChange={setName} />
        <Field label="Email Address" value={email} onChange={setEmail} type="email" />
        <Field label="Role" value={role} disabled />
        <Field label="Timezone" value="UTC+7 (Jakarta)" disabled />
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ─── Password ───
function PasswordSection() {
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-heading">Password & Security</h2>
        <p className="mt-1 text-sm text-muted">Ensure your account stays secure.</p>
      </div>

      <div className="max-w-md space-y-4">
        <Field label="Current Password" value={current} onChange={setCurrent} type="password" />
        <Field label="New Password" value={newPw} onChange={setNewPw} type="password" />
        <Field label="Confirm New Password" value={confirm} onChange={setConfirm} type="password" />
      </div>

      {/* 2FA */}
      <div className="rounded-lg border border-border-dark bg-bg-dark p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-icons text-primary">security</span>
            <div>
              <p className="text-sm font-medium text-heading">Two-Factor Authentication</p>
              <p className="text-xs text-muted">Add an extra layer of security</p>
            </div>
          </div>
          <button className="rounded-lg border border-primary/30 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors">
            Enable
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all">
          Update Password
        </button>
      </div>
    </div>
  );
}

// ─── Notifications ───
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    workflowSuccess: true,
    workflowFailure: true,
    weeklyDigest: false,
    securityAlerts: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "workflowSuccess", label: "Workflow Success", desc: "Notify when a workflow completes successfully" },
    { key: "workflowFailure", label: "Workflow Failure", desc: "Notify when a workflow encounters an error" },
    { key: "weeklyDigest", label: "Weekly Digest", desc: "Receive a summary of activity every Monday" },
    { key: "securityAlerts", label: "Security Alerts", desc: "Important account security notifications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-heading">Notification Preferences</h2>
        <p className="mt-1 text-sm text-muted">Choose how you want to be notified.</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border border-border-dark bg-bg-dark p-4">
            <div>
              <p className="text-sm font-medium text-heading">{item.label}</p>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
            <button
              onClick={() => toggle(item.key)}
              className={`relative h-6 w-11 rounded-full transition-colors ${prefs[item.key] ? "bg-primary" : "bg-muted/30"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${prefs[item.key] ? "translate-x-5" : ""}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── API Keys ───
function ApiKeysSection() {
  const mockKeys = [
    { name: "Production Key", key: "fsk_prod_••••••••a3f2", created: "Jan 5, 2026" },
    { name: "Development Key", key: "fsk_dev_••••••••9e1c", created: "Feb 12, 2026" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-heading">API Keys & Integrations</h2>
          <p className="mt-1 text-sm text-muted">Manage your API access tokens.</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all">
          <span className="material-icons text-sm">add</span>
          Generate Key
        </button>
      </div>

      <div className="space-y-3">
        {mockKeys.map((k) => (
          <div key={k.name} className="flex items-center justify-between rounded-lg border border-border-dark bg-bg-dark p-4">
            <div className="flex items-center gap-3">
              <span className="material-icons text-primary">vpn_key</span>
              <div>
                <p className="text-sm font-medium text-heading">{k.name}</p>
                <p className="font-mono text-xs text-muted">{k.key}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted">Created {k.created}</span>
              <button className="text-error hover:text-error/80 transition-colors">
                <span className="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
        <div className="flex items-start gap-2">
          <span className="material-icons text-sm text-primary mt-0.5">info</span>
          <p className="text-xs text-body leading-relaxed">
            API keys provide full access to your account. Keep them secure and never share them publicly.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Field ───
function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-heading outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
}
