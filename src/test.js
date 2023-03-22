const DB = require('./libs/db')
    , fs = require('fs')

const a = new DB('test', 10000)
console.log(a.get())

console.log(a.set('lol', {}))
