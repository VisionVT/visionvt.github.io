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

  // AI keys handling
  const keyOpen = document.getElementById('key-openai');
  const keyAnthropic = document.getElementById('key-anthropic');
  const keyGoogle = document.getElementById('key-google');
  const keyGitHub = document.getElementById('key-github');
  const saveBtn = document.getElementById('save-keys');
  const clearBtn = document.getElementById('clear-keys');

  function loadKeys(){
    keyOpen.value = localStorage.getItem('visionvt_key_openai') || '';
    keyAnthropic.value = localStorage.getItem('visionvt_key_anthropic') || '';
    keyGoogle.value = localStorage.getItem('visionvt_key_google') || '';
    keyGitHub.value = localStorage.getItem('visionvt_key_github') || '';
  }

  saveBtn.addEventListener('click', ()=>{
    localStorage.setItem('visionvt_key_openai', keyOpen.value.trim());
    localStorage.setItem('visionvt_key_anthropic', keyAnthropic.value.trim());
    localStorage.setItem('visionvt_key_google', keyGoogle.value.trim());
    localStorage.setItem('visionvt_key_github', keyGitHub.value.trim());
    alert('Keys saved locally. Keep them private.');
  });

  clearBtn.addEventListener('click', ()=>{
    localStorage.removeItem('visionvt_key_openai');
    localStorage.removeItem('visionvt_key_anthropic');
    localStorage.removeItem('visionvt_key_google');
    localStorage.removeItem('visionvt_key_github');
    loadKeys();
    alert('Keys cleared from localStorage.');
  });

  // initial render
  renderSocials();
  loadKeys();

})();
