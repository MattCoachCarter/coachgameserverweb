<?php
  //Right now just return up until I have a better way to do this
	$file_path = '/C/Users/Administrator/Desktop/Terraria/terraria_server_stdout.txt';

	if(file_exists($file_path))
	{
  		echo '{ "status": "up" }';
	}
	else
	{
		echo '{ "status": "down" }';
	}
?>
