module.exports = function(grunt) {
    'use strict';

    var DIST_DIR = 'dist',
        TMP_DIR = 'tmp';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // compress: {
        //     main: {
        //         options: {
        //             archive: DIST_DIR + '/<%= pkg.name %>.zip'
        //         },
        //         expand: true,
        //         cwd: TMP_DIR,
        //         src: ['**/*']
        //     }
        // },
        // copy: {
        //     main: {
        //         src: [
        //             '**/*',
        //             '!adminer.php',
        //             '!CI_phpStorm.php',
        //             '!config.codekit',
        //             '!config.rb',
        //             '!DB_active_rec.php',
        //             '!Gruntfile.js',
        //             '!my_models.php',
        //             '!package.json',
        //             '!**/assets/sass/**',
        //             '!**/assets/doc/**',
        //             '!**/db_schema/**',
        //             '!**/node_modules/**'
        //         ],
        //         expand: true,
        //         cwd: '.',
        //         dest: TMP_DIR,
        //     },
        // },
        clean: [TMP_DIR, DIST_DIR]
    });

    // grunt.loadNpmTasks('grunt-contrib-compress');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean']);

};
