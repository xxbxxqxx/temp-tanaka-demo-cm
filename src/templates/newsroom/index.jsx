import * as React from 'react';
// importを追記
import { useStaticQuery, graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { useIntl, Link, changeLocale } from 'gatsby-plugin-react-intl';
import Moment from 'react-moment';
// componentsを追記
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import nl2br from '../../components/extend/nl2br';

const Index = ({ data, location, pageContext }) => {
  // API取得
  const posts = data.allContentfulNews.edges;
  // 多言語設定
  const intl = useIntl();
  // meta要素
  const site_name = intl.formatMessage({ id: 'sitesetting.meta.sitename' });
  const title =
    intl.formatMessage({ id: 'newsroom.title' }) +
    ' | ' +
    intl.formatMessage({ id: 'sitesetting.meta.sitename' });
  const description = intl.formatMessage({ id: 'newsroom.meta.description' });
  const keyword = intl.formatMessage({ id: 'newsroom.meta.keyword' });
  const og_type = 'article';
  const og_image = intl.formatMessage({ id: 'newsroom.meta.og_image' });
  return (
    <Layout>
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
              <h1 className="c-headingLv1">
                {intl.formatMessage({ id: 'newsroom.title' })}
              </h1>
            </div>
            <div className="u-mt-x5">
              <ul className="c-news">
                {/* 記事一覧が0件の場合 */}
                {posts.length === 0 && (
                  <li className="c-news_item">
                    <p className="c-news_itemLink">
                      {intl.formatMessage({ id: 'newsroom.body.no_entry' })}
                    </p>
                  </li>
                )}
                {/* /記事一覧が0件の場合 */}
                {/* 記事一覧をループ表示 */}
                {posts &&
                  posts.map(({ node: post }, key) => {
                    // 詳細ページの場合のリンク先を設定
                    let link = `/${intl.locale}/newsroom/${post.slug}`;
                    let target = '_self';
                    // 外部リンク・内部リンク・PDFリンクの場合のリンク先を設定
                    {
                      (() => {
                        if (post.outer_link) {
                          link = post.outer_link;
                          target = '_blank';
                        } else if (post.inner_link) {
                          link = post.inner_link;
                          target = '_self';
                        } else if (post.pdf_link) {
                          link = post.pdf_link.file.url;
                          target = '_self';
                        }
                      })();
                    }
                    // HTML出力
                    return (
                      <li className="c-news_item" key={key}>
                        <a
                          href={link}
                          className="c-news_itemLink"
                          target={target}
                        >
                          <Moment
                            format="MM/DD/YYYY"
                            className="c-news_itemDate"
                          >
                            {post.public_date}
                          </Moment>
                          <span className="c-news_itemContent">
                            <strong>{post.name}</strong>
                            <br />
                            {post.description.description}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                {/* /記事一覧をループ表示 */}
              </ul>
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
    </Layout>
  );
};
export default Index;

export const query = graphql`
  query($language: String) {
    allContentfulNews(
      filter: { node_locale: { eq: $language }, publish_setting: { eq: true } }
      sort: { order: DESC, fields: public_date }
    ) {
      edges {
        node {
          id
          slug
          public_date
          name
          node_locale
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
          category {
            categoryID
            name
          }
          description {
            description
          }
          content {
            content
          }
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
          publish_setting
        }
      }
      totalCount
      pageInfo {
        currentPage
        hasNextPage
        hasPreviousPage
        itemCount
        pageCount
        perPage
        totalCount
      }
    }
  }
`;
