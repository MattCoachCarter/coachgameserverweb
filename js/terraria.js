'use strict';

$(function()
{
	console.log
  	window.serverLogLines = 0;
  	window.chatNameColors = {};
  	window.chatColors = [ '#FF0000', '#000099', '#CC6600', '#009933', '#9933FF' ];
  	window.chatColorsIndex = 0;

  	setUpTabbedContent();
  	getServerStatus();
	getServerLog();
});

function setUpTabbedContent()
{
  $('#terraria_server_tabs a').click(function (e) {
    e.preventDefault();
      $(this).tab('show');
  });
}

function getServerStatus()
{
  	$.get( 'phpapi/terraria_server_status.php', function( data )
  	{
    	var serverStatus = JSON.parse(data);
    	$('#server_status_' + String(serverStatus.status)).show();
  	})
  	.fail(function()
  	{
    	$('#server_status_failed').show();
  	})
  	.always(function()
  	{
    	$('#server_status_calculating').hide();
  	});
}

function makeLogLine(_line)
{
  	return '<div class="logline">'+ _line +'</div>';
}

function makeChatLine(_line)
{
  	var chatName = '';

  	if(_line.indexOf('<') === 0)
  	{
   	chatName = _line.split('>')[0].replace('<', '');
  	}
  	else if(_line.indexOf('has left') !== -1)
  	{
    	chatName = _line.replace(/ has left.*/, '');
  	}
  	else if(_line.indexOf('has joined') !== -1)
  	{
    	chatName = _line.replace(/ has joined.*/, '');
  	}
	
  	var chatColor = window.chatNameColors[chatName];
  	if(chatColor === undefined)
  	{
    	window.chatNameColors[chatName] = window.chatColors[window.chatColorsIndex];
    	chatColor = window.chatColors[window.chatColorsIndex];
    	window.chatColorsIndex++;
  	}


  	return '<div class="chatline"><span class="chatname" style="color: '+chatColor+';">&lt;'+chatName+'&gt;'+_line.sub('<'+chatName+'>', '')+'</div>';
}

function processLogContents(_contents)
{
  	var logContent = '';
  	var chatContent = '';

  	var contentsSplit = String(_contents).split('\n');

  	for(var i = 0; i < contentsSplit.length; i++)
  	{
    	if(contentsSplit[i].indexOf('<') === 0 || contentsSplit[i].indexOf('has joined') !== -1 || contentsSplit[i].indexOf('has left') !== -1)
    	{
	      chatContent += makeChatLine(contentsSplit[i]);
    	}
	
    	logContent += makeLogLine(contentsSplit[i]);
  	}
	
  	$('#server_chat').append(chatContent);
  	$('#server_log').append(logContent);
}

function getServerLog()
{
  	$.get( 'phpapi/terraria_server_log.php?lines_seen=' + window.serverLogLines, function( data )
  	{
    	var serverLog = JSON.parse(data);
    	window.serverLogLines = serverLog.lines;
    	processLogContents(serverLog.content);
  	});
}