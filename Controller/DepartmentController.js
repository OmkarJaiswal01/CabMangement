const Departments = require("../Models/DepartmentsModel");

const InsertDepartment = async (req, res) => {
    const { Department, BusinessUnitId } = req.body;

    if (!Department || !BusinessUnitId) {
        return res.status(400).json({ message: "Department and BusinessUnitId are required" });
    }

    try {
        const department = new Departments({ Department, BusinessUnitId });
        const data = await department.save();
        res.status(201).json({ message: "Department added successfully!", data });
    } catch (error) {
        res.status(500).json({ message: "Error adding department", error: error.message });
    }
};

const getDepartment = async (req, res) => {
    try {
        const departments = await Departments.find().populate("BusinessUnitId", "BusinessUnit");
        if (!departments.length) {
            return res.status(404).json({ message: "No departments found" });
        }
        res.status(200).json({ message: "Departments retrieved successfully", departments });
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error: error.message });
    }
};


const getDepartmentAccBusinessUnit = async (req, res) => {
  const { businessUnitId } = req.params;

  try {
      // Ensure matching of `BusinessUnitId` field correctly (case sensitivity)
      const departments = await Departments.find({ BusinessUnitId: businessUnitId }).populate("BusinessUnitId");
      res.status(200).json(departments);
  } catch (error) {
      res.status(500).json({ message: "Error fetching departments", error: error.message });
  }
};


module.exports = { InsertDepartment, getDepartment, getDepartmentAccBusinessUnit };
