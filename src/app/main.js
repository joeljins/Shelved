import express from "express";
import swaggerDocs from "./swagger.js";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import { authMiddleware } from "middlewares/authMiddleware.js";

//Routers
import getLandingRouter from "routers/landingRouter.js";
import getAuthRouter from "routers/api/auth/authRouter.js";
import getBaseRouter from "routers/p/baseRouter.js";
import getShelfRouter from "routers/p/api/shelf/shelfRouter.js";
import getSearchRouter from "routers/p/api/search/searchRouter.js";

const port = 3000;
const hostname = "0.0.0.0";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./views");

//routes
app.use("/", getLandingRouter());
app.use("/api/auth", getAuthRouter());

//routes protected
app.use("/p/", authMiddleware);
app.use("/p/", getBaseRouter());

// API routes
app.use("/p/api/search", getSearchRouter())
app.use("/p/api/shelf", getShelfRouter());

if (Deno.env.get("ENV") === "development") {
  app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));
}

app.listen(port, hostname, () => {
  console.log(`Listening at: http://${hostname}:${port}`);
});
