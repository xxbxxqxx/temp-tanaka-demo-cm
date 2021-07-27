/**
 * Elementsクラス
 */

//--------------------------------------------------------------------------
//  Import
//--------------------------------------------------------------------------
import Util from '@src/assets/ts/core/Util';

//--------------------------------------------------------------------------
//  Class Definition
//--------------------------------------------------------------------------
/**
 * DOM操作系の基本メソッド
 * @version 1.0.0
 */
export default class Elements {
  constructor() {
    // empty
  }

  //-------------------------------------------------
  // Public Methods
  //-------------------------------------------------
  /**
   * @desc 対象の要素に、CSSクラスを追加する
   * @param {NodeList|HTMLCollection|HTMLElement} els - 対象の要素
   * @param {string} className - 追加するCSSクラス名
   * @public
   */
  static addClass(
    els: NodeList | HTMLCollection | HTMLElement | Element,
    className: string
  ): void {
    if (className === '' || className === undefined || className === null)
      return;
    const add = el => {
      if (el.classList) {
        el.classList.add(className);
      } else {
        el.className += '' + className;
      }
    };
    //NodeList or HTMLCollection
    if (Util.isType('nodelist', els) || Util.isType('htmlcollection', els)) {
      Array.from(els as NodeList | HTMLCollection).forEach(el => {
        add(el);
      });
      //HTMLElement
    } else {
      add(els);
    }
    return;
  }

  /**
   * @desc 対象の要素から、CSSクラスを削除する
   * @param {NodeList|HTMLCollection|HTMLElement} els - 対象の要素
   * @param {string} className - 削除するCSSクラス名
   * @public
   */
  static removeClass(
    els: NodeList | HTMLCollection | HTMLElement | Element,
    className: string
  ): void {
    if (className === '' || className === undefined || className === null)
      return;
    const remove = el => {
      if (el.classList) {
        el.classList.remove(className);
      } else {
        el.className = el.className.replace(
          new RegExp(
            '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
            'gi'
          ),
          ' '
        );
      }
    };
    //NodeList or HTMLCollection
    if (Util.isType('nodelist', els) || Util.isType('htmlcollection', els)) {
      Array.from(els as NodeList | HTMLCollection).forEach(el => {
        remove(el);
      });
      //HTMLElement
    } else {
      remove(els);
    }
    return;
  }

  /**
   * @desc 指定したCSSクラスが要素に無ければ追加し、あれば削除する
   * @param {NodeList|HTMLCollection|HTMLElement} els - 対象の要素
   * @param {string} className - 指定または削除するCSSクラス名
   * @public
   */
  static toggleClass(
    els: NodeList | HTMLCollection | HTMLElement,
    className: string
  ): void {
    const toggle = el => {
      if (el.classList) {
        el.classList.toggle(className);
      } else {
        const classes = el.className.split(' ');
        const existingIndex = classes.indexOf(className);

        if (existingIndex >= 0) {
          classes.splice(existingIndex, 1);
        } else {
          classes.push(className);
        }

        el.className = classes.join(' ');
      }
    };
    //NodeList or HTMLCollection
    if (Util.isType('nodelist', els) || Util.isType('htmlcollection', els)) {
      Array.from(els as NodeList | HTMLCollection).forEach(el => {
        toggle(el);
      });
      //HTMLElement
    } else {
      toggle(els);
    }
    return;
  }

  /**
   * @desc 指定されたクラスの値が要素の class 属性に存在するか否か
   * @param {NodeList|HTMLCollection|HTMLElement} els - 対象の要素
   * @param {string} className - 検索するCSSクラス名
   * @return {boolean} - 対象の要素のclass属性にclassNameが存在する場合はtrue
   * @public
   */
  static hasClass(
    els: NodeList | HTMLCollection | HTMLElement | Element,
    className: string
  ): boolean {
    const judgClass = el => {
      if (el.classList) {
        return el.classList.contains(className);
      } else {
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(
          el.className
        );
      }
    };

    //NodeList or HTMLCollection
    if (Util.isType('nodelist', els) || Util.isType('htmlcollection', els)) {
      Array.from(els as NodeList | HTMLCollection).forEach((el, index) => {
        if (index === 0) {
          return judgClass(el);
        }
      });
      //HTMLElement
    } else {
      return judgClass(els);
    }
    return;
  }

  /**
   * @desc 対象の要素の前にコンテンツを挿入する
   * @param {HTMLElement} el - 対象の要素
   * @param {HTMLElement|string} target - 追加する要素、またはセレクタ名
   * @public
   */
  static before(el: HTMLElement, target: string | HTMLElement): void {
    //String
    if (Util.isType('string', target)) {
      el.insertAdjacentHTML('beforebegin', target as string);
      //HTMLElement
    } else {
      el.parentNode.insertBefore(target as HTMLElement, el);
    }
    return;
  }

  /**
   * @desc 対象の要素の後ろにコンテンツを挿入する
   * @param {HTMLElement} el - 対象の要素
   * @param {HTMLElement|string} target - 追加する要素、またはセレクタ名
   * @public
   */
  static after(el: HTMLElement, target: HTMLElement | string): void {
    //String
    if (Util.isType('string', target)) {
      el.insertAdjacentHTML('afterend', target as string);
      //HTMLElement
    } else {
      if (el.nextElementSibling !== null) {
        el.parentNode.insertBefore(
          target as HTMLElement,
          el.nextElementSibling
        );
      } else {
        el.parentNode.appendChild(target as HTMLElement);
      }
    }
  }

  /**
   * @desc 対象の要素の子ノードとして一番前にコンテンツを挿入する
   * @param {HTMLElement} el - 対象の要素
   * @param {HTMLElement|string} target - 追加する要素、またはセレクタ名
   * @public
   */
  static prepend(el: HTMLElement, target: HTMLElement | string): void {
    //String
    if (Util.isType('string', target)) {
      el.insertAdjacentHTML('afterbegin', target as string);
      //HTMLElement
    } else {
      el.insertBefore(target as HTMLElement, el.firstChild);
    }
  }

  /**
   * @desc 対象の要素の子ノードとして一番後ろにコンテンツを挿入する
   * @param {HTMLElement} el - 対象の要素
   * @param {HTMLElement|string} target - 追加する要素、またはセレクタ名
   * @public
   */
  static append(el: HTMLElement, target: HTMLElement | string): void {
    //String
    if (Util.isType('string', target)) {
      el.insertAdjacentHTML('beforeend', target as string);
      //HTMLElement
    } else {
      el.appendChild(target as HTMLElement);
    }
  }

  /**
   * @desc 対象の要素が持つ全子孫要素から、指定のCSSセレクターに一致する要素を返す
   * @param {HTMLElement} el - 対象の要素
   * @param {String} selector - el内で検索したいセレクタ
   * @return {NodeList} 一致する要素
   * @public
   */
  static find(el: HTMLElement, selector: string): NodeList {
    return el.querySelectorAll(selector as string);
  }

  //TODO: 動作確認
  // static filter(selector, filterFn) {
  //   return [].filter.call(
  //     document.querySelectorAll(selector),
  //     filterFn
  //   );
  // }

  /**
   * @desc 対象の要素集合から、指定のCSSセレクターに一致する要素を返す
   * @param {NodeList|HTMLCollection} els - 対象の要素集合
   * @param {string} selector - els内で検索したいセレクタ
   * @return {NodeList} 一致する要素
   * @public
   */
  static filter(
    els: NodeList | HTMLCollection,
    selector: string
  ): Node[] | HTMLElement[] {
    let list: Node[] | HTMLElement[] = Array.from(els);
    const targetElm = Array.from(document.querySelectorAll(selector));

    list = list.filter((listItem: Element) => {
      return targetElm.indexOf(listItem) !== -1;
    });

    return list;
  }

  /**
   * @desc 対象の要素の次以降にある兄弟要素を全て返す
   * @param {HTMLElement} el - 対象の要素
   * @param {?string} selector=null - 絞り込みたいセレクタ
   * @return {NodeList} 一致する要素
   * @public
   */
  static nextAll(el: HTMLElement, selector = null): Array<Node> {
    // let list = [];
    let list = [];
    let nextElm = el.nextElementSibling;

    while (nextElm && nextElm.nodeType === 1) {
      list.push(nextElm);
      nextElm = nextElm.nextElementSibling;
    }

    if (selector !== null && list.length > 0) {
      const targetElm = Array.from(document.querySelectorAll(selector));

      list = list.filter(listItem => {
        return targetElm.indexOf(listItem) !== -1;
      });
    }
    return list;
  }

  /**
   * @desc 対象の要素の前以前にある兄弟要素を全て返す
   * @param {HTMLElement} el - 対象の要素
   * @param {?string} selector=null - 絞り込みたいセレクタ
   * @return {NodeList} 一致する要素
   * @public
   */
  static prevAll(el: HTMLElement, selector = null): Array<Node> {
    let list = [];
    let prevElm = el.previousElementSibling;

    while (prevElm && prevElm.nodeType === 1) {
      list.push(prevElm);
      prevElm = prevElm.previousElementSibling;
    }

    if (selector !== null && list.length > 0) {
      const targetElm = Array.from(document.querySelectorAll(selector));

      list = list.filter(listItem => {
        return targetElm.indexOf(listItem) !== -1;
      });
    }
    return list;
  }

  /**
   * @desc 兄弟要素の取得
   * @param {HTMLElement} el - 対象の要素
   * @param {?string} selector=null - 絞り込みたいセレクタ
   * @return {NodeList} 一致する要素
   * @public
   */
  static siblings(el: HTMLElement, selector = null): NodeList {
    let list = el.parentNode.children;
    if (selector !== null && list.length > 0) {
      const targetElm = Array.from(document.querySelectorAll(selector));

      list = [].filter.call(list, listItem => {
        return targetElm.indexOf(listItem) !== -1;
      });
    }
    return [].filter.call(list, listItem => {
      return listItem !== el;
    });
  }

  /**
   * @desc 対象の要素集合から検索する要素（セレクタ）のindex値の取得
   * @param {NodeList|HTMLCollection} els - 対象の要素
   * @param {Object|string} target 検索する要素、またはセレクタ
   * @return {number} index値
   * @public
   */
  static index(
    els: NodeList | HTMLCollection | Node[],
    target: Element | string
  ): number {
    const elsList: Node[] | Element[] = Array.from(els);
    if (Util.isType('string', target)) {
      target = document.querySelector(target as string) as Element;
    }
    return [].indexOf.call(elsList, target);
  }

  /**
   * @desc 対象の要素が条件式に一致するか否か
   * @param {HTMLElement} el - 対象の要素
   * @param {?string} selector - 検査するセレクタ
   * @return {boolean} 一致する要素があればtrue
   * @public
   */
  static is(el: HTMLElement, selector: string): boolean {
    return (
      el.matches ||
      el.msMatchesSelector ||
      el.webkitMatchesSelector
    ).call(el, selector);
  }

  /**
   * @desc 対象の要素が表示されているか否か
   * @param {HTMLElement} el - 対象の要素
   * @return {boolean} 表示されている場合はtrue
   * @public
   */
  static isVisible(el: HTMLElement): boolean {
    // console.log('offsetWidth: ' + el.offsetWidth);
    // console.log('offsetHeight: ' + el.offsetHeight);
    // console.log('getClientRectsLength: ' + el.getClientRects().length);
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  /**
   * @desc 対象の要素が非表示か否か
   * @param {HTMLElement} el - 対象の要素
   * @return {boolean} 非表示の場合はtrue
   * @public
   */
  static isHidden(el: HTMLElement): boolean {
    return !this.isVisible(el);
  }

  /**
   * @desc ページ内のtopとleftの座標を返す
   * @param {HTMLElement} el - 対象の要素
   * @return {Object} 座標が格納されたオブジェクト
   * @property {number} top ページ内のtopの座標
   * @property {number} left ページ内のleftの座標
   * @public
   */
  static offset(el: HTMLElement): { top: number; left: number } {
    const rect = el.getBoundingClientRect();
    const supportScroll = window.scrollY === undefined;
    return {
      top: rect.top + (supportScroll ? window.pageYOffset : window.scrollY),
      left: rect.left + (supportScroll ? window.pageXOffset : window.scrollX)
    };
  }

  /**
   * @desc 親要素からのtopとleftの座標を返す
   * @param {HTMLElement} el - 対象の要素
   * @return {Object} 座標が格納されたオブジェクト
   * @property {number} top 親要素からのtopの座標
   * @property {number} left 親要素からのleftの座標
   * @public
   */
  static position(el: HTMLElement): { top: number; left: number } {
    return {
      top: el.offsetTop,
      left: el.offsetLeft
    };
  }

  /**
   * @desc 対象の要素をドキュメントから削除
   * @param {HTMLElement} el - 対象の要素
   * @public
   */
  static remove(el: HTMLElement): void {
    el.parentNode.removeChild(el);
  }

  /**
   * @desc 対象の要素に新しい属性を追加、または取得
   * @param {NodeList|HTMLCollection|HTMLElement} els - 対象の要素
   * @param {string} name - 属性名
   * @param {string} value - 属性の値
   * @return {string} 属性の値
   * @public
   */
  static attr(
    els: NodeList | HTMLCollection | HTMLElement,
    name: string,
    value = null
  ): string {
    let isGet: string | boolean = false;
    const attrMethod = el => {
      if (value !== null) {
        el.setAttribute(name, value);
      } else {
        return el.getAttribute(name);
      }
    };

    //NodeList or HTMLCollection
    if (Util.isType('nodelist', els) || Util.isType('htmlcollection', els)) {
      Array.from(els as NodeList | HTMLCollection).forEach(el => {
        attrMethod(el);
      });
      //HTMLElement
    } else {
      isGet = attrMethod(els);
      if (isGet !== false && isGet !== undefined) {
        return isGet as string;
      }
    }
  }

  /**
   * @desc 要素に適用されたすべてのCSSプロパティが格納されたオブジェクトを取得
   * @param {HTMLElement} el - 対象の要素
   * @return {Object} スタイルオブジェクト
   * @public
   */
  static getStyle(el: HTMLElement): CSSStyleDeclaration {
    return window.getComputedStyle(el, null);
  }

  /**
   * @desc データ属性値による要素の取得
   * @param {Array<HTMLElement>} elements 検索対象の要素群
   * @param {string} attrValue 属性値
   * @param {string} targetAttr 属性名
   * @public
   */
  static filterByAttributeValue(
    elements: Array<HTMLElement>,
    attrValue: string,
    targetAttr: string
  ): Array<HTMLElement> {
    if (!elements || elements.length < 1) {
      return;
    }

    const result = [];
    elements.forEach(el => {
      const formattedAttr = Util.toCamelcase(targetAttr.substr(5), false);
      if (el.dataset[formattedAttr] === attrValue) {
        result.push(el);
      }
    });

    return result;
  }
}
