const db = require('../tinydb')

//This is intended to validate the contents of a nation object
//In particular, it is intended to validate the sheets linked by a nation and ensure
//that they contain information in the correct format.
function validateNation(nation){

}

//Validate the territory sheet. Should return
//either zero for success, or a string indicating
//what is wrong with the sheet
function validateTerritorySheet(link){

}

//Validate the military sheet. Should return
//either zero for success, or a string indicating
//what is wrong with the sheet
function validateMilitarySheet(link){

}

module.exports = {}