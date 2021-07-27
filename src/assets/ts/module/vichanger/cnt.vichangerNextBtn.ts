/**
 * VichangerNextBtnクラス
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
 * ViChangerクラスで使用するNEXTボタン
 * @extends {VichangerBaseBtn}
 * @version 1.0.0
 */
export default class VichangerNextBtn extends VichangerBaseBtn {
  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * VichangerNextBtnのインスタンスを作成
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
    // 切り替えループなしのNEXTボタン初期設定
    if (
      !this.options.circular &&
      this.control.currentIndex ===
        this.control.mainTotalLength - this.control.cloneNum
    ) {
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
    this.control.emit('next:click', [this]);
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
