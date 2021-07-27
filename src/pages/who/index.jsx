import React from 'react';
// importを追記
import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import Moment from 'react-moment';
import { useIntl, Link, changeLocale } from 'gatsby-plugin-react-intl';
// componentsを追記
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import nl2br from '../../components/extend/nl2br';
import language from '../../components/extend/language';

const IndexPage = ({ location, pageContext }) => {
  // 多言語設定
  const intl = useIntl();
  return (
    <Layout>
      {/* meta要素 */}
      {/* localesに日英のmetaを定義して呼び出し */}
      <SEO
        lang={intl.locale}
        title={
          intl.formatMessage({ id: 'who.title' }) +
          ' | ' +
          intl.formatMessage({ id: 'sitesetting.meta.sitename' })
        }
        description={intl.formatMessage({ id: 'sitesetting.meta.description' })}
        keyword={intl.formatMessage({ id: 'sitesetting.meta.keyword' })}
        site_name={intl.formatMessage({ id: 'sitesetting.meta.sitename' })}
        url={location.href}
        og_title={
          intl.formatMessage({ id: 'who.title' }) +
          ' | ' +
          intl.formatMessage({ id: 'sitesetting.meta.sitename' })
        }
        og_type={intl.formatMessage({ id: 'sitesetting.meta.og_type' })}
        og_image={intl.formatMessage({ id: 'sitesetting.meta.og_image' })}
      />
      {/* /meta要素 */}
      {/* html要素 */}
      {/* localesに日英のテキストを定義して呼び出し */}
      <div className="g-container">
        <main className="g-pageMain" role="main">
          <div className="l-container">
            <div className="u-mt-x5">
              <h1 className="c-headingLv1">
                {intl.formatMessage({ id: 'who.title' })}
              </h1>
            </div>
            <div className="u-mt-x5">
              <h2 className="c-headingLv2">
                <Link to={`/who/`}>
                  {intl.formatMessage({ id: 'who.title' })}
                </Link>
              </h2>
              <ul className="c-list c-list-bullet">
                <li className="c-list_item">
                  <Link to={`/who/management/`}>
                    {intl.formatMessage({ id: 'who_management.title' })}
                  </Link>
                </li>
                <li className="c-list_item">
                  <Link to={`/who/message/`}>
                    {intl.formatMessage({ id: 'who_message.title' })}
                  </Link>
                </li>
                <li className="c-list_item">
                  <Link to={`/who/leadership/`}>
                    {intl.formatMessage({ id: 'who_leadership.title' })}
                  </Link>
                </li>
                <li className="c-list_item">
                  <Link to={`/who/profile/`}>
                    {intl.formatMessage({ id: 'who_profile.title' })}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="u-mt-x5">
              <p className="c-text">
                <Link to={`/`}>
                  {intl.formatMessage({ id: 'sitesetting.text.home' })}
                </Link>
              </p>
            </div>
            <div className="u-mt-x5 u-ta-right">
              <p className="c-pageTop" data-js-localscroll>
                <a href="#top">
                  <img
                    className="i-label i-label-left"
                    src="/assets/img/icons/ic_tri_up.svg"
                    alt=""
                  />
                  {intl.formatMessage({ id: 'sitesetting.text.pagetop' })}
                </a>
              </p>
            </div>
          </div>
          {/* /.l-container */}
        </main>
        {/* /.g-pageMain */}
      </div>
      {/* /.g-container */}
    </Layout>
  );
};

export default IndexPage;
