import React, { useEffect } from 'react';
import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import { Header, ItemList, SocialIcons, Mailchimp, Wheel } from 'components';
import { Layout } from 'layouts';
import theme from '../../config/theme';
import Img from 'gatsby-image';

const Wrapper = styled.section`
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadow.feature.small.default};
  height: 17rem;
  flex-basis: calc(99.9% * 1 / 3 - 2.5rem);
  max-width: calc(99.9% * 1 / 3 - 2.5rem);
  width: calc(99.9% * 1 / 3 - 2.5rem);

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
  }

  @media (max-width: 1000px) {
    flex-basis: calc(99.9% * 1 / 2 - 1rem);
    max-width: calc(99.9% * 1 / 2 - 1rem);
    width: calc(99.9% * 1 / 2 - 1rem);
    height: 18rem;
  }

  @media (max-width: 700px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    height: 15rem;
  }
`;

const Wrapper2 = styled.section`
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadow.feature.small.default};
  height: 34rem;
  flex-basis: calc(99% - 2.5rem);
  max-width: calc(99% - 2.5rem);
  width: calc(99% - 2.5rem);

  &:hover {
    box-shadow: ${props => props.theme.shadow.feature.small.hover};
  }

  @media (max-width: 1000px) {
    flex-basis: calc(99.9% * 1 / 2 - 1rem);
    max-width: calc(99.9% * 1 / 2 - 1rem);
    width: calc(99.9% * 1 / 2 - 1rem);
    height: 18rem;
  }

  @media (max-width: 700px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
    height: 15rem;
  }
`;

const StyledLink = styled(Link)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  z-index: 1;
  border-radius: ${props => props.theme.borderRadius.default};
  &:after {
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -10;
    border-radius: ${theme.borderRadius.default};
    transition: opacity ${theme.transitions.default.duration};
  }
`;

const Image = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  object-fit: cover;
  border-radius: ${props => props.theme.borderRadius.default};
  img {
    border-radius: ${props => props.theme.borderRadius.default};
  }
  > div {
    position: static !important;
  }
  > div > div {
    position: static !important;
  }
`;

const Info = styled.div`
  color: ${props => props.theme.colors.white.light};
  -webkit-text-fill-color: ${props => props.theme.colors.white.exp};
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: black;
  text-shadow: 0 0 50px hsla(0, 0%, 0%, 0.9);
  margin: 0 1rem 1.25rem 1.25rem;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Title = styled.h2`
  margin-bottom: 0.6rem;
`;

const Price = styled.p``;

const ImageLinks = (links) => {
  
  links = links

  return (
    <>
    {links.links.map(linky => (
      <Wrapper>
        <Image>
          <Img fluid={linky.img || <Skeleton />} alt={linky.title} />
        </Image>
        <StyledLink to={linky.link}>
          <Info>
            <Title>{linky.title}</Title>
            {/* <Price>$9.95</Price> */}
          </Info>
        </StyledLink>
      </Wrapper>
    ))}
      </>
  )

}

export const fluidImage = graphql`
  fragment fluidImage on File {
    childImageSharp {
      fluid(maxWidth: 500, quality: 80, traceSVG: { color: "#2B2B2F" }) {
        ...GatsbyImageSharpFluid
      }
    }
  }
`;

export const pageQuery = graphql`
  query {
    imageOne: file(relativePath: { eq: "echeveria.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageTwo: file(relativePath: { eq: "kiwi.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageThree: file(relativePath: { eq: "alata1.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageFour: file(relativePath: { eq: "wandering.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageFive: file(relativePath: { eq: "anglePixie2.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageSix: file(relativePath: { eq: "zebra-plant2.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageSeven: file(relativePath: { eq: "miniWhite.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageEight: file(relativePath: { eq: "rose.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageNine: file(relativePath: { eq: "mixedColor.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageTen: file(relativePath: { eq: "newAlata1.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageEleven: file(relativePath: { eq: "kokedama.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageTwelve: file(relativePath: { eq: "succulents2.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 1600, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    imageThirteen: file(relativePath: { eq: "cacti.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
    logo: file(relativePath: { eq: "logo.png" }) {
      childImageSharp {
        fluid(maxWidth: 400, quality: 80) {
          ...GatsbyImageSharpFluid_withWebp_tracedSVG
        }
      }
    }
  }
`;

export default ImageLinks