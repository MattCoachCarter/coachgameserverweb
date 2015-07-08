<?php
	$json = "{";
	$command_output = "";

	exec("wmic cpu get loadpercentage", $command_output);

	//Parse the command_output
	for($i = 0; $i < count($command_output); $i++)
	{
		if($command_output[$i] != "LoadPercentage" && $command_output[$i] != "")
		{
			$json .= "\"load_percentage\": ".$command_output[$i];
		}
	}
	$json .= "}";

	echo $json;
?>