const fs = require('fs');

let js = fs.readFileSync('scouting.js', 'utf8');

const updatedSouthData = `  'HTX South Gold': {
    id: '240319',
    formation: '4-3-3 (Aggressive attacking fullbacks, high line)',
    strengths: ['Highest scoring team in cluster (47 GF)', 'Offensive transition speed', 'Fullback overlapping'],
    weaknesses: ['Conceding the most goals (49 GA)', 'Aggressive fullbacks leave backline isolated', 'High offside line vulnerability'],
    pivotPlan: 'Maintain a disciplined, compact back four and keep double pivot (#6 & #8) screening 10-12 yards in front of CBs.',
    playmakerPlan: 'Vacate wide touchlines and tuck inside as dual attacking midfielders. #10 bypasses pressing wave with direct diagonal through-balls.',
    wingsPlan: 'Wingers (#7 & #11) tuck inside. Sprint into wide counter corridors behind their aggressive fullbacks.',
    pressTrigger: '"The Mid-Block Ambush": Allow CBs to step across midfield, #6 or #8 tackles from blind side as they pass into attacking mids.',
    targetZones: ['Zones 11 & 17 (Deep flank channels behind back four)', 'Isolated center-backs in footraces without defensive cover'],
    film: [
      { title: 'Solar STX 15B vs HTX South Gold Part 1', url: 'https://www.youtube.com/watch?v=N6oJxEcP0Mg', duration: '36:38' },
      { title: 'HTX South Gold vs HTX West Gold', url: 'https://www.youtube.com/watch?v=LGieQ1uiYlU', duration: '2:22' },
      { title: 'HTX South Gold vs HTX West Gold (25-26 Season)', url: 'https://www.youtube.com/watch?v=ypdEr_wcGKw', duration: 'Highlights' },
      { title: 'Veo Match Film: Girls vs HTX South 12G Aspire', url: 'https://app.veo.co/matches/20250824-girls-teams-vs-htx-south-12g-aspire-6e7c3547/', duration: 'Highlights' }
    ]
  },`;

const startIdx = js.indexOf("  'HTX South Gold': {");
const nextKeyIdx = js.indexOf("  'HTX Central Gold': {");

if (startIdx !== -1 && nextKeyIdx !== -1) {
    const originalBlock = js.substring(startIdx, nextKeyIdx);
    js = js.replace(originalBlock, updatedSouthData + '\n');
    fs.writeFileSync('scouting.js', js);
    console.log('Replaced South Data');
} else {
    console.log('Could not find block');
}
