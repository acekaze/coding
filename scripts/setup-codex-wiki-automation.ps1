param(
  [string]$AutomationId = 'wiki-morning-loop',
  [string]$WakeTime = '08:50',
  [string]$LaunchTime = '08:55',
  [string]$CodexAppId = 'OpenAI.Codex_2p2nqsd0c76g0!App'
)

$repoRoot = Split-Path -Parent $PSScriptRoot
$openScript = Join-Path $PSScriptRoot 'open-codex-app.ps1'
$wakeScript = Join-Path $PSScriptRoot 'wake-for-codex.ps1'
$promptFile = Join-Path $repoRoot 'prompts\automated-wiki-sync.md'
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
$automationToml = Join-Path $codexHome "automations\$AutomationId\automation.toml"
$dbPath = Join-Path $codexHome 'sqlite\codex-dev.db'
$user = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$nowMs = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$workspaceRoot = Split-Path -Parent $repoRoot
$automationWorkspaceRoot = $workspaceRoot
$automationRepoRoot = $repoRoot
$asciiWorkspaceAlias = 'C:\coding'
$asciiRepoAlias = Join-Path $asciiWorkspaceAlias (Split-Path -Leaf $repoRoot)
$schedulerScriptRoot = $PSScriptRoot

if ((Test-Path $asciiWorkspaceAlias) -and (Test-Path $asciiRepoAlias)) {
  $automationWorkspaceRoot = $asciiWorkspaceAlias
  $automationRepoRoot = $asciiRepoAlias
  $schedulerScriptRoot = Join-Path $asciiRepoAlias 'scripts'
}

$cwdsJson = @(
  ($automationWorkspaceRoot -replace '\\', '/'),
  ($automationRepoRoot -replace '\\', '/')
) | ConvertTo-Json -Compress

$schedulerOpenScript = Join-Path $schedulerScriptRoot 'open-codex-app.ps1'
$schedulerWakeScript = Join-Path $schedulerScriptRoot 'wake-for-codex.ps1'
$launchCommand = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$schedulerOpenScript`" -CodexAppId `"$CodexAppId`""
$refreshLaunchCommand = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$schedulerOpenScript`" -CodexAppId `"$CodexAppId`" -RestartIfRunning -RestartDelaySeconds 5"
$wakeCommand = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$schedulerWakeScript`""

if (-not (Test-Path $openScript)) {
  throw "Missing launch script: $openScript"
}

if (-not (Test-Path $wakeScript)) {
  throw "Missing wake script: $wakeScript"
}

if (-not (Test-Path $promptFile)) {
  throw "Missing automation prompt file: $promptFile"
}

if (-not (Test-Path $automationToml)) {
  throw "Missing automation file: $automationToml"
}

$promptText = (Get-Content $promptFile -Raw).Trim()
$promptLine = (($promptText -split "\r?\n") | Where-Object { $_.Trim() } | ForEach-Object { $_.Trim() }) -join ' '
$promptLine = $promptLine -replace '"', '\"'
$toml = Get-Content $automationToml -Raw
$promptRegex = [System.Text.RegularExpressions.Regex]::new(
  'prompt = ".*?"(?=\r?\nstatus = )',
  [System.Text.RegularExpressions.RegexOptions]::Singleline
)
$toml = $promptRegex.Replace($toml, "prompt = `"$promptLine`"", 1)
$toml = [regex]::Replace($toml, 'cwds = \[.*?\]', "cwds = $cwdsJson", 1)
$toml = [regex]::Replace($toml, 'status = ".*?"', 'status = "ACTIVE"', 1)
$toml = [regex]::Replace($toml, 'updated_at = \d+', "updated_at = $nowMs", 1)
Set-Content -Path $automationToml -Value $toml -NoNewline -Encoding UTF8

if (Test-Path $dbPath) {
  @"
import sqlite3
path = r"$dbPath"
conn = sqlite3.connect(path)
cur = conn.cursor()
cur.execute(
    "UPDATE automations SET prompt = ?, status = ?, cwds = ?, updated_at = ? WHERE id = ?",
    ("""$promptLine""", "ACTIVE", """$cwdsJson""", $nowMs, "$AutomationId"),
)
conn.commit()
"@ | python -
}

$null = powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_SLEEP RTCWAKE 1
$null = powercfg /SETDCVALUEINDEX SCHEME_CURRENT SUB_SLEEP RTCWAKE 1
$null = powercfg /S SCHEME_CURRENT

$null = schtasks /Create /F /TN "\Codex\Open Codex At Logon" /SC ONLOGON /TR $launchCommand /RU $user
$null = schtasks /Create /F /TN "\Codex\Wake For Codex Wiki Loop" /SC DAILY /ST $WakeTime /TR $wakeCommand /RU $user
$null = schtasks /Create /F /TN "\Codex\Open Codex Before Wiki Loop" /SC DAILY /ST $LaunchTime /TR $refreshLaunchCommand /RU $user

$taskUpdates = @(
  @{ Name = 'Open Codex At Logon'; WakeToRun = $false },
  @{ Name = 'Wake For Codex Wiki Loop'; WakeToRun = $true },
  @{ Name = 'Open Codex Before Wiki Loop'; WakeToRun = $true }
)

foreach ($taskUpdate in $taskUpdates) {
  $task = Get-ScheduledTask -TaskPath '\Codex\' -TaskName $taskUpdate.Name
  $task.Settings.WakeToRun = $taskUpdate.WakeToRun
  $task.Settings.StartWhenAvailable = $true
  $task.Settings.ExecutionTimeLimit = 'PT1H'
  $task.Settings.DisallowStartIfOnBatteries = $false
  $task.Settings.StopIfGoingOnBatteries = $false
  Set-ScheduledTask -InputObject $task | Out-Null
}

Write-Output "Activated Codex automation '$AutomationId'."
Write-Output "Scheduled tasks created for $user."
Write-Output "Wake time: $WakeTime"
Write-Output "Daily launch time: $LaunchTime"
Write-Output "Automation workspaces: $cwdsJson"
