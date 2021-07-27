import * as React from 'react';
// importを追記
import PropTypes from 'prop-types';
import { useIntl, Link } from 'gatsby-plugin-react-intl';
// componentsを追記
import language from '../components/extend/language';

const Header = ({ siteTitle, publish_setting }) => {
  // 多言語設定
  const intl = useIntl();
  return (
    <header role="banner" className="g-header" data-js-hamburger data-js-header>
      <div className="g-header_fog" data-js-hamburger-overlay></div>
      <div className="g-header_inner">
        <div className="g-header_root">
          <div
            className="g-headerTitle"
            style={{
              width: `45%`
            }}
          >
            <div className="g-headerLogo">
              <a className="g-headerLogo_link" href={'/' + intl.locale + '/'}>
                <div
                  className="g-headerLogo_tagline"
                  style={{
                    lineHeight: `0`
                  }}
                >
                  {intl.formatMessage({
                    id: 'sitesetting.header.siteshoulder'
                  })}
                </div>
                <div
                  className="g-headerLogo_img"
                  style={{
                    fontSize: `1.5em`
                  }}
                >
                  {intl.formatMessage({ id: 'sitesetting.header.sitename' })}
                </div>
              </a>
            </div>
            <div className="g-headerSwitch" data-js-hamburger-switch>
              <p className="g-headerSwitch_icon">
                <a
                  className="g-headerSwitch_iconLink g-headerSwitch_iconLink-search"
                  href="#"
                  data-js-hamburger-trigger="lang"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <img
                    className="i-button is-close"
                    src="/assets/img/icons/ic_globe.svg"
                    alt="言語切替メニューを開く"
                  />
                  <img
                    className="i-button is-open"
                    src="/assets/img/icons/ic_close.svg"
                    alt="言語切替メニューを閉じる"
                  />
                </a>
              </p>
              <p className="g-headerSwitch_icon">
                <a
                  className="g-headerSwitch_iconLink g-headerSwitch_iconLink-hamburger"
                  href="#"
                  data-js-hamburger-trigger="menu"
                  aria-haspopup="false"
                  aria-expanded="false"
                >
                  <img
                    className="i-button is-close"
                    src="/assets/img/icons/ic_menu.svg"
                    alt="メニューを開く"
                  />
                  <img
                    className="i-button is-open"
                    src="/assets/img/icons/ic_close.svg"
                    alt="メニューを閉じる"
                  />
                </a>
              </p>
            </div>
          </div>
          <div className="g-headerMenu" data-js-dropdown>
            <div
              className="g-headerMenu_inner"
              data-js-hamburger-content=""
              aria-hidden="false"
            >
              <div className="g-headerMenu_root">
                <nav className="g-headerNav" data-js-hamburger-category="menu">
                  <ul className="g-headerNav_list">
                    <li className="g-headerNav_listItem">
                      <a
                        className="g-headerNav_listItemLink"
                        href={'/' + intl.locale + '/'}
                      >
                        {intl.formatMessage({ id: 'sitesetting.header.home' })}
                      </a>
                    </li>
                    <li
                      className="g-headerNav_listItem g-headerNavDropdown"
                      data-js-dropdown-wrapper
                    >
                      <a
                        className="g-headerNav_listItemLink g-headerNav_listItemLink"
                        href={'/' + intl.locale + '/who/'}
                      >
                        {intl.formatMessage({ id: 'sitesetting.header.who' })}
                      </a>
                    </li>
                    <li className="g-headerNav_listItem">
                      <a
                        className="g-headerNav_listItemLink g-headerNav_listItemLink"
                        href={'/' + intl.locale + '/newsroom/'}
                      >
                        {intl.formatMessage({
                          id: 'sitesetting.header.newsroom'
                        })}
                      </a>
                    </li>
                  </ul>
                </nav>
                <div className="g-headerLang" data-js-hamburger-category="lang">
                  {language(publish_setting)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string
};

Header.defaultProps = {
  siteTitle: ``
};

export default Header;
