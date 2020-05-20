const { resolve } = require("path");
module.exports = {
  build: {
    addModernJS: true
  },
  webpack: config => {
    config.entry["embed"] = [
      config.entry.index[0].replace("index.js", "embed.js")
    ];
    config.devtool = "source-map";

    const rules = config.module.rules;
    const scriptsRule = rules.find(x => x.__hint__ === "scripts");

    scriptsRule.include.push(
      resolve(__dirname, "node_modules/d3-array"),
      resolve(__dirname, "node_modules/d3-dsv"),
      resolve(__dirname, "node_modules/d3-path"),
      resolve(__dirname, "node_modules/d3-scale"),
      resolve(__dirname, "node_modules/d3-shape")
    );

    rules.unshift({
      test: /\.worker\.js$/,
      use: [
        {
          loader: "worker-loader",
          options: {
            inline: true
          }
        }
      ]
    });

    return config;
  }
};
