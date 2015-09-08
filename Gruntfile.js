/*global module:false*/
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
        pkg: grunt.file.readJSON('./public/package.json'),
		interval: 200,
		jshint: {
			files: './public/res/js/*',
			options: {
				browser: true,
				curly: false,
				eqeqeq: true,
				eqnull: true,
				strict: false,
				camelcase: false,
				unused: true,
				proto: true
			}
		},
		concat: {
			js: {
				options: {
					separator: ';'
				},
				src:  './public/js/res/*',
				dest: './public/js/main.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'./public/js/main.min.js': ['<%= concat.js.dest %>']
				}
			}
		},
		nodewebkit: {
			options: {
				version:   '0.8.6',      // this is the version of node-webkit
				credits:   './public/credits.htm',
				mac_icns:  './icon.icns',
				build_dir: './build',  // Where the build version of my node-webkit app is saved
				mac: true,             // We want to build it for mac
				win: false,            // We want to build it for win
				linux32: false,        // We don't need linux32
				linux64: false         // We don't need linux64
			},
			src: './public/**/*'       // Your node-webkit app
		}
	});

	// npm tasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-node-webkit-builder');

	// Default task.
	grunt.registerTask('default', ['jshint']);
	//grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
	grunt.registerTask('build', ['nodewebkit']);
};
