import * as React from 'react';
// importを追記
//import { useStaticQuery, graphql } from 'gatsby';
//import { StaticImage } from 'gatsby-plugin-image';
import { useIntl, Link } from 'gatsby-plugin-react-intl';
//import Moment from 'react-moment';
// componentsを追記
import Layout from '../components/layout';
import SEO from '../components/seo';
//import nl2br from '../components/extend/nl2br';
//import language from '../components/extend/language';

const Page = ({ location, pageContext }) => {
  // 多言語設定
  const intl = useIntl();
  return (
    <Layout>
      {/* meta要素 */}
      {/* localesに日英のmetaを定義して呼び出し */}
      <SEO
        lang={intl.locale}
        title={intl.formatMessage({ id: 'sitesetting.meta.sitename' })}
        description={intl.formatMessage({ id: 'sitesetting.meta.description' })}
        keyword={intl.formatMessage({ id: 'sitesetting.meta.keyword' })}
        site_name={intl.formatMessage({ id: 'sitesetting.meta.sitename' })}
        url={location.href}
        og_title={intl.formatMessage({ id: 'sitesetting.meta.sitename' })}
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
                {intl.formatMessage({ id: 'samplepage.body.head1' })}
              </h1>
              <p className="c-text">
                {intl.formatMessage({ id: 'samplepage.body.text1' })}
              </p>
              <h2 className="c-headingLv2">
                {intl.formatMessage({ id: 'samplepage.body.head2' })}
              </h2>
              <p className="c-text">
                {intl.formatMessage({ id: 'samplepage.body.text2' })}
              </p>
              <h3 className="c-headingLv3">
                {intl.formatMessage({ id: 'samplepage.body.head3' })}
              </h3>
              <p className="c-text">
                {intl.formatMessage({ id: 'samplepage.body.text3' })}
              </p>
            </div>
            <div className="u-mt-x5">
              <p className="c-text">
                <Link to={'/'}>
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
      {/* /html要素 */}
    </Layout>
  );
};

export default Page;
