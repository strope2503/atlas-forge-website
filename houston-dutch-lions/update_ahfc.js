const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedAHFCData = `  'AHFC SW Blue': {
    id: '175983',
    formation: '4-4-2 / 4-2-3-1 (Fast, direct, long diagonal balls)',
    strengths: ['100% Conference Win Rate (14 GF / 2 GA)', 'Aggressive second ball hunting', 'Far-post headers on set pieces'],
    weaknesses: ['Two-man central midfield steps high', 'Massive pockets left open in half-spaces', 'Vulnerable to 3v2 central overloads'],
    pivotPlan: 'Keep #6 and #8 tight centrally to outnumber their 2-man midfield 3v2. Win the \"rebound zone\" on direct balls.',
    playmakerPlan: '#10 positioned at peak of triangle in Zone 14. Drag stepping CB and execute 1-touch wall passes.',
    wingsPlan: '#7 and #11 pin their fullbacks wide. Underlap into vacated space behind their defense.',
    pressTrigger: '"The Third-Man Combination": #9 checks to drag CB, #10 wall passes to sprinting winger.',
    targetZones: ['Half-spaces (massive pockets)', 'Zone 14'],
    film: [
      { title: 'AHFC 14B West Premier vs VCF 2013 White', url: 'https://www.youtube.com/watch?v=r14LWaphMW0', duration: '1:20:00' },
      { title: 'AHFC 14B West Premier vs Hays 2013 Boys', url: 'https://www.youtube.com/watch?v=t7mAS1yAMGo', duration: '1:07:20' },
      { title: 'AHFC 13B Premier vs GFI Gold — Rise Houston Warm-Up Cup', url: 'https://www.youtube.com/watch?v=Ch2iYGboDUw', duration: 'Highlights' },
      { title: 'AHFC 14B West vs VCB Houston 15B Black', url: 'https://www.youtube.com/watch?v=smiGWmSL5Qs', duration: '32:40' }
    ]
  },`;

const startIdx = js.indexOf("  'AHFC SW Blue': {");
const nextKeyIdx = js.indexOf("  'North Shore FC White': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedAHFCData + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced AHFC Data');
} else {
    console.log('Could not find block');
}
