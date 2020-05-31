import React from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { StaticQuery, graphql } from 'gatsby';
import { window, document, exists } from 'browser-monads';

const SEO = ({ title, description, banner, pathname, price, sku, availability, article }) => (
  <StaticQuery
    query={query}
    render={({
      site: {
        buildTime,
        siteMetadata: {
          defaultTitle,
          titleAlt,
          shortName,
          author,
          siteLanguage,
          logo,
          siteUrl,
          pathPrefix,
          defaultDescription,
          defaultBanner,
          twitter,
        },
      },
    }) => {
      const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: `${siteUrl}${banner || defaultBanner}`,
        url: `${siteUrl}${pathname || '/'}/`,
        price: price || 0.00,
        availability: availability || "http://schema.org/InStock"
      };
      const realPrefix = pathPrefix === '/' ? '' : pathPrefix;
      let schemaOrgJSONLD = [
        {
          '@context': 'http://schema.org',
          '@type': 'WebSite',
          //'@id': siteUrl,
          "@type": "Organization",
          url: siteUrl,
          name: defaultTitle,
          alternateName: titleAlt || '',
          "foundingDate": "2019",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "104 S DARLINGTON AVE",
            "addressLocality": "Lamar",
            "addressRegion": "SC",
            "postalCode": "29069-9799",
            "addressCountry": "USA",
          },
          "sameAs": [ 
            "http://www.facebook.com/SweetLeafSucculents",
            "http://www.twitter.com/SweetLeafSuccs",
            "http://pinterest.com/sweetleafsucculents0081/",
            "https://www.instagram.com/sweetleafsucculents/",
            //"https://www.etsy.com/shop/SweetLeafSucculents",
          ],
          // "cont
        },
      ];
      if (article) {
        schemaOrgJSONLD = [
          {
            '@context': 'http://schema.org',
            '@type': 'Product',
            '@id': seo.url,
            url: seo.url,
            name: title,
            sku: sku,
            description: description,
            //alternateName: titleAlt || '',
            //headline: title,
            image: {
              '@type': 'ImageObject',
              url: seo.image,
            },
            brand: 'Sweet Leaf Succulents and Ornamental Plants',
            offers: {
              '@type': 'Offer',
              price: seo.price,
              priceCurrency: "USD",
              url: seo.url,
              availability: seo.availability
            },
            
            //datePublished: buildTime,
            //dateModified: buildTime,
            // author: {
            //   '@type': 'Organization',
            //   name: author,
            // },
            // publisher: {
            //   '@type': 'Organization',
            //   name: author,
            //   logo: {
            //     '@type': 'ImageObject',
            //     url: siteUrl + "/" + realPrefix + logo,
            //   },
            // },
            //isPartOf: siteUrl,

            // "@type": "Organization",
            // "name": title,
            // "legalName" : "Sweet Leaf Succulents and Ornamental Plants, LLC",
            // "url": "http://www.sweetleafsucculents.com",
            // "logo": defaultBanner,
            // "foundingDate": "2019",
            // // "founders": [
            // //   {
            // //   "@type": "Person",
            // //   "name": "Patrick Coombe"
            // //   },
            // //   {
            // //   "@type": "Person",
            // //   "name": ""
            // //   } 
            // // ],
            // "address": {
            //   "@type": "PostalAddress",
            //   "streetAddress": "104 S DARLINGTON AVE",
            //   "addressLocality": "Lamar",
            //   "addressRegion": "SC",
            //   "postalCode": "29069-9799",
            //   "addressCountry": "USA"
            // },
            // // "contactPoint": {
            // //   "@type": "ContactPoint",
            // //   "contactType": "customer support",
            // //   "telephone": "[+561-526-8457]",
            // //   "email": "info@elite-strategies.com"
            // // },
            // "sameAs": [ 
            //   //"http://www.freebase.com/m/0_h96pq",
            //   "http://www.facebook.com/SweetLeafSucculents",
            //   "http://www.twitter.com/SweetLeafSuccs",
            //   "http://pinterest.com/sweetleafsucculents0081/",
            //   //"http://elitestrategies.tumblr.com/",
            //   //"http://www.linkedin.com/company/elite-strategies",
            //   //"https://plus.google.com/106661773120082093538",
            // ],

            mainEntityOfPage: {
              '@type': 'WebSite',
              '@id': siteUrl,
            },
          },
        ];
      }
      return (
        <>
          <Helmet title={seo.title}>
            <html lang={siteLanguage} />
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />
            <meta name="apple-mobile-web-app-title" content={shortName} />
            <meta name="application-name" content={shortName} />
            <meta name="p:domain_verify" content="25dbb4735617b64cd0bafe0086789449"/>
            <script type="application/ld+json">
              {JSON.stringify(schemaOrgJSONLD)}
            </script>
            {/* <!-- Google Tag Manager --> */}
            {/* <script>{(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PD9CWGR');}
            </script> */}
          {/* <!-- End Google Tag Manager --> */}
            {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
            {/* <script async src="https://googletagmanager.com/gtag/js?id=UA-158535531-1"></script> */}

            
            {/* <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments)}
              gtag('js', new Date());
              gtag('config', 'UA-158535531-1');
            </script> */}
        

            {/* OpenGraph  */}
            <meta property="og:url" content={seo.url} />
            <meta property="og:type" content={article ? 'article' : null} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={twitter} />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />
          </Helmet>
        </>
      );
    }}
  />
);
//   }
// }
export default SEO;
SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  banner: PropTypes.string,
  pathname: PropTypes.string,
  article: PropTypes.bool,
  price: PropTypes.number,
  sku: PropTypes.string,
};
SEO.defaultProps = {
  title: null,
  description: null,
  banner: null,
  pathname: null,
  article: false,
  price: null,
  sku: null,
};
const query = graphql`
  query SEO {
    site {
      buildTime(formatString: "YYYY-MM-DD")
      siteMetadata {
        defaultTitle: title
        titleAlt
        shortName
        author
        siteLanguage
        logo
        siteUrl: url
        pathPrefix
        defaultDescription: description
        defaultBanner: banner
        twitter
      }
    }
  }
`;
