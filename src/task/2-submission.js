import crypto from "crypto"; // For hashing
import { namespaceWrapper } from "@_koii/namespace-wrapper";

function hashData(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

export async function submission(roundNumber) {
  try {
    console.log(`Submitting data for round ${roundNumber}`);
    const storedData = await namespaceWrapper.storeGet(`round_${roundNumber}_codStats`);
    if (!storedData) {
      console.warn("No stats data available for submission.");
      return "{}";
    }

    const dataHash = hashData(storedData);
    const submittedHashes = JSON.parse(await namespaceWrapper.storeGet(`round_${roundNumber}_submittedHashes`) || "[]");

    if (submittedHashes.includes(dataHash)) {
      console.warn("Duplicate submission detected. Skipping.");
      return "{}"; // Skip submission
    }

    submittedHashes.push(dataHash);
    await namespaceWrapper.storeSet(`round_${roundNumber}_submittedHashes`, JSON.stringify(submittedHashes));

    console.log("Data submitted successfully:", storedData);
    return storedData;
  } catch (error) {
    console.error("Submission error:", error.message);
    return "{}";
  }
}
