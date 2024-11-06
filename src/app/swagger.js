import swaggerAutogen from "swagger-autogen";
import { join } from "path";
import { getRouteDetails } from "utils/common.js";

const doc = {
  info: {
    title: "Shelved API Refernce",
    description: "All the api exists here",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
};

const routesDir = join(Deno.cwd(), "app", "routers");
let allPaths = {};

async function swaggerDoc() {
  try {
    const arrayData = await getRouteDetails();

    for (const { path, base, filename } of arrayData) {
      const baseTags = base
        .split("/")
        .filter(Boolean)
        .map((value) => {
          if (value === "p") {
            return "Protected";
          }
          return value.charAt(0).toUpperCase() + value.slice(1);
        });

      const tags = baseTags.length ? baseTags : ["Base"];
      const tempDoc = { ...doc, paths: {} };

      const swaggerData = await swaggerAutogen({
        disableLogs: true,
        writeOutputFile: false,
      })("./swagger.json", [path], doc);

      if (swaggerData?.data?.paths) {
        const prefixedPaths = {};
        for (const [routePath, routeInfo] of Object.entries(
          swaggerData.data.paths,
        )) {
          const fullPath = `${base}${routePath}`.replace(/\/+/g, "/");

          for (const op in routeInfo) {
            routeInfo[op].tags = tags;
          }
          prefixedPaths[fullPath] = routeInfo;
        }
        Object.assign(allPaths, prefixedPaths);
      }
    }
  } catch (error) {
    console.error(`Failed to load route: ${error}`);
  }
}

export default await swaggerDoc()
  .then(() => {
    return { swagger: "2.0", ...doc, paths: allPaths };
  })
  .catch((error) => {
    console.error("Error generating Swagger documentation:", error);
  });
