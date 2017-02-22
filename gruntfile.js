module.exports = function (grunt) {
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		uglify: {
			build: {
			  src: 'public_html/require.js',
			  dest: 'public_html/require.min.js',
			  sourceMap: true
			}
		},
		clean:['public_html/*'],
		copy: {
			build: {
				  files:[{expand: true, cwd: 'files/', src: ['index.html'], dest: 'public_html/'}]
			}
		},
		browserify: {
			options: {
				alias: {
					'History':'./files/jquery.history.js',
					'jquery':'./../jquery/jquery-2.0.0.js'
				},
				browserifyOptions: {
					debug: true,
					dedupe: true
				},
				transform: true ? [['babelify', {presets: ['es2015']}]]:undefined
			},
			build: {
				files: {
					'public_html/require.js': ['files/jquery.page.js', 'files/main.js']
				},
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.registerTask('build', [
		'copy',
		'browserify',
		//'uglify'
	]);
};
