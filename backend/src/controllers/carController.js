import carModel from "../models/carModel.js";

const getAllCars = async (req, res) => {
    try {
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
        } = req.query;

        const cars = await carModel.getAllCars({
            search,
            fuelType,
            transmission,
            seatingCapacity,
            minPrice,
            maxPrice,
            sort,
            page,
            limit
        });

        return res.status(200).json({
            success: true,
            page: Number(page),
            limit: Number(limit),
            count: cars.length,
            cars
        });

    } catch (error) {
        console.error("Get Cars Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cars"
        });
    }
};

const getCarById = async (req, res) => {
    try {
        const { id } = req.params;

        const car = await carModel.getCarById(id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found"
            });
        }

        return res.status(200).json({
            success: true,
            car
        });

    } catch (error) {
        console.error("Get Car Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch car"
        });
    }
};

export  {
    getAllCars,
    getCarById
};