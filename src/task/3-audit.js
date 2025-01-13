import { namespaceWrapper } from "@_koii/namespace-wrapper";
import zlib from "zlib";

async function reconstructDataFromChunks(chunkKeys) {
  const reconstructedChunks = [];
  for (const key of chunkKeys) {
    const chunk = await namespaceWrapper.storeGet(key);
    if (!chunk) {
      console.warn(`Missing chunk for key: ${key}`);
      return null;
    }
    reconstructedChunks.push(chunk);
  }
  return reconstructedChunks.join("");
}

export async function audit(submission, roundNumber) {
  console.log(`Auditing submission for round ${roundNumber}...`);
  try {
    const submittedKeys = Array.isArray(submission) ? submission : [];
    const reconstructedData = await reconstructDataFromChunks(submittedKeys);

    if (!reconstructedData) {
      console.warn("Failed to reconstruct data from submission.");
      return false;
    }

    const storedData = await namespaceWrapper.storeGet(`round_${roundNumber}_gamesData`);
    if (!storedData) {
      console.warn("No stored data found for this round.");
      return false;
    }

    const decompressedData = zlib.gunzipSync(Buffer.from(reconstructedData, "base64")).toString("utf-8");

    if (decompressedData.trim() === storedData.trim()) {
      console.log("Audit passed: Data matches.");
      return true;
    }

    console.warn("Audit failed: Data mismatch.");
    return false;
  } catch (error) {
    console.error("Audit error:", error.message);
    return false;
  }
}
