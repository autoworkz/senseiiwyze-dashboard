# Deployment Guide

This document provides comprehensive instructions for deploying the SenseiiWyze Dashboard application.

## Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0 (enforced package manager)
- **Python**: >= 3.8 (for LiteLLM server)
- **Virtual Environment**: Python venv for LiteLLM dependencies

## Environment Setup

### 1. Required Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Required API Keys
HYPERBOLIC_API_KEY=your_hyperbolic_api_key_here

# Optional Configuration
LITELLM_HOST=0.0.0.0
LITELLM_PORT=4000
LITELLM_DEBUG=true
```

**Important**: Make sure to set your `HYPERBOLIC_API_KEY` environment variable before starting the LiteLLM server. This key is required for API authentication.

### 2. LiteLLM Configuration

The application uses `litellm.config.yaml` for LiteLLM server configuration. Ensure this file is properly configured with your API endpoints and models.

Example `litellm.config.yaml` structure:
```yaml
model_list:
  - model_name: gpt-3.5-turbo
    litellm_params:
      model: hyperbolic/meta-llama/Meta-Llama-3.1-8B-Instruct
      api_key: env/HYPERBOLIC_API_KEY
      api_base: https://api.hyperbolic.xyz/v1

general_settings:
  master_key: your_master_key_here
  database_url: sqlite:///./litellm.db
```

## Deployment Methods

### Method 1: Local Development Deployment

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Setup Python Environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   pip install litellm
   ```

3. **Build the Application**:
   ```bash
   pnpm build
   ```

4. **Start LiteLLM Server**:
   ```bash
   ./start-litellm.sh
   ```

5. **Start the Next.js Application**:
   ```bash
   pnpm start
   ```

### Method 2: Production Deployment

1. **Prepare Environment**:
   ```bash
   # Set production environment variables
   export NODE_ENV=production
   export HYPERBOLIC_API_KEY=your_production_api_key
   ```

2. **Build and Start**:
   ```bash
   pnpm install --prod
   pnpm build
   ./start-litellm.sh &  # Start LiteLLM in background
   pnpm start
   ```

### Method 3: Container Deployment

If using Docker or similar containerization:

1. **Dockerfile considerations**:
   - Ensure `litellm.config.yaml` is copied to `/app/litellm.config.yaml`
   - Install both Node.js and Python dependencies
   - Set appropriate environment variables

2. **Start Services**:
   ```bash
   # In your container startup script
   ./start-litellm.sh &
   pnpm start
   ```

## LiteLLM Server Management

### Starting the Server

Use the provided script to start the LiteLLM server:

```bash
./start-litellm.sh
```

This script will:
- Load environment variables from `.env`
- Activate the Python virtual environment
- Verify `litellm.config.yaml` exists at `/app/litellm.config.yaml`
- Start the server on `0.0.0.0:4000` with debug enabled

### Manual Server Start

If you need to start the server manually:

```bash
source .venv/bin/activate
litellm --config /app/litellm.config.yaml --host 0.0.0.0 --port 4000 --debug
```

### Server Configuration

The LiteLLM server expects the configuration file at `/app/litellm.config.yaml`. Make sure this path is accessible in your deployment environment.

## Troubleshooting

### Common Issues

1. **Missing Configuration File**:
   ```
   Error: Configuration file '/app/litellm.config.yaml' not found
   ```
   Solution: Ensure `litellm.config.yaml` is placed at the correct path.

2. **Missing Virtual Environment**:
   ```
   Error: Virtual environment not found at .venv/
   ```
   Solution: Create and setup the Python virtual environment as described above.

3. **Missing API Key**:
   ```
   Error: HYPERBOLIC_API_KEY not set
   ```
   Solution: Set the `HYPERBOLIC_API_KEY` environment variable in your `.env` file.

4. **LiteLLM Not Installed**:
   ```
   Error: litellm command not found
   ```
   Solution: Install LiteLLM in your virtual environment:
   ```bash
   source .venv/bin/activate
   pip install litellm
   ```

### Health Checks

1. **Verify LiteLLM Server**:
   ```bash
   curl http://localhost:4000/health
   ```

2. **Check Configuration**:
   ```bash
   curl http://localhost:4000/v1/models
   ```

## Security Considerations

- Never commit API keys to version control
- Use environment variables for sensitive configuration
- Ensure `litellm.config.yaml` contains only non-sensitive configuration
- Consider using secrets management in production environments

## Monitoring and Logs

- LiteLLM server logs are output to stdout when started with `./start-litellm.sh`
- Enable debug mode for detailed logging during development
- Monitor server health using the `/health` endpoint

## Scaling Considerations

- The LiteLLM server can handle multiple concurrent requests
- Consider load balancing for high-traffic deployments
- Monitor resource usage and scale accordingly
- Use appropriate database backends for production deployments
