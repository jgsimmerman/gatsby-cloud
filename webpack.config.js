const { EnvironmentPlugin } = require("webpack");

module.exports = {
  entry: "./",
  plugins: [
    new EnvironmentPlugin({
      stripeApiSecret: 'unknown',
    })
  ]
}