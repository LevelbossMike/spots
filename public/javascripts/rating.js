//this will only work in html5 browsers because it makes use of the possibility to pass data with html5
$(document).ready(function() {
	$(".rating_display").stars({
		inputType: "select",
		disabled: true
	});
	$("#comments #comment #rating_display").each(function() { 
		$(this).stars("select", Math.round(this.getAttribute('data-rating')));
	});
});