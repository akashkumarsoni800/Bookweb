#!/bin/bash

# Ye script ab Frontend aur Backend dono ko ek saath single repository me update karega.

echo "🚀 Pushing all changes to Bookweb repository..."

git add .
git commit -m "Auto-update: Frontend and Backend"
git push origin main

echo "✅ Everything pushed successfully to your repository!"
