<?php
	$json = "{";
	$command_output = "";

	exec("fsutil volume diskfree c:", $command_output);

	//Parse the command_output
	for($i = 0; $i < count($command_output); $i++)
	{
		if($json != "{")
		{
			$json .= ",";
		}

		$command_output_split = explode(':', $command_output[$i]);
		$json .= " \"".str_replace(' ', '_', str_replace(' # of', '', trim(strtolower($command_output_split[0]))))."\": \"".trim($command_output_split[1])."\"";
	}
	$json .= "}";

	echo $json;
?>