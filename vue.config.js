module.exports = {
  // publicPath: "./",
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // buildResources: 'build'
        productName: "FileFileGo Wallet",
        win: {},
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
      },
    },
  },
};
