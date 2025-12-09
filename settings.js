// Settings page: manage social links and local AI keys
(function(){
  const socialForm = document.getElementById('social-form');
  const nameInput = document.getElementById('social-name');
  const urlInput = document.getElementById('social-url');
  const savedList = document.getElementById('saved-socials');

  function loadSocials(){
    const raw = localStorage.getItem('visionvt_socials');
    return raw ? JSON.parse(raw) : [];
  }
  function saveSocials(list){ localStorage.setItem('visionvt_socials', JSON.stringify(list)); }

  function renderSocials(){
    const list = loadSocials();
    savedList.innerHTML = '';
    list.forEach((s, idx)=>{
      const li = document.createElement('li');
      li.innerHTML = `<a href="${s.url}" target="_blank" rel="noopener">${s.name}</a> <button data-idx="${idx}">Remove</button>`;
      savedList.appendChild(li);
    });
    savedList.querySelectorAll('button').forEach(b=>b.addEventListener('click', e=>{
      const i = parseInt(e.currentTarget.dataset.idx,10);
      const arr = loadSocials(); arr.splice(i,1); saveSocials(arr); renderSocials();
    }));
  }

  socialForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    if(!name || !url) return;
    const arr = loadSocials(); arr.push({name,url}); saveSocials(arr);
    nameInput.value = ''; urlInput.value = ''; renderSocials();
  });

  // AI keys were removed from the settings UI per request.

  // initial render
  renderSocials();

  // --- Homepage controls ---
  const homeShowLinks = document.getElementById('home-show-links');
  const homeForm = document.getElementById('home-widget-form');
  const hwTitle = document.getElementById('home-widget-title');
  const hwText = document.getElementById('home-widget-text');
  const hwList = document.getElementById('home-widgets-list');

  function loadHomeShow(){ return localStorage.getItem('visionvt_home_show_links') === '1'; }
  function setHomeShow(v){ localStorage.setItem('visionvt_home_show_links', v ? '1' : '0'); }

  function loadHomeWidgets(){ const raw = localStorage.getItem('visionvt_home_widgets'); return raw ? JSON.parse(raw) : []; }
  function saveHomeWidgets(a){ localStorage.setItem('visionvt_home_widgets', JSON.stringify(a)); }

  function renderHomeWidgetsSettings(){
    if(!hwList) return;
    const arr = loadHomeWidgets(); hwList.innerHTML = '';
    arr.forEach((w, idx)=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>${w.title}</strong> — ${w.text} <button data-idx="${idx}">Remove</button>`;
      hwList.appendChild(li);
    });
    hwList.querySelectorAll('button').forEach(b=>b.addEventListener('click', e=>{ const i=parseInt(e.currentTarget.dataset.idx,10); const a=loadHomeWidgets(); a.splice(i,1); saveHomeWidgets(a); renderHomeWidgetsSettings(); }));
  }

  if(homeShowLinks) homeShowLinks.checked = loadHomeShow();
  homeShowLinks && homeShowLinks.addEventListener('change', ()=>{ setHomeShow(!!homeShowLinks.checked); alert('Homepage setting saved.'); });

  homeForm && homeForm.addEventListener('submit', (e)=>{
    e.preventDefault(); const t=(hwTitle.value||'').trim(); const txt=(hwText.value||'').trim(); if(!t) return alert('Please set a title');
    const arr = loadHomeWidgets(); arr.push({title:t,text:txt}); saveHomeWidgets(arr); hwTitle.value=''; hwText.value=''; renderHomeWidgetsSettings();
  });

  renderHomeWidgetsSettings();

  // Account username handling
  const accountInput = document.getElementById('account-username');
  const saveAccountBtn = document.getElementById('save-account');

  function loadAccount(){
    accountInput.value = localStorage.getItem('visionvt_account_username') || '';
  }

  saveAccountBtn.addEventListener('click', ()=>{
    const v = (accountInput.value || '').trim();
    if(!v){ alert('Username cannot be empty'); return; }
    localStorage.setItem('visionvt_account_username', v);
    alert('Account username saved locally. Use this username to sign in.');
  });

  loadAccount();

})();
