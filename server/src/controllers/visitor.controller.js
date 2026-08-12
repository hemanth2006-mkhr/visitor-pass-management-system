import Visitor from "../models/Visitor.js";
import Employee from "../models/Employee.js";

import { createActivityLog } from "./activityLog.controller.js";

// Register Visitor
export const registerVisitor = async (req, res) => {
  try {
    const {
      visitorName,
      phone,
      email,
      company,
      purpose,
      employee,
      visitDate,
      expectedArrival,
    } = req.body;

    if (
      !visitorName ||
      !phone ||
      !purpose ||
      !employee ||
      !visitDate ||
      !expectedArrival
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check employee
    const employeeExists = await Employee.findById(employee);

    if (!employeeExists) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employeeExists.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Employee is inactive",
      });
    }

    // Check visit date
    const selectedDate = new Date(visitDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Visit date cannot be in the past",
      });
    }

    // Check duplicate visitor on same day
    const duplicateVisitor = await Visitor.findOne({
      phone,
      visitDate: {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
      },
      status: {
        $nin: ["Cancelled", "Rejected"],
      },
    });

    if (duplicateVisitor) {
      return res.status(400).json({
        success: false,
        message: "Visitor already has a visit scheduled for this date",
      });
    }

    // Check pending request limit
    const pendingCount = await Visitor.countDocuments({
      employee,
      status: "Pending",
    });

    if (pendingCount >= 3) {
      return res.status(400).json({
        success: false,
        message: "Employee already has 3 pending visitor requests",
      });
    }

    const visitor = await Visitor.create({
      visitorName,
      phone,
      email,
      company,
      purpose,
      employee,
      visitDate: selectedDate,
      expectedArrival,
      createdBy: req.user._id,
      status: "Pending",
    });

    const populatedVisitor = await Visitor.findById(visitor._id)
      .populate("employee", "employeeId name email department designation")
      .populate("createdBy", "email role");

    //create activity log for visitor registration
    await createActivityLog({
      user: req.user._id,
      action: "CREATE_VISITOR",
      module: "Visitor",
      description: `Visitor ${visitorName} was registered`,
      visitor: visitor._id,
      employee,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Visitor registered successfully",
      visitor: populatedVisitor,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Visitors
export const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate(
        "employee",
        "employeeId name email department designation"
      )
      .populate("createdBy", "email role")
      .populate("approvedBy", "email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Visitor
export const getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate(
        "employee",
        "employeeId name email department designation"
      )
      .populate("createdBy", "email role")
      .populate("approvedBy", "email role");

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    return res.status(200).json({
      success: true,
      visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Employee Pending Requests
export const getPendingRequests = async (req, res) => {
  try {
    if (!req.user.employee) {
      return res.status(400).json({
        success: false,
        message: "User is not linked to an employee",
      });
    }

    const visitors = await Visitor.find({
      employee: req.user.employee._id,
      status: "Pending",
    })
      .populate(
        "employee",
        "employeeId name email department designation"
      )
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: visitors.length,
      visitors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve Visitor
export const approveVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (!req.user.employee) {
      return res.status(403).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    if (
      visitor.employee.toString() !==
      req.user.employee._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only approve your own visitor requests",
      });
    }

    if (visitor.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Visitor request is already ${visitor.status}`,
      });
    }

    visitor.status = "Approved";
    visitor.remarks = req.body.remarks || "N/A";
    visitor.approvedBy = req.user._id;

    await visitor.save();

    //create activity log for approve visitor
    await createActivityLog({
      user: req.user._id,
      action: "APPROVE_VISITOR",
      module: "Visitor",
      description: "Visitor request approved",
      visitor: visitor._id,
      employee: visitor.employee,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Visitor approved successfully",
      visitor,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject Visitor
export const rejectVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (!req.user.employee) {
      return res.status(403).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    if (
      visitor.employee.toString() !==
      req.user.employee._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only reject your own visitor requests",
      });
    }

    if (visitor.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: `Visitor request is already ${visitor.status}`,
      });
    }

    visitor.status = "Rejected";
    visitor.remarks = req.body.remarks || "";
    visitor.approvedBy = req.user._id;

    await visitor.save();

    //create activity log for reject visitor
    await createActivityLog({
      user: req.user._id,
      action: "REJECT_VISITOR",
      module: "Visitor",
      description: "Visitor request rejected",
      visitor: visitor._id,
      employee: visitor.employee,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Visitor rejected successfully",
      visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check In Visitor
export const checkInVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved visitors can be checked in",
      });
    }

    visitor.status = "Checked-In";
    visitor.checkIn = new Date();

    await visitor.save();

    ////create activity log for visitor check-in
    await createActivityLog({
      user: req.user._id,
      action: "CHECK_IN",
      module: "Visitor",
      description: "Visitor checked in",
      visitor: visitor._id,
      employee: visitor.employee,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Visitor checked in successfully",
      visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Out Visitor
export const checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.status !== "Checked-In") {
      return res.status(400).json({
        success: false,
        message: "Visitor must be checked in before checkout",
      });
    }

    visitor.status = "Checked-Out";
    visitor.checkOut = new Date();

    await visitor.save();

    //create activity log for visitor check-out
    await createActivityLog({
      user: req.user._id,
      action: "CHECK_OUT",
      module: "Visitor",
      description: "Visitor checked out",
      visitor: visitor._id,
      employee: visitor.employee,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Visitor checked out successfully",
      visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel Visitor
export const cancelVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (!["Pending", "Approved"].includes(visitor.status)) {
      return res.status(400).json({
        success: false,
        message: "This visitor cannot be cancelled",
      });
    }

    visitor.status = "Cancelled";

    await visitor.save();

    //create activity log for cancel visitor
    await createActivityLog({
      user: req.user._id,
      action: "CANCEL_VISITOR",
      module: "Visitor",
      description: "Visitor request cancelled",
      visitor: visitor._id,
      employee: visitor.employee,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Visitor cancelled successfully",
      visitor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};