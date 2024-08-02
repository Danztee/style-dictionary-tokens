import StyleDictionary from "style-dictionary-utils";

const config = {
  source: ["tokens/**/*.json"],
  platforms: {
    web: {
      transformGroup: "web",
      buildPath: "dist/web/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
        },
      ],
    },

    ios: {
      transformGroup: "ios",
      buildPath: "dist/ios/",
      files: [
        {
          destination: "StyleDictionaryVariables.swift",
          format: "ios-swift/class.swift",
          className: "StyleDictionaryVariables",
        },
      ],
    },

    android: {
      transformGroup: "android",
      buildPath: "dist/android/",
      files: [
        {
          destination: "colors.xml",
          format: "android/colors",
        },
      ],
    },
  },
};

const sd = StyleDictionary.extend(config);
sd.buildAllPlatforms();
