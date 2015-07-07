<?php
  	$lines_seen = $_GET['lines_seen'];
  	$file_path = 'C:\Users\Administrator\Desktop\Terraria\terraria_server_stdout.txt';

  	//Right now just return some stuff to stub out the file
  	$lines = 0;
  	$content = '';

  	if(file_exists($file_path))
  	{
  		$content = file_get_contents($file_path);
  		$content = explode("\n", str_replace("\r", '', $content));
  		$lines = count($content);

  		if($lines_seen != $lines)
  		{
  			if($lines_seen > 0)
  			{
	  			$content = array_slice($content, (((int) $lines_seen) - $lines));
  			}

  			$content = implode('~*~', $content);
		}
		else
		{
			$content = '';
		}

  		
  	}

	echo '{ "lines": '.$lines.', "lines_seen_arg": '.$lines_seen.', "content": "'.$content.'" }';
?>
