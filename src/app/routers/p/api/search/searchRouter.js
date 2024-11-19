import { Router } from "express";
import services from "services/index.js";

const getSearchRouter = () => {
  const router = Router();
  const tmdbService = services["tmdb"];

  router.get("/movie", async (req, res) => {
    const movie = req.query.query;

    if (!movie || movie.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    try {
      const tmdbMovies = await tmdbService.search(movie).catch((error) => {
        console.error("Error fetching TMDB movie:", error.message);
        return []; 
      });

      if (!tmdbMovies || tmdbMovies.total_results === 0) {
        return res.status(404).json({ message: "No movies found" });
      }

      const filteredData = tmdbMovies.results.slice(0, 5).map(item => ({
        name: item.title,
        releaseDate: item.release_date,
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      }));

      res.json(filteredData);
    } catch (error) {
      console.error("Error fetching from TMDb API:", error.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  });

  return router;
};

export default getSearchRouter;
