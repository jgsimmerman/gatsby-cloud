import React, { Fragment } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import { TagsBlock } from 'components';
import { Container } from 'layouts';

const Wrapper = styled.main`
    
  margin: 1rem 1rem 1rem 1rem;
  flex-basis: calc(99.9% * 1 / 3 - 2.5rem);
  max-width: calc(99.9% * 1 / 3 - 2.5rem);
  width: calc(99.9% * 1 / 3 - 2.5rem);
  justify-content: space-around;

  @media (max-width: 1300px) {
    flex-basis: calc(99.9% * 1 / 2 - 2.5rem);
    max-width: calc(99.9% * 1 / 2 - 2.5rem);
    width: calc(99.9% * 1 / 2 - 2.5rem);
  }
  @media (max-width: 800px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 500px) {
    min-height: 200px;
  }
`;

const Image = styled.div`
  margin: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadow.feature.small.default};
  transition: ${props => props.theme.transitions.boom.transition};
  border-radius: ${props => props.theme.borderRadius.default};
  min-height: 300px;
  img {
    border-radius: ${props => props.theme.borderRadius.default};
  }
  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
    transform: scale(1.04);
  }
  a {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: ${props => props.theme.borderRadius.default};
    > div {
      position: static !important;
    }
    > div > div {
      position: static !important;
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 0 5px ${props => props.theme.colors.primary.dark};
    }
  }
  flex-basis: 100%;
  max-width: 100%;
  width: 100%;
  @media (max-width: 800px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 500px) {
    min-height: 200px;
  }
`;

const Information = styled.div`
  h1 {
    font-size: 2rem;
    display: inline-block;
    color: ${props => props.theme.colors.black.base};
    transition: all ${props => props.theme.transitions.default.duration};
    &:hover {
      color: ${props => props.theme.colors.primary.base};
    }
  }
  text-align: center;
  flex-basis: 100%;
  max-width: 100%;
  width: 100%;
  @media (max-width: 800px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
  }
`;

const Date = styled.div`
  margin-top: 1rem;
  color: ${props => props.theme.colors.black.lighter};
`;

const Title = styled.h2`
  margin: 0;
  color: ${props => props.theme.colors.white.base};

`;

const CatalogContainer = styled(Container)`
  margin-top: 0;
  flex-basis: calc(99.9% * 1 / 3 - 2.5rem);
  max-width: calc(99.9% * 1 / 3 - 2.5rem);
  width: calc(99.9% * 1 / 3 - 2.5rem);

  @media (max-width: 1300px) {
    flex-basis: 50%;
    max-width: 50%;
    width: 50%;
  }
  @media (max-width: 800px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 500px) {
    min-height: 200px;
  }
`;

const CatalogList = ({ path, cover, title, date, excerpt, tags, story, inStock }) => (
  // <CatalogContainer>
    <Wrapper>
      <Image>
        <Link to={path} title={title}>
          <Img fluid={cover} />
        </Link>
      </Image>
      <Information>
        {/*<Date>{date}</Date>*/}
        <Link to={path}>
          <Title>{title}</Title>
        </Link>
        {/* <TagsBlock list={tags} /> */}
        {/* {story} */}
        { 
          (inStock == "http://schema.org/OutOfStock") && <p> Out of Stock -- Check back soon!</p>
          
        }
      </Information>
    </Wrapper>
  // </CatalogContainer>
);

export default CatalogList;

CatalogList.propTypes = {
  cover: PropTypes.object.isRequired,
  path: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  //date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
};
