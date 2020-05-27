import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Header, CatalogList } from 'components';
import { Layout } from 'layouts';

const PostWrapper = styled.main`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 2rem 2rem 2rem 2rem;
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

const CatalogWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: 2rem 4rem 1rem 4rem;
  @media (max-width: 1000px) {
    margin: 4rem 2rem 1rem 2rem;
  }
  @media (max-width: 700px) {
    margin: 4rem 1rem 1rem 1rem;
  }
`;

const houseplants = ({ data }) => {
  const { edges } = data.allMarkdownRemark;
  return (
    <Layout>
      <Header title="Houseplants - Sweet Leaf Succulents">
        Sweet Leaf Succulents and Ornamental Plants
      </Header>
      <PostWrapper>
          <h2> Houseplants </h2>
      </PostWrapper>
      <CatalogWrapper>
        {edges.map(({ node }) => (
          <CatalogList
            key={node.id}
            cover={node.frontmatter.cover.childImageSharp.fluid}
            path={node.frontmatter.path}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            tags={node.frontmatter.tags}
            excerpt={node.excerpt}
          />
        ))}
      </CatalogWrapper>
    </Layout>
  );
};

export default houseplants;

houseplants.propTypes = {
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
              date: PropTypes.string.isRequired,
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
    allMarkdownRemark(filter: { frontmatter: { id: { eq: 10 } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 200)
          frontmatter {
            title
            path
            tags
            id
            inStock
            price
            date(formatString: "MM.DD.YYYY")
            cover {
              childImageSharp {
                fluid(maxWidth: 1000, quality: 90) {
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
