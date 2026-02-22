// ============================================================
//  TRACER STUDY - Google Apps Script Backend
//  JSONP support untuk bypass CORS redirect dari GitHub Pages
// ============================================================

var SHEET_NAME     = 'Sheet1';
var ADMIN_PASSWORD = 'admin123';

function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── doGet: support callback=? untuk JSONP ──
function doGet(e) {
  var params   = (e && e.parameter) ? e.parameter : {};
  var action   = params.action   || '';
  var callback = params.callback || '';   // JSONP callback name
  var output;

  try {
    if (action === 'getData') {
      output = getAllData();
    } else if (action === 'verify') {
      output = { ok: (params.pw || '') === ADMIN_PASSWORD };
    } else {
      output = { status: 'ok', message: 'Tracer Study API aktif' };
    }
  } catch(err) {
    output = { error: err.message };
  }

  var json = JSON.stringify(output);

  // Jika ada callback → JSONP response (bypass CORS sepenuhnya)
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ── doPost ──
function doPost(e) {
  var output;
  try {
    var body   = JSON.parse(e.postData.contents);
    var action = body.action || '';
    var pw     = body.pw     || '';

    if      (action === 'add')    output = addRow(body.data, pw);
    else if (action === 'update') output = updateRow(body.data, pw);
    else if (action === 'delete') output = deleteRow(body.id, pw);
    else                          output = { error: 'Action tidak dikenal: ' + action };
  } catch(err) {
    output = { error: err.message };
  }

  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Read all ──
function getAllData() {
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
}

// ── Add ──
function addRow(d, pw) {
  if (pw !== ADMIN_PASSWORD) return { error: 'Password salah!' };
  if (!d || !String(d.nama || '').trim()) return { error: 'Nama tidak boleh kosong!' };
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { error: 'Sheet tidak ditemukan' };
  sheet.appendRow([d.nama,d.nisn,d.tahunLulus,d.jurusan,d.ttl,d.hp,d.alamat,d.rutinitas,d.melanjutkanStudi,d.studioMana,d.wirausaha,d.fotoUsaha]);
  return { success: true };
}

// ── Update ──
function updateRow(d, pw) {
  if (pw !== ADMIN_PASSWORD) return { error: 'Password salah!' };
  if (!d || !d.id) return { error: 'ID tidak valid!' };
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { error: 'Sheet tidak ditemukan' };
  sheet.getRange(parseInt(d.id), 1, 1, 12).setValues([[d.nama,d.nisn,d.tahunLulus,d.jurusan,d.ttl,d.hp,d.alamat,d.rutinitas,d.melanjutkanStudi,d.studioMana,d.wirausaha,d.fotoUsaha]]);
  return { success: true };
}

// ── Delete ──
function deleteRow(id, pw) {
  if (pw !== ADMIN_PASSWORD) return { error: 'Password salah!' };
  if (!id) return { error: 'ID tidak valid!' };
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return { error: 'Sheet tidak ditemukan' };
  sheet.deleteRow(parseInt(id));
  return { success: true };
}
