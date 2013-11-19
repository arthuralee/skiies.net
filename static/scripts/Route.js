function Route(name, title, slug) {
	this.name = name;
	this.title = title;
	this.slug = slug;
};

Route.prototype.expandBanner = function() {
	$('header').removeClass('collapsed').addClass('expanded');
};

Route.prototype.collapseBanner = function() {
	$('header').removeClass('expanded').addClass('collapsed');
};

Route.prototype.updateTitle = function() {
	if (this.name == 'home') {
		$(document).attr('title', 'skiies');
	} else {
		$(document).attr('title', 'skiies • ' + this.title);
	}
	
};

Route.prototype.navigate = function() {
	this.updateTitle();

	if (this.name == 'home') {
		$('section').slideUp(500, this.expandBanner);
	} else {
		$('section').slideDown(500, this.collapseBanner);
	}
};