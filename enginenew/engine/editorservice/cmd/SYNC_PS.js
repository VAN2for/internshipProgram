/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 同步新版ps
 */
var mysql = require('mysql');
var exec = require('child_process').exec;
var request = require('request');
var tools = require('../utils/utils');
var fsextra = require('fs-extra');
var path = require('path');
const { resolve } = require('path');
var got = require('got');
var FormData = require('form-data');
var config = require('../config/index');

COMMAND_D.registerCmd({
    name : 'SYNC_PS',
    main : function(socket, cookie, data) {
        var type = data.data.type;
        var uploadContent = data.data.uploadContent;
        // aws s3 sync . s3://mmp-portal-dev/ps/project/10354/4my9h6cbzq/   --delete
        // aws s3 sync s3://mmp-portal-dev/ps/project/10354/4my9h6cbzq/ .  --delete
        if (type === 'upload') {
            var force = data.data.force;
            readVersion(force).then(() => {
                fsextra.remove(path.join(G.gameRoot, '../playsmartUploadProject'));
                fsextra.remove(path.join(G.gameRoot, '../playsmartUploadProject.zip'));
                var promiseList = [];
                var contents = uploadContent.split(',');
                contents.forEach((item) => {
                    promiseList.push(new Promise((resolve, reject) => {
                        fsextra.copy(path.join(G.gameRoot, item), path.join(G.gameRoot, '../playsmartUploadProject', item), { recursive: true }, () => {
                            resolve();
                        });
                    }));
                });
                Promise.all(promiseList).then(() => {
                    return tools.compressDirToZip(path.join(G.gameRoot, '../playsmartUploadProject'), path.join(G.gameRoot, '../'));
                }).then((zipPath) => {
                    console.log("zipPath",zipPath);
                    var form = new FormData();
                    form.append('pid', G.config.project.projectId);
                    form.append('mode', 1);
                    form.append('zip_file', fsextra.createReadStream(zipPath));
                    form.append('access_token', config.prod.token);
                    var options = {
                        url: 'https://' + config.prod.domain + '/openapi/internal/playsmart/update-project',
                        method: 'POST',
                        body: form
                    }
                    return new Promise((resolve, reject) => {
                        got(options).then((res) => {
                            console.log(res.statusCode);
                            resolve();
                        })
                    });
                }).then(() => {
                fsextra.remove(path.join(G.gameRoot, '../playsmartUploadProject'));
                fsextra.remove(path.join(G.gameRoot, '../playsmartUploadProject.zip'));
                COMMAND_D.broadcast('SYNC_DONE', {
                    cat: 'upload',
                    content: '同步上传成功'
                });
                });
            }).catch((e) => {
              console.log(e)
              COMMAND_D.broadcast('SYNC_DONE', {
                cat: 'upload',
                content: 'ps平台有最新版本,请先下载',
                type: 'fail'
              });
            });
        } else if (type === 'download') {
            // 同步下载时需要锁住不要Pack的toBin操作
            G.lock = true
            var dirs = data.data.downloadContent;
            fsextra.remove(path.join(G.gameRoot, '../playsmartProject'));
            // https://playable.dev.com:8066/openapi/internal/playsmart/down-project?pid=1025446&access_token=dev
            // var dirs = 'Assets,resource,Temp'
            console.log('开始下载');
            var httpStream = request({
                method: 'GET',
                url: 'https://' + config.prod.domain + '/openapi/internal/playsmart/down-project?pid=' + G.config.project.projectId + '&access_token=' + config.prod.token + '&dirs=' + dirs
            });
            var writeStream = fsextra.createWriteStream(path.join(G.gameRoot + '../playsmartProject.zip'));

            // 联接Readable和Writable
            httpStream.pipe(writeStream);

            // 下载完成
            writeStream.on('close', () => {
                console.log('下载完毕');
                tools.unzip(path.join(G.gameRoot, '../playsmartProject.zip'), path.join(G.gameRoot, '../playsmartProject')).then(() => {
                    const files = fsextra.readdirSync(path.join(G.gameRoot, '../playsmartProject'));
                    const projectName = files[0];
                    const rootPath = path.join(G.gameRoot, '../playsmartProject', projectName + '/');
                    var promiseList = [];
                    tools.dirDFS(rootPath, (filePath) => {
                        // console.log(filePath);
                        var destPath = filePath.replace(rootPath, '');
                        // 动态参数不下载ps平台的,已研发的为准
                        if (destPath.indexOf('gameConfig.json') > -1) {
                            return
                        }
                        // console.log(path.join(G.gameRoot, destPath));
                        promiseList.push(new Promise((resolve, reject) => {
                            fsextra.copy(filePath, path.join(G.gameRoot, destPath), { overwrite: true }, () => {
                                resolve();
                            });
                        }));
                    });
                    Promise.all(promiseList).then(() => {
                        fsextra.remove(path.join(G.gameRoot, '../playsmartProject'));
                        fsextra.remove(path.join(G.gameRoot, '../playsmartProject.zip'));
                        if (!fsExtra.existsSync(path.join(G.gameRoot, 'StartScene_design.html'))) {
                            COMMAND_D.dispatch('START_SCENE_HTML', -1);
                            setTimeout(function () {
                                COMMAND_D.broadcast('cooperationMerge', {});
                            }, 1000);
                        } else {
                            COMMAND_D.broadcast('cooperationMerge', {});
                        }
                        // COMMAND_D.broadcast('SYNC_DONE', {
                        //     cat: 'download',
                        //     content: '同步下载成功,需要刷新生效',
                        //     refresh: true
                        // });
                    }).catch(err => {
                        console.error(err);
                        COMMAND_D.broadcast('SYNC_DONE', {
                            cat: 'download',
                            content: '同步下载失败, 请重新尝试',
                            type: 'fail'
                        });
                    });
                }).catch(error => {
                    console.error(error);
                    COMMAND_D.broadcast('SYNC_DONE', {
                        cat: 'download',
                        content: '同步下载失败, 请重新尝试',
                        type: 'fail'
                    });
                });
            });
            writeStream.on('error', function (err) {
                console.error(err);
                COMMAND_D.broadcast('SYNC_DONE', {
                    cat: 'download',
                    content: '同步下载失败, 请重新尝试',
                    type: 'fail'
                });
            });
        } else if (type === 'mergeFinish') {
            G.lock = false;
            PACK_D.toBin(path.join(G.gameRoot, 'Temp'), 'scene_editor', ['.state']);
            PACK_D.toBin(path.join(G.gameRoot, 'Temp'), 'scene_editor_tech', ['.state']);
            PACK_D.toBin(path.join(G.gameRoot, 'resource/scene'), 'gamePlay', ['.state']);
        }
    }
});

function readVersion(force) {
    return new Promise((resolve, reject) => {
        if (force) {
            resolve();
            return;
        }
        var httpStream = request({
            method: 'GET',
            url: 'https://' + config.prod.domain + '/openapi/internal/playsmart/down-project?pid=' + G.config.project.projectId + '&access_token=' + config.prod.token + '&dirs=info.json'
        });
        var writeStream = fsextra.createWriteStream(path.join(G.gameRoot + '../playsmart_info.zip'));
    
        // 联接Readable和Writable
        httpStream.pipe(writeStream);
    
        // 下载完成
        writeStream.on('close', () => {
            tools.unzip(path.join(G.gameRoot, '../playsmart_info.zip'), path.join(G.gameRoot, '../playsmart_info')).then(() => {
                const files = fsextra.readdirSync(path.join(G.gameRoot, '../playsmart_info/'));
                const infoPath = path.join(G.gameRoot, '../playsmart_info', files[0] + '/', 'info.json');
                if(fsExtra.existsSync(infoPath)) {
                    let designInfo = fs.readFileSync(infoPath, 'utf-8');
                    console.log(designInfo);
                    designInfo = JSON.parse(designInfo);
                    const localInfoPath = path.join(G.gameRoot, 'info.json')
                    if (fsExtra.existsSync(localInfoPath)) {
                        let localInfo = fs.readFileSync(localInfoPath, 'utf-8');
                        localInfo = JSON.parse(localInfo);
                        if (Number(localInfo.version) === Number(designInfo.version)) {
                            resolve();
                        } else {
                            reject();
                        }
                    } else {
                        reject();
                    }
                } else {
                    resolve();
                }
                fsextra.remove(path.join(G.gameRoot, '../playsmart_info'));
                fsextra.remove(path.join(G.gameRoot, '../playsmart_info.zip'));
            });
        });
    });
}