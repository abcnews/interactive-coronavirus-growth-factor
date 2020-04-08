module.exports = {
  webpack: config => {
    config.entry["embed"] = [
      config.entry.index[0].replace("index.js", "embed.js")
    ];
    config.devtool = "source-map";
    return config;
  }
};
