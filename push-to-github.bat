@echo off
echo ========================================
echo MarketNest - Push to GitHub Script
echo ========================================
echo.
echo INSTRUCTIONS:
echo 1. First create a new repository on GitHub.com
echo 2. Repository name: marketnest (or MarketNest)
echo 3. Description: MarketNest - Modern E-Commerce Platform built with React.js, Redux Toolkit, and Tailwind CSS
echo 4. DO NOT initialize with README, .gitignore, or license
echo 5. After creating, copy the repository URL
echo.
set /p username="Enter your GitHub username: "
echo.
echo Adding remote repository...
git remote add origin https://github.com/%username%/marketnest.git
echo.
echo Pushing code to GitHub...
git push -u origin main
echo.
echo ========================================
echo Done! Your MarketNest project is now on GitHub!
echo Repository URL: https://github.com/%username%/marketnest
echo ========================================
pause
