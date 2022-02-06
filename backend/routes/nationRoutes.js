const db = require('../tinydb')
const utils = require('../utilities/fleetUtils')

const express = require('express');
const router = express()

const NATION_TABLE = "nations";
const NATION_PROTOTYPE = {
    "natName": null,           //String containing the name of nation
    "natMilLink": null,        //String containing a link to the nation's Order of Battle
    "natHoldLink": null,   //String containing a link to the nation's holdings
    "type": null,           //Either 'player' or 'nonplayer'
    'userId': null          //User playing nation
}

router.post('/createNation', async function (req, res) {
    const userId = req.body['userId']

    //Create nation in nation
    var natId = await db.addRecord(NATION_TABLE, {
        'natName': req.body['natName'],
        'natMilLink': req.body['natMilLink'],
        'natHoldLink': req.body['natHoldLink'],
        'natType': 'player',
        'natStatus': 'active',
        'userId': req.body['userId']
    })
    
    //Update the user's list of nations
    var user = await db.getRecordById('users', userId)
    var userNatIds = user['userNatIds']
    userNatIds.push(natId)
    
    await db.updateRecord('users', userId, {'userNatIds': userNatIds})

    res.sendStatus(200)
}) 

router.get('/userNations/:userId', async function(req, res){
    const userId = req.params.userId

    const user = await db.getRecordById('users', userId)

    //Get all nations owned by the users
    const nations = await db.getRecordsByQuery(
        'nations',
        {'_id': { '$in': user['userNatIds']}}
    )

    res.json(nations)
})

module.exports = router;