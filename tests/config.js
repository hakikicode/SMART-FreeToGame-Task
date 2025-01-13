import "dotenv/config";

export const TASK_ID =
  process.env.TASK_ID || "A6utX6vHeG4ToN771qMxmA3mkU6G6ct4VvAdcnCtfnKQ";
export const WEBPACKED_FILE_PATH =
  process.env.WEBPACKED_FILE_PATH || "../dist/main.js";

const envKeywords = process.env.TEST_KEYWORDS ?? "";

export const TEST_KEYWORDS = envKeywords
  ? envKeywords.split(",")
  : ["TEST", "SMART TESTING"];
