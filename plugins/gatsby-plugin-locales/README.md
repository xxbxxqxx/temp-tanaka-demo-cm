# gatsby-plugin-locales
====

## Overview
loclaesのJSONをマージするGatsbyプラグインです。  
Gatsbyのビルドコマンド実行時にloclaes/en/, loclaes/ja/以下のJSONをマージしてloclaes/en.json, loclaes/ja.jsonを生成します。
gatsby-config.jsにプラグインとして追加して利用します。  

## Usage

gatsby-config.js  

```
module.exports = {
  plugins: [
    `gatsby-plugin-locales`
  ]
};
```

## Command

$ yarn build (= $ gatsby build)  
$ yarn develop (= $ gatsby develop)  

## Author

Concent, Inc.
