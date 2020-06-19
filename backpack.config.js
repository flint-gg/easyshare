const path = require('path');
/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars, no-param-reassign */
module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './server/app.ts';
    config.output.path = path.join(process.cwd(), 'build');
    // Typescript configuration
    const tsLoader = {
      loader: 'ts-loader',
      options: { appendTsSuffixTo: [/\.vue$/], transpileOnly: true },
      exclude: [/vendor/, /\.nuxt/],
    };
    config.module.rules.push({
      test: /((client|server)\.js)|(\.tsx?)$/,
      ...tsLoader,
    });
    config.resolve.extensions.push('.ts');
    config.module.rules.map((rule) => {
      if (rule.loader === 'vue-loader') {
        rule.options.loaders = { ts: tsLoader };
      }
      return rule;
    });
    config.optimization = {
      minimizer: [
        () => {},
      ],
    };
    return config;
  },
};
