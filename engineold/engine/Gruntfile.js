module.exports = function (grunt) {  
    // Build typescript
    var path = 'D:/MobVista/playsmart-projects/ddz/';
    grunt.initConfig({
        typescript: {
            default: {
                src: [path + "TypeScripts/**/*.ts"],
                dest: path + "Scripts/ts.js",
                options: {
                    removeComments: false,
                    target: "es5",
                    declaration: false,
                    sourceMap: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.registerTask('ts', ["typescript:default"]);
};

