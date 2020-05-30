import React, { useEffect } from 'react';
import { Link, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import styled from '@emotion/styled';
import {
  Header,
  ImageLinks,
  ItemList,
  SocialIcons,
  Mailchimp,
  Wheel,
} from 'components';
import { Layout } from 'layouts';
import theme from '../../config/theme';
import Img from 'gatsby-image';

import Loadable from 'react-loadable';
import loadable from '@loadable/component';
const pMinDelay = require('p-min-delay');

// const Products = loadable(() => import('../components/ImageLinks'))
const Products = loadable(
  () => pMinDelay(import('../components/ImageLinks')),
  1000
);

import Skeleton from 'react-loading-skeleton';

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

const Index = ({ data }) => {
  const images = [
    data.imageNine.childImageSharp.fluid,
    data.imageTen.childImageSharp.fluid,
    data.imageSeven.childImageSharp.fluid,
    data.imageFive.childImageSharp.fluid,
    data.imageEight.childImageSharp.fluid,
  ];

  const links = [
    {
      link: '/catalog/cacti/',
      img: data.imageThirteen.childImageSharp.fluid,
      title: 'Cactus',
    },
    {
      link: '/catalog/carnivorous-plants/red-dragon',
      img: data.imageFourteen.childImageSharp.fluid,
      title: 'Red Dragon Fly Traps',
    },
    {
      link: '/catalog/carnivorous-plants/alata/',
      img: data.imageTen.childImageSharp.fluid,
      title: 'Nepenthes',
    },
    {
      link: '/catalog/fairy-garden/mini-white/',
      img: data.imageSeven.childImageSharp.fluid,
      title: 'Mini White,',
    },
    {
      link: '/catalog/fairy-garden/mini-pixie/',
      img: data.imageFive.childImageSharp.fluid,
      title: 'Mini Pixie',
    },
    {
      link: '/catalog/fairy-garden/rose-hypoestes/',
      img: data.imageEight.childImageSharp.fluid,
      title: 'Rose Hypestes',
    },
  ];
  //const { edges } = data.allMarkdownRemark;

  // useEffect(() => {

  //   if ( typeof window.yotpo !== "undefined" &&  yotpo.initialized && post) {
  //     window.yotpo.initWidgets();

  //     setTimeout(function() {
  //       window.yotpo.refreshWidgets()
  //     }, 1000)
  //   }
  // }, [post]);
  // const links = [
  //   {
  //     link: '/catalog/fairy-garden/mixed-hypoestes/',
  //     img: data.imageNine.childImageSharp.fluid,
  //     title: 'Mixed Colors Hypoestes',
  //   },
  //   {
  //     link: '/catalog/carnivorous-plants/alata/',
  //     img: data.imageTen.childImageSharp.fluid,
  //     title: 'Nepenthes',
  //   },
  //   {
  //     link: '/catalog/fairy-garden/mini-white/',
  //     img: data.imageSeven.childImageSharp.fluid,
  //     title: 'Mini White,',
  //   },
  //   {
  //     link: '/catalog/fairy-garden/mini-pixie/',
  //     img: data.imageFive.childImageSharp.fluid,
  //     title: 'Mini Pixie',
  //   },
  //   {
  //     link: '/catalog/fairy-garden/rose-hypoestes/',
  //     img: data.imageEight.childImageSharp.fluid,
  //     title: 'Rose Hypestes',
  //   },
  // ];

  return (
    <Layout>
      <Helmet title={'Sweet Leaf Succulents'} />

      <Header title="Sweet Leaf Succulents">
        {/* <Img fluid={data.logo.childImageSharp.fluid} /> */}
      </Header>
      <PostWrapper>
        <h2> Featured Plants </h2>
      </PostWrapper>
      <PostWrapper>
        <p>
          Announcement: We will be adding many new plants to our inventory over
          the coming weeks. We will also be updating our succulent catalog. You
          can follow us on social media to get the latest updates!
        </p>
      </PostWrapper>

      <PostWrapper>
        <Wrapper2>
          <Image>
            <Img
              fluid={data.imageTwelve.childImageSharp.fluid || <Skeleton />}
              alt="Succulents"
            />
          </Image>
          <StyledLink to="/catalog/succulents/">
            <Info>
              <Title>Succulents</Title>
              {/* <Price>$9.95</Price> */}
            </Info>
          </StyledLink>
        </Wrapper2>
        {/* <Wrapper>
          <Image>
            <Img
              fluid={data.imageThirteen.childImageSharp.fluid || <Skeleton />}
              alt="Cacti"
            />
          </Image>
          <StyledLink to="/catalog/cacti/">
            <Info>
              <Title>Cactus</Title>
            </Info>
          </StyledLink>
        </Wrapper> */}
        {/* <Wrapper>
          <Image>
            <Img
              fluid={data.imageEleven.childImageSharp.fluid || <Skeleton />}
              alt="Nepenthes Kokedama"
            />
          </Image>
          <StyledLink to="/catalog/carnivorous-plants/kokedama">
            <Info>
              <Title>Nepenthes Kokedama</Title>
              
            </Info>
          </StyledLink>
        </Wrapper> */}

        {/* <ImageLinks links={links}/> */}
        <Products links={links} />
      </PostWrapper>
      <PostWrapper>
        <h4>
          {' '}
          <Link to="/catalog/">See our full catalog for more!</Link>
        </h4>
      </PostWrapper>
      {/* WHEEL IS BELOW THIS LINE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
      {/* <PostWrapper>
        <Wheel />
      </PostWrapper> */}
    </Layout>
  );
};

export default Index;

Index.propTypes = {
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
    imageFourteen: file(relativePath: { eq: "VFTRedDragon.jpg" }) {
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
