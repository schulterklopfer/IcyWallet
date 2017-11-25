# Speech synthesis for IcyWallet

## Getting started

Open config.php and replace the credentials (key and secret) with your own AWS secret access keys.

## Generate speech

`$ php -f speech-synth.php`

## More information

speech-synth.php generates speech files for IcyWallet. The script uses the localized language files in the /language directory, generating all speech for both application output and the BIP39 word list for any languages specified in the directory.

Speech for application output is generated in three speeds: "medium", "fast", and "x-fast" (standard SSML prosody values). Speech for BIP39 seed words is always generated at the "medium" speed.

Speech synthesis is provided by Amazon Polly. More information about Amazon Polly is available at https://aws.amazon.com/polly/.