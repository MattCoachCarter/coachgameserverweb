$(function()
{
	getCPULoadPercentage();
	getMemoryInfo();
});

function getMemoryInfo()
{
	$.get( 'phpapi/memory_info.php', function( data )
	{
  		console.log(data);
	});
}

function getCPULoadPercentage()
{
	$.get( 'phpapi/cpu_load_percentage.php', function( data )
	{
  		console.log(data);
	});
}