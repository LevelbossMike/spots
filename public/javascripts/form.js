function add_upload_field() {
	$('#photos').append("Hello World <br />");
}

//this should be used via application js
function remove_field (element, item) {
	$(element).closest(item).hide('fast');
}