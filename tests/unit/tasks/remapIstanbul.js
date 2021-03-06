define([
	'intern!object',
	'intern/chai!assert',
	'../../../lib/node!grunt',
	'../../../lib/node!fs'
], function (registerSuite, assert, grunt, fs) {

	/* creating a mock for logging */
	var logStack = [];
	var log = function log() {
		logStack.push(arguments);
	};
	log.logStack = logStack;

	function runGruntTask(taskName, callback) {
		var task = grunt.task._taskPlusArgs(taskName);
		task.task.fn.apply({
			nameArgs: task.nameArgs,
			name: task.task.name,
			args: task.args,
			flags: task.flags,
			async: function() { return callback; }
		}, task.args);
	}

	registerSuite({
		name: 'tasks/remapIstanbul',
		setup: function () {
			grunt.initConfig({
				remapIstanbul: {
					basic: {
						options: {
							reports: {
								'clover': 'tmp/remapIstanbul.clover.xml',
								'cobertura': 'tmp/remapIstanbul.cobertura.xml',
								'html': 'tmp/remap-html-report',
								'json-summary': 'tmp/remapInstanbul.coverage-summary.json',
								'json': 'tmp/remapIstanbul.coverage.json',
								'lcovonly': 'tmp/remapIstanbul.lcov.info',
								'teamcity': 'tmp/remapIstanbul.teamcity.txt',
								'text-lcov': log,
								'text-summary': 'tmp/remapIstanbul.text-summary.txt',
								'text': 'tmp/remapIstanbul.text.txt'
							}
						},
						src: 'tests/unit/support/coverage.json'
					},

					srcdest: {
						files: [ {
							src: 'tests/unit/support/coverage.json',
							dest: 'tmp/srcdest.coverage.json',
							type: 'json'
						} ]
					}

				}
			});
			grunt.loadTasks('tasks');
		},

		'basic': function () {
			var dfd = this.async();
			runGruntTask('remapIstanbul:basic', dfd.callback(function () {
				assert.isTrue(fs.existsSync('tmp/remapIstanbul.clover.xml'), 'file should exist');
			}));
		},

		'srcdest': function () {
			var dfd = this.async();
			runGruntTask('remapIstanbul:srcdest', dfd.callback(function () {
				assert.isTrue(fs.existsSync('tmp/srcdest.coverage.json'), 'file should exist');
			}));
		}
	});
});
