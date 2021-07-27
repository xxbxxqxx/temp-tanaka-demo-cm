/**
 * LocalScrollクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import Elements from '@src/assets/ts/core/Elements';
import Util from '@src/assets/ts/core/Util';
import Velocity from 'velocity-animate';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * ローカルスクロール機能（バックアップ）
 * @version 1.0.0
 */

interface Options {
  scrollTrigger?: string | HTMLCollection;
  offset: number;
  duration: number;
  easing: string;
  endScroll?: (target: HTMLElement[]) => void | null;
}

export default class LocalScroll {
  //-------------------------------------------------
  // Parameters
  //-------------------------------------------------
  element: HTMLElement;
  selector: string;
  options: Options;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc LocalScrollのインスタンスを作成
   * @param {HTMLElement} element - 対象要素
   * @param {Object} options - LocalScroll初期化オプション
   * @param {string|HTMLCollection} options.scrollTrigger - スクロールのトリガーセレクタ
   * @param {number} options.offset=0 - 目的のエリアへスクロールする際に調整するトップのオフセット値
   * @param {number} options.duration='800' - アニメーション時間をミリ秒単位で指定
   * @param {string} options.easing='swing' - 切り替えアニメーションのeasing設定（'swing' or 'linear'）
   * @param {?function} options.endScroll=null - スクロール後の処理
   */
  constructor(element: HTMLElement, options: Options) {
    if (!element) return;

    const defaultOptions = {
      scrollTrigger: 'a[href^="#"]',
      offset: 0, // 目的のエリアへスクロールする際に調整するトップのオフセット値 (デフォルト: 0)
      duration: 800, // duraiton (デフォルト: 800)
      easing: 'swing', // easing (デフォルト： 'swing')
      endScroll: null // スクロール後の処理
    };

    /**
     * LocalScrollオプション
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
    const scrollTriggerWrapper = this.element;
    const scrollTriggers = Util.isType('string', this.options.scrollTrigger)
      ? Elements.find(
          scrollTriggerWrapper,
          this.options.scrollTrigger as string
        )
      : (this.options.scrollTrigger as HTMLCollection);

    Array.from(scrollTriggers).forEach(trigger => {
      // タブトリガークリックイベント
      trigger.addEventListener(
        'click',
        e => {
          e.preventDefault();

          const targetTrigger = e.currentTarget as HTMLElement;
          const href = targetTrigger.getAttribute('href');
          const targetId = href.slice(href.indexOf('#') + 1);
          const targetContent = document.getElementById(targetId);

          Velocity(targetContent, 'scroll', {
            offset: this.options.offset,
            duration: this.options.duration,
            easing: this.options.easing,
            complete: this.options.endScroll
          });
        },
        false
      );
    });
  }
}
