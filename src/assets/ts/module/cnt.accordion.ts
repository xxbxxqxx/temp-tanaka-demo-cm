/**
 * Accordionクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import { EventEmitter } from 'events';
import Util from '@src/assets/ts/core/Util';
import OpenCloseItem from '@src/assets/ts/module/cnt.openCloseItem';

//--------------------------------------------------------------------------
//  Common Parameter
//--------------------------------------------------------------------------
/**
 * @desc Accordionのインスタンスごとに割り振るID
 * @typedef {number} AC_ID_COUNTER
 * @private
 */
let AC_ID_COUNTER = 0;

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * @desc アコーディオン機能
 * @extends {EventEmitter}
 * @version 1.0.0
 */

interface AccordionElement extends Element {
  accordion?: Accordion;
}

interface Wrapper extends HTMLElement {
  openCloseItem: OpenCloseItem | null;
}
interface Content extends HTMLElement {
  style: CSSStyleDeclaration;
  openCloseItem: null;
  firstElementChild: HTMLElement;
}

interface Trigger extends HTMLElement {
  textContent: string;
  openCloseItem: OpenCloseItem | null;
}

interface EventListeners {
  resize: () => void;
  itemOpen: () => void;
  itemOpened: () => void;
  itemClose: () => void;
  itemClosed: () => void;
}

interface Options {
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
  beforeOpen?: () => void | null;
  endOpen?: () => void | null;
  beforeClose?: () => void | null;
  endClose?: () => void | null;
  syncOpenAnimation: boolean;
}

export default class Accordion extends EventEmitter {
  //-------------------------------------------------
  // Parameters
  //-------------------------------------------------
  element: AccordionElement;
  options: Options;
  accordion: Accordion;
  id: string;
  items: OpenCloseItem[];
  currentItem: OpenCloseItem | null;
  eventListeners: EventListeners;
  req: number | null;
  wrapper: Wrapper;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc Accordionのインスタンスを作成
   * @param {HTMLElement} element - 対象要素
   * @param {Object} options - Accordion初期化オプション
   * @param {string} options.wrapperSelector - 開閉トリガーと開閉コンテンツの直属のラッパーセレクタ
   * @param {string} options.triggerSelector - 開閉トリガーセレクタ
   * @param {string} options.contentSelector - 開閉コンテンツセレクタ
   * @param {Object} options.triggerClass - トリガーに付与するクラス名を格納したオブジェクト
   * @param {string} options.triggerClass.opened='is-open' - トリガーに付与するOPEN時のクラス名
   * @param {string} options.triggerClass.closed='is-close' - トリガーに付与するCLOSE時のクラス名
   * @param {?Object} options.toggleTriggerTxt=null - トリガーのテキストを格納したオブジェクト
   * @param {string} options.toggleTriggerTxt.opened - OPEN時のトリガーテキスト
   * @param {string} options.toggleTriggerTxt.closed - CLOSE時のトリガーテキスト
   * @param {string} options.transitionType='slide' - トランジションタイプ（'slide' or 'none'）
   * @param {string} options.defaultStatus='' - デフォルトの開閉状態を共通で指定（'' or 'closed'）
   * @param {boolean} options.multiSelectableFlag=true - 個別に開閉できるか否か
   * @param {string} options.initialOpenWrapperClass='is-initOpen' - 強制的に開く場合のラッパーに付与するクラス
   * @param {boolean} options.initialOpenTransitionFlag=false - 強制的に開く場合のトランジション有無
   * @param {number} options.initialOpenTransitionDelay=500 - 強制的に開く場合のディレイ時間をミリ秒単位で指定
   * @param {boolean} options.accessibilityFlag=false - アクセシビリティ対応するか否か
   * @param {?function} options.beforeOpen=null - 開く前の処理
   * @param {?function} options.endOpen=null - 開いた後の処理
   * @param {?function} options.beforeClose=null - 閉じる前の処理
   * @param {?function} options.endClose=null - 閉じた後の処理
   * @param {boolean} options.syncOpenAnimation=false - 他のコンテンツが開いている場合、開くアニメーションを実行するか否か（multiSelectableFlagがfalseの場合に有効）
   */
  constructor(element: AccordionElement, options: Options) {
    super();

    if (!element) return;
    if (element.accordion) return;

    const defaultOptions = {
      wrapperSelector: '',
      triggerSelector: '',
      contentSelector: '',
      triggerClass: { opened: 'opened', closed: 'closed' },
      toggleTriggerTxt: { opened: null, closed: null },
      transitionType: 'slide',
      defaultStatus: '',
      multiSelectableFlag: true,
      initialOpenWrapperClass: 'is-initOpen',
      initialOpenTransitionFlag: false,
      initialOpenTransitionDelay: 500,
      accessibilityFlag: false,
      beforeOpen: null,
      endOpen: null,
      beforeClose: null,
      endClose: null,
      syncOpenAnimation: false
    };

    /**
     * @desc Accordionオプション
     * @type {Object}
     * @protected
     */
    this.options = Object.assign({}, defaultOptions, options);

    /**
     * @desc 対象要素
     * @type {HTMLElement}
     * @protected
     */
    this.element = element;

    /**
     * @desc Accordionクラスの紐付け
     * @type {Accordion}
     * @protected
     */
    this.element.accordion = this;

    /**
     * @desc ID
     * @type {string}
     * @protected
     */
    this.id = `accordion${++AC_ID_COUNTER}`;

    /**
     * @desc 個別の開閉アイテムを格納した配列
     * @type {OpenCloseItem[]}
     * @protected
     */
    this.items = [];

    /**
     * @desc 現在開いている開閉アイテム
     * @type {OpenCloseItem}
     * @protected
     */
    this.currentItem = null;

    /**
     * @desc イベントリスナーを格納したオブジェクト
     * @type {Object}
     * @protected
     */
    this.eventListeners = {} as EventListeners;

    /**
     * @desc requestAnimationFrameの戻り値
     * @type {number}
     * @protected
     */
    this.req = null;

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
    this._bindEvents();

    const container = this.element;
    const wrappers = container.querySelectorAll(this.options.wrapperSelector);

    Array.from(wrappers).forEach((wrapper: Wrapper) => {
      const trigger = wrapper.querySelector(
        this.options.triggerSelector
      ) as Trigger;
      const content = wrapper.querySelector(
        this.options.contentSelector
      ) as Content;

      let item = wrapper.openCloseItem;

      // openCloseItemクラスの紐付け
      if (!item) {
        item = new OpenCloseItem(this, wrapper, trigger, content);
      }

      this.items.push(item);
    });
  }

  /**
   * @desc イベントのバインド登録
   * @private
   */
  private _bindEvents() {
    this.eventListeners.itemOpen = this._itemOpen.bind(this);
    this.on('item:open', this.eventListeners.itemOpen);

    this.eventListeners.itemOpened = this._itemOpened.bind(this);
    this.on('item:opened', this.eventListeners.itemOpened);

    this.eventListeners.itemClose = this._itemClose.bind(this);
    this.on('item:close', this.eventListeners.itemClose);

    this.eventListeners.itemClosed = this._itemClosed.bind(this);
    this.on('item:closed', this.eventListeners.itemClosed);
  }

  /**
   * @desc イベントのバインド解除
   * @private
   */
  private _unbindEvents() {
    this.off('item:open', this.eventListeners.itemOpen);
    this.off('item:opened', this.eventListeners.itemOpened);
    this.off('item:close', this.eventListeners.itemClose);
    this.off('item:closed', this.eventListeners.itemClosed);
  }

  /**
   * @desc アイテムを開く時の処理
   * @param {OpenCloseItem} targetItem - ターゲットのOpenCloseItemクラス
   * @private
   */
  private _itemOpen(targetItem: OpenCloseItem) {
    if (
      this.options.beforeOpen &&
      Util.isType('function', this.options.beforeOpen)
    ) {
      this.options.beforeOpen.call(this);
    }

    if (this.options.multiSelectableFlag) return;

    if (this.currentItem !== null && this.currentItem !== targetItem) {
      this.currentItem.close(this.options.transitionType);
    }

    this.currentItem = targetItem;
  }

  /**
   * @desc アイテムを開いた後の処理
   * @private
   */
  private _itemOpened() {
    if (this.options.endOpen && Util.isType('function', this.options.endOpen)) {
      this.options.endOpen.call(this);
    }
  }

  /**
   * @desc アイテムを閉じる時の処理
   * @private
   */
  private _itemClose() {
    if (
      this.options.beforeClose &&
      Util.isType('function', this.options.beforeClose)
    ) {
      this.options.beforeClose.call(this);
    }
  }

  /**
   * @desc アイテムを閉じた後の処理
   * @private
   */
  private _itemClosed() {
    if (
      this.options.endClose &&
      Util.isType('function', this.options.endClose)
    ) {
      this.options.endClose.call(this);
    }
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * @desc 設定を破棄
   * @public
   */
  destroy(): void {
    this.items.forEach(item => {
      item.destroy();
    });

    this._unbindEvents();

    // インスタンスの参照を解除
    this.element.accordion = null;
  }

  /**
   * @desc クリックアクションではなく、任意のタイミングで開く
   * @param {HTMLElement} content - 開く対象要素
   * @param {Object} options - オプション
   * @public
   */
  manualOpen(content: HTMLElement, options = {}): void {
    this.options = Object.assign({}, this.options, options);

    this.items.some(item => {
      if (content === item.content) {
        item.open();
        return true;
      }
    });
  }
}
