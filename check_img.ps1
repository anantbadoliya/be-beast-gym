Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Join-Path (Get-Location) "frames/ezgif-frame-001.jpg"))
Write-Output "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
