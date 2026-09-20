const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedCentralData = `  'HTX Central Gold': {
    id: '752439',
    formation: '4-3-3 (Structured build-up, short passing)',
    strengths: ['Balanced, structured build-up', 'Play short through central third', 'Backline positioning under box pressure'],
    weaknesses: ['Vulnerable to central overloading', 'Struggle against high fullbacks', 'Midfield turnovers under back-to-goal pressure'],
    pivotPlan: 'Use Shift Beta (3-1-5-1): #6 drops into the back three to allow high fullbacks to stretch their central block.',
    playmakerPlan: 'Create a 5v4 attacking line across the final third to deliver far-post cutbacks.',
    wingsPlan: 'High fullbacks (#2 & #3) push onto the touchlines to overload the wide areas.',
    pressTrigger: 'Press their central midfielders immediately when receiving with their back to our goal to force turnovers.',
    targetZones: ['Central third (pressing traps)', 'Far-post areas for cutbacks'],
    film: [
      { title: 'HTX Central 13 Gold Highlights in College Station', url: 'https://www.youtube.com/watch?v=w5Sj-p7ixXk', duration: 'Highlights' },
      { title: 'HTX 2013s Clearing the Ball Out', url: 'https://www.youtube.com/watch?v=VDmhCwIVsrs', duration: 'Highlights' },
      { title: 'Sugar Land 14B vs HTX Central 14B Black', url: 'https://www.youtube.com/watch?v=YAATXCCMA5Y', duration: '50:27' }
    ]
  },`;

const startIdx = js.indexOf("  'HTX Central Gold': {");
const nextKeyIdx = js.indexOf("  'Houstonians FC N': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedCentralData + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced Central Data');
} else {
    console.log('Could not find block');
}
