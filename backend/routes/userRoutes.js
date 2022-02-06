const db = require('../tinydb')
const express = require('express');
const router = express()

//Create a user
router.post('/newUser', async function (req, res) {
    //To do:
    /*
        Validate that the user and password hash does not
        currently exist in the database.

        Also have some kind of passcode to create special
        accounts.
    */

    const user = {
        'userName': req.body['userName'],
        'userPassHash': req.body['userPassHash'],
        'userType': 'normal',
        'userNatIds': [],
        'userNotifs': []
    }

    const userId = await db.addRecord('users', user)
    res.send(userId);
})

//Sign in as a user -- this basically just
//returns the user's ID
router.post('/signIn', async function(req, res) {
    const user = db.getRecordsByQuery('users', {
        'userName': req.body['userName'],
        'userPassHash': req.body['userPassHash']
    })

    res.send(user['_id'])
})

module.exports = router;