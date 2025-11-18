#!/bin/bash

# AI Form Builder - Installation Script
# This script helps set up the development environment

echo "🚀 AI Form Builder - Supabase Edition Setup"
echo "============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ Python version: $(python3 --version)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
python3 -m pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

echo ""
echo "============================================"
echo "✅ Installation completed successfully!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Set up your Supabase project at https://supabase.com"
echo "2. Create .env.local file in root directory (see ENV_SETUP.md)"
echo "3. Create .env file in backend/ directory (see ENV_SETUP.md)"
echo "4. Run backend: cd backend && python3 app.py"
echo "5. Run frontend: npm run dev"
echo ""
echo "📚 Documentation:"
echo "  - SETUP_INSTRUCTIONS.md - Quick start guide"
echo "  - ENV_SETUP.md - Environment variables guide"
echo "  - README.md - Complete documentation"
echo "  - MIGRATION_GUIDE.md - Migration details"
echo ""
echo "🎉 Happy coding!"

