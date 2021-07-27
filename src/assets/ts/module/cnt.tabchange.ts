/**
 * Tabchangeクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import Elements from '@src/assets/ts/core/Elements';
import Util from '@src/assets/ts/core/Util';

interface Options {
  tabTrigger: string;
  tabContent: string;
  triggerActiveClass: string;
  cntentActiveClass: string;
  accessibilityFlag: boolean;
  beforeChange?: () => void | null;
  endChange?: () => void | null;
}

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * タブ切り替え機能
 * @version 1.0.0
 */
export default class Tabchange {
  element: HTMLElement;
  options: Options;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc Tabchangeのインスタンスを作成
   * @param {HTMLElement} element - 対象要素
   * @param {Options} options - Tabchange初期化オプション
   * @param {string|HTMLElement} options.tabTrigger - タブトリガーセレクタ、またはその要素
   * @param {string|HTMLElement} options.tabContent - タブコンテンツセレクタ、またはその要素
   * @param {string} options.triggerActiveClass='is-active' - トリガーのアクティブ時に付与するクラス
   * @param {string} options.contentActiveClass='is-open' - コンテンツのアクティブ時に付与するクラス
   * @param {boolean} options.accessibilityFlag=false - アクセシビリティ対応するか否か
   * @param {?function} options.beforeChange=null - タブ切り替え前の処理
   * @param {?function} options.endChange=null - タブ切り替え後の処理
   */
  constructor(element: HTMLElement, options: Options) {
    if (!element) return;

    const defaultOptions = {
      tabTrigger: '', // タブトリガーセレクタ
      tabContent: '', // タブ切り替え対象コンテンツセレクタ
      triggerActiveClass: 'current', // タブトリガーのアクティブ時クラス名
      cntentActiveClass: 'opened', // タブコンテンツのアクティブ時クラス名
      accessibilityFlag: false, // アクセシビリティ対応するか否か
      beforeChange: null, // タブ切り替え前の処理
      endChange: null // タブ切り替え後の処理
    };
    /**
     * Tabchangeオプション
     * @type {Options}
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
  private _init() {
    const tabAreaWrapper = this.element;
    const tabTriggers = Util.isType('string', this.options.tabTrigger)
      ? Elements.find(tabAreaWrapper, this.options.tabTrigger)
      : this.options.tabTrigger;
    const tabContents = Util.isType('string', this.options.tabContent)
      ? Elements.find(tabAreaWrapper, this.options.tabContent)
      : this.options.tabContent;

    Array.from(tabTriggers as NodeList).forEach((trigger: Node) => {
      // タブトリガークリックイベント
      trigger.addEventListener(
        'click',
        e => {
          e.preventDefault();

          const targetTrigger = e.currentTarget as HTMLLinkElement;
          const href = targetTrigger.getAttribute('href');
          const targetId = href.slice(href.indexOf('#') + 1);
          const targetContent = document.getElementById(targetId);

          if (
            this.options.beforeChange &&
            Util.isType('function', this.options.beforeChange)
          ) {
            this.options.beforeChange.call(this);
          }

          Elements.removeClass(
            tabTriggers as NodeList,
            this.options.triggerActiveClass
          );
          Elements.addClass(targetTrigger, this.options.triggerActiveClass);
          Elements.removeClass(
            tabContents as NodeList,
            this.options.cntentActiveClass
          );
          Elements.addClass(targetContent, this.options.cntentActiveClass);

          // アクセシビリティ対応
          if (this.options.accessibilityFlag) {
            Elements.attr(tabTriggers as NodeList, 'aria-selected', 'false');
            Elements.attr(targetTrigger, 'aria-selected', 'true');
            Elements.attr(tabContents as NodeList, 'aria-hidden', 'true');
            Elements.attr(targetContent, 'aria-hidden', 'false');
          }

          if (
            this.options.endChange &&
            Util.isType('function', this.options.endChange)
          ) {
            this.options.endChange.call(this);
          }
        },
        false
      );

      // カレント設定
      if (
        Elements.hasClass(
          trigger as HTMLElement,
          this.options.triggerActiveClass
        )
      ) {
        const evt = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        trigger.dispatchEvent(evt);
      }
    });
  }
}
