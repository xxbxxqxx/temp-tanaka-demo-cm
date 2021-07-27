import * as React from 'react';
// importを追記
import PropTypes from 'prop-types';
import { useIntl, Link } from 'gatsby-plugin-react-intl';
// componentsを追記

const Footer = ({ siteTitle }) => {
  // 多言語設定
  const intl = useIntl();
  return (
    <footer className="g-footer" role="contentinfo">
      <div className="g-footerNav">
        <div className="g-footer_inner">
          <div className="l-tile l-tile-4-lg l-tile-1-md l-tile-1-sm">
            <div className="l-tile_item">
              <p className="g-footerNav_parent">
                <a
                  className="g-footerNav_parentLink"
                  href={'/' + intl.locale + '/who/'}
                >
                  {intl.formatMessage({ id: 'sitesetting.header.who' })}
                </a>
              </p>
              <ul className="g-footerNav_list">
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/who/management/'}
                  >
                    {intl.formatMessage({ id: 'who_management.title' })}
                  </a>
                </li>
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/who/message/'}
                  >
                    {intl.formatMessage({ id: 'who_message.title' })}
                  </a>
                </li>
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/who/leadership/'}
                  >
                    {intl.formatMessage({ id: 'who_leadership.title' })}
                  </a>
                </li>
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/who/profile/'}
                  >
                    {intl.formatMessage({ id: 'who_profile.title' })}
                  </a>
                </li>
              </ul>
            </div>
            <div className="l-tile_item">
              <p className="g-footerNav_parent">
                <a
                  className="g-footerNav_parentLink"
                  href={'/' + intl.locale + '/newsroom/'}
                >
                  {intl.formatMessage({ id: 'sitesetting.header.newsroom' })}
                </a>
              </p>
              <ul className="g-footerNav_list">
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/newsroom/press/'}
                  >
                    {intl.formatMessage({ id: 'newsroom.body.press' })}
                  </a>
                </li>
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/newsroom/financial/'}
                  >
                    {intl.formatMessage({ id: 'newsroom.body.financial' })}
                  </a>
                </li>
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/newsroom/business/'}
                  >
                    {intl.formatMessage({ id: 'newsroom.body.business' })}
                  </a>
                </li>
                <li className="g-footerNav_listItem">
                  <a
                    className="g-footerNav_listItemLink"
                    href={'/' + intl.locale + '/newsroom/other/'}
                  >
                    {intl.formatMessage({ id: 'newsroom.body.other' })}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="g-footer_separator">
        <div className="g-footer_inner">
          <p className="g-footer_copyright">
            <small className="g-footer_copyrightText">
              © Recruit Holdings Co., Ltd.
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
