import express from "express";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/auth.js";
import routerConfigs from "./routerConfigs.js";
import { join } from "path";

const port = 3000;
const hostname = "0.0.0.0";

const app = express();
app.use(express.json());
app.use(cookieParser());

const authMiddlewareWrap = (req, res, next) => {
  if (req.needAuthentication) {
    const originalSendStatus = res.sendStatus;

    res.sendStatus = (statusCode) => {
      if (statusCode === 403) {
        return res.redirect("/");
      }
      return originalSendStatus.call(res, statusCode);
    };

    authMiddleware(req, res, next);
  } else {
    next();
  }
};

const setNeedAuthentication = (needsAuthentication) => (req, _res, next) => {
  req.needAuthentication = needsAuthentication;
  next();
};

app.set("view engine", "ejs");
app.set("views", "./views");

const routesDir = join(Deno.cwd(), "app", "routes");

try {
  console.log("Loaded routers:");

  for await (const entry of Deno.readDir(routesDir)) {
    if (entry.isFile && entry.name.endsWith(".js")) {
      const modulePath = join(routesDir, entry.name);
      const { default: router } = await import(modulePath);

      if (router && typeof router === "function") {
        const routerConfig = routerConfigs[entry.name] || {};

        app.use(
          routerConfig.base || "/",
          setNeedAuthentication(routerConfig.needsAuthentication || false),
          authMiddlewareWrap,
          router,
        );

        console.log(
          `    Loaded ${entry.name} with base path ${routerConfig.base || "/"}`,
        );
      } else {
        console.warn(`No default export found in ${entry.name}`);
      }
    }
  }
} catch (error) {
  console.error("Error loading routers:", error);
}

app.listen(port, hostname, () => {
  console.log(`Listening at: http://${hostname}:${port}`);
});
