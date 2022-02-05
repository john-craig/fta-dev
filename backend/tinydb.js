const env = "dev"
const deasync = require('deasync');
const Datastore = require('nedb')

const tables = {
    'users':        new Datastore({filename: '../database/' + env + '/users.db', autoload: true}),
    'nations':      new Datastore({filename: '../database/' + env + '/nations.db', autoload: true}),
    'holdings':     new Datastore({filename: '../database/' + env + '/holdings.db', autoload: true}),
    'fleets':       new Datastore({filename: '../database/' + env + '/fleets.db', autoload: true})
}


function getRecordById(table, id){
    var result = null;

    if(table in tables){
        tables[table].findOne({ _id: id }, function (err, doc) {
            result = {err : err, doc : doc}
        })

        while ((result == null)) {
            deasync.runLoopOnce();
        }
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return (result.err || result.doc)
}

function getRecordsByQuery(table, query){
    var result = null;

    if(table in tables){
        result = tables[table].find(query, function (err, doc) {
            result = {err : err, doc: doc}
        })

        while ((result == null)) {
            deasync.runLoopOnce();
        }
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return (result.err || result.doc)
}

function addRecord(table, record){
    var result = null;

    if(table in tables){
        result = tables[table].insert(record, function (err, doc) {
            result = {err : err, doc: doc}
        })

        while ((result == null)) {
            deasync.runLoopOnce();
        }
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return (result.err || result.doc['_id'])
}

function updateRecord(table, id, record){
    var result = null;

    if(table in tables){
        var prevRecord = tables[table].findById(id)

        if(prevRecord){
            result = tables[table].update({'_id': id}, record, function (err, doc) {
                result = {err : err, doc: doc}
            })
    
            while ((result == null)) {
                deasync.runLoopOnce();
            }
        } else {
            console.log("Attempted to update nonexistent record, ", record)
        }
    } else {
        console.log("Attempted to access nonexist table, ", table)
    }

    return (result.err || result.doc)
}

function deleteRecord(table, id){
    var result = null;

    if(table in tables){
        result = tables[table].remove({'_id': id}, function (err, doc) {
            result = {err : err, doc: doc}
        })

        while ((result == null)) {
            deasync.runLoopOnce();
        }
    } else {
        console.log("Attempted to access nonexist table", table)
    }

    return (result.err || result.doc)
}

module.exports = {
    getRecordById,
    getRecordsByQuery,
    addRecord,
    updateRecord,
    deleteRecord
}