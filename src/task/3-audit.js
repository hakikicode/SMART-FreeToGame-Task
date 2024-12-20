import { namespaceWrapper } from "@_koii/namespace-wrapper";
import crypto from "crypto";

function hashData(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

export async function audit(submission, roundNumber, submitterKey) {
  console.log(`Auditing submission for round ${roundNumber} from ${submitterKey}`);

  try {
    const storedData = await namespaceWrapper.storeGet(`round_${roundNumber}_codStats`);
    const storedHashes = JSON.parse(await namespaceWrapper.storeGet(`round_${roundNumber}_submittedHashes`) || "[]");

    if (!storedData) {
      console.warn("No stored data found for this round.");
      return false;
    }

    const parsedSubmission = JSON.parse(submission);
    const submissionHash = hashData(submission);

    const isDuplicate = storedHashes.includes(submissionHash);
    const isValid = JSON.stringify(parsedSubmission) === storedData;

    console.log(`Audit result: ${isValid && !isDuplicate ? "Valid" : "Invalid or Duplicate"}`);
    return isValid && !isDuplicate;
  } catch (error) {
    console.error("Audit error:", error.message);
    return false;
  }
}
