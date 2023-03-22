const DB = require('./libs/db')
    , fs = require('fs')

const a = new DB('pure-accounts')
console.log(a.get())

//console.log(a.set('lol', {}))
