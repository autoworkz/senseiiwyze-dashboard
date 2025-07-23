#!/bin/bash

# Start LiteLLM Server Script
# This script sources environment variables, activates the virtual environment,
# and starts the LiteLLM server with the specified configuration.

set -e  # Exit on any error

echo "🚀 Starting LiteLLM Server..."

# Source .env file if it exists
if [ -f ".env" ]; then
    echo "📄 Loading environment variables from .env file..."
    source .env
else
    echo "⚠️  No .env file found, proceeding without it..."
fi

# Activate virtual environment
if [ -d ".venv" ]; then
    echo "🐍 Activating virtual environment..."
    source .venv/bin/activate
else
    echo "❌ Virtual environment not found at .venv/"
    echo "Please create a virtual environment first:"
    echo "  python -m venv .venv"
    echo "  source .venv/bin/activate"
    echo "  pip install litellm"
    exit 1
fi

# Check if litellm is installed
if ! command -v litellm &> /dev/null; then
    echo "❌ litellm command not found. Please install it first:"
    echo "  pip install litellm"
    exit 1
fi

# Check if config file exists
if [ ! -f "/app/litellm.config.yaml" ]; then
    echo "❌ Configuration file '/app/litellm.config.yaml' not found"
    echo "Please create the configuration file first."
    exit 1
fi

echo "🔧 Starting LiteLLM with configuration..."
echo "   Config: /app/litellm.config.yaml"
echo "   Host: 0.0.0.0"
echo "   Port: 4000"
echo "   Debug: enabled"
echo ""

# Start LiteLLM server
exec litellm --config /app/litellm.config.yaml --host 0.0.0.0 --port 4000 --debug
