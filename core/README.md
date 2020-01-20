# @lmack/core

- Quickly setup & configure commonly used Gatsby plugins

### Plugins this package provides:

- gatsby-plugin-theme-ui
- gatsby-plugin-robots-txt
- gatsby-plugin-google-gtag
- gatsby-plugin-netlify
- gatsby-plugin-netlify-cache
- gatsby-plugin-sharp
- gatsby-transformer-sharp
- gatsby-plugin-sitemap
- gatsby-plugin-react-helmet
- gatsby-plugin-catch-links

### Options

| Key              |     Type     | Default Value |                                                                             Details                                                                              |
| ---------------- | :----------: | :-----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| analyticsEnabled |   Boolean    |     false     |                                                   If set to **true**, you must pass a <code>host</code> option                                                   |
| analyticsIds     |    String    |               |                                    **Required** if 'analyticsEnabled' is set to true <br> Accepts multiple (common separated)                                    |
| host             | String (URL) |               |                                                        **Required** if 'analyticsEnabled' is set to true                                                         |
| useNetlify       |   Boolean    |     true      |                                                                                                                                                                  |
| siteMapConfig    |    Object    |               | A 'siteMetadata' object with key 'siteUrl' and a value of your site's URL is **required** <br> Takes an optional 'pluginOptions' object to customize as you like |

### siteMapConfig (example)

```javascript
 siteMapConfig: {
    siteMetadata: {
        siteUrl: `https://example.com`, // required
        title: `lmack-example`,
    }
    // optional
    pluginOptions: {
      output: `/some-other-sitemap.xml`,
    }
}
```

### gatsby-config reference

```javascript
const fonts = require('@campj/utils/fonts')(`./static/fonts`).fonts;
const fontsHeaders = fonts.map(
  ({ url, extension }) =>
    `Link: <${url}>; rel=preload; as=font; type=font/${extension}; crossorigin=anonymous`
);

{
    resolve: `gatsby-plugin-robots-txt`,
    options: {
        host: host (see OPTIONS),
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
        trackingIds: analyticsIds (see OPTIONS),
        pluginConfig: {
            head: false,
            respectDNT: true
        }
    }
},
{
    resolve: `gatsby-plugin-netlify`,
    options: {
        allPageHeaders: [...fontsHeaders]
    }
},
{
    resolve: `gatsby-plugin-sitemap`,
    options: siteMapConfig.pluginOptions (see OPTIONS)
}
```
