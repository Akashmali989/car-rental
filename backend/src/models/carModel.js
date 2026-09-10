import { db } from "../config/db.js";

const getAllCars = async (filters) => {
    const {
        search,
        fuelType,
        transmission,
        seatingCapacity,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10
    } = filters;

    const conditions = [
        `cars.status = 'AVAILABLE'`
    ];

    const values = [];

    // Search by brand or model
    if (search) {
        conditions.push(`
            (
                cars.model LIKE ?
                OR car_brands.name LIKE ?
            )
        `);

        values.push(`%${search}%`);
        values.push(`%${search}%`);
    }

    // Fuel type
    if (fuelType) {
        conditions.push(`cars.fuel_type = ?`);
        values.push(fuelType);
    }

    // Transmission
    if (transmission) {
        conditions.push(`cars.transmission = ?`);
        values.push(transmission);
    }

    // Seating capacity
    if (seatingCapacity) {
        conditions.push(`cars.seating_capacity = ?`);
        values.push(seatingCapacity);
    }

    // Minimum price
    if (minPrice) {
        conditions.push(`cars.price_per_day >= ?`);
        values.push(minPrice);
    }

    // Maximum price
    if (maxPrice) {
        conditions.push(`cars.price_per_day <= ?`);
        values.push(maxPrice);
    }

    // Sorting
    let orderBy = `cars.created_at DESC`;

    if (sort === "price_asc") {
        orderBy = `cars.price_per_day ASC`;
    }

    if (sort === "price_desc") {
        orderBy = `cars.price_per_day DESC`;
    }

    // Pagination
    const offset = (page - 1) * limit;

    const query = `
        SELECT
            cars.id,
            cars.model,
            cars.registration_number,
            cars.year,
            cars.color,
            cars.fuel_type,
            cars.transmission,
            cars.seating_capacity,
            cars.price_per_day,
            cars.price_per_hour,
            cars.mileage,
            cars.description,
            cars.location,
            cars.status,

            car_brands.id AS brand_id,
            car_brands.name AS brand_name,
            car_brands.logo AS brand_logo

        FROM cars

        INNER JOIN car_brands
            ON cars.brand_id = car_brands.id

        WHERE ${conditions.join(" AND ")}

        ORDER BY ${orderBy}

        LIMIT ? OFFSET ?
    `;

    values.push(Number(limit));
    values.push(Number(offset));

    const [rows] = await db.query(query, values);

    return rows;
};

const getCarById = async (id) => {
    const [cars] = await db.query(`
        SELECT
            cars.id,
            cars.model,
            cars.registration_number,
            cars.year,
            cars.color,
            cars.fuel_type,
            cars.transmission,
            cars.seating_capacity,
            cars.price_per_day,
            cars.price_per_hour,
            cars.mileage,
            cars.description,
            cars.location,
            cars.status,

            car_brands.id AS brand_id,
            car_brands.name AS brand_name,
            car_brands.logo AS brand_logo

            COALESCE(AVG(reviews.rating), 0) AS average_rating,
            COUNT(reviews.id) AS review_count

        FROM cars

        INNER JOIN car_brands
            ON cars.brand_id = car_brands.id

        LEFT JOIN reviews
        ON cars.id = reviews.car_id

        WHERE cars.id = ?
        AND cars.status != 'INACTIVE'

        GROUP BY
            cars.id,
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
            car_brands.name;
    `, [id]);

    if (cars.length === 0) {
        return null;
    }

    const [images] = await db.query(`
        SELECT
            id,
            image_url,
            is_primary
        FROM car_images
        WHERE car_id = ?
        ORDER BY is_primary DESC, id ASC
    `, [id]);

    return {
        ...cars[0],
        images
    };
};
export default {
    getAllCars,
    getCarById
};