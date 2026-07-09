const complaintModel = require("../models/complaintModel");
const residentModel = require("../models/residentModel");

async function getReports(req, res) {
  try {
    const counts = await complaintModel.getStatusCounts();
    const monthlyAnalytics = await complaintModel.getMonthlyAnalytics();
    const categoryReports = await complaintModel.getCategoryCounts();
    const priorityReports = await complaintModel.getPriorityCounts();
    const avgResolutionTime = await complaintModel.getAvgResolutionDays();

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const resolved = counts.Resolved;
    const pending = counts.Pending;
    const resolvedRate = total > 0 ? Math.round((resolved / total) * 1000) / 10 : 0;

    res.json({
      stats: {
        totalComplaints: total,
        resolvedCases: resolved,
        pendingCases: pending,
        avgResolutionTime,
        resolvedRate,
        activeCases: total - resolved - (counts.Cancelled ?? 0),
      },
      monthlyAnalytics,
      categoryReports,
      priorityReports,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getReports };
