$(document).ready(function(){
	$('#commentForm').hide();
  	$("#commentButton").toggle(function(){
    	$("#commentForm").show('slow');
		$("commentButton").html(
			'<button>Close comment</button>');
  	},function(){
    	$("#commentForm").hide('fast');
  	 });
	$('#closeButton').click(function(){
		$('#commentForm').hide('slow');
	});
});
