/**
 * ViChangerNaviクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import Elements from '@src/assets/ts/core/Elements';
import {
  Options,
  ViChangerInterface
} from '@src/assets/ts/module/vichanger/cnt.vichangerInterface';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * ViChangerクラスで使用するナビゲーション
 * @version 1.0.0
 */
export default class ViChangerNavi {
  //-------------------------------------------------
  // Properties
  //-------------------------------------------------
  btn: HTMLElement;
  options: Options;
  control: ViChangerInterface;
  naviWrapper: HTMLElement;
  naviList: Array<HTMLElement>;
  maxIndex: number;
  naviCurrentIndex: number;
  vichangerListeners: {
    triggerOver: () => void | null;
    triggerOut: () => void | null;
    triggerClick: () => void | null;
  } | null;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * ViChangerNaviのインスタンスを作成
   * @param {ViChanger} controlClass - 制御クラス
   * @param {HTMLElement} naviWrapper - ナビのラッパー要素
   */
  constructor(controlClass: ViChangerInterface, naviWrapper: HTMLElement) {
    /**
     * 制御クラス
     * @type {ViChanger}
     * @protected
     */
    this.control = controlClass;
    /**
     * 対象のナビ要素
     * @type {HTMLElement}
     * @protected
     */
    this.naviWrapper = naviWrapper;
    /**
     * 対象のナビリスト要素
     * @type {HTMLElement}
     * @protected
     */
    this.naviList = [];
    const children = this.naviWrapper.children;
    for (let i = 0; i < children.length; i++) {
      const htmlEl = children[i] as HTMLElement;
      this.naviList.push(htmlEl);
    }
    /**
     * ViChangerオプション
     * @type {Object}
     * @protected
     */
    this.options = this.control.options;
    /**
     * 最後のナビインデックス
     * @type {number}
     * @protected
     */
    this.maxIndex = this.control.mainInitLength - 1;
    /**
     * カレントナビインデックス
     * @type {number}
     * @protected
     */
    this.naviCurrentIndex = null;
    /**
     * イベントリスナーを格納したオブジェクト
     * @type {Object}
     * @protected
     */
    this.vichangerListeners = {
      triggerOver: null,
      triggerOut: null,
      triggerClick: null
    };

    this._init();
  }

  //-------------------------------------------------
  // Private Methods
  //-------------------------------------------------
  /**
   * 初期化
   * @private
   */
  _init(): void {
    this._bindEvents();
    const targetNavIndex = this.control.getConvertOriginalIndex(
      this.control.currentIndex
    );
    this.setNaviActive(targetNavIndex);
  }

  /**
   * イベントのバインド登録
   * @private
   */
  _bindEvents(): void {
    if (
      this.options.naviTriggerEvent === 'click' ||
      this.options.naviTriggerEvent === 'mouseover'
    ) {
      this.vichangerListeners.triggerClick = this._triggerClick.bind(this);
      this.vichangerListeners.triggerOver = this._triggerOver.bind(this);
      this.vichangerListeners.triggerOut = this._triggerOut.bind(this);

      this.naviList.forEach(list => {
        let trigger = list.querySelector('a') as HTMLElement;
        if (!trigger) trigger = list;
        trigger.addEventListener(
          this.options.naviTriggerEvent,
          this.vichangerListeners.triggerClick,
          false
        );

        // 自動切り替えあり & マウスオーバーアクションによるタイマー停止処理ありの場合はマウスオーバー処理の登録
        if (
          this.options.naviTriggerEvent === 'click' &&
          this.options.auto !== null &&
          this.options.auto !== undefined &&
          this.options.hoverTimerStop
        ) {
          trigger.addEventListener(
            'mouseover',
            this.vichangerListeners.triggerOver,
            false
          );
          trigger.addEventListener(
            'mouseout',
            this.vichangerListeners.triggerOut,
            false
          );
        }
      });
    }
  }

  /**
   * イベントのバインド解除
   * @private
   */
  _unbindEvents(): void {
    if (
      this.options.naviTriggerEvent === 'click' ||
      this.options.naviTriggerEvent === 'mouseover'
    ) {
      Array.from(this.naviList).forEach((list: HTMLElement) => {
        let trigger = list.querySelector('a') as HTMLElement;
        if (!trigger) trigger = list;
        trigger.removeEventListener(
          this.options.naviTriggerEvent,
          this.vichangerListeners.triggerClick
        );
        trigger.removeEventListener(
          'mouseover',
          this.vichangerListeners.triggerOver
        );
        trigger.removeEventListener(
          'mouseout',
          this.vichangerListeners.triggerOut
        );
      });
    }
  }

  /**
   * トリガークリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _triggerClick(e: MouseEvent): void {
    e.preventDefault();
    const targetElement = e.currentTarget as HTMLElement;
    const targetIndex = Number(targetElement.textContent) - 1;
    if (this.naviCurrentIndex === targetIndex) {
      return;
    }
    this.control.emit('navi:click', [this, targetIndex]);
  }

  /**
   * トリガーマウスオーバーイベント処理
   * @private
   */
  _triggerOver(): void {
    this.control.emit('btn:over');
  }

  /**
   * トリガーマウスアウトイベント処理
   * @private
   */
  _triggerOut(): void {
    this.control.emit('btn:out');
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * ナビゲーションカレント設定
   * @param {number} targetIndex - ターゲットのインデックス
   * @public
   */
  setNaviActive(targetIndex: number): void {
    this.naviCurrentIndex = targetIndex;
    Array.from(this.naviList).forEach((list: HTMLElement, index: number) => {
      //ナビゲーションカレント表示設定
      if (this.naviCurrentIndex === index) {
        this.naviList.forEach(el => {
          Elements.removeClass(el, this.options.naviActiveClassName);
        });
        Elements.addClass(list, this.options.naviActiveClassName);

        // アクセシビリティ対応
        if (this.options.accessibilityFlag) {
          Elements.attr(list, 'aria-selected', 'false');
          Elements.attr(list, 'aria-selected', 'true');
        }
      }
    });
  }
}
