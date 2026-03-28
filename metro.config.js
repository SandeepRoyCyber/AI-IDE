const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow llama.rn to bundle .gguf model files and metal shaders
config.resolver.assetExts.push(
  'gguf',  // GGUF model files
  'bin',   // binary model files
  'metal', // Metal shaders (iOS)
);

// Allow llama.rn native modules
config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;
