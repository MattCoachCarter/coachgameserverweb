<?php
  	$lines_seen = (int) $_GET['lines_seen'];
  	$file_path = 'C:\Users\Administrator\Desktop\Terraria\terraria_server_stdout.txt';

  	//Right now just return some stuff to stub out the file
  	$lines = 0;
  	$content = '';

  	if(file_exists($file_path))
  	{
  		$content = str_replace('"', '', file_get_contents($file_path));
  		$content_array = explode("\n", str_replace("\r", '', $content));
  		$lines = count($content_array);

  		$content = "";

  		if($lines > $lines_seen)
  		{
  			for($i = ($lines_seen - 1); $i < $lines; $i++)
  			{
  				if($i == -1)
  				{
  					$i = 0;
  				}

  				if($content != "")
  				{
  					$content .= "~*~";
  				}

				$content .= $content_array[$i];
  			}
  			//$content = array_slice($content, -($lines - $lines_seen));
  			//$content = implode('~*~', $content);
  		}
  	}

	echo '{ "lines": '.$lines.', "content": "'.$content.'" }';
?>
