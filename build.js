const StyleDictionaryPackage = require("style-dictionary");
const _ = require("lodash");
const fs = require("fs");

const brand = "brand";
const platforms = ["web", "ios", "android"];

function getStyleDictionaryConfig(platform) {
  return {
    source: [
      `src/brands/${brand}/*.json`,
      "src/globals/**/*.json",
      `src/platforms/${platform}/*.json`,
    ],
    platforms: {
      "web/js": {
        transformGroup: "tokens-js",
        buildPath: `dist/web/${brand}/`,
        prefix: "token",
        files: [
          {
            destination: "tokens.es6.js",
            format: "javascript/es6",
          },
        ],
      },
      "web/json": {
        transformGroup: "tokens-json",
        buildPath: `dist/web/${brand}/`,
        prefix: "token",
        files: [
          {
            destination: "tokens.json",
            format: "json/flat",
          },
        ],
      },
      "web/scss": {
        transformGroup: "tokens-scss",
        buildPath: `dist/web/${brand}/`,
        prefix: "token",
        files: [
          {
            destination: "tokens.scss",
            format: "scss/variables",
          },
        ],
      },
      styleguide: {
        transformGroup: "styleguide",
        buildPath: `dist/styleguide/`,
        prefix: "token",
        files: [
          {
            destination: `${platform}_${brand}.json`,
            format: "json/flat",
          },
          {
            destination: `${platform}_${brand}.scss`,
            format: "scss/variables",
          },
        ],
      },
      ios: {
        transformGroup: "tokens-ios",
        buildPath: `dist/ios/${brand}/`,
        prefix: "token",
        files: [
          {
            destination: "tokens-all.plist",
            format: "ios/plist",
          },
          {
            destination: "tokens-colors.plist",
            format: "ios/plist",
            filter: {
              type: "color",
            },
          },
        ],
      },
      android: {
        transformGroup: "tokens-android",
        buildPath: `dist/android/${brand}/`,
        prefix: "token",
        files: [
          {
            destination: "tokens-all.xml",
            format: "android/xml",
          },
          {
            destination: "tokens-colors.xml",
            format: "android/xml",
            filter: {
              type: "color",
            },
          },
        ],
      },
    },
  };
}

// Register custom formats
StyleDictionaryPackage.registerFormat({
  name: "json/flat",
  formatter: function (dictionary) {
    return JSON.stringify(dictionary.allProperties, null, 2);
  },
});

StyleDictionaryPackage.registerFormat({
  name: "ios/plist",
  formatter: function (dictionary) {
    const template = _.template(
      fs.readFileSync(__dirname + "/templates/ios-plist.template", "utf8")
    );
    return template({ allProperties: dictionary.allProperties });
  },
});

StyleDictionaryPackage.registerFormat({
  name: "android/xml",
  formatter: function (dictionary) {
    const template = _.template(
      fs.readFileSync(__dirname + "/templates/android-xml.template", "utf8")
    );
    return template({ allProperties: dictionary.allProperties });
  },
});

// Register custom transforms
StyleDictionaryPackage.registerTransform({
  name: "size/pxToPt",
  type: "value",
  matcher: function (prop) {
    return prop.value.match(/^[\d.]+px$/);
  },
  transformer: function (prop) {
    return prop.value.replace(/px$/, "pt");
  },
});

StyleDictionaryPackage.registerTransform({
  name: "size/pxToDp",
  type: "value",
  matcher: function (prop) {
    return prop.value.match(/^[\d.]+px$/);
  },
  transformer: function (prop) {
    return prop.value.replace(/px$/, "dp");
  },
});

// Register transform groups
StyleDictionaryPackage.registerTransformGroup({
  name: "styleguide",
  transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-js",
  transforms: ["name/cti/constant", "size/px", "color/hex"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-json",
  transforms: ["attribute/cti", "name/cti/kebab", "size/px", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-scss",
  transforms: ["name/cti/kebab", "time/seconds", "size/px", "color/css"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-ios",
  transforms: ["attribute/cti", "name/cti/camel", "size/pxToPt"],
});

StyleDictionaryPackage.registerTransformGroup({
  name: "tokens-android",
  transforms: ["attribute/cti", "name/cti/camel", "size/pxToDp"],
});

console.log("Build started...");

// Process the design tokens for different platforms
platforms.forEach((platform) => {
  console.log("\n==============================================");
  console.log(`\nProcessing: [${platform}] [${brand}]`);

  const StyleDictionary = StyleDictionaryPackage.extend(
    getStyleDictionaryConfig(platform)
  );

  if (platform === "web") {
    StyleDictionary.buildPlatform("web/js");
    StyleDictionary.buildPlatform("web/json");
    StyleDictionary.buildPlatform("web/scss");
  } else if (platform === "ios") {
    StyleDictionary.buildPlatform("ios");
  } else if (platform === "android") {
    StyleDictionary.buildPlatform("android");
  }
  StyleDictionary.buildPlatform("styleguide");

  console.log("\nEnd processing");
});

console.log("\n==============================================");
console.log("\nBuild completed!");
