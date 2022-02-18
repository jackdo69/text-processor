const fs = require('fs');

function processCSV(path) {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    const lines = data.split('\n');
    const filteredNonAscii = lines.map((line) =>
      line.replace(/[^\x00-\x7F]/g, '').replace('\r', '')
    );
    const result = Object.fromEntries(
      filteredNonAscii.map((item) => item.split(','))
    );
    return result;
  } catch (e) {
    console.log('error while processing csv file', e);
  }
}

function processLine(line, map) {
  const vlanNum = line.split(' ')[3];
  if (Object.keys(map).includes(vlanNum)) {
    line = line.replace(vlanNum, `"${map[vlanNum]}"`);
  }
  return line;
}

function processTXT(path, map) {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    const lines = data.split('\n');
    return lines.map((line) => processLine(line, map)).join('\n');
  } catch (e) {
    console.log('error while processing txt file', e);
  }
}

const map = processCSV('./book.csv');
const result = processTXT('./vlan.txt', map);
fs.writeFileSync('output.txt', result);
