"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import utils from "./utils";
import keystore from "./keystore";
const isDevelopment = process.env.NODE_ENV !== "production";
const path = require("path");
const fs = require("fs");
const cryptoLib = require("crypto");
const crypto = require("libp2p-crypto");
const secp256k1 = crypto.keys.supportedKeys.secp256k1;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    frame: false,
    minWidth: 1024,
    width: 1024,
    height: 600,
    minHeight: 600,
    icon: path.join(__static, "icon.png"),
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// win.setMenuBarVisibility(false);

ipcMain.on("close-me", (evt, arg) => {
  app.quit();
});

let isMax = false;
ipcMain.on("maximize", (evt, arg) => {
  if (isMax) {
    win.unmaximize();
    isMax = false;
  } else {
    isMax = true;
    win.maximize();
  }
});

ipcMain.on("minimize", (evt, arg) => {
  win.minimize();
});

let homeDir = app.getPath("home") + path.sep;
if (homeDir != "") {
  fs.mkdirSync(homeDir + ".filefilego_wallet" + path.sep + "keystore", {
    recursive: true,
  });
}

let unlock_wallets = [];
let unlocked_wallet = null;

ipcMain.on("unlock_wallet", async (evt, arg) => {
  let keycontent = fs.readFileSync(
    homeDir +
      ".filefilego_wallet" +
      path.sep +
      "keystore" +
      path.sep +
      arg.address +
      ".json"
  );
  let res = await keystore.UnmarshalKey(keycontent, arg.password);

  unlock_wallets.push({ address: arg.address, key: res.key });
  unlocked_wallet = { address: arg.address, key: res.key };
  // evt.reply("unlock_wallet-reply", payload);
  evt.returnValue = { error: res.error };
});

ipcMain.on("accounts", (evt, arg) => {
  let files = utils.readFilesSync(
    homeDir + ".filefilego_wallet" + path.sep + "keystore"
  );
  evt.reply(
    "accounts-reply",
    files.map((o) => {
      return { name: o.name };
    })
  );
});

ipcMain.on("sign_transaction", async (evt, arg) => {
  let foundKeys = unlock_wallets.filter((o) => o.address.includes(arg.From));
  if (foundKeys.length > 0) {
    let signed = await keystore.SignTransaction(arg, foundKeys[0].key);
    evt.returnValue = signed;
  }
  evt.returnValue = false;
});

ipcMain.on("create_wallet", async (evt, arg) => {
  let payload = await keystore.NewKeyAndStoreToPathAndReturnJSON(
    arg,
    homeDir + ".filefilego_wallet" + path.sep + "keystore" + path.sep
  );

  evt.reply("create_wallet-reply", payload);
});

ipcMain.on("is_unlocked_wallet", async (evt, arg) => {
  evt.returnValue = unlock_wallets.filter((o) => o.address == arg).length > 0;
});

ipcMain.on("save_wallet", async (evt, arg) => {
  fs.writeFileSync(
    arg.destination + path.sep + arg.payload.file_name,
    JSON.stringify(arg.payload.key, null, 2)
  );
});

ipcMain.on("import_wallet", async (evt, arg) => {
  if (
    fs.existsSync(
      homeDir +
        ".filefilego_wallet" +
        path.sep +
        "keystore" +
        path.sep +
        path.basename(arg.file)
    )
  ) {
    evt.returnValue = { error: true, message: "this key is already imported" };
  } else {
    let keyData = fs.readFileSync(arg.file);
    let res = await keystore.UnmarshalKey(keyData, arg.password);
    if (!res.error) {
      fs.copyFileSync(
        arg.file,
        homeDir +
          ".filefilego_wallet" +
          path.sep +
          "keystore" +
          path.sep +
          path.basename(arg.file)
      );
      evt.returnValue = { error: false, message: "" };
    }
    evt.returnValue = { error: true, message: res.error };
  }
});

ipcMain.on("sha256", (evt, arg) => {
  evt.returnValue =
    "0x" +
    cryptoLib
      .createHash("sha256")
      .update(arg)
      .digest("hex");
});

ipcMain.on("load_settings", async (evt, arg) => {
  let destinationSettings =
    homeDir + ".filefilego_wallet" + path.sep + "settings.json";

  let jsonSettings = {
    wallet_rpc_endpoint: "",
  };

  if (fs.existsSync(destinationSettings)) {
    let content = fs.readFileSync(destinationSettings);
    jsonSettings = JSON.parse(content);
  }

  evt.returnValue = jsonSettings;
});

ipcMain.on("save_settings", async (evt, arg) => {
  let destinationSettings =
    homeDir + ".filefilego_wallet" + path.sep + "settings.json";
  fs.writeFileSync(destinationSettings, JSON.stringify(arg));
  evt.returnValue = true;
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
