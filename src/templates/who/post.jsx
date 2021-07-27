import * as React from 'react';
// importを追記
import { Location } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { useIntl, Link, changeLocale } from 'gatsby-plugin-react-intl';
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import marked from "marked";
import Moment from 'react-moment';
// componentsを追記
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import nl2br from '../../components/extend/nl2br';

const Post = ({ data, location, pageContext }) => {
  // API取得
  const post = data.contentfulWho;
  // 多言語設定
  const intl = useIntl();
  // meta要素
  const site_name = intl.formatMessage({ id: 'sitesetting.meta.sitename' });
  const title = post.name
    ? post.name +
      ' | ' +
      intl.formatMessage({ id: 'sitesetting.meta.sitename' })
    : intl.formatMessage({ id: 'sitesetting.meta.sitename' });
  const description =
    post.description && post.description.description
      ? post.description.description
      : intl.formatMessage({ id: 'sitesetting.meta.description' });
  const keyword = post.keyword
    ? post.keyword
    : intl.formatMessage({ id: 'sitesetting.meta.keyword' });
  const og_type = 'article';
  const og_image =
    post.og_image && post.og_image.file && post.og_image.file.url
      ? post.og_image.file.url
      : intl.formatMessage({ id: 'sitesetting.meta.og_image' });
  // 詳細ページを表示
  return (
    <Layout publish_setting={{ en: true, ja: true }}>
      {/* meta要素 */}
      {/* (NULLの場合はgatsby-config.jsのsiteMetadataを使用する) */}
      <SEO
        lang={intl.locale}
        title={title}
        description={description}
        keyword={keyword}
        site_name={site_name}
        url={location.href}
        og_title={title}
        og_type={og_type}
        og_image={og_image}
      />
      {/* html要素 */}
      <div className="g-container">
        <main className="g-pageMain" role="main">
          <div className="l-container">
            <div className="u-mt-x5">
              <h1 className="c-headingLv1">{post.name}</h1>
            </div>
            <div className="u-mt-x5">
              <div
                className="wysiwyg" 
                dangerouslySetInnerHTML={{ __html: marked(post.body.body) }}
              />
            </div>
            <div className="u-mt-x5">
              <p className="c-text">
                <Link to='/'>
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

export default Post;

export const pageQuery = graphql`
  query($slug: String, $language: String) {
    contentfulWho(slug: { eq: $slug }, node_locale: { eq: $language }) {
      id
      contentful_id
      slug
      node_locale
      name
      description {
        description
      }
      keyword
      og_image {
        file {
          url
          fileName
          details {
            image {
              height
              width
            }
            size
          }
        }
      }
      body {
        body
      }
    }
  }
`;
