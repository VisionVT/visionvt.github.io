// Dashboard logic: analytics (CountAPI), per-user tracking, tour, and logout
(function(){
  function byId(id){ return document.getElementById(id); }

  async function incrementCount(key){
    try{
      const res = await fetch('https://api.countapi.xyz/hit/visionvt/' + encodeURIComponent(key));
      if(!res.ok) throw new Error('countapi error');
      return await res.json();
    }catch(e){
      return null;
    }
  }

  async function loadDashboard(username){
    byId('dash-welcome').textContent = 'Welcome, ' + username;

    const todayKey = 'visits_' + new Date().toISOString().slice(0,10);
    const [globalRes, todayRes] = await Promise.all([
      incrementCount('site_visits'),
      incrementCount(todayKey)
    ]);

    byId('total-visits').textContent = (globalRes && typeof globalRes.value !== 'undefined') ? globalRes.value : 'n/a';
    byId('today-visits').textContent = (todayRes && typeof todayRes.value !== 'undefined') ? todayRes.value : 'n/a';

    const userKey = 'visits_user_' + username;
    const prev = parseInt(localStorage.getItem(userKey) || '0', 10);
    const now = prev + 1;
    localStorage.setItem(userKey, now);
    byId('user-visits').textContent = now;

    // Logout
    byId('logout-btn').addEventListener('click', ()=>{
      localStorage.removeItem('visionvt_logged_in_user');
      window.location.href = 'index.html';
    });

    byId('show-tour').addEventListener('click', showTour);
    byId('reset-tour').addEventListener('click', ()=>{
      localStorage.removeItem('tour_seen_' + username);
      alert('Tour reset. It will show automatically next sign-in.');
    });

    // render published list and comments (placeholder content)
    const published = byId('published-list');
    if(published){
      published.innerHTML = '';
      const demos = [
        {title:'Installing Windows 11 On My Steam Deck', views:4},
        {title:'Looking at the NuEyes Pro 4 For blind people', views:2},
        {title:'Putting Windows 8.1 On My Steam Deck', views:2}
      ];
      demos.forEach(d=>{
        const li = document.createElement('li');
        li.innerHTML = `<div class="thumb">IMG</div><div class="vmeta"><strong>${d.title}</strong><div class="meta">${d.views} views</div></div>`;
        published.appendChild(li);
      });
    }

    const comments = byId('comments-list');
    if(comments){ comments.innerHTML = '<li>No comments yet</li>'; }

    // Auto-show tour for new users
    if(!localStorage.getItem('tour_seen_' + username)){
      setTimeout(showTour, 400);
    }
  }

  // Redirect to login if not signed in, otherwise handle empty-state pages specially
  const current = localStorage.getItem('visionvt_logged_in_user');
  if(!current){
    window.location.href = 'index.html';
  } else {
    // if this page is the minimal empty-state, attach only lightweight handlers and skip full dashboard init
    if(document.querySelector('.empty-state')){
      const logoutBtn = byId('logout-btn');
      if(logoutBtn){ logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('visionvt_logged_in_user'); window.location.href = 'index.html'; }); }
      // restore sidebar collapse if present
      const side = document.getElementById('side-nav');
      if(side && localStorage.getItem('visionvt_sidebar_collapsed') === '1') side.classList.add('collapsed');
      // render socials minimally
      setTimeout(()=>{ renderSocials(); renderHomeWidgets(); }, 400);
    } else {
      loadDashboard(current);
    }
  }

  // Load socials configured in settings and attempt to fetch viewer counts
  function renderSocials(){
    const list = JSON.parse(localStorage.getItem('visionvt_socials') || '[]');
    const ul = byId('social-list');
    if(!ul) return;
    ul.innerHTML = '';
    list.forEach(async (s)=>{
      const li = document.createElement('li');
      li.textContent = s.name + ' — ';
      const span = document.createElement('span'); span.textContent = 'loading...';
      li.appendChild(span);
      ul.appendChild(li);

      // Try GitHub username detection: github.com/<user>
      try{
        const u = new URL(s.url);
        if(u.hostname.includes('github.com')){
          const parts = u.pathname.split('/').filter(Boolean);
          if(parts.length >= 1){
            const ghUser = parts[0];
            // fetch public GitHub user info
            const g = await fetch('https://api.github.com/users/' + encodeURIComponent(ghUser));
            if(g.ok){
              const jd = await g.json();
              span.textContent = jd.followers + ' followers';
              return;
            }
          }
        }
      }catch(e){/*ignore*/}

      // Default: show link and let user know some providers need keys/server
      span.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener">Open</a>`;
    });
  }

  // Home widgets and related-links visibility
  function loadHomeShow(){ return localStorage.getItem('visionvt_home_show_links') === '1'; }
  function loadHomeWidgets(){ const raw = localStorage.getItem('visionvt_home_widgets'); return raw ? JSON.parse(raw) : []; }

  function renderHomeWidgets(){
    const container = document.getElementById('home-widgets');
    if(!container) return;
    const widgets = loadHomeWidgets();
    container.innerHTML = '';
    widgets.forEach(w=>{
      const card = document.createElement('div'); card.className = 'card';
      card.innerHTML = `<h3>${w.title}</h3><div class="card-body"><div>${w.text || ''}</div></div>`;
      container.appendChild(card);
    });
    // show/hide related links column based on setting
    const relatedCol = document.querySelector('.col-right');
    if(relatedCol){ relatedCol.style.display = loadHomeShow() ? '' : 'none'; }
  }

  // initial render of socials on dashboard load
  setTimeout(renderSocials, 400);

  // Sidebar collapse handling
  const side = document.getElementById('side-nav');
  const toggle = document.getElementById('sidebar-toggle');
  function applySidebarState(collapsed){
    if(collapsed) side.classList.add('collapsed'); else side.classList.remove('collapsed');
    localStorage.setItem('visionvt_sidebar_collapsed', collapsed ? '1' : '0');
  }
  toggle.addEventListener('click', ()=>{
    const isCollapsed = side.classList.toggle('collapsed');
    localStorage.setItem('visionvt_sidebar_collapsed', isCollapsed ? '1' : '0');
  });
  // restore
  if(localStorage.getItem('visionvt_sidebar_collapsed') === '1') applySidebarState(true);

  // --- guided tour ---
  const tourEl = byId('tour');
  const tourTitle = byId('tour-title');
  const tourText = byId('tour-text');
  const tourPrev = byId('tour-prev');
  const tourNext = byId('tour-next');
  const tourClose = byId('tour-close');

  const steps = [
    {title: 'Welcome', text: 'This is your dashboard. You can see site and personal visit counters here.'},
    {title: 'Analytics', text: 'Total visits and today\'s visits are powered by a simple public counter (CountAPI). Your visits are tracked locally in your browser.'},
    {title: 'Controls', text: 'Use Log out to end your session. Use Reset tour to show this guide again.'}
  ];

  let tourIndex = 0;

  function showTour(){
    tourIndex = 0; updateTour();
    tourEl.classList.remove('hidden'); tourEl.setAttribute('aria-hidden','false');
  }
  function updateTour(){
    tourTitle.textContent = steps[tourIndex].title;
    tourText.textContent = steps[tourIndex].text;
  }
  function finishTour(){
    tourEl.classList.add('hidden'); tourEl.setAttribute('aria-hidden','true');
    const u = localStorage.getItem('visionvt_logged_in_user'); if(u) localStorage.setItem('tour_seen_' + u, 'yes');
  }

  tourPrev.addEventListener('click', ()=>{ if(tourIndex>0){ tourIndex--; updateTour(); } });
  tourNext.addEventListener('click', ()=>{ if(tourIndex < steps.length-1){ tourIndex++; updateTour(); } else finishTour(); });
  tourClose.addEventListener('click', finishTour);

})();
