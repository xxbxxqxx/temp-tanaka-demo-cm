import * as React from 'react';
// importを追記
import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import Moment from 'react-moment';
import { useIntl, Link, changeLocale } from 'gatsby-plugin-react-intl';
// componentsを追記
import Layout from '../components/layout';
import SEO from '../components/seo';
import nl2br from '../components/extend/nl2br';
import language from '../components/extend/language';

const NotFoundPage = ({ location }) => {
  // 多言語設定
  //const intl = useIntl()
  return (
    <Layout>
      {/* meta要素 */}
      {/* (NULLの場合はgatsby-config.jsのsiteMetadataを使用する) */}
      <SEO
        title="404: Not Found"
        description=""
        keyword=""
        site_name=""
        url=""
        og_title=""
        og_type=""
        og_image=""
      />
      <div className="g-container">
        <main className="g-pageMain" role="main">
          <div className="l-container">
            <div className="u-mt-x5">
              <h1 className="c-headingLv1">404: Not Found</h1>
              <p className="c-text">Not Found Page</p>
            </div>
            <div className="u-mt-x5 u-ta-right">
              <p className="c-pageTop" data-js-localscroll>
                <a href="#top">
                  <img
                    className="i-label i-label-left"
                    src="/assets/img/icons/ic_tri_up.svg"
                    alt=""
                  />
                  PAGE TOP
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

export default NotFoundPage;
