import { 
    addFavorite as addFavoriteModel,
    getFavorites as getFavoritesModel,
    removeFavorite as removeFavoriteModel
 } from "../models/favoriteModel.js";

const addFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { carId } = req.params;

        if (!carId) {
            return res.status(400).json({
                success: false,
                message: "Car ID is required"
            });
        }

        await addFavoriteModel(userId, carId);

        return res.status(201).json({
            success: true,
            message: "Car added to favorites"
        });

    } catch (error) {
        console.error("Add Favorite Error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Car is already in favorites"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add favorite"
        });
    }
};

const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;

        const favorites = await getFavoritesModel(userId);

        return res.status(200).json({
            success: true,
            count: favorites.length,
            favorites
        });

    } catch (error) {
        console.error("Get Favorites Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch favorites"
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { carId } = req.params;

        if (!carId) {
            return res.status(400).json({
                success: false,
                message: "Car ID is required"
            });
        }

        const result = await removeFavoriteModel(
            userId,
            carId
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Car is not in your favorites"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Car removed from favorites"
        });

    } catch (error) {
        console.error("Remove Favorite Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove favorite"
        });
    }
};

export {
    addFavorite,
    getFavorites,
    removeFavorite
};