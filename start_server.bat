@echo off
echo Starting server on port 8000...
echo.
echo To access from mobile:
ipconfig | findstr "IPv4"
echo.
echo Use the IPv4 address above in your mobile browser like this:
echo http://YOUR_IP_ADDRESS:8000
echo.
echo Press Ctrl+C to stop the server
python -m http.server 8000
