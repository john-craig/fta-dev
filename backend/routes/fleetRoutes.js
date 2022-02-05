const db = require('../tinydb')
const express = require('express');
const router = express()

const FLEET_TABLE = "fleets";

router.post('/moveFleet', async function (req, res) {
    /*
        This will accept the name of a fleet and a destination system for it to travel to
    */

    res.sendStatus(200)
}) 

module.exports = router;