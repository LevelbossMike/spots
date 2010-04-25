$(document).ready(function(){
	$('#commentForm').hide();
  	$("#commentButton").toggle(function(){
    	$("#commentForm").show('slow');
		$("#commentButton").html(
			'<button>Cancel</button>');
  	},function(){
		$('#commentButton').html(
			'<button>Add a comment</button>')
    	$("#commentForm").hide('fast');
  	 });
});
