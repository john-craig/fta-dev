const PublicGoogleSheetsParser = require('public-google-sheets-parser')
const db = require('../tinydb')

TERRITORY_PROTOTYPE = {
    'sysName': {
        'type': "Capital",
        'holdings': [
            {'name': "Blah" },
            {'name': "Blue"}
        ]
    }
}

async function getNationTerritories(natId){
    const nation = db.getRecordById('nations', natId)
    const holdingId = nation['holdingsLink'].split('/')[5]

    const parser = new PublicGoogleSheetsParser()
    const territoryData = (await parser.parse(holdingId, "Territories")).reduce(
        function(prev, cur){
            if(cur['System'] in prev){
                prev['holdings'].push({
                    'name': cur['Name'],
                    'type': cur['Type']
                })
            } else {
                prev[cur['System']] = {
                    'type': 'colony',
                    'holdings': [
                        {'name': cur['Name'], 'type': cur['Type']}
                    ]
                }
            }

            if(cur['type'] == 'Major'){
                prev[cur['System']]['type'] = 'Capital'
            }
            
            return prev
        }, {}
    )

    return territoryData;
}


module.exports = { 
    getNationTerritories
}