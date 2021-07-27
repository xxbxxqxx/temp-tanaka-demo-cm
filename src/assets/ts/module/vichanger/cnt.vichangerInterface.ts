/**
 * ViChanger Interface
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import { EventEmitter } from 'events';

//-------------------------------------------------
// options
//-------------------------------------------------
export interface Options {
  mainViewAreaSelector: string;
  mainWrapperSelector: string;
  naviWrapperSelector?: string | null;
  prevBtnSelector?: string | null;
  nextBtnSelector?: string | null;
  pauseBtnSelector?: string | null;
  changeType: string;
  fadeType: string;
  naviTriggerEvent: string;
  naviActiveClassName: string | null;
  mainActiveClassName?: string | null;
  pauseActiveClassName: string;
  btnDisabledClassName: string;
  duration: number;
  easing: string;
  auto?: number | number[];
  circular: boolean;
  startIndex: number;
  hoverTimerStop: boolean;
  swipeFlag: boolean;
  visible: number;
  scroll: number;
  centerMode: boolean;
  otherViSyncFlag: boolean;
  liquidLayoutFlag: boolean;
  responsive?:
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
  accessibilityFlag: boolean;
  onChange?: () => void | null;
  mainClickChange?: () => void | null;
  naviClickChange?: () => void | null;
  beforeSlideContent?: () => void | null;
  endSlideContent?: () => void | null;
}

export interface ViChangerInterface extends EventEmitter {
  //-------------------------------------------------
  // Properties
  //-------------------------------------------------
  options: Options;
  mainInitLength: number;
  mainTotalLength: number;
  currentIndex: number;
  cloneNum: number;

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  /**
   * @desc メインのターゲットインデックスを、クローン分をカウントしないオリジナルのインデックスに変換した値を取得
   * @param {number} mainIndex - メインのターゲットインデックス
   * @return {number} オリジナルのインデックスを返す
   * @public
   */
  getConvertOriginalIndex: (mainIndex: number) => number;

  /**
   * @desc スライドの切り替え(メインエリアからの呼び出し)
   * @param {boolean} prevFlag - PREV状態にするか否か
   * @param {number} scroll - スライドする数
   * @public
   */
  changeSlideFromMain: (prevFlag: boolean, scroll: number) => void;

  /**
   * @desc スライドの切り替え(ナビからの呼び出し)
   * @param {number} targetOriginalIndex - 切り替えターゲットのオリジナルインデックス（クローン分をカウントしない）
   * @public
   */
  changeSlideFromNavi: (targetOriginalIndex: number) => void;

  /**
   * @desc ViChangerの機能をオフ
   * @public
   */
  destroy: () => void;
}
