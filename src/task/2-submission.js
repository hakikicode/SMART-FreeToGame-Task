import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function submission(roundNumber) {
  try {
    console.log(`Submitting data for round ${roundNumber}...`);
    
    const gamesDataKey = `round_${roundNumber}_gamesData`;
    const gamesData = await namespaceWrapper.storeGet(gamesDataKey);

    if (!gamesData) {
      console.warn(`No games data found for key: ${gamesDataKey}. Skipping submission.`);
      return {}; // Ensure submission does not fail entirely.
    }

    const submissionPayload = JSON.stringify({ data: gamesData });
    console.log(`Submitting payload: ${submissionPayload}`);

    await namespaceWrapper.submitTask(submissionPayload);
    console.log(`Submission successful for round ${roundNumber}.`);
  } catch (error) {
    console.error(`Error during submission for round ${roundNumber}: ${error.message}`);
  }
}
