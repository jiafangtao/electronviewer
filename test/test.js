const assert = require('assert');
const path = require('path');
const { PictureFolder, isPictureFile } = require('../DAL/pictureFolder');


describe('pictureFolder', function () {

    describe('#getCount()', function () {
        it ('should contain image files in the test data folder.', function () {
            const folderPath = path.join(__dirname, '../pictures/');
            const pf = new PictureFolder(folderPath);
            pf.init ();

            assert.notEqual(pf.getCount(), 0);
        });
    });

    describe('#getNext()', function () {
        it ('should return path to the next image file in the folder', function () {
            const pf = new PictureFolder(path.join(__dirname, '../pictures/'));
            pf.init ();

            do {
                let filePath = pf.getNext();
                if (!filePath) {
                    break;
                }
            }
            while(true);
        });
    });

    describe('#getPrev()', function () {
        it ('should return path to the previous image file in the folder', function () {
            const pf = new PictureFolder(path.join(__dirname, '../pictures/'));
            pf.init ();

            const path1 = pf.getNext();
            const path2 = pf.getNext();

            pf.getNext();

            assert.equal(pf.getPrev(), path2);
            assert.equal(pf.getPrev(), path1);
            assert.equal(pf.getPrev(), null);
        });
    });
});

describe('isPictureFile', function () {
    it('should return true for an image file path', function () {
        assert(isPictureFile('/foo/bar/test.jpg'), 'JPG files should be supported');
        assert(isPictureFile('/foo/bar/test.png'), 'PNG files should be supported');
        assert(isPictureFile('/foo/bar/test.bmp'), 'BMP files should be supported');
    });
});
