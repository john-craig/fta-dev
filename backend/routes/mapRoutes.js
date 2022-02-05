const express = require('express');
const router = express()
const PublicGoogleSheetsParser = require('public-google-sheets-parser')


router.get('/mapData', async function (req, res) {
    const mapData = {'systems': {}, 'connections': []}
    const sheetId = "19AejpZTl2aPQqSjkmGejyIplYPKFgwH7CLnTNplUQZ0"
  
    const parser = new PublicGoogleSheetsParser(sheetId)
    
    const systemData = await parser.parse(sheetId, "Systems")
    const connectionData = await parser.parse(sheetId, "Connections")
  
    //Convert sheet data
    systemData.forEach(function(elem, index){
      mapData['systems'][index.toString()] = {
        "name": elem["Name"],
        "pos": [
          parseInt(elem["Position"].split(',')[0]),
          parseInt(elem["Position"].split(',')[1])
        ],
        "desc": elem['Description']
      }
    });
  
    connectionData.forEach(function(elem){
      mapData['connections'].push([
        systemData.map(function(e) { return e['Name']; }).indexOf(elem['Start']),
        systemData.map(function(e) { return e['Name']; }).indexOf(elem['End']),
      ])
    })
  
    res.json(mapData)
  })

module.exports = router;