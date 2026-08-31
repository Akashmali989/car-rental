import { db } from "../config/db.js";

const getCarForBooking = async (carId) => {
    const [rows] = await db.query(
        `
        SELECT
            id,
            price_per_day,
            status
        FROM cars
        WHERE id = ?
        `,
        [carId]
    );

    return rows[0];
};

const checkCarAvailability = async (
    carId,
    pickupDate,
    returnDate
) => {
    const [rows] = await db.query(
        `
        SELECT id
        FROM bookings
        WHERE car_id = ?
        AND status IN ('PENDING', 'CONFIRMED')
        AND pickup_date < ?
        AND return_date > ?
        LIMIT 1
        `,
        [
            carId,
            returnDate,
            pickupDate
        ]
    );

    return rows.length === 0;
};

const createNewBooking = async (
    userId,
    carId,
    pickupDate,
    returnDate,
    totalDays,
    pricePerDay,
    totalAmount
) => {
    const [result] = await db.query(
        `
        INSERT INTO bookings (
            user_id,
            car_id,
            pickup_date,
            return_date,
            total_days,
            price_per_day,
            total_amount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            userId,
            carId,
            pickupDate,
            returnDate,
            totalDays,
            pricePerDay,
            totalAmount
        ]
    );

    return result;
};

const getAllMyBookings = async (userId) => {
    const [rows] = await db.query(
        `
        SELECT
            bookings.id,
            bookings.pickup_date,
            bookings.return_date,
            bookings.total_days,
            bookings.price_per_day,
            bookings.total_amount,
            bookings.status,
            bookings.payment_status,
            bookings.created_at,

            cars.id AS car_id,
            cars.model,
            cars.year,
            cars.color,
            cars.fuel_type,
            cars.transmission,

            car_brands.name AS brand_name

        FROM bookings

        INNER JOIN cars
            ON bookings.car_id = cars.id

        INNER JOIN car_brands
            ON cars.brand_id = car_brands.id

        WHERE bookings.user_id = ?

        ORDER BY bookings.created_at DESC
        `,
        [userId]
    );

    return rows;
};

export { getCarForBooking, checkCarAvailability, createNewBooking, getAllMyBookings };