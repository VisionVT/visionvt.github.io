// AI page: minimal client-side caller for different providers using keys saved in settings
(function(){
  const providerEl = document.getElementById('ai-provider');
  const promptEl = document.getElementById('ai-prompt');
  const sendBtn = document.getElementById('send-ai');
  const respEl = document.getElementById('ai-response');

  function getKeyForProvider(provider){
    switch(provider){
      case 'openai': return localStorage.getItem('visionvt_key_openai');
      case 'anthropic': return localStorage.getItem('visionvt_key_anthropic');
      case 'google': return localStorage.getItem('visionvt_key_google');
      case 'github': return localStorage.getItem('visionvt_key_github');
      default: return null;
    }
  }

  async function callOpenAI(apiKey, prompt){
    const body = {
      model: 'gpt-4o-mini',
      messages: [{role:'user', content: prompt}],
      max_tokens: 800
    };
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', headers: { 'Content-Type':'application/json', 'Authorization':'Bearer ' + apiKey }, body: JSON.stringify(body)
    });
    if(!res.ok) throw new Error('OpenAI request failed');
    const j = await res.json();
    return j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : JSON.stringify(j,null,2);
  }

  // Placeholder implementations — only OpenAI is wired here. Other providers can be added when you provide API details.
  async function sendRequest(provider, prompt){
    const key = getKeyForProvider(provider);
    if(!key) throw new Error('No API key for ' + provider + '. Add it in Settings.');
    if(provider === 'openai'){
      return await callOpenAI(key, prompt);
    }
    if(provider === 'github'){
      // GitHub AI/ Copilot APIs vary by offering; as a placeholder we return a helpful message.
      return 'GitHub AI selected. Provide an integration or use GitHub Codespaces/Copilot extensions. Paste a GitHub AI token in Settings and implement server-side forwarding.';
    }
    return 'Provider selected ('+provider+') is not yet wired in this demo.';
  }

  sendBtn.addEventListener('click', async ()=>{
    const provider = providerEl.value;
    const prompt = promptEl.value.trim();
    if(!prompt) return alert('Please enter a prompt.');
    respEl.textContent = 'Sending...';
    try{
      const out = await sendRequest(provider, prompt);
      respEl.textContent = out;
    }catch(err){
      respEl.textContent = 'Error: ' + (err.message || String(err));
    }
  });

})();
