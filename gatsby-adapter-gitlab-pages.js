const fs = require('fs');
const path = require('path');

const createAdapterGitlabPages = (adapterOptions = {}) => {
    const { cacheDir = '.gitlab-cache' } = adapterOptions;

    return {
        name: 'gatsby-adapter-gitlab-pages',
        async adapt({ routesManifest, reporter }) {
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
        cache: {
            async restore({ directories, reporter }) {
                const cachePath = path.join(process.cwd(), cacheDir);

                if (!fs.existsSync(cachePath)) {
                    reporter.info(`No cache found at ${cacheDir}. Skipping restore.`);
                    return false; // Indicates no cache was restored
                }

                // Restoring .cache directory
                const gatsbyCache = directories.cache;
                const cachedGatsbyCache = path.join(cachePath, '.cache');
                if (fs.existsSync(cachedGatsbyCache)) {
                    if (fs.existsSync(gatsbyCache)) {
                        fs.rmSync(gatsbyCache, { recursive: true, force: true });
                    }
                    fs.cpSync(cachedGatsbyCache, gatsbyCache, { recursive: true });
                    reporter.info(`Restored Gatsby .cache directory from ${cacheDir}`);
                } else {
                    reporter.warn(`No .cache directory found in ${cacheDir}.`);
                }

                // Restoring public directory
                const publicDir = directories.public;
                const cachedPublicDir = path.join(cachePath, 'public');
                if (fs.existsSync(cachedPublicDir)) {
                    if (fs.existsSync(publicDir)) {
                        fs.rmSync(publicDir, { recursive: true, force: true });
                    }
                    fs.cpSync(cachedPublicDir, publicDir, { recursive: true });
                    reporter.info(`Restored Gatsby public directory from ${cacheDir}`);
                } else {
                    reporter.warn(`No public directory found in ${cacheDir}.`);
                }

                return true; // Indicates cache was restored
            },

            async store({ directories, reporter }) {
                const cachePath = path.join(process.cwd(), cacheDir);

                if (!fs.existsSync(cachePath)) {
                    fs.mkdirSync(cachePath, { recursive: true });
                }

                // Saving .cache directory
                const gatsbyCache = directories.cache;
                const cachedGatsbyCache = path.join(cachePath, '.cache');
                if (fs.existsSync(gatsbyCache)) {
                    fs.rmSync(cachedGatsbyCache, { recursive: true, force: true });
                    fs.cpSync(gatsbyCache, cachedGatsbyCache, { recursive: true });
                    reporter.info(`Saved Gatsby .cache directory to ${cacheDir}`);
                } else {
                    reporter.warn(`No Gatsby .cache directory found to save.`);
                }

                // Saving public directory
                const publicDir = directories.public;
                const cachedPublicDir = path.join(cachePath, 'public');
                if (fs.existsSync(publicDir)) {
                    fs.rmSync(cachedPublicDir, { recursive: true, force: true });
                    fs.cpSync(publicDir, cachedPublicDir, { recursive: true });
                    reporter.info(`Saved Gatsby public directory to ${cacheDir}`);
                } else {
                    reporter.warn(`No Gatsby public directory found to save.`);
                }
            },
        },
    };
};

module.exports = createAdapterGitlabPages
