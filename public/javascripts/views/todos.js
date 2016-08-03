/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'common'
], function ($, _, Backbone, Common){
	'use strict';
	
	var TodoView = Backbone.View.extend({
	
		tagName: 'li',
		
		template: _.template(
			"<div class=\"view\">" +
				"<input class=\"toggle\" type=\"checkbox\" <%= completed ? 'checked=\"checked\"' : '' %>/>" +
				"<label><%- title %></label>" +
				"<button class=\"destroy\"></button>" +
			"</div>" +
			"<input class=\"edit\" value=\"<%- title %>\">"
		),
		
		//the DOM events specific to an item
		events: {
			'click .toggle' : 'toggleCompleted',
			'dblclick label': 'edit',
			'click .destroy': 'clear',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape',
			'blue .edit': 'close'
		},
		
		//the TodoView listens for changes to its model, re-rendering. Since there's
		// a one-to-one correspondence between a *Todo* and a *TodoView* in this
		//app, we set a direct reference on the model for convenience
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},
		
		//re-render the titles of the todo item.
		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));
			
			this.toggleVisible();
			this.$input = this.$('.edit');
			return this;
		},
		
		toggleVisible: function () {
			this.$el.toggleClass('hidden', this.isHidden());
		},
		
		isHidden: function () {
			var isCompleted = this.model.get("completed");
			return (
				(!isCompleted && Common.TodoFilter === "completed") ||
				(isCompleted && Common.TodoFilter === "active")
			);
		},
		
		//toggle the "completed" state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},
		
		//Switch this view into "editing" mode, displaying the input field
		edit: function () {
			this.$el.addClass("editing");
			this.$input.focus();
		},
		
		//close the "editing" mode, saving changes to the todo
		close: function () {
			var value = this.$input.val();
			var trimmedValue = value.trim();
			
			if (trimmedValue) {
				this.model.save({title:trimmedValue});
				
				if (value !== trimmedValue) {
					//model value changes consisting of whitespaces only are not causing change to be triggered
					//therefore we have to compare the untrimmed version with a trimmed one to check whether anything
					//changed and if yes, we have to trigger the change event ourselves
					this.model.trigger('change');
				}
			} else {
				this.clear();
			}
			
			this.$el.removeClass("editing");
		},
		
		//if you hit Enter we're through editing the item
		updateOnEnter: function (e) {
			if (e.keyCode === Common.ENTER_KEY) {
				this.close();
			}
		},
	
		// if we press escape, we revert the changes made by simply leaving the "editing" stage
		revertOnEscape: function (e) {
			if (e.keyCode === Common.ESCAPE_KEY) {
				this.$el.removeClass("editing");
				//also reset the hidden input back to the original value
				$this.$input.val(this.model.get("title"));
			}
		},
		
		//remove the item, destroy the model and delete its view
		clear: function () {
			this.model.destroy();
		}
	
	});
	
	return TodoView;
});