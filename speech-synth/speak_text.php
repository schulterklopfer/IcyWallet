<?php

require(__DIR__.'/vendor/autoload.php');

use Aws\Polly\PollyClient;


$alphabet = "abcdefghijklmnopqrstuvwxyz";
$alpha_arr = str_split($alphabet);

$arr['1'] = 'The first word is: ';
$arr['2'] = 'The second word is: ';
$arr['3'] = 'The third word is: ';
$arr['4'] = 'The fourth word is: ';
$arr['5'] = 'The fifth word is: ';
$arr['6'] = 'The sixth word is: ';
$arr['7'] = 'The seventh word is: ';
$arr['8'] = 'The eighth word is: ';
$arr['9'] = 'The ninth word is: ';
$arr['10'] = 'The tenth word is: ';
$arr['11'] = 'The eleventh word is: ';
$arr['12'] = 'The twelfth word is: ';


foreach($arr as $item => $prompt) {
	create_letter($item, $prompt);
	echo $item;
}

function create_letter($item, $prompt) {

$speech = [
  
  // Change this to whatever text you want to convert to audio
  //'Text' => 'At any time you can press enter to repeat whatever was last said.',
  
  'Text' => $prompt,
  
  'OutputFormat' => 'mp3',
  'TextType' => 'text',
  'VoiceId' => 'Joanna'

];

$config = [
  'version' => 'latest',
  'region' => 'us-west-2', // Change this to your respective AWS region
  'credentials' => [ // Change these to your respective AWS credentials
    'key' => 'AKIAIHSAGQA27ML7OV7A',
    'secret' => 'PusAX/oK7EKDFKAzTBEMz1p0pVwHi1m1mnUYRXzo',
  ]
];


// get service handle
try {$client = new PollyClient($config);}
catch(Exception $e) {print_r($e); exit;}

// get speech
$response = $client->synthesizeSpeech($speech);

// save response file
file_put_contents('seed_prompt_'.$item.'.mp3', $response['AudioStream']);

}
