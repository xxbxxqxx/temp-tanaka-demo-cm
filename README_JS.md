# [ntd] CONNECT v2.5 JavaScript APIドキュメント

## 1 概要
CONNECT で使用している JavaScript API について解説した仕様書となります。

### 1-1 ドキュメントの生成について
ESDocを使ってドキュメントを生成しています。  

プロジェクトで必要になった際は、初期設定ファイルの .esdoc.json を編集し、以下のコマンドを実行してください。

```
$ npm run esdoc
```

## 2 ファイル構成
提供するファイルはそれぞれ下記の構成になっています。

### 2-1 CONNECT オリジナルのjQueryプラグイン
以下の CONNECTオリジナルプラグイン（jquery.cnt.***.js）は基本的に修正や削除は禁止とします。  

```
assets/
  lib/
    concat/
      original/
        jquery.cnt.accordion.js
        jquery.cnt.dropdownMenu.js
        jquery.cnt.hamburgerMenu.js
        jquery.cnt.localscroll.js
        jquery.cnt.outside.js
        jquery.cnt.sameHeight.js
        jquery.cnt.simplemodal.js
        jquery.cnt.tabchange.js
        jquery.cnt.vichanger.js

```

尚、サードパーティー製のプラグインを格納する場合は、  
/src/assets/lib/  
または  
/src/assets/lib/concat/  
配下へ格納するようにしてください。

### 2-2 名前空間の設定
グローバル空間の汚染を防ぐため、名前空間設定用のファイルを用意しています。    
デフォルトで、「global.cnt」が設定されていますが、プロジェクトごとに適宜調整してください。

```
assets/
  js/
    utils/
      concat/
        !namespace.js
```

### 2-3 共通設定、及び各パーツごとの設定
init.jsでプロジェクト全体で必要な設定を記述します。  
/src/assets/js/view/ 配下は各パーツ用のJSファイルを格納してください。  
デフォルトで用意している、_init.js、_headernav.jsはカスタマイズ可能です。  
プロジェクトごとに適宜調整してください。

```
assets/
  js/
    _init.js //共通設定
    view/
      _headernav.js //ヘッダーパーツ
```
