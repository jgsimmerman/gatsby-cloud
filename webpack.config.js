const { EnvironmentPlugin } = require("webpack");

module.exports = {
  entry: "./workers-site/index.js",
  plugins: [
    new EnvironmentPlugin({
      stripeApiSecret: 'unknown',
    })
  ]
}