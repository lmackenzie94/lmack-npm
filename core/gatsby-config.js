const fonts = require('@campj/utils/fonts')(`./static/fonts`).fonts;
const fontsHeaders = fonts.map(
  ({ url, extension }) =>
    `Link: <${url}>; rel=preload; as=font; type=font/${extension}; crossorigin=anonymous`
);

module.exports = ({
  analyticsEnabled = false,
  analyticsIds,
  useNetlify = true,
  host,
  siteMapConfig
}) => {
  const plugins = [];
  const trackingIds = [analyticsIds];

  // THEME UI
  plugins.push(`gatsby-plugin-theme-ui`);

  // ANALYTICS
  if (analyticsEnabled) {
    plugins.push(
      {
        resolve: `gatsby-plugin-robots-txt`,
        options: {
          host: host,
          env: {
            development: {
              policy: [{ userAgent: '*', disallow: ['/'] }]
            },
            production: {
              policy: [{ userAgent: '*', allow: '/' }]
            }
          }
        }
      },
      {
        resolve: `gatsby-plugin-google-gtag`,
        options: {
          trackingIds: trackingIds,
          pluginConfig: {
            head: false,
            respectDNT: true
          }
        }
      }
    );
  }

  // NETLIFY
  if (useNetlify) {
    plugins.push(
      {
        resolve: `gatsby-plugin-netlify`,
        options: {
          allPageHeaders: [...fontsHeaders]
        }
      },
      `gatsby-plugin-netlify-cache`
    );
  }

  // SITE MAP
  if (!siteMapConfig.siteMetadata.siteUrl) {
    let error = `@campj/core: Please add your 'siteUrl' as a key on the 'siteMetadata' object within 'siteMapConfig'. See @campj/core docs for an example.`;
    throw error;
  }
  let siteMapMetadata;
  if (siteMapConfig.siteMetadata) {
    siteMapMetadata = siteMapConfig.siteMetadata;
  }
  if (siteMapConfig.pluginOptions) {
    plugins.push({
      resolve: `gatsby-plugin-sitemap`,
      options: siteMapConfig.pluginOptions
    });
  } else {
    plugins.push(`gatsby-plugin-sitemap`);
  }

  // SHARP
  plugins.push(`gatsby-plugin-sharp`, `gatsby-transformer-sharp`);

  // OTHER
  plugins.push(`gatsby-plugin-react-helmet`, `gatsby-plugin-catch-links`);

  return {
    siteMetadata: siteMapMetadata,
    plugins: plugins
  };
};
