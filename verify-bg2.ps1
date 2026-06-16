Add-Type -AssemblyName System.Drawing

foreach ($f in @('client\public\logo-main.png', 'client\public\logo-white.png')) {
    $full = Join-Path $PSScriptRoot $f
    $bytes = [System.IO.File]::ReadAllBytes($full)
    $ms = [System.IO.MemoryStream]::new($bytes)
    $bmp = [System.Drawing.Bitmap]::new($ms)
    $w = $bmp.Width
    $h = $bmp.Height

    $tl = $bmp.GetPixel(0, 0)
    $tr = $bmp.GetPixel($w - 1, 0)
    $bl = $bmp.GetPixel(0, $h - 1)
    $br = $bmp.GetPixel($w - 1, $h - 1)
    $mid = $bmp.GetPixel([int]($w / 2), [int]($h / 2))

    Write-Host "$f ($w x $h):"
    Write-Host "  TL alpha=$($tl.A) R=$($tl.R) G=$($tl.G) B=$($tl.B)"
    Write-Host "  TR alpha=$($tr.A) R=$($tr.R) G=$($tr.G) B=$($tr.B)"
    Write-Host "  BL alpha=$($bl.A) R=$($bl.R) G=$($bl.G) B=$($bl.B)"
    Write-Host "  BR alpha=$($br.A) R=$($br.R) G=$($br.G) B=$($br.B)"
    Write-Host "  MID alpha=$($mid.A) R=$($mid.R) G=$($mid.G) B=$($mid.B)"
    $bmp.Dispose()
    $ms.Dispose()
}
