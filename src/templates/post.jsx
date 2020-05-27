import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { Layout, Container, Content, SocialIcons } from 'layouts';
import { TagsBlock, Header, SEO, SecondNav } from 'components';
import '../styles/prism';
import Helmet from 'react-helmet';
import BuyButton from '../components/BuyButton';
import ItemContent from '../components/ItemContent';
import { Cart, openCart, addToCart, Totals } from 'cart';


const Post = ({ data, pageContext }) => {
  const { next, prev } = pageContext;
  const post = data.markdownRemark;
  const skus = data.skus.edges;

  // const coupons = data.coupons.edges

  // let couponObj = {
  //   id: '',
  //   percent_off: 0,
  // }

  // couponObj = coupons.map(({ node: coupons }) => ({
  //     id: coupons.id,
  //     percent_off: coupons.percent_off,
  //   })
  // );
  // console.log(couponObj);

  let skuObj = {
    sku: '',
    quantity: 0,
    image: '',
  }

  skuObj = skus.map(({ node: sku }) => ({
      sku: sku.id,
      quantity: sku.inventory.quantity,
      image: sku.image,
    })
  );


  const image = post.frontmatter.cover.childImageSharp.fluid;
  const publicImg = post.frontmatter.cover.publicURL
  //const pic = post.frontmatter.image.childImageSharp.fluid;
  const title = post.frontmatter.title;
  const date = post.frontmatter.date;
  const id = post.frontmatter.id;
  const html = post.html;
  const story = post.frontmatter.story;
  const pic = post.frontmatter.pic.childImageSharp.fluid;
  const snipPic = post.frontmatter.pic;
  const scientificname = post.frontmatter.scientificname;
  const dataItemCustom1Name = post.frontmatter.dataItemCustom1Name;
  const dataItemCustom1Options = post.frontmatter.dataItemCustom1Options;
  const dataItemWeight = post.frontmatter.dataItemWeight;
  const sku = post.frontmatter.sku;
  const care = post.frontmatter.care;
  const inStock = post.frontmatter.inStock;

  // let itemSkuArray = skuObj.find(obj => obj.sku == sku);
  // let itemQuantity = itemSkuArray.quantity;
  // itemImage = itemSkuArray.image;
  // console.log('itemQuantity', itemQuantity)
  //const inStock = "http://schema.org/InStock";
  // if (itemQuantity == 0) {
  //   inStock = "http://schema.org/OutOfStock";
  // }
  //console.log('skuObj.quantity', skuObj)
  //console.log('inStock', inStock);
  return (
    <Layout>
     
      <SEO
        title={title}
        description={story}
        //description={post.frontmatter.description || post.excerpt || ' '}
        banner={publicImg}
        pathname={post.frontmatter.path}
        price = {post.frontmatter.price}
        sku = {sku}
        availability = {inStock}
        article
      />
      <Header title={title} cover={image} />

      <Container>
        <ItemContent post={post.frontmatter} skus={skus} skuObj={skuObj}  html={html} publicImg={publicImg} />
      </Container>
    </Layout>
  );
};

export default Post;

Post.propTypes = {
  pageContext: PropTypes.shape({
    prev: PropTypes.object,
    next: PropTypes.object,
  }).isRequired,
  data: PropTypes.object.isRequired,
};

export const query = graphql`
  query($pathSlug: String!) {
    skus: allStripeSku {
      edges {
        node {
          id
          currency
          price
          image
          
          inventory {
            quantity
          }
        }
      }
    }
    coupons: allStripeCoupon {
      edges{
        node {
          id
          duration
          percent_off
          object
        }
      }
    }
    markdownRemark(frontmatter: { path: { eq: $pathSlug } }) {
      html
      
      frontmatter {
        date
        title
        tags
        id

        inStock
        
        option1
        option2
        option3
        option4
        sku
        sku2
        sku3
        sku4
        price
        price2
        price3
        price4
        path
        care 
        story
        scientificname
        primarycolor
        stresscolors
        petsafe
        seasonality
        bloomcolor
        temperature
        
        pic {
          childImageSharp {
            fluid( maxWidth: 500, quality: 75, traceSVG: { color: "#2B2B2F" }) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        pic2 {
          childImageSharp {
            fluid( maxWidth: 500, quality: 75, traceSVG: { color: "#2B2B2F" }) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        pic3 {
          childImageSharp {
            fluid( maxWidth: 500, quality: 75, traceSVG: { color: "#2B2B2F" }) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        pic4 {
          childImageSharp {
            fluid( maxWidth: 500, quality: 75, traceSVG: { color: "#2B2B2F" }) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
        
        cover {
          publicURL
          childImageSharp {
            fluid(
              maxWidth: 1920
              quality: 75
              duotone: { highlight: "#386eee", shadow: "#2323be", opacity: 60 }
            ) {
              ...GatsbyImageSharpFluid_withWebp
            }
            resize(width: 1200, quality: 60) {
              src
            }
          }
        }
      }
    }
  }
`;

