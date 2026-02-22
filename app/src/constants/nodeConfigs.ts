import type { NodeType } from "@/types/workflow";

// ─── Field Spec Types ───
export type FieldType = "text" | "select" | "textarea" | "number" | "toggle" | "json" | "tags";

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface StepSpec {
  title: string;
  subtitle: string;
  icon: string;
  fields: FieldSpec[];
  infoBox?: { type: "info" | "tip" | "warning"; text: string };
}

export interface NodeConfigSpec {
  setup: StepSpec;
  config: StepSpec;
  test: StepSpec;
}

// ─── Node Config Specs ───
export const nodeConfigSpecs: Record<NodeType, NodeConfigSpec> = {
  trigger: {
    setup: {
      title: "Setup Trigger",
      subtitle: "Configure the webhook endpoint",
      icon: "bolt",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Webform Trigger" },
        { key: "webhookUrl", label: "Webhook URL", type: "text", placeholder: "https://api.example.com/webhook" },
        { key: "method", label: "HTTP Method", type: "select", options: [
          { value: "POST", label: "POST" },
          { value: "GET", label: "GET" },
          { value: "PUT", label: "PUT" },
        ]},
        { key: "account", label: "Account", type: "select", options: [
          { value: "production", label: "Production" },
          { value: "staging", label: "Staging" },
          { value: "development", label: "Development" },
        ]},
      ],
      infoBox: { type: "info", text: "The webhook URL will be generated after saving. Use it to receive data from external services." },
    },
    config: {
      title: "Configure Trigger",
      subtitle: "Set up authentication and headers",
      icon: "tune",
      fields: [
        { key: "authType", label: "Authentication", type: "select", options: [
          { value: "none", label: "No Auth" },
          { value: "api_key", label: "API Key" },
          { value: "bearer", label: "Bearer Token" },
          { value: "basic", label: "Basic Auth" },
        ]},
        { key: "authValue", label: "Auth Value", type: "text", placeholder: "Enter token or API key" },
        { key: "headers", label: "Custom Headers", type: "json", placeholder: '{"Content-Type": "application/json"}' },
        { key: "payloadFilter", label: "Payload Filter", type: "text", placeholder: "$.data.event_type" },
      ],
      infoBox: { type: "tip", text: "Use JSONPath expressions in Payload Filter to only trigger on specific events." },
    },
    test: {
      title: "Test Trigger",
      subtitle: "Send a sample payload to verify",
      icon: "play_circle",
      fields: [
        { key: "samplePayload", label: "Sample Payload", type: "json", placeholder: '{\n  "event": "user.created",\n  "data": { "id": 1, "name": "John" }\n}' },
      ],
    },
  },

  action: {
    setup: {
      title: "Setup Action",
      subtitle: "Configure the action target",
      icon: "table_view",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Update Spreadsheet" },
        { key: "service", label: "Service", type: "select", options: [
          { value: "google_sheets", label: "Google Sheets" },
          { value: "airtable", label: "Airtable" },
          { value: "notion", label: "Notion" },
          { value: "slack", label: "Slack" },
          { value: "email", label: "Email" },
        ]},
        { key: "account", label: "Account", type: "select", options: [
          { value: "production", label: "Production Account" },
          { value: "staging", label: "Staging Account" },
        ]},
        { key: "resourceId", label: "Resource ID", type: "text", placeholder: "Enter spreadsheet/database ID" },
      ],
      infoBox: { type: "info", text: "Ensure the connected account has appropriate permissions to access the target resource." },
    },
    config: {
      title: "Configure Action",
      subtitle: "Map data and set parameters",
      icon: "tune",
      fields: [
        { key: "operation", label: "Operation", type: "select", options: [
          { value: "create", label: "Create Row" },
          { value: "update", label: "Update Row" },
          { value: "delete", label: "Delete Row" },
          { value: "read", label: "Read Data" },
        ]},
        { key: "column", label: "Target Column", type: "select", options: [
          { value: "user_email", label: "User Email" },
          { value: "plan_type", label: "Plan Type" },
          { value: "signup_date", label: "Signup Date" },
        ]},
        { key: "mapping", label: "Data Mapping", type: "json", placeholder: '{"email": "{{trigger.data.email}}"}' },
      ],
      infoBox: { type: "tip", text: "Use {{node_name.field}} syntax to reference data from previous nodes." },
    },
    test: {
      title: "Test Action",
      subtitle: "Run with sample data",
      icon: "play_circle",
      fields: [
        { key: "sampleData", label: "Test Data", type: "json", placeholder: '{"email": "test@example.com"}' },
      ],
    },
  },

  condition: {
    setup: {
      title: "Setup Condition",
      subtitle: "Define the branching logic",
      icon: "call_split",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Check Plan Type" },
        { key: "sourceField", label: "Source Field", type: "text", placeholder: "{{trigger.data.plan_type}}" },
      ],
    },
    config: {
      title: "Configure Condition",
      subtitle: "Set comparison operators",
      icon: "tune",
      fields: [
        { key: "operator", label: "Operator", type: "select", options: [
          { value: "equals", label: "Equals" },
          { value: "not_equals", label: "Not Equals" },
          { value: "contains", label: "Contains" },
          { value: "greater_than", label: "Greater Than" },
          { value: "less_than", label: "Less Than" },
          { value: "is_empty", label: "Is Empty" },
          { value: "is_not_empty", label: "Is Not Empty" },
        ]},
        { key: "compareValue", label: "Compare Value", type: "text", placeholder: "Enter comparison value" },
        { key: "caseSensitive", label: "Case Sensitive", type: "toggle" },
      ],
    },
    test: {
      title: "Test Condition",
      subtitle: "Test with sample input",
      icon: "play_circle",
      fields: [
        { key: "testInput", label: "Test Input Value", type: "text", placeholder: "Enter a test value" },
      ],
    },
  },

  filter: {
    setup: {
      title: "Setup Filter",
      subtitle: "Configure data filtering",
      icon: "filter_alt",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Filter Active Users" },
        { key: "sourceField", label: "Filter Field", type: "text", placeholder: "{{prev.data.status}}" },
      ],
    },
    config: {
      title: "Configure Filter",
      subtitle: "Define filter rules",
      icon: "tune",
      fields: [
        { key: "condition", label: "Condition", type: "select", options: [
          { value: "equals", label: "Equals" },
          { value: "contains", label: "Contains" },
          { value: "starts_with", label: "Starts With" },
          { value: "regex", label: "Regex Match" },
        ]},
        { key: "value", label: "Filter Value", type: "text", placeholder: "active" },
        { key: "mode", label: "Mode", type: "select", options: [
          { value: "keep", label: "Keep Matching" },
          { value: "remove", label: "Remove Matching" },
        ]},
      ],
    },
    test: {
      title: "Test Filter",
      subtitle: "Verify filter results",
      icon: "play_circle",
      fields: [
        { key: "sampleData", label: "Sample Array", type: "json", placeholder: '[{"status":"active"},{"status":"inactive"}]' },
      ],
    },
  },

  ifelse: {
    setup: {
      title: "Setup If/Else",
      subtitle: "Define conditional branching",
      icon: "call_split",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Route by Region" },
        { key: "conditionField", label: "Condition Field", type: "text", placeholder: "{{prev.data.region}}" },
      ],
    },
    config: {
      title: "Configure If/Else",
      subtitle: "Set branch conditions",
      icon: "tune",
      fields: [
        { key: "operator", label: "Operator", type: "select", options: [
          { value: "equals", label: "Equals" },
          { value: "not_equals", label: "Not Equals" },
          { value: "contains", label: "Contains" },
          { value: "greater_than", label: "Greater Than" },
          { value: "less_than", label: "Less Than" },
        ]},
        { key: "value", label: "Compare Value", type: "text", placeholder: "US" },
        { key: "elseAction", label: "Else Behavior", type: "select", options: [
          { value: "continue", label: "Continue Pipeline" },
          { value: "stop", label: "Stop Execution" },
          { value: "error", label: "Raise Error" },
        ]},
      ],
    },
    test: {
      title: "Test If/Else",
      subtitle: "Verify branch logic",
      icon: "play_circle",
      fields: [
        { key: "testInput", label: "Test Input", type: "text", placeholder: "Enter test value" },
      ],
    },
  },

  switch: {
    setup: {
      title: "Setup Switch",
      subtitle: "Configure multi-way branching",
      icon: "alt_route",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Route by Plan" },
        { key: "switchField", label: "Switch on Field", type: "text", placeholder: "{{prev.data.plan}}" },
      ],
    },
    config: {
      title: "Configure Cases",
      subtitle: "Define switch cases",
      icon: "tune",
      fields: [
        { key: "case1", label: "Case 1 Value", type: "text", placeholder: "free" },
        { key: "case2", label: "Case 2 Value", type: "text", placeholder: "pro" },
        { key: "defaultAction", label: "Default Action", type: "select", options: [
          { value: "continue", label: "Continue" },
          { value: "stop", label: "Stop" },
          { value: "error", label: "Raise Error" },
        ]},
      ],
    },
    test: {
      title: "Test Switch",
      subtitle: "Test case matching",
      icon: "play_circle",
      fields: [
        { key: "testInput", label: "Test Input", type: "text", placeholder: "Enter a value to match" },
      ],
    },
  },

  loop: {
    setup: {
      title: "Setup Loop",
      subtitle: "Configure iteration",
      icon: "loop",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Process Each Item" },
        { key: "arraySource", label: "Array Source", type: "text", placeholder: "{{prev.data.items}}" },
      ],
    },
    config: {
      title: "Configure Loop",
      subtitle: "Set iteration rules",
      icon: "tune",
      fields: [
        { key: "mode", label: "Loop Mode", type: "select", options: [
          { value: "for_each", label: "For Each Item" },
          { value: "while", label: "While Condition" },
          { value: "count", label: "Fixed Count" },
        ]},
        { key: "maxIterations", label: "Max Iterations", type: "number", placeholder: "100", defaultValue: "100" },
        { key: "batchSize", label: "Batch Size", type: "number", placeholder: "1" },
        { key: "continueOnError", label: "Continue on Error", type: "toggle" },
      ],
      infoBox: { type: "warning", text: "Set a reasonable max iterations limit to prevent infinite loops." },
    },
    test: {
      title: "Test Loop",
      subtitle: "Process sample array",
      icon: "play_circle",
      fields: [
        { key: "sampleArray", label: "Sample Array", type: "json", placeholder: '["item1", "item2", "item3"]' },
      ],
    },
  },

  delay: {
    setup: {
      title: "Setup Delay",
      subtitle: "Configure timing",
      icon: "schedule",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Wait 5 Minutes" },
        { key: "delayType", label: "Delay Type", type: "select", options: [
          { value: "fixed", label: "Fixed Duration" },
          { value: "until", label: "Until Date/Time" },
          { value: "cron", label: "Cron Expression" },
        ]},
      ],
    },
    config: {
      title: "Configure Delay",
      subtitle: "Set delay parameters",
      icon: "tune",
      fields: [
        { key: "duration", label: "Duration (seconds)", type: "number", placeholder: "300" },
        { key: "timezone", label: "Timezone", type: "select", options: [
          { value: "UTC", label: "UTC" },
          { value: "US/Eastern", label: "US/Eastern" },
          { value: "US/Pacific", label: "US/Pacific" },
          { value: "Europe/London", label: "Europe/London" },
          { value: "Asia/Tokyo", label: "Asia/Tokyo" },
        ]},
      ],
    },
    test: {
      title: "Test Delay",
      subtitle: "Simulate delay behavior",
      icon: "play_circle",
      fields: [],
    },
  },

  merge: {
    setup: {
      title: "Setup Merge",
      subtitle: "Configure data merging",
      icon: "merge",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Combine Results" },
        { key: "mergeMode", label: "Merge Mode", type: "select", options: [
          { value: "append", label: "Append Arrays" },
          { value: "zip", label: "Zip By Index" },
          { value: "join", label: "Join By Key" },
          { value: "cross", label: "Cross Product" },
        ]},
      ],
    },
    config: {
      title: "Configure Merge",
      subtitle: "Set merge parameters",
      icon: "tune",
      fields: [
        { key: "joinKey", label: "Join Key", type: "text", placeholder: "id" },
        { key: "conflictResolution", label: "Conflict Resolution", type: "select", options: [
          { value: "keep_first", label: "Keep First" },
          { value: "keep_last", label: "Keep Last" },
          { value: "merge_deep", label: "Deep Merge" },
        ]},
      ],
    },
    test: {
      title: "Test Merge",
      subtitle: "Verify merge output",
      icon: "play_circle",
      fields: [
        { key: "input1", label: "Input 1", type: "json", placeholder: '[{"id":1,"name":"Alice"}]' },
        { key: "input2", label: "Input 2", type: "json", placeholder: '[{"id":1,"role":"admin"}]' },
      ],
    },
  },

  transform: {
    setup: {
      title: "Setup Transform",
      subtitle: "Configure data transformation",
      icon: "transform",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Format User Data" },
        { key: "sourceNode", label: "Source Node", type: "text", placeholder: "{{prev}}" },
      ],
    },
    config: {
      title: "Configure Transform",
      subtitle: "Define transformation logic",
      icon: "tune",
      fields: [
        { key: "transformType", label: "Transform Type", type: "select", options: [
          { value: "map", label: "Map Fields" },
          { value: "flatten", label: "Flatten" },
          { value: "group", label: "Group By" },
          { value: "custom", label: "Custom Expression" },
        ]},
        { key: "expression", label: "Transform Expression", type: "json", placeholder: '{\n  "fullName": "{{first}} {{last}}",\n  "email": "{{email | lowercase}}"\n}' },
      ],
      infoBox: { type: "tip", text: "Use pipe operators like | lowercase, | uppercase, | trim for inline transformations." },
    },
    test: {
      title: "Test Transform",
      subtitle: "Preview transformation",
      icon: "play_circle",
      fields: [
        { key: "sampleInput", label: "Sample Input", type: "json", placeholder: '{"first":"John","last":"Doe","email":"JOHN@TEST.COM"}' },
      ],
    },
  },

  http_request: {
    setup: {
      title: "Setup HTTP Request",
      subtitle: "Configure the API endpoint",
      icon: "http",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Fetch User Profile" },
        { key: "url", label: "Request URL", type: "text", placeholder: "https://api.example.com/users" },
        { key: "method", label: "Method", type: "select", options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "PATCH", label: "PATCH" },
          { value: "DELETE", label: "DELETE" },
        ]},
      ],
    },
    config: {
      title: "Configure Request",
      subtitle: "Set headers, body, and auth",
      icon: "tune",
      fields: [
        { key: "headers", label: "Headers", type: "json", placeholder: '{"Authorization": "Bearer {{token}}"}' },
        { key: "body", label: "Request Body", type: "json", placeholder: '{"query": "{{search_term}}"}' },
        { key: "timeout", label: "Timeout (ms)", type: "number", placeholder: "30000", defaultValue: "30000" },
        { key: "retries", label: "Max Retries", type: "number", placeholder: "3", defaultValue: "3" },
      ],
    },
    test: {
      title: "Test Request",
      subtitle: "Execute a sample request",
      icon: "play_circle",
      fields: [
        { key: "sampleVars", label: "Variables", type: "json", placeholder: '{"token": "test_token"}' },
      ],
    },
  },

  error_handler: {
    setup: {
      title: "Setup Error Handler",
      subtitle: "Configure error catching",
      icon: "error_outline",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Handle API Errors" },
        { key: "catchScope", label: "Catch Scope", type: "select", options: [
          { value: "previous", label: "Previous Node" },
          { value: "all", label: "All Upstream" },
          { value: "specific", label: "Specific Nodes" },
        ]},
      ],
    },
    config: {
      title: "Configure Handler",
      subtitle: "Set error handling rules",
      icon: "tune",
      fields: [
        { key: "errorTypes", label: "Error Types", type: "select", options: [
          { value: "all", label: "All Errors" },
          { value: "timeout", label: "Timeout Only" },
          { value: "http", label: "HTTP Errors" },
          { value: "validation", label: "Validation Errors" },
        ]},
        { key: "retryCount", label: "Retry Count", type: "number", placeholder: "3" },
        { key: "retryDelay", label: "Retry Delay (ms)", type: "number", placeholder: "1000" },
        { key: "fallbackAction", label: "Fallback Action", type: "select", options: [
          { value: "skip", label: "Skip & Continue" },
          { value: "stop", label: "Stop Workflow" },
          { value: "notify", label: "Send Notification" },
          { value: "custom", label: "Custom Handler" },
        ]},
      ],
      infoBox: { type: "warning", text: "Error handlers catch failures from upstream nodes and can retry or redirect the flow." },
    },
    test: {
      title: "Test Handler",
      subtitle: "Simulate an error",
      icon: "play_circle",
      fields: [
        { key: "simulateError", label: "Error Type", type: "select", options: [
          { value: "timeout", label: "Timeout" },
          { value: "http_500", label: "HTTP 500" },
          { value: "validation", label: "Validation Error" },
        ]},
      ],
    },
  },

  schedule: {
    setup: {
      title: "Setup Schedule",
      subtitle: "Configure the schedule trigger",
      icon: "schedule",
      fields: [
        { key: "name", label: "Node Name", type: "text", placeholder: "e.g. Daily Report" },
        { key: "scheduleType", label: "Schedule Type", type: "select", options: [
          { value: "interval", label: "Fixed Interval" },
          { value: "cron", label: "Cron Expression" },
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
        ]},
      ],
    },
    config: {
      title: "Configure Schedule",
      subtitle: "Set timing and timezone",
      icon: "tune",
      fields: [
        { key: "cronExpression", label: "Cron Expression", type: "text", placeholder: "0 9 * * MON-FRI" },
        { key: "timezone", label: "Timezone", type: "select", options: [
          { value: "UTC", label: "UTC" },
          { value: "US/Eastern", label: "US/Eastern" },
          { value: "US/Pacific", label: "US/Pacific" },
          { value: "Europe/London", label: "Europe/London" },
          { value: "Asia/Tokyo", label: "Asia/Tokyo" },
        ]},
        { key: "startDate", label: "Start Date", type: "text", placeholder: "2025-01-01" },
        { key: "enabled", label: "Enabled", type: "toggle" },
      ],
      infoBox: { type: "info", text: "Cron format: minute hour day-of-month month day-of-week. Example: '0 9 * * MON-FRI' runs weekdays at 9am." },
    },
    test: {
      title: "Test Schedule",
      subtitle: "Simulate a scheduled run",
      icon: "play_circle",
      fields: [],
    },
  },
};
