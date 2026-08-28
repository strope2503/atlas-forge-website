const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract officialLeagueMatches
const matchStart = html.indexOf('const officialLeagueMatches = [');
const matchEnd = html.indexOf('];', matchStart) + 2;
const matchesCode = html.slice(matchStart, matchEnd).replace('const officialLeagueMatches', 'officialLeagueMatches');

let officialLeagueMatches = [];
eval(matchesCode);

console.log(`Found ${officialLeagueMatches.length} official league matches`);

function parseEventDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [y, m, d] = dateStr.split('-');
  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeMatch) return null;
  let hours = parseInt(timeMatch[1], 10);
  const mins = parseInt(timeMatch[2], 10);
  const ampm = timeMatch[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  // CDT is UTC-5
  return new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d), hours + 5, mins));
}

const CRLF = '\r\n';
const nowDt = new Date();
const pad = (n) => String(n).padStart(2, '0');
const dtStamp = nowDt.getUTCFullYear() + pad(nowDt.getUTCMonth()+1) + pad(nowDt.getUTCDate()) + 'T' + pad(nowDt.getUTCHours()) + pad(nowDt.getUTCMinutes()) + '00Z';

// ICS text escaping: backslash, semicolons, and commas must be escaped
function icsEscape(text) {
  if (!text) return '';
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

let lines = [];
lines.push('BEGIN:VCALENDAR');
lines.push('VERSION:2.0');
lines.push('PRODID:-//Houston Dutch Lions FC//Elite 2013 U14//EN');
lines.push('CALSCALE:GREGORIAN');
lines.push('METHOD:PUBLISH');
lines.push('X-WR-CALNAME:HDL Elite 2013 U14 Schedule');

// Add all official matches
officialLeagueMatches.forEach(m => {
  const dt = parseEventDateTime(m.date, m.time);
  if (!dt) {
    console.log(`  Skipping match ${m.id} - could not parse date/time: ${m.date} ${m.time}`);
    return;
  }
  const endDt = new Date(dt.getTime() + 90 * 60 * 1000);

  const dtStart = dt.getUTCFullYear() + pad(dt.getUTCMonth()+1) + pad(dt.getUTCDate()) + 'T' + pad(dt.getUTCHours()) + pad(dt.getUTCMinutes()) + '00Z';
  const dtEnd = endDt.getUTCFullYear() + pad(endDt.getUTCMonth()+1) + pad(endDt.getUTCDate()) + 'T' + pad(endDt.getUTCHours()) + pad(endDt.getUTCMinutes()) + '00Z';

  lines.push('BEGIN:VEVENT');
  lines.push(`UID:stxcl-${m.id}@houstondutchlionsfc.com`);
  lines.push(`DTSTAMP:${dtStamp}`);
  lines.push(`SUMMARY:STXCL: HDL Elite vs ${icsEscape(m.opponent)}`);
  lines.push(`DESCRIPTION:STXCL Match #${m.id}. ${m.isHome ? 'HOME' : 'AWAY'} at ${icsEscape(m.location)}. Uniform: ${icsEscape(m.uniform)}. Pack: ${icsEscape(m.bring)}.`);
  lines.push(`LOCATION:${icsEscape(m.location + ', ' + m.address)}`);
  lines.push(`DTSTART:${dtStart}`);
  lines.push(`DTEND:${dtEnd}`);
  lines.push('STATUS:CONFIRMED');
  lines.push('END:VEVENT');

  console.log(`  Added: ${m.opponent} on ${m.date}`);
});

// Add recurring practices
lines.push('BEGIN:VEVENT');
lines.push('UID:hdl-practice-weekly@houstondutchlionsfc.com');
lines.push(`DTSTAMP:${dtStamp}`);
lines.push('SUMMARY:HDL Elite 2013 Practice');
lines.push('DESCRIPTION:Regular weekly team practice. 11v11 Tactical Positioning.');
lines.push('LOCATION:Houston Dutch Lions FC Soccer Facility\\, 14562 Interstate 45 S\\, Conroe\\, TX 77384');
lines.push('RRULE:FREQ=WEEKLY;BYDAY=MO,TU,TH;UNTIL=20261130T235959Z');
lines.push('DTSTART:20260824T234500Z');
lines.push('DTEND:20260825T010000Z');
lines.push('STATUS:CONFIRMED');
lines.push('END:VEVENT');

lines.push('END:VCALENDAR');

// Join with CRLF and write
const icsContent = lines.join(CRLF) + CRLF;
const outPath = path.join(__dirname, 'hdl_schedule.ics');
fs.writeFileSync(outPath, icsContent, 'utf8');
console.log(`\nWrote ${outPath} (${icsContent.length} bytes, ${lines.length} lines)`);
