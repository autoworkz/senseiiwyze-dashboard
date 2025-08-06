FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Development command
CMD ["pnpm", "dev", "--turbo"]