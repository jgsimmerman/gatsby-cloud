import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, CatalogList } from 'components';
import { Layout } from 'layouts';
import { Link } from 'gatsby';

const CatalogWrapper = styled.main`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 4rem 4rem 1rem 4rem;
  a {
    color: ${props => props.theme.colors.white.base};
  }
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`;
const PostWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 4rem 4rem 4rem 4rem;
  color: ${props => props.theme.colors.white.base};

  .SocialIcon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 25px;
    height: 25px;
  }
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`;
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  background: grey;
  font-weight: 500;
  font-size: 1.1rem;
  align-items: center;
  a {
    color: ${props => props.theme.colors.white.base};
    margin-left: 2rem;
    transition: all ${props => props.theme.transitions.default.duration};
    &:hover {
      color: ${props => props.theme.colors.white.grey};
    }
  }
`;

const Catalog = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  return (
    <Layout>
      <Helmet title={'Complete Catalog'} />
      <Header title="Full Catalog">
      </Header>
      <PostWrapper>
          <h2>Currently Available Ornamental Plants </h2>
      </PostWrapper> 
      <PostWrapper>
          <p>
            Announcement: We will be adding many new plants to our inventory over the coming weeks. We will also be updating our succulent catalog. You can follow us on social media to get the latest updates!
          </p>
      </PostWrapper>
      <CatalogWrapper>
      
        {edges.map(({ node }) => (
          <CatalogList
            key={node.id}
            cover={node.frontmatter.cover.childImageSharp.fluid}
            path={node.frontmatter.path}
            title={node.frontmatter.title}
            //date={node.frontmatter.date}
            tags={node.frontmatter.tags}
            excerpt={node.story}
            //pic={node.frontmatter.pic.childImageSharp.fluid}
            inStock={node.frontmatter.inStock}
          />
        ))}

      
      </CatalogWrapper>

      <PostWrapper>
          <h2>Succulents and More Coming Spring 2020! </h2>
      </PostWrapper>    
      </Layout>
  );
};

export default Catalog;

Catalog.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            excerpt: PropTypes.string,
            frontmatter: PropTypes.shape({
              cover: PropTypes.object.isRequired,
              path: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
              //date: PropTypes.string.isRequired,
              tags: PropTypes.array,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
};

export const query = graphql`
  query {
    allMarkdownRemark(filter: { frontmatter: { available: { eq: 1 } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 200)
          frontmatter {
            title
            path
            tags
            id
            price
            inStock
            available
            date(formatString: "MM.DD.YYYY")
            pic {
              childImageSharp {
                fluid(
                  maxWidth: 1000
                  quality: 60
                  traceSVG: { color: "#2B2B2F" }
                ) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
            cover {
              childImageSharp {
                fluid(
                  maxWidth: 1000
                  quality: 60
                  traceSVG: { color: "#2B2B2F" }
                ) {
                  ...GatsbyImageSharpFluid_withWebp_tracedSVG
                }
              }
            }
          }
        }
      }
    }
  }
`;
