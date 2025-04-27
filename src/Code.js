/**
 * Google Apps Script のメインコード
 * スプレッドシートベースの管理UIシステム
 */

// グローバル変数
var ss = SpreadsheetApp.getActiveSpreadsheet();
var SHEET_CONFIG = "初期設定";
var SHEET_RESPONSE_TITLE = "返答タイトル";
var SHEET_RESPONSE_CONDITION = "返答条件";
var SHEET_RESPONSE_CONTENT = "返答内容";
var SHEET_BUTTON_SETTING = "ボタン設定";

/**
 * メニューに管理UIを追加する
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('管理ツール')
    .addItem('データ登録・編集', 'showRegisterDialog')
    .addToUi();
}

/**
 * データ登録・編集用ダイアログを表示
 */
function showRegisterDialog() {
  var html = HtmlService.createHtmlOutputFromFile('register')
    .setWidth(1300)
    .setHeight(900)
    .setTitle('データ登録・編集');
  SpreadsheetApp.getUi().showModalDialog(html, 'データ登録・編集');
}

/**
 * 初期設定シートからデータを取得
 */
function getConfigData() {
  var sheet = ss.getSheetByName(SHEET_CONFIG);
  var data = sheet.getDataRange().getValues();

  var chapters = [];
  var lineAccounts = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    // 章データがある場合
    if (row[2]) {
      chapters.push({
        no: row[1],
        name: row[2],
        isDefault: row[3]
      });
    }

    // LINEアカウントデータがある場合
    if (row[6]) {
      lineAccounts.push({
        no: row[5],
        name: row[6],
        isDefault: row[7]
      });
    }
  }

  return {
    chapters: chapters,
    lineAccounts: lineAccounts
  };
}

/**
 * 返答タイトルシートからデータを取得
 */
function getResponseTitleData() {
  var sheet = ss.getSheetByName(SHEET_RESPONSE_TITLE);
  var data = sheet.getDataRange().getValues();
  var titles = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    titles.push({
      title: row[1],
      lineAccount: row[2],
      nextChapter: row[3] || ""
    });
  }

  return titles;
}

/**
 * 返答条件シートからデータを取得
 */
function getResponseConditionData() {
  var sheet = ss.getSheetByName(SHEET_RESPONSE_CONDITION);
  var data = sheet.getDataRange().getValues();
  var conditions = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    conditions.push({
      code: row[1],
      chapter: row[2],
      priority: row[3],
      registrationStatus: row[4],
      eventType: row[5],
      functionName: row[6],
      argument1: row[7],
      scriptCode: row[8],
      scriptPattern: row[9]
    });
  }

  return conditions;
}

/**
 * 返答内容シートからデータを取得
 */
function getResponseContentData() {
  var sheet = ss.getSheetByName(SHEET_RESPONSE_CONTENT);
  var data = sheet.getDataRange().getValues();
  var contents = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    contents.push({
      code: row[1],
      title: row[2],
      type: row[3],
      senderName: row[4],
      senderIcon: row[5],
      image: row[6],
      main: row[7],
      sub1: row[8],
      sub2: row[9],
      order: row[10],
      lineAccount: row[11]
    });
  }

  return contents;
}

/**
 * ボタン設定シートからデータを取得
 */
function getButtonSettingData() {
  var sheet = ss.getSheetByName(SHEET_BUTTON_SETTING);
  var data = sheet.getDataRange().getValues();
  var buttons = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    buttons.push({
      contentCode: row[1],
      type: row[2],
      image: row[3],
      main1: row[4],
      main2: row[5],
      sub1: row[6],
      sub2: row[7],
      sub3: row[8],
      order: row[9]
    });
  }

  return buttons;
}

/**
 * データをシートに保存する
 */
function saveData(sheetName, data) {
  var sheet = ss.getSheetByName(sheetName);

  switch(sheetName) {
    case SHEET_CONFIG:
      saveConfigData(sheet, data);
      break;
    case SHEET_RESPONSE_TITLE:
      saveResponseTitleData(sheet, data);
      break;
    case SHEET_RESPONSE_CONDITION:
      saveResponseConditionData(sheet, data);
      break;
    case SHEET_RESPONSE_CONTENT:
      saveResponseContentData(sheet, data);
      break;
    case SHEET_BUTTON_SETTING:
      saveButtonSettingData(sheet, data);
      break;
    default:
      throw new Error("不明なシート名です: " + sheetName);
  }

  return { success: true };
}

/**
 * 初期設定データを保存
 */
function saveConfigData(sheet, data) {
  // 実装予定
}

/**
 * 返答タイトルデータを保存
 */
function saveResponseTitleData(sheet, data) {
  // 実装予定
}

/**
 * 返答条件データを保存
 */
function saveResponseConditionData(sheet, data) {
  // 実装予定
}

/**
 * 返答内容データを保存
 */
function saveResponseContentData(sheet, data) {
  // 実装予定
}

/**
 * ボタン設定データを保存
 */
function saveButtonSettingData(sheet, data) {
  // 実装予定
}

/**
 * 次の条件コードを取得（MAX+1）
 */
function getNextConditionCode() {
  var sheet = ss.getSheetByName(SHEET_RESPONSE_CONDITION);
  var data = sheet.getDataRange().getValues();
  var maxCode = 0;

  for (var i = 1; i < data.length; i++) {
    var code = parseInt(data[i][1]);
    if (!isNaN(code) && code > maxCode) {
      maxCode = code;
    }
  }

  return maxCode + 1;
}
