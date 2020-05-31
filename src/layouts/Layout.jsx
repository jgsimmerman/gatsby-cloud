import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import Loadable from 'react-loadable';

import { ThemeProvider } from 'emotion-theming';
import { css, Global } from '@emotion/core';
import PropTypes from 'prop-types';
//import 'typeface-patua-one';
//import 'typeface-merriweather';
import 'typeface-open-sans';
import 'typeface-candal';
import { SEO, ZygoteCart, Header } from 'components';
import { NavBar, Footer, BurgerMenu, SocialIcons } from 'layouts';
import theme from '../../config/theme';
import headroom from '../styles/headroom';
import { Cart, openCart, addToCart, Totals, Zygote, totalsState, State } from 'cart';
//loadable
import loadable from '@loadable/component';
const pMinDelay = require('p-min-delay');
const Zygote = loadable(
  () => pMinDelay(import('../components/ZygoteCart')),
  3000
);

//react-loadable
function Loading(props) {
  if (props.error) {
    return <div>Something went wrong! <button onClick= { props.retry }>Retry</button></div>;
  } else if (props.timedOut) {
    return <div>Seems like your net is slow.. <button onClick={ props.retry }>Retry</button> </div>
  } else if (props.pastDelay) {
    return <p>Loading...</p>;
  } else {
    return null;
  }
}

const LoadableBurgerMenu = Loadable({
  loader: () => import('../components/BurgerMenu'),
  loading: Loading,
  delay: 1500, // 1.5 seconds
  timeout: 150000, // 15 seconds
});

//background-color: hsla(228, 34.9%, 88.1%, 0.3);

const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Fragment>
      <Global
        styles={css`
          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }
          html {
            background-color: hsl(192, 15%, 99%);

            text-rendering: optimizeLegibility;
            overflow-x: hidden;
            box-sizing: border-box;
            -ms-overflow-style: scrollbar;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          html,
          body {
            background-color: hsl(192, 15%, 99%);
          }

          .site {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
          }
          .site-content {
            flex-grow: 1;
          }
          a {
            color: ${theme.colors.link};
            transition: color 0.5s;
            text-decoration: none;
          }
          a:hover {
            text-decoration: none;
            color: ${theme.colors.linkHover};
          }
          h1 {
            font-family: ${theme.fontFamily.heading};
          }

          ${headroom}
        `}
      />
      <SEO />
      
      <BurgerMenu />
      {/* <LoadableBurgerMenu /> */}
      <div className="site">
        
        <NavBar />
        <div className="site-content">
          {children}
        </div>
        <Footer />
        <Zygote />
      </div>
    </Fragment>
  </ThemeProvider>
);

export default Layout;

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]).isRequired,
};


export const query = graphql`
  query {
    logo: file(relativePath: { eq: "logo.png" }) {
      childImageSharp {
        fluid(maxWidth: 1000, quality: 90) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
  }
`;