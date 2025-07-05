@echo off
title MarketNest - GitHub Setup
color 0A

echo.
echo  ╔══════════════════════════════════════════════════════════════╗
echo  ║                    🛒 MarketNest - GitHub Setup              ║
echo  ╚══════════════════════════════════════════════════════════════╝
echo.

echo 📋 Prerequisites Checklist:
echo    ✓ Git is installed and configured
echo    ✓ GitHub account is ready
echo    ✓ Repository 'marketnest' created on GitHub (public)
echo.

echo ⚠️  IMPORTANT: Make sure you have created a repository named 'marketnest' on GitHub first!
echo    Go to: https://github.com/new
echo    Repository name: marketnest
echo    Description: 🛒 Modern E-commerce Platform built with React, Redux Toolkit, and Tailwind CSS
echo    Set to PUBLIC (recommended for portfolio)
echo    DO NOT initialize with README, .gitignore, or license
echo.

set /p username="🔑 Enter your GitHub username: "

if "%username%"=="" (
    echo ❌ Username cannot be empty!
    pause
    exit /b 1
)

echo.
echo 🔗 Adding GitHub remote...
git remote remove origin 2>nul
git remote add origin https://github.com/%username%/marketnest.git

if %errorlevel% neq 0 (
    echo ❌ Failed to add remote. Please check your username.
    pause
    exit /b 1
)

echo ✅ Remote added successfully!
echo.

echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ❌ Push failed! This might be due to:
    echo    - Repository doesn't exist on GitHub
    echo    - Authentication issues (use Personal Access Token as password)
    echo    - Network connectivity issues
    echo.
    echo 💡 Solutions:
    echo    1. Create repository on GitHub: https://github.com/new
    echo    2. Use Personal Access Token instead of password
    echo    3. Check your internet connection
    pause
    exit /b 1
)

echo.
echo 🎉 SUCCESS! Your MarketNest project is now on GitHub!
echo.
echo 🔗 Repository URL: https://github.com/%username%/marketnest
echo 🌐 GitHub Pages (if enabled): https://%username%.github.io/marketnest
echo.
echo 📝 Next Steps:
echo    1. Visit your repository and verify all files are uploaded
echo    2. Add repository topics: react, redux, tailwindcss, ecommerce
echo    3. Enable GitHub Pages for live demo (Settings → Pages)
echo    4. Consider deploying to Vercel or Netlify for production
echo.

pause
