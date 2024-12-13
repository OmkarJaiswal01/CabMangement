const Teams = require("../Models/TeamsModel");
const PostName=require("../Models/PostNameModel")
const bcrypt = require("bcrypt");
const randomString=require("randomstring");
const nodemailer = require("nodemailer");
const config=require("../config/config")
const AdminAuthantication =require("../Models/AdminAuthanticationModel")
const jwt = require('jsonwebtoken'); // Make sure to import jwt

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log("Error hashing password:", error.message);
  }
};

const sendVerifyMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      auth: {
        user: config.emailuser,
        pass: config.emailPassword,
      },
      secure: false,
      tls: {
        ciphers: 'TLSv1.2',
      },
      debug: true,
    });

    const mailOptions = {
      from: config.emailuser,
      to: email,
      subject: "Verification Email",
      html: `<p>Hello ${name}, please click here to <a href="http://localhost:3000/email-verified?id=${user_id}">verify</a> your email.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email has been sent:", info.response);
  } catch (error) {
    console.log("Error while sending email:", error.message);
  }
};

const AdminSignUp = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);

    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.mno ||
      !req.file ||
      !req.body.password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = new AdminAuthantication({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mno,
      image: req.file.filename,
      password: spassword,
      is_verified: 0,
      is_admin: 0,
    });

    const userData = await user.save();

    if (userData) {
      sendVerifyMail(req.body.name, req.body.email, userData._id);
      res.status(200).json({
        message: "Registration successful. Please verify your email.",
      });
    } else {
      res.status(500).json({ message: "Registration failed." });
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

const verifyMail = async (req, res) => {
  try {
    const userId = req.query.id;

    const user = await AdminAuthantication.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "No user found with the provided ID." });
    }

    if (user.is_verified) {
      return res.status(200).json({ message: "User is already verified." });
    }

    const updateInfo = await AdminAuthantication.updateOne(
      { _id: userId },
      { $set: { is_verified: 1 } }
    );

    if (updateInfo.modifiedCount === 1) {
      return res.status(200).json({ message: "Email Verified Successfully." });
    } else {
      return res.status(400).json({ message: "Failed to update user verification status." });
    }
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "An error occurred during verification." });
  }
};


const AdminSignIn = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await AdminAuthantication.findOne({ email: email });

    if (userData) {
      //here campare the provide password to user and save password both are same
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_verified === 0) {
          res.json({ message: "Please verify your email." });
        } else {
          res.json({ message: "Login Successful",userId: userData._id  });
          
        }
      } else {
        res.status(500).json({ message: "Invalid UserId and Password." });
      }
    } else {
      res.status(500).json({ message: "Invalid UserId and Password." });
    }
  } catch (error) {
    console.log(error.message);
  }
};




const InsertTeams = async (req, res) => {
  try {
    console.log("Full request body received:", req.body);

    const { teams, DepartmentId, BusinessUnitId } = req.body;

    if (!teams) {
      return res.status(400).json({ message: "Teams field is required." });
    }

    if (!DepartmentId) {
      return res.status(400).json({ message: "DepartmentId field is required." });
    }

    if (!BusinessUnitId) {
      return res.status(400).json({ message: "BusinessUnitId field is required." });
    }

    const data = new Teams({ teams, DepartmentId, BusinessUnitId });
    await data.save();

    res.status(201).json({
      message: "Teams inserted successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error inserting teams",
      error: error.message,
    });
  }
};




const getTeamsDetails = async (req, res) => {
  try {
    const teams = await Teams.find()
      .populate('DepartmentId') // Populate department details
      .populate('BusinessUnitId'); // Populate business unit details

    if (!teams || teams.length === 0) {
      return res.status(404).json({
        message: "No teams found",
      });
    }

    res.status(200).json({
      message: "Teams retrieved successfully",
      teams,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching teams",
      error: error.message,
    });
  }
};

//get Particular Team Information according to Team 

// Endpoint to get team details by teamId
const getTeamInfo= async (req, res) => {
  const { teamId } = req.params;

  try {
    // Fetch team details with related Department and BusinessUnit data
    const teamDetails = await Teams.findById(teamId)
      .populate('DepartmentId') // Populate Department details
      .populate('BusinessUnitId'); // Populate BusinessUnit details

    if (!teamDetails) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(teamDetails);
  } catch (error) {
    console.error('Error feching team details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getTeamAccDepartment = async (req, res) => {
  const { DepartmentId } = req.params;
  console.log(`Fetching teams for department ID: ${DepartmentId}`);

  try {
      const teams = await Teams.find({ DepartmentId }).populate("DepartmentId");
      if (!teams || teams.length === 0) {
          return res.status(404).json({ message: "No teams found" });
      }
      res.status(200).json(teams);
  } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Error fetching teams", error: error.message });
  }
};



const InsertPosition = async (req, res) => {
  try {
    const { postName, teamId, BusinessUnitId, DepartmentId, LocationId,jobType,NoOfJob,skills ,descriptions,postedBy} = req.body;

    // Validate the existence of required fields
    if (!teamId || !postName || !BusinessUnitId || !DepartmentId || !LocationId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate the existence of the Team
    const team = await Teams.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Create a new PostName with references
    const data = new PostName({
      postName,
      teamId: team._id,
      BusinessUnitId, // Save the Business Unit ID
      DepartmentId, // Save the Department ID
      LocationId ,// Save the Location ID
      jobType,
      NoOfJob,
      skills,
      descriptions,
      postedBy  // Add the logged-in user ID as postedBy
    });

    // Save the new post name
    await data.save();

    res.status(201).json({
      message: "Post name inserted successfully",
      data,
    });
  } catch (error) {
    console.error("Error inserting position:", error);
    res.status(500).json({
      message: "Error inserting position",
      error: error.message,
    });
  }
};

const GetPositions = async (req, res) => {
  try {
    const positions = await PostName.find()
      .populate("teamId", "teams") // Populate team name
      .populate("BusinessUnitId", "BusinessUnit") // Populate business unit name
      .populate("DepartmentId", "Department") // Populate department name   
      .populate("LocationId", "Location") // Populate location name
      .populate("postedBy","name")
     

    res.status(200).json({ positions });
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({
      message: "Error fetching positions",
      error: error.message,
    });
  }
};

const GetPositionsDetails=async(req,res)=>{
  try {
    const positionId = req.params.id;
    
    // Find the position by ID
    const position = await PostName.findById(positionId).populate('teamId').populate('BusinessUnitId').populate('DepartmentId').populate('LocationId') .populate("postedBy","name");
    
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    
    // Return the position data
    res.json(position);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Add this route to your router



module.exports = { AdminSignUp,verifyMail,AdminSignIn, InsertTeams,InsertPosition,getTeamsDetails,getTeamInfo,getTeamAccDepartment,GetPositions,GetPositionsDetails};
