const https = require('https');
const fs = require('fs');

const url = 'https://system.gotsport.com/splash/34041/events/54831/results?group=534266';
const indexFile = 'index.html';

console.log('Fetching live standings from GotSport...');

https.get(url, (res) => {
    let html = '';
    res.on('data', chunk => { html += chunk; });
    res.on('end', () => {
        console.log('GotSport data fetched successfully. Parsing table...');
        
        const regex = /<tr>\s*<td>\s*(\d+)\s*<\/td>\s*<td>\s*<a[^>]+>([^<]+)<\/a>\s*<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(\d+)<\/td>\s*<td>(-?\d+)<\/td>\s*<td>(\d+)<\/td>/g;
        
        let match;
        const liveStats = {};
        
        while ((match = regex.exec(html)) !== null) {
            const rank = parseInt(match[1].trim());
            const fullName = match[2].trim().toLowerCase();
            const mp = parseInt(match[3]);
            const w = parseInt(match[4]);
            const l = parseInt(match[5]);
            const d = parseInt(match[6]);
            const gf = parseInt(match[7]);
            const ga = parseInt(match[8]);
            const gd = parseInt(match[9]);
            const pts = parseInt(match[10]);
            
            liveStats[fullName] = { rank, mp, w, l, d, gf, ga, gd, pts };
        }
        
        if (Object.keys(liveStats).length === 0) {
            console.error('Failed to parse standings from GotSport HTML.');
            return;
        }

        console.log(`Found live stats for ${Object.keys(liveStats).length} teams. Updating index.html...`);

        let indexHtml = fs.readFileSync(indexFile, 'utf8');
        let changesMade = 0;
        
        const teamsToMatch = [
            { key: "Houstonians FC N", search: "houstonians fc n" },
            { key: "Real Greens", search: "real greens" },
            { key: "AHFC SW Blue", search: "ahfc sw blue" },
            { key: "Houston Dutch Lions Elite", search: "houston dutch lions fc elite" },
            { key: "HTX Central Gold", search: "htx central gold" },
            { key: "HTX Woodlands Gold", search: "htx woodlands gold" },
            { key: "HTX West Gold", search: "htx west gold" },
            { key: "HTX South Gold", search: "htx south gold" },
            { key: "North Shore FC White", search: "north shore fc white" }
        ];

        teamsToMatch.forEach(team => {
            const liveKey = Object.keys(liveStats).find(k => k.includes(team.search));
            if (liveKey) {
                const stats = liveStats[liveKey];
                
                const altBlockRegex = new RegExp(`(rank:\\s*)\\d+([\\s\\S]*?name:\\s*'${team.key}'[\\s\\S]*?mp:\\s*)\\d+(,\\s*w:\\s*)\\d+(,\\s*l:\\s*)\\d+(,\\s*d:\\s*)\\d+(,\\s*gf:\\s*)\\d+(,\\s*ga:\\s*)\\d+(,\\s*gd:\\s*)-?\\d+(,\\s*pts:\\s*)\\d+`, 'i');
                if (altBlockRegex.test(indexHtml)) {
                    indexHtml = indexHtml.replace(altBlockRegex, 
                        `$1${stats.rank}$2${stats.mp}$3${stats.w}$4${stats.l}$5${stats.d}$6${stats.gf}$7${stats.ga}$8${stats.gd}$9${stats.pts}`
                    );
                    changesMade++;
                } else {
                    console.log("Could not find regex match for: " + team.key);
                }
            } else {
                console.log("Could not find live data match for: " + team.key);
            }
        });

        fs.writeFileSync(indexFile, indexHtml, 'utf8');
        console.log(`Successfully updated ${changesMade} teams in index.html!`);
    });
}).on('error', (err) => {
    console.error('Error fetching data: ', err.message);
});
