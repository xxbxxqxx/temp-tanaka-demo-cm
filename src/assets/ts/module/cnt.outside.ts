/**
 * Outsideクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import Elements from '@src/assets/ts/core/Elements';
import Util from '@src/assets/ts/core/Util';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * 通知エリア機能
 * @version 1.0.0
 */

interface Options {
  closeSelector: string;
  contentTransitionClass: string;
  contentTransitionEndClass: string;
  contentNoTransitionClass: string;
  transitionType: string;
  accessibilityFlag: boolean;
  beforeClose?: () => void;
  endClose?: () => void;
}

interface EventListeners {
  closeBtnClick: [string, Element, () => void];
  transitionEnd: [string, Element, () => void];
}
export default class Outside {
  //-------------------------------------------------
  // Parameter
  //-------------------------------------------------
  element: HTMLElement;
  options: {
    closeSelector: string;
    contentTransitionClass: string;
    contentTransitionEndClass: string;
    contentNoTransitionClass: string;
    transitionType: string;
    accessibilityFlag: boolean;
    beforeClose: () => void;
    endClose: () => void;
  };
  closeBtn: Element;
  eventListeners: EventListeners;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc Outsideのインスタンスを作成
   * @param {HTMLElement} element - 対象要素
   * @param {Object} options - Outside初期化オプション
   * @param {string} options.closeSelector='[data-js-outside-close]' - 閉じるアクションを付与するオブジェクトのセレクタ名
   * @param {string} options.contentTransitionClass='content_close' - コンテンツにCSSアニメーションを適用するクラス
   * @param {string} options.contentTransitionEndClass='content_closed' - コンテンツのCSSアニメーション後に適用するクラス
   * @param {string} options.contentNoTransitionClass='content_notransition' - コンテンツのCSSアニメーションをオフにするクラス
   * @param {string} options.transitionType='slide' - トランジションタイプ（'slide' or 'none'）
   * @param {boolean} options.accessibilityFlag=false - アクセシビリティ対応するか否か
   * @param {?function} options.beforeClose=null - 閉じる前の処理
   * @param {?function} options.endClose=null - 閉じた後の処理
   */
  constructor(element: HTMLElement, options: Options) {
    if (!element) return;

    const defaultOptions = {
      closeSelector: '[data-js-outside-close]',
      contentTransitionClass: 'content_close',
      contentTransitionEndClass: 'content_closed',
      contentNoTransitionClass: 'content_notransition',
      transitionType: 'slide',
      accessibilityFlag: false,
      beforeClose: null,
      endClose: null
    };

    /**
     * Outsideオプション
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
     * 閉じるボタン要素
     * @type {HTMLElement}
     * @protected
     */
    this.closeBtn = this.element.querySelector(this.options.closeSelector);

    /**
     * イベントリスナーを格納したオブジェクト
     * @type {Object}
     * @protected
     */
    this.eventListeners = {} as EventListeners;

    this._init();
  }

  //-------------------------------------------------
  // Private Methods
  //-------------------------------------------------
  /**
   * @desc 初期化
   * @private
   */
  private _init(): void {
    const FirstChild = this.element.firstElementChild as HTMLElement;
    const height = FirstChild.offsetHeight;
    this.element.style.height = height + 'px';
    // アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      Elements.attr(this.element, 'aria-hidden', 'false');
    }

    this._bindEvents();
  }

  /**
   * @desc イベントのバインド登録
   * @private
   */
  private _bindEvents(): void {
    this.eventListeners = {
      // button eventListeners
      closeBtnClick: ['click', this.closeBtn, this._closeBtnClick.bind(this)],
      // content eventListeners
      transitionEnd: [
        'transitionend',
        this.element,
        this._transitionEnd.bind(this)
      ]
    };

    for (const key in this.eventListeners) {
      if (Object.prototype.hasOwnProperty.call(this.eventListeners, key)) {
        const listener = this.eventListeners[key];
        listener[1].addEventListener(listener[0], listener[2]);
      }
    }
  }

  /**
   * @desc イベントのバインド解除
   * @private
   */
  private _unbindEvents(): void {
    for (const key in this.eventListeners) {
      if (Object.prototype.hasOwnProperty.call(this.eventListeners, key)) {
        const listener = this.eventListeners[key];
        listener[1].removeEventListener(listener[0], listener[2]);
      }
    }
  }

  /**
   * @desc 閉じるボタンクリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  private _closeBtnClick(e: MouseEvent): void {
    e.preventDefault();
    this._close(this.options.transitionType);
  }

  /**
   * @desc transitionEndイベント処理
   * @param {Object} e - イベント
   * @private
   */
  private _transitionEnd(e: TransitionEvent): void {
    if (e.target === e.currentTarget && e.propertyName === 'height') {
      this._closed();
    }
  }

  /**
   * @desc 閉じる時の処理
   * @param {string} transitionType='slide' - トランジションタイプ（'slide' or 'none'）
   * @private
   */
  private _close(transitionType = 'slide'): void {
    if (
      this.options.beforeClose &&
      Util.isType('function', this.options.beforeClose)
    ) {
      this.options.beforeClose.call(this);
    }

    Elements.addClass(this.element, this.options.contentTransitionClass);

    if (transitionType === 'none') {
      Elements.addClass(this.element, this.options.contentNoTransitionClass);
    } else {
      Elements.removeClass(this.element, this.options.contentNoTransitionClass);
    }
    this.element.style.height = '0';

    // アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      Elements.attr(this.element, 'aria-hidden', 'true');
    }

    if (transitionType === 'none') this._closed();
  }

  /**
   * @desc 閉じた後の処理
   * @private
   */
  private _closed(): void {
    Elements.addClass(this.element, this.options.contentTransitionEndClass);

    if (
      this.options.endClose &&
      Util.isType('function', this.options.endClose)
    ) {
      this.options.endClose.call(this);
    }
  }
}
