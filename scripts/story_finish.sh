#!/bin/bash
# Final file of a Kaja episode: scripts/story_finish.sh sNN
# Loudness-normalises the mix (-14 LUFS), puts the title card (build/story/sNN/sNN_cover.jpg, story_cover.mjs) on the
# first 0.27 s of the picture (Maxim, 2026-11-12: the cover is also the first frame of the video; the take starts with
# 0.25 s of silence, so no speech is covered) and muxes -> build/story/sNN/sNN.mp4
set -e
ID=$1; D="$(cd "$(dirname "$0")/.." && pwd)/build/story/$ID"; HOLD=${2:-0.27}
PRE="acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=4dB,alimiter=limit=0.84:attack=3:release=60"
ffmpeg -v error -y -i "$D/$ID.mix.wav" -af "$PRE,loudnorm=I=-14:TP=-1.5:LRA=11" -ar 48000 "$D/$ID.final.wav"
ffmpeg -v error -y -i "$D/$ID.silent.mp4" -loop 1 -t 1 -i "$D/${ID}_cover.jpg" -i "$D/$ID.final.wav" \
  -filter_complex "[1:v]scale=1080:1920,format=yuv420p[c];[0:v][c]overlay=enable='lt(t,$HOLD)':eof_action=pass[v]" \
  -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$D/$ID.mp4"
ffprobe -v error -show_entries format=duration,size -of csv=p=0 "$D/$ID.mp4"
