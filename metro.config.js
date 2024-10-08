const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  config.resolver.alias = {
    "@components": "./src/components",
    "@store": "./src/store",
    "@styledComponents": "./src/styledComponents",
    "@schemas": "./src/zod/schemas",
    "@types": "./src/type"
  };

  return config;
})();