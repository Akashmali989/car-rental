import { db } from "../config/db.js";

const addFavorite = async (userId, carId) => {
    const [result] = await db.query(
        `
        INSERT INTO favorites (user_id, car_id)
        VALUES (?, ?)
        `,
        [userId, carId]
    );

    return result;
};

const getFavorites = async (userId) => {
    const [rows] = await db.query(
        `
        SELECT
            favorites.id AS favorite_id,
            favorites.created_at AS saved_at,

            cars.id AS car_id,
            cars.model,
            cars.registration_number,
            cars.year,
            cars.color,
            cars.fuel_type,
            cars.transmission,
            cars.seating_capacity,
            cars.price_per_day,
            cars.status,
            cars.location,

            car_brands.name AS brand_name

        FROM favorites

        INNER JOIN cars
            ON favorites.car_id = cars.id

        INNER JOIN car_brands
            ON cars.brand_id = car_brands.id

        WHERE favorites.user_id = ?

        ORDER BY favorites.created_at DESC
        `,
        [userId]
    );

    return rows;
};

const removeFavorite = async (userId, carId) => {
    const [result] = await db.query(
        `
        DELETE FROM favorites
        WHERE user_id = ?
        AND car_id = ?
        `,
        [userId, carId]
    );

    return result;
};

export {
    addFavorite,
    getFavorites,
    removeFavorite
};