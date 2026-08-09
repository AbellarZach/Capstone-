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

async function saveHearing(req, res) {
  try {
    const {
      complaintId,
      hearingNumber,
      hearingDate,
      hearingTime,
      timeConsumed,
      assignedMediator,
      venue,
      witnesses,
      decision,
      mediationNotes,
      complaintStatus,
      status,
    } = req.body;

    if (!complaintId) {
      return res.status(400).json({ message: "complaintId is required" });
    }

    const previousNotes = await hearingModel.getPreviousNotes(complaintId);
    const hearingNum = Number(hearingNumber) || (await hearingModel.getNextHearingNumber(complaintId));

    const hearing = await hearingModel.upsertHearing({
      complaintId,
      hearingNumber: hearingNum,
      hearingDate,
      hearingTime,
      timeConsumed,
      assignedMediator,
      venue,
      witnesses: Array.isArray(witnesses) ? witnesses.filter(Boolean) : [],
      decision,
      mediationNotes,
      previousNotes,
      status: status || "Scheduled",
    });

    if (complaintStatus) {
      await complaintModel.updateStatus(complaintId, complaintStatus);
    }

    await pool.query(
      "INSERT INTO activity_logs (action, entity_type, entity_id, details) VALUES ($1,$2,$3,$4)",
      ["save_hearing", "hearing", hearing.id, JSON.stringify({ complaintId, hearingNumber: hearingNum })]
    );

    res.status(200).json(hearing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getScheduled, getByComplaint, create: saveHearing, saveHearing };
