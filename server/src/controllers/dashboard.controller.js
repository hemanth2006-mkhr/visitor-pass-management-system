import Visitor from "../models/Visitor.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();

    const pendingVisitors = await Visitor.countDocuments({
      status: "Pending",
    });

    const approvedVisitors = await Visitor.countDocuments({
      status: "Approved",
    });

    const checkedInVisitors = await Visitor.countDocuments({
      status: "Checked-In",
    });

    const checkedOutVisitors = await Visitor.countDocuments({
      status: "Checked-Out",
    });

    const rejectedVisitors = await Visitor.countDocuments({
      status: "Rejected",
    });

    const totalEmployees = await Employee.countDocuments();

    const activeEmployees = await Employee.countDocuments({
      status: "Active",
    });

    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      isActive: true,
    });

    res.status(200).json({
      success: true,
      dashboard: {
        visitors: {
          total: totalVisitors,
          pending: pendingVisitors,
          approved: approvedVisitors,
          checkedIn: checkedInVisitors,
          checkedOut: checkedOutVisitors,
          rejected: rejectedVisitors,
        },
        employees: {
          total: totalEmployees,
          active: activeEmployees,
        },
        users: {
          total: totalUsers,
          active: activeUsers,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getReceptionistDashboard = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todayVisitors = await Visitor.countDocuments({
      visitDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const pendingVisitors = await Visitor.countDocuments({
      status: "Pending",
    });

    const approvedVisitors = await Visitor.countDocuments({
      status: "Approved",
    });

    const checkedInVisitors = await Visitor.countDocuments({
      status: "Checked-In",
    });

    const checkedOutVisitors = await Visitor.countDocuments({
      status: "Checked-Out",
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        todayVisitors,
        pendingVisitors,
        approvedVisitors,
        checkedInVisitors,
        checkedOutVisitors,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeeDashboard = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    const employeeId = req.user.employee._id;

    const pendingVisitors = await Visitor.countDocuments({
      employee: employeeId,
      status: "Pending",
    });

    const approvedVisitors = await Visitor.countDocuments({
      employee: employeeId,
      status: "Approved",
    });

    const checkedInVisitors = await Visitor.countDocuments({
      employee: employeeId,
      status: "Checked-In",
    });

    const checkedOutVisitors = await Visitor.countDocuments({
      employee: employeeId,
      status: "Checked-Out",
    });

    const rejectedVisitors = await Visitor.countDocuments({
      employee: employeeId,
      status: "Rejected",
    });

    const recentVisitors = await Visitor.find({
      employee: employeeId,
    })
      .populate(
        "employee",
        "employeeId name department designation"
      )
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        pendingVisitors,
        approvedVisitors,
        checkedInVisitors,
        checkedOutVisitors,
        rejectedVisitors,
        recentVisitors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};