Add-Type -AssemblyName System.Drawing

function Remove-Background {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$Tolerance = 30
    )

    # Load via MemoryStream so GDI+ releases the file lock immediately
    $bytes = [System.IO.File]::ReadAllBytes($InputPath)
    $ms = [System.IO.MemoryStream]::new($bytes)
    $src = [System.Drawing.Bitmap]::new($ms)
    $dst = [System.Drawing.Bitmap]::new($src.Width, $src.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    # Sample the four corners and pick the most common colour
    $corners = @(
        $src.GetPixel(0, 0),
        $src.GetPixel($src.Width - 1, 0),
        $src.GetPixel(0, $src.Height - 1),
        $src.GetPixel($src.Width - 1, $src.Height - 1)
    )
    $bgColor = ($corners | Group-Object { "$($_.R),$($_.G),$($_.B)" } | Sort-Object Count -Descending | Select-Object -First 1).Group[0]
    Write-Host "  Background colour detected: R=$($bgColor.R) G=$($bgColor.G) B=$($bgColor.B)"

    $g = [System.Drawing.Graphics]::FromImage($dst)
    $g.DrawImage($src, 0, 0)
    $g.Dispose()

    for ($y = 0; $y -lt $dst.Height; $y++) {
        for ($x = 0; $x -lt $dst.Width; $x++) {
            $px = $dst.GetPixel($x, $y)
            $dr = [Math]::Abs($px.R - $bgColor.R)
            $dg = [Math]::Abs($px.G - $bgColor.G)
            $db = [Math]::Abs($px.B - $bgColor.B)
            $dist = [Math]::Sqrt($dr * $dr + $dg * $dg + $db * $db)

            if ($dist -le $Tolerance) {
                # Fully transparent
                $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $px.R, $px.G, $px.B))
            } elseif ($dist -le ($Tolerance * 2)) {
                # Anti-aliased edge: blend alpha based on distance from threshold
                $alpha = [Math]::Round((($dist - $Tolerance) / $Tolerance) * 255)
                $dst.SetPixel($x, $y, [System.Drawing.Color]::FromArgb([int]$alpha, $px.R, $px.G, $px.B))
            }
        }
    }

    $dst.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $src.Dispose()
    $ms.Dispose()
    $dst.Dispose()
    Write-Host "  Saved: $OutputPath"
}

$images = @(
    "client\public\logo-main.png",
    "client\public\logo-white.png"
)

foreach ($img in $images) {
    $full = Join-Path $PSScriptRoot $img
    if (Test-Path $full) {
        Write-Host "Processing: $img"
        Remove-Background -InputPath $full -OutputPath $full -Tolerance 30
        # Also update dist copy
        $dist = $full -replace "\\public\\", "\dist\"
        if (Test-Path $dist) {
            Copy-Item $full $dist -Force
            Write-Host "  Synced to dist"
        }
    } else {
        Write-Host "Not found: $full"
    }
}

Write-Host "Done."
