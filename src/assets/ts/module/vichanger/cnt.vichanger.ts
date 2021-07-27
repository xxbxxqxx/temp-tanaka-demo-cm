/**
 * ViChangerクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import { EventEmitter } from 'events';
import Elements from '@src/assets/ts/core/Elements';
import Util from '@src/assets/ts/core/Util';
import ViChangerNavi from '@src/assets/ts/module/vichanger/cnt.vichangerNavi';
import VichangerPrevBtn from '@src/assets/ts/module/vichanger/cnt.vichangerPrevBtn';
import VichangerNextBtn from '@src/assets/ts/module/vichanger/cnt.vichangerNextBtn';
import VichangerPauseBtn from '@src/assets/ts/module/vichanger/cnt.vichangerPauseBtn';
import Velocity from 'velocity-animate';
import {
  Options,
  ViChangerInterface
} from '@src/assets/ts/module/vichanger/cnt.vichangerInterface';

/** @external {HTMLElement} https://developer.mozilla.org/en/docs/Web/API/HTMLElement */
/** @external {NodeList} https://developer.mozilla.org/ja/docs/Web/API/NodeList */
/** @external {HTMLCollection} https://developer.mozilla.org/ja/docs/Web/API/HTMLCollection */
/** @external {EventEmitter} https://nodejs.org/api/events.html */

//--------------------------------------------------------------------------
//  Common Parameter
//--------------------------------------------------------------------------
/**
 * ViChangerのインスタンスごとに割り振るID
 * @typedef {number} VI_ID_COUNTER
 * @private
 */
let VI_ID_COUNTER = 0;

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * カルーセル機能
 * @extends {EventEmitter}
 * @version 1.0.0
 */

interface List extends HTMLElement {
  naviTriggerEvent: {
    (trigerEvent: string, mainClick: () => void): void;
  };
}
interface Target extends EventTarget {
  offsetLeft: number;
}

export default class ViChanger extends EventEmitter
  implements ViChangerInterface {
  //-------------------------------------------------
  // Properties
  //-------------------------------------------------

  element: Element;

  options: Options;

  responsiveSettings?:
    | [
        {
          mediaQueryString: string;
          liquidLayoutFlag: boolean;
          maxWidth: number;
          visible: number;
          scroll: number;
        }
      ]
    | null;
  id: string;
  mainViewArea?: HTMLElement | null;
  mainWrapper: HTMLElement;
  mainOriginalList: HTMLCollection;
  mainList: HTMLCollection;
  mainClone: string | HTMLElement | null;
  naviWrapper: HTMLElement | null;
  navi: ViChangerNavi | null;
  prevBtnElm?: HTMLElement | null;
  prevBtn?: VichangerPrevBtn | null;
  nextBtnElm?: HTMLElement | null;
  nextBtn?: VichangerNextBtn | null;
  pauseBtnElm?: HTMLElement | null;
  pauseBtn?: VichangerPauseBtn | null;
  mainInitLength: number;
  mainTotalLength: number;
  slideWidth: number;
  slideOffsetX: number;
  slideOffsetListNum: number;
  mainUlSize: number;
  mainLiSize: number;
  overFlag: boolean;
  mainOverFlag: boolean;
  btnOverFlag: boolean;
  pauseFlag: boolean;
  prevFlag: boolean;
  liquidLayoutFlag: boolean;
  visible: number;
  scroll: number;
  cloneNum: number;
  startIndex: number;
  currentIndex: number;
  oldIndex?: number;
  currentOriginalIndex: number;
  timerId?: number | null;
  run: boolean;
  vichangerListeners: {
    btnOut: () => void | null;
    btnOver: () => void | null;
    mainOut: () => void | null;
    mainOver: () => void | null;
    mainClick: () => void | null;
    mainTouchEnd: () => void | null;
    mainTouchMove: () => void | null;
    mainTouchStart: () => void | null;
    naviClick: () => void | null;
    nextClick: () => void | null;
    pauseClick: () => void | null;
    prevClick: () => void | null;
    resize: () => void | null;
  } | null;
  touchMoveFlag: boolean;
  startPageX: number | null;
  startPageY: number | null;
  startMainLeft: number | null;
  lastTouchInfo: {
    pageX: number;
    pageY: number;
  } | null;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc ViChangerのインスタンスを作成
   * @param {HTMLElement} element - 対象要素
   * @param {Object} options - ViChanger初期化オプション
   * @param {string} options.mainViewAreaSelector - 表示エリアの横幅を取得するためのセレクタ(changeType: 'slide'の場合は必須)
   * @param {string} options.mainWrapperSelector - メイン画像のラッパーセレクタ
   * @param {?string} [options.naviWrapperSelector] - ナビゲーションのラッパーセレクタ
   * @param {?string} [options.prevBtnSelector] - PREVボタンのラッパーセレクタ
   * @param {?string} [options.nextBtnSelector] - NEXTボタンのラッパーセレクタ
   * @param {?string} [options.pauseBtnSelector] - 一時停止ボタンのラッパーセレクタ
   * @param {string} options.changeType='slide' - メイン画像切り替えタイプ（'slide' or 'fade'）
   * @param {string} options.fadeType='03' - フェードタイプ（changeTypeがfadeの場合に有効）'01': クロスフェード、'02': カレントを非表示にしてからフェードイン、'03': カレントの上にかぶせてフェードイン、'04': カレントがフェードアウトしてからフェードイン
   * @param {string} [options.naviTriggerEvent='click'] - ナビゲーションのトリガイベント（'click' or 'mouseover' or null）
   * @param {string} [options.naviActiveClassName='is-active'] - ナビゲーションのアクティブ状態を表すクラス名
   * @param {?string} [options.mainActiveClassName=null] - メインリストのアクティブ状態を表すクラス名（nullの場合はクラス付与なし）
   * @param {string} [options.pauseActiveClassName='is-active'] - 一時停止ボタンのアクティブ状態を表すクラス名
   * @param {string} [options.btnDisabledClassName='is-disabled'] - // NEXT・PREVボタン非活性化状態を表すクラス名（circularがfalseの場合に有効）
   * @param {number} options.duration='400' - アニメーション時間をミリ秒単位で指定
   * @param {string} options.easing='swing' - 切り替えアニメーションのeasing設定（'swing' or 'linear'）
   * @param {?number|Object} options.auto=5000 - 自動切り替えまでの時間をミリ秒単位で指定。nullの場合は自動切り替えなし。Arrayで個別設定も可能。
   * @param {boolean} options.circular=true - 切り替えループ処理
   * @param {number} options.startIndex=0 - 初期表示画像インデックス
   * @param {boolean} options.hoverTimerStop=true - マウスオーバーアクションによるタイマー停止処理をするか否か
   * @param {boolean} options.swipeFlag=true - スワイプ機能
   * @param {number} options.visible=1 - スライドエリアに表示する数
   * @param {number} options.scroll=1 - スライドする数
   * @param {boolean} [options.centerMode=false] - カレントをセンターに配置するか否か（circularがtrueの場合に有効）
   * @param {boolean} [options.otherViSyncFlag=false] - 他のVIとsyncさせるか
   * @param {boolean} options.liquidLayoutFlag=true - リキッドレイアウトにするか否か（メディアクエリ別に設定するoptions.responsiveがnullの場合に有効）
   * @param {?Object[]} [options.responsive=null] - メディアクエリ別の設定をArrayで指定
   * @param {string} [options.responsive[].mediaQueryString] - window.matchMediaで判定するための条件式
   * @param {boolean} [options.responsive[].liquidLayoutFlag] - リキッドレイアウトにするか否か
   * @param {number} [options.responsive[].maxWidth] - 最大の横幅（liquidLayoutFlagがfalseの場合に有効）
   * @param {number} [options.responsive[].visible] - スライドエリアに表示する数
   * @param {number} [options.responsive[].scroll] - スライドする数
   * @param {boolean} options.accessibilityFlag=false - アクセシビリティ対応するか否か
   * @param {?function} [options.onChange=null] - auto、または next prev による変更時の処理（otherViSyncFlagがtrueの場合に有効）
   * @param {?function} [options.mainClickChange=null] - メイン画像によるターゲットインデックス値取得処理（otherViSyncFlagがtrueの場合に有効）
   * @param {?function} [options.naviClickChange=null] - ナビクリックによるターゲットインデックス値取得処理（otherViSyncFlagがtrueの場合に有効）
   * @param {?function} options.beforeSlideContent=null - スライド前の処理
   * @param {?function} options.endSlideContent=null - スライド後の処理
   */
  constructor(element: Element, options = {}) {
    super();

    if (!element) return;

    const defaultOptions = {
      mainViewAreaSelector: '',
      mainWrapperSelector: '',
      naviWrapperSelector: '',
      prevBtnSelector: '',
      nextBtnSelector: '',
      pauseBtnSelector: '',
      changeType: 'slide',
      fadeType: '03',
      naviTriggerEvent: 'click',
      naviActiveClassName: 'is-active',
      mainActiveClassName: null,
      pauseActiveClassName: 'is-active',
      btnDisabledClassName: 'is-disabled',
      duration: 400,
      easing: 'swing',
      auto: 5000,
      circular: true,
      startIndex: 0,
      hoverTimerStop: true,
      swipeFlag: true,
      visible: 1,
      scroll: 1,
      centerMode: false,
      otherViSyncFlag: false,
      liquidLayoutFlag: true,
      responsive: null,
      accessibilityFlag: false,
      onChange: null,
      mainClickChange: null,
      naviClickChange: null,
      beforeSlideContent: null,
      endSlideContent: null
    };

    /**
     * ViChangerオプション
     * @type {Object}
     * @protected
     */
    this.options = Object.assign({}, defaultOptions, options);
    /**
     * 対象要素
     * @type {HTMLElement}
     * @protected
     */
    this.element = element;
    /**
     * 識別ID
     * @type {string}
     * @protected
     */
    this.id = `vichanger${++VI_ID_COUNTER}`;

    // 要素の設定 ---------------------
    /**
     * 表示エリアの横幅を取得するための要素
     * @type {?HTMLElement}
     * @protected
     */
    this.mainViewArea =
      this.options.mainViewAreaSelector !== ''
        ? this.element.querySelector(this.options.mainViewAreaSelector)
        : null;
    /**
     * メイン画像のラッパー要素
     * @type {HTMLElement}
     * @protected
     */
    this.mainWrapper = this.element.querySelector(
      this.options.mainWrapperSelector
    );
    /**
     * メイン画像のオリジナルリスト要素
     * @type {HTMLCollection}
     * @protected
     */
    this.mainOriginalList = this.mainWrapper.children;
    /**
     * メイン画像のクローンを含めた全リスト要素
     * @type {HTMLCollection}
     * @protected
     */
    this.mainList = this.mainWrapper.children;
    /**
     * メイン画像のクローンリスト要素（changeType: 'slide' & circular: trueの場合に使用）
     * @type {?HTMLCollection}
     * @protected
     */
    this.mainClone = null;
    /**
     * ナビゲーション要素
     * @type {?HTMLElement}
     * @protected
     */
    this.naviWrapper =
      this.options.naviWrapperSelector !== ''
        ? this.element.querySelector(this.options.naviWrapperSelector)
        : null;
    /**
     * ViChangerNaviクラス
     * @type {?ViChangerNavi}
     * @protected
     */
    this.navi = null;
    /**
     * PREVボタン要素
     * @type {?HTMLElement}
     * @protected
     */
    this.prevBtnElm =
      this.options.prevBtnSelector !== ''
        ? this.element.querySelector(this.options.prevBtnSelector)
        : null;
    /**
     * VichangerPrevBtnクラス
     * @type {?VichangerPrevBtn}
     * @protected
     */
    this.prevBtn = null;
    /**
     * NEXTボタン要素
     * @type {?HTMLElement}
     * @protected
     */
    this.nextBtnElm =
      this.options.nextBtnSelector !== ''
        ? this.element.querySelector(this.options.nextBtnSelector)
        : null;
    /**
     * VichangerNextBtnクラス
     * @type {?VichangerNextBtn}
     * @protected
     */
    this.nextBtn = null;
    /**
     * 一時停止ボタン要素
     * @type {?HTMLElement}
     * @protected
     */
    this.pauseBtnElm =
      this.options.pauseBtnSelector !== ''
        ? this.element.querySelector(this.options.pauseBtnSelector)
        : null;
    /**
     * VichangerPauseBtnクラス
     * @type {?VichangerPauseBtn}
     * @protected
     */
    this.pauseBtn = null;

    // その他初期設定 ---------------------
    /**
     * メイン画像のオリジナルリスト要素の数
     * @type {number}
     * @protected
     */
    this.mainInitLength = this.mainList.length;
    /**
     * メイン画像のクローンを含めた全リスト要素の数
     * @type {number}
     * @protected
     */
    this.mainTotalLength = this.mainInitLength;
    /**
     * 表示エリアの横幅サイズ
     * @type {?number}
     * @protected
     */
    this.slideWidth = null;
    if (this.mainViewArea !== null && this.mainViewArea !== undefined) {
      this.slideWidth = this.mainViewArea.offsetWidth;
    }
    /**
     * changeType: 'slide' & circular: true & centerMode: trueの場合のX座標オフセット値
     * @type {number}
     * @protected
     */
    this.slideOffsetX = 0;
    /**
     * changeType: 'slide' & circular: true & centerMode: trueの場合のメイン画像のリスト調整数
     * @type {number}
     * @protected
     */
    this.slideOffsetListNum = 0;
    /**
     * メインエリアのULの横幅サイズ
     * @type {number}
     * @protected
     */
    this.mainUlSize = 0;
    /**
     * メイン画像のLIの横幅サイズ
     * @type {number}
     * @protected
     */
    this.mainLiSize = 0;
    /**
     * マウスオーバー状態か否か（mainOverFlagとbtnOverFlagが両方falseでfalse、それ以外はtrue）
     * @type {boolean}
     * @protected
     */
    this.overFlag = false;
    /**
     * メインエリアがマウスオーバー状態か否か
     * @type {boolean}
     * @protected
     */
    this.mainOverFlag = false;
    /**
     * ボタン要素がマウスオーバー状態か否か
     * @type {boolean}
     * @protected
     */
    this.btnOverFlag = false;
    /**
     * 一時停止状態か否か
     * @type {boolean}
     * @protected
     */
    this.pauseFlag = false;
    /**
     * PREV状態か否か
     * @type {boolean}
     * @protected
     */
    this.prevFlag = false;
    /**
     * リキッドレイアウトにするか否か
     * @type {boolean}
     * @protected
     */
    this.liquidLayoutFlag = this.options.liquidLayoutFlag;
    /**
     * メディアクエリ別の設定
     * @type {?Object[]}
     * @protected
     */
    this.responsiveSettings = this.options.responsive;
    /**
     * スライドエリアに表示する数
     * @type {number}
     * @protected
     */
    this.visible =
      this.mainInitLength < this.options.visible
        ? this.mainInitLength
        : this.options.visible;
    /**
     * スライドする数
     * @type {number}
     * @protected
     */
    this.scroll = this.options.scroll;
    /**
     * changeType: 'slide' ＆ circular: trueの場合にクローンする数
     * @type {number}
     * @protected
     */
    this.cloneNum = this.visible;
    /**
     * 初期表示画像インデックス
     * @type {number}
     * @protected
     */
    this.startIndex =
      this.options.circular && this.options.changeType === 'slide'
        ? this.options.startIndex + this.cloneNum
        : this.options.startIndex;
    /**
     * カレント画像インデックス（クローンを含める）
     * @type {number}
     * @protected
     */
    this.currentIndex = this.startIndex;
    /**
     * 前回のカレント画像インデックス
     * @type {?number}
     * @protected
     */
    this.oldIndex = null;
    /**
     * オリジナルのカレント画像インデックス（クローンを含めない）
     * @type {number}
     * @protected
     */
    this.currentOriginalIndex = this.options.startIndex;
    /**
     * タイマーID
     * @type {?string}
     * @protected
     */
    this.timerId = null;
    /**
     * 実行中か否か
     * @type {boolean}
     * @protected
     */
    this.run = true;
    /**
     * イベントリスナーを格納したオブジェクト
     * @type {Object}
     * @protected
     */
    this.vichangerListeners = {
      btnOut: null,
      btnOver: null,
      mainOut: null,
      mainOver: null,
      mainClick: null,
      mainTouchEnd: null,
      mainTouchMove: null,
      mainTouchStart: null,
      naviClick: null,
      nextClick: null,
      pauseClick: null,
      prevClick: null,
      resize: null
    };

    // slide & touchデバイスの設定 ---------------------
    /**
     * touchmove中か否か
     * @type {Object}
     * @protected
     */
    this.touchMoveFlag = false;
    /**
     * touchstart時のchangedTouches[0].pageX座標
     * @type {number}
     * @protected
     */
    this.startPageX = null;
    /**
     * touchstart時のchangedTouches[0].pageY座標
     * @type {number}
     * @protected
     */
    this.startPageY = null;
    /**
     * touchstart時のメインエリアのoffsetLeft値
     * @type {number}
     * @protected
     */
    this.startMainLeft = null;
    /**
     * 最新のchangedTouches情報を格納したオブジェクト
     * @type {Object}
     * @protected
     */
    this.lastTouchInfo = null;

    this._init();
  }

  //-------------------------------------------------
  // Private Methods
  //-------------------------------------------------
  /**
   * @desc 初期化
   * @private
   */
  _init(): void {
    // ナビゲーション初期化
    if (this.naviWrapper !== null && this.naviWrapper !== undefined) {
      // ViChangerNaviクラスの紐付け
      if (!this.navi) {
        this.navi = new ViChangerNavi(this, this.naviWrapper);
      }
    }
    // PREVボタン初期化
    if (this.prevBtnElm !== null && this.prevBtnElm !== undefined) {
      if (!this.prevBtn) {
        this.prevBtn = new VichangerPrevBtn(this, this.prevBtnElm);
      }
    }
    // NEXTボタン初期化
    if (this.nextBtnElm !== null && this.nextBtnElm !== undefined) {
      if (!this.nextBtn) {
        this.nextBtn = new VichangerNextBtn(this, this.nextBtnElm);
      }
    }
    // PAUSEボタン初期化
    if (this.pauseBtnElm !== null && this.pauseBtnElm !== undefined) {
      if (!this.pauseBtn) {
        this.pauseBtn = new VichangerPauseBtn(this, this.pauseBtnElm);
      }
    }

    // Mainエリア初期化
    this._initMain();

    // イベントバインド
    this._bindEvents();

    // 自動切り替えありの場合、タイマーセット
    if (this.options.auto !== null && this.options.auto !== undefined) {
      this._startTimer();
    }

    // レスポンシブ設定
    if (
      (this.responsiveSettings !== null &&
        this.responsiveSettings.length > -1) ||
      this.liquidLayoutFlag
    ) {
      this._changeContentsSize();
    }
  }

  /**
   * @desc メイン画像エリア初期化
   * @private
   */
  _initMain(): void {
    // スライドアニメーション初期化
    if (this.options.changeType === 'slide') {
      const firstOfMainList = this.mainList[0] as HTMLElement;
      this.mainLiSize = firstOfMainList.offsetWidth;

      // 切り替えループありの場合は前後にクローンを配置
      if (this.options.circular) {
        Array.from(this.mainList).forEach((list: HTMLElement, index) => {
          let cloneNode;

          // 前の要素を後ろにクローン
          if (index < this.cloneNum) {
            cloneNode = list.cloneNode(true);
            Elements.append(this.mainWrapper, cloneNode);
            Elements.attr(cloneNode, 'data-js-vi-cloned', 'after');
          }
          // 後ろの要素を前にクローン
          if (index >= this.mainInitLength - this.cloneNum) {
            cloneNode = list.cloneNode(true);
            const cloneNodeBeforeElm = this.mainWrapper.querySelectorAll(
              '[data-js-vi-cloned="before"]'
            );
            const cloneNodeBeforeL = cloneNodeBeforeElm.length;
            if (cloneNodeBeforeL > 0) {
              Elements.after(
                cloneNodeBeforeElm.item(cloneNodeBeforeL - 1) as HTMLElement,
                cloneNode
              );
            } else {
              Elements.prepend(this.mainWrapper, cloneNode);
            }
            Elements.attr(cloneNode, 'data-js-vi-cloned', 'before');
          }
        });
      }

      // メイン画像リストの幅・座標を設定
      this.mainList = this.mainWrapper.children;
      this.mainTotalLength = this.mainList.length;
      this.mainUlSize = this.mainLiSize * this.mainTotalLength;

      // 切り替えループあり＆センター配置の場合はoffset値を設定
      if (this.options.circular && this.options.centerMode) {
        this._initSlideOffset();
      }

      this.mainWrapper.style.width = this.mainUlSize + 'px';
      this.mainWrapper.style.left =
        -(this.currentIndex * this.mainLiSize + this.slideOffsetX) + 'px';

      // フェードイン・フェードアウトアニメーション初期化
    } else {
      Array.from(this.mainList).forEach((list: HTMLElement, index) => {
        if (index === this.currentIndex) {
          list.style.display = '';
        } else {
          list.style.display = 'none';
        }
      });
    }

    // メインリストのアクティブクラス設定
    this._setMainActive(this.currentIndex);
  }

  /**
   * @desc メイン画像リストのアクティブクラス設定
   * @param {number} targetIndex - アクティブにするメインのindex
   * @private
   */
  _setMainActive(targetIndex: number): void {
    // メインリストのアクティブクラス設定
    Array.from(this.mainList).forEach((list: HTMLElement, index) => {
      if (targetIndex === index) {
        if (this.options.mainActiveClassName !== null) {
          Elements.removeClass(this.mainList, this.options.mainActiveClassName);
          Elements.addClass(list, this.options.mainActiveClassName);
        }

        // アクセシビリティ対応
        if (this.options.accessibilityFlag) {
          Elements.attr(this.mainList, 'aria-hidden', 'true');
          Elements.attr(list, 'aria-hidden', 'false');
        }
      }
    });
  }

  /**
   * @desc スライダー初期化
   * @private
   */
  _initSlide(): void {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;

    const mainWrapperStyle = Elements.getStyle(this.mainWrapper);
    const mainListStyle = Elements.getStyle(this.mainList[0] as HTMLElement);

    if (this.visible > 1) {
      let slideWidth = this.slideWidth;
      // ネガティブマージンによる調整
      if (
        parseFloat(mainWrapperStyle.marginLeft) < 0 &&
        parseFloat(mainListStyle.paddingLeft) > 0
      ) {
        slideWidth += parseFloat(mainListStyle.paddingLeft);
      }
      if (
        parseFloat(mainWrapperStyle.marginRight) < 0 &&
        parseFloat(mainListStyle.paddingRight) > 0
      ) {
        slideWidth += parseFloat(mainListStyle.paddingRight);
      }
      this.mainLiSize = slideWidth / this.visible;
    } else {
      this.mainLiSize = this.slideWidth;
    }
    this.mainUlSize = this.mainLiSize * this.mainTotalLength;

    // センター配置の場合はoffset値を調整
    if (this.options.centerMode) {
      this._initSlideOffset();
    }

    let mainListWidth;

    if (mainListStyle.boxSizing !== 'border-box') {
      mainListWidth =
        this.mainLiSize -
        parseFloat(mainListStyle.paddingLeft) -
        parseFloat(mainListStyle.paddingRight);
    } else {
      mainListWidth = this.mainLiSize;
    }

    const targetX = -(this.currentIndex * this.mainLiSize + this.slideOffsetX);

    Array.from(this.mainList).forEach((list: HTMLElement) => {
      list.style.width = mainListWidth + 'px';
    });

    Velocity(this.mainWrapper, 'stop', true);
    this.mainWrapper.style.width = this.mainUlSize + 'px';
    this.mainWrapper.style.left = targetX + 'px';

    if (this.options.auto !== null && this.options.auto !== undefined) {
      this._startTimer();
    }
  }

  /**
   * @desc 切り替えループあり＆センター配置の場合のX座標のoffset値を設定
   * @private
   */
  _initSlideOffset(): void {
    if (this.visible % 2 === 0) {
      this.slideOffsetX = -(this.slideWidth / 2);
    } else {
      this.slideOffsetX = -((this.slideWidth - this.mainLiSize) / 2);
    }
    this.slideOffsetListNum = Math.ceil(this.slideWidth / this.mainLiSize / 2);
  }

  /**
   * イベントのバインド登録
   * @private
   */
  _bindEvents(): void {
    // レスポンシブ設定
    if (
      (this.responsiveSettings !== null &&
        this.responsiveSettings.length > -1) ||
      this.liquidLayoutFlag
    ) {
      this.vichangerListeners.resize = this._windowResize.bind(this);
      window.addEventListener('resize', this.vichangerListeners.resize, false);
      window.addEventListener(
        'orientationchange',
        this.vichangerListeners.resize,
        false
      );
    }

    // メインスワイプアクション
    if (
      this.options.changeType === 'slide' &&
      this.options.swipeFlag &&
      Util.getIsTouch()
    ) {
      this.vichangerListeners.mainTouchStart = this._mainTouchStart.bind(this);
      this.mainWrapper.addEventListener(
        'touchstart',
        this.vichangerListeners.mainTouchStart,
        false
      );

      this.vichangerListeners.mainTouchMove = this._mainTouchMove.bind(this);
      this.mainWrapper.addEventListener(
        'touchmove',
        this.vichangerListeners.mainTouchMove,
        false
      );

      this.vichangerListeners.mainTouchEnd = this._mainTouchEnd.bind(this);
      this.mainWrapper.addEventListener(
        'touchend',
        this.vichangerListeners.mainTouchEnd,
        false
      );
    }

    // 自動切り替えあり & マウスオーバーアクションによるタイマー停止処理ありの場合はマウスオーバー処理の登録
    if (
      this.options.auto !== null &&
      this.options.auto !== undefined &&
      this.options.hoverTimerStop
    ) {
      this.vichangerListeners.mainOver = this._mainOver.bind(this);
      this.mainWrapper.addEventListener(
        'mouseover',
        this.vichangerListeners.mainOver,
        false
      );
      this.vichangerListeners.mainOut = this._mainOut.bind(this);
      this.mainWrapper.addEventListener(
        'mouseout',
        this.vichangerListeners.mainOut,
        false
      );
    }

    // 他のVIとsyncさせる場合はメインリスト画像クリックイベントを有効
    if (
      this.options.otherViSyncFlag &&
      this.options.mainClickChange &&
      Util.isType('function', this.options.mainClickChange)
    ) {
      this.vichangerListeners.mainClick = this._mainClick.bind(this);
      Array.from(this.mainList).forEach((list: Element) => {
        list.addEventListener(
          'click',
          this.vichangerListeners.mainClick,
          false
        );
      });
    }

    this.vichangerListeners.naviClick = this._naviClick.bind(this);
    this.on('navi:click', this.vichangerListeners.naviClick);

    this.vichangerListeners.prevClick = this._prevClick.bind(this);
    this.on('prev:click', this.vichangerListeners.prevClick);

    this.vichangerListeners.nextClick = this._nextClick.bind(this);
    this.on('next:click', this.vichangerListeners.nextClick);

    this.vichangerListeners.pauseClick = this._pauseClick.bind(this);
    this.on('pause:click', this.vichangerListeners.pauseClick);

    this.vichangerListeners.btnOver = this._btnOver.bind(this);
    this.on('btn:over', this.vichangerListeners.btnOver);

    this.vichangerListeners.btnOut = this._btnOut.bind(this);
    this.on('btn:out', this.vichangerListeners.btnOut);
  }

  /**
   * @desc イベントのバインド解除
   * @private
   */
  _unbindEvents(): void {
    window.removeEventListener('resize', this.vichangerListeners.resize);
    window.removeEventListener(
      'orientationchange',
      this.vichangerListeners.resize
    );
    this.mainWrapper.removeEventListener(
      'touchstart',
      this.vichangerListeners.mainTouchStart
    );
    this.mainWrapper.removeEventListener(
      'touchmove',
      this.vichangerListeners.mainTouchMove
    );
    this.mainWrapper.removeEventListener(
      'touchend',
      this.vichangerListeners.mainTouchEnd
    );
    this.mainWrapper.removeEventListener(
      'mouseover',
      this.vichangerListeners.mainOver
    );
    this.mainWrapper.removeEventListener(
      'mouseout',
      this.vichangerListeners.mainOut
    );

    Array.from(this.mainList).forEach((list: List) => {
      list.naviTriggerEvent('click', this.vichangerListeners.mainClick);
    });

    this.off('navi:click', this.vichangerListeners.naviClick);
    this.off('prev:click', this.vichangerListeners.prevClick);
    this.off('next:click', this.vichangerListeners.nextClick);
    this.off('pause:click', this.vichangerListeners.pauseClick);
    this.off('btn:over', this.vichangerListeners.btnOver);
    this.off('btn:out', this.vichangerListeners.btnOut);
  }

  /**
   * @desc ウィンドウのリサイズイベント
   * @private
   */
  _windowResize(): void {
    if (this.run) {
      this._changeContentsSize();
    }
  }

  /**
   * @desc レスポンシブによるリキッドレイアウトの表示エリアサイズ調整
   * @private
   */
  _changeContentsSize(): void {
    // メディアクエリ設定がある（options.responsiveの設定がある）場合
    if (
      this.responsiveSettings !== null &&
      this.responsiveSettings.length > -1
    ) {
      let i = 0,
        max;
      for (i = 0, max = this.responsiveSettings.length; i < max; i++) {
        const settingObj = this.responsiveSettings[i];
        const rsMediaQueryString = settingObj.mediaQueryString;
        const rsLiquidLayoutFlag = settingObj.liquidLayoutFlag;
        const rsMaxWidth = settingObj.maxWidth;
        const rsVisible = settingObj.visible;
        const rsScroll = settingObj.scroll;

        if (this.mainViewArea !== null && this.mainViewArea !== undefined) {
          this.slideWidth = this.mainViewArea.offsetWidth;
        } else {
          this.slideWidth = null;
        }

        // window.matchMediaでブレイクポイント判定
        if (window.matchMedia(rsMediaQueryString).matches) {
          this.visible = rsVisible !== undefined ? rsVisible : this.visible;
          this.scroll = rsScroll !== undefined ? rsScroll : this.scroll;

          if (!rsLiquidLayoutFlag && rsMaxWidth !== undefined) {
            this.slideWidth = rsMaxWidth;
          }

          if (this.options.changeType === 'slide') {
            this._initSlide();
          }
        }
      }
      // リキッドレイアウトである（options.liquidLayoutFlag: true）の場合
    } else {
      if (this.mainViewArea !== null && this.mainViewArea !== undefined) {
        this.slideWidth = this.mainViewArea.offsetWidth;
      } else {
        this.slideWidth = null;
      }
      if (this.options.changeType === 'slide') {
        this._initSlide();
      }
    }
  }

  /**
   * @desc touchstartイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _mainTouchStart(e: TouchEvent): void {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;
    this.lastTouchInfo = e.changedTouches[0];
    this.startPageX = this.lastTouchInfo.pageX;
    this.startPageY = this.lastTouchInfo.pageY;
    const target = e.currentTarget as Target;
    this.startMainLeft = target.offsetLeft;
    this.touchMoveFlag = false;
  }

  /**
   * @desc touchmoveイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _mainTouchMove(e: TouchEvent): void {
    this.lastTouchInfo = e.changedTouches[0];
    const distanceX = this.startPageX - this.lastTouchInfo.pageX;
    const direction = Util.swipeDirection(
      this.startPageX,
      this.startPageY,
      this.lastTouchInfo
    );

    // 縦スクロールの場合は何もしない
    if (direction === 'vertical') {
      return;
    }

    // スワイプ動作をしているか否か
    if (Math.abs(distanceX) > 5) {
      this.touchMoveFlag = true;
    }

    e.preventDefault();

    if (this.scroll === this.visible) {
      const changeX =
        this.startMainLeft - (this.startPageX - this.lastTouchInfo.pageX);
      Velocity(this.mainWrapper, 'stop', true);
      this.mainWrapper.style.left = changeX + 'px';
    }
  }

  /**
   * @desc touchendイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _mainTouchEnd(e: TouchEvent): void {
    const direction = Util.swipeDirection(
      this.startPageX,
      this.startPageY,
      this.lastTouchInfo
    );

    // 縦スクロールの場合は何もしないでタイマー再開
    if (direction === 'vertical') {
      if (this.options.auto !== null && this.options.auto !== undefined) {
        this._startTimer();
      }
      return;
    }

    const moveX = e.changedTouches[0].pageX;
    const targetX = -(this.currentIndex * this.mainLiSize + this.slideOffsetX);
    const distanceX = this.startPageX - moveX;

    // リンクをタップした場合は端末デフォルトの動きを優先
    if (!this.touchMoveFlag && Math.abs(distanceX) <= 5) {
      return;
    }
    e.preventDefault();

    this.touchMoveFlag = false;
    this.lastTouchInfo = null;

    // 右方向のスクロール
    if (distanceX > 30) {
      // 切り替えループなしで最後の画像が表示されている場合はカレントの画像を表示
      if (
        this.navi.naviCurrentIndex === this.navi.maxIndex &&
        !this.options.circular
      ) {
        Velocity(this.mainWrapper, 'stop', true);
        Velocity(
          this.mainWrapper,
          { left: targetX },
          {
            duration: this.options.duration,
            easing: this.options.easing,
            complete: () => {
              this._endMotion();
            }
          }
        );
        // その他は次の画像を表示
      } else {
        this._onChange();
      }
      // 左方向のスクロール
    } else if (distanceX < -30) {
      // 切り替えループなしで最初の画像が表示されている場合はカレントの画像を表示
      if (this.navi.naviCurrentIndex === 0 && !this.options.circular) {
        Velocity(this.mainWrapper, 'stop', true);
        Velocity(
          this.mainWrapper,
          { left: targetX },
          {
            duration: this.options.duration,
            easing: this.options.easing,
            complete: () => {
              this._endMotion();
            }
          }
        );
        // その他は前の画像を表示
      } else {
        this._onChange(true);
      }
      // スクロール量が少ない場合はカレントの画像を表示
    } else {
      this._onMotion(this.currentIndex);
    }
  }

  /**
   * @desc ナビゲーションクリックイベント処理
   * @param {number} targetIndex - ターゲットのindex
   * @private
   */
  _naviClick(targetIndex: number): void {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;

    targetIndex = targetIndex[1];
    // コールバック処理
    if (
      this.options.otherViSyncFlag &&
      this.options.naviClickChange &&
      Util.isType('function', this.options.naviClickChange)
    ) {
      this.options.naviClickChange.call(this, targetIndex);
    }

    // 切り替えループありのスライダーの場合
    if (this.options.circular && this.options.changeType === 'slide') {
      targetIndex += this.cloneNum;
    }

    this._onMotion(targetIndex);
  }

  /**
   * @desc PREVボタンクリックイベント処理
   * @private
   */
  _prevClick(): void {
    this._onChange(true);
  }

  /**
   * @desc NEXTボタンクリックイベント処理
   * @private
   */
  _nextClick(): void {
    this._onChange();
  }

  /**
   * @desc 一時停止ボタンクリックイベント処理
   * @private
   */
  _pauseClick(): void {
    if (this.pauseBtn.isActive()) {
      //再生
      this.pauseFlag = false;
      this.pauseBtn.deleteActive();
      this._startTimer();
    } else {
      //停止
      if (this.timerId) clearTimeout(this.timerId);
      this.timerId = null;
      this.pauseFlag = true;
      this.pauseBtn.setActive();
    }
  }

  /**
   * @desc メイン画像クリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _mainClick(e: MouseEvent): void {
    // e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const sibling = Array.from(target.parentNode.children);
    const targetIndex = sibling.findIndex(
      element => element === e.currentTarget
    );

    if (this.currentIndex === targetIndex) {
      return;
    }

    const scroll = Math.abs(targetIndex - this.currentIndex);

    let prevFlag: boolean;
    if (this.currentIndex > targetIndex) {
      prevFlag = true;
    } else {
      prevFlag = false;
    }

    // const current = this.mainList[this.currentIndex];
    // const target = e.currentTarget;
    // const prevElemArr = Elements.prevAll(current);
    // const nextElemArr = Elements.nextAll(current);

    // if (prevElemArr.length > 0) {
    //   if (prevElemArr.indexOf(target) !== -1){
    //     prevFlag = true;
    //   }
    // }
    // if (nextElemArr.length > 0) {
    //   if (nextElemArr.indexOf(target) !== -1){
    //     prevFlag = false;
    //   }
    // }

    // コールバック処理
    if (
      this.options.mainClickChange &&
      Util.isType('function', this.options.mainClickChange)
    ) {
      this.options.mainClickChange.call(this, prevFlag, scroll);
    }
  }

  /**
   * @desc メイン画像マウスオーバーイベント処理
   * @private
   */
  _mainOver(): void {
    if (!Util.getIsTouch()) {
      this.mainOverFlag = true;
    }
    this._overAction();
  }

  /**
   * @desc メイン画像マウスアウトイベント処理
   * @private
   */
  _mainOut(): void {
    this.mainOverFlag = false;
    this._outAction();
  }

  /**
   * @desc ボタンマウスオーバーイベント処理
   * @private
   */
  _btnOver(): void {
    if (!Util.getIsTouch()) {
      this.btnOverFlag = true;
      this._overAction();
    }
  }

  /**
   * @desc ボタンマウスアウトイベント処理
   * @private
   */
  _btnOut(): void {
    this.btnOverFlag = false;
    this._outAction();
  }

  /**
   * @desc マウスオーバーイベント処理
   * @private
   */
  _overAction(): void {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;
    this.overFlag = true;
  }

  /**
   * @desc マウスアウト処理
   * @private
   */
  _outAction(): void {
    // いずれかのボタンがあればボタンとメインの両方のマウスオーバー状態をチェック
    if (
      (this.prevBtn !== null && this.prevBtn !== undefined) ||
      (this.nextBtn !== null && this.nextBtn !== undefined) ||
      (this.pauseBtn !== null && this.pauseBtn !== undefined) ||
      (this.navi !== null && this.navi !== undefined)
    ) {
      if (!this.btnOverFlag && !this.mainOverFlag) {
        this.overFlag = false;
        this._startTimer();
      }
      // メイン画像のみの場合は、直ちにタイマー再開
    } else {
      this.overFlag = false;
      this._startTimer();
    }
  }

  /**
   * @desc 自動切り替えタイマー開始
   * @private
   */
  _startTimer(): void {
    if (!this.overFlag && !this.pauseFlag) {
      if (this.timerId) clearTimeout(this.timerId);
      this.timerId = null;

      let delay;
      if (Util.isType('array', this.options.auto)) {
        delay = this.options.auto[this.currentIndex]
          ? this.options.auto[this.currentIndex]
          : this.options.auto[0];
      } else {
        delay = this.options.auto;
      }

      if (delay === 0) {
        this._onChange();
      } else {
        this.timerId = window.setTimeout(() => {
          this._onChange();
        }, delay);
      }
    }
  }

  /**
   * @desc スライドの切り替えインデックス取得
   * @param {boolean} prevFlag - PREV状態にするか否か
   * @param {number} scroll - スライドする数
   * @return {number} 切り替えインデックスを返す
   * @private
   */
  _changeIndex(prevFlag: boolean, scroll: number): number {
    let index;

    // PREV
    if (prevFlag) {
      this.prevFlag = true;
      // 切り替えループあり
      if (this.options.circular) {
        // 最初の画像から最後の画像を表示する場合
        if (
          this.currentIndex - scroll - this.slideOffsetListNum <
          this.startIndex - this.cloneNum
        ) {
          index = this.mainInitLength + (this.currentIndex - scroll);
          // 通常のPREVカウント処理
        } else {
          index = this.currentIndex - scroll;
        }
        if (index < 0) index = this.mainInitLength - 1;
        // 切り替えループなし
      } else {
        if (this.currentIndex - scroll < 0) {
          index = 0;
        } else {
          index = this.currentIndex - scroll;
        }
      }
      // NEXT
    } else {
      this.prevFlag = false;
      // 切り替えループあり
      if (this.options.circular) {
        // 最後の画像から最初の画像を表示する場合
        if (this.currentIndex + scroll > this.mainTotalLength - this.cloneNum) {
          index = this.currentIndex + scroll - this.mainInitLength;
          // 通常のNEXTカウント処理
        } else {
          index = this.currentIndex + scroll;
        }
        // 切り替えループなし
      } else {
        if (this.currentIndex + scroll > this.mainTotalLength - this.visible) {
          index = this.mainTotalLength - this.visible;
        } else {
          index = this.currentIndex + scroll;
        }
      }
    }
    return index;
  }

  /**
   * @desc スライドの切り替えインデックス設定
   * @param {boolean} prevFlag=false - PREV状態にするか否か
   * @private
   */
  _onChange(prevFlag = false): void {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;

    const index = this._changeIndex(prevFlag, this.scroll);

    if (index !== this.currentIndex) {
      // コールバック処理
      if (
        this.options.otherViSyncFlag &&
        this.options.onChange &&
        Util.isType('function', this.options.onChange)
      ) {
        this.options.onChange.call(this, prevFlag);
      }
      this._onMotion(index, this.scroll);
    }
  }

  /**
   * @desc スライドの切り替え
   * @param {number} targetIndex - ターゲットのindex
   * @param {number} scroll=this.scroll - スライドする数
   * @private
   */
  _onMotion(targetIndex: number, scroll: number = this.scroll): void {
    const targetOriginalIndex = this.getConvertOriginalIndex(targetIndex);
    // スライド前のコールバック処理
    if (
      this.options.beforeSlideContent &&
      Util.isType('function', this.options.beforeSlideContent)
    ) {
      this.options.beforeSlideContent.call(
        this,
        targetIndex,
        targetOriginalIndex
      );
    }

    // 切り替えループなし
    if (!this.options.circular) {
      // PREVボタン設定
      if (this.prevBtn !== null && this.prevBtn !== undefined) {
        this.prevBtn.setActive();
        if (targetIndex === 0) {
          this.prevBtn.deleteActive();
        }
      }
      // NEXTボタン設定
      if (this.nextBtn !== null && this.nextBtn !== undefined) {
        this.nextBtn.setActive();
        if (targetIndex === this.mainTotalLength - this.visible) {
          this.nextBtn.deleteActive();
        }
      }

      // 切り替えループあり
    } else {
      // スライダーアニメーションの場合
      if (this.options.changeType === 'slide') {
        // 最初の画像から最後の画像を表示する場合のleft値初期化
        if (
          this.currentIndex - scroll - this.slideOffsetListNum <
            this.startIndex - this.cloneNum &&
          this.prevFlag
        ) {
          Velocity(this.mainWrapper, 'stop', true);
          this.mainWrapper.style.left =
            -((targetIndex + scroll) * this.mainLiSize + this.slideOffsetX) +
            'px';

          // 最後の画像から最初の画像を表示する場合のleft値初期化
        } else if (
          this.currentIndex + scroll > this.mainTotalLength - this.cloneNum &&
          !this.prevFlag
        ) {
          Velocity(this.mainWrapper, 'stop', true);
          this.mainWrapper.style.left =
            -((targetIndex - scroll) * this.mainLiSize + this.slideOffsetX) +
            'px';
        }
      }
    }

    // フェードアニメーションタイプ'04'ではない場合、初めにカレントクラスを設定
    if (
      !(this.options.changeType === 'fade' && this.options.fadeType === '04')
    ) {
      // メイン画像リストのアクティブクラス設定
      this._setMainActive(targetIndex);
      // オリジナルのカレント画像インデックス設定
      this.currentOriginalIndex = targetOriginalIndex;

      // ナビゲーションのアクティブクラス切り替え
      if (this.navi !== null && this.navi !== undefined) {
        this.navi.setNaviActive(this.currentOriginalIndex);
      }
    }

    // スライドアニメーション
    if (this.options.changeType === 'slide') {
      const targetX = -(targetIndex * this.mainLiSize + this.slideOffsetX);
      Velocity(this.mainWrapper, 'stop', true);
      Velocity(
        this.mainWrapper,
        { left: targetX },
        {
          duration: this.options.duration,
          easing: this.options.easing,
          complete: () => {
            this._endMotion();
          }
        }
      );

      // フェードイン・フェードアウトアニメーション
    } else if (this.options.changeType === 'fade') {
      const outIndex = this.currentIndex;
      const inIndex = targetIndex;

      const outItem = this.mainList[outIndex] as HTMLElement;
      const inItem = this.mainList[inIndex] as HTMLElement;
      //フェードアニメーションのタイプ'01'の場合
      if (this.options.fadeType === '01') {
        Velocity(outItem, 'stop', true);
        outItem.style.display = 'block';
        outItem.style.opacity = '1';
        Velocity(
          this.mainList[outIndex],
          { opacity: 0 },
          {
            duration: this.options.duration,
            easing: this.options.easing,
            complete: () => {
              outItem.style.opacity = '0';
              outItem.style.display = 'none';
            }
          }
        );

        Velocity(inItem, 'stop', true);
        inItem.style.display = 'block';
        inItem.style.opacity = '0';
        Velocity(
          inItem,
          { opacity: 1 },
          {
            duration: this.options.duration,
            easing: this.options.easing,
            complete: () => {
              inItem.style.opacity = '1';
              this._endMotion();
            }
          }
        );
        // フェードアニメーションのタイプ'02'の場合
      } else if (this.options.fadeType === '02') {
        Velocity(outItem, 'stop', true);
        outItem.style.display = 'none';

        Velocity(inItem, 'stop', true);
        inItem.style.display = 'block';
        inItem.style.opacity = '0';
        Velocity(inItem, 'fadeIn', {
          duration: this.options.duration,
          easing: this.options.easing,
          complete: () => {
            inItem.style.display = 'block';
            inItem.style.opacity = '1';
            this._endMotion();
          }
        });
        // フェードアニメーションのタイプ'03'の場合
      } else if (this.options.fadeType === '03') {
        const oldItem = this.mainList[this.oldIndex] as HTMLElement;
        const currentItem = this.mainList[this.currentIndex] as HTMLElement;
        if (this.mainClone !== null && this.mainClone !== undefined) {
          // Velocity(this.mainList[this.oldIndex], 'stop', true);
          Velocity(oldItem, 'finish');
          oldItem.style.display = 'none';

          // Velocity(this.mainList[this.currentIndex], 'stop', true);
          Velocity(currentItem, 'finish');
          currentItem.style.display = 'block';
          currentItem.style.opacity = '1';
        }

        currentItem.style.position = 'static';
        this.mainClone = this.mainList[targetIndex] as HTMLElement;
        this.mainClone.style.display = 'block';
        this.mainClone.style.opacity = '0';
        this.mainClone.style.position = 'absolute';

        Velocity(
          this.mainClone,
          { opacity: 1 },
          {
            duration: this.options.duration,
            easing: this.options.easing,
            complete: () => {
              this._endMotion();
            }
          }
        );
        // フェードアニメーションのタイプ'04'の場合
      } else {
        Velocity(inItem, 'stop', true);
        inItem.style.display = '';
        inItem.style.opacity = '0';

        Velocity(outItem, 'stop', true);
        outItem.style.display = '';
        outItem.style.opacity = '1';

        Velocity(
          outItem,
          { opacity: 0 },
          {
            duration: this.options.duration,
            easing: this.options.easing,
            complete: () => {
              outItem.style.opacity = '';
              outItem.style.display = 'none';
              // メインリストのアクティブクラス設定
              this._setMainActive(inIndex);

              const targetNavIndex = this.getConvertOriginalIndex(inIndex);
              // オリジナルのカレント画像インデックス設定
              this.currentOriginalIndex = targetNavIndex;

              // ナビゲーションのアクティブクラス切り替え
              if (this.navi !== null && this.navi !== undefined) {
                this.navi.setNaviActive(this.currentOriginalIndex);
              }

              Velocity(
                inItem,
                { opacity: 1 },
                {
                  duration: this.options.duration,
                  easing: this.options.easing,
                  complete: () => {
                    inItem.style.display = '';
                    inItem.style.opacity = '';
                    this._endMotion();
                  }
                }
              );
            }
          }
        );
      }
      // changeTypeが'slide'、'fade'に当てはまらない場合
    } else {
      const currentItem = this.mainList[this.currentIndex] as HTMLElement;
      const targetItem = this.mainList[targetIndex] as HTMLElement;
      currentItem.style.display = 'none';
      targetItem.style.display = '';
    }
    // カレント設定
    this.oldIndex = this.currentIndex;
    this.currentIndex = targetIndex;
  }

  /**
   * @desc スライド後の処理
   * @private
   */
  _endMotion(): void {
    // フェードアニメーションのタイプ'03'の場合
    if (this.options.changeType === 'fade' && this.options.fadeType === '03') {
      const oldItem = this.mainList[this.oldIndex] as HTMLElement;
      const currentItem = this.mainList[this.currentIndex] as HTMLElement;
      oldItem.style.display = 'none';
      oldItem.style.position = '';
      currentItem.style.display = '';
      currentItem.style.opacity = '';
      currentItem.style.position = '';
      this.mainClone = null;
    }
    // スライド後のコールバック処理
    if (
      this.options.endSlideContent &&
      Util.isType('function', this.options.endSlideContent)
    ) {
      const targetOriginalIndex = this.getConvertOriginalIndex(
        this.currentIndex
      );
      this.options.endSlideContent.call(
        this,
        this.currentIndex,
        targetOriginalIndex
      );
    }
    // 切り替えループありの場合はタイマー開始
    if (this.options.auto !== null && this.options.auto !== undefined) {
      this._startTimer();
    }
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * @desc メインのターゲットインデックスを、クローン分をカウントしないオリジナルのインデックスに変換した値を取得
   * @param {number} mainIndex - メインのターゲットインデックス
   * @return {number} オリジナルのインデックスを返す
   * @public
   */
  getConvertOriginalIndex(mainIndex: number): number {
    let originalCurrentIndex = mainIndex;
    if (this.options.circular && this.options.changeType === 'slide') {
      if (mainIndex < this.cloneNum) {
        originalCurrentIndex = mainIndex + this.mainInitLength - this.cloneNum;
      } else if (mainIndex >= this.mainInitLength + this.cloneNum) {
        originalCurrentIndex = mainIndex - this.mainInitLength - this.cloneNum;
      } else {
        originalCurrentIndex = mainIndex - this.cloneNum;
      }
    }
    return originalCurrentIndex;
  }

  /**
   * @desc スライドの切り替え(メインエリアからの呼び出し)
   * @param {boolean} prevFlag - PREV状態にするか否か
   * @param {number} scroll - スライドする数
   * @public
   */
  changeSlideFromMain(prevFlag: boolean, scroll: number): void {
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;

    const index = this._changeIndex(prevFlag, scroll);
    this._onMotion(index, scroll);
  }

  /**
   * @desc スライドの切り替え(ナビからの呼び出し)
   * @param {number} targetOriginalIndex - 切り替えターゲットのオリジナルインデックス（クローン分をカウントしない）
   * @public
   */
  changeSlideFromNavi(targetOriginalIndex: number): void {
    if (this.currentOriginalIndex === targetOriginalIndex) {
      return;
    }
    if (this.timerId) clearTimeout(this.timerId);
    this.timerId = null;

    // 切り替えループありのスライダーの場合
    if (this.options.circular && this.options.changeType === 'slide') {
      targetOriginalIndex += this.cloneNum;
    }

    this._onMotion(targetOriginalIndex);
  }

  /**
   * @desc ViChangerの機能をオフ
   * @public
   */
  destroy(): void {
    this._unbindEvents();
  }
}
