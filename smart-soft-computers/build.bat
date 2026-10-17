@echo off
echo ========================================================
echo   SMART SOFT COMPUTERS - BUNDLER & UPDATE TOOL
echo ========================================================
echo.
echo Packaging index.html + styles.css + data.js + config.js + app.js...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$html = Get-Content 'index.html' -Raw; " ^
  "$css = Get-Content 'css/styles.css' -Raw; " ^
  "$config = Get-Content 'js/config.js' -Raw; " ^
  "$data = Get-Content 'js/data.js' -Raw; " ^
  "$app = Get-Content 'js/app.js' -Raw; " ^
  "$html = $html.Replace('<link rel=\"stylesheet\" href=\"css/styles.css\">', \"<style>`n$css`n</style>\"); " ^
  "$html = $html.Replace('<script src=\"js/config.js\"></script>', \"<script>`n$config`n</script>\"); " ^
  "$html = $html.Replace('<script src=\"js/data.js\"></script>', \"<script>`n$data`n</script>\"); " ^
  "$html = $html.Replace('<script src=\"js/app.js\"></script>', \"<script>`n$app`n</script>\"); " ^
  "Set-Content 'single-file/index.html' -Value $html -Encoding UTF8; " ^
  "Write-Host 'SUCCESS: single-file/index.html updated successfully!' -ForegroundColor Green"

echo.
echo ========================================================
echo   Done! Your single-file/index.html is ready to upload.
echo ========================================================
pause
