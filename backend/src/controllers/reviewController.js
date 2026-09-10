import { db } from "../config/db.js";
import { 
    createReview as createReviewModel,
    getReviewsByCar as getReviewsByCarModel
 } from "../models/reviewModel.js";

const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { carId } = req.params;
        const { rating, comment } = req.body;

        // Validate car ID
        if (!carId) {
            return res.status(400).json({
                success: false,
                message: "Car ID is required"
            });
        }

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        // Check whether customer completed a booking for this car
        const [bookings] = await db.query(
            `
            SELECT id
            FROM bookings
            WHERE user_id = ?
            AND car_id = ?
            AND status = 'COMPLETED'
            LIMIT 1
            `,
            [userId, carId]
        );

        if (bookings.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You can review a car only after completing a booking"
            });
        }

        // Create review
        await createReviewModel(
            userId,
            carId,
            rating,
            comment || null
        );

        return res.status(201).json({
            success: true,
            message: "Review added successfully"
        });

    } catch (error) {
        console.error("Create Review Error:", error);

        // Duplicate review
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "You have already reviewed this car"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to add review"
        });
    }
};

const getReviewsByCar = async (req, res) => {
    try {
        const { carId } = req.params;

        if (!carId) {
            return res.status(400).json({
                success: false,
                message: "Car ID is required"
            });
        }

        const reviews = await getReviewsByCarModel(carId);

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });

    } catch (error) {
        console.error("Get Reviews Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reviews"
        });
    }
};

export {
    createReview,
    getReviewsByCar
};