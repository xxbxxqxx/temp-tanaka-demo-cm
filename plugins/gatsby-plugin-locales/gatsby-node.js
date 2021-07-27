'use strict';

const fs = require('fs');
const path = require('path');
const jsonMerger = require('json-merger');

const init = './locales/'; // 言語ファイルの格納パス
const locales = ['en', 'ja']; // 言語の種類
const ext = '.json'; // JOSNファイルの拡張子

exports.onPreInit = () => {
  console.log('Loaded: gatsby-plugin-locales');
  // ディレクトリ内のJSONファイルのパスを取得する
  const readRecursiveDirSync = folderPath => {
    const result = [];
    // ファイルパス取得処理
    const readRootDirSync = folderPath => {
      // ディレクトリ内のパスを一括取得
      let items = fs.readdirSync(folderPath);
      items = items.map(itemName => {
        return path.join(folderPath, itemName);
      });
      // ファイルパスを配列に格納
      items.forEach(itemPath => {
        // 拡張子が.jsonであることをチェック
        if (path.extname(itemPath).toLowerCase() === ext) {
          result.push(itemPath);
        }
      });
    };
    // ファイルパス取得処理を実行
    readRootDirSync(folderPath);
    // ファイルパスを返却
    return result;
  };
  // 言語ごとにJSONをマージしてファイル生成
  locales.forEach(locale => {
    console.log('Message: ' + init + locale + '/のJSONをマージします。');
    const output = init + locale + ext;
    // ファイルが既に存在する場合は削除
    if (fs.existsSync(output)) {
      fs.unlinkSync(output);
    }
    // ファイル生成
    const lists = readRecursiveDirSync(init + locale + '/');
    try {
      const json = jsonMerger.mergeFiles(lists);
      fs.writeFileSync(output, JSON.stringify(json));
    } catch (err) {
      console.log('Error: ' + output + 'の生成に失敗しました。');
      console.log('Message: ' + err);
      process.exit(-1);
    }
    // ログ出力
    console.log('Output: ' + output + 'を生成しました。');
  });
};
