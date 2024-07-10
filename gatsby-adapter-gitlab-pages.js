const fs = require('fs');
const path = require('path');

const createAdapterGitlabPages = adapterOptions => {
    return {
        name: 'gatsby-adapter-gitlab-pages',

        async adapt({
            routesManifest,
            reporter,
        }) {
            const redirects = routesManifest.filter(route => route.type === 'redirect') || [];
            const redirectsContent = redirects
                .map(redirect => {
                    const status = redirect.status === 301 ? '301' : '302';
                    return `${redirect.path} ${redirect.toPath} ${status}`;
                })
                .join('\n');

            const publicPath = path.join(process.cwd(), 'public');
            const redirectsPath = path.join(publicPath, '_redirects');

            fs.writeFileSync(redirectsPath, redirectsContent, 'utf8');
            reporter.info(`Generated _redirects file at ${redirectsPath} with ${redirects.length} redirects.`);
        },
    };
};

module.exports = createAdapterGitlabPages
