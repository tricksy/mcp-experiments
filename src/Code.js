/**
 * Google Apps Script でスプレッドシートを管理 UI とする登録・編集ツール
 * 
 * @author Your Name
 * @version 1.0.0
 * @license MIT
 */

// グローバル変数の定義
const SHEETS = {
  INITIAL_SETTINGS: '初期設定',
  RESPONSE_TITLES: '返答タイトル',
  RESPONSE_CONDITIONS: '返答条件',
  RESPONSE_CONTENTS: '返答内容',
  BUTTON_SETTINGS: 'ボタン設定',
  FLAG_CONDITIONS: 'フラグ条件',
  FLAG_CHANGES: 'フラグ変更',
  IMAGE_GENERATION: '画像生成',
  SCRIPTS: 'スクリプト',
  VARIABLES: '変数',
  TROPHY_CONDITIONS: 'トロフィ条件'
};

// グローバル変数
var ss = SpreadsheetApp.getActiveSpreadsheet();
var SHEET_CONFIG = SHEETS.INITIAL_SETTINGS;
var SHEET_RESPONSE_TITLE = SHEETS.RESPONSE_TITLES;
var SHEET_RESPONSE_CONDITION = SHEETS.RESPONSE_CONDITIONS;
var SHEET_RESPONSE_CONTENT = SHEETS.RESPONSE_CONTENTS;
var SHEET_BUTTON_SETTING = SHEETS.BUTTON_SETTINGS;
var SHEET_FLAG_CONDITION = SHEETS.FLAG_CONDITIONS;
var SHEET_FLAG_CHANGE = SHEETS.FLAG_CHANGES;
var SHEET_IMAGE_GEN = SHEETS.IMAGE_GENERATION;
var SHEET_SCRIPT = SHEETS.SCRIPTS;
var SHEET_VARIABLE = SHEETS.VARIABLES;
var SHEET_TROPHY_CONDITION = SHEETS.TROPHY_CONDITIONS;
var SHEET_TROPHY = "トロフィ";

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
 * フラグ条件シートからデータを取得
 */
function getFlagConditionData() {
  var sheet = ss.getSheetByName(SHEET_FLAG_CONDITION);
  if (!sheet) {
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  var flagConditions = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1]) {
      flagConditions.push({
        code: row[1],
        flagCondition: row[2],
        responseTitle: row[3]
      });
    }
  }

  return flagConditions;
}

/**
 * フラグ変更シートからデータを取得
 */
function getFlagChangeData() {
  var sheet = ss.getSheetByName(SHEET_FLAG_CHANGE);
  if (!sheet) {
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  var flagChanges = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1]) {
      flagChanges.push({
        code: row[1],
        contentCode: row[2],
        flagName: row[3],
        operation: row[4],
        value: row[5]
      });
    }
  }

  return flagChanges;
}

/**
 * 画像生成シートからデータを取得
 */
function getImageGenData() {
  var sheet = ss.getSheetByName(SHEET_IMAGE_GEN);
  if (!sheet) {
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  var imageGens = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1]) {
      imageGens.push({
        code: row[1],
        baseImage: row[2],
        description: row[3]
      });
    }
  }

  return imageGens;
}

/**
 * スクリプトシートからデータを取得
 */
function getScriptData() {
  var sheet = ss.getSheetByName(SHEET_SCRIPT);
  if (!sheet) {
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  var scripts = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1]) {
      scripts.push({
        name: row[1],
        content: row[2]
      });
    }
  }

  return scripts;
}

/**
 * 変数シートからデータを取得
 */
function getVariableData() {
  var sheet = ss.getSheetByName(SHEET_VARIABLE);
  if (!sheet) {
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  var variables = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1]) {
      variables.push({
        name: row[1],
        initialValue: row[2],
        description: row[3]
      });
    }
  }

  return variables;
}

/**
 * トロフィ条件シートからデータを取得
 */
function getTrophyConditionData() {
  var sheet = ss.getSheetByName(SHEET_TROPHY_CONDITION);
  if (!sheet) {
    return [];
  }
  
  var data = sheet.getDataRange().getValues();
  var trophyConditions = [];

  // ヘッダー行をスキップして2行目から処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[1]) {
      trophyConditions.push({
        id: row[1],
        name: row[2],
        condition: row[3],
        imageUrl: row[4]
      });
    }
  }

  return trophyConditions;
}

/**
 * データをシートに保存する
 */
function saveData(sheetName, data) {
  // データの検証を実行
  var validationResult = validateData(sheetName, data);
  if (!validationResult.isValid) {
    return {
      success: false,
      errors: validationResult.errors
    };
  }
  
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    // シートが存在しない場合は作成
    sheet = ss.insertSheet(sheetName);
    setupSheetHeaders(sheet, sheetName);
  }

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
    case SHEET_FLAG_CONDITION:
      saveFlagConditionData(sheet, data);
      break;
    case SHEET_FLAG_CHANGE:
      saveFlagChangeData(sheet, data);
      break;
    case SHEET_IMAGE_GEN:
      saveImageGenData(sheet, data);
      break;
    case SHEET_SCRIPT:
      saveScriptData(sheet, data);
      break;
    case SHEET_VARIABLE:
      saveVariableData(sheet, data);
      break;
    case SHEET_TROPHY_CONDITION:
      saveTrophyConditionData(sheet, data);
      break;
    default:
      throw new Error("不明なシート名です: " + sheetName);
  }

  return { success: true };
}

/**
 * シートのヘッダー行を設定
 */
function setupSheetHeaders(sheet, sheetName) {
  switch(sheetName) {
    case SHEET_CONFIG:
      sheet.getRange(1, 2, 1, 7).setValues([["No (章)", "章", "デフォルト章", "", "No (LINE)", "LINEアカウント", "デフォルトLINE"]]);
      break;
    case SHEET_RESPONSE_TITLE:
      sheet.getRange(1, 2, 1, 3).setValues([["返答タイトル", "LINEアカウント", "次章"]]);
      break;
    case SHEET_RESPONSE_CONDITION:
      sheet.getRange(1, 2, 1, 9).setValues([["返答条件コード", "章", "優先度", "登録状況", "イベントタイプ", "関数名", "引数(1)", "スクリプトコード", "Scriptパターン"]]);
      break;
    case SHEET_RESPONSE_CONTENT:
      sheet.getRange(1, 2, 1, 11).setValues([["返答内容コード", "返答タイトル", "種別", "送信者名", "送信者アイコン", "画像", "メイン", "サブ1", "サブ2", "順番", "LINEアカウント"]]);
      break;
    case SHEET_BUTTON_SETTING:
      sheet.getRange(1, 2, 1, 9).setValues([["返答内容コード", "種別", "画像", "メイン1", "メイン2", "サブ1", "サブ2", "サブ3", "順番"]]);
      break;
    case SHEET_FLAG_CONDITION:
      sheet.getRange(1, 2, 1, 3).setValues([["コード", "フラグ条件", "返答タイトル"]]);
      break;
    case SHEET_FLAG_CHANGE:
      sheet.getRange(1, 2, 1, 5).setValues([["コード", "返答内容コード", "フラグ名", "操作", "値"]]);
      break;
    case SHEET_IMAGE_GEN:
      sheet.getRange(1, 2, 1, 3).setValues([["画像コード", "ベース画像", "説明"]]);
      break;
    case SHEET_SCRIPT:
      sheet.getRange(1, 2, 1, 2).setValues([["スクリプト名", "内容"]]);
      break;
    case SHEET_VARIABLE:
      sheet.getRange(1, 2, 1, 3).setValues([["変数名", "初期値", "説明"]]);
      break;
    case SHEET_TROPHY_CONDITION:
      sheet.getRange(1, 2, 1, 4).setValues([["トロフィID", "名前", "条件", "画像URL"]]);
      break;
  }
}

/**
 * 初期設定データを保存
 */
function saveConfigData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // 章データの保存
  var row = 2;
  for (var i = 0; i < data.chapters.length; i++) {
    var chapter = data.chapters[i];
    sheet.getRange(row, 2).setValue(chapter.no);  // B列
    sheet.getRange(row, 3).setValue(chapter.name); // C列
    sheet.getRange(row, 4).setValue(chapter.isDefault); // D列
    row++;
  }

  // LINEアカウントデータの保存
  row = 2;
  for (var j = 0; j < data.lineAccounts.length; j++) {
    var account = data.lineAccounts[j];
    sheet.getRange(row, 6).setValue(account.no);  // F列
    sheet.getRange(row, 7).setValue(account.name); // G列
    sheet.getRange(row, 8).setValue(account.isDefault); // H列
    row++;
  }
}

/**
 * 返答タイトルデータを保存
 */
function saveResponseTitleData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var title = data[i];
      values.push([
        "", // A列は空
        title.title, // B列
        title.lineAccount, // C列
        title.nextChapter // D列
      ]);
    }
    sheet.getRange(2, 1, values.length, 4).setValues(values);
  }
}

/**
 * 返答条件データを保存
 */
function saveResponseConditionData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var condition = data[i];
      values.push([
        "", // A列は空
        condition.code, // B列
        condition.chapter, // C列
        condition.priority, // D列
        condition.registrationStatus, // E列
        condition.eventType, // F列
        condition.functionName, // G列
        condition.argument1, // H列
        condition.scriptCode, // I列
        condition.scriptPattern // J列
      ]);
    }
    sheet.getRange(2, 1, values.length, 10).setValues(values);
  }
}

/**
 * 返答内容データを保存
 */
function saveResponseContentData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var content = data[i];
      values.push([
        "", // A列は空
        content.code, // B列
        content.title, // C列
        content.type, // D列
        content.senderName, // E列
        content.senderIcon, // F列
        content.image, // G列
        content.main, // H列
        content.sub1, // I列
        content.sub2, // J列
        content.order || 1, // K列、デフォルトは1
        content.lineAccount // L列
      ]);
    }
    sheet.getRange(2, 1, values.length, 12).setValues(values);
  }
}

/**
 * ボタン設定データを保存
 */
function saveButtonSettingData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var button = data[i];
      values.push([
        "", // A列は空
        button.contentCode, // B列
        button.type, // C列
        button.image, // D列
        button.main1, // E列
        button.main2, // F列
        button.sub1, // G列
        button.sub2, // H列
        button.sub3, // I列
        button.order || 1 // J列、デフォルトは1
      ]);
    }
    sheet.getRange(2, 1, values.length, 10).setValues(values);
  }
}

/**
 * フラグ条件データを保存
 */
function saveFlagConditionData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var condition = data[i];
      values.push([
        "", // A列は空
        condition.code, // B列
        condition.flagCondition, // C列
        condition.responseTitle, // D列
      ]);
    }
    sheet.getRange(2, 1, values.length, 4).setValues(values);
  }
}

/**
 * フラグ変更データを保存
 */
function saveFlagChangeData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var change = data[i];
      values.push([
        "", // A列は空
        change.code, // B列
        change.contentCode, // C列
        change.flagName, // D列
        change.operation, // E列
        change.value // F列
      ]);
    }
    sheet.getRange(2, 1, values.length, 6).setValues(values);
  }
}

/**
 * 画像生成データを保存
 */
function saveImageGenData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var image = data[i];
      values.push([
        "", // A列は空
        image.code, // B列
        image.baseImage, // C列
        image.description // D列
      ]);
    }
    sheet.getRange(2, 1, values.length, 4).setValues(values);
  }
}

/**
 * スクリプトデータを保存
 */
function saveScriptData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var script = data[i];
      values.push([
        "", // A列は空
        script.name, // B列
        script.content // C列
      ]);
    }
    sheet.getRange(2, 1, values.length, 3).setValues(values);
  }
}

/**
 * 変数データを保存
 */
function saveVariableData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var variable = data[i];
      values.push([
        "", // A列は空
        variable.name, // B列
        variable.initialValue, // C列
        variable.description // D列
      ]);
    }
    sheet.getRange(2, 1, values.length, 4).setValues(values);
  }
}

/**
 * トロフィ条件データを保存
 */
function saveTrophyConditionData(sheet, data) {
  // 現在のデータをクリア（ヘッダー行は保持）
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }

  // データの保存
  if (data.length > 0) {
    var values = [];
    for (var i = 0; i < data.length; i++) {
      var trophy = data[i];
      values.push([
        "", // A列は空
        trophy.id, // B列
        trophy.name, // C列
        trophy.condition, // D列
        trophy.imageUrl // E列
      ]);
    }
    sheet.getRange(2, 1, values.length, 5).setValues(values);
  }
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

/**
 * データを保存する前に検証を実行する
 * @param {string} sheetName シート名
 * @param {object} data 保存するデータ
 * @return {object} 検証結果 { isValid: boolean, errors: string[] }
 */
function validateData(sheetName, data) {
  var errors = [];
  
  switch(sheetName) {
    case SHEET_CONFIG:
      errors = validateConfigData(data);
      break;
    case SHEET_RESPONSE_TITLE:
      errors = validateResponseTitleData(data);
      break;
    case SHEET_RESPONSE_CONDITION:
      errors = validateResponseConditionData(data);
      break;
    case SHEET_RESPONSE_CONTENT:
      errors = validateResponseContentData(data);
      break;
    case SHEET_BUTTON_SETTING:
      errors = validateButtonSettingData(data);
      break;
    case SHEET_FLAG_CONDITION:
      errors = validateFlagConditionData(data);
      break;
    case SHEET_FLAG_CHANGE:
      errors = validateFlagChangeData(data);
      break;
    case SHEET_IMAGE_GEN:
      errors = validateImageGenData(data);
      break;
    case SHEET_SCRIPT:
      errors = validateScriptData(data);
      break;
    case SHEET_VARIABLE:
      errors = validateVariableData(data);
      break;
    case SHEET_TROPHY_CONDITION:
      errors = validateTrophyConditionData(data);
      break;
    default:
      errors.push("不明なシート名です: " + sheetName);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * 初期設定データを検証
 */
function validateConfigData(data) {
  var errors = [];
  
  // 章のバリデーション
  if (!data.chapters || data.chapters.length === 0) {
    errors.push("少なくとも1つの章が必要です");
  } else {
    // デフォルト章のチェック
    var defaultChapterCount = data.chapters.filter(function(chapter) {
      return chapter.isDefault === true;
    }).length;
    
    if (defaultChapterCount === 0) {
      errors.push("デフォルト章が設定されていません");
    } else if (defaultChapterCount > 1) {
      errors.push("デフォルト章は1つだけ設定してください");
    }
    
    // 章名の重複チェック
    var chapterNames = {};
    data.chapters.forEach(function(chapter, index) {
      if (!chapter.name || chapter.name.trim() === "") {
        errors.push("章名 #" + (index+1) + " が空です");
      } else if (chapterNames[chapter.name]) {
        errors.push("章名 '" + chapter.name + "' が重複しています");
      } else {
        chapterNames[chapter.name] = true;
      }
    });
  }
  
  // LINEアカウントのバリデーション
  if (!data.lineAccounts || data.lineAccounts.length === 0) {
    errors.push("少なくとも1つのLINEアカウントが必要です");
  } else {
    // デフォルトアカウントのチェック
    var defaultAccountCount = data.lineAccounts.filter(function(account) {
      return account.isDefault === true;
    }).length;
    
    if (defaultAccountCount === 0) {
      errors.push("デフォルトLINEアカウントが設定されていません");
    } else if (defaultAccountCount > 1) {
      errors.push("デフォルトLINEアカウントは1つだけ設定してください");
    }
    
    // アカウント名の重複チェック
    var accountNames = {};
    data.lineAccounts.forEach(function(account, index) {
      if (!account.name || account.name.trim() === "") {
        errors.push("LINEアカウント名 #" + (index+1) + " が空です");
      } else if (accountNames[account.name]) {
        errors.push("LINEアカウント名 '" + account.name + "' が重複しています");
      } else {
        accountNames[account.name] = true;
      }
    });
  }
  
  return errors;
}

/**
 * 返答タイトルデータを検証
 */
function validateResponseTitleData(data) {
  var errors = [];
  
  // タイトルが空でないか、重複していないかチェック
  var titleNames = {};
  data.forEach(function(title, index) {
    if (!title.title || title.title.trim() === "") {
      errors.push("返答タイトル #" + (index+1) + " が空です");
    } else if (titleNames[title.title]) {
      errors.push("返答タイトル '" + title.title + "' が重複しています");
    } else {
      titleNames[title.title] = true;
    }
    
    // LINEアカウントのチェック
    if (!title.lineAccount || title.lineAccount.trim() === "") {
      errors.push("返答タイトル '" + title.title + "' のLINEアカウントが設定されていません");
    }
  });
  
  return errors;
}

/**
 * 返答条件データを検証
 */
function validateResponseConditionData(data) {
  var errors = [];
  
  data.forEach(function(condition, index) {
    // コードのチェック
    if (!condition.code) {
      errors.push("返答条件 #" + (index+1) + " のコードが設定されていません");
    }
    
    // 章のチェック
    if (!condition.chapter || condition.chapter.trim() === "") {
      errors.push("返答条件 #" + (index+1) + " の章が設定されていません");
    }
    
    // 優先度が数値かチェック
    if (isNaN(condition.priority)) {
      errors.push("返答条件 #" + (index+1) + " の優先度が数値ではありません");
    }
    
    // 登録状況のチェック
    if (!condition.registrationStatus || !["未登録", "有料登録", "無料登録"].includes(condition.registrationStatus)) {
      errors.push("返答条件 #" + (index+1) + " の登録状況が正しくありません");
    }
    
    // イベントタイプのチェック
    if (!condition.eventType || !["message", "postback"].includes(condition.eventType)) {
      errors.push("返答条件 #" + (index+1) + " のイベントタイプが正しくありません");
    }
  });
  
  return errors;
}

/**
 * 返答内容データを検証
 */
function validateResponseContentData(data) {
  var errors = [];
  
  // コードが空でないか、重複していないかチェック
  var contentCodes = {};
  data.forEach(function(content, index) {
    if (!content.code || content.code.trim() === "") {
      errors.push("返答内容 #" + (index+1) + " のコードが空です");
    } else if (contentCodes[content.code]) {
      errors.push("返答内容コード '" + content.code + "' が重複しています");
    } else {
      contentCodes[content.code] = true;
    }
    
    // タイトルのチェック
    if (!content.title || content.title.trim() === "") {
      errors.push("返答内容 #" + (index+1) + " のタイトルが設定されていません");
    }
    
    // 種別のチェック
    var validTypes = ["text", "buttons", "image", "sticker", "location", "imagemap", "confirm", "image-carousel", "richmenu", "flex", "escape:pay"];
    if (!content.type || !validTypes.includes(content.type)) {
      errors.push("返答内容 #" + (index+1) + " の種別が正しくありません");
    }
    
    // 画像URLのチェック（画像の場合）
    if (content.type === "image" && (!content.image || content.image.trim() === "")) {
      errors.push("返答内容 #" + (index+1) + " の画像URLが設定されていません");
    }
    
    // メインテキストのチェック（textの場合）
    if (content.type === "text" && (!content.main || content.main.trim() === "")) {
      errors.push("返答内容 #" + (index+1) + " のメインテキストが設定されていません");
    }
    
    // 順番が数値かチェック
    if (isNaN(content.order)) {
      errors.push("返答内容 #" + (index+1) + " の順番が数値ではありません");
    }
  });
  
  return errors;
}

/**
 * ボタン設定データを検証
 */
function validateButtonSettingData(data) {
  var errors = [];
  
  data.forEach(function(button, index) {
    // 返答内容コードのチェック
    if (!button.contentCode || button.contentCode.trim() === "") {
      errors.push("ボタン設定 #" + (index+1) + " の返答内容コードが設定されていません");
    }
    
    // 種別のチェック
    var validTypes = ["postback", "message", "image-carousel-message", "quickreply-message", "uri", "area-message"];
    if (!button.type || !validTypes.includes(button.type)) {
      errors.push("ボタン設定 #" + (index+1) + " の種別が正しくありません");
    }
    
    // メイン1のチェック
    if (!button.main1 || button.main1.trim() === "") {
      errors.push("ボタン設定 #" + (index+1) + " のメイン1が設定されていません");
    }
    
    // URIタイプの場合、メイン2が必須（URL）
    if (button.type === "uri" && (!button.main2 || button.main2.trim() === "")) {
      errors.push("ボタン設定 #" + (index+1) + " のURLが設定されていません");
    }
    
    // 順番が数値かチェック
    if (isNaN(button.order)) {
      errors.push("ボタン設定 #" + (index+1) + " の順番が数値ではありません");
    }
  });
  
  return errors;
}

/**
 * フラグ条件データを検証
 */
function validateFlagConditionData(data) {
  var errors = [];
  
  // コードのチェック
  var codes = {};
  data.forEach(function(condition, index) {
    if (!condition.code) {
      errors.push("フラグ条件 #" + (index+1) + " のコードが設定されていません");
    } else if (codes[condition.code]) {
      errors.push("フラグ条件コード '" + condition.code + "' が重複しています");
    } else {
      codes[condition.code] = true;
    }
    
    // フラグ条件のチェック
    if (!condition.flagCondition || condition.flagCondition.trim() === "") {
      errors.push("フラグ条件 #" + (index+1) + " のフラグ条件が設定されていません");
    }
    
    // 返答タイトルのチェック
    if (!condition.responseTitle || condition.responseTitle.trim() === "") {
      errors.push("フラグ条件 #" + (index+1) + " の返答タイトルが設定されていません");
    }
  });
  
  return errors;
}

/**
 * フラグ変更データを検証
 */
function validateFlagChangeData(data) {
  var errors = [];
  
  // コードのチェック
  var codes = {};
  data.forEach(function(change, index) {
    if (!change.code) {
      errors.push("フラグ変更 #" + (index+1) + " のコードが設定されていません");
    } else if (codes[change.code]) {
      errors.push("フラグ変更コード '" + change.code + "' が重複しています");
    } else {
      codes[change.code] = true;
    }
    
    // 返答内容コードのチェック
    if (!change.contentCode || change.contentCode.trim() === "") {
      errors.push("フラグ変更 #" + (index+1) + " の返答内容コードが設定されていません");
    }
    
    // フラグ名のチェック
    if (!change.flagName || change.flagName.trim() === "") {
      errors.push("フラグ変更 #" + (index+1) + " のフラグ名が設定されていません");
    }
    
    // 操作のチェック
    if (!change.operation || change.operation.trim() === "") {
      errors.push("フラグ変更 #" + (index+1) + " の操作が設定されていません");
    } else if (!["set", "add", "subtract", "multiply", "divide"].includes(change.operation)) {
      errors.push("フラグ変更 #" + (index+1) + " の操作 '" + change.operation + "' が無効です");
    }
    
    // 値のチェック
    if (change.value === undefined || change.value === null || change.value.toString().trim() === "") {
      errors.push("フラグ変更 #" + (index+1) + " の値が設定されていません");
    }
  });
  
  return errors;
}

/**
 * 画像生成データを検証
 */
function validateImageGenData(data) {
  var errors = [];
  
  // コードのチェック
  var codes = {};
  data.forEach(function(image, index) {
    if (!image.code) {
      errors.push("画像生成 #" + (index+1) + " のコードが設定されていません");
    } else if (codes[image.code]) {
      errors.push("画像生成コード '" + image.code + "' が重複しています");
    } else {
      codes[image.code] = true;
    }
  });
  
  return errors;
}

/**
 * スクリプトデータを検証
 */
function validateScriptData(data) {
  var errors = [];
  
  // スクリプト名のチェック
  var names = {};
  data.forEach(function(script, index) {
    if (!script.name) {
      errors.push("スクリプト #" + (index+1) + " の名前が設定されていません");
    } else if (names[script.name]) {
      errors.push("スクリプト名 '" + script.name + "' が重複しています");
    } else {
      names[script.name] = true;
    }
  });
  
  return errors;
}

/**
 * 変数データを検証
 */
function validateVariableData(data) {
  var errors = [];
  
  // 変数名のチェック
  var names = {};
  data.forEach(function(variable, index) {
    if (!variable.name) {
      errors.push("変数 #" + (index+1) + " の名前が設定されていません");
    } else if (names[variable.name]) {
      errors.push("変数名 '" + variable.name + "' が重複しています");
    } else {
      names[variable.name] = true;
    }
  });
  
  return errors;
}

/**
 * トロフィ条件データを検証
 */
function validateTrophyConditionData(data) {
  var errors = [];
  
  // IDのチェック
  var ids = {};
  data.forEach(function(trophy, index) {
    if (!trophy.id) {
      errors.push("トロフィ #" + (index+1) + " のIDが設定されていません");
    } else if (ids[trophy.id]) {
      errors.push("トロフィID '" + trophy.id + "' が重複しています");
    } else {
      ids[trophy.id] = true;
    }
    
    // 名前のチェック
    if (!trophy.name || trophy.name.trim() === "") {
      errors.push("トロフィ #" + (index+1) + " の名前が設定されていません");
    }
    
    // 条件のチェック
    if (!trophy.condition || trophy.condition.trim() === "") {
      errors.push("トロフィ #" + (index+1) + " の条件が設定されていません");
    }
  });
  
  return errors;
}

/**
 * データをJSON形式でエクスポート
 * @return {Object} エクスポートしたデータ
 */
function exportData() {
  var exportData = {
    config: getConfigData(),
    responseTitles: getResponseTitleData(),
    responseConditions: getResponseConditionData(),
    responseContents: getResponseContentData(),
    buttonSettings: getButtonSettingData(),
    flagConditions: getFlagConditionData(),
    flagChanges: getFlagChangeData(),
    imageGens: getImageGenData(),
    scripts: getScriptData(),
    variables: getVariableData(),
    trophies: getTrophyConditionData(),
    exportDate: new Date().toString()
  };
  
  // SpreadsheetAppのプロパティに保存（一時的なストレージとして利用）
  var props = PropertiesService.getDocumentProperties();
  props.setProperty('EXPORTED_DATA', JSON.stringify(exportData));
  
  // リンクを生成してユーザーに表示
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var url = ss.getUrl() + '?exportData=true';
  
  return {
    success: true,
    url: url,
    message: "データをエクスポートしました。データは一時的に保存されています。",
    data: exportData
  };
}

/**
 * JSONデータをインポート
 * @param {Object} importData インポートするデータ
 * @return {Object} インポート結果
 */
function importData(importData) {
  // インポートデータのバリデーション
  if (!importData || typeof importData !== 'object') {
    return { 
      success: false, 
      error: "インポートデータの形式が正しくありません" 
    };
  }
  
  var results = [];
  var success = true;
  
  // 各データ種別ごとにインポート処理
  try {
    if (importData.config) {
      var configResult = saveData(SHEET_CONFIG, importData.config);
      results.push({ type: "初期設定", success: configResult.success });
      success = success && configResult.success;
    }
    
    if (importData.responseTitles) {
      var titleResult = saveData(SHEET_RESPONSE_TITLE, importData.responseTitles);
      results.push({ type: "返答タイトル", success: titleResult.success });
      success = success && titleResult.success;
    }
    
    if (importData.responseConditions) {
      var conditionResult = saveData(SHEET_RESPONSE_CONDITION, importData.responseConditions);
      results.push({ type: "返答条件", success: conditionResult.success });
      success = success && conditionResult.success;
    }
    
    if (importData.responseContents) {
      var contentResult = saveData(SHEET_RESPONSE_CONTENT, importData.responseContents);
      results.push({ type: "返答内容", success: contentResult.success });
      success = success && contentResult.success;
    }
    
    if (importData.buttonSettings) {
      var buttonResult = saveData(SHEET_BUTTON_SETTING, importData.buttonSettings);
      results.push({ type: "ボタン設定", success: buttonResult.success });
      success = success && buttonResult.success;
    }
    
    if (importData.flagConditions) {
      var flagConditionResult = saveData(SHEET_FLAG_CONDITION, importData.flagConditions);
      results.push({ type: "フラグ条件", success: flagConditionResult.success });
      success = success && flagConditionResult.success;
    }
    
    if (importData.flagChanges) {
      var flagChangeResult = saveData(SHEET_FLAG_CHANGE, importData.flagChanges);
      results.push({ type: "フラグ変更", success: flagChangeResult.success });
      success = success && flagChangeResult.success;
    }
    
    if (importData.imageGens) {
      var imageGenResult = saveData(SHEET_IMAGE_GEN, importData.imageGens);
      results.push({ type: "画像生成", success: imageGenResult.success });
      success = success && imageGenResult.success;
    }
    
    if (importData.scripts) {
      var scriptResult = saveData(SHEET_SCRIPT, importData.scripts);
      results.push({ type: "スクリプト", success: scriptResult.success });
      success = success && scriptResult.success;
    }
    
    if (importData.variables) {
      var variableResult = saveData(SHEET_VARIABLE, importData.variables);
      results.push({ type: "変数", success: variableResult.success });
      success = success && variableResult.success;
    }
    
    if (importData.trophies) {
      var trophyResult = saveData(SHEET_TROPHY_CONDITION, importData.trophies);
      results.push({ type: "トロフィ", success: trophyResult.success });
      success = success && trophyResult.success;
    }
    
    return {
      success: success,
      results: results,
      message: success ? "データのインポートが完了しました" : "一部のデータのインポートに失敗しました"
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.toString(),
      message: "データのインポート中にエラーが発生しました"
    };
  }
}
