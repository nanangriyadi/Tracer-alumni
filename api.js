// ============================================================
//  API CLIENT - Komunikasi ke Google Apps Script backend
//  Menggunakan fetch() karena berjalan di GitHub Pages
// ============================================================

const API = {

  // GET request (getData, verify)
  async get(params) {
    const url = new URL(CONFIG.API_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    const res = await fetch(url.toString(), { redirect: 'follow' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  },

  // POST request (add, update, delete)
  async post(body) {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' }, // GAS butuh text/plain untuk doPost
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  },

  getAllData:    ()           => API.get({ action: 'getData' }),
  verifyAdmin:  (pw)         => API.get({ action: 'verify', pw }),
  addRow:       (data, pw)   => API.post({ action: 'add',    data, pw }),
  updateRow:    (data, pw)   => API.post({ action: 'update', data, pw }),
  deleteRow:    (id,   pw)   => API.post({ action: 'delete', id,   pw }),
};
