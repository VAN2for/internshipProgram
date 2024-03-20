var fs = require("fs-extra");
var path = require("path");
var archiver = require("archiver");

function packZip(projectPath, gameName) {
    let buildPath = path.dirname(projectPath);
    let gamePath = path.join(buildPath, gameName);
    fs.removeSync(gamePath);
    fs.copySync(projectPath, gamePath);
    fs.removeSync(path.join(gamePath, "folder.ignore"));
    fs.renameSync(path.join(gamePath, "StartGame.html"), path.join(gamePath, `${gameName}.html`));

    createZip(gamePath, gameName);
}

function createZip(gamePath, gameName) {
    const output = fs.createWriteStream(path.join(path.dirname(gamePath), `${gameName}.zip`));
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.pipe(output);
    archive.directory(gamePath, gameName);
    archive.finalize();
}

module.exports = {
    packZip: packZip
}