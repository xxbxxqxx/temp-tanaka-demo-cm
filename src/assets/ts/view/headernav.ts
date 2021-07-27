/**
 * GlobalHeaderNavクラス
 */
//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import HamburgerMenu from '@src/assets/ts/module/cnt.hamburgerMenu';
import DropdownMenu from '@src/assets/ts/module/cnt.dropdownMenu';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
export default class GlobalHeaderNav {
  displayMode: string;
  accessibilityFlag: boolean;
  hamburgerArea: HTMLElement;
  hamburgerSwitch: HTMLElement;
  hamburgerTrigger: HTMLElement;
  hamburgerContent: HTMLElement;
  hamburgerMenu: HamburgerMenu | null;
  dropdownArea: HTMLElement;
  dropdownMenu: DropdownMenu | null;

  constructor(header: HTMLElement) {
    if (!header) return;

    /**
     * accessibilityFlag アクセシビリティ対応するか否か
     * @type {boolean}
     * @protected
     */
    this.accessibilityFlag = true;

    /**
     * displayMode 表示モード（'pc' or 'sp'）
     * @type {string}
     * @protected
     */
    this.displayMode;

    /**
     * HamburgerMenu クラス
     * @type {HamburgerMenu}
     * @protected
     */
    this.hamburgerMenu = null;

    /**
     * DropdownMenu クラス
     * @type {DropdownMenu}
     * @protected
     */
    this.dropdownMenu = null;

    /**
     * ヘッダー要素
     * @type {HTMLElement}
     * @protected
     */
    this.hamburgerArea = header;

    /**
     * ハンバーガーメニュートリガー群
     * @type {HTMLElement}
     * @protected
     */
    this.hamburgerSwitch = this.hamburgerArea.querySelector(
      '[data-js-hamburger-switch]'
    );

    /**
     * ハンバーガーメニュートリガー要素
     * @type {HTMLElement}
     * @protected
     */
    this.hamburgerTrigger = this.hamburgerArea.querySelector(
      '[data-js-hamburger-trigger]'
    );

    /**
     * ハンバーガーメニューコンテンツ要素
     * @type {HTMLElement}
     * @protected
     */
    this.hamburgerContent = this.hamburgerArea.querySelector(
      '[data-js-hamburger-content]'
    );

    /**
     * ドロップダウン要素
     * @type {HTMLElement}
     * @protected
     */
    this.dropdownArea = this.hamburgerArea.querySelector('[data-js-dropdown]');

    this.init();
  }

  /**
   * _init()：初期化
   * @private
   */
  init(): void {
    if (
      // :hidden 判定
      this.hamburgerSwitch.offsetWidth <= 0 ||
      this.hamburgerSwitch.offsetHeight <= 0
    ) {
      if (this.displayMode !== 'pc') {
        this.displayMode = 'pc';
        this._initPC();
      }
    } else {
      if (this.displayMode !== 'sp') {
        this.displayMode = 'sp';
        this._initSP();
      }
    }

    window.addEventListener('orientationchange', () => {
      if (
        // :hidden 判定
        this.hamburgerSwitch.offsetWidth <= 0 ||
        this.hamburgerSwitch.offsetHeight <= 0
      ) {
        if (this.displayMode !== 'pc') {
          this.displayMode = 'pc';
          this._initPC();
        }
      } else {
        if (this.displayMode !== 'sp') {
          this.displayMode = 'sp';
          this._initSP();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (
        // :hidden 判定
        this.hamburgerSwitch.offsetWidth <= 0 ||
        this.hamburgerSwitch.offsetHeight <= 0
      ) {
        if (this.displayMode !== 'pc') {
          this.displayMode = 'pc';
          this._initPC();
        }
      } else {
        if (this.displayMode !== 'sp') {
          this.displayMode = 'sp';
          this._initSP();
        }
      }
    });
  }

  /**
   * _initPC()：PC画面初期化
   * @private
   */
  private _initPC(): void {
    //アクセシビリティ対応
    if (this.accessibilityFlag) {
      this.hamburgerTrigger.setAttribute('aria-haspopup', 'false');
      this.hamburgerTrigger.setAttribute('aria-expanded', 'false');
      this.hamburgerTrigger.setAttribute('aria-hidden', 'true');
    }

    //ハンバーガーメニュー機能をオフにする
    if (this.hamburgerMenu) {
      this.hamburgerMenu.destroy();
      this.hamburgerMenu = null;
    }

    //ドロップダウンメニュー初期化
    if (this.dropdownMenu) {
      this.dropdownMenu.manualAllClose();
      this.dropdownMenu.destroy();
    }

    this.dropdownMenu = new DropdownMenu(this.dropdownArea, {
      wrapperSelector: '[data-js-dropdown-wrapper]',
      triggerSelector: '[data-js-dropdown-trigger]',
      contentSelector: '[data-js-dropdown-content]',
      triggerClass: { opened: 'is-active', closed: '' },
      toggleTriggerTxt: { opened: null, closed: null },
      transitionType: 'slide',
      defaultStatus: 'closed',
      multiSelectableFlag: false,
      syncCloseAnimation: false,
      syncOpenAnimation: false,
      initialOpenWrapperClass: 'is-open',
      initialOpenTransitionFlag: false,
      initialOpenTransitionDelay: 500,
      documentClickCloseFlag: false,
      accessibilityFlag: this.accessibilityFlag,
      beforeOpen: null,
      beforeClose: null,
      endClose: null,
      endOpen: function () {
        const dropdownArea = this.element;
        const searchTrigger = dropdownArea.querySelector(
          '[data-js-search-trigger]'
        );
        if (!searchTrigger) return;

        //検索エリアの場合はフォーカスを当てる
        const searchInput = dropdownArea.querySelector(
          '[data-js-search-input]'
        );
        if (searchInput) {
          searchInput.focus();
        }
      }
    });
  }

  /**
   * _initSP()：SP画面初期化
   * @private
   */
  private _initSP(): void {
    //アクセシビリティ対応
    if (this.accessibilityFlag) {
      this.hamburgerTrigger.setAttribute('aria-haspopup', 'true');
      this.hamburgerTrigger.setAttribute('aria-expanded', 'true');
      this.hamburgerTrigger.setAttribute('aria-hidden', 'false');
    }

    //ドロップダウンメニュー初期化
    if (this.dropdownMenu) {
      this.dropdownMenu.manualAllClose();
      this.dropdownMenu.destroy();
    }

    this.dropdownMenu = new DropdownMenu(this.dropdownArea, {
      wrapperSelector: '[data-js-dropdown-wrapper]',
      triggerSelector: '[data-js-dropdown-trigger]',
      contentSelector: '[data-js-dropdown-content]',
      triggerClass: { opened: 'is-active', closed: '' },
      toggleTriggerTxt: { opened: null, closed: null },
      transitionType: 'slide',
      defaultStatus: 'closed',
      multiSelectableFlag: true,
      syncCloseAnimation: false,
      syncOpenAnimation: false,
      initialOpenWrapperClass: 'is-open',
      initialOpenTransitionFlag: false,
      initialOpenTransitionDelay: 500,
      documentClickCloseFlag: false,
      accessibilityFlag: this.accessibilityFlag,
      beforeOpen: null,
      endOpen: null,
      beforeClose: null,
      endClose: null
    });

    const _initDropdown = () => {
      this.dropdownMenu.manualAllClose();
    };

    //ハンバーガーメニュー初期化
    if (this.hamburgerMenu) {
      this.hamburgerMenu.destroy();
      this.hamburgerMenu = null;
    }
    this.hamburgerMenu = new HamburgerMenu(this.hamburgerArea, {
      hamburgerSwitchSelectorName: '[data-js-hamburger-switch]',
      hamburgerTriggerSelectorName: '[data-js-hamburger-trigger]',
      hamburgerContentSelectorName: '[data-js-hamburger-content]',
      hamburgerCategorySelectorName: '[data-js-hamburger-category]',
      hamburgerOverlaySelectorName: '[data-js-hamburger-overlay]',
      dataAttrHamburgerArea: 'data-js-hamburger',
      dataAttrHamburgerTrigger: 'data-js-hamburger-trigger',
      dataAttrHamburgerContent: 'data-js-hamburger-content',
      dataAttrHamburgerCategory: 'data-js-hamburger-category',
      changeType: 'fade',
      dataAttrFixedHtml: 'data-js-fixed-html',
      dataAttrFixedBody: 'data-js-fixed-body',
      duration: 'normal',
      easing: 'swing',
      defaultStatus: 'closed',
      accessibilityFlag: this.accessibilityFlag,
      triggerClass: { opened: 'is-active', closed: '' },
      beforeOpen: function () {
        _initDropdown();
      }
    });
  }
}
