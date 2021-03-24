const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

const withPlugins = require('next-compose-plugins');
const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}


const CssFunc = withCSS(
  withLess(
    withSass({
      env: {
        PUBLIC_URL: "",
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
      }
    })
  )
)

const nextConfig = {
  api: {
    externalResolver: true,
  },
  
}

module.exports = withPlugins( 
  [
    [CssFunc],
  ],
  nextConfig,
);

