const fs = require('fs');

const readOptions = {
    encoding: 'utf8'
}

module.exports.writeFile = async (fileLocation, options = readOptions) => {
    const stream = fs.createWriteStream(fileLocation, { encoding: options.encoding });
    return stream;
}