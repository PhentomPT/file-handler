# file-handler
A little and useful library to read and write files asynchronously no matter the size

### Example
```javascript
const { Reader } = require('./index');

const startProcess = async () => {
  try {
    await Reader.readFile(
      [
        './input/very_small.csv',
        './input/small.csv',
        './input/normal.csv',
        './input/big.csv',
        './input/huge.csv'
      ],

      {},

      () => {
        
      },
    
      (stats) => {
        console.log(`finished reading file ${stats.name} (${stats.size}mb) with ${stats.numberLines} lines in ${stats.readTime}s`);
      },

      (file, error) => {
        console.log(`${file} had error: ${error}`);
      });
  } catch (error) {
    console.log(error);
  }
}

startProcess();
```

### Result
```bash
finished reading file ./input/very_small.csv (0.062mb) with 1001 lines in 0.019s
finished reading file ./input/small.csv (1.115mb) with 18001 lines in 0.039s
finished reading file ./input/normal.csv (11.151mb) with 180001 lines in 0.117s
finished reading file ./input/big.csv (111.510mb) with 1800001 lines in 0.570s
finished reading file ./input/huge.csv (459.016mb) with 7409461 lines in 1.555s
```