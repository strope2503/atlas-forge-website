const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedWoodlandsData = `  'HTX Woodlands Gold': {
    id: '241436',
    formation: '4-3-3 (Single #6 pivot, inverted wingers; 4-5-1 mid-block)',
    strengths: ['Methodical possession build-up', 'Midfield triangles', 'Inverted wingers cutting inside'],
    weaknesses: ['Low conversion rate', 'Center-backs struggle in 1v1 footraces', 'Space behind advancing fullbacks'],
    pivotPlan: 'Invert Right Back (#2) alongside #6. Left Back (#3) drops to back three.',
    playmakerPlan: '#8 pushes forward level with #10 to create a 4v3 Box Midfield overload around their lone #6.',
    wingsPlan: '#7 and #11 hug touchlines to provide maximum width and attack half-spaces.',
    pressTrigger: 'The Blind-Turn Pincer: Trap their #6 when he receives back to goal by closing from blind side with #10.',
    targetZones: ['Zones 11 & 17 (Half-spaces behind advancing fullbacks)', 'Their lone #6 in possession'],
    film: [
      { title: 'HTX Tourney vs HTX Woodlands Gold STXCL', url: 'https://www.youtube.com/watch?v=4Z6wtYBwoQE', duration: '30:24' },
      { title: '2013 Houston Surf White vs HTX Woodlands Gold', url: 'https://www.youtube.com/watch?v=DXpzjGi6LnM', duration: 'Highlights' },
      { title: 'Lonestar 12/13B vs HTX Woodlands 12/13B Gold', url: 'https://www.youtube.com/watch?v=4Z6wtYBwoQE', duration: '37:40' },
      { title: 'JAH CHIESA vs HTX Woodlands 13B', url: 'https://www.youtube.com/watch?v=DXpzjGi6LnM', duration: 'Highlights' }
    ]
  },`;

const startIdx = js.indexOf("  'HTX Woodlands Gold': {");
const nextKeyIdx = js.indexOf("  'HTX West Gold': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedWoodlandsData + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced Woodlands Data');
} else {
    console.log('Could not find block');
}
