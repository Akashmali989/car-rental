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

const getAllMyBookings = async (userId, status = null) => {
    let query = `
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
            cars.registration_number,
            cars.year,
            cars.color,
            cars.fuel_type,
            cars.transmission,
            cars.seating_capacity,
            cars.location,

            car_brands.name AS brand_name

        FROM bookings

        INNER JOIN cars
            ON bookings.car_id = cars.id

        INNER JOIN car_brands
            ON cars.brand_id = car_brands.id

        WHERE bookings.user_id = ?
    `;

    const params = [userId];

    if (status) {
        query += ` AND bookings.status = ?`;
        params.push(status);
    }

    query += ` ORDER BY bookings.created_at DESC`;

    const [rows] = await db.query(query, params);

    return rows;
};

const getBookingById = async (bookingId, userId) => {
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
            cars.registration_number,
            cars.year,
            cars.color,
            cars.fuel_type,
            cars.transmission,
            cars.seating_capacity,
            cars.location,

            car_brands.name AS brand_name

        FROM bookings

        INNER JOIN cars
            ON bookings.car_id = cars.id

        INNER JOIN car_brands
            ON cars.brand_id = car_brands.id

        WHERE bookings.id = ?
        AND bookings.user_id = ?
        `,
        [bookingId, userId]
    );

    return rows[0];
};

const cancelBooking = async (bookingId, userId) => {
    const [result] = await db.query(
        `
        UPDATE bookings
        SET status = 'CANCELLED'
        WHERE id = ?
        AND user_id = ?
        AND status IN ('PENDING', 'CONFIRMED')
        `,
        [bookingId, userId]
    );

    return result;
};

export { getCarForBooking, checkCarAvailability, createNewBooking, getAllMyBookings, getBookingById, cancelBooking };