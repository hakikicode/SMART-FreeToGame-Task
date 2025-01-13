import { namespaceWrapper } from "@_koii/namespace-wrapper";
import axios from "axios";

export async function task(roundNumber) {
  console.log(`Executing FreeToGame Task for round ${roundNumber}...`);
  try {
    // Fetch game data
    const response = await axios.get("https://www.freetogame.com/api/games");
    const gamesData = response.data;

    if (!gamesData || gamesData.length === 0) {
      console.warn("No games data fetched from FreeToGame API.");
      return;
    }

    // Store data with a round-specific key
    const key = `round_${roundNumber}_gamesData`;
    await namespaceWrapper.storeSet(key, JSON.stringify(gamesData));

    // Verify data is stored correctly
    const storedData = await namespaceWrapper.storeGet(key);
    if (!storedData) {
      console.error(`Data verification failed for key: ${key}`);
    } else {
      console.log(`Game data stored successfully for round ${roundNumber}.`);
    }
  } catch (error) {
    console.error("Error fetching games data:", error.message);
  }
}
