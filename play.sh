#!/usr/bin/env bash

/usr/local/bin/ffmpeg -i $1 -filter:a "atempo=$2" -f wav - | /usr/local/bin/mplayer -cache 1024 -