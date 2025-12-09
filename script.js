// Simple tab handling and client-side shared login
(function(){
  const TABS = document.querySelectorAll('.tab');
  const PANELS = document.querySelectorAll('.panel');

  function showTab(name){
    TABS.forEach(t=>t.classList.toggle('active', t.dataset.tab===name));
    PANELS.forEach(p=>p.classList.toggle('active', p.id===name));
  }

  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=> showTab(btn.dataset.tab));
  });

  // --- Simple single-user login (client-side) ---
  // NOTE: This is intentionally minimal and client-side only. Do NOT use for sensitive accounts.
  // The username and password below were provided by the user and are stored in this file.
  const ALLOWED_USERNAME = 'eastonvteggers';
  const ALLOWED_PASSWORD = 'Creativity9918EE';

  const form = document.getElementById('login-form');
  const result = document.getElementById('login-result');

  function showPanel(id){
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active', p.id===id));
  }

  async function incrementCount(key){
    // Use CountAPI to increment and fetch value. No auth required.
    // key should be a short string; namespace kept as 'visionvt'
    try{
      const res = await fetch('https://api.countapi.xyz/hit/visionvt/' + encodeURIComponent(key));
      if(!res.ok) throw new Error('countapi error');
      return await res.json();
    }catch(e){
      return null;
    }
  }

  async function loadDashboard(username){
    // Show dashboard panel
    showPanel('dashboard');
    document.getElementById('dash-welcome').textContent = 'Welcome, ' + username;

    // Increment global and daily counters
    const todayKey = 'visits_' + new Date().toISOString().slice(0,10);
    const [globalRes, todayRes] = await Promise.all([
      incrementCount('site_visits'),
      incrementCount(todayKey)
    ]);

    if(globalRes && typeof globalRes.value !== 'undefined'){
      document.getElementById('total-visits').textContent = globalRes.value;
    } else {
      document.getElementById('total-visits').textContent = 'n/a';
    }

    if(todayRes && typeof todayRes.value !== 'undefined'){
      document.getElementById('today-visits').textContent = todayRes.value;
    } else {
      document.getElementById('today-visits').textContent = 'n/a';
    }

    // Per-user visits stored locally
    const userKey = 'visits_user_' + username;
    const prev = parseInt(localStorage.getItem(userKey) || '0', 10);
    const now = prev + 1;
    localStorage.setItem(userKey, now);
    document.getElementById('user-visits').textContent = now;

    // Wire logout
    document.getElementById('logout-btn').addEventListener('click', ()=>{
      localStorage.removeItem('visionvt_logged_in_user');
      showPanel('login');
      result.textContent = '';
    });

    // Tour handling
    setupTourForUser(username);
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const pass = document.getElementById('passphrase').value;

    if(username !== ALLOWED_USERNAME){
      result.textContent = 'Unknown username.';
      result.style.color = 'salmon';
      return;
    }

    if(pass === ALLOWED_PASSWORD){
      result.textContent = 'Welcome — signed in as ' + username + '! Redirecting...';
      result.style.color = '#9fffcf';
      localStorage.setItem('visionvt_logged_in_user', username);
      // load dashboard and increment counters
      await loadDashboard(username);
      return;
    }

    result.textContent = 'Incorrect password.';
    result.style.color = 'salmon';
  });

  // If already logged in, show dashboard
  const current = localStorage.getItem('visionvt_logged_in_user');
  if(current){
    loadDashboard(current);
  }

  // --- Guided tour ---
  const tourEl = document.getElementById('tour');
  const tourTitle = document.getElementById('tour-title');
  const tourText = document.getElementById('tour-text');
  const tourPrev = document.getElementById('tour-prev');
  const tourNext = document.getElementById('tour-next');
  const tourClose = document.getElementById('tour-close');

  const steps = [
    {title: 'Welcome', text: 'This is your dashboard. You can see site and personal visit counters here.'},
    {title: 'Analytics', text: 'Total visits and today\'s visits are powered by a simple public counter (CountAPI). Your visits are tracked locally in your browser.'},
    {title: 'Controls', text: 'Use Log out to end your session. Use Reset tour to show this guide again.'}
  ];

  let tourIndex = 0;

  function showTour(){
    tourIndex = 0;
    tourTitle.textContent = steps[tourIndex].title;
    tourText.textContent = steps[tourIndex].text;
    tourEl.classList.remove('hidden');
    tourEl.setAttribute('aria-hidden','false');
  }

  function updateTour(){
    tourTitle.textContent = steps[tourIndex].title;
    tourText.textContent = steps[tourIndex].text;
  }

  tourPrev.addEventListener('click', ()=>{
    if(tourIndex>0) { tourIndex--; updateTour(); }
  });
  tourNext.addEventListener('click', ()=>{
    if(tourIndex < steps.length-1) { tourIndex++; updateTour(); } else { finishTour(); }
  });
  tourClose.addEventListener('click', finishTour);

  function finishTour(){
    tourEl.classList.add('hidden');
    tourEl.setAttribute('aria-hidden','true');
    const u = localStorage.getItem('visionvt_logged_in_user');
    if(u) localStorage.setItem('tour_seen_' + u, 'yes');
  }

  function setupTourForUser(username){
    const seen = localStorage.getItem('tour_seen_' + username);
    document.getElementById('show-tour').addEventListener('click', showTour);
    document.getElementById('reset-tour').addEventListener('click', ()=>{
      localStorage.removeItem('tour_seen_' + username);
      alert('Tour reset. It will show automatically next sign-in.');
    });
    if(!seen){
      // slight delay so dashboard renders
      setTimeout(showTour, 400);
    }
  }

})();
