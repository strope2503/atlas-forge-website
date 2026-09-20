const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedStormData = `  'Storm SC': {
    id: 'preseason-storm',
    formation: 'Patient build-out from the back',
    strengths: ['Patient ground passes between GK and CBs'],
    weaknesses: ['Hesitation under high penalty-box pressure', 'Deep, conservative fullbacks rarely overlap', 'Risky central ground passes'],
    pivotPlan: 'Use 4-2-4 \"Goal-Kick High-Press Lock\": #7 and #11 push high alongside #9 and #10 to lock man-for-man on back four.',
    playmakerPlan: '#9 and #10 close the central corridor instantly on goal kicks to force turnover within 20 yards.',
    wingsPlan: '#7 and #11 lock onto their fullbacks high up the pitch on goal kicks.',
    pressTrigger: 'The Goal-Kick Suffocation: #9 shadows stronger CB, #10 between GK and CDM. Trap instantly on first touch.',
    targetZones: ['Their 18-yard box under immediate pressure', 'Zone 14 (top of penalty box)'],
    film: [
      { title: 'STING B14 vs STORM 14B', url: 'https://www.youtube.com/watch?v=bJW7mM3V6QI', duration: '51:03' },
      { title: 'STING B14 vs STORM 14B (Scores & Highlights)', url: 'https://www.youtube.com/watch?v=t2LAfTa30y8', duration: '2:13' },
      { title: 'Centex Storm 2014 Select Boys', url: 'https://www.youtube.com/watch?v=XSP9u9IRyEM', duration: 'Highlights' }
    ]
  }
};`;

const startIdx = js.indexOf("  'Storm SC': {");
const nextKeyIdx = js.indexOf("};", startIdx);

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx + 2);
    js = js.replace(originalBlock, updatedStormData);
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced Storm Data');
} else {
    console.log('Could not find block');
}
