const mongoose = require('mongoose');
const Team = require('../Models/TeamsModel');

const handleErrorResponse = (res, statusCode, message, error = null) => {
  if (error) console.error(`[Error]: ${error.message || error}`);
  res.status(statusCode).json({ success: false, message });
};

const getAccessTabs = async (req, res) => {
  const { teamId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return handleErrorResponse(res, 400, 'Invalid team ID');
  }

  try {
    const team = await Team.findById(teamId).select('accessTabs');

    if (!team) {
      return handleErrorResponse(res, 404, 'Team not found');
    }

    res.status(200).json({ success: true, accessTabs: team.accessTabs });
  } catch (error) {
    handleErrorResponse(res, 500, 'Failed to fetch access tabs', error);
  }
};

const accessTab = async (req, res) => {
  const { teamId } = req.params;
  const { accessTabs } = req.body;

  // Validate teamId
  if (!mongoose.Types.ObjectId.isValid(teamId)) {
    return handleErrorResponse(res, 400, 'Invalid team ID');
  }

  try {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { accessTabs },
      { new: true, runValidators: true }
    );

    if (!team) {
      return handleErrorResponse(res, 404, 'Team not found');
    }

    res.status(200).json({ success: true, message: 'Access tabs updated successfully', team });
  } catch (error) {
    handleErrorResponse(res, 500, 'Failed to update access tabs', error);
  }
};

module.exports = { getAccessTabs, accessTab };
