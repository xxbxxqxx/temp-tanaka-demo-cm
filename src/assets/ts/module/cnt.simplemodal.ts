/**
 * SimpleModalクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------

import Velocity from 'velocity-animate';
import Elements from '@src/assets/ts/core/Elements';
import Util from '@src/assets/ts/core/Util';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * モーダル機能
 * @version 1.0.0
 */

interface Options {
  closeSelector: string;
  duration: number;
  easing: string;
  bgFadeFlag: boolean;
  bgClickCloseFlag: boolean;
  fixedContentFlag: boolean;
  modalWindowMarginTopMin: number;
  ajaxContentFlag: boolean;
  ajaxCloseSelector?: string;
  ajaxContentAfterAppend?: (
    modalWrapper: HTMLElement,
    modalContainer: HTMLElement,
    options: Options,
    trigger: HTMLElement
  ) => void | null;
  accessibilityFlag?: boolean;
  nameSpace?: string;
  beforeShowContent?: (target: HTMLElement | null) => void | null;
  afterShowContent?: (target: HTMLElement | null) => void | null;
  beforeHideContent?: (target: HTMLElement | null) => void | null;
  afterHideContent?: (target: HTMLElement | null) => void | null;
}

interface EventListeners {
  resize: () => void;
  triggerClick: () => void;
  closeClick: () => void;
  containerClick: () => void;
  modalKeydown: () => void;
}
export default class SimpleModal {
  // -------------------------------------------------
  // Constructor
  // -------------------------------------------------
  /**
   * @desc SimpleModalのインスタンスを作成
   * @param {?HTMLElement} element=null - 対象要素
   * @param {Object} options - SimpleModal初期化オプション
   * @param {string} options.closeSelector='[data-js-modal-close]' - 閉じるアクションを付与するオブジェクトのセレクタ名
   * @param {number} options.duration=400 - アニメーション時間をミリ秒単位で指定
   * @param {string} options.easing='swing' - 切り替えアニメーションのeasing設定（'swing' or 'linear'）
   * @param {boolean} options.bgFadeFlag=true - 背景も一緒にフェードアニメーションするか否か
   * @param {boolean} options.bgClickCloseFlag=true - 背景クリックで閉じるか否か
   * @param {boolean} options.fixedContentFlag=true - 背景をfixedで表示するか否か
   * @param {?number} options.modalWindowMarginTopMin=80 - data-js-modal_containerのtopの値
   * @param {boolean} [options.ajaxContentFlag=false] - コンテンツをAjaxで取得するか否か（trueの場合、トリガーのdata-js-ajax-content属性に取得URLを、モーダルコンテンツの挿入先にdata-js-ajax-container属性を設定する）
   * @param {string} [options.ajaxCloseSelector=''] - Ajaxコンテンツ内の閉じるボタンセレクタ名（ajaxContentFlagがtrueの場合に有効）
   * @param {?function} [options.ajaxContentAfterAppend=null] - Ajaxコンテンツ挿入後の処理（ajaxContentFlagがtrueの場合に有効。)
   * @param {boolean} options.accessibilityFlag=false - アクセシビリティ対応するか否か
   * @param {string} options.nameSpace='c-modal' - イベント指定時の名前空間
   * @param {?function} options.beforeShowContent=null - 表示前の処理
   * @param {?function} options.afterShowContent=null - 表示後の処理
   * @param {?function} options.beforeHideContent=null - 非表示前の処理
   * @param {?function} options.afterHideContent=null - 非表示後の処理
   */

  element: HTMLElement;
  options: Options;
  html: HTMLElement;
  body: HTMLElement;
  modal: HTMLElement;
  modalBg: HTMLElement;
  modalConWrapper: HTMLElement;
  modalContainer: null | HTMLElement;
  focusedElementBeforeModal: HTMLElement;
  focusableSelector: string;
  isModalOpen: boolean;
  currentScrollY: number;
  isSP: boolean;
  eventListeners: EventListeners;
  focusableItems: Element[] | Node[] | HTMLElement[];

  constructor(element: HTMLElement = null, options: Options) {
    const defaultOptions = {
      closeSelector: '[data-js-modal-close]',
      duration: 400,
      easing: 'swing',
      bgFadeFlag: true,
      bgClickCloseFlag: true,
      fixedContentFlag: true,
      modalWindowMarginTopMin: 80,
      ajaxContentFlag: false,
      ajaxCloseSelector: '',
      ajaxContentAfterAppend: null,
      accessibilityFlag: false,
      nameSpace: 'c-modal',
      beforeShowContent: null,
      afterShowContent: null,
      beforeHideContent: null,
      afterHideContent: null
    };
    /**
     * SimpleModalオプション
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
    this.html = Array.from(document.getElementsByTagName('html'))[0];
    /**
     * body要素
     * @type {HTMLElement}
     * @protected
     */
    this.body = Array.from(document.getElementsByTagName('body'))[0];
    /**
     * モーダル要素
     * @type {HTMLElement}
     * @protected
     */
    this.modal = document.createElement('div');
    this.modal.setAttribute('data-js-modal', '');
    this.modal.setAttribute('role', 'dialog');
    /**
     * モーダル背景要素
     * @type {HTMLElement}
     * @protected
     */
    this.modalBg = document.createElement('div');
    this.modalBg.setAttribute('data-js-modal_bg', '');
    this.modal.appendChild(this.modalBg);
    /**
     * モーダルコンテナのラッパー要素
     * @type {?HTMLElement}
     * @protected
     */
    this.modalConWrapper = null;
    /**
     * モーダルコンテナ要素（this.modalConWrapperの子要素。モーダルに表示されるコンテンツ）
     * @type {?HTMLElement}
     * @protected
     */
    this.modalContainer = null;
    /**
     * モーダルウィンドウを開く前にフォーカスを持った要素を保存
     * @type {?HTMLElement}
     * @protected
     */
    this.focusedElementBeforeModal = null;
    /**
     * フォーカス可能なアイテム
     * @type {string}
     * @protected
     */
    this.focusableSelector =
      'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
    /**
     * モーダルが開いているか否か
     * @type {boolean}
     * @protected
     */
    this.isModalOpen = false;
    /**
     * モーダルを開く直前のscrollTop値
     * @type {?number}
     * @protected
     */
    this.currentScrollY = null;
    /**
     * モーダルを開く直前のscrollTop値
     * @type {boolean}
     * @protected
     */
    this.isSP =
      Util.getPlatform().device === 'iphone' ||
      Util.getPlatform().device === 'ipad' ||
      Util.getPlatform().device === 'android';
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
    const modal = document.querySelector('[data-js-modal]');
    if (!modal) {
      this.body.appendChild(this.modal);
    }
    // this._setAriaAttributes(true);
    this._bindEvents();
  }

  /**
   * @desc イベントのバインド登録
   * @private
   */
  private _bindEvents(): void {
    this.eventListeners.resize = this._windowResize.bind(this);
    window.addEventListener('resize', this.eventListeners.resize, false);
    window.addEventListener(
      'orientationchange',
      this.eventListeners.resize,
      false
    );
    if (this.element) {
      this.eventListeners.triggerClick = this._triggerClick.bind(this);
      this.element.addEventListener(
        'click',
        this.eventListeners.triggerClick,
        false
      );
    }
  }

  /**
   * @desc イベントのバインド解除
   * @private
   */
  private _unbindEvents(): void {
    window.removeEventListener('resize', this.eventListeners.resize);
    window.removeEventListener('orientationchange', this.eventListeners.resize);
    if (this.element) {
      this.element.removeEventListener(
        'click',
        this.eventListeners.triggerClick
      );
    }
  }

  /**
   * @desc 閉じるイベントのバインド登録
   * @private
   */
  private _bindCloseEvents(): void {
    // 閉じるボタン初期化
    const closeBtns = Array.from(
      this.modalContainer.querySelectorAll(this.options.closeSelector)
    );
    this.eventListeners.closeClick = this._closeClick.bind(this);
    closeBtns.forEach(closeBtn => {
      closeBtn.addEventListener('click', this.eventListeners.closeClick, false);
    });
    // 背景クリック初期化
    if (this.options.bgClickCloseFlag) {
      const modalBg = document.querySelector('[data-js-modal_bg]');
      modalBg.addEventListener('click', this.eventListeners.closeClick, false);
    }
    // コンテンツエリアクリック初期化
    this.eventListeners.containerClick = this._containerClick.bind(this);
    this.modalContainer.addEventListener(
      'click',
      this.eventListeners.containerClick,
      false
    );
  }

  /**
   * @desc 閉じるイベントのバインド解除
   * @private
   */
  private _unbindCloseEvents(): void {
    const closeBtn = this.modalContainer.querySelector(
      this.options.closeSelector
    );
    closeBtn.removeEventListener('click', this.eventListeners.closeClick);
    const modalBg = document.querySelector('[data-js-modal_bg]');
    modalBg.removeEventListener('click', this.eventListeners.closeClick);
    this.modalContainer.removeEventListener(
      'click',
      this.eventListeners.containerClick
    );
  }

  /**
   * @desc キーイベントのバインド登録
   * @private
   */
  private _bindKeyEvents(): void {
    this.eventListeners.modalKeydown = this._modalKeydown.bind(this);
    const modal = document.querySelector('[data-js-modal]');
    modal.addEventListener('keydown', this.eventListeners.modalKeydown, false);
  }

  /**
   * @desc キーイベントのバインド解除
   * @private
   */
  private _unbindKeyEvents(): void {
    const modal = document.querySelector('[data-js-modal]');
    modal.removeEventListener('keydown', this.eventListeners.modalKeydown);
  }

  /**
   * @desc ウィンドウのリサイズイベント
   * @private
   */
  private _windowResize(): void {
    if (this.modalContainer) {
      this._setPosAndHeight();
    }
  }

  /**
   * @desc トリガークリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  private _triggerClick(e: MouseEvent): void {
    e.preventDefault();
    const targetTrigger = e.currentTarget as HTMLElement;

    const href = targetTrigger.getAttribute('href');
    const modalIdSelector = href.slice(href.indexOf('#') + 1);
    if (modalIdSelector.length > 0) {
      this._initModal(modalIdSelector, targetTrigger);
    }
  }

  /**
   * @desc 閉じるクリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  private _closeClick(e: MouseEvent): void {
    e.preventDefault();
    this._hideModal();
  }

  /**
   * @desc コンテナクリックイベント処理
   * @param {Object} e - イベント
   * @private
   */
  private _containerClick(e: MouseEvent): void {
    // コンテンツエリア押下では閉じないようにする
    e.stopPropagation();
  }

  /**
   * @desc キーイベント処理
   * @param {Object} e - イベント
   * @private
   */
  private _modalKeydown(e: KeyboardEvent): void {
    this._setFocusedItem(e);
  }

  /**
   * @desc モーダル表示前の初期化
   * @param {string} idSelector 開くモーダルウィンドウのセレクタ名
   * @param {?HTMLElement} trigger 対象のトリガー要素
   * @private
   */
  private _initModal(idSelector: string, trigger: HTMLElement = null): void {
    this.modalConWrapper = document.getElementById(idSelector);
    if (!this.modalConWrapper) return;
    this.currentScrollY = Util.getWindowScrollTop();
    this.isModalOpen = true;
    // モーダルウィンドウの設定
    this.modalContainer = this.modalConWrapper.children[0] as HTMLElement;
    const containerDataAttr = Elements.attr(
      this.modalContainer as HTMLElement,
      'data-js-modal_container'
    );
    if (containerDataAttr === undefined || containerDataAttr === null) {
      Elements.attr(this.modalContainer, 'data-js-modal_container', '');
    }
    // fixed
    if (this.options.fixedContentFlag) {
      Elements.attr(this.html, 'data-js-modal_fixed', '');

      // ウィンドウの高さとドキュメントの高さを比較して
      // bodyにスクロールバー制御のCSSを付与
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.offsetHeight;
      if (documentHeight > windowHeight) {
        Elements.addClass(this.body, 'is-modalFixed');
      }

      if (this.isSP) {
        this._setFixedContentSP();
      }
    }
    // bgFadeFlag
    if (this.options.bgFadeFlag) {
      const modalBg = document.querySelector(
        '[data-js-modal_bg]'
      ) as HTMLElement;
      modalBg.style.opacity = '0';
      this.modalContainer.style.opacity = '1';
    }
    const modal = document.querySelector('[data-js-modal]') as HTMLElement;
    const modalBg = modal.querySelector('[data-js-modal_bg]') as HTMLElement;
    modalBg.appendChild(this.modalContainer);
    modalBg.style.opacity = '0';
    modal.style.display = 'block';
    //閉じるイベント初期化
    this._unbindCloseEvents();
    this._bindCloseEvents();
    //アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      this._unbindKeyEvents();
      this._bindKeyEvents();
    }
    // Ajax処理
    if (this.options.ajaxContentFlag) {
      //Ajaxコンテンツ初期化
      this._ajaxContentInit(
        this.modalConWrapper,
        this.modalContainer,
        this.options,
        trigger
      );
    } else {
      this._setPosAndHeight();
      this._showModal(trigger);
    }
  }

  /**
   * @desc モーダル表示
   * @param {?HTMLElement} trigger 対象のトリガー要素
   * @private
   */
  private _showModal(trigger: HTMLElement = null): void {
    // 表示前のコールバック処理
    if (
      this.options.beforeShowContent &&
      Util.isType('function', this.options.beforeShowContent)
    ) {
      this.options.beforeShowContent.call(this, trigger);
    }
    // アクセシビリティ対応
    this._setAriaAttributes(false);
    if (this.options.accessibilityFlag) {
      // モーダルウィンドウを開く前にフォーカスを持ったアイテムを保存する
      this.focusedElementBeforeModal = document.querySelector(':focus');
      this._setFocusToFirstItemInModal();
    }

    // 表示アニメーションを実行
    const modalBg = document.querySelector('[data-js-modal_bg]');
    const animateContents = this.options.bgFadeFlag
      ? modalBg
      : this.modalContainer;

    // ウィンドウの高さとドキュメントの高さを比較して
    // モーダル背景にスクロールバー制御のCSSを付与
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    if (documentHeight > windowHeight) {
      Elements.addClass(modalBg, 'is-modalFixed');
    }

    Velocity(
      animateContents,
      { opacity: 1 },
      {
        duration: this.options.duration,
        easing: this.options.easing,
        complete: () => {
          // 表示後のコールバック処理
          if (
            this.options.afterShowContent &&
            Util.isType('function', this.options.afterShowContent)
          ) {
            this.options.afterShowContent.call(this, trigger);
          }
        }
      }
    );
  }

  /**
   * @desc モーダル非表示
   * @param {?function} callback 手動呼び出しで閉じた後の処理
   * @private
   */
  private _hideModal(callback: () => void = null): void {
    if (!this.isModalOpen) return;

    // if (!this.modalContainer) {
    // 連打やサーバサイド遅延により、modalContainerが消失していたら・・・
    const modal = document.querySelector('[data-js-modal');
    this.modalContainer = modal.querySelector('[data-js-modal_container]');
    // }

    if (!this.modalContainer) return;

    this.isModalOpen = false;

    // 非表示前のコールバック処理
    if (
      this.options.beforeHideContent &&
      Util.isType('function', this.options.beforeHideContent)
    ) {
      this.options.beforeHideContent.call(this);
    }

    // アクセシビリティ対応
    this._setAriaAttributes(true);
    if (this.options.accessibilityFlag) {
      this._unbindKeyEvents();
      // モーダルウィンドウを開く前にフォーカスを持っていたアイテムに戻す
      if (this.focusedElementBeforeModal) {
        this.focusedElementBeforeModal.focus();
      }
    }

    // 非表示アニメーションを実行
    const modalBg = document.querySelector('[data-js-modal_bg]');
    const animateContents = this.options.bgFadeFlag
      ? modalBg
      : this.modalContainer;
    Velocity(
      animateContents,
      { opacity: 0 },
      {
        duration: this.options.duration,
        easing: this.options.easing,
        complete: () => {
          // is-modalFixedクラスを持っていたら削除する
          if (Elements.hasClass(modalBg, 'is-modalFixed')) {
            Elements.removeClass(modalBg, 'is-modalFixed');
          }

          // スクロール値補正
          if (this.options.fixedContentFlag) {
            modalBg.scrollTop = 0;
          }

          // Ajax処理
          if (this.options.ajaxContentFlag) {
            const ajaxContainer = this.modalContainer.querySelector(
              '[data-js-ajax-container]'
            );
            if (ajaxContainer) {
              ajaxContainer.innerHTML = '';
            }
          }

          // コンテンツを元に戻す
          this.modalConWrapper.appendChild(this.modalContainer);
          const modal = document.querySelector(
            '[data-js-modal]'
          ) as HTMLElement;
          modal.style.display = 'none';

          if (Elements.attr(this.html, 'data-js-modal_fixed') !== undefined) {
            this.html.removeAttribute('data-js-modal_fixed');
            // bodyにis-modalFixedクラスを持っていたら削除する
            if (this.body.classList.contains('is-modalFixed')) {
              this.body.classList.remove('is-modalFixed');
            }

            if (
              Elements.attr(this.html, 'data-js-correct_right') !== undefined
            ) {
              this.html.removeAttribute('data-js-correct_right');
            }
            if (this.isSP) {
              Elements.attr(this.body, 'style', '');
              this.html.scrollTop = this.currentScrollY;
              this.body.scrollTop = this.currentScrollY;
            }
          }

          // 手動呼び出しで閉じた後のコールバック処理
          if (Util.isType('function', callback)) {
            callback.call(this);
          }

          // 非表示後のコールバック処理
          if (
            this.options.afterHideContent &&
            Util.isType('function', this.options.afterHideContent)
          ) {
            this.options.afterHideContent.call(this);
          }
        }
      }
    );
  }

  /**
   * @desc モーダル内のフォーカスアイテムを制御
   * @param {Object} e イベントオブジェクト
   * @private
   */
  private _setFocusedItem(e: KeyboardEvent): void {
    const targetModal = e.currentTarget as HTMLElement;
    //escapeキー
    if (e.key === 'Escape') {
      e.preventDefault();
      this._hideModal();
    }
    // tab or tab + shiftキー
    if (e.key === 'Tab') {
      const children: NodeList = targetModal.querySelectorAll('*');
      let focusableItems = Elements.filter(children, this.focusableSelector);
      focusableItems = [...focusableItems].filter((elm: HTMLElement) => {
        return Elements.isVisible(elm);
      });
      const focusedItem = document.querySelector(':focus');
      const focusableItemsLength = focusableItems.length;
      const focusedItemIndex = Elements.index(focusableItems, focusedItem);
      if (e.shiftKey) {
        // フォーカス可能な最初のインデックスからback-tabを押下した際は、最後にフォーカスを当てる
        if (focusedItemIndex === 0) {
          const sample = focusableItems[
            focusableItemsLength - 1
          ] as HTMLElement;
          sample.focus();
          e.preventDefault();
        }
      } else {
        // フォーカス可能な最後のインデックスからtabを押下した際は、最初にフォーカスを当てる
        if (focusedItemIndex === focusableItemsLength - 1) {
          const sample = focusableItems[0] as HTMLElement;
          sample.focus();
          e.preventDefault();
        }
      }
    }
  }

  /**
   * @desc フォーカス可能なアイテムの最初にフォーカスを当てる
   * @private
   */
  private _setFocusToFirstItemInModal(): void {
    const modal = document.querySelector('[data-js-modal]');
    const children = modal.querySelectorAll('*');
    // let focusableItems: Array<unknown> = Elements.filter(children, this.focusableSelector);

    const selector = this.focusableSelector;

    const focusableItems = (
      children: NodeList,
      selector: string
    ): Array<Node> => {
      let list: Array<Node> = Array.from(children);
      const targetElm: Array<Node> = Array.from(
        document.querySelectorAll(selector)
      );

      list = list.filter((listItem: Node) => {
        return targetElm.indexOf(listItem) !== -1;
      });

      return list;
    };

    const focusableItemsArray = [...focusableItems(children, selector)].filter(
      (elm: HTMLElement): boolean => {
        return Elements.isVisible(elm);
      }
    ) as HTMLElement[];
    focusableItemsArray[0].focus();
  }

  /**
   * @desc aria属性付与
   * @param {boolean} hiddenFlag 非表示フラグ
   * @private
   */
  private _setAriaAttributes(hiddenFlag: boolean): void {
    //アクセシビリティ対応
    if (this.options.accessibilityFlag) {
      const modal = document.querySelector('[data-js-modal]') as HTMLElement;
      const mainContents = Elements.siblings(modal);
      Array.from(mainContents).forEach((content: HTMLElement) => {
        if (
          content.nodeType === 1 &&
          content.tagName.toLowerCase() !== 'script'
        ) {
          Elements.attr(content, 'aria-hidden', !hiddenFlag);
        }
      });
      Elements.attr(modal, 'aria-hidden', hiddenFlag);
    }
  }

  /**
   * Ajaxコンテンツ初期化
   * @param {Object} trigger 対象のトリガー要素
   */
  _ajaxContentInit(
    modalWrapper: HTMLElement,
    modalContainer: HTMLElement,
    options: Options,
    trigger: HTMLElement
  ): void {
    const ajaxContentUrl = document
      .querySelector('[data-js-ajax-content]')
      .getAttribute('data-js-ajax-content');

    const modal = document.querySelector('[data-js-modal]');
    const ajaxContainer = modal.querySelector('[data-js-ajax-container]');

    const ajaxFunc = (url: string) => {
      fetch(url)
        .then((response: Response) => {
          return response.text();
        })
        .then((text: string) => {
          if (ajaxContainer) {
            //Ajaxコンテンツ追加
            ajaxContainer.innerHTML = text;

            if (this.options.ajaxCloseSelector !== '') {
              //閉じるボタンクリックイベント設定
              const ajaxCloseBtns = Array.from(
                ajaxContainer.querySelectorAll(this.options.ajaxCloseSelector)
              );

              ajaxCloseBtns.forEach(ajaxCloseBtn => {
                ajaxCloseBtn.removeEventListener(
                  'click',
                  this.eventListeners.closeClick
                );
                ajaxCloseBtn.addEventListener('click', (e: MouseEvent) => {
                  e.preventDefault();
                  this._hideModal();
                });
              });
            }

            //fixed
            if (this.isSP && options.fixedContentFlag) {
              this._setFixedContentSP();
            }

            //ポジションの再設定
            this._setPosAndHeight();
            const ajaxContentAfterAppend = this.options.ajaxContentAfterAppend;
            if (typeof ajaxContentAfterAppend === 'function') {
              const modal = document.querySelector('[data-js-modal]');
              ajaxContentAfterAppend.apply(modal, [
                modalWrapper,
                modalContainer,
                options,
                trigger
              ]);
            }
            this._showModal(trigger);
          }
        })
        .catch((error: Error) => {
          // console.log('Error:', error);
        });
    };
    ajaxFunc(ajaxContentUrl);
  }

  /**
   * @desc SP用fixed設定
   * @private
   */
  private _setFixedContentSP(): void {
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const overWindowFlag = windowHeight < this.body.offsetHeight ? true : false;
    this.body.setAttribute(
      'style',
      'position:fixed; width:100%; height:auto; top:' +
        -this.currentScrollY +
        ';'
    );
    if (!overWindowFlag) {
      this.body.style.height = '100%';
    }
  }

  /**
   * @desc 高さ、位置等調整
   * @private
   */
  private _setPosAndHeight(): void {
    if (Elements.isVisible(this.modalContainer)) {
      const modalContainerHeight = this.modalContainer.clientHeight;
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const windowScrollTop = this.options.fixedContentFlag
        ? 0
        : this.currentScrollY;
      const modalMarginBottom = this.options.fixedContentFlag
        ? this.options.modalWindowMarginTopMin
        : 0;
      const posTop =
        windowScrollTop +
        (windowHeight <
        modalContainerHeight + this.options.modalWindowMarginTopMin * 2
          ? this.options.modalWindowMarginTopMin
          : (windowHeight - modalContainerHeight) / 2);
      const overWindowFlag =
        windowHeight < this.body.offsetHeight ? true : false;
      const bodyFirstChild = this.body.children[0] as HTMLElement;
      const modalWidth = Math.max(
        this.html.offsetWidth,
        this.body.offsetWidth,
        bodyFirstChild.offsetWidth
      );
      const modalHeight = Math.max(
        this.html.offsetHeight,
        this.body.offsetHeight,
        windowHeight,
        posTop + modalContainerHeight + this.options.modalWindowMarginTopMin
      );
      const modal = document.querySelector('[data-js-modal]') as HTMLElement;
      modal.style.width = modalWidth + 'px';
      modal.style.height = modalHeight + 'px';
      this.modalContainer.style.top = posTop + 'px';
      this.modalContainer.style.paddingBottom = modalMarginBottom + 'px'; ///暫定的に
      // fixed時のスクロールバー分の移動を補正
      if (this.options.fixedContentFlag && overWindowFlag) {
        Elements.attr(this.html, 'data-js-correct_right', '');
      }
    }
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * @desc モーダルを開く
   * @param {string} selector - 開くモーダルウィンドウのセレクタ名
   * @param {Object} options - プラグインの引数
   * @public
   */
  modalOpen(selector: string, options?: Options): void {
    this.options = Object.assign({}, this.options, options);
    const modalIdSelector = selector.slice(selector.indexOf('#') + 1);
    if (modalIdSelector.length > 0) {
      this._initModal(modalIdSelector);
    }
  }

  /**
   * @desc モーダルを閉じる
   * @param {function} [callback] - 手動呼び出しで閉じた後の処理
   * @public
   */
  modalClose(callback: null): void {
    this._hideModal(callback);
  }

  /**
   * @desc 手動呼び出しでポジション補正
   * @public
   */
  modalSetPos(): void {
    this._setPosAndHeight();
  }
}
