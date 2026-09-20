const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedNorthShoreData = `  'North Shore FC White': {
    id: '135996',
    formation: '4-4-2 / 4-3-3 (Physical, direct, long clearances)',
    strengths: ['Physical 50/50 challenges', 'Direct clearance style', 'Drops 11 players in 6-yard box on corners'],
    weaknesses: ['0-0-3 (2 GF / 24 GA)', 'Zone 14 Grand Canyon gap', 'Box disorganization under rapid 1-2 passing'],
    pivotPlan: 'Use 4-1-4-1 \"Zone 14 Flood\": #8 pushes forward alongside #10 into the open pocket between their midfield and backline.',
    playmakerPlan: '#8 and #10 have uncontested space at the top of the box for mid-range shooting and quick wall passes.',
    wingsPlan: 'Inverted wingers (#7 & #11) pinch inside to half-spaces, fullbacks (#2 & #3) provide touchline width.',
    pressTrigger: 'Clearance Compression: The moment our attack finishes, back four immediately steps up 15-20 yards to catch forwards offside.',
    targetZones: ['Zone 14 (top of the 18-yard box)'],
    film: [
      { title: 'NSFC Select White 2014 vs BYSC Renegades 2014', url: 'https://www.youtube.com/watch?v=2TnWddjFSJI', duration: '1:05:21' },
      { title: 'NSFC Select 2014 vs BYSC Renegade', url: 'https://www.youtube.com/watch?v=86nFEKf4MlI', duration: '54:43' },
      { title: 'NSFC Select vs Liverpool', url: 'https://www.youtube.com/watch?v=o_egIRiP5ho', duration: '58:44' },
      { title: 'JAH 2013B vs North Shore FC Select 13B', url: 'https://www.youtube.com/watch?v=NTMMnJoV894', duration: 'Highlights' },
      { title: 'JAH CHIESA 2013 vs NORTH SHORE FC 2013', url: 'https://www.youtube.com/watch?v=qZQKebWaY_g', duration: '9:48' }
    ]
  },`;

const startIdx = js.indexOf("  'North Shore FC White': {");
const nextKeyIdx = js.indexOf("  'Real Greens': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedNorthShoreData + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced North Shore Data');
} else {
    console.log('Could not find block');
}
