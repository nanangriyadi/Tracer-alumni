// ============================================================
//  API CLIENT - JSONP untuk GET, fetch biasa untuk POST
//  Ini solusi yang benar untuk GAS + GitHub Pages CORS issue
// ============================================================

const API = {

  // ── JSONP GET: bypass CORS redirect GAS sepenuhnya ──
  jsonp(params) {
    return new Promise((resolve, reject) => {
      // Buat nama callback unik
      const cbName = '_gcb_' + Date.now() + '_' + Math.random().toString(36).slice(2);

      // Buat URL dengan callback
      const url = new URL(CONFIG.API_URL);
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
      url.searchParams.append('callback', cbName);

      // Timeout 15 detik
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout. Cek koneksi atau URL GAS.'));
      }, 15000);

      // Cleanup fungsi
      function cleanup() {
        clearTimeout(timer);
        delete window[cbName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      // Daftarkan callback global
      window[cbName] = function(data) {
        cleanup();
        resolve(data);
      };

      // Inject script tag
      const script = document.createElement('script');
      script.src = url.toString();
      script.onerror = function() {
        cleanup();
        reject(new Error('Gagal memuat script GAS. Cek URL di config.js'));
      };
      document.head.appendChild(script);
    });
  },

  // ── POST: tetap pakai fetch biasa (doPost GAS tidak redirect) ──
  async post(body) {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch(e) {
      console.error('POST response bukan JSON:', text.substring(0, 300));
      throw new Error('Response tidak valid dari server.');
    }
  },

  // ── Public methods ──
  getAllData:   ()           => API.jsonp({ action: 'getData' }),
  verifyAdmin: (pw)         => API.jsonp({ action: 'verify', pw }),
  addRow:      (data, pw)   => API.post({ action: 'add',    data, pw }),
  updateRow:   (data, pw)   => API.post({ action: 'update', data, pw }),
  deleteRow:   (id,   pw)   => API.post({ action: 'delete', id,   pw }),
};
