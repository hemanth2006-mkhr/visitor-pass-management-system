import Visitor from "../models/Visitor.js";

export const getVisitorReports = async (req, res) => {
  try {
    const {
      search = "",
      status,
      employee,
      from,
      to,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          visitorName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (employee) {
      query.employee = employee;
    }

    if (from || to) {
      query.visitDate = {};

      if (from) {
        query.visitDate.$gte = new Date(from);
      }

      if (to) {
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);

        query.visitDate.$lte = endDate;
      }
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Number(limit), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Visitor.countDocuments(query);

    const visitors = await Visitor.find(query)
      .populate(
        "employee",
        "employeeId name department designation"
      )
      .populate("createdBy", "email role")
      .populate("approvedBy", "email role")
      .sort({ visitDate: -1 })
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};