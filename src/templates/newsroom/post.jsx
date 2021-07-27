import React, { useEffect } from 'react';
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
  const post = data.contentfulNews;
  // 多言語設定
  const intl = useIntl();
  // meta要素
  const site_name = intl.formatMessage({ id: 'sitesetting.meta.sitename' });
  const title =
    post.name +
    ' | ' +
    intl.formatMessage({ id: 'newsroom.title' }) +
    ' | ' +
    intl.formatMessage({ id: 'sitesetting.meta.sitename' });
  const description =
    post.description && post.description.description
      ? post.description.description
      : intl.formatMessage({ id: 'newsroom.meta.description' });
  const keyword = post.keyword
    ? post.keyword
    : intl.formatMessage({ id: 'newsroom.meta.keyword' });
  const og_type = 'article';
  const og_image =
    post.og_image && post.og_image.file && post.og_image.file.url
      ? post.og_image.file.url
      : intl.formatMessage({ id: 'newsroom.meta.og_image' });
  // 公開設定
  //// 公開設定を取得
  const publish_setting = {
    en: pageContext.publish_setting_en,
    ja: pageContext.publish_setting_ja
  };
  //// 公開設定がfalse / nullの場合はリダイレクト
  if (!post.publish_setting) {
    useEffect(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/newsroom/';
      }
    }, []);
    return () => null;
  }
  //// 外部リンク・内部リンク・PDFリンクの場合はリダイレクト
  if (post.outer_link || post.inner_link || post.pdf_link) {
    useEffect(() => {
      if (typeof window !== 'undefined' && post.outer_link) {
        window.location.href = post.outer_link;
      } else if (typeof window !== 'undefined' && post.inner_link) {
        window.location.href = post.inner_link;
      } else if (typeof window !== 'undefined' && post.pdf_link) {
        window.location.href = post.pdf_link.file.url;
      }
    }, []);
    return () => null;
  }
  // 詳細ページのコンテンツ呼び出し
  const name = post.name ? post.name : '';
  const content =
    post.content && post.content.content ? post.content.content : '';
  // 詳細ページの場合はページを表示
  return (
    <Layout publish_setting={publish_setting}>
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
              <h1 className="c-headingLv1">{name}</h1>
            </div>
            <div className="u-mt-x5">
              <div
                className="wysiwyg"
                dangerouslySetInnerHTML={{
                  __html: marked(content)
                }}
              />
            </div>
            <div className="u-mt-x5">
              <p className="c-text">
                <Link to={`/newsroom/`}>
                  {intl.formatMessage({ id: 'newsroom.title' })}
                </Link>
              </p>
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

export default Post;

export const pageQuery = graphql`
  query($slug: String, $language: String) {
    contentfulNews(slug: { eq: $slug }, node_locale: { eq: $language }) {
      contentful_id
      id
      slug
      node_locale
      name
      category {
        categoryID
        name
      }
      public_date(fromNow: false, locale: "", formatString: "")
      publish_setting
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
      content {
        content
      }
      outer_link
      inner_link
      pdf_link {
        title
        file {
          url
          fileName
          contentType
        }
        node_locale
      }
    }
  }
`;
