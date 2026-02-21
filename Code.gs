// ============================================================
//  TRACER STUDY - Google Apps Script Backend
//  Mendukung akses dari GitHub Pages via fetch (CORS)
//
//  Spreadsheet columns (1-based):
//  1  Nama               2  NISN
//  3  TAHUN LULUS        4  JURUSAN KETUNAAN
//  5  Tempat, Tgl Lahir  6  Nomr HP/Wa
//  7  Alamat Domisili    8  Rutinitas keseharian
//  9  Melanjutkan Studi  10 Jika melanjutkan studi dimana?
//  11 Jika Berwirausaha tuliskan
//  12 Foto Tempat Usaha
// ============================================================

var SHEET_NAME     = 'Sheet1';   // ← sesuaikan nama sheet
var ADMIN_PASSWORD = 'admin123'; // ← ganti password Anda

// ── doGet: handle semua request dari luar (GitHub Pages) ──
function doGet(e) {
  var action = e && e.parameter && e.parameter.action ? e.parameter.action : '';
  var output;

  try {
    if (action === 'getData') {
      output = ContentService.createTextOutput(JSON.stringify(getAllData()));
    } else if (action === 'verify') {
      var pw = e.parameter.pw || '';
      output = ContentService.createTextOutput(JSON.stringify({ ok: pw === ADMIN_PASSWORD }));
    } else {
      // Default: kembalikan info API
      output = ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Tracer Study API aktif' }));
    }
  } catch(err) {
    output = ContentService.createTextOutput(JSON.stringify({ error: err.message }));
  }

  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ── doPost: untuk aksi write (add, update, delete) ──
function doPost(e) {
  var output;
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || '';
    var pw     = body.pw     || '';

    if (action === 'add') {
      output = addRow(body.data, pw);
    } else if (action === 'update') {
      output = updateRow(body.data, pw);
    } else if (action === 'delete') {
      output = deleteRow(body.id, pw);
    } else {
      output = { error: 'Action tidak dikenal: ' + action };
    }
  } catch(err) {
    output = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Read all data ──
function getAllData() {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) return { error: 'Sheet tidak ditemukan: ' + SHEET_NAME };

    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return { data: [] };

    var values = sheet.getRange(2, 1, lastRow - 1, 12).getValues();
    var data = [];
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      if (String(row[0]).trim() === '') continue;
      data.push({
        id:               i + 2,
        nama:             String(row[0]  || ''),
        nisn:             String(row[1]  || ''),
        tahunLulus:       String(row[2]  || ''),
        jurusan:          String(row[3]  || ''),
        ttl:              String(row[4]  || ''),
        hp:               String(row[5]  || ''),
        alamat:           String(row[6]  || ''),
        rutinitas:        String(row[7]  || ''),
        melanjutkanStudi: String(row[8]  || ''),
        studioMana:       String(row[9]  || ''),
        wirausaha:        String(row[10] || ''),
        fotoUsaha:        String(row[11] || '')
      });
    }
    return { data: data };
  } catch(err) {
    return { error: err.message };
  }
}

// ── Add row ──
function addRow(d, pw) {
  if (pw !== ADMIN_PASSWORD) return { error: 'Password salah!' };
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return { error: 'Sheet tidak ditemukan' };
    sheet.appendRow([d.nama,d.nisn,d.tahunLulus,d.jurusan,d.ttl,d.hp,d.alamat,d.rutinitas,d.melanjutkanStudi,d.studioMana,d.wirausaha,d.fotoUsaha]);
    return { success: true };
  } catch(err) { return { error: err.message }; }
}

// ── Update row ──
function updateRow(d, pw) {
  if (pw !== ADMIN_PASSWORD) return { error: 'Password salah!' };
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return { error: 'Sheet tidak ditemukan' };
    sheet.getRange(parseInt(d.id), 1, 1, 12).setValues([[d.nama,d.nisn,d.tahunLulus,d.jurusan,d.ttl,d.hp,d.alamat,d.rutinitas,d.melanjutkanStudi,d.studioMana,d.wirausaha,d.fotoUsaha]]);
    return { success: true };
  } catch(err) { return { error: err.message }; }
}

// ── Delete row ──
function deleteRow(id, pw) {
  if (pw !== ADMIN_PASSWORD) return { error: 'Password salah!' };
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return { error: 'Sheet tidak ditemukan' };
    sheet.deleteRow(parseInt(id));
    return { success: true };
  } catch(err) { return { error: err.message }; }
}
