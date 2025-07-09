#!/bin/bash

url="$1"
format="$2"
downloadPath="$3"

mkdir -p "$downloadPath"

case "$format" in
  "single-mp3")
    yt-dlp -f bestaudio -x --audio-format mp3 -o "$downloadPath/%(title)s.%(ext)s" "$url"
    ;;
  "single-mp4")
    yt-dlp -f bestvideo+bestaudio -o "$downloadPath/%(title)s.%(ext)s" "$url"
    ;;
  "playlist-mp3")
    yt-dlp --yes-playlist -f bestaudio -x --audio-format mp3 -o "$downloadPath/%(title)s.%(ext)s" "$url"
    ;;
  *)
    echo "❌ Invalid format"
    exit 1
    ;;
esac
