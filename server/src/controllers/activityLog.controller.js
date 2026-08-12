import ActivityLog from "../models/ActivityLog.js";

export const createActivityLog = async ({
  user,
  action,
  module,
  description,
  visitor = null,
  employee = null,
  ipAddress = null,
}) => {
  try {
    await ActivityLog.create({
      user,
      action,
      module,
      description,
      visitor,
      employee,
      ipAddress,
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const {
      action,
      module,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (action) {
      query.action = action;
    }

    if (module) {
      query.module = module;
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Number(limit), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await ActivityLog.countDocuments(query);

    const logs = await ActivityLog.find(query)
      .populate("user", "email role")
      .populate(
        "visitor",
        "visitorName phone status visitDate"
      )
      .populate(
        "employee",
        "employeeId name department designation"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};