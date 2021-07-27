/**
 * OpenCloseItemクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import Elements from '@src/assets/ts/core/Elements';
import Velocity from 'velocity-animate';

//--------------------------------------------------------------------------
//  Common Parameter
//--------------------------------------------------------------------------
/**
 * @desc 親の制御クラスIDごとに、OpenCloseItemのインスタンスIDを格納したオブジェクト (ex: 'accordion1_item2)
 * @typedef {number} ID_COUNTER_OBJ
 * @private
 */
const ID_COUNTER_OBJ = {};

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * 単体で動く開閉機能
 * @version 1.0.0
 */

// contentプロパティ用のインターフェースを宣言
interface Content extends HTMLElement {
  style: CSSStyleDeclaration;
  openCloseItem: null;
  firstElementChild: HTMLElement;
}

//
interface Wrapper extends HTMLElement {
  openCloseItem: OpenCloseItem | null;
}

interface Trigger extends HTMLElement {
  textContent: string;
  openCloseItem: OpenCloseItem | null;
}
interface Control {
  id: string;
  currentItem: OpenCloseItem | null;
  options: {
    wrapperSelector: string;
    triggerSelector: string;
    contentSelector: string;
    triggerClass: {
      opened: string;
      closed: string;
    };
    toggleTriggerTxt: {
      opened: string | null;
      closed: string | null;
    };
    transitionType: string;
    defaultStatus: string;
    multiSelectableFlag: boolean;
    initialOpenWrapperClass: string;
    initialOpenTransitionFlag: boolean;
    initialOpenTransitionDelay: number;
    accessibilityFlag: boolean;
    syncOpenAnimation: boolean;
  };
  emit: (eventName: string, openCloseItem: OpenCloseItem) => boolean;
}

interface EventListeners {
  triggerClick: (string | Trigger | { (this: OpenCloseItem): void })[];
}

export default class OpenCloseItem {
  //-------------------------------------------------
  // Parameters
  //-------------------------------------------------
  options: {
    wrapperSelector: string;
    triggerSelector: string;
    contentSelector: string;
    triggerClass: {
      opened: string;
      closed: string;
    };
    toggleTriggerTxt: {
      opened: string | null;
      closed: string | null;
    };
    transitionType: string;
    defaultStatus: string;
    multiSelectableFlag: boolean;
    initialOpenWrapperClass: string;
    initialOpenTransitionFlag: boolean;
    initialOpenTransitionDelay: number;
    accessibilityFlag: boolean;
    syncOpenAnimation: boolean;
  };
  control: Control;
  wrapper: Wrapper;
  trigger: Trigger;
  content: Content;
  expanded: boolean;
  listeners: EventListeners;
  id: string;
  openCloseItem: OpenCloseItem | null;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc OpenCloseItemのインスタンスを作成
   * @param {Object} controlClass - 制御クラス
   * @param {HTMLElement} wrapper - ラッパー要素
   * @param {HTMLElement} trigger - トリガー要素
   * @param {HTMLElement} content - 開閉コンテンツ要素
   */
  constructor(
    controlClass: Control,
    wrapper: Wrapper,
    trigger: Trigger,
    content: Content
  ) {
    if (wrapper.openCloseItem) return;

    /**
     * @desc 制御クラス
     * @type {Object}
     * @protected
     */
    this.control = controlClass;

    /**
     * @desc ラッパー要素
     * @type {HTMLElement}
     * @protected
     */
    this.wrapper = wrapper;

    /**
     * @desc トリガー要素
     * @type {HTMLElement}
     * @protected
     */
    this.trigger = trigger;

    /**
     * @desc 開閉コンテンツ要素
     * @type {HTMLElement}
     * @protected
     */
    this.content = content;

    /**
     * @desc OpenCloseItemクラスの紐付け
     * @type {OpenCloseItem}
     * @protected
     */
    this.wrapper.openCloseItem = this;

    /**
     * @desc 制御クラスのオプション
     * @type {Object}
     * @protected
     */
    this.options = this.control.options;

    /**
     * @desc 開いているか否かを表すフラグ
     * @type {boolean}
     * @protected
     */
    this.expanded = false;

    /**
     * @desc イベントリスナーを格納したオブジェクト
     * @type {Object}
     * @protected
     */
    this.listeners = {} as EventListeners;

    if (!ID_COUNTER_OBJ[this.control.id]) {
      ID_COUNTER_OBJ[this.control.id] = 0;
    }

    this.id = `${this.control.id}_item${++ID_COUNTER_OBJ[this.control.id]}`;

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
    this._bindEvents();

    // コンテンツの状態によって初期化
    const contentStyle = Elements.getStyle(this.content);

    if (Elements.hasClass(this.wrapper, this.options.initialOpenWrapperClass)) {
      if (this.options.initialOpenTransitionFlag) {
        window.setTimeout(() => {
          this.open(this.options.transitionType);
        }, this.options.initialOpenTransitionDelay);
      } else {
        this.open('none');
      }
    } else if (this.options.defaultStatus === 'closed') {
      this.expanded = true;
      this.close('none');
    } else {
      if (
        contentStyle.display === 'none' ||
        contentStyle.visibility === 'hidden'
      ) {
        this.close('none');
      } else {
        this.open('none');
      }
    }
  }

  /**
   * @desc イベントのバインド登録
   * @private
   */
  private _bindEvents(): void {
    this.listeners = {
      // button listeners
      triggerClick: ['click', this.trigger, this._triggerClick.bind(this)]
    };

    for (const key in this.listeners) {
      if (Object.prototype.hasOwnProperty.call(this.listeners, key)) {
        const listener = this.listeners[key];
        listener[1].addEventListener(listener[0], listener[2]);
      }
    }
  }

  /**
   * @desc イベントのバインド解除
   * @private
   */
  private _unbindEvents(): void {
    for (const key in this.listeners) {
      if (Object.prototype.hasOwnProperty.call(this.listeners, key)) {
        const listener = this.listeners[key];
        listener[1].removeEventListener(listener[0], listener[2]);
      }
    }
  }

  /**
   * @desc トリガークリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  private _triggerClick(e: MouseEvent): void {
    e.preventDefault();
    let transitionType = this.options.transitionType;

    if (
      !this.options.multiSelectableFlag &&
      this.control.currentItem !== null
    ) {
      if (this.control.currentItem !== this) {
        transitionType = this.options.syncOpenAnimation
          ? this.options.transitionType
          : 'none';
      } else {
        this.control.currentItem = null;
      }
    }

    this.toggle(transitionType);
  }

  /**
   * @desc 開いた後の処理
   * @private
   */
  private _opened(): void {
    this.control.emit('item:opened', this);
  }

  /**
   * @desc 閉じた後の処理
   * @private
   */
  private _closed(): void {
    this.control.emit('item:closed', this);
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * @desc 開く時の処理
   * @param {string} transitionType='slide' - トランジションタイプ（'slide' or 'none'）
   * @public
   */
  open(transitionType = 'slide'): void {
    if (this.expanded) return;
    this.expanded = true;
    this.control.emit('item:open', this);

    // トリガー
    Elements.removeClass(this.trigger, this.options.triggerClass.closed);
    Elements.addClass(this.trigger, this.options.triggerClass.opened);
    // トリガーのラベル差し替え
    if (this.options.toggleTriggerTxt.opened) {
      this.trigger.textContent = this.options.toggleTriggerTxt.opened;
    }

    // コンテンツ
    if (transitionType !== 'none') {
      this.content.style.height = '0';
      this.content.style.display = 'block';
      this.content.style.overflow = 'hidden';

      const contentChildren = this.content.children;
      let childHeight = 0;
      Array.from(contentChildren).forEach((child: HTMLElement) => {
        childHeight += child.offsetHeight;
      });

      Velocity(
        this.content,
        {
          height: childHeight
        },
        {
          complete: () => {
            this.content.style.height = 'auto';
            this.content.style.overflow = 'visible';
            this._opened();
          }
        }
      );
    }

    // アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      Elements.attr(this.trigger, 'aria-expanded', 'true');
      Elements.attr(this.content, 'aria-hidden', 'false');
    }

    if (transitionType === 'none') {
      this.content.style.display = 'block';
      this.content.style.height = 'auto';
      this._opened();
    }
  }

  /**
   * @desc 閉じる時の処理
   * @param {string} transitionType='slide' - トランジションタイプ（'slide' or 'none'）
   * @public
   */
  close(transitionType = 'slide'): void {
    if (!this.expanded) return;
    this.expanded = false;

    this.control.emit('item:close', this);

    // トリガー
    Elements.removeClass(this.trigger, this.options.triggerClass.opened);
    Elements.addClass(this.trigger, this.options.triggerClass.closed);
    // トリガーのラベル差し替え
    if (this.options.toggleTriggerTxt.closed) {
      this.trigger.textContent = this.options.toggleTriggerTxt.closed;
    }

    // コンテンツ
    if (transitionType !== 'none') {
      this.content.style.overflow = 'hidden';
      Velocity(
        this.content,
        {
          height: 0
        },
        {
          complete: () => {
            this.content.style.display = 'none';
            this._closed();
          }
        }
      );
    }

    // アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      Elements.attr(this.trigger, 'aria-expanded', 'false');
      Elements.attr(this.content, 'aria-hidden', 'true');
    }

    if (transitionType === 'none') {
      this.content.style.display = 'none';
      this._closed();
    }
  }

  /**
   * @desc トグル開閉処理
   * @param {string} transitionType='slide' - トランジションタイプ（'slide' or 'none'）
   * @public
   */
  toggle(transitionType = 'slide'): void {
    if (this.expanded) {
      this.close(transitionType);
    } else {
      this.open(transitionType);
    }
  }

  /**
   * @desc 設定を破棄
   * @public
   */
  destroy(): void {
    this._unbindEvents();

    this.expanded = false;
    Elements.removeClass(this.trigger, this.options.triggerClass.opened);
    Elements.addClass(this.trigger, this.options.triggerClass.closed);
    // トリガーのラベル差し替え
    if (this.options.toggleTriggerTxt.closed) {
      this.trigger.textContent = this.options.toggleTriggerTxt.closed;
    }

    this.content.style.display = 'none';

    if (this.options.accessibilityFlag) {
      this.trigger.setAttribute('aria-expanded', 'false');
      this.content.setAttribute('aria-hidden', 'true');
    }

    // インスタンスの参照を解除
    // this.trigger.openCloseItem = null;
    // this.content.openCloseItem = null;
    this.wrapper.openCloseItem = null;

    // コントローラーのインスタンス参照を解除
    this.control = null;
  }
}
