// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// MapLibre fix for ESM and explicit extensions
config.resolver.unstable_enablePackageExports = true;
config.resolver.sourceExts.push('mjs');

module.exports = config;
