# Ask the user for the URL
$URL = Read-Host "Please enter the URL of the video or playlist"

# Loop until a valid input (1 for mp3, 2 for mp4, 3 for playlist mp3)
$format = ""
while ($true) {
    Write-Host "`nPlease choose the download format:"
    Write-Host "1. MP3 (Single Video)"
    Write-Host "2. MP4 (Single Video)"
    Write-Host "3. MP3 (Entire Playlist)"
    $formatChoice = Read-Host "Enter 1, 2, or 3"

    if ($formatChoice -eq "1") {
        $format = "single-mp3"
        break
    }
    elseif ($formatChoice -eq "2") {
        $format = "single-mp4"
        break
    }
    elseif ($formatChoice -eq "3") {
        $format = "playlist-mp3"
        break
    }
    else {
        Write-Host "Invalid choice. Please enter 1, 2, or 3."
    }
}

# Ask the user for the download location
$DownloadLocation = Read-Host "Please enter the location where you want to save the downloads"

# Check if the download location exists, if not, create it
if (-Not (Test-Path $DownloadLocation)) {
    Write-Host "Directory does not exist. Creating it..."
    New-Item -ItemType Directory -Path $DownloadLocation
}

# Build the yt-dlp command based on selected option
switch ($format) {
    "single-mp3" {
        $Command = "yt-dlp -f bestaudio -t mp3 -o `"$DownloadLocation\%(title)s.%(ext)s`" `"$URL`""
    }
    "single-mp4" {
        $Command = "yt-dlp -f bestvideo+bestaudio -o `"$DownloadLocation\%(title)s.%(ext)s`" `"$URL`""
    }
    "playlist-mp3" {
        $Command = "yt-dlp --yes-playlist -f bestaudio -t mp3 -o `"$DownloadLocation\%(title)s.%(ext)s`" `"$URL`""
    }
}

# Execute the command
Invoke-Expression $Command

# Check if yt-dlp succeeded
if ($?) {
    Write-Host "`nDownload completed successfully!"
}
else {
    Write-Host "`nAn error occurred during the download."
}
