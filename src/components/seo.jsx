/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

function HEAD({
  lang,
  meta,
  title,
  description,
  keyword,
  site_name,
  url,
  og_title,
  og_type,
  og_image
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            keyword
            site_name
            url
            og_title
            og_type
            og_image
          }
        }
      }
    `
  );

  const defaultTitle = title || site.siteMetadata.title;
  const metaKeyword = keyword || site.siteMetadata.keyword;
  const metaDescription = description || site.siteMetadata.description;
  const siteName = site_name || site.siteMetadata.site_name;
  const siteUrl = url || site.siteMetadata.url;
  const ogTitle = og_title || site.siteMetadata.og_title;
  const ogType = og_type || site.siteMetadata.og_type;
  const ogImage = og_image || site.siteMetadata.og_image;

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={defaultTitle}
      meta={[
        {
          name: `keywords`,
          content: metaKeyword
        },
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:title`,
          content: ogTitle
        },
        {
          property: `og:type`,
          content: ogType
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:site_name`,
          content: siteName
        },
        {
          property: `og:image`,
          content: ogImage
        }
      ].concat(meta)}
      link={[
        {
          rel: 'stylesheet',
          href: '/assets/css/style.css',
          type: 'text/css'
        },
        {
          rel: 'shortcut icon',
          href: '/assets/img/favicon.ico'
        }
      ]}
      script={
        [
          /*
          { type: "application/ld+json", innerHTML: `{ "@context": "http://schema.org" }` }
          */
        ]
      }
    />
  );
}

HEAD.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  keyword: ``,
  site_name: ``,
  url: ``,
  og_title: ``,
  og_type: ``,
  og_image: ``
};

HEAD.propTypes = {
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  keyword: PropTypes.string,
  site_name: PropTypes.string,
  url: PropTypes.string,
  og_title: PropTypes.string,
  og_type: PropTypes.string,
  og_image: PropTypes.string
};

export default HEAD;
