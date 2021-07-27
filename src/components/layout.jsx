/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import Header from './header';
import Footer from './footer';
import Lib from './lib';

const Layout = ({ children, publish_setting }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  return (
    <>
      <div id="top" className="g-wrapper">
        <Header
          siteTitle={data.site.siteMetadata?.title || `Title`}
          publish_setting={publish_setting}
        />
        {children}
        <Footer />
      </div>
      <Lib />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
