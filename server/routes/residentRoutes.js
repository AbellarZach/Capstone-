const express = require("express");
const residentController = require("../controllers/residentController");

const router = express.Router();

router.get("/", residentController.getAll);
router.get("/:id", residentController.getById);
router.post("/", residentController.create);
router.put("/:id", residentController.update);
router.delete("/:id", residentController.remove);

module.exports = router;
