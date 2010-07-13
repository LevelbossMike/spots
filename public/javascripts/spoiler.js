$(document).ready(function(){
	$("#stars-rating").stars({
	    inputType: "select"
	});
	$("#avg").stars({
		inputType: "select",
		disabled: true
	});
	$("#avg").stars("select", Math.round(rating));
	$('#commentForm').hide();
  	$("#commentButton").toggle(function(){
    	$("#commentForm").show('slow');
		$("#commentButton").html(
			'<button>Abbrechen</button>');
  	},function(){
		$('#commentButton').html(
			'<button>Kommentieren</button>')
    	$("#commentForm").hide('fast');
  	 });
});
