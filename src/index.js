import StyleDictionary from "style-dictionary-utils";

const config = {
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      buildPath: "dist/web/",
      // transformGroup: ["css"],
      transforms: [
        "attribute/cti",
        "name/cti/kebab",
        "dimension/pixelToRem",
        "color/rgba",
      ],
      files: [
        {
          format: "css/variables",
          destination: "variables.css",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
};

const sd = StyleDictionary.extend(config);
sd.buildAllPlatforms();
