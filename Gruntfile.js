
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
            'test/shims.js'
          ],
          specs: ['{spec/backbone-vanilla-js-objects.js']
        }
      }
    }
  });

  grunt.registerTask('test', ["jasmine:test"]);
};