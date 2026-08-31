import {checkCarAvailability, getCarForBooking, createNewBooking, getAllMyBookings} from '../models/bookingModel.js'

const createBooking = async (req, res) => {
    try {
        // Customer ID comes from JWT
        const userId = req.user.id;

        const {
            carId,
            pickupDate,
            returnDate
        } = req.body;

        // Validate required fields
        if (!carId || !pickupDate || !returnDate) {
            return res.status(400).json({
                success: false,
                message: "Car, pickup date and return date are required"
            });
        }

        // Convert dates
        const pickup = new Date(pickupDate);
        const returnTime = new Date(returnDate);

        // Validate date format
        if (
            Number.isNaN(pickup.getTime()) ||
            Number.isNaN(returnTime.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid pickup or return date"
            });
        }

        // Return date must be after pickup
        if (returnTime <= pickup) {
            return res.status(400).json({
                success: false,
                message: "Return date must be after pickup date"
            });
        }

        // Get car information
        const car = await getCarForBooking(carId);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found"
            });
        }

        // Check car status
        if (car.status !== "AVAILABLE") {
            return res.status(409).json({
                success: false,
                message: "Car is currently unavailable"
            });
        }

        // Check date availability
        const isAvailable = await checkCarAvailability(
            carId,
            pickupDate,
            returnDate
        );

        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: "Car is not available for the selected dates"
            });
        }

        // Calculate rental duration
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const differenceInMilliseconds =
            returnTime.getTime() - pickup.getTime();

        const totalDays = Math.ceil(
            differenceInMilliseconds / millisecondsPerDay
        );

        // Get price from database
        const pricePerDay = Number(car.price_per_day);

        // Calculate total amount
        const totalAmount = totalDays * pricePerDay;

        // Create booking
        const result = await createNewBooking(
            userId,
            carId,
            pickupDate,
            returnDate,
            totalDays,
            pricePerDay,
            totalAmount
        );

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: {
                id: result.insertId,
                carId,
                pickupDate,
                returnDate,
                totalDays,
                pricePerDay,
                totalAmount,
                status: "PENDING",
                paymentStatus: "PENDING"
            }
        });

    } catch (error) {
        console.error("Create Booking Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create booking"
        });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await getAllMyBookings(userId);

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get My Bookings Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings"
        });
    }
};

export {
    createBooking,
    getMyBookings
};