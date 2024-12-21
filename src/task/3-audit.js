import { namespaceWrapper } from "@_koii/namespace-wrapper";
import zlib from "zlib";

// Reconstruct data from chunks
async function reconstructDataFromChunks(chunkKeys) {
  try {
    const reconstructedChunks = [];
    for (const key of chunkKeys) {
      const chunk = await namespaceWrapper.storeGet(key);
      if (!chunk) {
        console.warn(`Missing chunk for key: ${key}`);
        return null; // If any chunk is missing, reconstruction fails
      }
      reconstructedChunks.push(chunk);
    }
    // Combine and decompress the chunks
    const combinedData = reconstructedChunks.join("");
    const decompressedData = zlib.gunzipSync(Buffer.from(combinedData, "base64")).toString("utf-8");
    return decompressedData;
  } catch (error) {
    console.error("Error reconstructing data from chunks:", error.message);
    return null;
  }
}

// Audit function
export async function audit(submission, roundNumber, submitterKey) {
  console.log(`Auditing submission for round ${roundNumber} from ${submitterKey}...`);

  try {
    // Parse the submission to get chunk keys
    const submittedChunkKeys = JSON.parse(submission);

    // Reconstruct the data
    const reconstructedData = await reconstructDataFromChunks(submittedChunkKeys);
    if (!reconstructedData) {
      console.warn("Failed to reconstruct data. Audit invalid.");
      return false;
    }

    // Retrieve stored data
    const storedData = await namespaceWrapper.storeGet(`round_${roundNumber}_gamesData`);
    if (!storedData) {
      console.warn("No stored data found for this round.");
      return false;
    }

    // Compare reconstructed data with stored data
    if (reconstructedData.trim() === storedData.trim()) {
      console.log("Audit result: Valid submission.");
      return true;
    } else {
      console.warn("Audit result: Invalid - Data mismatch.");
      return false;
    }
  } catch (error) {
    console.error("Audit error:", error.message);
    return false;
  }
}
