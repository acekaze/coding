param(
  [string]$CodexAppId = 'OpenAI.Codex_2p2nqsd0c76g0!App',
  [switch]$RestartIfRunning,
  [int]$RestartDelaySeconds = 5
)

$running = Get-Process -ErrorAction SilentlyContinue | Where-Object {
  $_.ProcessName -in @('Codex', 'codex')
}

if ($running) {
  if (-not $RestartIfRunning) {
    Write-Output 'Codex is already running.'
    exit 0
  }

  $running |
    Select-Object -ExpandProperty Id -Unique |
    Stop-Process -Force -ErrorAction SilentlyContinue

  Start-Sleep -Seconds $RestartDelaySeconds
  Write-Output 'Restarting Codex before launch.'
}

Start-Process explorer.exe "shell:AppsFolder\$CodexAppId"
Write-Output 'Requested Codex app launch.'
