module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    template_runner: {
      basic: {
        options: {
          locales: ['en', 'nl'],
          directory: 'locales'
        },
        files: {
          'index.html': ['template/index.template.html'],
        },
      },
    },
  });

  // Load the plugin that provides the "template_unner" task.
  grunt.loadNpmTasks('grunt-template-runner');

  // Default task(s).
  grunt.registerTask('default', ['template_runner']);

};
