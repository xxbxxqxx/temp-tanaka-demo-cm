/**
 * VichangerPrevBtnクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import VichangerBaseBtn from '@src/assets/ts/module/vichanger/cnt.vichangerBaseBtn';
import { ViChangerInterface } from '@src/assets/ts/module/vichanger/cnt.vichangerInterface';
import Elements from '@src/assets/ts/core/Elements';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * ViChangerクラスで使用するPREVボタン
 * @extends {VichangerBaseBtn}
 * @version 1.0.0
 */
export default class VichangerPrevBtn extends VichangerBaseBtn {
  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * VichangerPrevBtnのインスタンスを作成
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
    //切り替えループなしのPREVボタン初期設定
    if (!this.options.circular && this.control.currentIndex === 0) {
      this.deleteActive();
    }
  }

  /**
   * トリガークリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  _triggerClick(e: MouseEvent): void {
    super._triggerClick(e);
    this.control.emit('prev:click', [this]);
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * アクティブ状態に設定
   * @public
   */
  setActive(): void {
    Elements.removeClass(this.btn, this.options.btnDisabledClassName);
  }

  /**
   * アクティブ状態を解除
   * @public
   */
  deleteActive(): void {
    Elements.addClass(this.btn, this.options.btnDisabledClassName);
  }
}
