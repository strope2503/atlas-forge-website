const fs = require('fs');

function unescapeFile(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$\{/g, '${');
  fs.writeFileSync(filename, content);
  console.log('Fixed ' + filename);
}

unescapeFile('scouting.js');
unescapeFile('coach.html');
