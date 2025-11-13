#!/bin/bash

# GitHub Push Helper Script for Windows Git Bash

echo "================================================"
echo "🚀 GitHub Push Helper - Pet Game Migration"
echo "================================================"
echo ""
echo "📊 Status:"
git status --short
echo ""
echo "📝 Commits to push:"
git log origin/main..HEAD --oneline
echo ""
echo "================================================"
echo "🔐 Authentication Options:"
echo ""
echo "Option A: GitHub Personal Access Token (Recommended)"
echo "  1. Go to https://github.com/settings/tokens"
echo "  2. Generate new token (classic)"
echo "  3. Check 'repo' scope"
echo "  4. Copy the token"
echo "  5. When prompted for password below, paste the token"
echo ""
echo "Option B: GitHub SSH Key"
echo "  1. Ensure SSH key is added to https://github.com/settings/keys"
echo "  2. Run: git remote set-url origin git@github.com:Yuri6818/petgame2-test.git"
echo ""
echo "================================================"
echo ""
read -p "Ready to push? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Pushing to GitHub..."
    git push origin main
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ SUCCESS! Code pushed to GitHub"
        echo ""
        echo "📍 View your changes:"
        echo "   https://github.com/Yuri6818/petgame2-test"
        echo ""
    else
        echo ""
        echo "❌ Push failed. Check the error above."
        echo ""
        echo "💡 Try this to authenticate:"
        echo "   git config --global credential.helper manager-core"
        echo "   git push origin main"
        echo ""
    fi
else
    echo "❌ Push cancelled"
fi
