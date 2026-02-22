// ============================================================
//  API CLIENT - Komunikasi ke Google Apps Script backend
//  Menggunakan fetch() karena berjalan di GitHub Pages
// ============================================================

const API = {

  // GET request (getData, verify)
  // Menggunakan mode: 'cors' - GAS deployment "Anyone" sudah mendukung CORS
  async get(params) {
    const url = new URL(CONFIG.API_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    const res = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);

    // GAS kadang wrap response dalam HTML jika ada error server
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch(e) {
      console.error('Response bukan JSON:', text.substring(0, 200));
      throw new Error('Response tidak valid dari server. Cek deployment GAS Anda.');
    }
  },

  // POST request (add, update, delete)
  // Content-Type: text/plain wajib agar GAS tidak reject karena CORS preflight
  async post(body) {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch(e) {
      console.error('Response bukan JSON:', text.substring(0, 200));
      throw new Error('Response tidak valid dari server. Cek deployment GAS Anda.');
    }
  },

  getAllData:   ()           => API.get({ action: 'getData' }),
  verifyAdmin: (pw)         => API.get({ action: 'verify', pw }),
  addRow:      (data, pw)   => API.post({ action: 'add',    data, pw }),
  updateRow:   (data, pw)   => API.post({ action: 'update', data, pw }),
  deleteRow:   (id,   pw)   => API.post({ action: 'delete', id,   pw }),
};
