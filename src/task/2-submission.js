import crypto from "crypto"; // For hashing
import zlib from "zlib"; // For compression
import { namespaceWrapper } from "@_koii/namespace-wrapper";

// Generate Hash for Data
function hashData(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

// Compress Data
function compressData(data) {
  return zlib.gzipSync(JSON.stringify(data)).toString("base64");
}

// Chunk Data into Smaller Pieces
function chunkData(data, chunkSize) {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}

// Handle Submission
export async function submission(roundNumber) {
  try {
    console.log(`Submitting data for round ${roundNumber}...`);

    // Retrieve stored data
    const dataKey = `round_${roundNumber}_gamesData`;
    const gameData = await namespaceWrapper.storeGet(dataKey);

    if (!gameData) {
      console.warn(`No data found for key: ${dataKey}.`);
      return "{}";
    }

    const parsedData = JSON.parse(gameData);

    // Compress the data to reduce size
    const compressedData = compressData(parsedData);

    // Check if compressed data exceeds the limit
    const maxBytes = 512;
    if (Buffer.byteLength(compressedData, "utf-8") > maxBytes) {
      console.warn("Compressed data exceeds the 512-byte limit. Chunking data...");

      // Chunk the data
      const chunkSize = 500; // Chunk size < 512 bytes
      const chunks = chunkData(compressedData, chunkSize);

      // Store each chunk
      const chunkKeys = [];
      for (const [index, chunk] of chunks.entries()) {
        const chunkKey = `round_${roundNumber}_chunk_${index}`;
        await namespaceWrapper.storeSet(chunkKey, chunk);
        chunkKeys.push(chunkKey);
      }

      console.log("Data successfully chunked and stored:", chunkKeys);

      // Return references to the chunks
      return JSON.stringify(chunkKeys);
    }

    // Generate hash for the data
    const dataHash = hashData(parsedData);

    // Retrieve previously submitted hashes
    const submittedHashesKey = `round_${roundNumber}_submittedHashes`;
    const submittedHashes = JSON.parse(
      (await namespaceWrapper.storeGet(submittedHashesKey)) || "[]"
    );

    // Check for duplicate submission
    if (submittedHashes.includes(dataHash)) {
      console.warn("Duplicate submission detected. Skipping.");
      return "{}"; // Skip submission
    }

    // Add the current data hash to the submitted hashes
    submittedHashes.push(dataHash);
    await namespaceWrapper.storeSet(submittedHashesKey, JSON.stringify(submittedHashes));

    console.log("Data submitted successfully.");
    return compressedData; // Return valid compressed data
  } catch (error) {
    console.error("Submission error:", error.message);
    return "{}"; // Return empty object on error
  }
}
