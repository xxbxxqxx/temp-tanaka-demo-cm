// contengful settings
// API Keyを環境変数.envから読み込む
require('dotenv').config();

module.exports = {
  // meta設定(デフォルト値)
  siteMetadata: {
    title: `ページタイトル`,
    description: `Default meta description`,
    keyword: `Default meta keyword`,
    site_name: `Default site_name`,
    url: `Default url`,
    og_title: `Default og_gitle`,
    og_type: `Default og_type`,
    og_image: `Default og_image`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/img`
      }
    },
    //`gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-gatsby-cloud`,
    // `gatsby-plugin-offline`,
    // 'gatsby-plugin-scss-typescript',
    {
      resolve: `gatsby-plugin-web-font-loader`,
      options: {
        typekit: {
          id: process.env.TYPEKIT_ID
        }
      }
    },
    // contentful settings
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        host: process.env.CONTENTFUL_HOST
      }
    },
    // language settings
    `gatsby-plugin-locales`,
    {
      resolve: `gatsby-plugin-react-intl`,
      options: {
        // language JSON resource path
        path: `${__dirname}/locales`,
        // supported language
        languages: [`en`, `ja`],
        // language file path
        defaultLanguage: `en`,
        // option to redirect to `/en` when connecting `/`
        redirect: true,
        // option for use / as defaultLangauge root path. if your defaultLanguage is `ko`, when `redirectDefaultLanguageToRoot` is true, then it will not generate `/ko/xxx` pages, instead of `/xxx`
        redirectDefaultLanguageToRoot: false,
        // paths that you don't want to genereate locale pages, example: ["/dashboard/","/test/**"], string format is from micromatch https://github.com/micromatch/micromatch
        ignoredPaths: [`/404.html`]
      }
    },
    // markdown settings
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images-contentful`,
            options: {
              maxWidth: 590,
              withWebp: true
            }
          }
        ]
      }
    },
    // robots settings
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://tanakademo.gtsb.io`,
        policy: [{ userAgent: `*`, disallow: `/` }]
      }
    }
  ]
};
