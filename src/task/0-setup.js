import dotenv from "dotenv";
dotenv.config();

const COD_API_BASE = "https://public-api.tracker.gg/v2/cod";
const API_KEY = process.env.COD_API_KEY;

if (!API_KEY) {
  console.error("Missing COD_API_KEY. Please set it in the environment variables.");
  process.exit(1);
}

export { COD_API_BASE, API_KEY };
