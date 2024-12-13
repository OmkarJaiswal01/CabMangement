const mongoose = require("mongoose");
const AddUser = require("../Models/AddUserModel");
const bcrypt = require('bcrypt');


const inserUser = async (req, res) => {
  const { name, email, password, phone, Currentaddress, PermanentAddress, TeamId, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = new AddUser({ name, email, password: hashedPassword, phone, Currentaddress, PermanentAddress, TeamId, role });
    const newData = await data.save();
    
    return res.status(201).json({ message: "User added successfully", user: newData });
  } catch (error) {
    console.error("Error saving user:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const GetUserAdd = async (req, res) => {
  try {
    const AddUserData = await AddUser.find()
      .populate("TeamId", "accessTabs teams");
    res.status(200).json({ users: AddUserData });
  } catch (error) {
    console.error("Error fetching Users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserById = async (req, res) => {
  try {
    const user = await AddUser.findById(req.params.id).populate("TeamId", "teams")
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// User sign-in with access tabs
const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await AddUser.findOne({ email }).populate("TeamId", "accessTabs"); // Populate accessTabs for the user's team

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send access tabs along with user data
    res.status(200).json({
      message: 'Sign-in successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessTabs: user.TeamId ? user.TeamId.accessTabs : [], // Get accessTabs based on team
        TeamId: user?.TeamId
      }
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateCab = async (req, res) => {
  // const { id } = req.params;
  const { id , cabService } = req.body;
  const userId = new mongoose.Types.ObjectId(id);
   console.log(userId , cabService);
  try {
    // Find the user by ID
    const user = await AddUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cabService = cabService;
    // Save the updated user
    const updatedUser = await user.save();
    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error updating user 123456:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, retypePassword, phone, Currentaddress, PermanentAddress, TeamId, role } = req.body;

  try {
    // Find the user by ID
    const user = await AddUser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided in the request
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.Currentaddress = Currentaddress || user.Currentaddress;
    user.PermanentAddress = PermanentAddress || user.PermanentAddress;
    user.TeamId = TeamId || user.TeamId;
    user.role = role || user.role;

    // Check if password and retypePassword are provided and match
    if (password && retypePassword) {
      if (password !== retypePassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      user.password = await bcrypt.hash(password, 10); // Hash the new password
    }

    // Save the updated user
    const updatedUser = await user.save();
    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const DeleteUser = async (req, res) => {
  try {
    const user = await AddUser.findByIdAndDelete(req.params.id); // Use correct model name here
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { inserUser, GetUserAdd, signIn,getUserById,updateUser,DeleteUser, updateCab };



// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const AddUser = require("../Models/AddUserModel");

// // Helper function for error responses
// const handleErrorResponse = (res, statusCode, message, error = null) => {
//   if (error) console.error(`[Error]: ${message} - ${error.message || error}`);
//   return res.status(statusCode).json({ success: false, message });
// };

// // Add a new user
// const inserUser = async (req, res) => {
//   const { name, email, password, phone, Currentaddress, PermanentAddress, TeamId, role } = req.body;

//   if (!name || !email || !password || !phone || !TeamId) {
//     return handleErrorResponse(res, 400, "All required fields must be provided");
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new AddUser({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       Currentaddress,
//       PermanentAddress,
//       TeamId,
//       role,
//     });
//     const newUser = await user.save();
//     return res.status(201).json({ success: true, message: "User added successfully", user: newUser });
//   } catch (error) {
//     handleErrorResponse(res, 500, "Error adding user", error);
//   }
// };

// // Get all users
// const GetUserAdd = async (req, res) => {
//   try {
//     const users = await AddUser.find().populate("TeamId", "accessTabs teams");
//     res.status(200).json({ success: true, users });
//   } catch (error) {
//     handleErrorResponse(res, 500, "Error fetching users", error);
//   }
// };

// // Get user by ID
// const getUserById = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return handleErrorResponse(res, 400, "Invalid user ID");
//   }

//   try {
//     const user = await AddUser.findById(id).populate("TeamId", "teams");
//     if (!user) {
//       return handleErrorResponse(res, 404, "User not found");
//     }
//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     handleErrorResponse(res, 500, "Error fetching user by ID", error);
//   }
// };

// // User sign-in
// const signIn = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return handleErrorResponse(res, 400, "Email and password are required");
//   }

//   try {
//     const user = await AddUser.findOne({ email }).populate("TeamId", "accessTabs");

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return handleErrorResponse(res, 401, "Invalid email or password");
//     }

//     res.status(200).json({
//       success: true,
//       message: "Sign-in successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         accessTabs: user.TeamId ? user.TeamId.accessTabs : [],
//         TeamId: user.TeamId,
//       },
//     });
//   } catch (error) {
//     handleErrorResponse(res, 500, "Error during sign-in", error);
//   }
// };

// // Update user's cab service status
// const updateCab = async (req, res) => {
//   const { id, cabService } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return handleErrorResponse(res, 400, "Invalid user ID");
//   }

//   try {
//     const user = await AddUser.findById(id);
//     if (!user) {
//       return handleErrorResponse(res, 404, "User not found");
//     }

//     user.cabService = cabService;
//     const updatedUser = await user.save();
//     res.status(200).json({ success: true, message: "Cab service updated successfully", user: updatedUser });
//   } catch (error) {
//     handleErrorResponse(res, 500, "Error updating cab service", error);
//   }
// };

// // Update user details
// const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { name, email, password, retypePassword, phone, Currentaddress, PermanentAddress, TeamId, role } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return handleErrorResponse(res, 400, "Invalid user ID");
//   }

//   try {
//     const user = await AddUser.findById(id);
//     if (!user) {
//       return handleErrorResponse(res, 404, "User not found");
//     }

//     user.name = name || user.name;
//     user.email = email || user.email;
//     user.phone = phone || user.phone;
//     user.Currentaddress = Currentaddress || user.Currentaddress;
//     user.PermanentAddress = PermanentAddress || user.PermanentAddress;
//     user.TeamId = TeamId || user.TeamId;
//     user.role = role || user.role;

//     if (password && retypePassword) {
//       if (password !== retypePassword) {
//         return handleErrorResponse(res, 400, "Passwords do not match");
//       }
//       user.password = await bcrypt.hash(password, 10);
//     }

//     const updatedUser = await user.save();
//     res.status(200).json({ success: true, message: "User updated successfully", user: updatedUser });
//   } catch (error) {
//     handleErrorResponse(res, 500, "Error updating user", error);
//   }
// };

// // Delete user
// const DeleteUser = async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return handleErrorResponse(res, 400, "Invalid user ID");
//   }

//   try {
//     const user = await AddUser.findByIdAndDelete(id);
//     if (!user) {
//       return handleErrorResponse(res, 404, "User not found");
//     }
//     res.status(200).json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     handleErrorResponse(res, 500, "Error deleting user", error);
//   }
// };

// module.exports = { inserUser, GetUserAdd, getUserById, signIn, updateCab, updateUser, DeleteUser };
