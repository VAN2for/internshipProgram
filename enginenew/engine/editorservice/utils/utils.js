const unzipStream = require('unzip-stream');
const { createReadStream, statSync, writeFileSync, writeFile, readFileSync, readdirSync, fstat, createWriteStream } = require('fs')
const JSZip = require('jszip')
const path = require('path')
const { ensureDirSync, ensureFileSync } = require('fs-extra')

/**
 * 解压zip
 * @param {string} zipPath 
 * @param {string} savePath 
 * @returns 
 */
function unzip(zipPath, savePath) {
    return new Promise((resolve, reject) => {
        createReadStream(zipPath).pipe(unzipStream.Extract({ path: savePath })).once('close', () => {
            try {
                statSync(savePath);
                resolve();
            } catch (error) {
                reject(error);
                throw error;
            }
        });
    });
}


async function compressDirToZip(srcPath, savePath) {
    /**
     * @param {JSZip} zip 压缩包
     * @param {String} readPath 数据读取路径
     * @param {String} savePath 压缩包中的存储路径
     */
    function compress(zip, readPath, savePath) {
        if (statSync(readPath).isDirectory()) {
            const files = readdirSync(readPath);
            files.forEach(fileName => compress(zip, path.join(readPath, fileName), path.join(savePath, fileName)));
        } else {
            savePath = savePath.replace(/\\/g, '/'); // 兼容window的\分隔符
            zip.file(savePath, readFileSync(readPath));
        }
    }
    return new Promise((resolve, reject) => {
        const zip = new JSZip();
        const saveName = path.basename(srcPath);
        compress(zip, srcPath, saveName);
        zip.generateAsync({
            type: 'uint8array',
        }).then((zipData) => {
            const zipPath = path.join(savePath, saveName) + '.zip'
            writeFile(zipPath, zipData, (err) => {
              if(err) {
                console.error(err)
                reject();
                return;
              }
              resolve(zipPath)
            });
        });
    });
}

async function unzipByJSZip(input, outputPath) {
    const buffer = (typeof input === 'string' && input.endsWith('.zip')) ? readFileSync(input) : input
    const zip = await JSZip.loadAsync(buffer)
    const saveAllFiles = Object.entries(zip.files).map(async ([filePath, file]) => {
        const targetPath = path.join(outputPath, filePath)

        // 适配 windows
        if (targetPath.endsWith('/') || targetPath.endsWith('\\')) {
            ensureDirSync(targetPath)
        } else {
            const content = await file.async('nodebuffer')
            ensureFileSync(targetPath)
            writeFileSync(targetPath, content)
        }
    })
    await Promise.all(saveAllFiles)
}

function dirDFS(rootUrl, fileHandler) {
    const files = readdirSync(rootUrl)
    for (const i in files) {
      const file = files[i]
      const fPath = path.join(rootUrl, file);
      const stat = statSync(fPath)
      if (stat.isFile()) {
        fileHandler(fPath)
      } else {
        dirDFS(fPath, fileHandler)
      }
    }
}


module.exports = {
    unzip,
    compressDirToZip,
    unzipByJSZip,
    dirDFS
}
