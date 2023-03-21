const fs = require('fs')
    , cors = require('cors')
    , express = require('express')
    , app = express()
    , readline = require('readline')
    , path = require('path')

let i = 0
  , offset = 0

const createData = (offset = 0) => {
  const magicNumbers = Array(10000000).fill(true).map((e, i) => i)
      , names = ['user']


  const magicNumbersLength = magicNumbers.length
      , namesLength = names.length

  console.clear()
  console.log('magic numbers: ', magicNumbersLength)
  console.log('names: ', namesLength)
  console.log('------------')

  const array = names.slice(offset, offset + 5).map(
    name => [
      ...magicNumbers.map(n => name+n)
    ]
  ).flat().flat().flat()

  const data = []

  for (let i = 0; i < array.length; i += 300) {
    data.push(array.slice(i, i+300).join(','))
  }

  return data
}

;(async () => {
  let data = createData(offset)

  app.use(cors())

  app.get('/get', (req, res) => {
    console.log(i, offset, data.length)

    if (data[i]) {
      res.end(JSON.stringify(data[i]))
      i++
    } else {
      offset += 5
      data = createData(offset)
      res.end(JSON.stringify(data[i]))
      i = 0
    }
  })

  app.get('/set', (req, res) => {
    fs.appendFileSync(__dirname+'/usernames.txt', req.query.username+'\n')
    res.end('')
  })

  app.listen(8989)

})()
