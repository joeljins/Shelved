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
    const apiKey = process.env.TMDB_API_KEY;
    const movie = req.query.query;

    if (!movie || movie.trim() === "") {
      return res.status(400).json({ message: "Query parameter 'query' is required" });
    }

    const url = `https://api.themoviedb.org/3/search/movie?query=${movie}&api_key=${apiKey}`;
    console.log("Client requested /api/movies/search with query:", movie);

    try {
      const response = await axios(url);
      console.log("API response received with status:", response.status);

      const data = response.data.results;
      if (!data) {
        return res.status(404).json({ message: "No movies found" });
      }

      const filtered_data = data.slice(0, 5).map(item => ({
        name: item.title,
        author: item.release_date,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      }));

      console.log("Filtered data:", filtered_data);
      res.json(filtered_data);
    } catch (error) {
      console.error("Error fetching from TMDb API:", error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  return router;
};

export default getSearchRouter;
