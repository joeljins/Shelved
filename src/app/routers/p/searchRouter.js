import { Router } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const getSearchRouter = () => {
  const router = Router();

  router.get("/search", async (_req, res) => {
    res.render("search");
  });

  router.get("/api/movies/search", async (req, res) => {
    const apiKey = process.env.OMDB_API_KEY || "d564449f";
    const movie = req.query.query;

    if (!movie || movie.trim() === "") {
      return res.status(400).json({ message: "Query parameter 'query' is required" });
    }

    const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${movie}`;
    console.log("Client requested /api/movies/search with query:", movie);

    try {
      const response = await axios(url);
      console.log("API response received with status:", response.status);

      const data = response.data.Search;
      if (!data) {
        return res.status(404).json({ message: "No movies found" });
      }

      const filtered_data = data.slice(0, 5).map(item => ({
        name: item.Title,
        author: item.Year,
        poster: item.Poster,
      }));

      console.log("Filtered data:", filtered_data);
      res.json(filtered_data);
    } catch (error) {
      console.error("Error fetching from OMDb API:", error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  return router;
};

export default getSearchRouter;
