/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`);
const slash = require(`slash`);

module.exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  // ニュースリリース
  //// クエリ
  const newsroomPost = await graphql(`
    query {
      allContentfulNews(
        sort: { order: DESC, fields: public_date }
        filter: { name: { ne: null } }
      ) {
        edges {
          node {
            contentful_id
            id
            slug
            node_locale
            category {
              categoryID
              name
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
      allContentfulCategory {
        edges {
          node {
            contentful_id
            id
            categoryID
            name
            node_locale
            news {
              contentful_id
              id
              slug
              node_locale
              category {
                categoryID
                name
              }
              publish_setting
            }
          }
        }
      }
    }
  `);
  //// インデックスページ
  createPage({
    path: `/newsroom/`,
    component: path.resolve('./src/templates/newsroom/index.jsx'),
    context: {}
  });
  //// カテゴリー記事一覧ページ生成
  ////// 日英のPOSTを結合する
  const newsroomCategoryKeys = [];
  const newsroomCategoryItems = [];
  newsroomPost.data.allContentfulCategory.edges.forEach(edge => {
    const contentful_id = edge.node.contentful_id;
    if (!newsroomCategoryKeys.find(element => element === contentful_id)) {
      newsroomCategoryKeys.push(contentful_id);
      newsroomCategoryItems[contentful_id] = {};
    }
    newsroomCategoryItems[contentful_id].categoryID = edge.node.categoryID;
  });
  ////// ページ生成
  newsroomCategoryKeys.map(key => {
    const item = newsroomCategoryItems[key];
    createPage({
      path: `/newsroom/${item.categoryID}/`,
      component: path.resolve('./src/templates/newsroom/category.jsx'),
      context: {
        categoryID: item.categoryID
      }
    });
  });
  //// 記事詳細ページ生成
  ////// 日英のPOSTを結合する
  const newsroomPostKeys = [];
  const newsroomPostItems = [];
  newsroomPost.data.allContentfulNews.edges.forEach(edge => {
    const publish_setting = 'publish_setting_' + edge.node.node_locale;
    const contentful_id = edge.node.contentful_id;
    if (!newsroomPostKeys.find(element => element === contentful_id)) {
      newsroomPostKeys.push(contentful_id);
      newsroomPostItems[contentful_id] = {};
    }
    newsroomPostItems[contentful_id].slug = edge.node.slug;
    newsroomPostItems[contentful_id][publish_setting] = edge.node.publish_setting;
  });
  ////// ページ生成
  newsroomPostKeys.map(key => {
    const item = newsroomPostItems[key];
    createPage({
      path: `/newsroom/${item.slug}`,
      component: path.resolve('./src/templates/newsroom/post.jsx'),
      context: {
        slug: item.slug,
        publish_setting_en: item.publish_setting_en,
        publish_setting_ja: item.publish_setting_ja
      }
    });
  });
  // 企業情報
  //// クエリ
  const whoPost = await graphql(`
    query {
      allContentfulWho(filter: { name: { ne: null } }) {
        edges {
          node {
            contentful_id
            id
            slug
            node_locale
          }
        }
        totalCount
      }
    }
  `);
  //// 記事詳細ページ生成
  whoPost.data.allContentfulWho.edges.forEach(edge => {
    createPage({
      path: `/${edge.node.slug}`,
      component: path.resolve('./src/templates/who/post.jsx'),
      context: {
        slug: edge.node.slug,
        id: edge.node.id
      }
    });
  });
};
