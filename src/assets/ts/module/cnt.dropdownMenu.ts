/**
 * DropdownMenuクラス
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
 * @desc DropdownMenuのインスタンスごとに割り振るID
 * @typedef {number} DD_ID_COUNTER
 * @private
 */
let DD_ID_COUNTER = 0;

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * @desc ドロップダウンメニュー機能
 * @extends {EventEmitter}
 * @version 1.0.0
 */

interface DropdownElement extends Element {
  dropdown?: DropdownMenu;
}
interface Wrapper extends HTMLElement {
  openCloseItem: OpenCloseItem | null;
}
interface Content extends HTMLElement {
  style: CSSStyleDeclaration;
  openCloseItem: null;
  firstElementChild: HTMLElement;
  length: number;
}

interface Trigger extends HTMLElement {
  textContent: string;
  openCloseItem: OpenCloseItem | null;
}

interface EventListeners {
  resize: (this: DropdownMenu) => void;
  itemOpen: (this: DropdownMenu) => void;
  itemOpened: (this: DropdownMenu) => void;
  itemClose: (this: DropdownMenu) => void;
  itemClosed: (this: DropdownMenu) => void;
  documentClick: (this: DropdownMenu) => void;
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
    opened: null;
    closed: null;
  };
  transitionType: string;
  defaultStatus: string;
  naviTriggerEvent?: string;
  multiSelectableFlag: boolean;
  syncCloseAnimation?: boolean;
  syncOpenAnimation: boolean;
  initialOpenWrapperClass: string;
  initialOpenTransitionFlag: boolean;
  initialOpenTransitionDelay: number;
  documentClickCloseFlag?: boolean;
  accessibilityFlag: boolean;
  nameSpace?: string;
  beforeOpen?: () => void | null;
  endOpen?: () => void | null;
  beforeClose?: () => void | null;
  endClose?: () => void | null;
}

export default class DropdownMenu extends EventEmitter {
  //-------------------------------------------------
  // Parameters
  //-------------------------------------------------
  options: Options;
  element: DropdownElement;
  dropdown: DropdownMenu;
  id: string;
  items: OpenCloseItem[];
  currentItem: OpenCloseItem | null;
  eventLiteners: EventListeners;
  req: number | null;

  //-------------------------------------------------
  // Constructor
  //-------------------------------------------------
  /**
   * @desc DropdownMenuのインスタンスを作成
   * @param {HTMLElement} element - 対象要素
   * @param {Object} options - DropdownMenu初期化オプション
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
   * @param {string} options.naviTriggerEvent='click' - トリガイベント（'click' or 'mouseover'）
   * @param {boolean} options.multiSelectableFlag=false - 個別に開閉できるか否か
   * @param {boolean} options.syncCloseAnimation=false - 他のコンテンツが開いている場合、閉じるアニメーションを実行するか否か（multiSelectableFlagがfalseの場合に有効）
   * @param {boolean} options.syncOpenAnimation=false - 他のコンテンツが開いている場合、開くアニメーションを実行するか否か（multiSelectableFlagがfalseの場合に有効）
   * @param {string} options.initialOpenWrapperClass='is-open' - 強制的に開く場合のラッパーに付与するクラス
   * @param {boolean} options.initialOpenTransitionFlag=false - 強制的に開く場合のトランジション有無
   * @param {number} options.initialOpenTransitionDelay=500 - 強制的に開く場合のディレイ時間をミリ秒単
   * @param {boolean} options.documentClickCloseFlag=true - ドキュメントクリックでコンテンツを閉じるか否か
   * @param {boolean} options.accessibilityFlag=false - アクセシビリティ対応するか否か
   * @param {string} options.nameSpace='c-dropdown' - イベント指定時の名前空間
   * @param {?function} options.beforeOpen=null - 開く前の処理
   * @param {?function} options.endOpen=null - 開いた後の処理
   * @param {?function} options.beforeClose=null - 閉じる前の処理
   * @param {?function} options.endClose=null - 閉じた後の処理
   */
  constructor(element: DropdownElement, options: Options) {
    super();

    if (!element) return;
    if (element.dropdown) return;

    const defaultOptions = {
      wrapperSelector: '',
      triggerSelector: '',
      contentSelector: '',
      triggerClass: { opened: 'opened', closed: 'closed' },
      toggleTriggerTxt: { opened: null, closed: null },
      transitionType: 'slide',
      defaultStatus: '',
      naviTriggerEvent: 'click',
      multiSelectableFlag: false,
      syncCloseAnimation: false,
      syncOpenAnimation: false,
      initialOpenWrapperClass: 'is-open',
      initialOpenTransitionFlag: false,
      initialOpenTransitionDelay: 500,
      documentClickCloseFlag: true,
      accessibilityFlag: false,
      nameSpace: 'c-dropdown',
      beforeOpen: null,
      endOpen: null,
      beforeClose: null,
      endClose: null
    };

    /**
     * @desc DropdownMenuオプション
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
     * @desc DropdownMenuクラスの紐付け
     * @type {DropdownMenu}
     * @protected
     */
    this.element.dropdown = this;

    /**
     * ID
     * @type {string}
     * @protected
     */
    this.id = `dropdown${++DD_ID_COUNTER}`;

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
    this.eventLiteners = {} as EventListeners;

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
  private _init(): void {
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

      // ドロップダウンメニュー内クリックで閉じるのを防ぐ
      if (this.options.documentClickCloseFlag) {
        wrapper.addEventListener(
          'mousedown',
          function (e) {
            e.stopPropagation();
          },
          false
        );
      }

      // OpenCloseItemクラスの紐付け
      let item = wrapper.openCloseItem;
      if (!item) {
        item = new OpenCloseItem(this, wrapper, trigger, content);
        this.items.push(item);
      }
    });
  }

  /**
   * @desc イベントのバインド登録
   * @private
   */
  private _bindEvents(): void {
    this.eventLiteners.itemOpen = this._itemOpen.bind(this);
    this.on('item:open', this.eventLiteners.itemOpen);

    this.eventLiteners.itemOpened = this._itemOpened.bind(this);
    this.on('item:opened', this.eventLiteners.itemOpened);

    this.eventLiteners.itemClose = this._itemClose.bind(this);
    this.on('item:close', this.eventLiteners.itemClose);

    this.eventLiteners.itemClosed = this._itemClosed.bind(this);
    this.on('item:closed', this.eventLiteners.itemClosed);
  }

  /**
   * @desc イベントのバインド解除
   * @private
   */
  private _unbindEvents(): void {
    this.off('item:open', this.eventLiteners.itemOpen);
    this.off('item:opened', this.eventLiteners.itemOpened);
    this.off('item:close', this.eventLiteners.itemClose);
    this.off('item:closed', this.eventLiteners.itemClosed);
  }

  /**
   * @desc ドキュメントクリックイベント処理
   * @private
   */
  private _documentClick(): void {
    document.removeEventListener('mousedown', this.eventLiteners.documentClick);

    this.items.forEach(item => {
      item.close('none');
    });
    this.currentItem = null;
  }

  /**
   * @desc アイテムを開く時の処理
   * @param {OpenCloseItem} targetItem - ターゲットのOpenCloseItemクラス
   * @private
   */
  private _itemOpen(targetItem: OpenCloseItem): void {
    if (
      this.options.beforeOpen &&
      Util.isType('function', this.options.beforeOpen)
    ) {
      this.options.beforeOpen.call(this);
    }

    if (this.options.multiSelectableFlag) return;

    if (this.currentItem !== null && this.currentItem !== targetItem) {
      const transitionType = this.options.syncCloseAnimation
        ? this.options.transitionType
        : 'none';

      this.currentItem.close(transitionType);
    }
    this.currentItem = targetItem;

    document.removeEventListener('mousedown', this.eventLiteners.documentClick);
    if (this.options.documentClickCloseFlag) {
      this.eventLiteners.documentClick = this._documentClick.bind(this);
      document.addEventListener(
        'mousedown',
        this.eventLiteners.documentClick,
        false
      );
    }
  }

  /**
   * @desc アイテムを開いた後の処理
   * @private
   */
  private _itemOpened(): void {
    if (this.options.endOpen && Util.isType('function', this.options.endOpen)) {
      this.options.endOpen.call(this);
    }
  }

  /**
   * @desc アイテムを閉じる時の処理
   * @private
   */
  private _itemClose(): void {
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
  private _itemClosed(): void {
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
    this.items = [];

    this._unbindEvents();

    // インスタンスの参照を解除
    this.element.dropdown = null;
  }

  /**
   * @desc クリックアクションではなく、任意のタイミングで開く
   * @param {HTMLElement} content - 開く対象要素
   * @param {Object} options - オプション
   * @public
   */
  manualOpen(content: Content, options = {}): void {
    if (content.length < 1) return;

    this.options = Object.assign({}, this.options, options);

    this.items.some(item => {
      if (content === item.content) {
        item.open();
        return true;
      }
    });
  }

  /**
   * @desc クリックアクションではなく、任意のタイミングで閉じる
   * @param {HTMLElement} content - 閉じる対象要素
   * @param {Object} options - オプション
   * @public
   */
  manualClose(content: Content, options = {}): void {
    if (content.length < 1) return;

    this.options = Object.assign({}, this.options, options);

    this.items.some(item => {
      if (content === item.content) {
        item.close();
        return true;
      }
    });
  }

  /**
   * @desc 任意のタイミングですべて閉じる
   * @param {Object} options - オプション
   * @public
   */
  manualAllClose(options = {}): void {
    this.options = Object.assign({}, this.options, options);
    this.items.forEach(item => {
      item.close('none');
    });

    this.currentItem = null;
  }
}
