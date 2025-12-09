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
