import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoriteController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const favoriteRoutes = express.Router();

favoriteRoutes.post("/:carId", authenticate, addFavorite);
favoriteRoutes.get("/", authenticate, getFavorites);
favoriteRoutes.delete("/:carId", authenticate, removeFavorite);

export default favoriteRoutes;