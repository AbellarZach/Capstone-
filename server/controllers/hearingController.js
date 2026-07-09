const hearingModel = require("../models/hearingModel");
const complaintModel = require("../models/complaintModel");
const pool = require("../database/db");

async function getScheduled(req, res) {
  try {
    const hearings = await hearingModel.findScheduled();
    res.json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getByComplaint(req, res) {
  try {
    const hearings = await hearingModel.findByComplaintId(req.params.complaintId);
    res.json(hearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function create(req, res) {
  try {
    const { complaintId, hearingNumber, hearingDate, hearingTime, venue, witnesses, mediationNotes, outcome } = req.body;

    const previousNotes = await hearingModel.getPreviousNotes(complaintId);
    const nextNumber = hearingNumber || (await hearingModel.getNextHearingNumber(complaintId));

    const hearing = await hearingModel.create({
      complaintId,
      hearingNumber: nextNumber,
      hearingDate,
      hearingTime,
      venue,
      witnesses: witnesses?.filter(Boolean) ?? [],
      mediationNotes,
      previousNotes,
      status: outcome === "scheduled" ? "Scheduled" : "Completed",
    });

    let newStatus;
    if (outcome === "resolved") newStatus = "Resolved";
    else if (outcome === "forwarded") newStatus = "Unsettled";
    else if (outcome === "scheduled") newStatus = "Scheduled";
    else newStatus = "In Progress";

    await complaintModel.updateStatus(complaintId, newStatus);

    if (outcome === "scheduled" && hearingDate) {
      await hearingModel.create({
        complaintId,
        hearingNumber: nextNumber + 1,
        hearingDate,
        hearingTime,
        venue,
        status: "Scheduled",
      });
    }

    await pool.query(
      "INSERT INTO activity_logs (action, entity_type, entity_id, details) VALUES ($1,$2,$3,$4)",
      ["create_hearing", "hearing", hearing.id, JSON.stringify({ outcome, complaintId })]
    );

    res.status(201).json(hearing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getScheduled, getByComplaint, create };
