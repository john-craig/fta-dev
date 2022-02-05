const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const db = require('../tinydb')

//This will go through the OoB's of all nations and search for any fleets which are not yet present in the database
//A new fleet will by default be placed at a nation's homeworld
async function refreshFleets(){
    const nations = db.getRecordsByQuery('nations', {})

    nations.forEach(async (nation) => {
        const oobId = nation['oobLink'].split('/')[5]

        const parser = new PublicGoogleSheetsParser()
        const fleetData = (await parser.parse(oobId, "Organization")).reduce(
            function(prev, cur){
                if(!prev.includes(cur['Name'])){
                    prev.push(cur['Name'])
                }
                return prev
            }, []
        )

        const prevFleetData = db.getRecordsByQuery('fleets', {'factionId': nation['_id']})

        fleetData.forEach(fleetName => {
            if( !prevFleetData.map(fleet => fleet['name']).includes(fleetName)){
                //Create the fleet in the database
            }
        })
    })
}

module.exports = { refreshFleets }