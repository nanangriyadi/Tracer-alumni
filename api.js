// ============================================================
//  API CLIENT - Komunikasi ke Google Apps Script
//  Menggunakan JSONP untuk GET (bypass CORS browser)
//  Menggunakan fetch dengan mode no-cors untuk POST
// ============================================================

const API = {

  // ── JSONP: satu-satunya cara reliable untuk GET ke GAS dari browser ──
  jsonp(params) {
    return new Promise((resolve, reject) => {
      // Buat nama callback unik
      const cbName = '_gasCb_' + Date.now() + '_' + Math.floor(Math.random() * 9999);

      // Set timeout 15 detik
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout (15s). Cek URL di config.js.'));
      }, 15000);

      function cleanup() {
        clearTimeout(timer);
        delete window[cbName];
        const el = document.getElementById(cbName);
        if (el) el.remove();
      }

      // Daftarkan callback global
      window[cbName] = function(data) {
        cleanup();
        resolve(data);
      };

      // Bangun URL dengan semua params + callback
      const url = new URL(CONFIG.API_URL);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      url.searchParams.set('callback', cbName);

      // Inject script tag
      const script = document.createElement('script');
      script.id  = cbName;
      script.src = url.toString();
      script.onerror = () => {
        cleanup();
        reject(new Error('Gagal load script. Periksa URL di config.js.'));
      };
      document.head.appendChild(script);
    });
  },

  // ── POST via fetch (GAS menerima text/plain untuk doPost) ──
  async post(body) {
    // GAS doPost butuh redirect: follow dan mode tidak boleh no-cors
    // karena no-cors tidak bisa baca response
    const res = await fetch(CONFIG.API_URL, {
      method:   'POST',
      redirect: 'follow',
      headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
      body:     JSON.stringify(body),
    });
    if (!res.ok) throw new Error('HTTP error: ' + res.status);
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('Response bukan JSON: ' + text.substring(0, 100));
    }
  },

  // ── Public API methods ──
  getAllData:   ()           => API.jsonp({ action: 'getData' }),
  verifyAdmin: (pw)         => API.jsonp({ action: 'verify', pw }),
  addRow:      (data, pw)   => API.post({ action: 'add',    data, pw }),
  updateRow:   (data, pw)   => API.post({ action: 'update', data, pw }),
  deleteRow:   (id,   pw)   => API.post({ action: 'delete', id,   pw }),
};
