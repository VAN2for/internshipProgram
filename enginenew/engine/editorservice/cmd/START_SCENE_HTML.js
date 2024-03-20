/**
 * @author weism
 * copyright 2015 Qcplay All Rights Reserved.
 *
 * 请求生成Temp/StartScene.html
 */
var fs = fsExtra;

COMMAND_D.registerCmd({
    name : 'START_SCENE_HTML',
    main : function(socket, cookie, paras) {
        // 读取模板文件
        var content, content_tech, content_design
        if (G.config.project.isNewPS) {
            content = fs.readFileSync(path.join(G.editorRoot, 'Template/StartScenePS.template.html'), 'utf8');
            content_tech = fs.readFileSync(path.join(G.editorRoot, 'Template/StartScenePS_tech.template.html'), 'utf8');
            content_design = fs.readFileSync(path.join(G.editorRoot, 'Template/StartScenePS_design.template.html'), 'utf8');
        } else {
            if (G.config.project.isSceneProject) {
                if (G.config.project.isPlaySmartEditorData) {
                    content = fs.readFileSync(path.join(G.editorRoot, 'Template/StartSceneForSceneProject.templet.html'), 'utf8');
                } else {
                    content = fs.readFileSync(path.join(G.editorRoot, 'Template/StartSceneForSceneProject2.templet.html'), 'utf8');
                }
            } else {
                if (G.config.project.isPlaySmartEditorData) {
                    content = fs.readFileSync(path.join(G.editorRoot, 'Template/StartScenePed.templet.html'), 'utf8');
                } else {
                    content = fs.readFileSync(path.join(G.editorRoot, 'Template/StartScene.templet.html'), 'utf8');
                }
            }
        }
        // 替换插件文件
        content = PLUGIN_SCRIPTS_D.genTemplateContent(content);
        content_tech = PLUGIN_SCRIPTS_D.genTemplateContent(content_tech);
        content_design = PLUGIN_SCRIPTS_D.genTemplateContent(content_design);
        // 写入目标文件
        // fs.writeFileSync(G.gameRoot + 'Temp/StartScene.html',
        //     USER_SCRIPTS_D.genTemplateContent(content));
        fs.writeFileSync(G.gameRoot + 'StartScene.html',
            USER_SCRIPTS_D.genTemplateContent(content));
        fs.writeFileSync(G.gameRoot + 'StartScene_tech.html',
            USER_SCRIPTS_D.genTemplateContent(content_tech));
        fs.writeFileSync(G.gameRoot + 'StartScene_design.html',
            USER_SCRIPTS_D.genTemplateContent(content_design));
        return 1;
    }
});
