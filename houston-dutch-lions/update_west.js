const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedWestData = `  'HTX West Gold': {
    id: '240339',
    formation: '4-4-2 (Flat block, direct vertical clearances)',
    strengths: ['Athletic target forward', 'Second-ball knockdowns in middle third'],
    weaknesses: ['Lowest scoring offense (15 GF / 21 matches)', 'Panic on weak foot clearances', 'Midfield disconnect between CMs and strikers'],
    pivotPlan: 'Fullbacks (#2 and #3) step up alongside #6 and #8 to form a 4-man midfield net.',
    playmakerPlan: '#10 roams freely across the width in the pocket between their midfield and back four to create a 5v2 central superiority.',
    wingsPlan: 'Wingers (#7 and #11) stay glued to touchlines to isolate flat outside backs 1v1.',
    pressTrigger: '"Weak-Foot Funnel & Sideline Squeeze": Funnel pass to weaker-footed CB, clamp inside lanes, and force panicked clearance.',
    targetZones: ['Touchline corridors for 2v1 wide overloads', 'Their central 2-man midfield duo (overload and bypass)'],
    film: [
      { title: 'HTX Tourney vs HTX West Gold STXCL', url: 'https://www.youtube.com/watch?v=8_MZszyNUGc', duration: '1:20:28' },
      { title: 'HTX South Gold vs HTX West Gold', url: 'https://www.youtube.com/watch?v=LGieQ1uiYlU', duration: '2:22' },
      { title: 'HTX South Gold vs HTX West Gold (25-26 Season)', url: 'https://www.youtube.com/watch?v=ypdEr_wcGKw', duration: 'Highlights' },
      { title: 'JAH 2013B vs HTX West 13B Gold I', url: 'https://www.youtube.com/watch?v=s7zUyYfO03w', duration: 'Highlights' },
      { title: 'JAH CHIESA 2013 vs HTX West 13B Gold', url: 'https://www.youtube.com/watch?v=6lnzbooZCtc', duration: '14:44' }
    ]
  },`;

const startIdx = js.indexOf("  'HTX West Gold': {");
const nextKeyIdx = js.indexOf("  'HTX South Gold': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedWestData + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced West Data');
} else {
    console.log('Could not find block');
}
