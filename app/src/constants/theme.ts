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
} as const;
