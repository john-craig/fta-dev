const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const db = require('../tinydb')


async function getNationFleets(natId){
    const nation = await db.getRecordById('nations', natId)
    const oobId = nation['militaryLink'].split('/')[5]

    const parser = new PublicGoogleSheetsParser()
    const fleetData = (await parser.parse(oobId, "Organization")).reduce(
        function(prev, cur){
            if(!prev.includes(cur['Name'])){
                prev.push(cur['Name'])
            }
            return prev
        }, []
    )

    return fleetData;
}

//This will go through the OoB's of all nations and search for any fleets which are not yet present in the database
//A new fleet will by default be placed at a nation's homeworld
async function refreshFleets(){
    const nations = await db.getRecordsByQuery('nations', {})

    nations.forEach(async (nation) => {
        const fleetData = getNationFleets(nation['_id'])
        const prevFleetData = db.getRecordsByQuery('fleets', {'factionId': nation['_id']})

        fleetData.forEach(fleetName => {
            if( !prevFleetData.map(fleet => fleet['name']).includes(fleetName)){
                //Create the fleet in the database
            }
        })
    })
}



module.exports = { 
    getNationFleets,
    refreshFleets 
}