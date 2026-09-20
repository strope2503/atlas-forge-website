const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedHoustoniansData = `  'Houstonians FC N': {
    id: '546899',
    formation: '4-3-3 (High-risk penalty box dribbling, inverted wingers)',
    strengths: ['Ball retention in tight spaces', 'Wingers cutting inside on right foot'],
    weaknesses: ['0-0-3 (1 GF / 12 GA)', 'Turnovers from dribbling in own box', 'Disconnected two-man rest defense'],
    pivotPlan: 'Full High-Press on Goal Kicks: Shift into a 4-2-4 high lock to force rushed turnovers inside their 18-yard box.',
    playmakerPlan: '#10 stays high. Upon regaining possession, hit #10 on the turn for diagonal through-balls.',
    wingsPlan: '#7 and #11 pinch inside on goal kicks to cut off short fullback exits.',
    pressTrigger: 'Defensive Stance: Fullbacks maintain open body posture forcing wingers toward outside touchline (deny cut-inside).',
    targetZones: ['Their penalty box on goal kicks', 'Wide corridors in counter transition'],
    film: [
      { title: 'Gorilones Jr 2013 vs Houstonians FC 2013 — Derise League Final', url: 'https://www.youtube.com/watch?v=_6FgN_jwAhk', duration: '1:16:59' },
      { title: 'Houstonians FC 2013 vs CF10 2013 — Texas Easter Cup', url: 'https://www.youtube.com/watch?v=IhED34475zs', duration: '1:08:40' },
      { title: 'Houstonians FC 2013 vs Inwood Real Conroe 2013', url: 'https://www.youtube.com/watch?v=qPoUdoIiSw8', duration: '1:06:50' },
      { title: 'Houstonians FC 2013 vs Dynamo CDP Rosenberg 2013', url: 'https://www.youtube.com/watch?v=vWeCkkniCDg', duration: '1:05:10' },
      { title: 'Gorilones Jr vs Houstonians 2013 ECNL RL', url: 'https://www.youtube.com/watch?v=nkW08B4Ybh8', duration: '1:16:20' }
    ]
  },`;

const startIdx = js.indexOf("  'Houstonians FC N': {");
const nextKeyIdx = js.indexOf("  'AHFC SW Blue': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedHoustoniansData + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced Houstonians Data');
} else {
    console.log('Could not find block');
}
