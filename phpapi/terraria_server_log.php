<?php
  	$lines_seen = (int) $_GET['lines_seen'];
  	$file_path = 'C:\Users\Administrator\Desktop\Terraria\terraria_server_stdout.txt';

  	//Right now just return some stuff to stub out the file
  	$lines = 0;
  	$content = '';
  	$sliced = 'false';

  	if(file_exists($file_path))
  	{
  		$content = file_get_contents($file_path);
  		$content = explode("\n", str_replace("\r", '', $content));
  		$lines = count($content);

  		if($lines > $lines_seen)
  		{
  			$content = array_slice($content, -($lines - $lines_seen));
  			$content = implode('~*~', $content);
  			$sliced = 'true';
  		}
  		else
  		{
  			$content = '';
  		}  		
  	}

	echo '{ "lines": '.$lines.', "sliced": '.$sliced.', "content": "'.$content.'" }';
?>
