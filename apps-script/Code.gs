const SHEET_NAME = "Hoja 1";

/*
 * Columnas (fila 1 del Sheet):
 *  A Fecha | B Nombre | C Asiste | D Mayores | E Menores | F Total a Pagar |
 *  G Sin restricciones | H Menú Celíaco | I Menú Vegetariano | J Menú Vegano |
 *  K Aclaraciones | L Pagado (checkbox)
 */
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    // --- FORMATO DE FECHA (ej: 22/08/2026, 20:30) ---
    const opcionesFecha = {
      timeZone: "America/Argentina/Buenos_Aires",
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const fecha = new Date().toLocaleString("es-AR", opcionesFecha);
    // ------------------------------------------------

    const rowData = [
      fecha,
      data.nombre || "-",
      data.asiste || "-",
      data.mayores || 0,
      data.menores || 0,
      data.total || 0,
      data.sinRestricciones || 0,
      data.celiaco || 0,
      data.vegetariano || 0,
      data.vegano || 0,
      data.aclaraciones || "-"
    ];

    // Inserta los datos en la nueva fila
    sheet.appendRow(rowData);

    // --- CASILLA DE PAGADO (columna L = 12) ---
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 12).insertCheckboxes();
    // ------------------------------------------

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
