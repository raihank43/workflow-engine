export interface TestResult {
  status: number;
  success: boolean;
  data: Record<string, unknown>;
  integration: string;
  execution_time: number;
}

export const mockTestResultSuccess: TestResult = {
  status: 200,
  success: true,
  data: {
    message_id: "TS12938401",
    channel: "C012AB3CD",
    ts: "1634567890.123456",
  },
  integration: "slack_v2",
  execution_time: 242,
};

export const mockTestResultError: TestResult = {
  status: 401,
  success: false,
  data: {
    error: "invalid_auth",
    message: "Authentication token is invalid or expired",
  },
  integration: "slack_v2",
  execution_time: 89,
};
