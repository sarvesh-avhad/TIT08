const express = require("express");

const router = express.Router();

const {
    getTopNotifications
} = require("../services/priorityService");

router.get("/priority", async (req, res) => {

    const notifications =
        await getTopNotifications(10);

    res.json({
        success: true,
        notifications
    });
});

module.exports = router;