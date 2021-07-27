import TabChange from '@src/assets/ts/module/cnt.tabchange';
import ViChanger from '@src/assets/ts/module/vichanger/cnt.vichanger';
import SimpleModal from '@src/assets/ts/module/cnt.simpleModal';
import Outside from '@src/assets/ts/module/cnt.outside';
import LocalScroll from '@src/assets/ts/module/cnt.localscroll';
import Accordion from '@src/assets/ts/module/cnt.accordion';
import GlobalHeaderNav from '@src/assets/ts/view/headernav';

//===================================== document ready
document.addEventListener('DOMContentLoaded', function () {
  //-------------------------------------------------
  // タブの設定
  //-------------------------------------------------
  const tabAreaWrapper = document.querySelectorAll('[data-js-tab]');

  Array.from(tabAreaWrapper).forEach((wrapper: HTMLElement) => {
    new TabChange(wrapper, {
      tabTrigger: '[data-js-tab-trigger]',
      tabContent: '[data-js-tab-content]',
      triggerActiveClass: 'c-tab_trigger-active',
      cntentActiveClass: 'c-tab_content-open',
      accessibilityFlag: true,
      beforeChange: null,
      endChange: null
    });
  });

  //-------------------------------------------------
  // モーダルの設定
  //-------------------------------------------------
  const modalTrigger = document.querySelectorAll('[data-js-modal-open]');

  Array.from(modalTrigger).forEach((trigger: HTMLElement, index: number) => {
    const modalModule = new SimpleModal(trigger, {
      closeSelector: '[data-js-modal-close]',
      duration: 400,
      easing: 'swing',
      bgFadeFlag: true,
      bgClickCloseFlag: true,
      fixedContentFlag: true,
      modalWindowMarginTopMin: 40,
      ajaxContentFlag: false,
      accessibilityFlag: true,
      beforeShowContent: function () {
        //タイミングによっては位置がズレるので、手動呼び出しでポジション補正
        this.modalSetPos();
      },
      afterShowContent: null,
      beforeHideContent: null,
      afterHideContent: null
    });
    // if (index === 0) {
    // 手動で開く
    // modalModule.modalOpen('#modal');
    // }
  });

  //-------------------------------------------------
  // 通知エリアの設定
  //-------------------------------------------------
  const outsideContainer = document.querySelectorAll('[data-js-outside]');

  Array.from(outsideContainer).forEach((container: HTMLElement) => {
    new Outside(container, {
      closeSelector: '[data-js-outside-close]',
      contentTransitionClass: 'c-outsideContainer-close',
      contentTransitionEndClass: 'c-outsideContainer-closed',
      contentNoTransitionClass: 'c-outsideContainer-notransition',
      transitionType: 'slide',
      accessibilityFlag: true,
      beforeClose: null,
      endClose: null
    });
  });

  //-------------------------------------------------
  // グローバルヘッダーナビゲーションの設定
  //-------------------------------------------------
  const headers = document.querySelectorAll('[data-js-header]');

  if (headers.length > 0) {
    Array.from(headers).forEach((header: HTMLElement) => {
      new GlobalHeaderNav(header);
    });
  }

  //-------------------------------------------------
  // カルーセルの設定
  //-------------------------------------------------
  const viContainer = document.querySelectorAll('[data-js-vi]');

  Array.from(viContainer).forEach(container => {
    let viChangeType = container.getAttribute('data-js-vi');
    viChangeType = viChangeType === 'fade' ? 'fade' : 'slide';

    new ViChanger(container, {
      mainViewAreaSelector: '[data-js-vi_body]', // 表示エリアの横幅を取得するためのセレクタ(changeType: 'slide'の場合は必須)
      mainWrapperSelector: '[data-js-vi_main]', // メイン画像のラッパーセレクタ
      naviWrapperSelector: '[data-js-vi_nav]', // ナビゲーションのラッパーセレクタ
      prevBtnSelector: '[data-js-vi_prev]', // PREVボタンのラッパーセレクタ
      nextBtnSelector: '[data-js-vi_next]', // NEXTボタンのラッパーセレクタ
      pauseBtnSelector: '[data-js-vi_pause]', // 一時停止ボタンのラッパーセレクタ
      changeType: viChangeType, // メイン画像切り替えタイプ（'slide' or 'fade'）
      fadeType: '03', // フェードタイプ（changeTypeがfadeの場合に有効）'01': クロスフェード、'02': カレントを非表示にしてからフェードイン、'03': カレントの上にかぶせてフェードイン、'04': カレントがフェードアウトしてからフェードイン
      naviTriggerEvent: 'click', // ナビゲーションのトリガイベント（'click' or 'mouseover' or null）
      naviActiveClassName: 'c-carousel_dot-active', // ナビゲーションのアクティブ状態を表すクラス名
      mainActiveClassName: 'is-active', // メインリストのアクティブ状態を表すクラス名（nullの場合はクラス付与なし）
      pauseActiveClassName: 'c-carousel_pause-active', // 一時停止ボタンのアクティブ状態を表すクラス名
      btnDisabledClassName: 'is-disabled', // NEXT・PREVボタン非活性化状態を表すクラス名（circularがfalseの場合に有効）
      duration: 1000, // アニメーション時間をミリ秒単位で指定
      easing: 'swing', // 切り替えアニメーションのeasing設定（'swing' or 'linear'）
      auto: 5000, // 自動切り替えまでの時間をミリ秒単位で指定。nullの場合は自動切り替えなし。Arrayで個別設定も可能。
      circular: true, // 切り替えループ処理
      startIndex: 0, // 初期表示画像インデックス
      hoverTimerStop: true, // ホバーアクションによるタイマー停止処理をするか否か
      swipeFlag: true, // スワイプ機能
      visible: 1, // スライドエリアに表示する数
      scroll: 1, // スライドする数
      centerMode: false, // カレントをセンターに配置するか否か（circularがtrueの場合に有効）
      liquidLayoutFlag: true, // リキッドレイアウトにするか否か（メディアクエリ別に設定するoptions.responsiveがnullの場合に有効）
      responsive: null, // メディアクエリ別の設定をArrayで指定
      accessibilityFlag: true // アクセシビリティ対応するか否か
    });
  });

  // ナビと連動するカルーセル
  const syncSlideContainer = document.querySelectorAll('[data-js-sync-slide]');

  Array.from(syncSlideContainer).forEach(container => {
    const viContainerSlideFor = container.querySelector(
      '[data-js-sync-slide-vi="slide_for"]'
    );
    const viModuleSlideFor = new ViChanger(viContainerSlideFor, {
      mainViewAreaSelector: '[data-js-vi_body]', // 表示エリアの横幅を取得するためのセレクタ(changeType: 'slide'の場合は必須)
      mainWrapperSelector: '[data-js-vi_main]', // メイン画像のラッパーセレクタ
      prevBtnSelector: '[data-js-vi_prev]', // PREVボタンのラッパーセレクタ
      nextBtnSelector: '[data-js-vi_next]', // NEXTボタンのラッパーセレクタ
      changeType: 'slide', // メイン画像切り替えタイプ（'slide' or 'fade'）
      mainActiveClassName: 'is-active', // メインリストのアクティブ状態を表すクラス名（nullの場合はクラス付与なし）
      btnDisabledClassName: 'is-disabled', // NEXT・PREVボタン非活性化状態を表すクラス名（circularがfalseの場合に有効）
      duration: 400, // アニメーション時間をミリ秒単位で指定
      easing: 'swing', // 切り替えアニメーションのeasing設定（'swing' or 'linear'）
      auto: null, // 自動切り替えまでの時間をミリ秒単位で指定。nullの場合は自動切り替えなし。Arrayで個別設定も可能。
      circular: true, // 切り替えループ処理
      startIndex: 0, // 初期表示画像インデックス
      hoverTimerStop: true, // ホバーアクションによるタイマー停止処理をするか否か
      swipeFlag: true, // スワイプ機能
      visible: 1, // スライドエリアに表示する数
      scroll: 1, // スライドする数
      otherViSyncFlag: true, // 他のVIとsyncさせるか
      liquidLayoutFlag: true, // リキッドレイアウトにするか否か（メディアクエリ別に設定するoptions.responsiveがnullの場合に有効）
      accessibilityFlag: true, // アクセシビリティ対応するか否か
      onChange: function (prevFlag) {
        viModuleSlideNav.changeSlideFromMain(prevFlag, this.scroll);
      }
      // mainClickChange: function (prevFlag, scroll) {},
      // naviClickChange: function (targetOriginalIndex) {},
      // beforeSlideContent: function (targetIndex, targetOriginalIndex) {},
      // endSlideContent: function (targetIndex, targetOriginalIndex) {}
    });

    const viContainerSlideNav = container.querySelector(
      '[data-js-sync-slide-vi="slide_nav"]'
    );
    const viModuleSlideNav = new ViChanger(viContainerSlideNav, {
      mainViewAreaSelector: '[data-js-vi_body]', // 表示エリアの横幅を取得するためのセレクタ(changeType: 'slide'の場合は必須)
      mainWrapperSelector: '[data-js-vi_main]', // メイン画像のラッパーセレクタ
      changeType: 'slide', // メイン画像切り替えタイプ（'slide' or 'fade'）
      mainActiveClassName: 'is-active', // メインリストのアクティブ状態を表すクラス名（nullの場合はクラス付与なし）
      duration: 400, // アニメーション時間をミリ秒単位で指定
      easing: 'swing', // 切り替えアニメーションのeasing設定（'swing' or 'linear'）
      auto: null, // 自動切り替えまでの時間をミリ秒単位で指定。nullの場合は自動切り替えなし。Arrayで個別設定も可能。
      circular: true, // 切り替えループ処理
      startIndex: 0, // 初期表示画像インデックス
      hoverTimerStop: false, // ホバーアクションによるタイマー停止処理をするか否か
      swipeFlag: true, // スワイプ機能
      visible: 5, // スライドエリアに表示する数
      scroll: 1, // スライドする数
      centerMode: false, // カレントをセンターに配置するか否か（circularがtrueの場合に有効）
      otherViSyncFlag: true, // 他のVIとsyncさせるか
      liquidLayoutFlag: true, // リキッドレイアウトにするか否か（メディアクエリ別に設定するoptions.responsiveがnullの場合に有効）
      accessibilityFlag: true, // アクセシビリティ対応するか否か
      // onChange: function (prevFlag) {
      // viModuleSlideFor.changeSlideFromMain(prevFlag, this.scroll);
      // },
      mainClickChange: function (prevFlag, scroll) {
        viModuleSlideFor.changeSlideFromMain(prevFlag, scroll);
        this.changeSlideFromMain(prevFlag, scroll);
      }
      // naviClickChange: function (targetOriginalIndex) {},
      // beforeSlideContent: function (targetIndex, targetOriginalIndex) {},
      // endSlideContent: function (targetIndex, targetOriginalIndex) {}
    });
  });

  //-------------------------------------------------
  // ローカルスクロールの設定
  //-------------------------------------------------
  const localScrollTrigger = document.querySelectorAll('[data-js-localscroll]');

  Array.from(localScrollTrigger).forEach((trigger: HTMLElement) => {
    new LocalScroll(trigger, {
      offset: -20,
      duration: 1000,
      easing: 'easeOutExpo'
      // endScroll: function (target: HTMLElement[]) {
      // スクロール後の処理
      //   alert(`id: ${target[0].id}にスクロールしました`);
      // }
    });
  });

  //-------------------------------------------------
  // アコーディオンの設定
  //-------------------------------------------------
  const accordionContainer = document.querySelectorAll('[data-js-accordion]');

  Array.from(accordionContainer).forEach((container: HTMLElement) => {
    new Accordion(container, {
      wrapperSelector: '[data-js-accordion-wrapper]',
      triggerSelector: '[data-js-accordion-trigger]',
      contentSelector: '[data-js-accordion-content]',
      triggerClass: { opened: 'c-accordion-open', closed: 'c-accordion-close' },
      toggleTriggerTxt: { opened: null, closed: null },
      transitionType: 'slide',
      defaultStatus: '',
      multiSelectableFlag: true,
      initialOpenWrapperClass: 'is-open',
      initialOpenTransitionFlag: false,
      initialOpenTransitionDelay: 500,
      accessibilityFlag: true,
      beforeOpen: null,
      endOpen: null,
      beforeClose: null,
      endClose: null,
      syncOpenAnimation: false
    });
  });
});
