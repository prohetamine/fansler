const fs = require('fs')
    , path = require('path')

module.exports = class {
  constructor (name) {
    this.basePath = path.join(__dirname, '')
    this.baseTmpPath = path.join(this.basePath, `tmp-${name}.json`)
    this.basePerPath = path.join(this.basePath, `${name}.json`)

    if (!fs.existsSync(this.basePerPath)) {
      fs.writeFileSync(this.basePerPath, JSON.stringify({}))
    }
  }

  check (key, data) {
    const db = JSON.parse(fs.readFileSync(this.basePerPath, 'utf8'))
    return !!db[key][data]
  }

  set (key, meta) {
    const db = JSON.parse(fs.readFileSync(this.basePerPath, 'utf8'))

    try {
      db[key] = {
        ...db[key],
        ...meta
      }
    } catch (e) {
      db[key] = meta
    }


    fs.writeFileSync(this.baseTmpPath, JSON.stringify(db))
    for (;;) {
      try {
        fs.renameSync(this.baseTmpPath, this.basePerPath)
        break
      } catch (e) {
        console.log(`Err save: ${this.baseTmpPath}`)
      }
    }
  }
  
  get () {
    const db = JSON.parse(fs.readFileSync(this.basePerPath, 'utf8'))
    return Object.keys(db).map(key => ({ name: key, ...db[key] }))
  }
}
