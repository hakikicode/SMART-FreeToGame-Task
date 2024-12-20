import { namespaceWrapper } from "@_koii/namespace-wrapper";
import axios from "axios";
import { COD_API_BASE, API_KEY } from "./0-setup.js";

// Fetch Player Stats by Gamer Tag
const fetchPlayerStats = async (platform, gamerTag) => {
  try {
    const encodedTag = encodeURIComponent(gamerTag);
    const response = await axios.get(`${COD_API_BASE}/warzone/profile/${platform}/${encodedTag}`, {
      headers: { "TRN-Api-Key": API_KEY },
    });

    if (response.data?.data) {
      return response.data.data;
    } else {
      throw new Error(`No data found for gamer tag: ${gamerTag}`);
    }
  } catch (error) {
    console.error(`Error fetching stats for ${gamerTag}:`, error.response?.data || error.message);
    return null; // Graceful error handling
  }
};

// Preprocess Stats
const preprocessStats = (data) => ({
  gamerTag: data?.platformUserHandle || "Unknown",
  kills: data?.stats?.kills?.value || 0,
  matchesPlayed: data?.stats?.matchesPlayed?.value || 0,
  wins: data?.stats?.wins?.value || 0,
  killDeathRatio: data?.stats?.kdRatio?.value || 0,
  timestamp: new Date().toISOString(),
});

// Main Task Logic
export async function task(roundNumber) {
  try {
    console.log(`Executing SMART Task for round ${roundNumber}...`);

    const gamerTags = [
      { platform: "psn", tag: "Player1" },
      { platform: "xbl", tag: "Player2" },
      { platform: "battle", tag: "Player3" },
    ]; // Replace with dynamic tags
    const statsData = [];

    for (const { platform, tag } of gamerTags) {
      const data = await fetchPlayerStats(platform, tag);
      if (data) statsData.push(preprocessStats(data));
    }

    if (statsData.length === 0) {
      console.warn("No stats data fetched. Storing an empty array.");
      await namespaceWrapper.storeSet(`round_${roundNumber}_codStats`, JSON.stringify([]));
      return;
    }

    await namespaceWrapper.storeSet(`round_${roundNumber}_codStats`, JSON.stringify(statsData));
    console.log("Call of Duty stats data stored successfully:", statsData);
  } catch (error) {
    console.error("Error executing SMART Task:", error.message);
  }
}
