module.exports = {
  // publicPath: "./",
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      // externals: ["libp2p-noise", "libp2p-crypto", "libp2p-gossipsub"],
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
