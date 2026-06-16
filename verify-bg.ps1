Add-Type -AssemblyName System.Drawing

foreach ($f in @('client\public\logo-main.png', 'client\public\logo-white.png')) {
    $full = Join-Path $PSScriptRoot $f
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $ms = [System.IO.MemoryStream]::new($bytes)
    $bmp = [System.Drawing.Bitmap]::new($ms)
    $transparentCount = 0
    $sampleSize = [Math]::Min(10, $bmp.Width)
    $sampleH = [Math]::Min(10, $bmp.Height)
    for ($y = 0; $y -lt $sampleH; $y++) {
        for ($x = 0; $x -lt $sampleSize; $x++) {
            $px = $bmp.GetPixel($x, $y)
            if ($px.A -lt 255) { $transparentCount++ }
        }
    }
    Write-Host "$f - $($bmp.Width)x$($bmp.Height), transparent pixels in top-left corner: $transparentCount"
    $bmp.Dispose()
    $ms.Dispose()
}
