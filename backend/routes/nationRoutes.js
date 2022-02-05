const db = require('../tinydb')
const utils = require('../utilities/fleetUtils')

const express = require('express');
const router = express()

const NATION_TABLE = "nations";
const NATION_PROTOTYPE = {
    "name": null,           //String containing the name of nation
    "oobLink": null,        //String containing a link to the nation's Order of Battle
    "holdingsLink": null,   //String containing a link to the nation's holdings
    "type": null,           //Either 'player' or 'nonplayer'
    //Other stuff goes here....
}

router.post('/createNation', async function (req, res) {
    console.log(req.body)
    //To-Do: validate

    var result = db.addRecord(NATION_TABLE, req.body)
    console.log(result)
    //utils.refreshFleets

    res.sendStatus(200)
}) 

module.exports = router;