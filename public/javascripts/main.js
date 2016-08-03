/*global require*/

//Require.js allows us to configure shortcut aliases
require.config({
	//the shim config allows us to configure dependencies for
	//scripts that do not call define() to register a module
	baseUrl: 'javascripts',
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
				'underscore',
				'jquery'
			],
			exports: 'Backbone'
		}
	},
	paths: {
		jquery: 'jquery/dist/jquery',
		underscore: 'underscore/underscore',
		backbone: 'backbone/backbone'
	}
});

require([
	'views/app'
], function (AppView) {
	//Initialize the application views/app
	new AppView();
});