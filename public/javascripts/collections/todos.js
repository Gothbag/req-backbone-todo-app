/*global define*/
define([
	'underscore',
	'backbone',
	'models/todo'
], function (_, Backbone, Todo) {
	'use strict';
	
	var TodosCollection = Backbone.Collection.extend({
		//reference to this collection's model
		model: Todo,
		
		url: "/todos",
		
		//filter down the list of all todo items that are finished
		completed: function () {
			return this.where({completed:true});
		},
		
		//filter down the lsit to only tood items that are still not finished
		remaining: function () {
			return this.where({completed:false});
		},
	
		//We keep the todos in sequential order, despite being saved by unordered
		//GUID in the database. this generates the next order number for new items
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},
		
		//Todos are sorted by their original insertion number
		comparator: 'order'
	});
	
	return new TodosCollection();

});