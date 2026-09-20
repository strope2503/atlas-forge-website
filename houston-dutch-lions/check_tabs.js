fetch('https://docs.google.com/spreadsheets/d/13ZOQxIllvOSSNXn10lA5qCsZv38FCtDVLg5kqrVoAqQ/edit').then(r=>r.text()).then(t => { 
  const matches = [...t.matchAll(/\"name\"\:\"(.*?)\".*?\"sheetId\"\:(\d+)/g)]; 
  const unique = [];
  matches.forEach(m => { if(!unique.find(u => u.name === m[1])) unique.push({name: m[1], id: m[2]})});
  console.log(unique); 
});
