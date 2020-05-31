//import dotenv from 'dotenv'
//dotenv.config({ silent: true })
require('dotenv').config()

const config = require('./config/site');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})

module.exports = {
  siteMetadata: {
    ...config,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'blog',
    //     path: `${__dirname}/content/posts/blog`,
    //   },
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/images`,
        name: 'images',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/posts/guides`,
        name: 'care',
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1600,
              quality: 90,
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-prismjs',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-emotion',
      options: {
        autoLabel: process.env.NODE_ENV !== 'production',
        // eslint-disable-next-line
        labelFormat: `[filename]--[local]`,
      },
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'config/typography.js',
      },
    },
    'gatsby-plugin-sharp',
    //'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: config.title,
        short_name: config.shortName,
        description: config.description,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: 'standalone',
        icon: config.favicon,
      },
    },
    'gatsby-plugin-offline',
    
    // {
    //   resolve: `gatsby-plugin-purgecss`,
    //   options: {
    //     printRejected: true, // Print removed selectors and processed file names
    //     // develop: true, // Enable while using `gatsby develop`
    //     // tailwind: true, // Enable tailwindcss support
    //     // whitelist: ['whitelist'], // Don't remove this selector
    //     // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
    //     // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
    //   },
    // },
    
    {
        resolve: `gatsby-plugin-netlify`,
        options: {
          headers: {
            "/*": [
              "Access-Control-Allow-Origin: *",
              "Access-Control-Allow-Headers: Content-Type",
            ],
          }
        }     
    },
    {
      resolve: `gatsby-source-stripe`,
      options: {
        objects: ["Sku", "Coupon"],
        secretKey: process.env.STRIPE_API_SECRET,
        downloadFiles: true,
        auth: false
      },
    },
    {
			resolve: `gatsby-plugin-pinterest-twitter-facebook`,
			options: {
				delayTimer: 100,
				pinterest: {
					enable: true,
					tall: true,
					round: false
				},
				// twitter: {
				// 	enable: true,
				// 	containerSelector: '.twitter-container',
				// 	handle: process.env.GATSBY_TWITTER_SOURCE,
				// 	showFollowButton: true,
				// 	showTimeline: true,
				// 	showFollowerCount: true,
				// 	timelineTweetCount: 1,
				// 	width: null,
				// 	height: null,
				// 	noHeader: true,
				// 	noFooter: true,
				// 	noBorders: true,
				// 	noScrollbar: true,
				// 	transparent: true,
				// },
				// facebook: {
				// 	enable: true,
				// 	containerSelector: '.facebook-container',
				// 	profile: process.env.GATSBY_FACEBOOK_SOURCE,
				// 	// width: 340,
				// 	// height: 500,
				// 	tabs: 'timeline, events, messages',
				// 	hideCover: false,
				// 	showFacepile: true,
				// 	smallHeader: false,
				// 	adaptContainerWidth: true
				// },
			},
		},
    // {
    //   resolve: `gatsby-plugin-owa`,
    //   options: {
    //     siteId: 'OWA_SITE_ID',
    //     owaUrl: 'OWA_URL'
    //   }
    // },
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     // The property ID; the tracking code won't be generated without it
    //     trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
    //     // Defines where to place the tracking script - `true` in the head and `false` in the body
    //     head: false,
    //     // Setting this parameter is optional
    //     anonymize: true,
    //     // Setting this parameter is also optional
    //     respectDNT: true,
    //     // Avoids sending pageview hits from custom paths
    //     exclude: ["/preview/**", "/do-not-track/me/too/"],
    //     // Delays sending pageview hits on route update (in milliseconds)
    //     pageTransitionDelay: 0,
    //     // Enables Google Optimize using your container Id
    //     optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
    //     // Enables Google Optimize Experiment ID
    //     experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
    //     // Set Variation ID. 0 for original 1,2,3....
    //     variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
    //     // Any additional optional fields
    //     sampleRate: 5,
    //     siteSpeedSampleRate: 10,
    //     cookieDomain: "example.com",
    //   },
    // },
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        // your google analytics tracking id
        trackingId: `UA-158535531-1`,
        // Puts tracking script in the head instead of the body
        head: true,
        // enable ip anonymization
        anonymize: true,
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-PD9CWGR",
  
        includeInDevelopment: false,
        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        // Defaults to null
        defaultDataLayer: { platform: "gatsby" },
  
        // Specify optional GTM environment details.
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        // dataLayerName: "YOUR_DATA_LAYER_NAME",
      },
    },
    {
      resolve: `@mangoart/gatsby-plugin-purechat`,
      options: {
        // include the PureChat js snippet
        enabled: true,
        // your website id, extract from the snippet provided by purechat 
        websiteId: `95d36fea-f481-4495-8662-b3f118d5b387`, 
      },
    },
    // {
    //   resolve: `plugin-purechat`,
    //   options: {
    //     // include the PureChat js snippet
    //     enabled: true,
    //     // your website id, extract from the snippet provided by purechat 
    //     websiteId: `95d36fea-f481-4495-8662-b3f118d5b387`, 
    //     delayLoad: true,
    //     delayLoadTime: 1000,
    //   },
    // },
    // "gatsby-theme-gallery",
    //`gatsby-plugin-netlify-cms`,
    // {
    //   resolve: "gatsby-theme-auth0",
    //   options: {
    //     domain: 'https://dev-cbk6z20i.auth0.com',
    //     clientID: '2VYDe7FojdVooeMFbcWsf9rXEI0F8clm',
    //     redirectUri: 'https://sweetleaf-gc.netlify.com/callback',
    //     // audience: process.env.AUTH0_AUDIENCE, // Optional
    //     // responseType: process.env.AUTH0_RESPONSE_TYPE, // Optional
    //     // scope: process.env.AUTH0_SCOPE, // Optional
    //     callbackPath: "/callback", // Optional
    //   },
    // },
    `gatsby-plugin-force-trailing-slashes`,
    {
      resolve: `gatsby-plugin-advanced-sitemap`,
      options: {
           // 1 query for each data type
        
          exclude: [
              `/404`,
              `/tags/`,
              ///(\/)?hash-\S*/, // you can also pass valid RegExp to exclude internal tags for example
          ],
          createLinkInHead: true, // optional: create a link in the `<head>` of your site
          addUncaughtPages: true, // optional: will fill up pages that are not caught by queries and mapping and list them under `sitemap-pages.xml`
      }
    },
    {
      resolve: 'gatsby-plugin-mailchimp',
      options: {
          endpoint: 'https://sweetleafsucculents.us18.list-manage.com/subscribe/post?u=a0089393547a91632f9fa7f45&amp;id=dc39dd6a41', // add your MC list endpoint here; see instructions below
      },
    },
    // {
    //   resolve: 'gatsby-plugin-load-script',
    //   options: {
        
    //     src: 'https://staticw2.yotpo.com/oqoqaYJmZaZJrICMIqc4gz5ehcle2gb97m3WJojY/widget.js',
        
    //   },
    // },
  ],
};
