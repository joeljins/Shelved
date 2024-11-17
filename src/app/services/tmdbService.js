import { Service } from "services/service.js";

export const validMediaTypes = ["all", "movie", "tv", "person"];
export const validRanges = ["day", "week"];

export function validateMediaType(mediaType) {
  if (mediaType !== undefined && !validMediaTypes.includes(mediaType)) {
    throw new Error("Invalid mediaType");
  }
}

export function validateRange(range) {
  if (range !== undefined && !validRanges.includes(range)) {
    throw new Error("Invalid range");
  }
}

export default class TMDBService extends Service {
  constructor(apiKey) {
    super(apiKey);
    this.baseUrl = "https://api.themoviedb.org/3/";
    this.defaultLanguage = "en-US";
  }

  async getTrending({
    range = "day",
    mediaType = "all",
    language = this.defaultLanguage,
  } = {}) {
    validateMediaType(mediaType);
    validateRange(range);

    const path = `trending/${mediaType}/${range}`;
    return await this.fetchData(path, { language });
  }

  getDetailsById(id, mediaType, language = this.defaultLanguage) {
    if (!id) throw new Error("ID is required");
    validateMediaType(mediaType);

    const path = `${mediaType}/${id}`;
    return this.fetchData(path, { language });
  }

  async getMovie(name, language = this.defaultLanguage) {
    if (!name) throw new Error("Name is required");

    const path = `search/movie/${name}`;
    return await this.fetchData(path, { query: name, language });;
  }

}
