const complaintModel = require("../models/complaintModel");
const pool = require("../database/db");

async function getAll(req, res) {
  try {
    const { search, status, priority, category } = req.query;
    const complaints = await complaintModel.findAll({ search, status, priority, category });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await complaintModel.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getRecent(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const complaints = await complaintModel.findRecent(limit);
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getById(req, res) {
  try {
    const complaint = await complaintModel.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const complaint = await complaintModel.updateStatus(req.params.id, status);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await pool.query(
      "INSERT INTO activity_logs (action, entity_type, entity_id, details) VALUES ($1,$2,$3,$4)",
      ["update_complaint_status", "complaint", req.params.id, JSON.stringify({ status })]
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateRespondent(req, res) {
  try {
    const complaint = await complaintModel.updateRespondent(req.params.id, req.body);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getDashboard(req, res) {
  try {
    const counts = await complaintModel.getStatusCounts();
    const monthlyAnalytics = await complaintModel.getMonthlyAnalytics();

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const statusOverview = [
      { status: "Pending", count: counts.Pending },
      { status: "In Progress", count: counts["In Progress"] },
      { status: "Scheduled", count: counts.Scheduled },
      { status: "Resolved", count: counts.Resolved },
      { status: "Cancelled", count: counts.Cancelled },
      { status: "Unsettled", count: counts.Unsettled },
    ];

    res.json({
      stats: {
        pending: counts.Pending,
        inProgress: counts["In Progress"],
        scheduled: counts.Scheduled,
        resolved: counts.Resolved,
        cancelled: counts.Cancelled,
        unsettled: counts.Unsettled,
        total,
      },
      statusOverview,
      monthlyAnalytics,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function approve(req, res) {
  try {
    const complaint = await complaintModel.updateStatus(req.params.id, "In Progress");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await pool.query(
      "INSERT INTO activity_logs (action, entity_type, entity_id, details) VALUES ($1,$2,$3,$4)",
      ["approve_complaint", "complaint", req.params.id, JSON.stringify({ status: "In Progress" })]
    );

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function reject(req, res) {
  try {
    const complaint = await complaintModel.updateStatus(req.params.id, "Cancelled");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getAll,
  getCategories,
  getRecent,
  getById,
  updateStatus,
  updateRespondent,
  getDashboard,
  approve,
  reject,
};
