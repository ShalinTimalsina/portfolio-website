New-Item -ItemType Directory -Force -Path docs | Out-Null
Move-Item -Path DESIGN.md, MOTION.md, CONTENT.md, HCI-A11Y.md, TERMINAL.md, MASCOT.md, ADMIN-CMS.md, ARCHITECTURE.md, DEFINITION-OF-DONE.md, CREDITS.md -Destination docs/ -ErrorAction SilentlyContinue

$files = @(Get-ChildItem -Path .agents\rules\*.md; Get-ChildItem -Path .agents\workflows\*.md; Get-Item AGENTS.md)
foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw
  $content = $content -replace '\.\/DESIGN\.md', './docs/DESIGN.md'
  $content = $content -replace '\.\/MOTION\.md', './docs/MOTION.md'
  $content = $content -replace '\.\/CONTENT\.md', './docs/CONTENT.md'
  $content = $content -replace '\.\/HCI-A11Y\.md', './docs/HCI-A11Y.md'
  $content = $content -replace '\.\/TERMINAL\.md', './docs/TERMINAL.md'
  $content = $content -replace '\.\/MASCOT\.md', './docs/MASCOT.md'
  $content = $content -replace '\.\/ADMIN-CMS\.md', './docs/ADMIN-CMS.md'
  $content = $content -replace '\.\/ARCHITECTURE\.md', './docs/ARCHITECTURE.md'
  $content = $content -replace '\.\/DEFINITION-OF-DONE\.md', './docs/DEFINITION-OF-DONE.md'
  $content = $content -replace '\.\/CREDITS\.md', './docs/CREDITS.md'
  
  $content = $content -replace '\.\.\/\.\.\/DESIGN\.md', '../../docs/DESIGN.md'
  $content = $content -replace '\.\.\/\.\.\/MOTION\.md', '../../docs/MOTION.md'
  $content = $content -replace '\.\.\/\.\.\/CONTENT\.md', '../../docs/CONTENT.md'
  $content = $content -replace '\.\.\/\.\.\/HCI-A11Y\.md', '../../docs/HCI-A11Y.md'
  $content = $content -replace '\.\.\/\.\.\/TERMINAL\.md', '../../docs/TERMINAL.md'
  $content = $content -replace '\.\.\/\.\.\/MASCOT\.md', '../../docs/MASCOT.md'
  $content = $content -replace '\.\.\/\.\.\/ADMIN-CMS\.md', '../../docs/ADMIN-CMS.md'
  $content = $content -replace '\.\.\/\.\.\/ARCHITECTURE\.md', '../../docs/ARCHITECTURE.md'
  $content = $content -replace '\.\.\/\.\.\/DEFINITION-OF-DONE\.md', '../../docs/DEFINITION-OF-DONE.md'
  $content = $content -replace '\.\.\/\.\.\/CREDITS\.md', '../../docs/CREDITS.md'
  
  Set-Content -Path $f.FullName -Value $content
}
Write-Output "Done"
