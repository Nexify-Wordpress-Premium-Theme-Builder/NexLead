# NexLead dev portlarını temizler (3000 web, 4000 api)
foreach ($port in @(3000, 4000)) {
  Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object {
      Write-Host "Port $port -> PID $_ sonlandırılıyor"
      Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Portlar temizlendi."
