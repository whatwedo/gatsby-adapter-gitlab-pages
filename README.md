# Gatsby Adapter for GitLab Pages
The `gatsby-adapter-gitlab-pages` is a custom Gatsby adapter that facilitates the deployment of Gatsby sites to GitLab Pages. It specifically handles the generation of the `_redirects` file required for managing redirects on GitLab Pages.

## Features
- **Redirect Management:** Automatically generates a `_redirects` file based on the redirects defined in your Gatsby project.
- **Seamless Integration:** Integrates smoothly with the Gatsby build process.

## Dependencies
The adapters feature was added in gatsby@5.12.0. For that your Gatsby has to work with version 5+.

## Learning Resources
- [Gatsby Adapters](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/adapters/)
- [Working with Redirects and Rewrites](https://www.gatsbyjs.com/docs/how-to/cloud/working-with-redirects-and-rewrites/)
- [Gatsby Adapter for Netlify](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-adapter-netlify)

## How to install

### Package Installation
Install this adapter as a NPM dependency:

```
npm install @whatwedo/gatsby-adapter-gitlab-pages
```

### Update gatsby-config.js
Add the adapter to your Gatsby configuration:

```
module.exports = {
  siteMetadata: {
    title: 'My Gatsby Site',
    description: 'A site built with Gatsby and hosted on GitLab Pages.',
  },
  plugins: [
    // Other plugins...
  ],
  adapter: require('@whatwedo/gatsby-adapter-gitlab-pages')(),
};
```

## Examples of usage

### Define Redirects
Define your redirects in gatsby-node.js using the createRedirect action:

```
exports.createPages = async ({ actions }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: '/old-url',
    toPath: '/new-url',
    isPermanent: true,
    statusCode: 301,
  });

  createRedirect({
    fromPath: '/another-old-url',
    toPath: '/another-new-url',
    isPermanent: false,
    statusCode: 302,
  });
};
```

### Build and Deploy
Build your site and deploy it to GitLab Pages:

```
gatsby build
```

The `_redirects` file will be generated in the public directory and used by GitLab Pages to manage redirects.

## Credits
This adapter was developed by [whatwedo](https://www.whatwedo.ch).

We initially created this adapter for our own website to handle redirects on GitLab Pages effectively. To give back to the open source community, we decided to share it. We hope it helps others as much as it has helped us.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request with any changes.

## License
This project is licensed under the MIT License.