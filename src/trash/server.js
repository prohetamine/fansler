const fs = require('fs')
    , cors = require('cors')
    , express = require('express')
    , app = express()
    , readline = require('readline')
    , path = require('path')

let i = 0
  , offset = 0

const createData = (offset = 0) => {
  const magicNumbers = Array(10000).fill(true).map((e, i) => i)
      , words = fs.readFileSync(path.join(__dirname, '..' , 'assets/data/words.txt'), 'utf8').match(/.+/gi)
      , names = fs.readFileSync(path.join(__dirname, '..' ,'assets/data/names.txt'), 'utf8').match(/.+/gi)

  const magicNumbersLength = magicNumbers.length
      , wordsLength = words.length
      , namesLength = names.length

  console.clear()
  console.log('words: ', wordsLength)
  console.log('magic numbers: ', magicNumbersLength)
  console.log('names: ', namesLength)
  console.log('------------')

  const array = names.slice(offset, offset + 1).map(
    name => [
      ...magicNumbers.map(n => name+n),
      ...words.map(w => name+w),
      ...words.map(w => w+name),
      ...words.map(w => [
        ...magicNumbers.map(n => name+w+n),
        ...magicNumbers.map(n => name+n+w),
      ])
    ]
  ).flat().flat().flat()

  const data = []

  for (let i = 0; i < array.length; i += 400) {
    data.push(array.slice(i, i+400).join(','))
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
      offset += 1
      data = createData(offset)
      res.end(JSON.stringify(data[i]))
      i = 0
    }
  })

  app.listen(8989)
})()
