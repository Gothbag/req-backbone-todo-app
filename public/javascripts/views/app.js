/* global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/todos',
	'views/todos',
	'common'
], function ($, _, Backbone, Todos, TodoView, Common) {
	'use strict';
	
	//our overall "AppView" is the top-level piece of UI
	var AppView = Backbone.View.extend({
		//instead of generating a new element, bind to the existing skeleton
		//of the app already present in the HTML
		el: '#todoapp',
		
		//compile the stats template
		template: _.template(
			"<span id=\"todo-count\" class=\"todo-count\"><strong><%= remaining %></strong> <%= remaining == 1 ? 'item' : 'items' %> left</span>"+
			"<ul id=\"filters\" class=\"filters\">"+
				"<li>"+
					"<a class=\"selected\" href=\"#/\">All</a>"+
				"</li>"+
				"<li>"+
					"<a href=\"#/active\">Active</a>"+
				"</li>"+
				"<li>"+
					"<a href=\"#/completed\">Completed</a>"+
				"</li>"+
			"</ul>"+
			"<% if ( completed ) { %>"+
				"<button id=\"clear-completed\">Clear completed</button>"+
			"<% } %>"
		),
		
		//delegated events for creating new items, and clearing completed ones
		events: {
			'keypress #new-todo': 'createOnEnter',
			'click #clearCompleted' : 'clearCompleted',
			'click #toggle-all': 'toggleAllComplete'
		},
		
		//at initialization we bind to the relevant events onto the todos collection
		// when, items are added or change. we kick things off by loading
		//any preexisting todos that might be saved in the database
		initialize: function () {
			this.allCheckbox = this.$("#toggle-all")[0];
			this.$input = this.$("#new-todo");
			this.$footer = this.$("#footer");
			this.$main = this.$("#main");
			this.$todoList = this.$("#todo-list");
			
			this.listenTo(Todos, 'add', this.addOne);
			this.listenTo(Todos, 'reset', this.addAll);
			this.listenTo(Todos, 'change:completed', this.filterOne);
			this.listenTo(Todos, 'filter', this.filterAll);
			this.listenTo(Todos, 'all', _.debounce(this.render, 0));
			
			Todos.fetch({reset:true});
		},
		
		//re-rendering the app just means refreshing the statistics, the
		//rest of the app remains unchanged
		render: function () {
			var completed = Todos.completed().length;
			var remaining = Todos.remaining().length;
			
			if (Todos.length) {
				this.$main.show();
				this.$footer.show();
				console.log("qwdqw");
				this.$footer.html(this.template({
					completed: completed,
					remaining: remaining
				}));
			
				this.$("#filters li a")
					.removeClass("selected")
					.filter('[href=\"#/' + (Common.TodoFilter || '') + '\"]')
					.addClass('selected')
			} else {
				this.$main.hide();
				this.$footer.hide();
			}
			
			this.allCheckbox.checked = !remaining;
		},
		
		//add a single todo item to the list by creating a view for it
		//and appending its element to the '<ul>'
		addOne: function (todo) {
			var view = new TodoView({model: todo});
			this.$todoList.append(view.render().el);
		},
		
		//add all items in the todos collection at once
		addAll: function () {
			$this.$todoList.empty();
			Todos.each(this.addOne, this);
		},
		
		filterOne: function (todo) {
			todo.trigger('visible');
		},
		
		filterAll: function () {
			Todos.each(this.filterOne, this);
		},
		
		//generate the attributes for a new todo item
		newAttributes: function () {
			return {
				title: this.$input.val().trim(),
				order: Todos.nextOrder(),
				completed: false
			};
		},
		
		//if you hit return in the main input field, create new tood model,
		// persisting it to the database
		createOnEnter: function (e) {
			if (e.keyCode !== Common.ENTER_KEY || ! this.$input.val().trim()) {
				return;
			}
			
			Todos.create(this.newAttributes());
			this.$input.val('');
		},
		
		//clear all completed todo items, destroying their models
		clearCompleted: function () {
			_.invoke(Todos.completed(), 'destroy'); //calls the destroy method on each item on the list
			return false;
		},
		
		toggleAllComplete: function () {
			var completed = this.allCheckbox.checked;
			
			Todos.each(function (todo) {
				todo.save({
					completed: completed
				})
			});
		}
	});

	return AppView;
});