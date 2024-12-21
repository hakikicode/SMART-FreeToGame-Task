// 1-task.js
import axios from "axios";
import { namespaceWrapper } from "@_koii/namespace-wrapper";
import { setup } from "./0-setup.js";

// Destructure BASE_URL from the setup function
const { BASE_URL } = setup();

// Fetch games data from the FreeToGame API
async function fetchGames(platform = "pc", category = "shooter", sortBy = "popularity") {
  try {
    console.log("Fetching games data from FreeToGame API...");
    const response = await axios.get(
      `${BASE_URL}/games?platform=${platform}&category=${category}&sort-by=${sortBy}`
    );
    console.log("Games data fetched successfully.");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching games data:", error.message);
    return [];
  }
}

// Task function to execute the game data collection and storage
export async function task(roundNumber) {
  try {
    console.log(`Executing FreeToGame Task for round ${roundNumber}...`);

    // Fetch games data
    const gamesData = await fetchGames();

    if (gamesData.length > 0) {
      // Store games data using namespaceWrapper
      const storageKey = `round_${roundNumber}_gamesData`;
      console.log(`Storing games data with key: ${storageKey}`);
      await namespaceWrapper.storeSet(storageKey, JSON.stringify(gamesData));

      console.log(`Game data stored successfully for round ${roundNumber}.`);
    } else {
      console.warn("No games data collected to store.");
    }
  } catch (error) {
    console.error("Task execution error:", error.message);
  }
}
