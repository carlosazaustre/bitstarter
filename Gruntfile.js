var path = require('path');
var stylesDir = 'public/stylesheets';

module.exports = function(grunt) {
  grunt.initConfig({    
    bgShell: {
      runNode: {
        cmd: 'nodemon web.js',
        bg: true
      }
    },
    stylus: {
      compile: {
        options: {
          paths: [stylesDir],
          banner: '/*!<%= grunt.template.date() %> */\n',
          'include css': true
        },
        files: {
          'public/styles.css': stylesDir + '/main.styl'
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'public/',
        src: ['*.css', '!*.min.css'],
        dest: 'public/',
        ext: '.min.css'
      }
    },
    watch: {
      stylesheets: {
        files: [stylesDir + '/**/*.styl', stylesDir + '/**/*.css'],
        tasks: ['stylus'],
        options: {
          interrupt: true
        }
      }
    }
  });

  // load grunt plugins defined on package.json
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('start', ['stylus', 'bgShell:runNode', 'cssmin', 'watch']);

};

