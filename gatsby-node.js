const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { zipFunctions } = require('@netlify/zip-it-and-ship-it');

sharp.cache(false);
sharp.simd(false);

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const postTemplate = path.resolve('src/templates/post.jsx');
    const blogTemplate = path.resolve('src/templates/blogTemplate.jsx');
    const careTemplate = path.resolve('src/templates/careTemplate.jsx');

    const tagPage = path.resolve('src/pages/tags.jsx');
    const tagPosts = path.resolve('src/templates/tag.jsx');

    resolve(
      graphql(
        `
          query {
            allMarkdownRemark(
              sort: { order: ASC, fields: [frontmatter___date] }
            ) {
              edges {
                node {
                  frontmatter {
                    path
                    title
                    tags
                    id
                    posttype
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          return reject(result.errors);
        }

        const posts = result.data.allMarkdownRemark.edges;

        const postsByTag = {};
        // create tags page
        posts.forEach(({ node }) => {
          if (node.frontmatter.tags) {
            node.frontmatter.tags.forEach(tag => {
              if (!postsByTag[tag]) {
                postsByTag[tag] = [];
              }

              postsByTag[tag].push(node);
            });
          }
        });

        const tags = Object.keys(postsByTag);

        createPage({
          path: '/tags',
          component: tagPage,
          context: {
            tags: tags.sort(),
          },
        });

        //create tags
        tags.forEach(tagName => {
          const posts = postsByTag[tagName];

          createPage({
            path: `/tags/${tagName}`,
            component: tagPosts,
            context: {
              posts,
              tagName,
            },
          });
        });

        posts.forEach(({ node }, index) => {
          const id = node.frontmatter.id;
          const path = node.frontmatter.path;

          const prev = index === 0 ? null : posts[index - 1].node;
          const next =
            index === posts.length - 1 ? null : posts[index + 1].node;

          if (node.frontmatter.posttype === "guides") {
            // OR if(node.frontmatter.id === 1000) similar to above tags function
            createPage({
              path,
              component: careTemplate,
              context: {
                pathSlug: path,
                prev,
                next,
              },
            });
          }
          else {
            createPage({
              path,
              component: postTemplate,
              context: {
                pathSlug: path,
                prev,
                next,
              },
            });
          }
        });

        //create posts
        // posts.forEach(({ node }, index) => {
        //   const path = node.frontmatter.path;
        //   const prev = index === 0 ? null : posts[index - 1].node;
        //   const next =
        //     index === posts.length - 1 ? null : posts[index + 1].node;
        //   createPage({
        //     path,
        //     component: postTemplate,
        //     context: {
        //       pathSlug: path,
        //       prev,
        //       next,
        //     },
        //   });
        // });

        // posts.forEach(({ node }, index) => {
        //   const path = node.frontmatter.path;
        //   const prev = index === 0 ? null : posts[index - 1].node;
        //   const next =
        //     index === posts.length - 1 ? null : posts[index + 1].node;
        //   createPage({
        //     path,
        //     component: blogTemplate,
        //     context: {
        //       pathSlug: path,
        //       prev,
        //       next,
        //     },
        //   });
        // });

      })
    );
  });
};

exports.onPostBuild = () => {
  const srcLocation = path.join(__dirname, `src/lambda-build`);
  const outputLocation = path.join(__dirname, `public/functions`);
  if (!fs.existsSync(outputLocation)) {
    fs.mkdirSync(outputLocation);
  }
  return zipFunctions(srcLocation, outputLocation);
};

/* Allows named imports */
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  });
};
