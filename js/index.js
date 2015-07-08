$(function()
{
	getCPULoadPercentage();
	getMemoryInfo();
});

function getMemoryInfo()
{
	$.get( 'phpapi/memory_info.php', function( data )
	{
  		showMemoryInfo(data);
	});
}

function getCPULoadPercentage()
{
	$.get( 'phpapi/cpu_load_percentage.php', function( data )
	{
  		showCPULoadPercentage(data);
	});
}

function showCPULoadPercentage(_json)
{
	var data = JSON.parse(_json);
	var load_percentage = parseInt(data.load_percentage);
	var progress_bar = $("#cpu_progress_bar");
	progress_bar.attr('aria-valuenow', String(load_percentage));
	progress_bar.attr('style', 'width: '+load_percentage+'%; min-width: 2em;');
	progress_bar.html(String(load_percentage) + '%');

	//Check the percentage and determine what color to make the bar
	if(load_percentage > 90)
	{
		progress_bar.removeClass('progress-bar-warning');
		progress_bar.addClass('progress-bar-danger');
	}
	else if(load_percentage > 50)
	{
		progress_bar.removeClass('progress-bar-danger');
		progress_bar.addClass('progress-bar-warning');
	}
	else
	{
		progress_bar.removeClass('progress-bar-warning');
		progress_bar.removeClass('progress-bar-danger');
	}
}

function showMemoryInfo(_json)
{
	var data = JSON.parse(_json);
	var free = parseInt(String(data.available_physical_memory).replace(',', '').replace(' MB', ''));
	var max = parseInt(String(data.total_physical_memory).replace(',', '').replace(' MB', ''));
	var used = max - free;
	var percentage = ((used/max) * 100).toFixed(2);

	var progress_bar = $("#memory_usage_bar");

	progress_bar.attr('aria-valuenow', String(used));
	progress_bar.attr('aria-valuemax', String(max));

	progress_bar.attr('style', 'width: '+percentage+'%; min-width: 2em;');
	progress_bar.html(String(percentage) + '%');

	//Check the percentage and determine what color to make the bar
	if(percentage > 90)
	{
		progress_bar.removeClass('progress-bar-warning');
		progress_bar.addClass('progress-bar-danger');
	}
	else if(percentage > 50)
	{
		progress_bar.removeClass('progress-bar-danger');
		progress_bar.addClass('progress-bar-warning');
	}
	else
	{
		progress_bar.removeClass('progress-bar-warning');
		progress_bar.removeClass('progress-bar-danger');
	}
}