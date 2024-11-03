import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.redirect("/login");
});

router.get("/login", (_req, res) => {
  res.render("login");
});

router.get("/signup", (_req, res) => {
  res.render("signup");
});

export default { router: router, base: "/", needsAuthentication: false };
