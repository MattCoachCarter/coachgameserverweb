'use strict';

$(function()
{
	console.log
  	window.serverLogLines = 0;
  	window.chatNameColors = {};
  	window.chatColors = [ '#FF0000', '#000099', '#CC6600', '#009933', '#9933FF' ];
  	window.chatColorsIndex = 0;
    window.playersOnline = [];
    window.maxPlayers = 8; // TODO: This should not be hard coded, and should be exposed through an API call

  	setUpTabbedContent();
  	getServerStatus();
	getServerLog();
	window.logInterval = setInterval(getServerLog, 2000);
	window.statusInterval = setInterval(getServerLog, 30000);

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	 	scrollElementToBottom($('#server_chat'));
	  	scrollElementToBottom($('#server_log'));
	})

  // TODO: This needs to be moved:
  $('#max_player_count').html(window.maxPlayers);

  //Hover listener for player info
  $("#player_info").click(togglePlayerList);

  //Default player count is "?"
  $('#current_player_count').html("?");
});

function togglePlayerList()
{
  $("#player_list").toggle();
}

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
  	return '<div class="logline">'+ _line.replace('<', '&lt;').replace('>', '&gt;') +'</div>';
}

function makeChatLine(_line)
{
  	var chatName = '';
  	var chatLine = false;

  	if(_line.indexOf('<') === 0)
  	{
   	chatName = _line.split('>')[0].replace('<', '');
   	chatLine = true;
  	}
  	else if(_line.indexOf('has left') !== -1)
  	{
    	chatName = _line.replace(/ has left.*/, '');
  	}
  	else if(_line.indexOf('has joined') !== -1)
  	{
    	chatName = _line.replace(/ has joined.*/, '');
  	}

  	if(chatLine)
  	{
  		var chatColor = window.chatNameColors[chatName];
	  	if(chatColor === undefined)
	  	{
	    	window.chatNameColors[chatName] = window.chatColors[window.chatColorsIndex];
	    	chatColor = window.chatColors[window.chatColorsIndex];
	    	window.chatColorsIndex++;
	  	}

  		return '<div class="chatline"><span class="chatname" style="color: '+chatColor+';">&lt;'+chatName+'&gt;</span>'+_line.replace('<'+chatName+'>', '')+'</div>';
	}
	else
	{
		return '<div class="chatline">'+_line+'</div>';
	}
}

function processLogContents(_contents)
{
  	var logContent = '';
  	var chatContent = '';

  	var contentsSplit = String(_contents).split('~*~');

  	if(String(_contents).trim() !== '')
  	{
	  	for(var i = 0; i < contentsSplit.length; i++)
	  	{
        if((contentsSplit[i]).trim() === '')
        {
          continue;
        }

        contentsSplit[i] = contentsSplit[i].replace(/^\:\s/, '');
	    	if(contentsSplit[i].indexOf('<') === 0)
	    	{
		      chatContent += makeChatLine(contentsSplit[i]);
	    	}
        else if(contentsSplit[i].indexOf('has joined') !== -1 || contentsSplit[i].indexOf('has left') !== -1)
        {
          updatePlayersOnline(contentsSplit[i]);
          chatContent += makeChatLine(contentsSplit[i]);
        }
		
	    	logContent += makeLogLine(contentsSplit[i]);
	  	}
		
	  	var chatContentElement = $('#server_chat');
	  	var logContentElement = $('#server_log');
	  	var chatContentWasScrolledToBottom = isElementScrolledToBottom(chatContentElement);
	  	var logContentWasScrolledToBottom = isElementScrolledToBottom(logContentElement);
	  	var chatContentWasEmpty = chatContentElement.html() == '';
	  	var logContentWasEmpty = logContentElement.html() == '';

	  	chatContentElement.append(chatContent);
	  	logContentElement.append(logContent);

	  	if(chatContentWasScrolledToBottom || chatContentWasEmpty)
	  	{
	  		scrollElementToBottom(chatContentElement);
	  	}
	  	if(logContentWasScrolledToBottom || logContentWasEmpty)
	  	{
	  		scrollElementToBottom(logContentElement);
	  	}
  	}
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

function isElementScrolledToBottom(_element)
{
	if (_element[0].scrollHeight - _element.scrollTop() == _element.outerHeight())
	{
	  return true;
	}

	return false;
}

function scrollElementToBottom(_element)
{
	_element.animate({scrollTop: _element[0].scrollHeight});
}

function updatePlayersOnline(_logmessage)
{
  var log_message_split = _logmessage.split(' ');
  if(log_message_split[2] === 'joined.')
  {
    window.playersOnline.push(log_message_split[0]);
  }
  else if(log_message_split[2] === 'left.')
  {
    var index = window.playersOnline.indexOf(log_message_split[0]);

    while(index !== -1)
    {
      window.playersOnline.splice(index, 1);
      index = window.playersOnline.indexOf(log_message_split[0]);
    }
  }

  $('#current_player_count').html(window.playersOnline.length);
  $("#player_list").html(window.playersOnline.join('<br/>'));
}