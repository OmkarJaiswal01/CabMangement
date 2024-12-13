const Locations = require("../Models/LocationModel");


const insertLocation = async (req, res) => {
    const { Location,  } = req.body;
  
    // Validate required fields
    if (!Location) {
      return res.status(400).json({ message: "Location is required" });
    }
   
  
    try {
      // Create a new location document
      const data = new Locations({
        Location,
        
      });
  
      // Save the location to the database
      const savedLocation = await data.save();
  
      // Return success response
      res.status(201).json({
        message: "Location inserted successfully",
        data,
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        message: "Failed to insert Location",
        error: error.message,
      });
    }
  };



  const getInsertLocation = async (req, res) => {
    try {
      const locations = await Locations.find(); // Renaming to `locations` for consistency
  
      if (!locations || locations.length === 0) {
        return res.status(404).json({
          message: "No Locations found",
        });
      }
  
      res.status(200).json({
        message: "Locations retrieved successfully",
        locations, // Return as `locations` instead of `Location`
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching Locations",
        error: error.message,
      });
    }
  };
  
  


module.exports={insertLocation,getInsertLocation}