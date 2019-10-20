// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = "ASx/MX1L3W1vTLRq1QdpUuS6qm+v1+raSNllqctTEDKswsGLzINXLEjm9SF+Hpk86V6lNZyrg0B48joGbont9pw614vYuBMnysAvxtmNhwitHtMnJXwMzr7yORr3/39+8QTTLYL9qR0o/YyYYrWPFgdB04t89/1O/w1cDnyilFU=";

/**
* LINEから送信された時に対応するメソッド
* @param {object} e イベントオブジェクト
*/
function doPost(e) {
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // ユーザのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  // 応答メッセージ用のAPI URL
  var url = 'https://api.line.me/v2/bot/message/reply';
  // 応答メッセージ
  var responseMessage = "";
  
  // ユーザのメッセージによって応答するメッセージを変更する
  if (userMessage === "登録") {
    responseMessage = "https://forms.gle/yYF2b19moUGpn862A\n登録フォームから登録してみてね！";
  } else if (userMessage === "表示") {
    responseMessage = getMaxim();
  } else {
    responseMessage = "「登録」：登録フォームを表示！\n「表示」：名言をランダムで表示するよ！";
  }

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': responseMessage,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
/**
* スプレッドシートからランダムで名言をゲットするメソッド
* @return {string} 名言
*/
function getMaxim() {
  // フォームの回答シートを取得
  var sheet = SpreadsheetApp.openById("1n06ClBtUGVBI6cB9_fmGj8hRICgdJ36S1FdoehTIhHQ").getSheetByName("フォームの回答 1");
  var dataLength = sheet.getRange('B:B').getValues().filter(String).length - 1;
  // 先頭行を覗いてデータを配列で取得
  var maximList = sheet.getRange(2, 1, dataLength, 3).getValues();
  var num = Math.floor(Math.random() * dataLength);
  // 名言と名前を文字列にする
  return maximList[num][2] + "\n(" + maximList[num][1] + ")";
}
