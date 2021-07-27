/**
 * HamburgerMenuクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import { EventEmitter } from 'events';
import Elements from '@src/assets/ts/core/Elements';
import Velocity from 'velocity-animate';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * ハンバーガーメニュー機能
 * @extends {EventEmitter}
 * @version 1.0.0
 */

interface Options {
  hamburgerSwitchSelectorName: string;
  hamburgerTriggerSelectorName: string;
  hamburgerContentSelectorName: string;
  hamburgerCategorySelectorName: string;
  hamburgerOverlaySelectorName?: string | null;
  dataAttrHamburgerArea: string;
  dataAttrHamburgerTrigger: string;
  dataAttrHamburgerContent: string;
  dataAttrHamburgerCategory: string;
  changeType: string;
  dataAttrFixedHtml: string;
  dataAttrFixedBody: string;
  duration: string | number;
  easing: string;
  triggerClass: { opened: string; closed: string };
  defaultStatus: string;
  accessibilityFlag: boolean;
  beforeOpen?: () => void | null;
  endOpen?: () => void | null;
  beforeClose?: () => void | null;
  endClose?: () => void | null;
}

interface EventListeners {
  triggerClick: (this: HamburgerMenu) => void | null;
  overlayClick: (this: HamburgerMenu) => void | null;
}

export default class HamburgerMenu extends EventEmitter {
  //-------------------------------------------------
  // Parameters
  //-------------------------------------------------
  options: Options;
  element: HTMLElement;
  html: HTMLElement;
  body: HTMLElement;
  triggerElms: HTMLElement[];
  content: HTMLElement;
  contentInner: HTMLElement;
  categoryElms: HTMLElement[];
  overlay: HTMLElement;
  currentCategory: string;
  currentHeight: number;
  eventListeners: EventListeners;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc HamburgerMenuのインスタンスを作成
   * @param {HTMLElement} element - 対象要素
   * @param {Object} options - HamburgerMenu初期化オプション
   * @param {string} options.switchSelector='[data-js-hamburger-switch]' - ハンバーガーメニュートリガースイッチエリアのセレクタ
   * @param {string} options.triggerSelector='[data-js-hamburger-trigger]' - ハンバーガーメニュートリガーのセレクタ
   * @param {string} options.contentSelector='[data-js-hamburger-content]' - ハンバーガーメニューコンテンツのセレクタ
   * @param {string} options.categorySelector='[data-js-hamburger-category]' - ハンバーガーメニューコンテンツのカテゴリセレクタ
   * @param {?string} [options.overlaySelector=null] - ハンバーガーメニューオーバーレイのセレクタ（オーバーレイで閉じる場合に指定）
   * @param {string} options.dataAttrArea='data-js-hamburger' - ハンバーガーメニューエリアのdata属性
   * @param {string} options.dataAttrTrigger='data-js-hamburger-trigger' - ハンバーガーメニュートリガーのdata属性
   * @param {string} options.dataAttrContent='data-js-hamburger-content' - ハンバーガーメニューコンテンツのdata属性
   * @param {string} options.dataAttrCategory='data-js-hamburger-category' - ハンバーガーメニューコンテンツのカテゴリのdata属性
   * @param {string} options.changeType='slide' - 切り替えタイプ（'slide' or 'fade' or 'none'）
   * @param {string} options.dataAttrFixedHtml='data-js-fixed-html' - fixed表示を行うためにhtmlタグに付与するdata属性（changeTypeがfadeの場合に有効）
   * @param {string} options.dataAttrFixedBody='data-js-fixed-body' - fixed表示を行うためにbodyタグに付与するdata属性（changeTypeがfadeの場合に有効）
   * @param {number} options.duration='400' - アニメーション時間をミリ秒単位で指定
   * @param {string} options.easing='swing' - 切り替えアニメーションのeasing設定（'swing' or 'linear'）
   * @param {object} options.triggerClass - トリガーに付与するクラス名を格納したオブジェクト
   * @param {string} options.triggerClass.opened='is-active' - トリガーに付与するOPEN時のクラス名
   * @param {string} options.triggerClass.closed='' - トリガーに付与するCLOSE時のクラス名
   * @param {string} options.defaultStatus='' - デフォルトの開閉状態を指定（'' or 'closed'）
   * @param {boolean} options.accessibilityFlag=false - アクセシビリティ対応するか否か
   * @param {?function} options.beforeOpen=null - 開く前の処理
   * @param {?function} options.endOpen=null - 開いた後の処理
   * @param {?function} options.beforeClose=null - 閉じる前の処理
   * @param {?function} options.endClose=null - 閉じた後の処理
   */
  constructor(element: HTMLElement, options: Options) {
    super();

    if (!element) return;

    const defaultOptions: Options = {
      hamburgerSwitchSelectorName: '[data-js-hamburger-switch]',
      hamburgerTriggerSelectorName: '[data-js-hamburger-trigger]',
      hamburgerContentSelectorName: '[data-js-hamburger-content]',
      hamburgerCategorySelectorName: '[data-js-hamburger-category]',
      hamburgerOverlaySelectorName: '[data-js-hamburger-overlay]',
      dataAttrHamburgerArea: 'data-js-hamburger',
      dataAttrHamburgerTrigger: 'data-js-hamburger-trigger',
      dataAttrHamburgerContent: 'data-js-hamburger-content',
      dataAttrHamburgerCategory: 'data-js-hamburger-category',
      changeType: 'slide',
      dataAttrFixedHtml: 'data-js-fixed-html',
      dataAttrFixedBody: 'data-js-fixed-body',
      duration: 'normal',
      easing: 'swing',
      triggerClass: { opened: 'is-active', closed: '' },
      defaultStatus: '',
      accessibilityFlag: false,
      beforeOpen: null,
      endOpen: null,
      beforeClose: null,
      endClose: null
    };

    /**
     * HamburgerMenuオプション
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
     * html要素
     * @type {HTMLElement}
     * @protected
     */
    this.html = document.querySelector('html');

    /**
     * body要素
     * @type {HTMLElement}
     * @protected
     */
    this.body = document.querySelector('body');

    /**
     * トリガー要素
     * @type {Array<HTMLElement>}
     * @protected
     */
    this.triggerElms = Array.from(
      this.element.querySelectorAll(this.options.hamburgerTriggerSelectorName)
    );

    /**
     * コンテンツ要素
     * @type {HTMLElement}
     * @protected
     */
    this.content = this.element.querySelector(
      this.options.hamburgerContentSelectorName
    );

    /**
     * コンテンツインナー要素
     * @type {HTMLElement}
     * @protected
     */
    this.contentInner = this.content.children[0] as HTMLElement;

    /**
     * カテゴリが付与された要素
     * @type {Array<HTMLElement>}
     * @protected
     */
    this.categoryElms = Array.from(
      this.element.querySelectorAll(this.options.hamburgerCategorySelectorName)
    );

    /**
     * オーバーレイ要素
     * @type {HTMLElement}
     * @protected
     */
    this.overlay = null;
    if (this.options.hamburgerOverlaySelectorName) {
      this.overlay = this.element.querySelector(
        this.options.hamburgerOverlaySelectorName
      );
    }

    /**
     * カレントカテゴリ
     * @type {?number}
     * @protected
     */
    this.currentCategory = null;

    /**
     * カレントメニューの高さ
     * @type {?number}
     * @protected
     */
    this.currentHeight = null;

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
    let defaultOpenFlag = false;

    // コンテンツ表示判定
    this.categoryElms.some(category => {
      const contentStyle = Elements.getStyle(category);
      if (
        contentStyle.display !== 'none' &&
        contentStyle.visibility !== 'hidden'
      ) {
        defaultOpenFlag = true;
        return true;
      }
    });

    if (!defaultOpenFlag || this.options.defaultStatus === 'closed') {
      // コンテンツ非表示
      this.currentCategory = null;
      this.triggerElms.forEach(trigger => {
        this._deleteActive(trigger);
      });

      this.categoryElms.forEach(category => {
        category.style.display = 'none';
      });

      if (this.options.accessibilityFlag) {
        Elements.attr(this.content, 'aria-hidden', 'true');
      }

      if (this.options.changeType === 'fade') {
        this.html.removeAttribute(this.options.dataAttrFixedHtml);
        this.body.removeAttribute(this.options.dataAttrFixedBody);
      }
      this.content.style.display = 'none';
    } else {
      // コンテンツ表示
      this.currentCategory = this.content.getAttribute(
        this.options.dataAttrHamburgerContent
      );
      this.triggerElms.forEach(trigger => {
        const targetCategory = trigger.getAttribute(
          this.options.dataAttrHamburgerTrigger
        );
        if (targetCategory === this.currentCategory) {
          this._setActive(trigger);
        } else {
          this._deleteActive(trigger);
        }
      });

      this.categoryElms.forEach(category => {
        const thisCategory = category.getAttribute(
          this.options.dataAttrHamburgerCategory
        );

        if (thisCategory === this.currentCategory) {
          category.style.display = 'block';
        } else {
          category.style.display = 'none';
        }
      });

      if (this.options.accessibilityFlag) {
        Elements.attr(this.content, 'aria-hidden', 'false');
      }

      this.currentHeight = this.contentInner.offsetHeight;
      this.contentInner.style.opacity = '1';

      if (this.options.changeType === 'fade') {
        Elements.attr(this.html, this.options.dataAttrFixedHtml, '');
        Elements.attr(this.body, this.options.dataAttrFixedBody, '');
      }
    }

    // data属性設定
    if (this.options.changeType === 'slide') {
      Elements.attr(this.element, this.options.dataAttrHamburgerArea, 'slide');
    } else if (this.options.changeType === 'fade') {
      Elements.attr(this.element, this.options.dataAttrHamburgerArea, 'fade');
    } else {
      Elements.attr(this.element, this.options.dataAttrHamburgerArea, 'none');
    }

    this._bindEvents();
  }

  /**
   * @desc イベントのバインド登録
   * @private
   */
  private _bindEvents(): void {
    // トリガー初期化
    this.triggerElms.forEach(triggerElm => {
      const emit = this._emitTrigger.bind(this);
      triggerElm.addEventListener(
        'click',
        function (e) {
          emit(e, triggerElm);
        },
        false
      );
    });

    this.eventListeners.triggerClick = this._triggerClick.bind(this);
    this.on('trigger:click', this.eventListeners.triggerClick);
    if (this.overlay) {
      this.eventListeners.overlayClick = this._overlayClick.bind(this);
      this.overlay.addEventListener('click', this.eventListeners.overlayClick);
    }
  }

  /**
   * イベントのバインド解除
   * @private
   */
  private _unbindEvents(): void {
    this.off('trigger:click', this.eventListeners.triggerClick);
    if (this.overlay) {
      this.overlay.removeEventListener(
        'click',
        this.eventListeners.overlayClick
      );
    }
  }

  /**
   * @desc トリガークリックイベント処理
   * @param {HTMLElement} targetTrigger - 対象トリガー要素
   * @private
   */
  private _triggerClick(targetTrigger: HTMLElement): void {
    const targetCategory = targetTrigger.getAttribute(
      this.options.dataAttrHamburgerTrigger
    );

    const targetCategoryElm = Elements.filterByAttributeValue(
      this.categoryElms,
      targetCategory,
      this.options.dataAttrHamburgerCategory
    );
    const openTrigger = this._targetTrigger(targetCategory);

    if (
      this.currentCategory !== null &&
      this.currentCategory !== targetCategory
    ) {
      // すでに他のコンテンツが開いている場合は閉じる
      const closeTrigger = this._targetTrigger(this.currentCategory);
      const closeCategoryElm = Elements.filterByAttributeValue(
        this.categoryElms,
        this.currentCategory,
        this.options.dataAttrHamburgerCategory
      );

      this.currentHeight = this.contentInner.offsetHeight;

      this._close(closeTrigger, closeCategoryElm, true);
      this._open(openTrigger, targetCategoryElm, true);
    } else {
      // トグル開閉
      const isActive = Elements.hasClass(
        targetTrigger,
        this.options.triggerClass.opened
      );
      if (isActive) {
        this._close(openTrigger, targetCategoryElm, false);
      } else {
        this.currentHeight = this.contentInner.offsetHeight;
        this._open(openTrigger, targetCategoryElm, false);
      }
    }
  }

  /**
   * @desc オーバーレイクリックイベント処理
   * @private
   */
  private _overlayClick(): void {
    if (this.overlay === null) {
      return;
    }

    let closeTrigger = null;
    this.triggerElms.some((trigger: HTMLElement) => {
      const triggerCategory = trigger.getAttribute(
        this.options.dataAttrHamburgerTrigger
      );
      if (triggerCategory === this.currentCategory) {
        closeTrigger = trigger;
        return true;
      }
    });

    this.currentHeight = this.contentInner.offsetHeight;

    const closeCategory = closeTrigger.getAttribute(
      this.options.dataAttrHamburgerTrigger
    );

    const closeCategoryElm = Elements.filterByAttributeValue(
      this.categoryElms,
      closeCategory,
      this.options.dataAttrHamburgerCategory
    );

    this._close(closeTrigger, closeCategoryElm, false);
  }

  /**
   * @desc ハンバーガーメニューを開く
   * @param {HTMLElement} trigger - 対象のトリガー要素
   * @param {Array<HTMLElement>} content - 対象のカテゴリコンテンツ要素
   * @param {boolean} openedFlag - すでにコンテンツが開いているか否か
   * @private
   */
  private _open(
    trigger: HTMLElement,
    content: HTMLElement[],
    openedFlag: boolean
  ): void {
    if (typeof this.options.beforeOpen === 'function') {
      this.options.beforeOpen.call(this);
    }

    this._setActive(trigger);

    this.currentCategory = trigger.getAttribute(
      this.options.dataAttrHamburgerTrigger
    );

    this.content.style.display = 'block';

    if (this.options.accessibilityFlag) {
      Elements.attr(this.content, 'aria-hidden', 'false');
    }

    switch (this.options.changeType) {
      case 'fade':
        this.html.setAttribute(this.options.dataAttrFixedHtml, '');
        this.body.setAttribute(this.options.dataAttrFixedBody, '');

        content.forEach(content => {
          content.style.display = 'block';
          content.style.opacity = '1';
        });

        if (this.overlay !== null) {
          this.overlay.style.display = 'block';

          if (openedFlag) {
            this.overlay.style.opacity = '1';
          } else {
            this.overlay.style.opacity = '0';
            this._fade(this.overlay, 1);
          }
        }

        const targetContent = openedFlag ? this.contentInner : this.content;
        targetContent.style.opacity = '0';
        this._fade(targetContent, 1).then(() => {
          if (typeof this.options.endOpen === 'function') {
            this.options.endOpen.call(this);
          }
        });
        break;
      case 'slide':
        const contentHeight = this.currentHeight;
        this.currentHeight = 0;
        content.forEach(content => {
          content.style.opacity = '1';
          content.style.display = 'block';
          this.currentHeight += content.clientHeight;
        });

        if (openedFlag) {
          //すでにコンテンツが開いている場合
          this.content.style.height = `${contentHeight}px`;
          this.contentInner.style.opacity = '0';
          this._slide(this.content, this.currentHeight).then(() => {
            this._fade(this.contentInner, 1).then(() => {
              if (typeof this.options.endOpen === 'function') {
                this.options.endOpen.call(this);
              }
            });
          });
        } else {
          //新たにコンテンツを開く場合
          this.content.style.height = '0';
          this.content.style.overflow = 'hidden';
          this._slide(this.content, this.currentHeight).then(() => {
            if (typeof this.options.endOpen === 'function') {
              this.options.endOpen.call(this);
            }
          });
        }
        break;
      default:
        content.forEach(content => {
          content.style.opacity = '1';
          content.style.display = 'block';
        });
        if (typeof this.options.endOpen === 'function') {
          this.options.endOpen.call(this);
        }
        break;
    }
  }

  /**
   * @desc ハンバーガーメニューを閉じる
   * @param {HTMLElement} trigger - 対象のトリガー要素
   * @param {Array<HTMLElement>} content - 対象のカテゴリコンテンツ要素
   * @param {boolean} openedFlag - すでにコンテンツが開いているか否か
   * @private
   */
  private _close(
    trigger: HTMLElement,
    content: HTMLElement[],
    openedFlag: boolean
  ): void {
    if (typeof this.options.beforeClose === 'function') {
      this.options.beforeClose.call(this);
    }

    if (openedFlag) {
      this._deleteActive(trigger);

      this.content.style.display = 'none';

      content.forEach(content => {
        content.style.opacity = '0';
        content.style.display = 'none';
      });

      return;
    } else {
      if (this.options.accessibilityFlag) {
        Elements.attr(this.content, 'aria-hidden', 'true');
      }
    }

    this.currentCategory = null;
    this.triggerElms.forEach(trigger => {
      this._deleteActive(trigger);
    });

    switch (this.options.changeType) {
      case 'fade':
        this._fade(this.content, 0).then(() => {
          content.forEach(content => {
            content.style.display = 'none';
          });
          this.html.removeAttribute(this.options.dataAttrFixedHtml);
          this.body.removeAttribute(this.options.dataAttrFixedBody);

          if (typeof this.options.endClose === 'function') {
            this.options.endClose.call(this);
          }
        });
        if (!openedFlag && this.overlay !== null) {
          this._fade(this.overlay, 0);
        }
        break;
      case 'slide':
        this._slide(this.content, 0).then(() => {
          this.content.style.display = 'none';

          content.forEach(content => {
            content.style.display = 'none';
            content.style.opacity = '0';
          });
          this.currentHeight = 0;

          if (typeof this.options.endClose === 'function') {
            this.options.endClose.call(this);
          }
        });
        break;
      default:
        content.forEach(content => {
          content.style.display = 'none';
          content.style.opacity = '0';
        });

        this.content.style.display = 'none';
        if (typeof this.options.endClose === 'function') {
          this.options.endClose.call(this);
        }
        break;
    }
  }

  /**
   * @desc フェードアニメーション
   * @param {HTMLElement} content - 対象要素
   * @param {number} changeValue - 変化量
   * @return {Promise<boolean>} fadeをするかどうか
   * @private
   */
  private _fade(content: HTMLElement, changeValue: number): Promise<boolean> {
    Velocity(content, 'stop', true);

    return new Promise((resolve: (a: boolean) => void) => {
      Velocity(
        content,
        { opacity: changeValue },
        {
          duration: this.options.duration,
          easing: this.options.easing,
          complete: () => {
            if (changeValue <= 0) {
              content.style.display = 'none';
            }
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * @desc スライドアニメーション
   * @param {HTMLElement} content - 対象要素
   * @param {number} changeValue - 変化量
   * @return {Promise<boolean>} - スライドをするかどうか
   * @private
   */
  private _slide(content: HTMLElement, changeValue: number): Promise<boolean> {
    Velocity(content, 'stop', true);

    return new Promise((resolve: (a: boolean) => void) => {
      Velocity(
        content,
        { height: changeValue },
        {
          duration: this.options.duration,
          easing: this.options.easing,
          complete: () => {
            if (changeValue > 0) {
              content.style.height = 'auto';
            }
            resolve(true);
          }
        }
      );
    });
  }

  /**
   * @desc アクティブ状態に設定
   * @param {HTMLElement} trigger - 対象トリガー要素
   * @private
   */
  private _setActive(trigger: HTMLElement): void {
    Elements.removeClass(trigger, this.options.triggerClass.closed);
    Elements.addClass(trigger, this.options.triggerClass.opened);
    // アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      Elements.attr(trigger, 'aria-expanded', 'true');
    }
  }

  /**
   * アクティブ状態を解除
   * @param {HTMLElement} trigger - 対象トリガー要素
   * @private
   */
  private _deleteActive(trigger: HTMLElement): void {
    Elements.removeClass(trigger, this.options.triggerClass.opened);
    Elements.addClass(trigger, this.options.triggerClass.closed);
    // アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      Elements.attr(trigger, 'aria-expanded', 'false');
    }
  }

  /**
   * @desc 対象トリガーの取得
   * @param {string} targetCategory - 対象カテゴリ名
   * @return {HTMLElement | null} - 対象トリガー要素
   * @private
   */
  private _targetTrigger(targetCategory: string): HTMLElement | null {
    let target = null;

    this.triggerElms.some(trigger => {
      const triggerCategory = trigger.getAttribute(
        this.options.dataAttrHamburgerTrigger
      );
      if (triggerCategory === targetCategory) {
        target = trigger;
        return true;
      }
    });

    return target;
  }

  /**
   * @desc トリガークリックイベント処理
   * @param {MouseEvent} e - イベント
   * @param {HTMLElement} trigger - 対象トリガー要素
   * @private
   */
  private _emitTrigger(e: MouseEvent, trigger: HTMLElement) {
    e.preventDefault();
    this.emit('trigger:click', trigger);
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * @desc 設定を破棄
   * @public
   */
  destroy(): void {
    this._unbindEvents();

    this.triggerElms.forEach(trigger => {
      this._deleteActive(trigger);
    });

    Elements.attr(this.element, this.options.dataAttrHamburgerArea, 'none');

    Velocity(this.content, 'stop', true);
    this.content.removeAttribute('style');
    Velocity(this.contentInner, 'stop', true);
    this.contentInner.removeAttribute('style');
    this.categoryElms.forEach(category => {
      category.removeAttribute('style');
    });

    this.html.removeAttribute(this.options.dataAttrFixedHtml);
    this.body.removeAttribute(this.options.dataAttrFixedBody);

    //アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      this.triggerElms.forEach(trigger => {
        this._deleteActive(trigger);
      });
      Elements.attr(this.content, 'aria-hidden', 'true');
    }
  }
}
