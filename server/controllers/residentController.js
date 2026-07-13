const residentModel = require("../models/residentModel");

async function getAll(req, res) {
  try {
    const residents = await residentModel.findAll();
    res.json(residents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getById(req, res) {
  try {
    const resident = await residentModel.findById(req.params.id);
    if (!resident) return res.status(404).json({ message: "Resident not found" });
    res.json(resident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function create(req, res) {
  try {
    const resident = await residentModel.create(req.body);
    res.status(201).json(resident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const resident = await residentModel.update(req.params.id, req.body);
    if (!resident) return res.status(404).json({ message: "Resident not found" });
    res.json(resident);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    const deleted = await residentModel.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Resident not found" });
    res.json({ message: "Resident deleted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAll, getById, create, update, remove };
