module.exports = {
  css: {
    loaderOptions: {
      // La propriété 'additionalData' est passée au sass-loader pour charger le fichier
      // 'couleurs.scss' dans la balise 'style' de chacun des composants de l'application.
      // Note: cette option se nomme "prependData" avec sass-loader v8
      // Voir : https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
      scss: {
        additionalData: '@import "@/assets/styles/variables.scss";',
      },
    },
  },
};
