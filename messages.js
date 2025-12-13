// Messages page: send and receive messages between users
(function(){
  function byId(id){ return document.getElementById(id); }

  // Apply saved theme on page load
  (function applyTheme(){
    const saved = localStorage.getItem('visionvt_theme') || 'light';
    if(saved === 'system'){ document.documentElement.removeAttribute('data-theme'); }
    else{ document.documentElement.setAttribute('data-theme', saved); }
  })();

  // Check if user is logged in
  const current = localStorage.getItem('visionvt_logged_in_user');
  if(!current){
    window.location.href = 'index.html';
  }

  // Sidebar collapse handling
  const side = document.getElementById('side-nav');
  const toggle = document.getElementById('sidebar-toggle');
  if(side && toggle){
    toggle.addEventListener('click', ()=>{
      const isCollapsed = side.classList.toggle('collapsed');
      localStorage.setItem('visionvt_sidebar_collapsed', isCollapsed ? '1' : '0');
    });
    if(localStorage.getItem('visionvt_sidebar_collapsed') === '1') side.classList.add('collapsed');
  }

  // Logout handler
  const logoutBtn = byId('logout-btn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{
      localStorage.removeItem('visionvt_logged_in_user');
      window.location.href = 'index.html';
    });
  }

  // Message storage helpers
  function getAllMessages(){
    const raw = localStorage.getItem('visionvt_messages') || '[]';
    return JSON.parse(raw);
  }

  function saveMessages(messages){
    localStorage.setItem('visionvt_messages', JSON.stringify(messages));
  }

  function getInboxMessages(username){
    return getAllMessages().filter(m => m.to === username);
  }

  function getSentMessages(username){
    return getAllMessages().filter(m => m.from === username);
  }

  // Render inbox
  function renderInbox(){
    const inbox = byId('inbox-list');
    if(!inbox) return;
    const messages = getInboxMessages(current);
    if(messages.length === 0){
      inbox.innerHTML = '<p style="color:var(--muted);">No messages yet.</p>';
      return;
    }
    inbox.innerHTML = '';
    messages.forEach((msg, idx)=>{
      const div = document.createElement('div');
      div.style.cssText = 'padding:10px;border-bottom:1px solid var(--border);';
      const time = new Date(msg.timestamp).toLocaleString();
      div.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${msg.from}</strong>
          <small style="color:var(--muted);">${time}</small>
        </div>
        <p style="margin:8px 0;">${msg.text}</p>
        <button data-idx="${idx}" class="delete-msg-btn" style="font-size:0.8rem;">Delete</button>
      `;
      inbox.appendChild(div);
    });
    // Delete handler
    inbox.querySelectorAll('.delete-msg-btn').forEach(btn=>btn.addEventListener('click', e=>{
      const i = parseInt(e.currentTarget.dataset.idx, 10);
      const all = getAllMessages();
      const toDelete = getInboxMessages(current)[i];
      const updated = all.filter(m => m !== toDelete);
      saveMessages(updated);
      renderInbox();
    }));
  }

  // Render sent
  function renderSent(){
    const sent = byId('sent-list');
    if(!sent) return;
    const messages = getSentMessages(current);
    if(messages.length === 0){
      sent.innerHTML = '<p style="color:var(--muted);">No sent messages.</p>';
      return;
    }
    sent.innerHTML = '';
    messages.forEach((msg, idx)=>{
      const div = document.createElement('div');
      div.style.cssText = 'padding:10px;border-bottom:1px solid var(--border);';
      const time = new Date(msg.timestamp).toLocaleString();
      div.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>To: ${msg.to}</strong>
          <small style="color:var(--muted);">${time}</small>
        </div>
        <p style="margin:8px 0;">${msg.text}</p>
        <button data-sidx="${idx}" class="delete-sent-btn" style="font-size:0.8rem;">Delete</button>
      `;
      sent.appendChild(div);
    });
    // Delete handler
    sent.querySelectorAll('.delete-sent-btn').forEach(btn=>btn.addEventListener('click', e=>{
      const i = parseInt(e.currentTarget.dataset.sidx, 10);
      const all = getAllMessages();
      const toDelete = getSentMessages(current)[i];
      const updated = all.filter(m => m !== toDelete);
      saveMessages(updated);
      renderSent();
    }));
  }

  // Send message handler
  const form = byId('message-form');
  const result = byId('send-result');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const to = (byId('recipient-username').value || '').trim();
      const text = (byId('message-text').value || '').trim();

      if(!to || !text){
        result.textContent = 'Please fill in all fields.';
        result.style.color = 'salmon';
        return;
      }

      if(to === current){
        result.textContent = 'You cannot message yourself.';
        result.style.color = 'salmon';
        return;
      }

      // For now, we accept messages to any username (no validation against existing users)
      // In production, you'd check if the recipient exists
      const msg = {
        from: current,
        to: to,
        text: text,
        timestamp: new Date().toISOString()
      };

      const all = getAllMessages();
      all.push(msg);
      saveMessages(all);

      result.textContent = '✓ Message sent!';
      result.style.color = '#9fffcf';
      byId('recipient-username').value = '';
      byId('message-text').value = '';

      renderInbox();
      renderSent();

      setTimeout(()=>{ result.textContent = ''; }, 3000);
    });
  }

  // Initial render
  renderInbox();
  renderSent();

})();
