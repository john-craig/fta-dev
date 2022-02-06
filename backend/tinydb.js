const env = "dev"
const Datastore = require('nedb')

const tables = {
    'users':            new Datastore({filename: '../database/' + env + '/users.db', autoload: true}),
    'nations':          new Datastore({filename: '../database/' + env + '/nations.db', autoload: true}),
    'map':              new Datastore({filename: '../database/' + env + '/nations.db', autoload: true}),
    'territories':      new Datastore({filename: '../database/' + env + '/territories.db', autoload: true}),
    'deployments':      new Datastore({filename: '../database/' + env + '/deployments.db', autoload: true}),
    'fleets':           new Datastore({filename: '../database/' + env + '/fleets.db', autoload: true}),
    'armies':           new Datastore({filename: '../database/' + env + '/armies.db', autoload: true}),
    'fortifications':   new Datastore({filename: '../database/' + env + '/fortifications.db', autoload: true}),
    'designs':          new Datastore({filename: '../database/' + env + '/designs.db', autoload: true})
}


async function getRecordById(table, id){
    var result = null;

    if(table in tables){
        result = new Promise((resolve, reject) => {
            tables[table].findOne({ _id: id }, function (err, doc) {
                if(err){
                    reject(err)
                }

                resolve(doc)
            })
        })
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return result
}

async function getRecordsByQuery(table, query){
    var result = null;

    if(table in tables){
        result = new Promise((resolve, reject) => {
            tables[table].find(query, function (err, doc) {
                if(err){
                    reject(err)
                }

                resolve(doc)
            })
        })
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return result
}

async function addRecord(table, record){
    var result = null;

    if(table in tables){
        result = new Promise((resolve, reject) => {
            tables[table].insert(record, function (err, doc) {
                if(err){
                    reject(err)
                }

                resolve(doc['_id'])
            })
        })
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return result
}

async function updateRecord(table, id, record){
    var result = null;

    if(table in tables){
        var prevRecord = tables[table].findById(id)

        if(prevRecord){
            result = new Promise((resolve, reject) => {
                tables[table].update({'_id': id}, record, function (err, doc) {
                    if(err){
                        reject(err)
                    }
    
                    resolve(doc)
                })
            })
        } else {
            console.log("Attempted to update nonexistent record, ", record)
        }
    } else {
        console.log("Attempted to access nonexist table, ", table)
    }

    return result
}

async function deleteRecord(table, id){
    var result = null;

    if(table in tables){
        result = new Promise((resolve, reject) => {
            tables[table].remove({'_id': id}, function (err, doc) {
                if(err){
                    reject(err)
                }

                resolve(doc)
            })
        })
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return result
}

module.exports = {
    getRecordById,
    getRecordsByQuery,
    addRecord,
    updateRecord,
    deleteRecord
}