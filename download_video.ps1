param (
    [string]$url,
    [string]$format,
    [string]$downloadPath
)

# Validate parameters
if (-not $url -or -not $format -or -not $downloadPath) {
    Write-Host "`nMissing required parameters: -url, -format, -downloadPath"
    exit 1
}

# Create directory if it doesn't exist
if (-Not (Test-Path $downloadPath)) {
    Write-Host "`nDirectory does not exist. Creating it..."
    New-Item -ItemType Directory -Path $downloadPath -Force | Out-Null
}

# Build yt-dlp command
switch ($format) {
    "single-mp3" {
        $Command = "yt-dlp -f bestaudio -x -t mp3 --progress-template `"download:{progress:.1f}`" -o `"$downloadPath\%(title)s.%(ext)s`" `"$url`""
    }
    "single-mp4" {
        $Command = "yt-dlp -f bestvideo+bestaudio -t mp4 --progress-template `"download:{progress:.1f}`" -o `"$downloadPath\%(title)s.%(ext)s`" `"$url`""
    }
    "playlist-mp3" {
        $Command = "yt-dlp --yes-playlist -f bestaudio -x -t mp3 --progress-template `"download:{progress:.1f}`" -o `"$downloadPath\%(title)s.%(ext)s`" `"$url`""
    }
    default {
        Write-Host "`nInvalid format specified."
        exit 1
    }
}
# switch ($format) {
#     "single-mp3" {
#         $Command = "yt-dlp -f bestaudio -x -t mp3 -o `"$downloadPath\%(title)s.%(ext)s`" `"$url`""
#     }
#     "single-mp4" {
#         $Command = "yt-dlp -f bestvideo+bestaudio -t mp4 -o `"$downloadPath\%(title)s.%(ext)s`" `"$url`""
#     }
#     "playlist-mp3" {
#         $Command = "yt-dlp --yes-playlist -f bestaudio -x -t mp3 -o `"$downloadPath\%(title)s.%(ext)s`" `"$url`""
#     }
#     default {
#         Write-Host "`nInvalid format specified."
#         exit 1
#     }
# }

# Show the command
Write-Host "`nRunning command:"
Write-Host $Command
Write-Host ""

# Run the command
Invoke-Expression $Command

# Status
if ($?) {
    Write-Host "`Download completed successfully!"
}
else {
    Write-Host "`An error occurred during the download."
}
