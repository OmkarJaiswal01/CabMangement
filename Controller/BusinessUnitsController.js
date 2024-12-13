const BusinessUnits = require("../Models/BusinessUnitModel");
const Departments = require("../Models/DepartmentsModel");

const InsertBusinessUnit = async (req, res) => {
    const { BusinessUnit } = req.body;

    if (!BusinessUnit) {
        return res.status(400).json({ message: "Business Unit is required" });
    }

    const dataModel = new BusinessUnits({ BusinessUnit });

    try {
        const data = await dataModel.save();
        res.json({ message: "Business Unit added successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Error adding Business Unit", error: error.message });
    }
};

const getBusinessUnit = async (req, res) => {
    try {
        const businessUnits = await BusinessUnits.find();
        if (!businessUnits.length) {
            return res.status(404).json({ message: "No Business Units found" });
        }
        res.status(200).json({ message: "Business Units retrieved successfully", businessUnits });
    } catch (error) {
        res.status(500).json({ message: "Error fetching Business Units", error: error.message });
    }
};

const getBusinessUnitAcc = async (req, res) => {
    const { businessUnitId } = req.params;

    try {
        const departments = await Departments.find({ businessUnitId }).populate("businessUnitId");
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error: error.message });
    }
};

module.exports = { InsertBusinessUnit, getBusinessUnit, getBusinessUnitAcc };
