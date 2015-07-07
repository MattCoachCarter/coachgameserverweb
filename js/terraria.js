$(function()
{
	$('#terraria_server_tabs a').click(function (e) {
   	e.preventDefault();
  		$(this).tab('show');
	});
});