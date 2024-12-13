const { Socket } = require("socket.io");
const { io } = require("../index")
const Rider = require('../Models/Rider');
const Assets = require("../Models/Assets");

const getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find();
    res.status(200).json(riders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch riders', error });
  }
};

const getRiderById = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    res.status(200).json(rider);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rider', error });
  }
};

const createRider = async (req, res) => {
  try {
    const { name, phone, vehicle, cabNumber,vendorName } = req.body;

    const newRider = new Rider({
      name,
      phone,
      vehicle,
      cabNumber,
      vendorName
    });

    await newRider.save();
    res.status(201).json(newRider);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create rider', error });
  }
};

// Update rider details
const updateRider = async (req, res) => {
  try {
    const { name, phone, vehicle, cabNumber,vendorName } = req.body;

    const rider = await Rider.findByIdAndUpdate(
      req.params.id,
      { name, phone, vehicle, cabNumber,vendorName},
      { new: true }
    );

    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    res.status(200).json(rider);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update rider', error });
  }
};

// Delete a rider
const deleteRider = async (req, res) => {
  try {
    const rider = await Rider.findByIdAndDelete(req.params.id);
    if (!rider) {
      return res.status(404).json({ message: 'Rider not found' });
    }
    res.status(200).json({ message: 'Rider deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete rider', error });
  }
};

// Fetch all active riders with pagination
const getActiveRiders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const activeRiders = await Rider.find({ status: 'active' })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Rider.countDocuments({ status: 'active' }); 

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      totalRiders: total,
      riders: activeRiders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch active riders', error: error.message });
  }
};

// Fetch all expired riders with pagination
const getExpiredRiders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default values for pagination
    const expiredRiders = await Rider.find({ status: 'expired' })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Rider.countDocuments({ status: 'expired' }); // Total count for expired riders

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      totalRiders: total,
      riders: expiredRiders,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expired riders', error: error.message });
  }
};

// Start a ride
const startRide = async (req, res) => {
  const { service, cabNumber } = req.body;

  try {
    if (!cabNumber || !service) {
      return res.status(400).json({ message: "Cab number and service are required" });
    }

    console.log("Start Ride - Request Body:", req.body);

    const updatedRider = await Rider.findOneAndUpdate(
      { cabNumber : cabNumber },
      { status: "active", service },
      { new: true }
    );

    if (!updatedRider) {
      console.log("No rider updated, check the query and conditions");
      return res.status(404).json({ message: "Rider not found" });
    }

    console.log("Ride successfully started for:", updatedRider);

    await emitRiderUpdates();

    return res.status(200).json({
      message: "Ride started successfully",
      updatedRider,
    });
  } catch (error) {
    console.error("Error in startRide:",error.stack || error.message || error);
    res.status(500).json({ message: "Failed to start ride", error: error.message });
  }
};

// Stop a ride
const stopRide = async (req, res) => {

  const { cabNumber } = req.body;
  
  console.log("Stop Ride - Request Body:", req.body);
  try {
    if (!cabNumber) {
      return res.status(400).json({ message: "Cab number is required" });
    }

    const updatedRider = await Rider.findOneAndUpdate(
      { cabNumber },
      { status: "expired", service: null },
      { new: true }
    );

    if (!updatedRider) {
      console.log("No rider found, check the query and conditions");
      return res.status(404).json({ message: "Rider not found" });
    }
    console.log("Updated Rider:", updatedRider);
    await emitRiderUpdates();
    return res.status(200).json({
      message: "Ride stopped successfully",
      updatedRider,
    });
  } catch (error) {
    console.error("Error in stopRide:", error);
    return res.status(500).json({
      message: "Internal server error",
      error
    });
  }
};

// Helper function to emit real-time updates
const emitRiderUpdates = async () => {
  try {
    const activeRiders = await Rider.find({ status: "active" });
    const expiredRiders = await Rider.find({ status: "expired" });
    console.log("Emitting real-time updates:", { activeRiders, expiredRiders });
    io.emit("updateRiders", { activeRiders, expiredRiders });
  } catch (error) {
    console.error("Error during real-time updates:", error);
  }
};



const InsertAssets = async (req, res) => {
  try {
    const { chat_data } = req.body;

    if (!chat_data) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. 'chat_data' is required.",
      });
    }

    // Extract fields from chat_data and custom_fields
    const DriverName = chat_data.name;
    const phone = chat_data.waba;
    const cabNumber = chat_data.custom_fields.find(field => field.id === "vehicle_details")?.value || "";
    const vendorName = chat_data.custom_fields.find(field => field.id === "vendor_name")?.value || "";

    // Validate extracted fields
    if (!DriverName || !phone || !cabNumber || !vendorName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: DriverName, cabNumber, vendorName, or phone.",
      });
    }

    // Create a new instance of the Assets model
    const data = new Assets({
      DriverName,
      cabNumber,
      vendorName,
      phone,
    });

    // Save the data to the database
    const savedData = await data.save();

    // Respond with the saved data
    res.status(201).json({
      success: true,
      message: "Asset created successfully",
      data: savedData,
    });
  } catch (error) {
    // Handle duplicate cabNumber errors or other database errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate cabNumber detected. Each cabNumber must be unique.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create asset",
      error: error.message,
    });
  }
};








module.exports = {
  getAllRiders,
  getRiderById,
  createRider,
  updateRider,
  deleteRider,
  startRide,
  stopRide,
  getActiveRiders,
  getExpiredRiders,
  InsertAssets
};
