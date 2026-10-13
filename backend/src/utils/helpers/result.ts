type ResultData = Record<string, unknown>;

interface Success {
  (): { success: true };
  <Data extends ResultData>(data: Data): { success: true } & Data;
}

interface Fail {
  (): { success: false; reason: string };
  (reason: string): { success: false; reason: string };
  <Data extends ResultData>(reason: string, data: Data): { success: false; reason: string } & Data;
}

const success = ((data?: ResultData) => ({
  success: true,
  ...data
})) as Success;

const fail = ((reason?: string, data?: ResultData) => ({
  success: false,
  reason,
  ...data
})) as Fail;

export const Result = {
  success,
  fail
} as const;
