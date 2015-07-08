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

function getDiskUsage()
{
	$.get( 'phpapi/c_disk_usage.php', function( data )
	{
  		showDiskUsage(data);
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
	colorizeProgressBar(load_percentage, progress_bar);
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
	colorizeProgressBar(percentage, progress_bar);
}

function showDiskUsage(_json)
{
	var data = JSON.parse(_json);
	var free = parseInt(data.total_free_bytes);
	var max = parseInt(data.total_bytes);
	var used = max - free;
	var percentage = ((used/max) * 100).toFixed(2);
	var used_in_gb = (((used/1024)/1024)/1000).toFixed(2);
	var max_in_gb = (((max/1024)/1024)/1000).toFixed(2);

	var progress_bar = $("#disk_usage_bar");

	progress_bar.attr('aria-valuenow', String(used_in_gb));
	progress_bar.attr('aria-valuemax', String(max_in_gb));

	progress_bar.attr('style', 'width: '+percentage+'%; min-width: 2em;');
	progress_bar.html(String(used_in_gb) + '/' + String(max_in_gb) + '%');
	colorizeProgressBar(percentage, progress_bar);
}

function colorizeProgressBar(_percentage, _progressBar)
{
	//Check the percentage and determine what color to make the bar
	if(_percentage > 90)
	{
		_progressBar.removeClass('progress-bar-warning');
		_progressBar.addClass('progress-bar-danger');
	}
	else if(_percentage > 50)
	{
		_progressBar.removeClass('progress-bar-danger');
		_progressBar.addClass('progress-bar-warning');
	}
	else
	{
		_progressBar.removeClass('progress-bar-warning');
		_progressBar.removeClass('progress-bar-danger');
	}

	_progressBar.removeClass('active');
	_progressBar.removeClass('progress-bar-striped');
}