<?php

require(__DIR__.'/vendor/autoload.php');
use Aws\Polly\PollyClient;

include('config.php');

echo "\nStarting speech synthesis.";

// get all languages
$languages = glob("../language/*");
foreach($languages as $language) {
	$process[] = str_replace('../language/', '', $language);
}

// process all languages
foreach($process as $lang) {
	echo "\nProcessing language: $lang";
	$langfile = file('../language/'.$lang.'/'.$lang.'.txt', FILE_IGNORE_NEW_LINES);
	foreach($langfile as $line) {
		$bits = explode("\t", $line);
		$label = $bits[0];
		$text = $bits[1];
		$ssml = ($bits[2] == '') ? $text : $bits[2];
		$rate = 'medium';
		foreach(array('medium', 'fast', 'x-fast') as $rate) {
			echo "\n - Generating speech for [$label] at $rate rate... ";
			speech_synth($config, $lang, $label, $ssml, $rate);
		}
	}
	$bip39 = file('../language/'.$lang.'/'.$lang.'_bip39_wordlist.txt', FILE_IGNORE_NEW_LINES);
	foreach($bip39 as $word) {
		$rate = 'medium';
		$spell = implode(', ', str_split($word));
		$ssml = $word.'.<break time="400ms"/> '.$spell.'.<break time="400ms"/> '.$word;		
		echo "\n - Generating speech for [$word]... ";
		speech_synth($config, $lang, 'seed_word_'.$word, $ssml, $rate);
	}
}

function speech_synth($config, $lang, $label, $ssml, $rate) {
	$original = $input;
	$spelled = str_split($original);
	$spelled = implode(', ', $spelled);
	$ssml = '<speak><prosody rate="'.$rate.'">'.$ssml.'</prosody></speak>';
	
	switch($lang) {
		case 'en': $voice = 'Joanna'; break;
		case 'da': $voice = 'Naja'; break;
		case 'nl': $voice = 'Lotte'; break;
		case 'fr': $voice = 'Celine'; break;
		case 'de': $voice = 'Marlene'; break;
		case 'is': $voice = 'Dora'; break;
		case 'it': $voice = 'Carla'; break;
		case 'ja': $voice = 'Mizuki'; break;
		case 'ko': $voice = 'Seoyeon'; break;
		case 'pl': $voice = 'Ewa'; break;
		case 'pt-br': $voice = 'Vitoria'; break;
		case 'pt-pt': $voice = 'Ines'; break;
		case 'ro': $voice = 'Carmen'; break;
		case 'ru': $voice = 'Tatyana'; break;
		case 'es': $voice = 'Conchita'; break;
		case 'sv': $voice = 'Astrid'; break;
		case 'tr': $voice = 'Filiz'; break;
		case 'cy': $voice = 'Gwyneth'; break;
		default: $voice = 'Joanna';
	}
	
	$speech = [
		'Text' => $ssml,
		'OutputFormat' => 'mp3',
		'TextType' => 'ssml',
		'VoiceId' => 'Joanna'
	];
	
	// get service handle
	try {$client = new PollyClient($config);}
	catch(Exception $e) {print_r($e); exit;}
	
	// get speech
	$response = $client->synthesizeSpeech($speech);
	
	// save response file
	file_put_contents('../speech/'.$lang.'/'.$lang.'_'.$label.'_'.$rate.'.mp3', $response['AudioStream']);
	echo "Saved.";
}

echo "\nSpeech synthesis complete.\n\n";
exit;

?>