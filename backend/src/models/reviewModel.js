import { db } from "../config/db.js";

const createReview = async (
    userId,
    carId,
    rating,
    comment
) => {
    const [result] = await db.query(
        `
        INSERT INTO reviews (
            user_id,
            car_id,
            rating,
            comment
        )
        VALUES (?, ?, ?, ?)
        `,
        [
            userId,
            carId,
            rating,
            comment
        ]
    );

    return result;
};

const getReviewsByCar = async (carId) => {
    const [rows] = await db.query(
        `
        SELECT
            reviews.id,
            reviews.rating,
            reviews.comment,
            reviews.created_at,

            users.id AS user_id,
            users.full_name

        FROM reviews

        INNER JOIN users
            ON reviews.user_id = users.id

        WHERE reviews.car_id = ?

        ORDER BY reviews.created_at DESC
        `,
        [carId]
    );

    return rows;
};

export {
    createReview,
    getReviewsByCar
};