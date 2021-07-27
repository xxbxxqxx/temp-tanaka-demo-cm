/**
 * Utilクラス
 */

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * Utility系の基本メソッド
 * @version 1.0.0
 */
export default class Util {
  constructor() {
    // empty
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * @desc オブジェクトの拡張（ディープコピー）
   * @return {Object} 拡張されたオブジェクト
   * @public
   */
  //FIXME: extendメソッド要見直し
  // static extend(boolean, isExtend, obj) {
  //   const extended = {};
  //   let deep = false;
  //   let i = 0;
  //   const length = arguments.length;

  //   // Check if a deep merge
  //   if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
  //     deep = arguments[0];
  //     i++;
  //   }

  //   // Merge the object into the extended object
  //   const merge = obj => {
  //     for (const prop in obj) {
  //       if (Object.prototype.hasOwnProperty.call(obj, prop)) {
  //         // If deep merge and property is an object, merge properties
  //         if (
  //           deep &&
  //           Object.prototype.toString.call(obj[prop]) === '[object Object]'
  //         ) {
  //           extended[prop] = this.extend(true, extended[prop], obj[prop]);
  //         } else {
  //           extended[prop] = obj[prop];
  //         }
  //       }
  //     }
  //   };

  //   // Loop through each object and conduct a merge
  //   for (; i < length; i++) {
  //     const obj = arguments[i];
  //     merge(obj);
  //   }

  //   return extended;
  // }

  /**
   * @desc オブジェクトのタイプを表す文字列を小文字で返す
   * @param {Object} obj 判別するオブジェクト
   * @return {string} string,number,boolean,object,array,function,regexp,date,html**element,htmlcollection,nodelist,null,undefined
   */
  static getType(obj: unknown): string {
    //objがnullまたはundefinedの場合
    if (obj === null) {
      return obj + '';
      //その他のオブジェクト
    } else {
      return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }
  }

  /**
   * @desc オブジェクトが指定のタイプと一致するか否か
   * @param {string} type - 判定したいタイプ
   * @param {Object} obj - 判定対象オブジェクト
   * @return {boolean} 一致する場合はtrue
   * @public
   */
  static isType(type: string, obj: unknown): boolean {
    const typeName = this.getType(obj);
    return obj !== undefined && obj !== null && typeName === type;
  }

  /**
   * @desc urlからハッシュフラグメントを除去
   * @param {string} url - 対象のURL
   * @return {string} ハッシュフラグメントを除去したURL
   * @public
   */
  static stripHash(url: string): string {
    return url.slice(0, url.lastIndexOf('#'));
  }

  /**
   * @desc ドキュメントのtopのスクロール量を取得
   * @return {number} windowのscrollTop値
   * @public
   */
  static getWindowScrollTop(): number {
    return document.documentElement.scrollTop || document.body.scrollTop;
  }

  /**
   * @desc タッチデバイスか否か
   * @return {boolean} タッチデバイスの場合はtrue
   * @public
   */
  static getIsTouch(): boolean {
    return 'ontouchstart' in window;
  }

  /**
   * @desc プラットフォームチェック
   * @return {Object}  プラットフォームの状態を格納したオブジェクト
   * @property {string} ua ブラウザのユーザエージェント
   * @property {string} browser ブラウザの種類
   * @property {string} device デバイスの種類
   * @property {boolean} isMobile モバイルか否か
   * @property {boolean} isTablet タブレットか否か
   * @property {boolean} isTouch タッチデバイスか否か
   * @public
   */
  static getPlatform(): {
    ua: string;
    device: string;
    browser: string;
    isMobile: boolean;
    isTablet: boolean;
    isTouch: boolean;
  } {
    type Platform = {
      ua: string;
      device: string;
      browser: string;
      isMobile: boolean;
      isTablet: boolean;
      isTouch: boolean;
    };
    const platform = {} as Platform;

    platform.ua = navigator.userAgent;

    const ua = platform.ua.toLowerCase();

    // browser
    if (ua.indexOf('edge') !== -1) {
      // Edge
      platform.browser = 'edge';
    } else if (ua.indexOf('trident/7') !== -1) {
      // IE11
      platform.browser = 'ie11';
    } else if (ua.indexOf('chrome') !== -1) {
      // Chrome
      platform.browser = 'chrome';
    } else if (ua.indexOf('firefox') !== -1) {
      // Firefox
      platform.browser = 'firefox';
    } else if (ua.indexOf('safari') !== -1) {
      // Safari
      platform.browser = 'safari';
    } else if (ua.indexOf('opera') !== -1) {
      // Opera
      platform.browser = 'opera';
    } else {
      // other
      platform.browser = null;
    }

    // device
    let device: string | null;
    if (ua.indexOf('iphone') !== -1 || ua.indexOf('ipod') !== -1) {
      device = 'iphone';
    } else if (ua.indexOf('ipad') !== -1) {
      device = 'ipad';
    } else if (ua.indexOf('android') !== -1) {
      device = 'android';
    } else {
      device = null;
    }

    //isMobile
    platform.isMobile =
      ua.indexOf('mobile') !== -1 || device === 'iphone' ? true : false;

    //isTablet
    platform.isTablet =
      device === 'ipad' ||
      (device === 'android' && !platform.isMobile) ||
      ua.indexOf('kindle') !== -1 ||
      ua.indexOf('silk') !== -1
        ? true
        : false;

    //isTouch
    platform.isTouch = 'ontouchstart' in window;

    return platform;
  }

  /**
   * @desc どの方向にスワイプされたかを返す
   * @param {string} startPageX - touchstart時のX座標
   * @param {string} startPageY - touchstart時のY座標
   * @param {Object} touchInfo - タッチの情報を含むオブジェクト
   * @return {string} 'left' or 'right' or 'vertical'
   * @public
   */
  static swipeDirection(
    startPageX: number,
    startPageY: number,
    touchInfo: { pageX: number; pageY: number }
  ): string {
    const distanceX = startPageX - touchInfo.pageX;
    const distanceY = startPageY - touchInfo.pageY;
    const distanceR = Math.atan2(distanceY, distanceX);
    let swipeAngle = Math.round((distanceR * 180) / Math.PI);

    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }

    if (swipeAngle <= 45 && swipeAngle >= 0) {
      return 'left';
    }
    if (swipeAngle <= 360 && swipeAngle >= 315) {
      return 'left';
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return 'right';
    }
    return 'vertical';
  }

  /**
   * @desc [-_]つなぎの文字列をcamelcaseに変換する
   * @param {string} str 対象文字列
   * @param {boolean} upper 最初の文字をuppercaseにするかどうか
   * @return {string} 変換後文字列
   */
  static toCamelcase(str: string, upper: boolean): string {
    if (!str) {
      return str;
    }

    const strs = str.split(/[-_ ]+/);
    const len = strs.length;
    let i = 1;

    if (len <= 1) {
      return str;
    }

    if (upper) {
      i = 0;
      str = '';
    } else {
      str = strs[0].toLowerCase();
    }

    for (; i < len; i++) {
      str += strs[i].toLowerCase().replace(/^[a-z]/, function (value) {
        return value.toUpperCase();
      });
    }

    return str;
  }
}
