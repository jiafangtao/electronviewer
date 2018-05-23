
const url = require('url');
const path = require('path');
const { app, BrowserWindow, Menu } = require('electron');


// Keep a global reference to avoid it being garbage collected.
let mainWindow;

const PictureFolder = require('./DAL/pictureFolder').PictureFolder;

/////////////// Preparing the Menu ////////////////

const menuTemplate = [
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {role: 'pasteandmatchstyle'},
            {role: 'delete'},
            {role: 'selectall'}
        ]
    },
    {
        label: 'View',
        submenu: [
            {role: 'reload'},
            {role: 'forcereload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'resetzoom'},
            {role: 'zoomin'},
            {role: 'zoomout'},
            {type: 'separator'},
            {role: 'togglefullscreen'}
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click () { require('electron').shell.openExternal('https://electron.atom.io') }
            }
        ]
    },
    {
        label: 'Single',
        submenu: [
            {
                label: 'Next',
                accelerator: 'CommandOrControl+Down',
                click() { console.log('key down is pressed.'); }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({
        label: app.getName(),
        submenu: [
            {role: 'about'},
            {type: 'separator'},
            {role: 'services', submenu: []},
            {type: 'separator'},
            {role: 'hide'},
            {role: 'hideothers'},
            {role: 'unhide'},
            {type: 'separator'},
            {role: 'quit'}
        ]
    });
}


const menu = Menu.buildFromTemplate(menuTemplate);


let pfObj = null;

function createMainWindow () {
    mainWindow = new BrowserWindow ({width: 800, height: 600, backgroundColor: '#000000'});

    const rootFolder = path.join(__dirname, 'pictures');
    pfObj = new PictureFolder (rootFolder);
    pfObj.init ();

    console.log ("There are totally " + pfObj.getCount() + " pictures.");

    const firstPicPath = pfObj.getNext();
    loadPicture(firstPicPath);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function loadPicture (filePath) {

    if (filePath) {
        const picUrl = url.format({
            pathname: filePath,
            protocol: 'file',
            slashes: true
        });

        if (mainWindow) {
            mainWindow.loadURL(picUrl);
        }
    }
}

function loadNextPicture (pictureFolderObj) {

    const filePath = pictureFolderObj.getNext();
    if (filePath) {
        loadPicture (filePath);
    }
}

function loadPrevPicture (pictureFolderObj) {

    const filePath = pictureFolderObj.getPrev();
    if (filePath) {
        loadPicture (filePath);
    }
}

app.on('ready', function () {
    // Set a playground
    createMainWindow();

    // set up main menu
    Menu.setApplicationMenu(menu);

    //TODO: refactor the shortcut registering code
    // register global shortcuts
    const { globalShortcut } = require('electron');

    let ret = globalShortcut.register('Down', loadNextPicture.bind(this, pfObj) );
    if (!ret) {
        console.log ('failed to register shortcut for DOWN.');
    }

    ret = globalShortcut.register('PageDown', loadNextPicture.bind(this, pfObj));
    if (!ret) {
        console.log ('failed to register shortcut for PageDown.');
    }

    ret = globalShortcut.register('Right', loadNextPicture.bind(this, pfObj));
    if (!ret) {
        console.log ('failed to register shortcut for Right.');
    }

    ret = globalShortcut.register('Up', loadPrevPicture.bind(this, pfObj));
    if (!ret) {
        console.log ('failed to register shortcut for UP.');
    }

    ret = globalShortcut.register('PageUp', loadPrevPicture.bind(this, pfObj));
    if (!ret) {
        console.log ('failed to register shortcut for PageUp.');
    }

    ret = globalShortcut.register('Left', loadPrevPicture.bind(this, pfObj));
    if (!ret) {
        console.log ('failed to register shortcut for Left.');
    }

    // Hide window
    if (globalShortcut.isRegistered('CommandOrControl+2')) {
        console.log ("accelerator has already been registered.");
    }
    else {
        ret = globalShortcut.register('CommandOrControl+2', function () {
            console.log ("hiding the main window");

            if (mainWindow) {
                mainWindow.hide();
            }
        });
        if (!ret) {
            console.log ('failed to register shortcut for Ctrl+2.');
        }
    }

    // Re-show the main window
    if (globalShortcut.isRegistered('CommandOrControl+3')) {
        console.log ("accelerator has already been registered.");
    }
    else {
        ret = globalShortcut.register('CommandOrControl+3', function () {
            console.log ("showing the main window");
            if (!mainWindow) {
                createMainWindow();
            }

            mainWindow.show();
        });
        if (!ret) {
            console.log ('failed to register shortcut for Ctrl+3.');
        }
    }
});

app.on('window-all-closed', function () {
    // On OS X this just close the window without quit the app
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createMainWindow ();
    }
});

app.on('quit', () => {
    "use strict";
    const { globalShortcut } = require('electron');
    globalShortcut.unregisterAll();
    console.log ("All shortcuts are unregistered.");
});
