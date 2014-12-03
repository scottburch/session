module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.js'],
                        dest: 'build/',
                        ext: '.min.js',
                        extDot: 'last'
                    }
                ]
            }
        },
        jasmine: {
            pivotal: {
                src: ['src/session.js', 'src/session.builder.js'],
                options: {
                    specs: 'spec/**/*Spec.js',
                    helpers: 'spec/*Helper.js',
                    vendor: [
                        "vendor/lodash.js",
                        'vendor/underscore-fn.min.js'
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', ['uglify']);
};