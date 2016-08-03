/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone){
	'use strict';
	
	var Todo = Backbone.Model.extend({
		url: "/todos",
		
		//default attributes for the todos
		//and ensure that each todo created has "title" and "completed" properties
		defaults: {
			title: '',
			completed: false
		},
		
		//toggle the "completed" status of the todo item
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			})
		}
	});
	
	return Todo;
});