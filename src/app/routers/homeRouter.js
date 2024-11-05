import { Router } from "express";
import tmdbService from "services/tmdbService.js";

const getHomeRouter = () => {
  const router = Router();

  router.get("/homepage", async (_req, res) => {
    const trendingData = await tmdbService
      .getTrending({ range: "week", mediaType: "all" })
      .then((data) => {
        return data.results.slice(0, 5);
      })
      .catch((error) => {
        console.error("Error fetching trending data:", error.message);
        res.status(500).json({ error: "Failed to fetch trending data" });
      });

    res.render("homepage", {
      username: res.locals.username,
      trendingData: trendingData,
    });
  });

  router.get("/whoami", (_req, res) => {
    res.send(`Hello user: ${res.locals.username}`);
  });

  return router;
};

export default {
  getRouter: getHomeRouter,
  needsAuthentication: true,
};
