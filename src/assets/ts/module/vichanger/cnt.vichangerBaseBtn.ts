/**
 * ViChangerBaseBtnクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import {
  Options,
  ViChangerInterface
} from '@src/assets/ts/module/vichanger/cnt.vichangerInterface';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * ViChangerクラスで使用するボタンの基底クラス
 * @version 1.0.0
 */
export default class VichangerBaseBtn {
  //-------------------------------------------------
  // Properties
  //-------------------------------------------------
  btn: HTMLElement;
  options: Options;
  control: ViChangerInterface;
  vichangerListeners: {
    triggerOver: () => void | null;
    triggerOut: () => void | null;
    triggerClick: () => void | null;
  } | null;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * VichangerBaseBtnのインスタンスを作成
   * @param {ViChanger} controlClass - 制御クラス
   * @param {HTMLElement} btn - ボタン要素
   */
  constructor(controlClass: ViChangerInterface, btn: HTMLElement) {
    /**
     * 対象のボタン要素
     * @type {HTMLElement}
     * @protected
     */
    this.btn = btn;
    /**
     * 制御クラス
     * @type {ViChanger}
     * @protected
     */
    this.control = controlClass;
    /**
     * ViChangerオプション
     * @type {Object}
     * @protected
     */
    this.options = this.control.options;
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
  }

  /**
   * イベントのバインド登録
   * @private
   */
  _bindEvents(): void {
    this.vichangerListeners.triggerClick = this._triggerClick.bind(this);
    this.btn.addEventListener(
      'click',
      this.vichangerListeners.triggerClick,
      false
    );

    // 自動切り替えあり & マウスオーバーアクションによるタイマー停止処理ありの場合はマウスオーバー処理の登録
    if (
      this.options.auto !== null &&
      this.options.auto !== undefined &&
      this.options.hoverTimerStop
    ) {
      this.vichangerListeners.triggerOver = this._triggerOver.bind(this);
      this.btn.addEventListener(
        'mouseover',
        this.vichangerListeners.triggerOver,
        false
      );

      this.vichangerListeners.triggerOut = this._triggerOut.bind(this);
      this.btn.addEventListener(
        'mouseout',
        this.vichangerListeners.triggerOut,
        false
      );
    }
  }

  /**
   * イベントのバインド解除
   * @private
   */
  _unbindEvents(): void {
    this.btn.removeEventListener('click', this.vichangerListeners.triggerClick);
    this.btn.removeEventListener(
      'mouseover',
      this.vichangerListeners.triggerOver
    );
    this.btn.removeEventListener(
      'mouseout',
      this.vichangerListeners.triggerOut
    );
  }

  /**
   * トリガークリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _triggerClick(e: MouseEvent): void {
    e.preventDefault();
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
}
