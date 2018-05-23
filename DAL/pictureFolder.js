/**
 * Created by bruce jia on 27/10/2017.
 */

// A module to read through a folder holding pictures
const fs = require('fs');
const path = require('path');

const exts = ['.jpg', '.png', '.bmp'];

function isPictureFile (filePath) {
    for (let i=0; i<exts.length; i++) {
        if (filePath.endsWith(exts[i])) {
            return true;
        }
    }
    return false;
}

function PictureFolder (rootFolder) {
    this._root = rootFolder;
    this._picturePaths = [];
    this._cursor = -1;
}

PictureFolder.prototype.init = function () {

    const that = this;

    const files = fs.readdirSync(this._root);

    if (!files) {
        console.error ("failed to read root directory - " + that._root);
        return;
    }

    files.forEach( function (file){
        const filePath = path.join(that._root, file);
        const result = fs.statSync(filePath);

        if (result.isFile() && isPictureFile(filePath)) {
            that._picturePaths.push(filePath);
        }

        if (result.isDirectory()) {
            //TODO: support subfolders
        }
    });
};

PictureFolder.prototype.getCount = function () {
    return this._picturePaths.length;
};

PictureFolder.prototype.getNext = function () {

    this._cursor++;

    if (this._cursor >= 0 && this._cursor < this._picturePaths.length) {
        return this._picturePaths[this._cursor];
    }

    // reset cursor if our of range
    if (this._cursor >= this._picturePaths.length) {
        this._cursor = this._picturePaths.length - 1;
    }

    return null;
};

PictureFolder.prototype.getPrev = function () {

  this._cursor--;

  if (this._cursor >= 0 && this._cursor < this._picturePaths.length) {
      return this._picturePaths[this._cursor];
  }

  // reset cursor if out of range
  if (this._cursor < 0) {
      this._cursor = 0;
  }

  return null;
};

exports.PictureFolder = PictureFolder;
exports.isPictureFile = isPictureFile;
