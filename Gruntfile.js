
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.initConfig({
    jasmine: {
      test: {
        src: [
          'backbone-vanilla-js-objects.js'
        ],
        options: {
          vendor: [
            'components/jquery/jquery.js',
            'components/underscore/underscore.js',
            'components/backbone/backbone.js'
          ],
          specs: ['test/backbone-vanilla-js-objects.js']
        }
      }
    }
  });

  grunt.registerTask('test', ["jasmine:test"]);
};