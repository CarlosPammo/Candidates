/**
 * <copyright file="Gruntfile.js" company="ECI Software Solutions, Inc.">
 *   Copyright © 2016.  ECI Software Solutions, Inc.  All rights reserved.
 * </copyright>
 */
/* global process require */
(function () {
	var path = require('path'),
        util = require('util');

	/**
     * Loads grunt npm tasks.
     * @param {Object} grunt is the grunt task runner.
     * @returns {void}.
     */
	function loadNpmTasks(grunt) {
		grunt.loadNpmTasks('grunt-jsdoc');
		grunt.loadNpmTasks('grunt-contrib-concat');
		grunt.loadNpmTasks('grunt-contrib-uglify');
		grunt.loadNpmTasks('grunt-contrib-cssmin');
		grunt.loadNpmTasks('grunt-contrib-htmlmin');
		grunt.loadNpmTasks('gruntify-eslint');
		grunt.loadNpmTasks('grunt-resx2json-2');
		grunt.loadNpmTasks('grunt-msbuild');
		grunt.loadNpmTasks('grunt-shell');
		grunt.loadNpmTasks('grunt-downloadfile');
		grunt.loadNpmTasks('grunt-angular-templates');
	}

	/**
     * Registers grunt tasks.
     * @param {Object} grunt is the grunt task runner.
     * @returns {void}.
     */
	function registerTask(grunt) {
		// Downloads requirements for the application.
		grunt.registerTask('download_dotNetFx45', ['downloadfile:dotNetFx45']);
		grunt.registerTask('download_dotNetFx46', ['downloadfile:dotNetFx46']);
		grunt.registerTask('download', ['downloadfile:fontSourceSansPro', 'downloadfile:nuget', 'download_dotNetFx45']);

		// Creates the applicationhost.config file if does not exist.
		grunt.registerTask('site_init', ['shell:copyApphost', 'shell:createSite']);

		// Generates documentation of the product.
		grunt.registerTask('docs', ['jsdoc']);
		grunt.registerTask('lint', ['eslint']);
		grunt.registerTask('generate_doc', ['docs', 'lint']);

		// Generates minify files.
		grunt.registerTask('minify', ['concat', 'uglify', 'cssmin', 'htmlmin']);

		// Generates html templates.
		grunt.registerTask('i18n', ['resx2json:i18n']);
		grunt.registerTask('template', ['ngtemplates']);
		grunt.registerTask('generate_tpl', ['template', 'i18n']);

		grunt.registerTask('restore', ['shell:restore']);
		grunt.registerTask('release', ['restore', 'msbuild:release']);
		grunt.registerTask('bootstrapper_x64', ['restore', 'msbuild:bootstrapperX64']);
		grunt.registerTask('bootstrapper_x86', ['restore', 'msbuild:bootstrapperX86']);
		grunt.registerTask('installer', ['restore', 'msbuild:bootstrapperX86']);
		grunt.registerTask('debug', ['restore', 'msbuild:debug']);
		grunt.registerTask('clean', ['msbuild:clean']);
		grunt.registerTask('build', ['download', 'generate_tpl', 'minify', 'generate_doc', 'release', 'installer']);

		grunt.registerTask('iis', ['shell:physicalPath', 'shell:iisexpress']);
		grunt.registerTask('build_iis', ['debug', 'iis']);

		grunt.registerTask('default', ['build']);
	}

	/**
     * Gets copyright information.
     * @param {Object} grunt is the grunt task runner.
     * @returns {string}.
     */
	function getCopyright(grunt) {
		var date = grunt.template.today('yyyy');

		return ' * Copyright (c) ' + date + '. <%= pkg.author.name %>  All rights reserved.\n';
	}

	/**
     * Gets the banner information of the product including the file name.
     * @param {string} ext is the file extension.
     * @param {Object} grunt is the grunt task runner.
     * @returns {string}.
     */
	function getBanner(ext, grunt) {
		return '/*\n' +
            ' * <%= pkg.description %> build version <%= pkg.version %>\n' +
            ' * <copyright file="<%= pkg.name %>.' + ext + '" company="<%= pkg.author.name %>">\n' +
            getCopyright(grunt) +
            ' * </copyright>\n' +
            ' */\n';
	}

	/**
     * Gets the banner information of the product.
     * @param {Object} grunt is the grunt task runner.
     * @returns {string}.
     */
	function getBannerGeneric(grunt) {
		return '/*\n' +
            ' * <%= pkg.description %> build version <%= pkg.version %>\n' +
            getCopyright(grunt) +
            ' */\n';
	}

	/**
     * Gets eslint configuration by style.
     * @param {string} style is the eslint style to use for the output file.
     * @param {string} ext is the extension for the eslint output file.
     * (By example xml, log, html).
     * @returns {Object}.
     */
	function getEsLintConfigByStyle(style, ext) {
		var maxWarnings = -1;

		return {
			options: {
				format: style,
				maxWarnings: maxWarnings,
				silent: true,
				quiet: true,
				configFile: './.eslintrc.js',
				outputFile: './public/eslint/eslint_' + style + '.' + ext,
				globals: [
                    'angular',
                    'process',
                    'require'
				]
			},
			src: ['js/**/*.js', 'Gruntfile.js']
		};
	}

	/**
     * Gets concat configuration.
     * @returns {Object}.
     */
	function getConcatConfig() {
		return {
			js: {
				src: ['js/**/*.js'],
				dest: './public/concat/<%= pkg.name %>.js'
			},
			css: {
				src: ['content/**/*.css'],
				dest: './public/concat/<%= pkg.name %>.css'
			},
			html: {
				src: ['js/**/*.html', 'index.html'],
				dest: './public/concat/<%= pkg.name %>.html'
			}
		};
	}

	/**
     * Gets uglify configuration.
     * @param {Object} grunt is the grunt task runner.
     * @returns {Object}.
     */
	function getUglifyConfig(grunt) {
		return {
			target: {
				options: {
					banner: getBanner('min.css', grunt)
				},
				files: {
					'public/dist/js/<%= pkg.name %>.min.js': ['js/**/*.js']
				}
			},
			replica: {
				options: {
					banner: getBannerGeneric(grunt)
				},
				files: [{
					expand: true,
					cwd: 'js',
					src: '**/*.js',
					dest: 'public/replica'
				}]
			}
		};
	}

	/**
     * Gets css minify configuration.
     * @param {Object} grunt is the grunt task runner.
     * @returns {Object}.
     */
	function getCssMinConfig(grunt) {
		return {
			dist: {
				options: {
					banner: getBanner('min.css', grunt)
				},
				files: {
					'public/dist/content/<%= pkg.name %>.min.css': [
                        'content/<%= pkg.name %>.css'
					]
				}
			}
		};
	}

	/**
     * Gets html minify configuration.
     * @returns {Object}.
     */
	function getHtmlMinConfig() {
		return {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'public/dist/index.html': 'index.html'
				}
			}
		};
	}

	/**
     * Gets documents configuration.
     * @returns {Object}.
     */
	function getDocumentsConfig() {
		return {
			dist: {
				src: ['js/*.js', 'test/*.js'],
				options: {
					destination: 'public/docs/std'
				}
			},
			distTpl: {
				src: ['public/eslint/eslint_html.html', 'js/**/*.js', 'README.md'],
				options: {
					destination: 'public/docs/tpl',
					template: './node_modules/ink-docstrap/template',
					configure: './jsdoc.conf.json'
				}
			}
		};
	}

	/**
     * Gets shell configuration.
     * @returns {Object}.
     */
	function getShellConfig() {
		return {
			restore: {
				command: '"./node_modules/.nuget/nuget.exe" restore "' + path.resolve('.\\..\\DQM.Web.sln')
			},
			copyApphost: {
				command: 'ECHO F|xcopy /y ' +
                    '"c:\\Users\\%username%\\Documents\\IISExpress\\config\\applicationhost.config" ' +
                    '"' + path.resolve('.\\..\\.vs\\config\\applicationhost.config') + '"'
			},
			createSite: {
				command: '%windir%\\system32\\inetsrv\\appcmd.exe add site /name:"<%= metadata.siteName %>" ' +
                    '/id:<%= metadata.siteId %> /physicalPath:"' + path.resolve('.') + '" ' +
                    '/bindings:"<%= metadata.siteProtocol %>/*:<%= metadata.sitePort %>:<%= metadata.siteHost %>" ' +
                    '/commit:apphost ' +
                    '/apphostconfig:"' + path.resolve('.\\..\\.vs\\config\\applicationhost.config') + '" '
			},
			physicalPath: {
				command: '%windir%\\system32\\inetsrv\\appcmd.exe set site /site.name:<%= metadata.siteName %> ' +
                    '/application[path=\'/\'].virtualDirectory[path=\'/\'].physicalPath:"' +
                    path.resolve('.') + '" ' +
                    '/apphostconfig:"' + path.resolve('.\\..\\.vs\\config\\applicationhost.config') + '"'
			},
			iisexpress: {
				command: 'cd "%ProgramFiles%\\IIS Express" && start iisexpress ' +
                    '/config:"' + path.resolve('.\\..\\.vs\\config\\applicationhost.config') +
                    '" /site:<%= metadata.siteName %> /trace:e'
			}
		};
	}

	/**
     * Gets downloads configuration.
     * @returns {Object}.
     */
	function getDownloadsConfig() {
		return {
			nuget: [{
				url: 'https://dist.nuget.org/win-x86-commandline/latest/nuget.exe',
				dest: './node_modules/.nuget/',
				name: 'nuget.exe'
			}],
			dotNetFx45: [{
				url: 'https://download.microsoft.com/download/B/A/4/BA4A7E71-2906-4B2D-A0E1-80CF16844F5F/dotNetFx45_Full_setup.exe',
				dest: './binaries/.netFx/4.5/',
				name: 'dotNetFx45_Full_setup.exe'
			}],
			dotNetFx46: [{
				url: 'https://download.microsoft.com/download/E/4/1/E4173890-A24A-4936-9FC9-AF930FE3FA40/NDP461-KB3102436-x86-x64-AllOS-ENU.exe',
				dest: './binaries/.netFx/4.6/',
				name: 'NDP461-KB3102436-x86-x64-AllOS-ENU.exe'
			}],
			fontSourceSansPro: [{
				// vietnamese
				url: 'https://fonts.gstatic.com/s/sourcesanspro/v9/ODelI1aHBYDBqgeIAH2zlNOAHFN6BivSraYkjhveRHY.woff2',
				dest: './content/fonts/',
				name: 'ODelI1aHBYDBqgeIAH2zlNOAHFN6BivSraYkjhveRHY.woff2'
			}, {
				// latin-ext
				url: 'https://fonts.gstatic.com/s/sourcesanspro/v9/ODelI1aHBYDBqgeIAH2zlC2Q8seG17bfDXYR_jUsrzg.woff2',
				dest: './content/fonts/',
				name: 'ODelI1aHBYDBqgeIAH2zlC2Q8seG17bfDXYR_jUsrzg.woff2'
			}, {
				// latin
				url: 'https://fonts.gstatic.com/s/sourcesanspro/v9/ODelI1aHBYDBqgeIAH2zlNV_2ngZ8dMf8fLgjYEouxg.woff2',
				dest: './content/fonts/',
				name: 'ODelI1aHBYDBqgeIAH2zlNV_2ngZ8dMf8fLgjYEouxg.woff2'
			}]
		};
	}

	/**
     * Gets builds configuration.
     * @returns {Object}.
     */
	function getBuildsConfig() {
		var maxCpuCount = 4,
            warningLevel = 4;

		return {
			debug: {
				src: ['../Candidates.sln'],
				options: {
					projectConfiguration: 'Debug',
					targets: ['Clean', 'Rebuild'],
					maxCpuCount: maxCpuCount,
					buildParameters: {
						WarningLevel: warningLevel,
						EnableNuGetPackageRestore: true
					},
					verbosity: 'normal'
				}
			},
			clean: {
				src: ['../Candidates.sln'],
				options: {
					targets: ['Clean'],
					verbosity: 'normal'
				}
			},
			release: {
				src: ['../Candidates.sln'],
				options: {
					projectConfiguration: 'Release',
					targets: ['Clean', 'Rebuild'],
					maxCpuCount: maxCpuCount,
					buildParameters: {
						WarningLevel: warningLevel,
						EnableNuGetPackageRestore: true
					},
					verbosity: 'normal'
				}
			}
		};
	}

	/**
     * Gets template configuration.
     * @returns {Object}.
     */
	function getTemplateConfig() {
		return {
			app: {
				src: 'js/**/*.html',
				dest: 'js/template/template.js',
				options: {
					module: 'App',
					htmlmin: {
						collapseBooleanAttributes: true,
						collapseWhitespace: true,
						removeAttributeQuotes: true,
						// Only if you don't use comment directives!
						removeComments: true,
						removeEmptyAttributes: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true
					}
				}
			}
		};
	}

	/**
     * Gruntfile.
     * @exports grunt configuration.
     * @param {Object} grunt is the grunt task runner.
     * @return {void}
     */
	module.exports = function (grunt) {
		'use strict';
		// Project configuration.
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			metadata: {
				majorVersion: process.env.MAJOR_VERSION || '1',
				minorVersion: process.env.MINOR_VERSION || '0',
				revisionNumber: process.env.REVISION_NUMBER || '0',
				buildNumber: process.env.BUILD_NUMBER || '1',
				productVersion: util.format('%s.%s.%s.%s', '<%= metadata.majorVersion %>',
                    '<%= metadata.minorVersion %>', '<%= metadata.revisionNumber %>',
                    '<%= metadata.buildNumber %>'),
				productName: process.env.PRODUCT_NAME || '<%= pkg.description %>',
				outputName: process.env.OUTPUT_NAME || 'DQM.Web.Console_<%= metadata.productVersion %>',
				siteId: grunt.option('id') || 2,
				siteName: grunt.option('site') || 'DQM.Web',
				sitePort: grunt.option('port') || 44300,
				siteProtocol: 'https',
				siteHost: 'localhost'
			},
			eslint: {
				checkstyle: getEsLintConfigByStyle('checkstyle', 'xml'),
				stylish: getEsLintConfigByStyle('stylish', 'log'),
				compact: getEsLintConfigByStyle('compact', 'log'),
				html: getEsLintConfigByStyle('html', 'html'),
				jsLintXml: getEsLintConfigByStyle('jslint-xml', 'xml'),
				json: getEsLintConfigByStyle('json', 'json'),
				junit: getEsLintConfigByStyle('junit', 'xml'),
				tap: getEsLintConfigByStyle('tap', 'log'),
				table: getEsLintConfigByStyle('table', 'log'),
				unix: getEsLintConfigByStyle('unix', 'log')
			},
			concat: getConcatConfig(),
			uglify: getUglifyConfig(grunt),
			cssmin: getCssMinConfig(grunt),
			htmlmin: getHtmlMinConfig(),
			resx2json: getResourceConfig(),
			msbuild: getBuildsConfig(),
			shell: getShellConfig(),
			downloadfile: getDownloadsConfig(),
			jsdoc: getDocumentsConfig(),
			ngtemplates: getTemplateConfig()
		});
		loadNpmTasks(grunt);
		registerTask(grunt);
	};
}());