param(
  [string]$CodexAppId = 'OpenAI.Codex_2p2nqsd0c76g0!App'
)

$running = Get-Process -Name 'Codex' -ErrorAction SilentlyContinue

if ($running) {
  Write-Output 'Codex is already running.'
  exit 0
}

Start-Process explorer.exe "shell:AppsFolder\$CodexAppId"
Write-Output 'Requested Codex app launch.'
