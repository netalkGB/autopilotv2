const fs = require('fs')
const fsPromises = fs.promises

fsPromises.rm('out', { recursive: true }).catch(e => console.error(e))
