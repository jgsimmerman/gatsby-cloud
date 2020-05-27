import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content } from 'layouts';
import { TagsBlock, Header, SEO } from 'components';
import Img from 'gatsby-image';
import '../styles/prism';

const CareWrapper = styled.div`
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

const SuggestionBar = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  background: ${props => props.theme.colors.white.light};
  box-shadow: ${props => props.theme.shadow.suggestion};
`;
const blogSuggestion = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 3rem 0 3rem;
`;

const care = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const {html, frontmatter, excerpt } = data.markdownRemark
  const {date, title, tags, path, description} = frontmatter
  const image = frontmatter.cover.childImageSharp.fluid;
  const pic = frontmatter.pic.childImageSharp.fluid;

  return (
    <Layout>
      <SEO
        title={title}
        description={description || excerpt || ' '}
        banner={image}
        pathname={path}
        article
      />
      <Header title={title} date={date} cover={image} />
      <Container>
        <h1>{title}</h1>
        <CareWrapper>
          <Img fluid={pic} alt="" />
        </CareWrapper>
        <Img fluid={pic} alt="" />
        <CareWrapper>

        </CareWrapper>
        <Content input={html} />
        <TagsBlock list={tags || []} />
      </Container>
      {/* <SuggestionBar>
        <blogSuggestion>
          {prev && (
            <Link to={prev.frontmatter.path}>
              Previous
              <h3>{prev.frontmatter.title}</h3>
            </Link>
          )}
        </blogSuggestion>
        <blogSuggestion>
          {next && (
            <Link to={next.frontmatter.path}>
              Next
              <h3>{next.frontmatter.title}</h3>
            </Link>
          )}
        </blogSuggestion>
      </SuggestionBar> */}
    </Layout>
  );
};

export default care;

care.propTypes = {
  pageContext: PropTypes.shape({
    prev: PropTypes.object,
    next: PropTypes.object,
  }).isRequired,
  data: PropTypes.object.isRequired,
};

export const query = graphql`
  query($pathSlug: String!) {
    markdownRemark(frontmatter: { path: { eq: $pathSlug } }) {
      html
      frontmatter {
        date
        title
        tags
        pic {
          childImageSharp {
            fluid( maxWidth: 600, quality: 98, traceSVG: { color: "#2B2B2F" }) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        cover {
          childImageSharp {
            fluid(
              maxHeight: 200
              quality: 50
              duotone: { highlight: "#386eee", shadow: "#2323be", opacity: 60 }
            ) {
              ...GatsbyImageSharpFluid_withWebp
            }
            resize(width: 1200, quality: 50) {
              src
            }
          }
        }
      }
    }
  }
`;