const summonModel = require("../models/summonModel");
const complaintModel = require("../models/complaintModel");
const pool = require("../database/db");

async function create(req, res) {
  try {
    const { complaintId, hearingDate, hearingTime, venue, officer, summonNo } = req.body;

    const summon = await summonModel.create({
      complaintId,
      hearingDate,
      hearingTime,
      venue,
      officer,
      summonNo,
    });

    await complaintModel.updateStatus(complaintId, "Scheduled");

    await pool.query(
      "INSERT INTO activity_logs (action, entity_type, entity_id, details) VALUES ($1,$2,$3,$4)",
      ["create_summon", "summon", summon.id, JSON.stringify({ complaintId })]
    );

    res.status(201).json(summon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getByComplaint(req, res) {
  try {
    const summon = await summonModel.findByComplaintId(req.params.complaintId);
    if (!summon) return res.status(404).json({ message: "Summon not found" });
    res.json(summon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function notifyRespondent(req, res) {
  try {
    const summon = await summonModel.findByComplaintId(req.params.complaintId);
    if (!summon) return res.status(404).json({ message: "Summon not found" });

    await pool.query(
      `INSERT INTO notifications (complaint_id, recipient, message, type)
       VALUES ($1, $2, $3, $4)`,
      [
        req.params.complaintId,
        summon.respondent,
        `You are summoned to appear on ${summon.hearingDate} at ${summon.hearingTime}, ${summon.venue}.`,
        "summon",
      ]
    );

    res.json({ message: "Notification sent to respondent." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { create, getByComplaint, notifyRespondent };
