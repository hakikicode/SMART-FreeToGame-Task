// 5-routes.js
import { app, namespaceWrapper } from "@_koii/namespace-wrapper";

export function routes() {
  app.get("/games", async (_req, res) => {
    const data = await namespaceWrapper.storeGet("submitted_games_data");
    res.status(200).json({ data: JSON.parse(data || "[]") });
  });
}
