const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedTeam8Data = `  'Real Greens': {
    id: '640546',
    formation: '4-3-3 (Aggressive swarming counter-press, heavy shift)',
    strengths: ['Aggressive 3-4 man counter-press on turnovers', 'High-intensity pressure', '3-2-3 Conference Record'],
    weaknesses: ['Heavy Shift Vulnerability leaves opposite outside back stranded', 'Transition defending in open field', 'CBs struggle in 1v1 footraces'],
    pivotPlan: 'The Overload-to-Isolate Switch: Build up on left to draw press, bounce pass back to CB/GK, launch 40-yard diagonal switch.',
    playmakerPlan: '#7 isolated 1v1 on far touchline with no central cover for Real Greens.',
    wingsPlan: 'Station #7 high and wide on far touchline to exploit stranded weak-side outside back.',
    pressTrigger: 'The 3rd-Man Bounce: strictly avoid >2 touches. Use 3rd-man combos to puncture their pressing wave.',
    targetZones: ['Weak-side outside back in 1v1 isolation', 'Far-side flank corridor'],
    film: [
      { title: 'NORTH SHORE 13 STXCL vs RGSA 13B STXCL', url: 'https://www.youtube.com/watch?v=P_HkWSLRAqM', duration: '38:06' },
      { title: 'H. WOLVES STXCL 13 vs RGSA STXCL U13B', url: 'https://www.youtube.com/watch?v=v_CcrTACkUc', duration: '42:20' },
      { title: 'Full Match Film: RGSA 13B vs H Wolves 13 (1st Half)', url: 'https://www.youtube.com/watch?v=uqxT3LRISzM', duration: '35:04' },
      { title: 'Full Match Film: RGSA 13B vs H Wolves 13 (2nd Half)', url: 'https://www.youtube.com/watch?v=spRQl68L6O4', duration: '37:46' },
      { title: 'JAH CHIESA 2013 vs Real Greens SA 13B', url: 'https://www.youtube.com/watch?v=rCvx-KYLd7g', duration: '13:24' }
    ]
  },`;

const startIdx = js.indexOf("  'Real Greens': {");
const nextKeyIdx = js.indexOf("  'Storm SC': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedTeam8Data + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced Real Greens Data');
} else {
    console.log('Could not find block');
}
