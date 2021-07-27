/**
 * VichangerPauseBtnクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import VichangerBaseBtn from '@src/assets/ts/module/vichanger/cnt.vichangerBaseBtn';
import Elements from '@src/assets/ts/core/Elements';
import { ViChangerInterface } from '@src/assets/ts/module/vichanger/cnt.vichangerInterface';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * ViChangerクラスで使用する一時停止ボタン
 * @extends {VichangerBaseBtn}
 * @version 1.0.0
 */
export default class VichangerPauseBtn extends VichangerBaseBtn {
  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * VichangerPauseBtnのインスタンスを作成
   * @param {ViChanger} controlClass - 制御クラス
   * @param {HTMLElement} btn - ボタン要素
   */
  constructor(controlClass: ViChangerInterface, btn: HTMLElement) {
    super(controlClass, btn);

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
    super._init();
  }

  /**
   * トリガークリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _triggerClick(e: MouseEvent): void {
    super._triggerClick(e);
    this.control.emit('pause:click', [this]);
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * アクティブ状態に設定
   * @public
   */
  setActive(): void {
    Elements.addClass(this.btn, this.options.pauseActiveClassName);
  }

  /**
   * アクティブ状態を解除
   * @public
   */
  deleteActive(): void {
    Elements.removeClass(this.btn, this.options.pauseActiveClassName);
  }

  /**
   * アクティブ状態を取得
   * @return {boolean} アクティブ状態か否かのフラグを返す
   * @public
   */
  isActive(): boolean {
    if (Elements.hasClass(this.btn, this.options.pauseActiveClassName)) {
      return true;
    } else {
      return false;
    }
  }
}
