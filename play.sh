#!/usr/bin/env bash

# concats several mp3 files and plays the result. This makes it easier to kill text to speech at user input

INPUTS=$1
FILTER=$2

# exmaple inputs for 3 files
# INPUTS: -i tts/en/12a032ce9179c32a6c7ab397b9d871fa.mp3 -i tts/en/12a0852b1a5f77f797900387fca77bf4.mp3 -i tts/en/13621569c04c27dde4aa00c3ef3ddbac.mp3
# FILTER: [0:0][1:0][2:0]concat=n=3:v=0:a=1[out]

/usr/local/bin/ffmpeg ${INPUTS} -filter_complex ${FILTER} -map '[out]' -f wav - | /usr/local/bin/mplayer -cache 2048 -


