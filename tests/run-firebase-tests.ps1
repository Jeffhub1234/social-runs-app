$ErrorActionPreference = 'Stop'
$projectDirectory = Split-Path -Parent $PSScriptRoot
$rulesTestDirectory = Join-Path $projectDirectory '.expo\rules-tests'
$firebaseExecutable = Join-Path $rulesTestDirectory 'node_modules\.bin\firebase.cmd'
if (!(Test-Path -LiteralPath $firebaseExecutable)) {
  throw 'Install the isolated Firebase test dependencies using tests/README.md first.'
}
$previousEnvironment = @{}
$environmentKeys = @('JAVA_HOME', 'Path', 'XDG_CONFIG_HOME', 'FIREBASE_EMULATORS_PATH', 'CI', 'DEBUG')
foreach ($key in $environmentKeys) {
  $previousEnvironment[$key] = [Environment]::GetEnvironmentVariable($key, 'Process')
}
Push-Location -LiteralPath $rulesTestDirectory
try {
  $portableJavaDirectory = Join-Path $rulesTestDirectory 'java'
  if (Test-Path -LiteralPath $portableJavaDirectory) {
    $portableJava = Get-ChildItem -LiteralPath $portableJavaDirectory -Directory | Where-Object {
      Test-Path -LiteralPath (Join-Path $_.FullName 'bin\java.exe')
    } | Select-Object -First 1
    if ($portableJava) {
      $env:JAVA_HOME = $portableJava.FullName
      $env:Path = "$env:JAVA_HOME\bin;$env:Path"
    }
  }
  $env:XDG_CONFIG_HOME = Join-Path $rulesTestDirectory 'config'
  $env:FIREBASE_EMULATORS_PATH = Join-Path $rulesTestDirectory 'emulators'
  $env:CI = 'true'
  $env:DEBUG = ''
  Copy-Item -LiteralPath (Join-Path $projectDirectory 'firestore.rules') -Destination 'firestore.rules' -Force
  Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'firebase-emulator.json') -Destination 'firebase.json' -Force
  & $firebaseExecutable emulators:exec --project demo-social-runs-tests --config firebase.json --only firestore 'node ../../tests/firebase-rules.test.mjs'
  $testExitCode = $LASTEXITCODE
} finally {
  Pop-Location
  foreach ($key in $environmentKeys) {
    [Environment]::SetEnvironmentVariable($key, $previousEnvironment[$key], 'Process')
  }
}
exit $testExitCode
