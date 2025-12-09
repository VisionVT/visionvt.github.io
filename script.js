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
  // Lightweight login-only script: validates local credentials and redirects to dashboard.html
  const ALLOWED_USERNAME = 'eastonvteggers';
  const ALLOWED_PASSWORD = 'Creativity9918EE';

  const form = document.getElementById('login-form');
  const result = document.getElementById('login-result');

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
      // redirect to separate dashboard page
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
