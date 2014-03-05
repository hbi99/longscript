/*global module:false*/
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		interval: 200,
		jshint: {
			files: ['res/js/*'],
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
				src: [
					'../js/main.js'
				],
				dest: '../dist/scripts.js'
			}
		},
		uglify: {
			dist: {
				files: {
					'../dist/scripts.min.js': ['<%= concat.js.dest %>']
				}
			}
		}
	});

	// npm tasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task.
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
};
