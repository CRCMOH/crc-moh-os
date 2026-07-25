(function(){
  function isIOS(){return /iphone|ipad|ipod/i.test(navigator.userAgent || "");}
  function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;}
  async function registerServiceWorker(){
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('./sw.js'); } catch(e) { /* fallback */ }
    }
  }
  window.addEventListener('load', function(){ registerServiceWorker(); if(!isStandalone()) document.documentElement.classList.add('can-install-pwa'); });
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    window.__mohInstallPrompt = e;
    document.documentElement.classList.add('can-install-pwa');
  });
  window.MOHInstallApp = async function(){
    const prompt = window.__mohInstallPrompt;
    if (prompt) {
      prompt.prompt();
      await prompt.userChoice.catch(function(){ return null; });
      window.__mohInstallPrompt = null;
      document.documentElement.classList.remove('can-install-pwa');
      return true;
    }
    if (isIOS()) { alert('On iPhone: open this site in Safari, tap Share, then tap Add to Home Screen. The app will install as MoH.'); return false; }
    alert('Open this site in Chrome/Safari, then use the browser menu and choose Add to Home Screen or Install app.');
    return false;
  };
  window.MOHRequestNotifications = async function(){
    if (!('Notification' in window)) { alert('This browser does not support web notifications.'); return false; }
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') { alert('Notifications were not enabled. You can allow them in browser/site settings.'); return false; }
    await window.MOHNotify('MoH notifications enabled', 'You will receive app alerts while the PWA notification system is active.');
    return true;
  };
  window.MOHNotify = async function(title, body){
    if (!('Notification' in window) || Notification.permission !== 'granted') return false;
    try {
      const reg = await navigator.serviceWorker?.ready;
      if (reg?.showNotification) {
        await reg.showNotification(title, { body, icon:'./icon-192.png', badge:'./favicon-32.png', tag:'moh-alert', data:{url:'./index.html#alerts'} });
        return true;
      }
    } catch(e) {}
    new Notification(title, { body, icon:'./icon-192.png' });
    return true;
  };
})();
