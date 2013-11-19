var App = {};

App.routes = {
	'home'		: new Route('home','home', ''),
	'projects'	: new Route('projects', 'projects', 'projects'),
	'about'		: new Route('about','about', 'about'),
	'contact'	: new Route('contact','contact', 'contact')
}

// Backbone Router =======
App.Router = Backbone.Router.extend({
	routes : {
		''			: 'rte_home',
		'projects'	: 'rte_projects',
		'projects/'	: 'rte_projects',
		'projects/:name' : 'rte_project_item',
		'about' 	: 'rte_about',
		'about/' 	: 'rte_about',
		'contact'	: 'rte_contact',
		'contact/'	: 'rte_contact'
	},

	rte_home : function() {
		App.routes['home'].navigate();
	},

	rte_projects : function() {
		var projectsView = new App.ProjectsView();
		projectsView.render(function() {
			App.routes['projects'].navigate();
		});
	},

	rte_about : function() {
		var aboutView = new App.AboutView();
		aboutView.render(function() {
			App.routes['about'].navigate();
		});
	},

	rte_contact : function() {
		var contactView = new App.ContactView();
		contactView.render(function() {
			App.routes['contact'].navigate();
		});
	},

	rte_project_item : function(name) {
		return false;
	}

});

App.AboutView = Backbone.View.extend({
	el : $('<div>'),
	initialize : function() {
		this.$el.addClass('flex');
		this.$el.prop('id', 'about');
	},
	render : function(cb) {
		var _this = this;
		this.template = $.get('/templates/about.mustache',
		function(template) {
			var html = Mustache.to_html(template);
			_this.$el.html(html);
			$('section').empty();
			$('section').append(_this.$el);
			cb();
		});
	}
});

App.ContactView = Backbone.View.extend({
	el : $('<div>'),

	initialize : function() {
		this.$el.addClass('flex');
		this.$el.prop('id', 'contact');
	},

	events : {
		'submit form': 'submit'
	},

	render : function(cb) {
		var _this = this;
		this.template = $.get('/templates/contact.mustache',
		function(template) {
			var html = Mustache.to_html(template);
			_this.$el.html(html);
			$('section').empty();
			$('section').append(_this.$el);
			cb();
		});
	},

	submit : function(e) {
		e.preventDefault();
		var _this = this;

		// disable form and get data
		var formData = $('form',this.$el).serializeObject();
		$('input,textarea',this.$el).prop('disabled','disabled');
		$('input[type=submit]',this.$el).hide();

		// start animation
		$('h1', this.$el).html('sending');
		var int = setInterval(function() {
			$('h1', _this.$el).html($('h1', _this.$el).html() + '.');
		}, 500);
		
		$.ajax({
			url : 'http://www2.skiies.net/api/contactform',
			type : 'POST',
			data : formData,
			success : function() {
				clearInterval(int);
				$('h1', _this.$el).html('thanks for your message!');
			}
		});
	}
});

App.ProjectsView = Backbone.View.extend({
	el : $('<div>'),
	initialize : function() {
		this.$el.addClass('flex');
		this.$el.prop('id', 'projects');
	},
	render : function(cb) {
		var _this = this;
		this.template = $.get('/templates/projects.mustache',
		function(template) {
			var html = Mustache.to_html(template);
			_this.$el.html(html);
			$('section').empty();
			$('section').append(_this.$el);

			// masonry after callback
			cb();
			$('#projects-list').masonry({
				isAnimated : !Modernizr.csstransitions
			});
		});
	}

});


// Instantiate router and start history
new App.Router();
Backbone.history.start({pushState : Modernizr.history});


// ======== ATTACH EVENTS ==========

// on Load
$(document).ready(function(){
	Backbone.history.navigate(Backbone.history.getFragment(), {trigger: true});
});


// Click handler, intercepts all links
$(document).on('click', "a[href^='/']", function(event) {
	var href = $(event.currentTarget).attr('href');
	var passThrough = href.indexOf('http://') >= 0;

	if (!passThrough && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
		event.preventDefault();

		var url = href.replace(/^\//,'').replace('\#\!\/','');

		Backbone.history.navigate(url, {trigger: true});

		return false;
	}
});






