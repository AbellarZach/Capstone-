const express = require("express");
const complaintController = require("../controllers/complaintController");

const router = express.Router();

router.get("/dashboard", complaintController.getDashboard);
router.get("/recent", complaintController.getRecent);
router.get("/", complaintController.getAll);
router.get("/:id", complaintController.getById);
router.put("/:id/approve", complaintController.approve);
router.put("/:id/reject", complaintController.reject);

module.exports = router;
