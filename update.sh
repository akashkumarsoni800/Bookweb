#!/bin/bash

# Ye script aapke Frontend aur Backend dono repositories ko ek saath update karega.

echo "🚀 Pushing Frontend changes (Minnor-Project)..."
cd Minnor-Project
git add .
git commit -m "Auto-update frontend"
git push origin main
cd ..

echo "🚀 Pushing Backend changes (Bookweb)..."
git add .
git commit -m "Auto-update backend"
git push origin main

echo "✅ All changes pushed to both repositories!"
