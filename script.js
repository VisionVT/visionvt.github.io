// Simple tab handling and client-side shared login
(function(){
  // Apply saved theme on page load
  (function applyTheme(){
    const saved = localStorage.getItem('visionvt_theme') || 'light';
    if(saved === 'system'){ document.documentElement.removeAttribute('data-theme'); }
    else{ document.documentElement.setAttribute('data-theme', saved); }
  })();

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
  // Simple client-side user map: username -> password
  // NOTE: This is intentionally minimal and client-side only. Do NOT use for sensitive accounts.
  // Built-in defaults (used when no persisted users are present)
  const DEFAULT_ALLOWED_USERS = {
    'darwinxmacintosh': 'defaltpass',
    'test123': 'pass'
  };

  function loadAllowedUsers(){
    try{
      const raw = localStorage.getItem('visionvt_allowed_users');
      if(!raw) return DEFAULT_ALLOWED_USERS;
      const parsed = JSON.parse(raw);
      // Ensure parsed is an object
      return (parsed && typeof parsed === 'object') ? parsed : DEFAULT_ALLOWED_USERS;
    }catch(e){
      return DEFAULT_ALLOWED_USERS;
    }
  }

  // Load allowed users from storage (or use built-in defaults)
  const ALLOWED_USERS = loadAllowedUsers();

  // If a username is stored in Settings (localStorage), only that username may sign in.
  function getPreferredUsername(){
    return localStorage.getItem('visionvt_account_username') || null;
  }

  const form = document.getElementById('login-form');
  const result = document.getElementById('login-result');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const pass = document.getElementById('passphrase').value;

    const preferred = getPreferredUsername();

    // If a preferred username is stored, require that username and verify it exists
    if(preferred){
      if(username !== preferred){
        result.textContent = 'Unknown username. If you need an account, click Sign up.';
        result.style.color = 'salmon';
        return;
      }
      if(!(preferred in ALLOWED_USERS)){
        result.textContent = 'Unknown username. If you need an account, click Sign up.';
        result.style.color = 'salmon';
        return;
      }
      if(pass === ALLOWED_USERS[preferred]){
        result.textContent = 'Welcome — signed in as ' + username + '! Redirecting...';
        result.style.color = '#9fffcf';
        localStorage.setItem('visionvt_logged_in_user', username);
        window.location.href = 'dashboard.html';
        return;
      }
      result.textContent = 'Incorrect password.';
      result.style.color = 'salmon';
      return;
    }

    // No preferred username: accept any username present in ALLOWED_USERS
    if(!(username in ALLOWED_USERS)){
      result.textContent = 'Unknown username. If you need an account, click Sign up.';
      result.style.color = 'salmon';
      return;
    }

    if(pass === ALLOWED_USERS[username]){
      result.textContent = 'Welcome — signed in as ' + username + '! Redirecting...';
      result.style.color = '#9fffcf';
      localStorage.setItem('visionvt_logged_in_user', username);
      window.location.href = 'dashboard.html';
      return;
    }

    result.textContent = 'Incorrect password.';
    result.style.color = 'salmon';
  });

  // If already logged in, go directly to dashboard
  const current = localStorage.getItem('visionvt_logged_in_user');
  if(current){
    window.location.href = 'dashboard.html';
  }

})();
