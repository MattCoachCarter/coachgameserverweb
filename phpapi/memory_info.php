<?php
	$json = "{";
	$command_output = "";

	exec("systeminfo | find \"Physical Memory\"", $command_output);

	//Parse the command_output
	for($i = 0; $i < count($command_output); $i++)
	{
		if($json != "{")
		{
			$json .= ",";
		}

		$command_output_split = explode(':', $command_output[$i]);
		$json .= " \"".strtolower($command_output_split[0])."\": \"".$command_output_split[1]."\""
	}
	$json .= "}";

	echo $json;
?>