// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  pwa: {
    name: "Toccatech",
    themeColor: "#9E1030",
    // iconPaths: {
    //   favicon32: "favicon-32x32.png",
    //   favicon16: "favicon-16x16.png",
    //   appleTouchIcon: "favicon-32x32.png",
    //   maskIcon: "favicon-32x32.png",
    //   msTileImage: "favicon-32x32.png",
    // },

    workboxOptions: {
      skipWaiting: true, // Télécharger automatiquement le nouveau contenu
    },
  },
};
