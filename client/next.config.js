const { loadEnvConfig } = require("next/dist/lib/load-env-config");

module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;
        return config;
    }
}