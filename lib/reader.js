const fs = require('fs');
const { onDataFnc, onEndFnc, onErrorFnc } = require('./reader.on');

const fileStats = {
  name: '',
  size: 0,
  numberLines: 0,
  readTime: 0
}

const readOptions = {
  getDataAsArray: true,
  encoding: 'utf8'
}

module.exports.readFile = async (fileLocation, options = readOptions, onData = onDataFnc, onEnd = onEndFnc, onError = onErrorFnc) => {
  options = { ...readOptions, ...options }
  let files = [];

  if (typeof fileLocation === 'string') {
    files.push(fileLocation);
  }
  else if (Array.isArray(fileLocation)) {
    files = fileLocation;
  } else {
    throw new Error('File type must be string or array');
  }
  
  if (files.length === 0) {
    throw new Error('There needs to be at least 1 file to read');
  }

  const streams = {};
  for (let index = 0; index < files.length; index++) {
    const fileName = files[index];

    streams[fileName] = {
      startTime: Date.now(),
      stream: fs.createReadStream(fileName, { encoding: readOptions.encoding }),
      numberLines: 0,
      lastRow: ''
    }
    
    streams[fileName].stream.on('data', (data) => {
      data = streams[fileName].lastRow + data;

      let rows = data.split('\n');
      streams[fileName].lastRow = rows.slice(-1);
      rows = rows.slice(0, -1);
      
      const count = rows ? rows.length : 0;
      streams[fileName].numberLines += count;
        
      if (options.getDataAsArray) {
        data = rows;
      } else {
        data = rows.join('\n');
      }
      
      onData(fileName, data);
    });

    streams[fileName].stream.on('error', (error) => {
      onError(fileName, error);
    });

    streams[fileName].stream.on('end', () => {
      const file = fs.statSync(fileName);
      const elapsed = Date.now() - streams[fileName].startTime;

      const stats = { ...fileStats };
      stats.name = fileName;
      stats.size = (file.size / 1000000).toFixed(3);
      stats.numberLines = streams[fileName].numberLines;
      stats.readTime = (elapsed / 1000).toFixed(3);
      
      onEnd(stats);
    });
  }
}