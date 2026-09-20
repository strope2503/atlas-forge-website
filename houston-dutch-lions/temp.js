
    const SHEET_ID = '13ZOQxIllvOSSNXn10lA5qCsZv38FCtDVLg5kqrVoAqQ';
    
    // Global dynamic roster data
    let globalRosterData = [];

    // ==========================================
    // TRANSLATION DICTIONARY
    // ==========================================
    const translations = {
      en: {
        field_status_text: "HDL Soccer Facility: All Fields OPEN & Playable.",
        next_match_badge: "Next Match",
        home_label: "HOME",
        away_label: "AWAY",
        kickoff_time: "Kick-Off:",
        arrival_time: "Arrival / Call:",
        uniform_color: "Uniform:",
        field_location: "Location:",
        btn_maps: "Field Map",
        upcoming_events_title: "Upcoming Schedule",
        subscribe_calendar: "Click to subscribe and add all events to your calendar",
        practice_badge: "PRACTICE",
        league_game_badge: "LEAGUE GAME",
        practice_focus: "Focus: 11v11 Tactical Positioning & Ball Circulation",
        event_call_time: "Call Time: 8:15 AM | Orange Jersey",
        skills_title: "11v11 Dutch System & Position Skills",
        skills_subtitle: "Select a position for role guidelines and home homework.",
        key_skills_header: "Key Match Responsibilities:",
        home_drill_header: "10-Minute Home Practice Drill:",
        roster_title: "Elite 2013 Roster & Stats",
        roster_subtitle: "Houston Dutch Lions Elite 2013 Official Squad",
        stat_goals: "Goals",
        stat_assists: "Assists",
        stat_cleans: "Clean S.",
        directory_title: "Parent Contact Directory",
        directory_subtitle: "Private team phone & carpool roster.",
        pin_required: "Enter Team PIN to view parent contacts",
        btn_submit_pin: "Enter",
        nav_schedule: "Schedule",
        nav_skills: "Skills",
        nav_roster: "Roster",
        nav_contacts: "Contacts",
        rel_dad: "- Dad",
        rel_mom: "- Mom",
        media_title: "Media & Highlights",
        media_subtitle: "Game day photos, videos, and team social updates.",
        nav_media: "Media",
        upload_photos: "Upload Game Photos & Videos",
        tactics_title: "Interactive Tactics Board"
      },
      es: {
        field_status_text: "Complejo HDL: Todas las Canchas ABIERTAS y en juego.",
        next_match_badge: "Próximo Partido",
        home_label: "LOCAL",
        away_label: "VISITANTE",
        kickoff_time: "Inicio de Partido:",
        arrival_time: "Hora de Convocatoria:",
        uniform_color: "Indumentaria:",
        field_location: "Ubicación / Cancha:",
        btn_maps: "Mapa de la Cancha",
        upcoming_events_title: "Calendario de Partidos y Prácticas",
        subscribe_calendar: "Sincronizar Calendario",
        practice_badge: "ENTRENAMIENTO",
        league_game_badge: "PARTIDO DE LIGA",
        practice_focus: "Enfoque: Posicionamiento táctico y circulación del balón",
        event_call_time: "Convocatoria: 8:15 AM | Camiseta Naranja",
        skills_title: "Sistema de Juego y Habilidades por Posición",
        skills_subtitle: "Selecciona una posición para ver roles tácticos y ejercicios en casa.",
        key_skills_header: "Responsabilidades Clave en el Partido:",
        home_drill_header: "Ejercicio en Casa (10 Minutos):",
        roster_title: "Plantel y Estadísticas Elite 2013",
        roster_subtitle: "Plantel Oficial Houston Dutch Lions Elite 2013",
        stat_goals: "Goles",
        stat_assists: "Asistencias",
        stat_cleans: "Vallas Inv.",
        directory_title: "Directorio Telefónico de Padres",
        directory_subtitle: "Contactos privados y coordinación de traslados.",
        pin_required: "Ingresa el PIN del equipo para ver los contactos",
        btn_submit_pin: "Ingresar",
        nav_schedule: "Calendario",
        nav_skills: "Habilidades",
        nav_roster: "Plantel",
        nav_contacts: "Contactos",
        rel_dad: "- Papá",
        rel_mom: "- Mamá",
        media_title: "Medios y Destacados",
        media_subtitle: "Fotos de partidos, videos y redes sociales.",
        nav_media: "Medios",
        upload_photos: "Subir Fotos y Videos del Partido",
        tactics_title: "Pizarra Táctica Interactiva"
      }
    };

    let currentLang = 'en';

    function initLiveMatchPolling() {
        const GID_LIVE = '1766940121';
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&gid=${GID_LIVE}&t=${Date.now()}`;
        
        const poll = () => {
            fetch(url)
                .then(res => res.text())
                .then(text => {
                    const jsonStr = text.substring(text.indexOf('google.visualization.Query.setResponse(') + 39, text.length - 2);
                    const data = JSON.parse(jsonStr);
                    if (data.table && data.table.rows && data.table.rows.length > 0) {
                        const cols = data.table.cols.map(c => c.label);
                        const row = data.table.rows[0].c;
                        let matchData = {};
                        cols.forEach((col, i) => { matchData[col] = row[i] ? (row[i].f || row[i].v) : ''; });
                        updateLiveMatchUI(matchData);
                    }
                });
        };
        poll();
        setInterval(poll, 30000);
    }

    function updateLiveMatchUI(matchData) {
        const container = document.getElementById('live-match-container');
        const status = (matchData['Status'] || '').toUpperCase();
        
        if (status === 'LIVE' || status.includes('HALF') || status === 'FINAL' || status.includes('DELAY')) {
            // Show scoreboard
            container.classList.remove('hidden');
            
            document.getElementById('live-home-team').textContent = matchData['Home Team'] || 'Home';
            document.getElementById('live-away-team').textContent = matchData['Away Team'] || 'Away';
            
            document.getElementById('live-home-score').textContent = matchData['Home Score'] || '0';
            document.getElementById('live-away-score').textContent = matchData['Away Score'] || '0';
            
            document.getElementById('live-match-status').textContent = status;
            document.getElementById('live-updates-text').textContent = matchData['Live Updates'] || 'No updates yet...';
            
            // If final, maybe change styling to not pulse red
            const indicator = container.querySelector('.bg-red-600') || container.querySelector('.bg-slate-700');
            if (status === 'FINAL') {
                indicator.className = 'absolute top-0 right-0 px-3 py-1 bg-slate-700 text-white text-[10px] font-bold tracking-widest flex items-center gap-1.5 rounded-bl-lg';
                indicator.innerHTML = 'FINAL';
            } else {
                indicator.className = 'absolute top-0 right-0 px-3 py-1 bg-red-600 text-white text-[10px] font-bold tracking-widest flex items-center gap-1.5 rounded-bl-lg';
                indicator.innerHTML = '<span class="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE';
            }
        } else {
            // Hide scoreboard if 'PREGAME' or empty
            container.classList.add('hidden');
        }
    }

    function fetchMediaData() {
        const GID_MEDIA = '2101276011';
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&gid=${GID_MEDIA}&t=${Date.now()}`;
        
        fetch(url)
            .then(res => res.text())
            .then(text => {
                const jsonStr = text.substring(text.indexOf('google.visualization.Query.setResponse(') + 39, text.length - 2);
                const data = JSON.parse(jsonStr);
                processMediaData(data);
            })
            .catch(err => {
                console.error("Error fetching Media data:", err);
                document.getElementById('dynamic-media-container').innerHTML = '<p class="text-xs text-red-400">Failed to load media.</p>';
            });
    }

    function processMediaData(data) {
        const container = document.getElementById('dynamic-media-container');
        if (!data.table.rows || data.table.rows.length === 0) {
            container.innerHTML = '<p class="text-[11px] text-slate-500 italic text-center py-4">No team media posted yet.</p>';
            return;
        }

        const cols = data.table.cols.map(c => c ? c.label : '');
        
        // Group items by Event / Game or Date
        const groupedMedia = {};
        
        data.table.rows.forEach(row => {
            let rowData = {};
            cols.forEach((colName, i) => {
                if (!colName) return;
                const cell = row.c[i];
                rowData[colName] = cell ? (cell.f || cell.v) : '';
            });

            let url = rowData['Media URL'] || rowData['File URL'] || rowData['URL'] || '';
            if (!url && row.c) {
                row.c.forEach(cell => {
                    if (cell && cell.v && String(cell.v).startsWith('http')) {
                        url = String(cell.v);
                    }
                });
            }
            if (!url) return;

            const groupKey = rowData['Event'] || rowData['Game'] || rowData['Date'] || 'Team Highlights';
            if (!groupedMedia[groupKey]) {
                groupedMedia[groupKey] = [];
            }
            groupedMedia[groupKey].push({ ...rowData, 'Media URL': url });
        });

        let html = '';
        for (const [groupTitle, items] of Object.entries(groupedMedia)) {
            html += `
              <div class="mb-5">
                <h4 class="text-xs font-bold text-orange-400 uppercase tracking-wider mb-2.5 flex items-center gap-2 border-b border-slate-800 pb-1">
                  <i data-lucide="film" class="w-4 h-4 text-orange-500"></i> ${groupTitle}
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            `;

            items.forEach(item => {
                const url = item['Media URL'];
                const caption = item['Caption'] || 'Media Item';
                
                let mediaEmbed = '';
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    let videoId = '';
                    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
                    else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
                    mediaEmbed = `<iframe class="w-full aspect-video rounded-lg bg-black shadow" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
                } else if (url.includes('drive.google.com')) {
                    let fileId = '';
                    const match = url.match(/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
                    if (match) fileId = match[1];
                    if (fileId) {
                        mediaEmbed = `<iframe src="https://drive.google.com/file/d/${fileId}/preview" class="w-full aspect-video rounded-lg bg-slate-900 border border-slate-700" allow="autoplay"></iframe>`;
                    } else {
                        mediaEmbed = `<a href="${url}" target="_blank" class="block w-full aspect-video rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center p-4 text-center hover:bg-slate-700 transition"><i data-lucide="external-link" class="w-6 h-6 text-orange-400 mb-1"></i><span class="text-xs text-white font-bold truncate w-full">${caption}</span><span class="text-[10px] text-slate-400">View in Google Drive</span></a>`;
                    }
                } else {
                    mediaEmbed = `<img src="${url}" alt="${caption}" class="w-full aspect-video object-cover rounded-lg bg-slate-900 border border-slate-700 shadow" loading="lazy">`;
                }

                html += `
                    <div class="glass-card p-2 rounded-xl border border-blue-900/40 hover:border-blue-500/50 transition shadow-lg">
                      <p class="text-[10px] font-bold text-slate-300 mb-1.5 truncate flex items-center gap-1.5"><i data-lucide="play-circle" class="w-3.5 h-3.5 text-orange-400 shrink-0"></i> ${caption}</p>
                      ${mediaEmbed}
                    </div>
                `;
            });

            html += `</div></div>`;
        }

        container.innerHTML = html;
        if (window.lucide) lucide.createIcons();
    }

    function uploadPhotosNative(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzxWjJ96mXV_MKku2rMGpxt7Q8LvSiUMlcRYdh74Q_UugT4H16Yu7HFyQn8MxGx0GQ5/exec';
      const progressContainer = document.getElementById('nativeUploadProgress');
      const statusText = document.getElementById('nativeUploadStatus');
      const percentText = document.getElementById('nativeUploadPercent');
      const progressBar = document.getElementById('nativeProgressBar');
      
      progressContainer.classList.remove('hidden');
      statusText.innerText = 'Uploading to team gallery...';
      statusText.className = 'text-orange-400 font-bold';
      progressBar.style.width = '0%';
      percentText.innerText = '0%';
      
      let completed = 0;
      const total = files.length;
      
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(e) {
          const base64Data = e.target.result.split(',')[1];
          const payload = {
            action: 'uploadMedia',
            filename: file.name,
            mimeType: file.type,
            fileData: base64Data
          };
          
          fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
          })
          .then(() => {
            completed++;
            const pct = Math.round((completed / total) * 100);
            progressBar.style.width = pct + '%';
            percentText.innerText = pct + '%';
            
            if (completed === total) {
              statusText.innerHTML = '✨ Success! Media uploaded successfully.';
              statusText.className = 'text-emerald-400 font-bold';
              setTimeout(() => {
                progressContainer.classList.add('hidden');
                fetchMediaData();
              }, 2500);
            }
          })
          .catch(err => {
            console.error('Upload error:', err);
            statusText.innerText = 'Upload complete.';
          });
        };
        reader.readAsDataURL(file);
      });
    }

    function renderStats(data) {
      // Golden Boot
      let topScorers = [...data].sort((a, b) => b.goals - a.goals).slice(0, 3);
      document.getElementById('stats-goals').innerHTML = topScorers.map((p, i) => `
        <div class="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500 w-3">${i + 1}.</span>
            <div class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white">${p.initials}</div>
            <span class="text-xs font-bold text-white">${p.name} <span class="text-slate-500 font-normal">#${p.number}</span></span>
          </div>
          <span class="text-sm font-black text-yellow-400">${p.goals}</span>
        </div>
      `).join('');

      // Playmaker
      let topAssists = [...data].sort((a, b) => b.assists - a.assists).slice(0, 3);
      document.getElementById('stats-assists').innerHTML = topAssists.map((p, i) => `
        <div class="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500 w-3">${i + 1}.</span>
            <div class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white">${p.initials}</div>
            <span class="text-xs font-bold text-white">${p.name} <span class="text-slate-500 font-normal">#${p.number}</span></span>
          </div>
          <span class="text-sm font-black text-blue-400">${p.assists}</span>
        </div>
      `).join('');

      // The Wall
      let topCleans = [...data].sort((a, b) => b.cleanSheets - a.cleanSheets).slice(0, 3);
      document.getElementById('stats-cleans').innerHTML = topCleans.map((p, i) => `
        <div class="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-500 w-3">${i + 1}.</span>
            <div class="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white">${p.initials}</div>
            <span class="text-xs font-bold text-white">${p.name} <span class="text-slate-500 font-normal">#${p.number}</span></span>
          </div>
          <span class="text-sm font-black text-emerald-400">${p.cleanSheets}</span>
        </div>
      `).join('');
    }

    function renderRosterGrid(data) {
      const grid = document.getElementById('rosterGrid');
      grid.innerHTML = '';

      const badge = document.getElementById('rosterCountBadge');
      if (badge) {
        badge.innerText = `${data.length} ${currentLang === 'en' ? 'Players' : 'Jugadores'}`;
      }

      data.forEach(p => {
        const posText = currentLang === 'en' ? p.posEn : p.posEs;
        
        const card = document.createElement('div');
        card.className = "glass-card p-2.5 rounded-2xl border border-blue-900/30 hover:border-orange-500/50 transition flex flex-col justify-between";
        card.innerHTML = `
          <div>
            <div class="flex justify-between items-start">
              <span class="w-6 h-6 rounded-md bg-orange-500 text-white border border-orange-400 flex items-center justify-center font-black text-xs shadow-md">#${p.number}</span>
              ${p.isMvp ? '<span class="px-1.5 py-0.5 bg-orange-500 text-white text-[9px] font-black rounded uppercase tracking-wider shadow">MVP</span>' : ''}
            </div>
            <div class="mt-1.5 text-center">
              ${p.image ? 
                `<img src="${p.image}" class="w-10 h-10 mx-auto rounded-full object-cover border border-orange-400/60 mb-1 shadow" alt="${p.name}">` :
                `<div class="w-10 h-10 mx-auto rounded-full bg-slate-900 border border-orange-400/60 flex items-center justify-center font-black text-white text-[11px] mb-1 shadow">
                  ${p.initials}
                </div>`
              }
              <h4 class="font-bold text-xs text-white truncate">${p.name}</h4>
              <p class="text-[9px] text-slate-400 mb-0.5">🎂 ${p.birthday || 'TBD'}</p>
              <p class="text-[9px] text-orange-300 font-bold tracking-wide truncate">${posText}</p>
            </div>
          </div>
          <div class="mt-2 pt-1.5 border-t border-slate-800 grid grid-cols-3 text-center text-[8px] text-slate-400">
            <div><strong class="text-white block text-[10px]">${p.goals}</strong><span>${translations[currentLang].stat_goals}</span></div>
            <div><strong class="text-white block text-[10px]">${p.assists}</strong><span>${translations[currentLang].stat_assists}</span></div>
            <div><strong class="text-white block text-[10px]">${p.cleanSheets}</strong><span>${translations[currentLang].stat_cleans}</span></div>
          </div>
        `;
        grid.appendChild(card);
      });

      if (window.lucide) lucide.createIcons();
    }

    let signupsMap = new Map();

    function addSignupEntry(rawDate, name, role) {
      if (!name || !rawDate) return;
      const roleStr = String(role || '').toLowerCase();
      if (!roleStr.includes('drink') && !roleStr.includes('snack') && !roleStr.includes('water')) return;

      let monthNum = null; // 1-12
      let dayNum = null;   // 1-31
      let yearNum = 2026;

      const dateStr = String(rawDate).trim();

      if (dateStr.includes('T')) {
          const dObj = new Date(dateStr);
          if (!isNaN(dObj.getTime())) {
              monthNum = dObj.getUTCMonth() + 1;
              dayNum = dObj.getUTCDate();
              yearNum = dObj.getUTCFullYear();
          }
      } else if (dateStr.match(/^\d{4}-\d{1,2}-\d{1,2}/)) {
          const parts = dateStr.split('-');
          yearNum = parseInt(parts[0], 10);
          monthNum = parseInt(parts[1], 10);
          dayNum = parseInt(parts[2], 10);
      } else if (dateStr.match(/^\d{1,2}\/\d{1,2}(\/\d{2,4})?/)) {
          const parts = dateStr.split('/');
          monthNum = parseInt(parts[0], 10);
          dayNum = parseInt(parts[1], 10);
          if (parts[2]) {
              yearNum = parseInt(parts[2], 10);
              if (yearNum < 100) yearNum += 2000;
          }
      } else {
          const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
          const monthShorts = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
          const lower = dateStr.toLowerCase();
          for (let i = 0; i < 12; i++) {
              if (lower.includes(monthNames[i]) || lower.includes(monthShorts[i])) {
                  monthNum = i + 1;
                  const matchDay = dateStr.match(/\b([0-3]?\d)\b/);
                  if (matchDay) dayNum = parseInt(matchDay[1], 10);
                  break;
              }
          }
      }

      if (monthNum && dayNum) {
          const monthNamesFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const mFull = monthNamesFull[monthNum - 1];
          const mShort = monthNamesShort[monthNum - 1];
          const dStrPadded = String(dayNum).padStart(2, '0');
          const mStrPadded = String(monthNum).padStart(2, '0');
          const yStr = String(yearNum);

          const keys = [
              `${mFull} ${dayNum}`,
              `${yStr}-${mStrPadded}-${dStrPadded}`,
              `${mShort} ${dayNum}`,
              `${mShort}${dayNum}`,
              `${monthNum}/${dayNum}`,
              `${monthNum}/${dayNum}/${yStr}`
          ];

          keys.forEach(k => {
              if (!signupsMap.has(k)) {
                  signupsMap.set(k, { drinks: [] });
              }
              const list = signupsMap.get(k).drinks;
              if (!list.includes(name)) {
                  list.push(name);
              }
          });
      }
    }

    function fetchSignups() {
      const scriptUrl = "https://script.google.com/macros/s/AKfycbzxWjJ96mXV_MKku2rMGpxt7Q8LvSiUMlcRYdh74Q_UugT4H16Yu7HFyQn8MxGx0GQ5/exec?_cb=" + new Date().getTime();
      
      return fetch(scriptUrl)
        .then(response => response.json())
        .then(data => {
          signupsMap.clear();
          
          if (Array.isArray(data)) {
            data.forEach(row => {
              addSignupEntry(row.date, row.name, row.role);
            });
          }
          
          if (typeof renderCalendar === 'function') renderCalendar();
          if (typeof renderEventList === 'function') renderEventList();
          if (window.lucide) lucide.createIcons();
        })
        .catch(err => console.error('Error fetching signups:', err));
    }

    function checkDirectoryPin() {
      const pin = document.getElementById('directory-pin').value;
      if (pin === '2013') {
          localStorage.setItem('hdl_directory_unlocked', 'true');
          document.getElementById('directory-lock-view').classList.add('hidden');
          document.getElementById('directory-unlocked-view').classList.remove('hidden');
      } else {
          document.getElementById('directory-pin-error').classList.remove('hidden');
          document.getElementById('directory-pin').value = '';
      }
    }

    // Auto-unlock if previously unlocked
    document.addEventListener("DOMContentLoaded", () => {
        if (localStorage.getItem('hdl_directory_unlocked') === 'true') {
            const lockView = document.getElementById('directory-lock-view');
            const unlockedView = document.getElementById('directory-unlocked-view');
            if (lockView && unlockedView) {
                lockView.classList.add('hidden');
                unlockedView.classList.remove('hidden');
            }
        }
    });

    window.processRosterData = function(json) {
      const dirList = document.getElementById('directoryList');
      dirList.innerHTML = '';
      
      let rosterMap = new Map();
      
      const cols = json.table.cols;
      json.table.rows.forEach(r => {
        let row = {};
        cols.forEach((col, i) => {
            if (col && col.label) {
                let cell = r.c[i];
                if (cell) {
                   row[col.label] = cell.f ? cell.f : (cell.v !== null ? String(cell.v) : "");
                } else {
                   row[col.label] = "";
                }
            }
        });
        
        const firstName = row['First Name'] ? row['First Name'].replace(/ -$/, '').trim() : '';
        const lastNameField = row['Last name'] ? row['Last name'].trim() : '';
        const phone = row['Phone'] ? row['Phone'].trim() : '';
        const email = row['Email'] ? row['Email'].trim() : '';
        const position = row['Postion'] ? row['Postion'].trim() : '';
        
        if (!firstName && !lastNameField) return;
        
        // Skip coaches
        if (firstName.toLowerCase().includes('coach') || position.toLowerCase() === 'coach') return;
        
        // Extract player info
        let playerName = 'Unknown';
        let playerNumber = '0';
        const match = lastNameField.match(/(.*?)\s*#(\d+)/);
        if (match) {
            playerName = match[1].trim();
            playerNumber = match[2];
        } else {
            playerName = lastNameField.split('-')[0].replace(/\s*#\s*$/, '').trim();
        }
        
        const playerKey = playerNumber + '-' + playerName;
        if (!rosterMap.has(playerKey)) {
            let initials = playerName.substring(0, 2).toUpperCase();
            let names = playerName.split(' ');
            if (names.length >= 2) {
                initials = names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
            }
            
            let bdayRaw = row['Birthday'] ? String(row['Birthday']).trim() : "";
            let bdayMMDD = "";
            let bdayDisplay = "TBD";
            if (bdayRaw) {
                bdayDisplay = bdayRaw;
                let bMatch = bdayRaw.match(/^(\d{1,2})[\/\-](\d{1,2})/);
                if (bMatch) {
                    bdayMMDD = bMatch[1].padStart(2, '0') + '-' + bMatch[2].padStart(2, '0');
                }
            }
            
            rosterMap.set(playerKey, {
                number: playerNumber,
                name: playerName,
                posEn: position || 'Player',
                posEs: position || 'Jugador',
                initials: initials,
                image: row['Image URL'] ? String(row['Image URL']).trim() : null,
                goals: row['Goals'] ? parseInt(row['Goals']) : 0,
                assists: row['Assists'] ? parseInt(row['Assists']) : 0,
                cleanSheets: row['Clean Sheets'] ? parseInt(row['Clean Sheets']) : 0,
                isMvp: row['MVP'] === 'Yes',
                birthday: bdayDisplay,
                birthdayMMDD: bdayMMDD
            });
        } else {
            // If the player exists but we found their birthday (or stats) on a second row (like Mom's row vs Dad's row)
            let existingPlayer = rosterMap.get(playerKey);
            if (row['Image URL'] && !existingPlayer.image) {
                existingPlayer.image = String(row['Image URL']).trim();
            }
            if (row['Birthday'] && (existingPlayer.birthday === "TBD" || !existingPlayer.birthday)) {
                let bdayRaw = String(row['Birthday']).trim();
                existingPlayer.birthday = bdayRaw;
                let bMatch = bdayRaw.match(/^(\d{1,2})[\/\-](\d{1,2})/);
                if (bMatch) {
                    existingPlayer.birthdayMMDD = bMatch[1].padStart(2, '0') + '-' + bMatch[2].padStart(2, '0');
                }
            }
            if (row['Goals']) existingPlayer.goals = parseInt(row['Goals']);
            if (row['Assists']) existingPlayer.assists = parseInt(row['Assists']);
            if (row['Clean Sheets']) existingPlayer.cleanSheets = parseInt(row['Clean Sheets']);
            if (row['MVP'] === 'Yes') existingPlayer.isMvp = true;
        }
        
        // Render directory card
        let relSuffixHTML = "";
        let cleanLastName = lastNameField;
        if (cleanLastName.toLowerCase().includes("- dad")) {
            relSuffixHTML = `<span class="text-slate-400 font-medium ml-1" data-i18n="rel_dad">${translations[currentLang].rel_dad}</span>`;
            cleanLastName = cleanLastName.replace(/\s*-\s*Dad/i, '');
        } else if (cleanLastName.toLowerCase().includes("- mom")) {
            relSuffixHTML = `<span class="text-slate-400 font-medium ml-1" data-i18n="rel_mom">${translations[currentLang].rel_mom}</span>`;
            cleanLastName = cleanLastName.replace(/\s*-\s*Mom/i, '');
        }
        cleanLastName = cleanLastName.replace(/\s*#\d*/, '').trim();

        let displayNameHTML = "";
        let numHTML = playerNumber !== '0' ? ` <span class="text-orange-400 font-mono">#${playerNumber}</span>` : '';
        if (firstName && cleanLastName) {
            displayNameHTML = `${firstName} <span class="text-slate-500 mx-1">-</span> <span class="text-slate-300">(${cleanLastName}${numHTML})</span> ${relSuffixHTML}`;
        } else if (firstName) {
            displayNameHTML = `${firstName} ${relSuffixHTML}`;
        } else {
            displayNameHTML = `${cleanLastName}${numHTML} ${relSuffixHTML}`;
        }
        
        const vcardFirst = firstName ? firstName.trim() : '';
        const vcardLast = lastNameField ? lastNameField.trim() : '';
        const vcardFullName = (vcardFirst + " " + vcardLast).trim();
        const cleanPhoneNum = phone ? phone.replace(/[^0-9+]/g, '') : '';
        
        let vcardLines = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `N:${vcardLast};${vcardFirst};;;`,
            `FN:${vcardFullName}`
        ];
        if (cleanPhoneNum) vcardLines.push(`TEL;TYPE=CELL,VOICE:${cleanPhoneNum}`);
        if (email) vcardLines.push(`EMAIL;TYPE=INTERNET:${email.trim()}`);
        vcardLines.push("END:VCARD");
        
        const vcardData = vcardLines.join('\r\n');
        const vcardBase64 = btoa(unescape(encodeURIComponent(vcardData)));
        const vcardUrl = 'data:text/vcard;charset=utf-8;base64,' + vcardBase64;
        const card = document.createElement('div');
        card.className = "p-2.5 bg-slate-950/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3";
        
        card.innerHTML = `
          <div>
            <strong class="text-white block text-xs sm:text-sm">${displayNameHTML}</strong>
            <span class="text-slate-400 text-[10px] sm:text-xs">${email || 'No email provided'}</span>
          </div>
          <div class="flex gap-1.5 items-center self-end sm:self-auto">
            ${phone ? `<a href="tel:${phone}" class="p-2 bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg transition" title="Call"><i data-lucide="phone" class="w-4 h-4"></i></a>` : ''}
            ${phone ? `<a href="sms:${phone}" class="p-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition" title="Text"><i data-lucide="message-square" class="w-4 h-4"></i></a>` : ''}
            ${phone ? `<a href="${vcardUrl}" download="${vcardFullName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.vcf" onclick="downloadVCard(event, '${vcardUrl}')" class="py-2 px-3 border border-slate-600 hover:border-slate-400 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition flex items-center gap-1.5 ml-1" title="Save Contact">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              <span class="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Save</span>
            </a>` : ''}
          </div>
        `;
        dirList.appendChild(card);
      });
      
      globalRosterData = Array.from(rosterMap.values());
      // Sort by number
      globalRosterData.sort((a, b) => parseInt(a.number) - parseInt(b.number));
      renderRosterGrid(globalRosterData);
      renderStats(globalRosterData);
      
      // Calculate upcoming birthdays
      let upcomingBirthdaysHTML = '';
      const today = new Date(currentDate);
      today.setHours(0,0,0,0);
      
      globalRosterData.forEach(p => {
          if (p.birthdayMMDD) {
              const [bMonth, bDay] = p.birthdayMMDD.split('-');
              let nextBday = new Date(today.getFullYear(), parseInt(bMonth)-1, parseInt(bDay));
              
              if (nextBday < today) {
                  nextBday.setFullYear(today.getFullYear() + 1);
              }
              
              const diffTime = nextBday.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays <= 7) {
                  let timeStr = diffDays === 0 ? "Today!" : (diffDays === 1 ? "Tomorrow" : `In ${diffDays} days`);
                  upcomingBirthdaysHTML += `<div class="mb-2 p-3 bg-pink-900/30 border border-pink-500/50 rounded-xl flex items-center justify-between shadow-lg">
                      <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-xl shadow-inner">🎂</div>
                          <div>
                              <h4 class="text-pink-300 font-bold text-sm">Upcoming Birthday</h4>
                              <p class="text-white text-xs">${p.name} turns a year older!</p>
                          </div>
                      </div>
                      <span class="text-pink-400 font-bold text-xs uppercase tracking-wider bg-pink-900/50 px-2 py-1 rounded">${timeStr}</span>
                  </div>`;
              }
          }
      });
      
      const bdayContainer = document.getElementById('upcoming-birthdays');
      if (bdayContainer) {
          if (upcomingBirthdaysHTML) {
              bdayContainer.innerHTML = upcomingBirthdaysHTML;
              bdayContainer.classList.remove('hidden');
          } else {
              bdayContainer.classList.add('hidden');
              bdayContainer.innerHTML = '';
          }
      }

      fetchEventsData();
    };

    function fetchAndRenderDirectory() {
      const script = document.createElement('script');
      script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json;responseHandler:processRosterData&headers=1&gid=313460202&t=${Date.now()}`;
      document.body.appendChild(script);
    }

    function fetchEventsData() {
      const script = document.createElement('script');
      script.src = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json;responseHandler:processEventsData&headers=1&gid=1253580532&t=${Date.now()}`;
      document.body.appendChild(script);
    }

    // ==========================================
    // OFFICIAL STXCL LEAGUE FIXTURES & BRACKET TEAMS
    // ==========================================
    const officialLeagueMatches = [
      {
        id: '201583',
        date: '2026-09-12',
        time: '2:00 PM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        homeLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        awayTeam: 'HTX Woodlands Gold STXCL EC BU14',
        awayLogo: 'https://system.gotsport.com/system/teams/logos/000/241/436/full/HTXNEWLOGO.jpg?1685906975',
        opponent: 'HTX Woodlands Gold',
        opponentLogo: 'https://system.gotsport.com/system/teams/logos/000/241/436/full/HTXNEWLOGO.jpg?1685906975',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4129162',
        isHome: true,
        location: 'Houston Dutch Lions FC Soccer Facility - Field 1',
        address: '14562 Interstate 45 S, Conroe, TX 77384',
        mapQuery: '14562 Interstate 45 South, Conroe, Texas 77384',
        uniform: 'Orange Jersey (Home Kit)',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911829'
      },
      {
        id: '201585',
        date: '2026-09-19',
        time: '12:00 PM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'HTX West Gold STXCL EC BU14',
        homeLogo: 'https://system.gotsport.com/system/teams/logos/000/240/339/full/HTXNEWLOGO.jpg?1685923777',
        awayTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        awayLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        opponent: 'HTX West Gold',
        opponentLogo: 'https://system.gotsport.com/system/teams/logos/000/240/339/full/HTXNEWLOGO.jpg?1685923777',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4140665',
        isHome: false,
        location: 'Lost Creek Park - Field 3',
        address: '3703 Lost Creek Blvd, Sugar Land, TX 77478',
        mapQuery: '3703 Lost Creek Blvd, Sugar Land, TX 77478',
        uniform: 'Blue / White Jersey (Away Kit)',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911831'
      },
      {
        id: '201590',
        date: '2026-09-26',
        time: '2:00 PM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        homeLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        awayTeam: 'HTX South Gold STXCL EC BU14',
        awayLogo: 'https://system.gotsport.com/system/teams/logos/000/240/319/full/HTXNEWLOGO.jpg?1685918311',
        opponent: 'HTX South Gold',
        opponentLogo: 'https://system.gotsport.com/system/teams/logos/000/240/319/full/HTXNEWLOGO.jpg?1685918311',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4140662',
        isHome: true,
        location: 'Houston Dutch Lions FC Soccer Facility - Field 1',
        address: '14562 Interstate 45 S, Conroe, TX 77384',
        mapQuery: '14562 Interstate 45 South, Conroe, Texas 77384',
        uniform: 'Orange Jersey (Home Kit)',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911836'
      },
      {
        id: '201594',
        date: '2026-10-03',
        time: '2:00 PM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'North Shore FC White STXCL EC BU14',
        homeLogo: 'https://system.gotsport.com/system/organizations/logos/000/019/340/full/NSFC_Logo.png?1630180270',
        awayTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        awayLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        opponent: 'North Shore FC White',
        opponentLogo: 'https://system.gotsport.com/system/organizations/logos/000/019/340/full/NSFC_Logo.png?1630180270',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4135684',
        isHome: false,
        location: 'North Shore Park - Field 2',
        address: '14440 Wallisville Rd, Houston, TX 77049',
        mapQuery: '14440 Wallisville Rd, Houston, TX 77049',
        uniform: 'Blue / White Jersey (Away Kit)',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911840'
      },
      {
        id: '201597',
        date: '2026-10-17',
        time: '2:00 PM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        homeLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        awayTeam: 'HOUSTONIANS FC N STXCL EC BU14',
        awayLogo: 'https://system.gotsport.com/system/teams/logos/000/546/899/full/hfc_logo.JPG?1743908138',
        opponent: 'Houstonians FC N',
        opponentLogo: 'https://system.gotsport.com/system/teams/logos/000/546/899/full/hfc_logo.JPG?1743908138',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4193840',
        isHome: true,
        location: 'Houston Dutch Lions FC Soccer Facility - Field 1',
        address: '14562 Interstate 45 S, Conroe, TX 77384',
        mapQuery: '14562 Interstate 45 South, Conroe, Texas 77384',
        uniform: 'Orange Jersey (Home Kit)',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911843'
      },
      {
        id: '201603',
        date: '2026-10-25',
        time: '2:00 PM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'Real Greens STXCL EC BU14',
        homeLogo: 'https://system.gotsport.com/system/teams/logos/000/640/546/full/RG_NEW_LOGO_GOTSPORT.png?1784784570',
        awayTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        awayLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        opponent: 'Real Greens',
        opponentLogo: 'https://system.gotsport.com/system/teams/logos/000/640/546/full/RG_NEW_LOGO_GOTSPORT.png?1784784570',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4293246',
        isHome: false,
        location: 'Houston Dutch Lions FC Soccer Facility - Field 1',
        address: '14562 Interstate 45 S, Conroe, TX 77384',
        mapQuery: '14562 Interstate 45 South, Conroe, Texas 77384',
        uniform: 'Orange Jersey / Both',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911849'
      },
      {
        id: '201604',
        date: '2026-11-01',
        time: '8:00 AM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        homeLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        awayTeam: 'AHFC SW BLUE STXCL EC BU14',
        awayLogo: 'https://system.gotsport.com/system/teams/logos/000/175/983/full/AHFC_Logo.jpg?1636610923',
        opponent: 'AHFC SW BLUE',
        opponentLogo: 'https://system.gotsport.com/system/teams/logos/000/175/983/full/AHFC_Logo.jpg?1636610923',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4318587',
        isHome: true,
        location: 'Houston Dutch Lions FC Soccer Facility - Field 1',
        address: '14562 Interstate 45 S, Conroe, TX 77384',
        mapQuery: '14562 Interstate 45 South, Conroe, Texas 77384',
        uniform: 'Orange Jersey (Home Kit)',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911850'
      },
      {
        id: '201612',
        date: '2026-11-14',
        time: '2:00 PM',
        type: 'league',
        division: 'Boys U14 Bracket B',
        homeTeam: 'HTX Central Gold STXCL EC BU14',
        homeLogo: 'https://system.gotsport.com/system/teams/logos/000/752/439/full/HTXNEWLOGO.jpg?1780627794',
        awayTeam: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        awayLogo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        opponent: 'HTX Central Gold',
        opponentLogo: 'https://system.gotsport.com/system/teams/logos/000/752/439/full/HTXNEWLOGO.jpg?1780627794',
        opponentUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4125791',
        isHome: false,
        location: "Dad's Club Sports Park - Field 1",
        address: '14700 Silverhill Dr, Houston, TX 77048',
        mapQuery: "14700 Silverhill Dr, Houston, TX 77048",
        uniform: 'Blue / White Jersey (Away Kit)',
        bring: 'Both Jerseys, Shin Guards, Cleats, Water',
        matchUrl: 'https://system.gotsport.com/org_event/events/54831/schedules?group=534266&match=26911858'
      }
    ];

    const stxclBracketBTeams = [
      {
        rank: 1,
        id: 546899,
        teamId: 546899,
        name: 'Houstonians FC N',
        fullName: 'HOUSTONIANS FC N STXCL EC BU14',
        clubName: 'Houstonians FC',
        logo: 'https://system.gotsport.com/system/teams/logos/000/546/899/full/hfc_logo.JPG?1743908138',
        website: 'https://www.houstoniansfc.org/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/546899',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4193840',
        coach: 'Coach',
        manager: 'Team Manager',
        points: 0,
        usCanRank: 7583,
        nationalRank: 7336,
        regionalRank: 1863,
        stateRank: 355,
        stateCode: 'TXS',
        games: 3,
        wins: 0,
        draws: 0,
        losses: 3,
        goalsFor: 1,
        goalsAgainst: 12,
        goalRatio: '0.08',
        winPercent: 0,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Oct 17 @ 2:00 PM',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility - Field 1 (Conroe, TX)',
        venue: 'Houston, TX'
      },
      {
        rank: 2,
        id: 640546,
        teamId: 640546,
        name: 'Real Greens',
        fullName: 'Real Greens STXCL EC BU14',
        clubName: 'Real Greens FC',
        logo: 'https://system.gotsport.com/system/teams/logos/000/640/546/full/RG_NEW_LOGO_GOTSPORT.png?1784784570',
        website: 'https://www.realgreensfc.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/640546',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4293246',
        coach: 'Coach',
        manager: 'Team Manager',
        points: 148,
        usCanRank: 6000,
        nationalRank: 5914,
        regionalRank: 1509,
        stateRank: 285,
        stateCode: 'TXS',
        games: 8,
        wins: 3,
        draws: 2,
        losses: 3,
        goalsFor: 16,
        goalsAgainst: 13,
        goalRatio: '1.23',
        winPercent: 38,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sun, Oct 25 @ 2:00 PM',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility - Field 1 (Conroe, TX)',
        venue: 'Houston, TX'
      },
      {
        rank: 3,
        id: 175983,
        teamId: 175983,
        name: 'AHFC SW Blue',
        fullName: 'AHFC SW BLUE STXCL EC BU14',
        clubName: 'Albion Hurricanes FC',
        logo: 'https://system.gotsport.com/system/teams/logos/000/175/983/full/AHFC_Logo.jpg?1636610923',
        website: 'https://www.albionhurricanes.org/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/175983',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4318587',
        coach: 'Cesar Hernandez',
        manager: 'Luisa Soria, Amanda Megat',
        points: 187,
        usCanRank: 6025,
        nationalRank: 5989,
        regionalRank: 1490,
        stateRank: 326,
        stateCode: 'TXS',
        games: 3,
        wins: 3,
        draws: 0,
        losses: 0,
        goalsFor: 14,
        goalsAgainst: 2,
        goalRatio: '7.00',
        winPercent: 100,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sun, Nov 01 @ 8:00 AM',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility - Field 1 (Conroe, TX)',
        venue: 'Katy / SW Houston'
      },
      {
        rank: 4,
        id: 790890,
        teamId: 790890,
        name: 'Houston Dutch Lions Elite',
        fullName: 'Houston Dutch Lions FC Elite STXCL EC BU14',
        clubName: 'Houston Dutch Lions FC',
        logo: 'https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png',
        website: 'https://houstondutchlionsfc.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/790890',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4295509',
        coach: 'Coach',
        manager: 'Team Manager',
        points: 0,
        usCanRank: null,
        nationalRank: null,
        regionalRank: null,
        stateRank: null,
        stateCode: 'TXS',
        games: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalRatio: '0.00',
        winPercent: 0,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        isOurTeam: true,
        matchVsHDL: '—',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility (Conroe, TX)',
        venue: 'HDL Soccer Complex (Conroe, TX)'
      },
      {
        rank: 5,
        id: 752439,
        teamId: 752439,
        name: 'HTX Central Gold',
        fullName: 'HTX Central Gold STXCL EC BU14',
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/752/439/full/HTXNEWLOGO.jpg?1780627794',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/752439',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4125791',
        coach: 'Carlos Ortiz',
        manager: 'Stetson Isdale',
        points: 187,
        usCanRank: 5275,
        nationalRank: 5227,
        regionalRank: 1314,
        stateRank: 252,
        stateCode: 'TXS',
        games: 5,
        wins: 3,
        draws: 0,
        losses: 2,
        goalsFor: 12,
        goalsAgainst: 8,
        goalRatio: '1.50',
        winPercent: 60,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Nov 14 @ 2:00 PM',
        matchVenue: "Dad's Club Sports Park - Field 1 (14700 Silverhill Dr, Houston, TX 77048)",
        venue: "Dad's Club Sports Park (Houston, TX)"
      },
      {
        rank: 6,
        id: 241436,
        teamId: 241436,
        name: 'HTX Woodlands Gold',
        fullName: 'HTX Woodlands Gold STXCL EC BU14',
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/241/436/full/HTXNEWLOGO.jpg?1685906975',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/241436',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4129162',
        coach: 'Marcus Watt',
        manager: 'Stetson Isdale',
        points: 777,
        usCanRank: 3095,
        nationalRank: 3074,
        regionalRank: 767,
        stateRank: 138,
        stateCode: 'TXS',
        games: 27,
        wins: 7,
        draws: 4,
        losses: 16,
        goalsFor: 26,
        goalsAgainst: 45,
        goalRatio: '0.58',
        winPercent: 26,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Sep 12 @ 2:00 PM',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility - Field 1 (Conroe, TX)',
        venue: 'The Woodlands, TX'
      },
      {
        rank: 7,
        id: 240339,
        teamId: 240339,
        name: 'HTX West Gold',
        fullName: 'HTX West Gold STXCL EC BU14',
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/240/339/full/HTXNEWLOGO.jpg?1685923777',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/240339',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4140665',
        coach: 'Simon Mattar',
        manager: 'Stetson Isdale',
        points: 494,
        usCanRank: 3881,
        nationalRank: 3860,
        regionalRank: 983,
        stateRank: 178,
        stateCode: 'TXS',
        games: 21,
        wins: 4,
        draws: 4,
        losses: 13,
        goalsFor: 15,
        goalsAgainst: 34,
        goalRatio: '0.44',
        winPercent: 19,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Sep 19 @ 12:00 PM',
        matchVenue: 'Lost Creek Park - Field 3 (3703 Lost Creek Blvd, Sugar Land, TX 77478)',
        venue: 'Lost Creek Park (Sugar Land, TX)'
      },
      {
        rank: 8,
        id: 240319,
        teamId: 240319,
        name: 'HTX South Gold',
        fullName: 'HTX South Gold STXCL EC BU14',
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/240/319/full/HTXNEWLOGO.jpg?1685918311',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/240319',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4140662',
        coach: 'Liam Green',
        manager: 'Stetson Isdale',
        points: 1326,
        usCanRank: 2072,
        nationalRank: 2055,
        regionalRank: 520,
        stateRank: 87,
        stateCode: 'TXS',
        games: 29,
        wins: 11,
        draws: 4,
        losses: 14,
        goalsFor: 47,
        goalsAgainst: 49,
        goalRatio: '0.96',
        winPercent: 38,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Sep 26 @ 2:00 PM',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility - Field 1 (Conroe, TX)',
        venue: 'South Houston / Friendswood'
      },
      {
        rank: 9,
        id: 135996,
        teamId: 135996,
        name: 'North Shore FC White',
        fullName: 'North Shore FC White STXCL EC BU14',
        clubName: 'North Shore FC',
        logo: 'https://system.gotsport.com/system/organizations/logos/000/019/340/full/NSFC_Logo.png?1630180270',
        website: 'https://www.northshorefc.org/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/135996',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4135684',
        coach: 'Javier Morales',
        manager: 'Team Manager',
        points: 0,
        usCanRank: 7583,
        nationalRank: 7336,
        regionalRank: 1863,
        stateRank: 355,
        stateCode: 'TXS',
        games: 3,
        wins: 0,
        draws: 0,
        losses: 3,
        goalsFor: 2,
        goalsAgainst: 24,
        goalRatio: '0.08',
        winPercent: 0,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Oct 03 @ 2:00 PM',
        matchVenue: 'North Shore Park - Field 2 (14440 Wallisville Rd, Houston, TX 77049)',
        venue: 'North Shore Park (Houston, TX)'
      }
    ];

    function renderRankingShield(rank, label) {
      const display = rank ? '#' + rank : 'NR';
      return `
        <div class="flex-1 min-w-[55px] flex flex-col items-center justify-center bg-slate-950 border border-emerald-500/60 rounded-xl py-2 px-1 text-center shadow-lg relative overflow-hidden">
          <span class="text-xs sm:text-sm font-black text-emerald-300 tracking-tight font-mono">${display}</span>
          <span class="text-[8px] font-black uppercase tracking-wider text-slate-400 mt-0.5">${label}</span>
        </div>
      `;
    }

    function renderStandings() {
      const tbody = document.getElementById('standings-table-body');
      if (!tbody) return;

      let html = '';
      stxclBracketBTeams.forEach(t => {
        const isHDL = t.isOurTeam;
        const rowClass = isHDL 
          ? 'bg-orange-500/20 text-white font-bold border-l-4 border-l-orange-500 shadow-inner' 
          : 'hover:bg-slate-900/60 text-slate-300 transition-colors';
        const rankBadge = isHDL
          ? `<span class="w-5 h-5 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-[10px] mx-auto shadow">${t.rank}</span>`
          : `<span class="text-slate-400 font-semibold">${t.rank}</span>`;

        html += `<tr class="${rowClass} cursor-pointer" onclick="openOpponentModal('${t.id}')">
          <td class="py-2.5 px-3 text-center">${rankBadge}</td>
          <td class="py-2.5 px-3">
            <div class="flex items-center gap-2 group">
              <img src="${t.logo}" alt="${t.name}" class="w-6 h-6 object-contain rounded-full bg-slate-900/80 p-0.5 border border-slate-700/60 group-hover:scale-110 transition-transform shrink-0">
              <div class="min-w-0">
                <div class="${isHDL ? 'text-orange-400 font-extrabold' : 'text-slate-200 group-hover:text-white'} text-xs leading-tight truncate">${t.name}</div>
                <div class="text-[9px] text-slate-400 font-normal truncate max-w-[140px] sm:max-w-none">${t.venue}</div>
              </div>
            </div>
          </td>
          <td class="py-2.5 px-2 text-center text-slate-400">${t.mp}</td>
          <td class="py-2.5 px-2 text-center text-emerald-400 font-bold">${t.w}</td>
          <td class="py-2.5 px-2 text-center text-red-400">${t.l}</td>
          <td class="py-2.5 px-2 text-center text-slate-400">${t.d}</td>
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/752/439/full/HTXNEWLOGO.jpg?1780627794',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/752439',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4125791',
        coach: 'Carlos Ortiz',
        manager: 'Stetson Isdale',
        points: 187,
        usCanRank: 5275,
        nationalRank: 5227,
        regionalRank: 1314,
        stateRank: 252,
        stateCode: 'TXS',
        games: 5,
        wins: 3,
        draws: 0,
        losses: 2,
        goalsFor: 12,
        goalsAgainst: 8,
        goalRatio: '1.50',
        winPercent: 60,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Nov 14 @ 2:00 PM',
        matchVenue: "Dad's Club Sports Park - Field 1 (14700 Silverhill Dr, Houston, TX 77048)",
        venue: "Dad's Club Sports Park (Houston, TX)"
      },
      {
        rank: 6,
        id: 241436,
        teamId: 241436,
        name: 'HTX Woodlands Gold',
        fullName: 'HTX Woodlands Gold STXCL EC BU14',
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/241/436/full/HTXNEWLOGO.jpg?1685906975',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/241436',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4129162',
        coach: 'Marcus Watt',
        manager: 'Stetson Isdale',
        points: 777,
        usCanRank: 3095,
        nationalRank: 3074,
        regionalRank: 767,
        stateRank: 138,
        stateCode: 'TXS',
        games: 27,
        wins: 7,
        draws: 4,
        losses: 16,
        goalsFor: 26,
        goalsAgainst: 45,
        goalRatio: '0.58',
        winPercent: 26,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Sep 12 @ 2:00 PM',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility - Field 1 (Conroe, TX)',
        venue: 'The Woodlands, TX'
      },
      {
        rank: 7,
        id: 240339,
        teamId: 240339,
        name: 'HTX West Gold',
        fullName: 'HTX West Gold STXCL EC BU14',
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/240/339/full/HTXNEWLOGO.jpg?1685923777',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/240339',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4140665',
        coach: 'Simon Mattar',
        manager: 'Stetson Isdale',
        points: 494,
        usCanRank: 3881,
        nationalRank: 3860,
        regionalRank: 983,
        stateRank: 178,
        stateCode: 'TXS',
        games: 21,
        wins: 4,
        draws: 4,
        losses: 13,
        goalsFor: 15,
        goalsAgainst: 34,
        goalRatio: '0.44',
        winPercent: 19,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Sep 19 @ 12:00 PM',
        matchVenue: 'Lost Creek Park - Field 3 (3703 Lost Creek Blvd, Sugar Land, TX 77478)',
        venue: 'Lost Creek Park (Sugar Land, TX)'
      },
      {
        rank: 8,
        id: 240319,
        teamId: 240319,
        name: 'HTX South Gold',
        fullName: 'HTX South Gold STXCL EC BU14',
        clubName: 'HTX Soccer',
        logo: 'https://system.gotsport.com/system/teams/logos/000/240/319/full/HTXNEWLOGO.jpg?1685918311',
        website: 'https://htxsoccer.com/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/240319',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4140662',
        coach: 'Liam Green',
        manager: 'Stetson Isdale',
        points: 1326,
        usCanRank: 2072,
        nationalRank: 2055,
        regionalRank: 520,
        stateRank: 87,
        stateCode: 'TXS',
        games: 29,
        wins: 11,
        draws: 4,
        losses: 14,
        goalsFor: 47,
        goalsAgainst: 49,
        goalRatio: '0.96',
        winPercent: 38,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Sep 26 @ 2:00 PM',
        matchVenue: 'Houston Dutch Lions FC Soccer Facility - Field 1 (Conroe, TX)',
        venue: 'South Houston / Friendswood'
      },
      {
        rank: 9,
        id: 135996,
        teamId: 135996,
        name: 'North Shore FC White',
        fullName: 'North Shore FC White STXCL EC BU14',
        clubName: 'North Shore FC',
        logo: 'https://system.gotsport.com/system/organizations/logos/000/019/340/full/NSFC_Logo.png?1630180270',
        website: 'https://www.northshorefc.org/',
        rankingsUrl: 'https://rankings.gotsport.com/teams/135996',
        gotsportScheduleUrl: 'https://system.gotsport.com/splash/34041/events/54831/schedules?team=4135684',
        coach: 'Javier Morales',
        manager: 'Team Manager',
        points: 0,
        usCanRank: 7583,
        nationalRank: 7336,
        regionalRank: 1863,
        stateRank: 355,
        stateCode: 'TXS',
        games: 3,
        wins: 0,
        draws: 0,
        losses: 3,
        goalsFor: 2,
        goalsAgainst: 24,
        goalRatio: '0.08',
        winPercent: 0,
        mp: 0, w: 0, l: 0, d: 0, gf: 0, ga: 0, gd: 0, pts: 0,
        matchVsHDL: 'Sat, Oct 03 @ 2:00 PM',
        matchVenue: 'North Shore Park - Field 2 (14440 Wallisville Rd, Houston, TX 77049)',
        venue: 'North Shore Park (Houston, TX)'
      }
    ];

    function renderRankingShield(rank, label) {
      const display = rank ? '#' + rank : 'NR';
      return `
        <div class="flex-1 min-w-[55px] flex flex-col items-center justify-center bg-slate-950 border border-emerald-500/60 rounded-xl py-2 px-1 text-center shadow-lg relative overflow-hidden">
          <span class="text-xs sm:text-sm font-black text-emerald-300 tracking-tight font-mono">${display}</span>
          <span class="text-[8px] font-black uppercase tracking-wider text-slate-400 mt-0.5">${label}</span>
        </div>
      `;
    }

    function renderStandings() {
      const tbody = document.getElementById('standings-table-body');
      if (!tbody) return;

      let html = '';
      stxclBracketBTeams.forEach(t => {
        const isHDL = t.isOurTeam;
        const rowClass = isHDL 
          ? 'bg-orange-500/20 text-white font-bold border-l-4 border-l-orange-500 shadow-inner' 
          : 'hover:bg-slate-900/60 text-slate-300 transition-colors';
        const rankBadge = isHDL
          ? `<span class="w-5 h-5 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-[10px] mx-auto shadow">${t.rank}</span>`
          : `<span class="text-slate-400 font-semibold">${t.rank}</span>`;

        html += `<tr class="${rowClass} cursor-pointer" onclick="openOpponentModal('${t.id}')">
          <td class="py-2.5 px-3 text-center">${rankBadge}</td>
          <td class="py-2.5 px-3">
            <div class="flex items-center gap-2 group">
              <img src="${t.logo}" alt="${t.name}" class="w-6 h-6 object-contain rounded-full bg-slate-900/80 p-0.5 border border-slate-700/60 group-hover:scale-110 transition-transform shrink-0">
              <div class="min-w-0">
                <div class="${isHDL ? 'text-orange-400 font-extrabold' : 'text-slate-200 group-hover:text-white'} text-xs leading-tight truncate">${t.name}</div>
                <div class="text-[9px] text-slate-400 font-normal truncate max-w-[140px] sm:max-w-none">${t.venue}</div>
              </div>
            </div>
          </td>
          <td class="py-2.5 px-2 text-center text-slate-400">${t.mp}</td>
          <td class="py-2.5 px-2 text-center text-emerald-400 font-bold">${t.w}</td>
          <td class="py-2.5 px-2 text-center text-red-400">${t.l}</td>
          <td class="py-2.5 px-2 text-center text-slate-400">${t.d}</td>
          <td class="py-2.5 px-2 text-center text-slate-400">${t.gf}</td>
          <td class="py-2.5 px-2 text-center text-slate-400">${t.ga}</td>
          <td class="py-2.5 px-2 text-center text-slate-400">${t.gd}</td>
          <td class="py-2.5 px-3 text-center font-black ${isHDL ? 'text-orange-400 text-sm' : 'text-white'}">${t.pts}</td>
        </tr>`;
      });

      tbody.innerHTML = html;
    }

    function renderOpponents() {
      const grid = document.getElementById('opponent-grid');
      if (!grid) return;

      let html = '';
      fullTeamsAnalytics.forEach(t => {
        const isHDL = t.name === 'Houston Dutch Lions FC';

        let scoutInfo = null;
        if (typeof opponentScoutingDB !== 'undefined') {
          for (const [sName, sData] of Object.entries(opponentScoutingDB)) {
            if (sData.id === t.id || t.name.toLowerCase().includes(sName.toLowerCase()) || sName.toLowerCase().includes(t.name.toLowerCase())) {
              scoutInfo = sData;
              break;
            }
          }
        }

        html += `
          <div class="glass-card p-3 rounded-2xl border ${isHDL ? 'border-orange-500/40 bg-orange-950/10' : 'border-blue-900/40'} space-y-2.5 hover:border-orange-500/40 transition shadow-lg flex flex-col justify-between">
            <div>
              <!-- Top Header -->
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex items-center gap-2.5 min-w-0">
                  <img src="${t.logo}" alt="${t.name}" class="w-10 h-10 object-contain rounded-full bg-slate-950 p-1 border border-slate-700/60 shrink-0 shadow">
                  <div class="min-w-0">
                    <h4 class="font-extrabold text-xs text-white truncate ${isHDL ? 'text-orange-400' : ''}">${t.name}</h4>
                    <p class="text-[10px] text-slate-400 truncate">${t.clubName || t.venue}</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1 shrink-0">
                  <span class="text-[9px] font-black px-1.5 py-0.5 rounded ${t.stateRank ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-400'}">
                    TXS #${t.stateRank || 'NR'}
                  </span>
                  ${scoutInfo && scoutInfo.film && scoutInfo.film.length > 0 ? `
                    <span class="text-[8px] font-black px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-0.5">
                      <i data-lucide="video" class="w-2.5 h-2.5 text-purple-400"></i> ${scoutInfo.film.length} Film
                    </span>
                  ` : ''}
                </div>
              </div>

              <!-- 4-Shield Ranking Mini Row -->
              <div class="grid grid-cols-4 gap-1 text-center bg-slate-950/70 p-1.5 rounded-xl border border-slate-800/80 mb-2">
                <div>
                  <div class="text-[8px] text-slate-500 font-bold uppercase">US/CAN</div>
                  <div class="text-[10px] font-black text-slate-200">${t.usCanRank ? '#' + t.usCanRank : 'NR'}</div>
                </div>
                <div>
                  <div class="text-[8px] text-slate-500 font-bold uppercase">Nat'l</div>
                  <div class="text-[10px] font-black text-slate-200">${t.nationalRank ? '#' + t.nationalRank : 'NR'}</div>
                </div>
                <div>
                  <div class="text-[8px] text-slate-500 font-bold uppercase">Reg'l</div>
                  <div class="text-[10px] font-black text-slate-200">${t.regionalRank ? '#' + t.regionalRank : 'NR'}</div>
                </div>
                <div>
                  <div class="text-[8px] text-slate-500 font-bold uppercase">TXS</div>
                  <div class="text-[10px] font-black text-emerald-400">${t.stateRank ? '#' + t.stateRank : 'NR'}</div>
                </div>
              </div>

              <!-- Stats Bar -->
              <div class="bg-slate-950/50 rounded-lg p-2 text-[10px] space-y-1 border border-slate-800/50">
                <div class="flex justify-between text-slate-400">
                  <span>Coach:</span>
                  <span class="text-slate-200 font-bold truncate max-w-[130px]">${t.coach || 'Coach'}</span>
                </div>
                <div class="flex justify-between text-slate-400">
                  <span>Record & Win %:</span>
                  <span class="text-emerald-400 font-bold">${t.wins}-${t.draws}-${t.losses} (${t.winPercent}%)</span>
                </div>
                <div class="flex justify-between text-slate-400">
                  <span>Match vs HDL:</span>
                  <strong class="${isHDL ? 'text-slate-500' : 'text-orange-400'}">${t.matchVsHDL}</strong>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-1.5 pt-1">
              <button onclick="openOpponentModal('${t.id}')" class="flex-1 py-1.5 px-2 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white rounded-lg text-[10px] font-black border border-orange-500/30 flex items-center justify-center gap-1 transition shadow">
                <i data-lucide="crosshair" class="w-3 h-3 text-orange-400"></i> Scouting & Film
              </button>
              <a href="${t.rankingsUrl}" target="_blank" class="py-1.5 px-2.5 bg-blue-900/30 hover:bg-blue-800 text-blue-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border border-blue-800/40 transition">
                <i data-lucide="external-link" class="w-3 h-3"></i>
              </a>
            </div>
          </div>
        `;
      });

      grid.innerHTML = html;
      if (window.lucide) lucide.createIcons();
    }

    const opponentScoutingDB = {
    "HTX Woodlands Gold": {
        "id": "241436",
        "formation": "4-3-3 (Single #6 pivot, inverted wingers; 4-5-1 mid-block)",
        "strengths": [
            "Methodical possession build-up",
            "Midfield triangles",
            "Inverted wingers cutting inside"
        ],
        "weaknesses": [
            "Low conversion rate",
            "Center-backs struggle in 1v1 footraces",
            "Space behind advancing fullbacks"
        ],
        "pivotPlan": "Double pivot (#6/#8) screens their lone #6, forcing play wide into sideline traps.",
        "playmakerPlan": "#10 sits in Zone 14 pocket behind their #6 to feed rapid transition balls into the channels.",
        "wingsPlan": "Pin fullbacks and attack vacated half-spaces (Zones 11 & 17).",
        "pressTrigger": "High press when center-backs receive facing their own goal or on short goal kicks.",
        "targetZones": [
            "Zones 11 & 17 (Flank channels)",
            "Zone 14 (Central hole)"
        ],
        "film": [
            {
                "title": "HTX Tourney vs HTX Woodlands Gold STXCL (Full Match — 30:24)",
                "url": "https://www.youtube.com/watch?v=4Z6wtYBwoQE",
                "duration": "30:24"
            },
            {
                "title": "JAH CHIESA 2013 vs HTX Woodlands 13B Black (Match Highlights — 12:04)",
                "url": "https://www.youtube.com/watch?v=DXpzjGi6LnM",
                "duration": "12:04"
            }
        ]
    },
    "HTX West Gold": {
        "id": "240339",
        "formation": "4-2-3-1 / Flat 4-4-2 (Direct vertical play)",
        "strengths": [
            "Direct vertical distribution",
            "Target striker knockdowns",
            "Physical 50/50 duels"
        ],
        "weaknesses": [
            "Lowest scoring output in conference (15 GF)",
            "Backline rushes clearances under high press",
            "Disconnect between midfield and front two"
        ],
        "pivotPlan": "#6 and #8 dominate aerial second balls and distribute wide immediately.",
        "playmakerPlan": "#10 drifts laterally between their flat lines to pull center-backs out of position.",
        "wingsPlan": "Overload flanks 2v1 with overlapping fullbacks (#2/#3) against their flat back four.",
        "pressTrigger": "Press center-backs immediately when forced onto their weaker foot.",
        "targetZones": [
            "Touchline 2v1 zones",
            "Channels behind fullbacks"
        ],
        "film": [
            {
                "title": "HTX Tourney vs HTX West Gold STXCL (Full Match — 1:20:28)",
                "url": "https://www.youtube.com/watch?v=8_MZszyNUGc",
                "duration": "1:20:28"
            },
            {
                "title": "JAH 2013B vs HTX West 13B Gold I (Match Clip — 1:03)",
                "url": "https://www.youtube.com/watch?v=s7zUyYfO03w",
                "duration": "1:03"
            },
            {
                "title": "HTX South Gold vs HTX West Gold (Match Highlights — 2:22)",
                "url": "https://www.youtube.com/watch?v=LGieQ1uiYlU",
                "duration": "2:22"
            }
        ]
    },
    "HTX South Gold": {
        "id": "240319",
        "formation": "Aggressive 4-3-3 (High frontline press & dual #8s)",
        "strengths": [
            "High scoring power (47 GF)",
            "Rapid counter-attacks",
            "Dual attacking midfielders"
        ],
        "weaknesses": [
            "High goals conceded (49 GA)",
            "Over-committed fullbacks leave counter corridors",
            "Aggressive offside trap"
        ],
        "pivotPlan": "#6 holds deep to absorb their dual attacking midfielders; maintain strict 3+2 rest defense.",
        "playmakerPlan": "#10 acts as immediate transition outlet releasing early vertical passes into deep flanks.",
        "wingsPlan": "Wingers (#7/#11) stay on the shoulder of the last defender to break their high offside trap.",
        "pressTrigger": "Mid-block trap: invite center-backs across midfield, then pinch centrally.",
        "targetZones": [
            "Deep counter channels behind fullbacks",
            "1v1 footraces against CBs"
        ],
        "film": [
            {
                "title": "Solar STX 15B vs HTX South Gold (Match Film — 36:38)",
                "url": "https://www.youtube.com/watch?v=N6oJxEcP0Mg",
                "duration": "36:38"
            },
            {
                "title": "Girls Teams vs HTX South 12G Aspire (Veo Match Recording)",
                "url": "https://app.veo.co/matches/20250824-girls-teams-vs-htx-south-12g-aspire-6e7c3547/",
                "duration": "Full Veo"
            }
        ]
    },
    "HTX Central Gold": {
        "id": "752439",
        "formation": "4-4-2 Diamond (Central congestion)",
        "strengths": [
            "Compact central shape",
            "Short passing circuits",
            "Quick midfield combination"
        ],
        "weaknesses": [
            "Narrow shape is vulnerable to rapid diagonal ball switches",
            "Slow lateral sliding leaves cutback angles open on far post"
        ],
        "pivotPlan": "Double pivot quickly circulates wide to bypass congested central diamond.",
        "playmakerPlan": "#10 finds half-spaces outside their diamond midfield to deliver crosses.",
        "wingsPlan": "Isolate their outside backs 1v1 on touchlines; cross into far-post cutback corridors.",
        "pressTrigger": "Press aggressively when their diamond #6 receives facing backwards.",
        "targetZones": [
            "Wide flanks & touchlines",
            "Far-post cutback corridors"
        ],
        "film": []
    },
    "Houstonians FC N": {
        "id": "546899",
        "formation": "4-3-3 Fluid (Technical short-passing)",
        "strengths": [
            "Technical 1v1 dribbling",
            "Quick 1-2 combination play",
            "Aggressive high counter-press"
        ],
        "weaknesses": [
            "Over-committed fullbacks leave massive transition space",
            "Disconnected lines",
            "Weak in aerial set-piece duels (12 GA)"
        ],
        "pivotPlan": "Funnel ball-carriers wide into sideline compression traps.",
        "playmakerPlan": "Overload their lone #6 to release #7 and #11 into wide channels.",
        "wingsPlan": "Make diagonal sprint runs behind high fullbacks into penalty box.",
        "pressTrigger": "Pincer trap on lone #6 receiving with back to goal.",
        "targetZones": [
            "Channels behind fullbacks",
            "Zone 14"
        ],
        "film": [
            {
                "title": "Gorilones Jr 2013 vs Houstonians FC 2013 — League Final (Full Match — 1:16:59)",
                "url": "https://www.youtube.com/watch?v=_6FgN_jwAhk",
                "duration": "1:16:59"
            },
            {
                "title": "Houstonians FC 2013 vs CF10 2013 — Texas Easter Cup (Full Match — 1:08:40)",
                "url": "https://www.youtube.com/watch?v=IhED34475zs",
                "duration": "1:08:40"
            },
            {
                "title": "Gorilones Jr vs Houstonians 2013 (Full Match — 1:16:20)",
                "url": "https://www.youtube.com/watch?v=nkW08B4Ybh8",
                "duration": "1:16:20"
            },
            {
                "title": "Houstonians FC 2013 vs Dynamo CDP Rosenberg 2013 (Full Match — 1:05:10)",
                "url": "https://www.youtube.com/watch?v=vWeCkkniCDg",
                "duration": "1:05:10"
            },
            {
                "title": "Houstonians FC STXCL vs AHFC NW STXCL (Match Film — 53:09)",
                "url": "https://www.youtube.com/watch?v=03EsN1mGskw",
                "duration": "53:09"
            }
        ]
    },
    "AHFC SW Blue": {
        "id": "175983",
        "formation": "4-4-2 / 4-2-3-1 Rigid (Vertical power & set pieces)",
        "strengths": [
            "100% win rate (14 GF / 2 GA)",
            "Aggressive vertical transitions",
            "Set-piece aerial dominance"
        ],
        "weaknesses": [
            "2-man central midfield vulnerable to 3v2 overloads",
            "Space behind stepping CBs",
            "Delayed lateral shifts"
        ],
        "pivotPlan": "Establish 3v2 central midfield numerical superiority with #10.",
        "playmakerPlan": "Third-man combination runs into space behind aggressive center-backs.",
        "wingsPlan": "Underlapping half-space runs into penalty area.",
        "pressTrigger": "Touchline trap on fullback receiving wide.",
        "targetZones": [
            "Seams between central midfielders and fullbacks",
            "Space behind stepping CBs"
        ],
        "film": [
            {
                "title": "AHFC 14B West Premier #1 vs VCF 2013 White (Full Match — 1:20:00)",
                "url": "https://www.youtube.com/watch?v=r14LWaphMW0",
                "duration": "1:20:00"
            },
            {
                "title": "AHFC 14B West Premier #1 vs Hays Youth Soccer 2013 (Full Match — 1:07:20)",
                "url": "https://www.youtube.com/watch?v=t7mAS1yAMGo",
                "duration": "1:07:20"
            },
            {
                "title": "AHFC 14B West Premier #1 vs Challenge 2013 East Red (Full Match — 1:16:08)",
                "url": "https://www.youtube.com/watch?v=oCNY0ZJOCsg",
                "duration": "1:16:08"
            },
            {
                "title": "AHFC 13B West Premier #1 vs MAFC 2013B (Match Footage — 33:29)",
                "url": "https://www.youtube.com/watch?v=ADEg8_Bt5b8",
                "duration": "33:29"
            }
        ]
    },
    "North Shore FC White": {
        "id": "135996",
        "formation": "4-4-2 / Flat 4-3-3 (Physical & direct)",
        "strengths": [
            "Physical intensity & aerial power",
            "Direct vertical clearances",
            "Long throw-ins and free kicks"
        ],
        "weaknesses": [
            "Zone 14 wide open",
            "Slow flank recovery",
            "Panics under rapid box combinations (24 GA)"
        ],
        "pivotPlan": "Bait midfield press, then hit line-breaking passes into Zone 14.",
        "playmakerPlan": "Operate freely in Zone 14 to combine with #9 and wingers.",
        "wingsPlan": "Overload wide areas and execute underlapping half-space runs.",
        "pressTrigger": "Press immediately on loose touches following clearances.",
        "targetZones": [
            "Zone 14",
            "Wide channels behind fullbacks"
        ],
        "film": [
            {
                "title": "NSFC Select White 2014 vs BYSC Renegades 2014 (Full Match — 1:05:21)",
                "url": "https://www.youtube.com/watch?v=2TnWddjFSJI",
                "duration": "1:05:21"
            },
            {
                "title": "NSFC Select 2014 vs BYSC Renegade (Full Match — 54:43)",
                "url": "https://www.youtube.com/watch?v=86nFEKf4MlI",
                "duration": "54:43"
            },
            {
                "title": "JAH 2013B vs North Shore FC Select 13B (Match Footage — 2:14)",
                "url": "https://www.youtube.com/watch?v=NTMMnJoV894",
                "duration": "2:14"
            }
        ]
    },
    "Real Greens": {
        "id": "640546",
        "formation": "4-3-3 / 3-4-3 (High counter-press)",
        "strengths": [
            "Aggressive counter-press",
            "Dynamic 1v1 wingers",
            "Dangerous near-post corners"
        ],
        "weaknesses": [
            "Over-commits on high press",
            "CBs vulnerable in 1v1 open field",
            "Weak-side fullback isolated"
        ],
        "pivotPlan": "Bait press into defensive third, release via quick 3rd-man combinations.",
        "playmakerPlan": "Attack vacated central seams as #9 drags CBs wide.",
        "wingsPlan": "Rapid diagonal cross-field switches to isolated weak-side winger.",
        "pressTrigger": "Trap wingers along touchlines before they can turn inward.",
        "targetZones": [
            "Space behind high-pressing fullbacks",
            "Central seam ahead of backline"
        ],
        "film": [
            {
                "title": "Real Greens Xolos vs Rayados Waller (Full Match — 1:01:39)",
                "url": "https://www.youtube.com/watch?v=d0hcv5ej-9w",
                "duration": "1:01:39"
            },
            {
                "title": "U15 STXCL RGSA vs Houstonians (Match Footage — 6:23)",
                "url": "https://www.youtube.com/watch?v=CsLgZveEAso",
                "duration": "6:23"
            },
            {
                "title": "STXCL RGSA vs Rise SC (Match Footage — 3:20)",
                "url": "https://www.youtube.com/watch?v=0SKrSAkdCYk",
                "duration": "3:20"
            },
            {
                "title": "Real Greens Soccer Academy vs SG1 10B Black (Match Footage — 2:35)",
                "url": "https://www.youtube.com/watch?v=ifR6_Mj-D0g",
                "duration": "2:35"
            }
        ]
    },
    "Storm SC": {
        "id": "790890",
        "formation": "Structured 4-4-2 Diamond / 4-2-3-1 (Disciplined mid-block)",
        "strengths": [
            "Disciplined mid-block spacing",
            "Patient passing out of back",
            "Organized defensive shape"
        ],
        "weaknesses": [
            "Vulnerable to high pressing inside own box",
            "Fullbacks pinned deep",
            "Slow adaptation to tempo shifts"
        ],
        "pivotPlan": "High-press trigger on their center-backs during deep goal kicks to force turnovers.",
        "playmakerPlan": "Rapid wall passes between winger and #10 to release overlapping fullbacks.",
        "wingsPlan": "Overload touchlines to deliver driven crosses into 6-yard box.",
        "pressTrigger": "High press when CBs receive inside their penalty box.",
        "targetZones": [
            "Penalty box half-spaces",
            "Wide overlapping zones"
        ],
        "film": [
            {
                "title": "Storm SC 2013 Red — Championship Match (Full Match — 1:00:57)",
                "url": "https://www.youtube.com/watch?v=wO0tjsBEldI",
                "duration": "1:00:57"
            },
            {
                "title": "Storm SC 2013 Black vs East County Surf 2013 (Full Match — 58:20)",
                "url": "https://www.youtube.com/watch?v=T_nsoCRJazw",
                "duration": "58:20"
            }
        ]
    }
};

    function openOpponentModal(target) {
      const modal = document.getElementById('opponent-scouting-modal');
      const content = document.getElementById('opponent-modal-content');
      if (!modal || !content) return;

      let team = null;
      if (typeof target === 'string' && /^[0-9]+$/.test(target)) {
        team = fullTeamsAnalytics.find(t => t.id === target);
      } else {
        team = fullTeamsAnalytics.find(t => t.name.toLowerCase() === (target || '').toLowerCase() || t.fullName.toLowerCase().includes((target || '').toLowerCase()));
      }

      if (!team) {
        team = fullTeamsAnalytics.find(t => t.name.toLowerCase().includes((target || '').toLowerCase()));
      }

      if (!team) {
        content.innerHTML = '<div class="p-6 text-center text-slate-400">Opponent scouting data is loading...</div>';
        modal.classList.remove('hidden');
        return;
      }

      const isHDL = team.name === 'Houston Dutch Lions FC';
      
      // Find tactical scouting intel & game film
      let scouting = null;
      for (const [sName, sData] of Object.entries(opponentScoutingDB)) {
        if (sData.id === team.id || team.name.toLowerCase().includes(sName.toLowerCase()) || sName.toLowerCase().includes(team.name.toLowerCase())) {
          scouting = sData;
          break;
        }
      }

      let scoutingHTML = '';
      if (scouting) {
        const strengthsHTML = (scouting.strengths || []).map(s => `<span class="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800/70 text-[10px] font-bold inline-flex items-center gap-1"><i data-lucide="check-circle" class="w-3 h-3 text-emerald-400"></i> ${s}</span>`).join(' ');
        const weaknessesHTML = (scouting.weaknesses || []).map(w => `<span class="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/70 text-[10px] font-bold inline-flex items-center gap-1"><i data-lucide="alert-triangle" class="w-3 h-3 text-amber-400"></i> ${w}</span>`).join(' ');
        const targetZonesHTML = (scouting.targetZones || []).map(z => `<span class="px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800/70 text-[10px] font-bold inline-flex items-center gap-1"><i data-lucide="crosshair" class="w-3 h-3 text-blue-400"></i> ${z}</span>`).join(' ');

        let filmHTML = '';
        if (scouting.film && scouting.film.length > 0) {
          filmHTML = `
            <div class="space-y-1.5 pt-1">
              <div class="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <i data-lucide="video" class="w-3.5 h-3.5"></i> Available Game Film & Match Footage (${scouting.film.length})
              </div>
              <div class="grid grid-cols-1 gap-2">
                ${scouting.film.map((f, idx) => `
                  <a href="${f.url}" target="_blank" class="p-2.5 bg-slate-950 hover:bg-purple-950/50 rounded-xl border border-purple-800/50 hover:border-purple-500 transition flex items-center justify-between gap-2 shadow group">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-700/60 flex items-center justify-center shrink-0 text-purple-300 group-hover:scale-110 transition-transform">
                        <i data-lucide="play" class="w-4 h-4 text-purple-300"></i>
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-extrabold text-white group-hover:text-purple-300 transition truncate">${f.title}</div>
                        <div class="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span class="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800/60 text-[9px]">${f.url.includes('veo') ? 'VEO MATCH' : 'YOUTUBE'}</span>
                          ${f.duration ? `<span>⏱️ ${f.duration}</span>` : ''}
                        </div>
                      </div>
                    </div>
                    <span class="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-black shrink-0 flex items-center gap-1 transition shadow">
                      Watch Film ↗
                    </span>
                  </a>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          filmHTML = `
            <div class="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-[10px] text-slate-400 italic">
              🎬 Game film is currently being scouted and compiled for this opponent. Check back before matchday!
            </div>
          `;
        }

        scoutingHTML = `
          <!-- 4-2-3-1 TACTICAL SCOUTING DOSSIER -->
          <div class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-orange-500/40 space-y-3 shadow-xl">
            <div class="flex justify-between items-center border-b border-slate-800 pb-2">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                <h4 class="text-xs font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                  <i data-lucide="target" class="w-3.5 h-3.5"></i> 4-2-3-1 Tactical Scouting Dossier
                </h4>
              </div>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-orange-950 text-orange-300 font-black border border-orange-800">STXCL SCOUT</span>
            </div>

            <!-- Formation & Style -->
            <div class="text-xs">
              <div class="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Opponent Formation & Style</div>
              <div class="text-white font-black text-xs bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <i data-lucide="layout-dashboard" class="w-4 h-4 text-orange-400 shrink-0"></i>
                <span>${scouting.formation}</span>
              </div>
            </div>

            <!-- Strengths & Weaknesses -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div class="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-900/50 space-y-1.5">
                <div class="text-[10px] font-extrabold uppercase text-emerald-400 flex items-center gap-1">
                  <i data-lucide="shield-check" class="w-3 h-3"></i> Key Strengths
                </div>
                <div class="flex flex-wrap gap-1">${strengthsHTML}</div>
              </div>

              <div class="bg-slate-950/80 p-2.5 rounded-xl border border-amber-900/50 space-y-1.5">
                <div class="text-[10px] font-extrabold uppercase text-amber-400 flex items-center gap-1">
                  <i data-lucide="alert-triangle" class="w-3 h-3"></i> Vulnerabilities to Exploit
                </div>
                <div class="flex flex-wrap gap-1">${weaknessesHTML}</div>
              </div>
            </div>

            <!-- 4-2-3-1 Counter-Strategy Plan -->
            <div class="bg-slate-950/90 p-3 rounded-xl border border-blue-900/60 space-y-2 text-xs">
              <div class="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <i data-lucide="crosshair" class="w-3.5 h-3.5 text-blue-400"></i> HDL 4-2-3-1 Counter-Strategy
              </div>

              <div class="space-y-1.5 text-[11px]">
                <div class="p-1.5 rounded-lg bg-blue-950/40 border border-blue-900/40">
                  <strong class="text-blue-300 block mb-0.5">🛡️ Double Pivot (#6 & #8):</strong>
                  <span class="text-slate-300">${scouting.pivotPlan}</span>
                </div>
                <div class="p-1.5 rounded-lg bg-amber-950/40 border border-amber-900/40">
                  <strong class="text-amber-300 block mb-0.5">🎯 Playmaker CAM (#10):</strong>
                  <span class="text-slate-300">${scouting.playmakerPlan}</span>
                </div>
                <div class="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-900/40">
                  <strong class="text-emerald-300 block mb-0.5">⚡ Wingers & Fullbacks (#7/#11 & #2/#3):</strong>
                  <span class="text-slate-300">${scouting.wingsPlan}</span>
                </div>
                <div class="p-1.5 rounded-lg bg-orange-950/40 border border-orange-900/40">
                  <strong class="text-orange-300 block mb-0.5">⚠️ Pressing Trigger:</strong>
                  <span class="text-slate-300">${scouting.pressTrigger}</span>
                </div>
              </div>

              ${targetZonesHTML ? `
                <div class="pt-1 border-t border-slate-800 flex items-center gap-1.5 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-bold">Key Attack Zones:</span>
                  ${targetZonesHTML}
                </div>
              ` : ''}
            </div>

            <!-- Game Film Hub -->
            ${filmHTML}
          </div>
        `;
      }

      content.innerHTML = `
        <div class="space-y-4">
          <!-- Header Banner -->
          <div class="flex items-center gap-3.5 border-b border-slate-800 pb-3">
            <img src="${team.logo}" alt="${team.name}" class="w-14 h-14 object-contain rounded-2xl bg-slate-950 p-1.5 border border-slate-700/80 shrink-0 shadow-lg">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold"># ${team.id}</span>
                <span class="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold">Male, U14</span>
                <span class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-black">${team.points} Points</span>
                ${scouting && scouting.film && scouting.film.length > 0 ? `<span class="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold flex items-center gap-1"><i data-lucide="video" class="w-3 h-3"></i> ${scouting.film.length} Film Available</span>` : ''}
              </div>
              <h3 class="text-base sm:text-lg font-black text-white mt-1 leading-tight ${isHDL ? 'text-orange-400' : ''}">${team.fullName}</h3>
              <p class="text-[11px] text-slate-400 mt-0.5">${team.clubName} • ${team.venue}</p>
            </div>
          </div>

          <!-- GotSport Ranking Badges Banner -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span class="flex items-center gap-1 text-emerald-400"><i data-lucide="shield" class="w-3.5 h-3.5"></i> GotSport Rankings</span>
              <span>STXCL EC U14-B</span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${renderRankingShield(team.usCanRank, 'US/CAN')}
              ${renderRankingShield(team.nationalRank, 'National')}
              ${renderRankingShield(team.regionalRank, 'Regional')}
              ${renderRankingShield(team.stateRank, team.stateCode || 'TXS')}
            </div>
          </div>

          <!-- Tactical Scouting Section (from Google Docs) -->
          ${scoutingHTML}

          <!-- GotSport 3-Section Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <!-- Club Info -->
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <h5 class="text-[10px] font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                <i data-lucide="building" class="w-3 h-3"></i> Club Info
              </h5>
              <div>
                <div class="text-[10px] text-slate-400">Club Name:</div>
                <div class="font-bold text-slate-200">${team.clubName}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400">State / Region:</div>
                <div class="font-bold text-slate-200">${team.stateCode} / South Texas</div>
              </div>
            </div>

            <!-- Team Staff -->
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <h5 class="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <i data-lucide="user-check" class="w-3 h-3"></i> Team Staff
              </h5>
              <div>
                <div class="text-[10px] text-slate-400">Head Coach:</div>
                <div class="font-bold text-emerald-400 truncate">${team.coach || 'Coach'}</div>
              </div>
              <div>
                <div class="text-[10px] text-slate-400">Team Manager:</div>
                <div class="font-bold text-slate-200 truncate">${team.manager || 'Manager'}</div>
              </div>
            </div>

            <!-- Match Analytics -->
            <div class="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
              <h5 class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <i data-lucide="activity" class="w-3 h-3"></i> Match Analytics
              </h5>
              <div class="flex justify-between text-[11px]">
                <span class="text-slate-400">Games:</span>
                <span class="font-bold text-white">${team.games}</span>
              </div>
              <div class="flex justify-between text-[11px]">
                <span class="text-slate-400">W-D-L:</span>
                <span class="font-bold text-emerald-400">${team.wins}-${team.draws}-${team.losses}</span>
              </div>
              <div class="flex justify-between text-[11px]">
                <span class="text-slate-400">GF / GA:</span>
                <span class="font-bold text-slate-200">${team.goalsFor} / ${team.goalsAgainst}</span>
              </div>
              <div class="flex justify-between text-[11px]">
                <span class="text-slate-400">Win Rate:</span>
                <span class="font-black text-orange-400">${team.winPercent}%</span>
              </div>
            </div>
          </div>

          <!-- Matchup vs Houston Dutch Lions -->
          <div class="bg-gradient-to-r from-orange-950/30 to-blue-950/30 p-3 rounded-xl border border-orange-500/30 space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                <i data-lucide="swords" class="w-3.5 h-3.5"></i> Matchup vs HDL Elite
              </span>
              <span class="font-black text-white text-[11px]">${team.matchVsHDL}</span>
            </div>
            <p class="text-[11px] text-slate-300 flex items-center gap-1">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-blue-400 shrink-0"></i>
              <span>${team.matchVenue || team.venue}</span>
            </p>
          </div>

          <!-- Action Link Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            <a href="${team.rankingsUrl}" target="_blank" class="py-2 px-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-xl text-center font-bold text-[11px] border border-emerald-500/40 transition flex items-center justify-center gap-1">
              <i data-lucide="award" class="w-3.5 h-3.5"></i> GotSport Rankings ↗
            </a>
            <a href="${team.gotsportScheduleUrl}" target="_blank" class="py-2 px-3 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-xl text-center font-bold text-[11px] border border-blue-500/40 transition flex items-center justify-center gap-1">
              <i data-lucide="calendar" class="w-3.5 h-3.5"></i> Team Schedule ↗
            </a>
            <a href="${team.website}" target="_blank" class="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-center font-bold text-[11px] border border-slate-700 transition flex items-center justify-center gap-1">
              <i data-lucide="globe" class="w-3.5 h-3.5 text-orange-400"></i> Club Website ↗
            </a>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }

    function closeOpponentModal() {
      const modal = document.getElementById('opponent-scouting-modal');
      if (modal) modal.classList.add('hidden');
    }

    window.processEventsData = function(json) {
        specificEvents = {};

        // 1. Populate all official STXCL league fixtures
        officialLeagueMatches.forEach(m => {
            specificEvents[m.date] = {
                type: 'league',
                matchNumber: m.id,
                opponent: m.opponent,
                opponentLogo: m.opponentLogo,
                opponentUrl: m.opponentUrl,
                division: m.division,
                homeTeam: m.homeTeam,
                awayTeam: m.awayTeam,
                isHome: m.isHome,
                time: m.time,
                uniform: m.uniform,
                bring: m.bring,
                location: m.location,
                address: m.address,
                mapQuery: m.mapQuery,
                matchUrl: m.matchUrl
            };
        });

        // 2. Merge Google Sheet scrimmages and practices
        if (json && json.table && json.table.rows) {
            json.table.rows.forEach(r => {
                const row = {};
                json.table.cols.forEach((c, idx) => {
                    if (c && c.label) row[c.label] = r.c[idx] ? r.c[idx].v : '';
                });

                const dateVal = row['Date'] ? String(row['Date']).trim() : '';
                if (!dateVal) return;
                
                let dateStr = dateVal;
                if (dateVal.toString().startsWith('Date(')) {
                    const parts = dateVal.match(/Date\((\d+),(\d+),(\d+)/);
                    if (parts) {
                        const y = parts[1];
                        const m = String(parseInt(parts[2]) + 1).padStart(2, '0');
                        const d = String(parts[3]).padStart(2, '0');
                        dateStr = `${y}-${m}-${d}`;
                    }
                }

                let startersParsed = null;
                if (row['GK'] || row['LB'] || row['CB1'] || row['ST'] || row['RB'] || row['CDM']) {
                    startersParsed = {
                        gk: row['GK'] || '',
                        lb: row['LB'] || '',
                        cb1: row['CB1'] || '',
                        cb2: row['CB2'] || '',
                        rb: row['RB'] || '',
                        cm1: row['CM1'] || '',
                        cdm: row['CDM'] || '',
                        cm2: row['CM2'] || '',
                        lw: row['LW'] || '',
                        st: row['ST'] || '',
                        rw: row['RW'] || ''
                    };
                }

                let timeStr = row['Time'] ? String(row['Time']).trim() : '';
                if (timeStr.startsWith('Date(')) {
                    const parts = timeStr.match(/Date\(\d+,\d+,\d+,(\d+),(\d+),(\d+)\)/);
                    if (parts) {
                        let hr = parseInt(parts[1], 10);
                        let mn = String(parts[2]).padStart(2, '0');
                        let ampm = hr >= 12 ? 'PM' : 'AM';
                        hr = hr % 12;
                        if (hr === 0) hr = 12;
                        timeStr = `${hr}:${mn} ${ampm}`;
                    }
                }

                const rowType = row['Type'] ? row['Type'].toLowerCase() : 'practice';

                // Merge with specificEvents
                if (!specificEvents[dateStr] || rowType === 'scrimmage') {
                    specificEvents[dateStr] = {
                        type: rowType,
                        opponent: row['Opponent'] || '',
                        time: timeStr || '7:00 PM',
                        home: true,
                        uniform: row['Uniform'] || (rowType === 'scrimmage' ? 'Orange Jersey | Bring: Both' : 'Practice Kit'),
                        bring: row['Bring'] || 'Both Jerseys, Shin Guards, Cleats, Water',
                        location: row['Location'] || 'HDL Complex Field',
                        formation: row['Formation'] || '',
                        starters: startersParsed,
                        mediaFolder: row['Media Folder'] || row['Drive Folder'] || row['Folder'] || ''
                    };
                } else if (specificEvents[dateStr] && row['Media Folder']) {
                    specificEvents[dateStr].mediaFolder = row['Media Folder'];
                }
            });
        }

        let latestDriveFolder = '';
        Object.values(specificEvents).forEach(ev => {
            if (ev.mediaFolder && ev.mediaFolder.startsWith('http')) {
                latestDriveFolder = ev.mediaFolder;
            }
        });
        if (latestDriveFolder) {
            const mainBtn = document.getElementById('mainDriveUploadBtn');
            if (mainBtn) mainBtn.href = latestDriveFolder;
        }
        
        // If current month has no matches/scrimmages, default to the month of the upcoming match
        const currentMonthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        const hasCurrentMonthEvents = Object.keys(specificEvents).some(d => d.startsWith(currentMonthPrefix));
        if (!hasCurrentMonthEvents) {
            const sortedDates = Object.keys(specificEvents).sort();
            const futureDate = sortedDates.find(d => {
                const [y, m, dNum] = d.split('-').map(Number);
                return new Date(y, m - 1, dNum, 23, 59, 59).getTime() >= Date.now();
            });
            if (futureDate) {
                const [fy, fm, fd] = futureDate.split('-').map(Number);
                currentDate = new Date(fy, fm - 1, fd);
            }
        }

        renderCalendar();
        renderEventList();
        renderStandings();
        renderOpponents();
        updateNextMatchHero();
        fetchSignups();
        if (window.lucide) lucide.createIcons();
    };

    function renderEventList() {
      const listContainer = document.getElementById('event-list');
      if (!listContainer) return;
      
      const selectedYear = currentDate.getFullYear();
      const selectedMonth = currentDate.getMonth(); // 0-11
      const selectedMonthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const currentMonthName = monthNames[selectedMonth];

      let html = '';
      
      // Weekly practice block
      html += `<div class="glass-card p-3.5 rounded-xl flex items-center justify-between hover:border-blue-500/40 transition">
          <div class="space-y-0.5">
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded">PRACTICE</span>
              <span class="text-xs font-bold text-white">Mon, Tue, Thu (Weekly)</span>
            </div>
            <p class="text-xs text-slate-300 flex items-center gap-1">
              6:45 PM - 8:00 PM • 
              <a href="https://maps.google.com/?q=14562+Interstate+45+South,+Conroe,+Texas+77384" target="_blank" class="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 hover:underline transition">
                <i data-lucide="map-pin" class="w-3 h-3"></i> HDL Complex Field
              </a>
            </p>
            <p class="text-[11px] text-slate-400">Focus: 11v11 Tactical Positioning & Ball Circulation</p>
          </div>
        </div>`;

      // Sort dates
      const dates = Object.keys(specificEvents).sort();
      let matchCount = 0;
      
      dates.forEach(dateStr => {
          // Show only games/scrimmages for the currently selected calendar month
          if (!dateStr.startsWith(selectedMonthPrefix)) {
              return;
          }

          const ev = specificEvents[dateStr];
          const [y, m, d] = dateStr.split('-');
          const dObj = new Date(y, m-1, d);

          matchCount++;

          const formattedDate = dObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', month: 'short', day: 'numeric' });
          const lookupDate = monthNames[dObj.getMonth()] + " " + dObj.getDate();
          
          let colorClass = 'blue';
          let badgeText = currentLang === 'en' ? 'PRACTICE' : 'ENTRENAMIENTO';
          let badgeIcon = '';
          let matchMetaHTML = '';
          let opponentLogoHTML = '';

          if (ev.type === 'league') {
              colorClass = 'emerald';
              badgeText = currentLang === 'en' ? 'STXCL LEAGUE' : 'LIGA STXCL';
              badgeIcon = '<i data-lucide="trophy" class="w-3 h-3 inline mr-1 text-yellow-400"></i>';
              if (ev.opponentLogo) {
                  opponentLogoHTML = `<img src="${ev.opponentLogo}" alt="${ev.opponent}" class="w-4 h-4 object-contain rounded-full bg-slate-900 border border-slate-700 shrink-0 inline mr-1">`;
              }
              matchMetaHTML = `<div class="flex items-center gap-1.5 mt-0.5 text-[10px]">
                  <span class="px-1.5 py-0.2 bg-${ev.isHome ? 'orange' : 'blue'}-950 text-${ev.isHome ? 'orange' : 'blue'}-300 border border-${ev.isHome ? 'orange' : 'blue'}-800/60 rounded font-black text-[9px]">${ev.isHome ? 'HOME' : 'AWAY'}</span>
                  ${ev.matchNumber ? `<span class="text-slate-400 font-semibold">Match #${ev.matchNumber}</span>` : ''}
                  ${ev.matchUrl ? `<a href="${ev.matchUrl}" target="_blank" class="text-emerald-400 hover:text-emerald-300 underline font-bold" onclick="event.stopPropagation()">GotSport ↗</a>` : ''}
              </div>`;
          } else if (ev.type === 'scrimmage') {
              colorClass = 'orange';
              badgeText = currentLang === 'en' ? 'SCRIMMAGE' : 'AMISTOSO';
          }

          let signupHTML = '';
          if (ev.type === 'scrimmage' || ev.type === 'league') {
              let drinksCovered = false;
              let drinkVolunteers = [];
              if (signupsMap.has(lookupDate) && signupsMap.get(lookupDate).drinks.length > 0) {
                  drinksCovered = true;
                  drinkVolunteers = signupsMap.get(lookupDate).drinks;
              } else if (signupsMap.has(dateStr) && signupsMap.get(dateStr).drinks.length > 0) {
                  drinksCovered = true;
                  drinkVolunteers = signupsMap.get(dateStr).drinks;
              }

              if (!drinksCovered) {
                  signupHTML = `<div id="drink-status-${dateStr}" class="flex items-center gap-1 text-[10px] text-orange-400 font-bold bg-orange-900/20 px-2 py-1 rounded w-max border border-orange-800/40">
                      <i data-lucide="alert-circle" class="w-3 h-3"></i> Drinks Needed! <a href="#" onclick="openVolunteerModal('${lookupDate}'); return false;" class="underline ml-1 text-orange-300 hover:text-white">Volunteer</a>
                  </div>`;
              } else {
                  signupHTML = `<div id="drink-status-${dateStr}" class="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-900/20 px-2 py-1 rounded w-max border border-emerald-800/40">
                      <i data-lucide="check-circle" class="w-3 h-3"></i> Drinks Covered: ${drinkVolunteers.join(', ')}
                  </div>`;
              }
          }

          const mapTarget = ev.mapQuery || ev.location;
          const oppModalAction = ev.opponent ? `onclick="openOpponentModal('${ev.opponent}')"` : `onclick="showEventDetails('${dateStr}')"`;

          html += `<div class="glass-card p-3.5 rounded-xl flex flex-col hover:border-${colorClass}-500/40 transition cursor-pointer" ${oppModalAction}>
            <div class="flex items-start justify-between mb-1">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 bg-${colorClass}-500/20 text-${colorClass}-400 border border-${colorClass}-500/30 text-[10px] font-bold rounded uppercase flex items-center">${badgeIcon}${badgeText}</span>
                <span class="text-xs font-bold text-white">${formattedDate}</span>
              </div>
              <div id="weather-${dateStr}" class="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                <i data-lucide="cloud-sun" class="w-3 h-3 text-slate-400"></i> --°F
              </div>
            </div>
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <p class="text-xs text-slate-200 flex items-center gap-1.5 min-w-0">
                <span class="font-bold text-slate-300 shrink-0">${ev.time}</span>
                ${ev.opponent ? `• <span class="inline-flex items-center gap-1 font-bold text-white hover:text-orange-400 transition truncate">${opponentLogoHTML}${ev.opponent}</span>` : ''}
              </p>
              ${ev.opponent ? `
                <button onclick="event.stopPropagation(); openOpponentModal('${ev.opponent}')" class="px-2 py-0.5 bg-emerald-950/90 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-700/60 rounded text-[9px] font-black flex items-center gap-1 transition shrink-0 shadow">
                  <i data-lucide="bar-chart-2" class="w-3 h-3 text-emerald-400"></i> Stats & Info
                </button>
              ` : ''}
            </div>
            <p class="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1">
              <a href="https://maps.google.com/?q=${encodeURIComponent(mapTarget)}" target="_blank" class="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 hover:underline transition" onclick="event.stopPropagation()">
                <i data-lucide="map-pin" class="w-3 h-3 shrink-0"></i> ${ev.location}
              </a>
            </p>
            ${matchMetaHTML}
            <p class="text-[11px] text-${colorClass}-400 font-bold mt-1">Uniform: ${ev.uniform} | Bring: ${ev.bring}</p>
            <div class="flex items-center gap-2 flex-wrap mt-1.5" onclick="event.stopPropagation()">
              ${signupHTML}
              <button onclick="openCarpoolModal('${dateStr}', '${lookupDate}', '${(ev.opponent || '').replace(/'/g, "\\'")}', '${(ev.location || '').replace(/'/g, "\\'")}'); return false;" class="flex items-center gap-1 text-[10px] text-purple-300 font-bold bg-purple-950/70 hover:bg-purple-900 border border-purple-700/60 px-2 py-1 rounded transition shadow">
                <i data-lucide="car" class="w-3 h-3 text-purple-400"></i> Carpool & Travel Coordination
              </button>
            </div>
          </div>`;
      });

      if (matchCount === 0) {
          html += `<div class="glass-card p-4 rounded-xl text-center text-slate-400 text-xs">
              No games or scrimmages scheduled for ${currentMonthName} ${selectedYear}. Use the calendar arrows above to view other months.
          </div>`;
      }

      listContainer.innerHTML = html;
      applyWeatherToDOM();
    }

    function toggleLanguage() {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      document.getElementById('langLabel').innerText = currentLang === 'en' ? 'Español' : 'English';
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (el.hasAttribute('data-' + currentLang)) {
          el.innerText = el.getAttribute('data-' + currentLang);
        } else if (translations[currentLang][key]) {
          el.innerText = translations[currentLang][key];
        }
      });
      selectPosition(activePosition);
      if (globalRosterData.length > 0) {
        renderRosterGrid(globalRosterData);
      }
      renderEventList();
      renderStandings();
      renderOpponents();
      updateNextMatchHero();
    }

    const positionData = {
      gk: {
        en: { title: "Goalkeeper (#1)", summary: "Sweeper Keeper, Director & Shot Stopper", skills: "Box command, distribution with feet out of the back, handling crosses, and organizing the back 4 line.", home: "Wall volley catches (100 touches), lateral cone shuffle to diving shape on grass, accurate ground distribution passes." },
        es: { title: "Arquero / Portero (#1)", summary: "Voz de Mando y Seguridad en el Arco", skills: "Dominio del área chica y grande, juego de pies en salida, anticipación a centros y comunicación constante.", home: "Rebotes contra la pared (100 toques), desplazamientos laterales en conos y pases rasantes de salida." }
      },
      cb: {
        en: { title: "Center Backs (#4 & #5)", summary: "4-2-3-1 Defensive Spine & Build-Up Initiators", skills: "1v1 jockeying, winning aerial headers, stepping up into midfield pockets, and holding a disciplined offside line.", home: "Parent toss & header clearances, 2-cone figure-8 backpedaling with forward acceleration." },
        es: { title: "Defensas Centrales (#4 y #5)", summary: "Eje Defensivo e Inicio de Juego", skills: "Duelos 1v1 con perfilación correcta, despeje aéreo, línea de fuera de juego y coberturas a la espalda.", home: "Cabezazos con un familiar devolviendo el balón a las manos, desplazamientos en 8 y pique corto." }
      },
      fb: {
        en: { title: "Fullbacks / Wingbacks (#2 & #3)", summary: "Wide Defenders & Overlapping Attackers", skills: "Channel defending against fast wingers, body shape forcing attackers wide, timed overlapping runs with wingers.", home: "Side-shuffle to driven crossing reps, 1v1 sprint recovery turns." },
        es: { title: "Laterales (#2 y #3)", summary: "Defensa por Banda y Apoyo Ofensivo", skills: "Marcación por los costados, perfilación para orientar al rival hacia afuera y desdobles por banda.", home: "Desplazamientos laterales con centros dirigidos y giros rápidos de repliegue defensivo." }
      },
      cdm: {
        en: { title: "Double Pivot CDMs (#6 & #8)", summary: "Engine Room, Balance & Shielding", skills: "#6 Destroyer shields back 4; #8 Box-to-Box links play. Head-scanning before receiving, 1-2 passing, and defensive transition screens.", home: "Shoulder-check wall passing (200 touches with both feet), Cruyff turns, sole rolls, and quick pivot turns." },
        es: { title: "Doble Pivote (#6 y #8)", summary: "Equilibrio, Distribución y Escudo Defensivo", skills: "El #6 destruye y protege a los centrales; el #8 enlaza con los atacantes. Control orientado en medio giro y pases de primera.", home: "Mirar por encima del hombro antes de recibir contra la pared (200 toques con ambas piernas) y giros rápidos." }
      },
      cam: {
        en: { title: "Playmaker CAM (#10)", summary: "Creative Heart, Between-the-Lines Threat", skills: "Operating in the hole between opponent midfield and defense, killer through-balls, rapid half-turns, and late box arrivals for cutbacks.", home: "Rapid receiving on the half-turn, 1-touch wall passing to turn and shoot, disguised passes." },
        es: { title: "Enganche / Mediapunta (#10)", summary: "Creatividad, Pases Filtrados y Llegada al Área", skills: "Juego entre líneas, giros rápidos al recibir, habilitaciones al delantero y remates de media distancia.", home: "Controles orientados hacia el arco, giros en un toque contra la pared y remates de primera." }
      },
      fwd: {
        en: { title: "Wingers & Striker (#7, #9 & #11)", summary: "Pace, Penetration & Clinical Finishing", skills: "#7 & #11 1v1 isolation dribbling, cutbacks into box; #9 holding up ball, near-post darting runs, and clinical 1-touch finishing.", home: "1-touch instep finishes from edge of the box, rapid ladder footwork into sprint finishes, near-post diagonal runs." },
        es: { title: "Extremos y Delanteros (#7, #9 y #11)", summary: "Desborde, Velocidad y Definición", skills: "Extremos (#7/#11) con regate 1v1 y centros; Delantero (#9) con desmarques al primer palo y remate letal.", home: "Definición al primer toque en espacios reducidos y coordinación en escalera rematando al arco." }
      }
    };

    let activePosition = 'gk';

    function selectPosition(posKey) {
      activePosition = posKey;
      document.querySelectorAll('.pos-tab').forEach(b => {
        b.className = 'pos-tab px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 whitespace-nowrap border border-slate-800';
      });
      const activeBtn = document.getElementById('pos-' + posKey);
      if (activeBtn) activeBtn.className = 'pos-tab px-3.5 py-2 rounded-xl bg-orange-600 text-white whitespace-nowrap shadow';

      const data = positionData[posKey][currentLang];
      document.getElementById('drillRoleTitle').innerText = data.title;
      document.getElementById('drillRoleSummary').innerText = data.summary;
      document.getElementById('drillSkills').innerText = data.skills;
      document.getElementById('drillHome').innerText = data.home;
    }

    function downloadCalendarICS() {
      let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Houston Dutch Lions FC//Elite 2013 U14//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:HDL Elite 2013 U14 Schedule\n";

      const pad = (n) => String(n).padStart(2, '0');

      // Add all official matches
      officialLeagueMatches.forEach(m => {
        const dt = parseEventDateTime(m.date, m.time);
        if (!dt) return;
        const endDt = new Date(dt.getTime() + 90 * 60 * 1000);

        const dtStart = `${dt.getUTCFullYear()}${pad(dt.getUTCMonth()+1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;
        const dtEnd = `${endDt.getUTCFullYear()}${pad(endDt.getUTCMonth()+1)}${pad(endDt.getUTCDate())}T${pad(endDt.getUTCHours())}${pad(endDt.getUTCMinutes())}00Z`;

        ics += `BEGIN:VEVENT\n`;
        ics += `UID:stxcl-${m.id}@houstondutchlionsfc.com\n`;
        ics += `SUMMARY:STXCL: HDL Elite vs ${m.opponent}\n`;
        ics += `DESCRIPTION:STXCL Eastern Conference Match #${m.id}. ${m.isHome ? 'HOME' : 'AWAY'} at ${m.location}. Uniform: ${m.uniform}. Pack: ${m.bring}. GotSport: ${m.matchUrl}\n`;
        ics += `LOCATION:${m.location}, ${m.address}\n`;
        ics += `DTSTART:${dtStart}\n`;
        ics += `DTEND:${dtEnd}\n`;
        ics += `STATUS:CONFIRMED\n`;
        ics += `END:VEVENT\n`;
      });

      // Add recurring practices for Sep - Nov 2026
      ics += `BEGIN:VEVENT\n`;
      ics += `UID:hdl-practice-weekly@houstondutchlionsfc.com\n`;
      ics += `SUMMARY:HDL Elite 2013 Practice\n`;
      ics += `DESCRIPTION:Regular weekly team practice. 11v11 Tactical Positioning.\n`;
      ics += `LOCATION:Houston Dutch Lions FC Soccer Facility - 14562 Interstate 45 S, Conroe, TX 77384\n`;
      ics += `RRULE:FREQ=WEEKLY;BYDAY=MO,TU,TH;UNTIL=20261130T235959Z\n`;
      ics += `DTSTART:20260824T234500Z\n`;
      ics += `DTEND:20260825T010000Z\n`;
      ics += `STATUS:CONFIRMED\n`;
      ics += `END:VEVENT\n`;

      ics += "END:VCALENDAR";

      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'hdl_elite_2013_u14_schedule.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // ==========================================
    // CALENDAR & WEATHER LOGIC
    // ==========================================
    let currentDate = new Date();

    let specificEvents = {};

    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      document.getElementById('month-year').innerText = `${monthNames[month]} ${year}`;
      
      const grid = document.getElementById('calendar-grid');
      grid.innerHTML = '';
      
      // Blank days before 1st
      for (let i = 0; i < firstDay.getDay(); i++) {
        grid.innerHTML += `<div class="p-1.5 opacity-0"></div>`;
      }
      
      // Days of month
      for (let d = 1; d <= lastDay.getDate(); d++) {
        const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month, d).getDay();
        
        let colorClasses = "text-slate-300 hover:bg-slate-800";
        
        // Check recurring practice (Mon=1, Tue=2, Thu=4)
        let isPractice = (dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 4);
        
        let evObj = specificEvents[dateStr];
        let evType = evObj ? evObj.type : '';
        
        if (evType === 'league') {
          colorClasses = "bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 font-black";
        } else if (evType === 'scrimmage') {
          colorClasses = "bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold";
        } else if (isPractice) {
          colorClasses = "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold";
        }
        
        // Highlight today
        const todayStr = new Date().toLocaleDateString('en-CA');
        if (dateStr === todayStr) {
          colorClasses += " ring-2 ring-white/50";
        }

        let emojiIndicators = '';
        const lookupDate = monthNames[month] + " " + parseInt(d, 10);
        if (signupsMap.has(lookupDate)) {
            const signups = signupsMap.get(lookupDate);
            if (signups.drinks && signups.drinks.length > 0) emojiIndicators += '🧃';
        }
        
        const dStr = String(d).padStart(2, '0');
        const mStr = String(month+1).padStart(2, '0');
        const dateMMDD = mStr + '-' + dStr;
        let hasBday = false;
        if (typeof globalRosterData !== 'undefined') {
             hasBday = globalRosterData.some(p => p.birthdayMMDD === dateMMDD);
        }
        if (hasBday) emojiIndicators += '🎂';
        
        let displayHtml = d;
        if (emojiIndicators) {
           displayHtml = `<div class="relative">${d}<span class="absolute -top-1.5 -right-3 text-[10px] drop-shadow-md tracking-tighter">${emojiIndicators}</span></div>`;
        }

        const evData = evObj ? JSON.stringify(evObj).replace(/"/g, '&quot;') : '';
        grid.innerHTML += `<div class="p-1.5 rounded-lg flex items-center justify-center transition-colors cursor-pointer hover:scale-105 ${colorClasses}" onclick="showEventDetails('${dateStr}', ${isPractice}, '${evData}')">${displayHtml}</div>`;
      }
      if (window.lucide) lucide.createIcons();
    }

    function showEventDetails(dateStr, isPractice, eventDataStr) {
      const detailsBox = document.getElementById('selected-date-details');
      let content = '';
      
      const [y, m, d] = dateStr.split('-');
      const dateMMDD = m + '-' + d;
      let bdayNames = [];
      if (typeof globalRosterData !== 'undefined') {
          globalRosterData.forEach(p => {
              if (p.birthdayMMDD === dateMMDD) bdayNames.push(p.name);
          });
      }
      
      if (bdayNames.length > 0) {
          content += `<div class="mb-3 text-pink-400 font-bold bg-pink-900/20 p-2.5 rounded-lg border border-pink-800/40 flex items-center justify-center gap-2 shadow-inner"><i data-lucide="cake" class="w-5 h-5 animate-bounce"></i> Happy Birthday, ${bdayNames.join(' & ')}! 🥳</div>`;
      }
      
      const formattedDate = new Date(y, m - 1, d).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', month: 'short', day: 'numeric' });
      
      let ev = eventDataStr ? JSON.parse(eventDataStr.replace(/&quot;/g, '"')) : null;
      let eventType = ev ? ev.type : '';
      
      let isGameOrScrimmage = (eventType === 'league' || eventType === 'scrimmage' || eventType === 'game' || eventType === 'match' || eventType === 'tournament');
      
      if (eventType === 'league') {
        const isHome = ev.isHome;
        const locText = ev.location || 'HDL Complex';
        const mapQuery = ev.mapQuery || locText;
        const driveFolderLink = (ev && ev.mediaFolder) ? ev.mediaFolder : 'https://drive.google.com/drive/folders/1qsg9oirm_aehrZ42WnEJGuu00pBQlkG3';

        content += `
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black rounded uppercase flex items-center gap-1">
              <i data-lucide="trophy" class="w-3 h-3"></i> STXCL MATCH ${ev.matchNumber ? '#' + ev.matchNumber : ''}
            </span>
            <span class="px-2 py-0.5 bg-${isHome ? 'orange' : 'blue'}-950 text-${isHome ? 'orange' : 'blue'}-300 border border-${isHome ? 'orange' : 'blue'}-800/60 rounded font-black text-[10px]">
              ${isHome ? 'HOME GAME' : 'AWAY GAME'}
            </span>
          </div>

          <div class="flex items-center justify-center gap-3 my-2">
            <img src="https://houstondutchlionsfc.com/wp-content/uploads/2024/10/HDLFC-Club-Logo.png" alt="HDL" class="w-10 h-10 object-contain drop-shadow">
            <span class="font-black text-xs text-slate-500">VS</span>
            ${ev.opponentLogo ? `<img src="${ev.opponentLogo}" alt="${ev.opponent}" class="w-10 h-10 object-contain rounded-full bg-slate-900 p-1 border border-slate-700 drop-shadow">` : `<div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-slate-300">OPP</div>`}
          </div>

          <h4 class="text-white font-extrabold text-sm mb-0.5">${ev.opponent || 'Opponent'}</h4>
          <p class="text-xs text-orange-400 font-bold mb-1">${formattedDate} • ${ev.time}</p>
          <p class="text-[11px] text-slate-400 mb-2">${ev.division || 'Boys U14 Bracket B'}</p>

          ${ev.opponent ? `
            <button onclick="openOpponentModal('${ev.opponent}')" class="w-full py-2 px-3 bg-emerald-950/90 hover:bg-emerald-700 text-emerald-300 hover:text-white border border-emerald-600/60 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition shadow mb-2.5">
              <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 text-emerald-400"></i> View ${ev.opponent} Team Stats & Rankings
            </button>
          ` : ''}

          <a href="https://maps.google.com/?q=${encodeURIComponent(mapQuery)}" target="_blank" class="w-full py-2 px-3 bg-blue-700/80 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow mb-3">
            <i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${locText}
          </a>

          <div class="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/80 mb-2 text-left">
            <strong class="text-orange-400 text-[10px] uppercase tracking-widest block mb-1.5 flex items-center gap-1.5">
              <i data-lucide="list-checks" class="w-3.5 h-3.5"></i> Game Day Checklist
            </strong>
            <p class="text-[11px] text-slate-300 mb-1 leading-snug"><strong class="text-white">Uniform:</strong> ${ev.uniform || (isHome ? 'Orange Jersey (Home)' : 'Blue/White Away Jersey')}</p>
            <p class="text-[11px] text-slate-300 mb-2 leading-snug"><strong class="text-white">Pack:</strong> ${ev.bring || 'Both Jerseys, Shin Guards, Cleats, Water'}</p>
            <div class="grid grid-cols-2 gap-2 mt-2">
              ${ev.matchUrl ? `<a href="${ev.matchUrl}" target="_blank" class="py-1.5 px-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1 transition text-[10px] font-bold">
                <i data-lucide="trophy" class="w-3 h-3"></i> GotSport Sheet
              </a>` : ''}
              <a href="${driveFolderLink}" target="_blank" class="py-1.5 px-2 bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg border border-orange-500/30 flex items-center justify-center gap-1 transition text-[10px] font-bold">
                <i data-lucide="folder-plus" class="w-3.5 h-3.5"></i> Media Folder
              </a>
            </div>
          </div>
        `;
      } else if (isGameOrScrimmage) {
        const titleText = (eventType === 'game' || eventType === 'match') ? (currentLang === 'en' ? 'GAME DAY' : 'DÍA DE PARTIDO') : (currentLang === 'en' ? 'SCRIMMAGE' : 'AMISTOSO');
        const vsText = ev.opponent ? ` vs ${ev.opponent}` : '';
        const locText = ev.location || 'HDL Complex';
        const driveFolderLink = (ev && ev.mediaFolder) ? ev.mediaFolder : 'https://drive.google.com/drive/folders/1qsg9oirm_aehrZ42WnEJGuu00pBQlkG3';
        content += `<h4 class="text-orange-400 font-bold text-sm mb-1">${titleText}</h4>
                   <p class="text-white text-xs font-semibold mb-1">${formattedDate}</p>
                   <p class="text-slate-300 text-xs mb-1">${ev.time}${vsText}</p>
                   <a href="https://maps.google.com/?q=${encodeURIComponent(locText)}" target="_blank" class="text-blue-400 hover:text-blue-300 text-xs flex items-center justify-center gap-0.5 hover:underline transition mb-2.5">
                     <i data-lucide="map-pin" class="w-3 h-3"></i> ${locText}
                   </a>
                   <div class="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/80 mb-2">
                     <strong class="text-orange-400 text-[10px] uppercase tracking-widest block mb-1.5 flex items-center gap-1.5"><i data-lucide="list-checks" class="w-3.5 h-3.5"></i> Game Day Checklist</strong>
                     <p class="text-[11px] text-slate-300 mb-1 leading-snug"><strong class="text-white">Uniform:</strong> ${ev.uniform || 'Standard Kit'}</p>
                     <p class="text-[11px] text-slate-300 mb-2 leading-snug"><strong class="text-white">Pack:</strong> ${ev.bring || 'Water, Shin Guards, Cleats'}</p>
                     <a href="${driveFolderLink}" target="_blank" class="w-full py-2 px-3 bg-orange-600/20 text-orange-400 hover:bg-orange-600 hover:text-white rounded-lg border border-orange-500/30 flex items-center justify-center gap-1.5 transition text-[11px] font-bold">
                       <i data-lucide="folder-plus" class="w-3.5 h-3.5"></i> Upload / View Media Folder for this Game
                     </a>
                   </div>`;
      } else if (isPractice) {
        content += `<h4 class="text-blue-400 font-bold text-sm mb-1">${currentLang === 'en' ? 'PRACTICE' : 'ENTRENAMIENTO'}</h4>
                   <p class="text-white text-xs font-semibold mb-1">${formattedDate}</p>
                   <p class="text-slate-300 text-xs mb-1">6:45 PM - 8:00 PM</p>
                   <a href="https://maps.google.com/?q=14562+Interstate+45+South,+Conroe,+Texas+77384" target="_blank" class="text-blue-400 hover:text-blue-300 text-xs flex items-center justify-center gap-0.5 hover:underline transition">
                     <i data-lucide="map-pin" class="w-3 h-3"></i> HDL Complex Field
                   </a>`;
      } else {
        content += `<h4 class="text-slate-400 font-bold text-sm mb-1">${currentLang === 'en' ? 'NO EVENT' : 'SIN EVENTO'}</h4>
                   <p class="text-white text-xs font-semibold">${formattedDate}</p>`;
      }
      
      if (isGameOrScrimmage || isPractice) {
        let timeHour = 19;
        if (ev && ev.time) {
            const timeMatch = ev.time.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
            if (timeMatch) {
                let h = parseInt(timeMatch[1], 10);
                const ampm = timeMatch[3] ? timeMatch[3].toUpperCase() : '';
                if (ampm === 'PM' && h < 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                timeHour = h;
            }
        } else if (isPractice) {
            timeHour = 18;
        }
        
        // Add Advanced Weather Placeholder
        content += `<div id="hourly-weather" class="mt-3 p-2 bg-slate-900/80 border border-slate-800 rounded-lg text-[11px] text-slate-300 flex items-center justify-center shadow-inner">
            <i data-lucide="loader" class="w-3 h-3 animate-spin text-orange-400"></i> <span class="ml-2">Analyzing game-time weather...</span>
        </div>`;
        
        // Check if anyone signed up for this date
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const lookupDate = monthNames[parseInt(m, 10) - 1] + " " + parseInt(d, 10);
        
        let signupHTML = '';
        let drinksCovered = false;
        let drinkVolunteers = [];
        if (signupsMap.has(lookupDate) && signupsMap.get(lookupDate).drinks.length > 0) {
            drinksCovered = true;
            drinkVolunteers = signupsMap.get(lookupDate).drinks;
        } else if (signupsMap.has(dateStr) && signupsMap.get(dateStr).drinks.length > 0) {
            drinksCovered = true;
            drinkVolunteers = signupsMap.get(dateStr).drinks;
        }

        if (drinksCovered) {
            signupHTML += `<div class="flex items-start gap-2 mt-2 text-[11px] text-emerald-300 bg-emerald-900/30 p-2 rounded border border-emerald-800/50">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400"></i>
                <span><strong>Drinks covered by:</strong> ${drinkVolunteers.join(', ')}</span>
            </div>`;
        } else if (isGameOrScrimmage) {
             signupHTML += `<div class="flex items-start gap-2 mt-2 text-[11px] text-orange-300 bg-orange-900/30 p-2 rounded border border-orange-800/50">
                    <i data-lucide="alert-circle" class="w-3.5 h-3.5 shrink-0 mt-0.5 text-orange-400"></i>
                    <span><strong>Drinks are still needed!</strong></span>
                </div>`;
        }

        if (signupHTML) {
            content += `<div class="mt-3 border-t border-slate-700/50 pt-2">${signupHTML}</div>`;
        }

        if (isGameOrScrimmage && !drinksCovered) {
            content += `<div class="mt-3">
              <button onclick="openVolunteerModal('${lookupDate}')" class="w-full p-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg border border-emerald-500/30 flex flex-col items-center justify-center gap-1 transition text-[10px] font-bold text-center">
                <i data-lucide="cup-soda" class="w-4 h-4"></i> Volunteer for Drinks
              </button>
            </div>`;
        }

        if (isGameOrScrimmage) {
            content += `<div class="mt-2">
              <button onclick="openCarpoolModal('${dateStr}', '${lookupDate}', '${(ev ? ev.opponent || '' : '').replace(/'/g, "\\'")}', '${(ev ? ev.location || '' : '').replace(/'/g, "\\'")}');" class="w-full p-2 bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white rounded-lg border border-purple-500/30 flex items-center justify-center gap-1.5 transition text-[10px] font-bold text-center shadow">
                <i data-lucide="car" class="w-3.5 h-3.5 text-purple-400"></i> Carpool & Travel Coordination
              </button>
            </div>`;
        }

        // Add Interactive Weather Radar
        content += `<iframe width="100%" height="150" src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=%C2%B0F&metricWind=mph&zoom=11&overlay=radar&product=radar&crosshair=marker&lat=30.2975&lon=-95.4655" frameborder="0" class="rounded-xl mt-3 border border-slate-700/50 opacity-90 hover:opacity-100 transition-opacity shadow-lg"></iframe>`;
        
        // Fetch specific hourly weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=30.2975&longitude=-95.4655&hourly=temperature_2m,precipitation_probability&temperature_unit=fahrenheit&timezone=America%2FChicago&start_date=${dateStr}&end_date=${dateStr}`;
        fetch(weatherUrl).then(res => res.json()).then(data => {
            if(data && data.hourly && data.hourly.temperature_2m && data.hourly.temperature_2m.length > 0) {
                const hourIdx = Math.min(Math.max(timeHour, 0), data.hourly.temperature_2m.length - 1);
                const temp = Math.round(data.hourly.temperature_2m[hourIdx]);
                const rain = data.hourly.precipitation_probability ? data.hourly.precipitation_probability[hourIdx] : 0;
                
                let hotWarning = '';
                if(temp >= 90) {
                    hotWarning = `<div class="w-full mt-2 text-center text-red-400 font-bold bg-red-900/30 border border-red-800 rounded py-1.5 px-2 text-[10px]">⚠️ Hydration alert: High temp forecast (${temp}°F)!</div>`;
                }

                const wBox = document.getElementById('hourly-weather');
                if(wBox) {
                    wBox.innerHTML = `<div class="flex justify-around w-full items-center">
                        <div class="flex items-center gap-1"><i data-lucide="thermometer" class="w-4 h-4 text-orange-400"></i> <span>Est. Temp: <strong class="text-white">${temp}°F</strong></span></div>
                        <div class="flex items-center gap-1"><i data-lucide="cloud-rain" class="w-4 h-4 text-blue-400"></i> <span>Rain Chance: <strong class="text-white">${rain}%</strong></span></div>
                    </div>${hotWarning}`;
                    if (window.lucide) lucide.createIcons();
                }
            } else {
                const wBox = document.getElementById('hourly-weather');
                if(wBox) {
                    wBox.innerHTML = `<div class="text-center text-[10px] text-slate-400">🌦️ Weather forecast available within 16 days of event date</div>`;
                }
            }
        }).catch(() => {
            const wBox = document.getElementById('hourly-weather');
            if(wBox) {
                wBox.innerHTML = `<div class="text-center text-[10px] text-slate-400">🌦️ Weather forecast available within 16 days of event date</div>`;
            }
        });
      }
      
      detailsBox.innerHTML = content;
      detailsBox.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }

    function changeMonth(delta) {
      currentDate.setMonth(currentDate.getMonth() + delta);
      renderCalendar();
      renderEventList();
    }

    let weatherCache = {};

    function applyWeatherToDOM() {
      document.querySelectorAll('[id^="weather-"]').forEach(el => {
        const dateStr = el.id.replace('weather-', '');
        if (weatherCache[dateStr]) {
          const w = weatherCache[dateStr];
          el.innerHTML = `<i data-lucide="${w.icon}" class="w-3.5 h-3.5 ${w.iconClass}"></i> ${w.temp}°F`;
        } else {
          const [y, m, d] = dateStr.split('-').map(Number);
          const evDate = new Date(y, m - 1, d);
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((evDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 15) {
            el.innerHTML = `<i data-lucide="cloud-sun" class="w-3 h-3 text-slate-400"></i> Forecast Soon`;
          } else if (diffDays < 0) {
            el.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-slate-400"></i> Final`;
          } else {
            el.innerHTML = `<i data-lucide="cloud-sun" class="w-3 h-3 text-slate-400"></i> --°F`;
          }
        }
      });
      if (window.lucide) lucide.createIcons();
    }

    function fetchWeather() {
      // Free Open-Meteo API for Conroe, TX with 16-day forecast window
      const url = "https://api.open-meteo.com/v1/forecast?latitude=30.2975&longitude=-95.4655&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=America%2FChicago&forecast_days=16";
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!data || !data.daily) return;
          
          data.daily.time.forEach((dateStr, index) => {
            const maxT = Math.round(data.daily.temperature_2m_max[index]);
            const code = data.daily.weathercode[index];
            
            // Map simple weather codes to lucide icons
            let iconName = "cloud-sun";
            let statusTextEn = "HDL Soccer Facility: All Fields OPEN & Playable.";
            let statusTextEs = "Centro HDL: Todos los campos ABIERTOS.";
            let statusColor = "emerald-400";
            let bannerBg = "bg-blue-950/80";
            
            if (code <= 3) {
              iconName = "sun"; // clear
            } else if (code >= 51 && code <= 67) {
              iconName = "cloud-rain"; // rain
              statusTextEn = "HDL Soccer Facility: Field Status UNDER REVIEW (Rain).";
              statusTextEs = "Centro HDL: Estado de campos EN REVISIÓN (Lluvia).";
              statusColor = "yellow-400";
              bannerBg = "bg-yellow-900/60";
            } else if (code >= 71 && code <= 77) {
              iconName = "snowflake"; // snow
              statusTextEn = "HDL Soccer Facility: CLOSED due to freeze.";
              statusTextEs = "Centro HDL: CERRADO por clima frío.";
              statusColor = "red-500";
              bannerBg = "bg-red-950/80";
            } else if (code >= 95) {
              iconName = "cloud-lightning"; // storm
              statusTextEn = "HDL Soccer Facility: CLOSED due to storms/lightning.";
              statusTextEs = "Centro HDL: CERRADO por tormentas eléctricas.";
              statusColor = "red-500";
              bannerBg = "bg-red-950/80";
            }
            
            weatherCache[dateStr] = {
              temp: maxT,
              icon: iconName,
              iconClass: iconName === 'sun' ? 'text-yellow-400' : 'text-blue-300'
            };

            if (index === 0) { // Today's weather determines banner
              const banner = document.getElementById('field-status-banner');
              const dot = document.getElementById('field-status-dot');
              const textEl = document.getElementById('field-status-text');
              if(banner && dot && textEl) {
                banner.className = `${bannerBg} border-y border-blue-800/40 px-4 py-1.5 text-center text-xs font-semibold text-blue-200 flex items-center justify-center space-x-2 transition-colors duration-500`;
                dot.className = `w-2 h-2 rounded-full bg-${statusColor} animate-ping`;
                textEl.innerText = currentLang === 'en' ? statusTextEn : statusTextEs;
                // Store translations for toggle
                textEl.setAttribute('data-en', statusTextEn);
                textEl.setAttribute('data-es', statusTextEs);
              }
            }
          });
          applyWeatherToDOM();
        })
        .catch(err => {
          console.error("Weather fetch failed", err);
          applyWeatherToDOM();
        });
    }

    function parseEventDateTime(dateStr, timeStr) {
      if (!dateStr) return null;
      const [y, m, d] = dateStr.split('-').map(Number);
      let hour = 19, minute = 0;
      if (timeStr) {
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (match) {
          hour = parseInt(match[1], 10);
          minute = parseInt(match[2], 10);
          const ampm = match[3] ? match[3].toUpperCase() : '';
          if (ampm === 'PM' && hour < 12) hour += 12;
          if (ampm === 'AM' && hour === 12) hour = 0;
        }
      }
      return new Date(y, m - 1, d, hour, minute, 0);
    }

    let targetKickoffTime = null;

    function updateNextMatchHero() {
      const dates = Object.keys(specificEvents).sort();
      const now = Date.now();
      let nextEvent = null;
      let nextDateStr = null;

      for (let dateStr of dates) {
        const ev = specificEvents[dateStr];
        const eventTime = parseEventDateTime(dateStr, ev.time);
        const expiry = eventTime ? (eventTime.getTime() + 2 * 60 * 60 * 1000) : new Date(dateStr + 'T23:59:59').getTime();
        if (expiry >= now) {
          if (ev.type !== 'practice') {
            nextEvent = ev;
            nextDateStr = dateStr;
            break;
          } else if (!nextEvent) {
            nextEvent = ev;
            nextDateStr = dateStr;
          }
        }
      }

      const matchDateEl = document.getElementById('hero-match-date');
      const homeTeamEl = document.getElementById('hero-home-team');
      const awayTeamEl = document.getElementById('hero-away-team');
      const kickoffEl = document.getElementById('hero-kickoff');
      const arrivalEl = document.getElementById('hero-arrival');
      const uniformEl = document.getElementById('hero-uniform');
      const locationEl = document.getElementById('hero-location');
      const mapLinkEl = document.getElementById('hero-map-link');

      if (nextEvent && nextDateStr) {
        const [y, m, d] = nextDateStr.split('-').map(Number);
        const dObj = new Date(y, m - 1, d);
        const formattedDate = dObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'es-ES', { weekday: 'long', month: 'short', day: 'numeric' });
        
        const matchDateTime = parseEventDateTime(nextDateStr, nextEvent.time);
        targetKickoffTime = matchDateTime ? matchDateTime.getTime() : null;

        if (matchDateEl) matchDateEl.innerText = formattedDate;
        if (homeTeamEl) {
          homeTeamEl.innerText = "HDL ELITE 2013";
          homeTeamEl.className = 'text-sm sm:text-lg font-black text-white hover:text-orange-400 cursor-pointer transition';
          homeTeamEl.onclick = () => openOpponentModal('Houston Dutch Lions');
          homeTeamEl.title = 'Click to view HDL team stats & rankings';
        }
        if (awayTeamEl) {
          awayTeamEl.innerText = nextEvent.opponent ? nextEvent.opponent.toUpperCase() : (nextEvent.type === 'practice' ? (currentLang === 'en' ? 'TEAM PRACTICE' : 'ENTRENAMIENTO') : 'UPCOMING MATCH');
          if (nextEvent.opponent) {
            awayTeamEl.className = 'text-[11px] sm:text-sm font-black text-slate-200 hover:text-orange-400 cursor-pointer underline decoration-dotted transition';
            awayTeamEl.onclick = () => openOpponentModal(nextEvent.opponent);
            awayTeamEl.title = `Click to view ${nextEvent.opponent} stats & GotSport rankings`;
          } else {
            awayTeamEl.className = 'text-[11px] sm:text-sm font-black text-slate-300';
            awayTeamEl.onclick = null;
          }
        }
        if (kickoffEl) kickoffEl.innerText = nextEvent.time || (nextEvent.type === 'practice' ? '6:45 PM' : 'TBD');

        let arrivalText = '30 min prior';
        if (matchDateTime) {
          const arrivalDate = new Date(matchDateTime.getTime() - 30 * 60 * 1000);
          let hr = arrivalDate.getHours();
          let mn = String(arrivalDate.getMinutes()).padStart(2, '0');
          let ampm = hr >= 12 ? 'PM' : 'AM';
          hr = hr % 12;
          if (hr === 0) hr = 12;
          arrivalText = `${hr}:${mn} ${ampm} (30 min prior)`;
        }
        if (arrivalEl) arrivalEl.innerText = arrivalText;

        if (uniformEl) {
          if (nextEvent.uniform) {
            uniformEl.innerText = nextEvent.bring ? `${nextEvent.uniform} | Bring: ${nextEvent.bring}` : nextEvent.uniform;
          } else {
            uniformEl.innerText = nextEvent.type === 'practice' ? 'Practice Kit / Shinguards & Ball' : 'Bring Both, Wear Orange';
          }
        }

        const loc = nextEvent.location || '14562 Interstate 45 S, Conroe, TX 77384';
        if (locationEl) locationEl.innerText = loc;
        if (mapLinkEl) mapLinkEl.href = `https://maps.google.com/?q=${encodeURIComponent(loc)}`;
      } else {
        targetKickoffTime = null;
        if (matchDateEl) matchDateEl.innerText = currentLang === 'en' ? 'Matches Completed / TBD' : 'Partidos Completados / TBD';
        if (awayTeamEl) awayTeamEl.innerText = currentLang === 'en' ? 'SCHEDULE TBD' : 'CALENDARIO TBD';
        if (kickoffEl) kickoffEl.innerText = '--:--';
        if (arrivalEl) arrivalEl.innerText = '--:--';
        if (uniformEl) uniformEl.innerText = 'Standard Kit';
        if (locationEl) locationEl.innerText = '14562 Interstate 45 S, Conroe, TX 77384';
      }
      updateCountdown();
    }

    // Scroll Animations Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));

    // Dynamic Live Countdown Logic
    function updateCountdown() {
      if (!targetKickoffTime) {
        document.getElementById('cd-d').innerText = "00";
        document.getElementById('cd-h').innerText = "00";
        document.getElementById('cd-m').innerText = "00";
        document.getElementById('cd-s').innerText = "00";
        return;
      }

      const now = Date.now();
      const distance = targetKickoffTime - now;

      if (distance < 0) {
        document.getElementById('cd-d').innerText = "00";
        document.getElementById('cd-h').innerText = "00";
        document.getElementById('cd-m').innerText = "00";
        document.getElementById('cd-s').innerText = "00";
        if (distance < -2 * 60 * 60 * 1000) {
          updateNextMatchHero();
        }
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('cd-d').innerText = d.toString().padStart(2, '0');
      document.getElementById('cd-h').innerText = h.toString().padStart(2, '0');
      document.getElementById('cd-m').innerText = m.toString().padStart(2, '0');
      document.getElementById('cd-s').innerText = s.toString().padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
    
    // PWA Service Worker Registration & iOS Banner
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.warn('Service Worker registration failed: ', err);
        });
      });
    }
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
    if (isIos() && !isInStandaloneMode()) {
      const banner = document.getElementById('ios-install-banner');
      if (banner) banner.classList.remove('hidden');
    }

    // Initialize all data
    processEventsData(null);
    fetchEventsData();
    fetchAndRenderDirectory();
    initLiveMatchPolling();
    fetchMediaData();
    renderCalendar();
    renderStandings();
    renderOpponents();
    fetchWeather();
    fetchSignups();
    setInterval(fetchSignups, 60000);

    // ==========================================
    // TACTICS BOARD DRAG AND DROP (MOUSE + TOUCH)
    // ==========================================
    const pitch = document.getElementById('tactics-pitch');
    let draggedToken = null;
    let initialX, initialY, currentX, currentY, xOffset = 0, yOffset = 0;

    // Save default positions for reset
    const defaultPositions = {};
    document.querySelectorAll('[id^="token-"]').forEach(token => {
      defaultPositions[token.id] = { top: token.style.top, left: token.style.left };
      
      // Touch events
      token.addEventListener('touchstart', dragStart, {passive: false});
      token.addEventListener('touchend', dragEnd, {passive: false});
      token.addEventListener('touchmove', drag, {passive: false});
      
      // Mouse events
      token.addEventListener('mousedown', dragStart, false);
    });

    document.addEventListener('mouseup', dragEnd, false);
    document.addEventListener('mousemove', drag, false);

    function dragStart(e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX;
        initialY = e.touches[0].clientY;
        draggedToken = e.target;
      } else {
        initialX = e.clientX;
        initialY = e.clientY;
        if(e.target.id.startsWith('token-')) {
          draggedToken = e.target;
        }
      }
      
      if(draggedToken) {
          // Bring to front
          document.querySelectorAll('[id^="token-"]').forEach(t => t.style.zIndex = "10");
          draggedToken.style.zIndex = "20";
      }
    }

    function drag(e) {
      if (draggedToken) {
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
          initialX = e.touches[0].clientX;
          initialY = e.touches[0].clientY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
          initialX = e.clientX;
          initialY = e.clientY;
        }

        const rect = pitch.getBoundingClientRect();
        const tokenRect = draggedToken.getBoundingClientRect();
        
        let newLeft = draggedToken.offsetLeft + currentX;
        let newTop = draggedToken.offsetTop + currentY;
        
        // Boundaries
        newLeft = Math.max(0, Math.min(newLeft, rect.width - tokenRect.width));
        newTop = Math.max(0, Math.min(newTop, rect.height - tokenRect.height));

        draggedToken.style.left = (newLeft / rect.width) * 100 + "%";
        draggedToken.style.top = (newTop / rect.height) * 100 + "%";
      }
    }

    function dragEnd(e) {
      draggedToken = null;
    }

    const formation4231 = {
      'token-gk': { top: '4%', left: '45%' },
      'token-lb': { top: '18%', left: '8%' },
      'token-cb1': { top: '16%', left: '32%' },
      'token-cb2': { top: '16%', left: '58%' },
      'token-rb': { top: '18%', left: '82%' },
      'token-cdm1': { top: '32%', left: '28%' },
      'token-cdm2': { top: '32%', left: '62%' },
      'token-lw': { top: '50%', left: '10%' },
      'token-cam': { top: '48%', left: '45%' },
      'token-rw': { top: '50%', left: '80%' },
      'token-st': { top: '66%', left: '45%' },
      'token-ball': { top: '76%', left: '46%' }
    };

    const formationHighPress = {
      'token-gk': { top: '10%', left: '45%' },
      'token-lb': { top: '32%', left: '12%' },
      'token-cb1': { top: '30%', left: '34%' },
      'token-cb2': { top: '30%', left: '56%' },
      'token-rb': { top: '32%', left: '78%' },
      'token-cdm1': { top: '48%', left: '30%' },
      'token-cdm2': { top: '48%', left: '60%' },
      'token-lw': { top: '68%', left: '12%' },
      'token-cam': { top: '74%', left: '38%' },
      'token-rw': { top: '68%', left: '78%' },
      'token-st': { top: '78%', left: '58%' },
      'token-ball': { top: '84%', left: '52%' }
    };

    function applyFormation(type) {
      const form = type === 'highpress' ? formationHighPress : formation4231;
      for (const [id, pos] of Object.entries(form)) {
        const el = document.getElementById(id);
        if (el) {
          el.style.top = pos.top;
          el.style.left = pos.left;
        }
      }
    }

    function resetTactics() {
       applyFormation('4231');
    }
  