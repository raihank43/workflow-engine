export const theme = {
  colors: {
    primary: "#5b13ec",
    primaryHover: "rgba(91, 19, 236, 0.9)",
    primaryGlow: "rgba(91, 19, 236, 0.2)",

    background: {
      light: "#f6f6f8",
      dark: "#161022",
      darkDeep: "#0c0816",
    },
    surface: {
      light: "#ffffff",
      dark: "#1a1a1e",
      darkAlt: "rgba(255, 255, 255, 0.03)",
    },
    border: {
      light: "#e2e8f0",
      dark: "#2d2d35",
      primarySubtle: "rgba(91, 19, 236, 0.2)",
    },

    status: {
      success: "#22c55e",
      warning: "#f59e0b",
      error: "#ef4444",
      info: "#3b82f6",
    },

    nodeColors: {
      trigger: "#22c55e",
      action: "#5b13ec",
      condition: "#5b13ec",
      filter: "#3b82f6",
      email: "#f97316",
    },
  },

  canvas: {
    gridSize: 30,
    gridColor: "#2d243d",
    gridDotSize: 1,
  },
} as const;

export const nodeTypeConfig = {
  trigger: {
    icon: "bolt",
    label: "TRIGGER",
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
    labelColor: "text-primary",
  },
  action: {
    icon: "table_view",
    label: "ACTION",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-500",
    labelColor: "text-green-500",
  },
  condition: {
    icon: "call_split",
    label: "CONDITION",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    labelColor: "text-primary",
  },
  filter: {
    icon: "filter_alt",
    label: "FILTER",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-500",
    labelColor: "text-blue-500",
  },
  ifelse: {
    icon: "call_split",
    label: "IF / ELSE",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-500",
    labelColor: "text-purple-500",
  },
  switch: {
    icon: "alt_route",
    label: "SWITCH",
    iconBg: "bg-indigo-500/20",
    iconColor: "text-indigo-500",
    labelColor: "text-indigo-500",
  },
  loop: {
    icon: "loop",
    label: "LOOP",
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-500",
    labelColor: "text-violet-500",
  },
  delay: {
    icon: "schedule",
    label: "DELAY",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
    labelColor: "text-amber-500",
  },
  merge: {
    icon: "merge",
    label: "MERGE",
    iconBg: "bg-sky-500/20",
    iconColor: "text-sky-500",
    labelColor: "text-sky-500",
  },
  transform: {
    icon: "transform",
    label: "TRANSFORM",
    iconBg: "bg-teal-500/20",
    iconColor: "text-teal-500",
    labelColor: "text-teal-500",
  },
  http_request: {
    icon: "http",
    label: "HTTP REQUEST",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-500",
    labelColor: "text-cyan-500",
  },
  error_handler: {
    icon: "error_outline",
    label: "ERROR HANDLER",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-500",
    labelColor: "text-red-500",
  },
  schedule: {
    icon: "schedule",
    label: "SCHEDULE",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-500",
    labelColor: "text-amber-500",
  },
} as const;
