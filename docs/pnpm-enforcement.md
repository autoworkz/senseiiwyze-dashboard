# PNPM Enforcement Guide

This document explains how this project enforces the use of pnpm as the package manager and prevents the use of npm or yarn.

## Why PNPM?

- **Performance**: Faster installation and better disk space usage
- **Security**: Stricter dependency resolution and better security model
- **Consistency**: Ensures all developers use the same package manager
- **Monorepo Support**: Better support for monorepo structures
- **Lock File Integrity**: More reliable lock file format

## Enforcement Measures

### 1. Package.json Configuration

```json
{
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

- `packageManager`: Specifies the exact pnpm version
- `engines`: Enforces Node.js and pnpm version requirements

### 2. Script Enforcement

All scripts in `package.json` explicitly use `pnpm`:

```json
{
  "scripts": {
    "dev": "pnpm next dev",
    "build": "pnpm next build",
    "test": "pnpm jest",
    "install": "echo 'Please use pnpm install instead of npm install' && exit 1"
  }
}
```

### 3. Configuration Files

#### .npmrc
```ini
engine-strict=true
auto-install-peers=true
shamefully-hoist=false
strict-peer-dependencies=false
prefer-pnpm=true
```

#### .pnpmrc
```ini
auto-install-peers=true
shamefully-hoist=false
strict-peer-dependencies=false
engine-strict=true
prefer-frozen-lockfile=true
prefer-offline=true
```

### 4. Git Configuration

#### .gitignore
Excludes npm and yarn lock files:
```
package-lock.json
yarn.lock
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

#### .npmignore
Prevents accidental npm publishing and reinforces pnpm usage.

### 5. Validation Script

`scripts/check-pnpm.js` validates:
- pnpm-lock.yaml exists
- package-lock.json and yarn.lock don't exist
- pnpm is installed globally

### 6. CI/CD Enforcement

GitHub Actions workflow (`/.github/workflows/ci.yml`):
- Checks for forbidden lock files
- Uses pnpm for all operations
- Fails if npm/yarn lock files are detected

### 7. VS Code Configuration

`.vscode/settings.json`:
- Sets pnpm as the default package manager
- Excludes npm/yarn lock files from file explorer
- Configures TypeScript and Tailwind CSS

## Getting Started

### Prerequisites

1. **Install Node.js** (>= 18.0.0):
   ```bash
   # Using nvm (recommended)
   nvm install 18
   nvm use 18
   ```

2. **Install pnpm** (>= 9.0.0):
   ```bash
   npm install -g pnpm
   ```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd senseiiwyze-dashboard

# Install dependencies
pnpm install

# Verify pnpm usage
pnpm run check-pnpm
```

### Development Commands

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Run linting
pnpm lint
```

## Troubleshooting

### Common Issues

#### 1. "pnpm command not found"
```bash
npm install -g pnpm
```

#### 2. "package-lock.json detected" error
```bash
rm package-lock.json
pnpm install
```

#### 3. "yarn.lock detected" error
```bash
rm yarn.lock
pnpm install
```

#### 4. "pnpm-lock.yaml not found" error
```bash
pnpm install
```

### Migration from npm/yarn

If you have existing npm or yarn lock files:

1. **Delete existing lock files**:
   ```bash
   rm package-lock.json yarn.lock
   ```

2. **Delete node_modules**:
   ```bash
   rm -rf node_modules
   ```

3. **Install with pnpm**:
   ```bash
   pnpm install
   ```

4. **Verify installation**:
   ```bash
   pnpm run check-pnpm
   ```

## Best Practices

### For Developers

1. **Always use pnpm commands**:
   ```bash
   pnpm add <package>     # Instead of npm install <package>
   pnpm remove <package>  # Instead of npm uninstall <package>
   pnpm update           # Instead of npm update
   ```

2. **Commit pnpm-lock.yaml**:
   - Always commit `pnpm-lock.yaml`
   - Never commit `package-lock.json` or `yarn.lock`

3. **Use pnpm scripts**:
   ```bash
   pnpm dev    # Instead of npm run dev
   pnpm test   # Instead of npm test
   pnpm build  # Instead of npm run build
   ```

### For CI/CD

1. **Use pnpm in workflows**:
   ```yaml
   - name: Install pnpm
     uses: pnpm/action-setup@v4
     with:
       version: 9
   
   - name: Install dependencies
     run: pnpm install --frozen-lockfile
   ```

2. **Cache pnpm store**:
   ```yaml
   - name: Get pnpm store directory
     run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
   
   - name: Setup pnpm cache
     uses: actions/cache@v4
     with:
       path: ${{ env.STORE_PATH }}
       key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
   ```

## Monitoring and Enforcement

### Pre-commit Hooks

Consider adding a pre-commit hook to run `pnpm run check-pnpm`:

```bash
# Install husky
pnpm add -D husky

# Add pre-commit hook
npx husky add .husky/pre-commit "pnpm run check-pnpm"
```

### IDE Integration

Most IDEs support pnpm configuration:

- **VS Code**: Uses `.vscode/settings.json`
- **WebStorm**: Configure in Settings > Languages & Frameworks > Node.js
- **Vim/Neovim**: Use appropriate plugins for pnpm support

## Security Considerations

1. **Lock file integrity**: pnpm-lock.yaml provides better security guarantees
2. **Dependency resolution**: Stricter dependency resolution prevents supply chain attacks
3. **Audit**: Use `pnpm audit` for security scanning

## Performance Benefits

1. **Faster installation**: pnpm is significantly faster than npm
2. **Disk space efficiency**: Shared dependencies reduce disk usage
3. **Better caching**: More efficient caching mechanisms

## Support

If you encounter issues with pnpm enforcement:

1. Check this documentation
2. Run `pnpm run check-pnpm` for diagnostics
3. Review the error messages for specific guidance
4. Ensure you're using the correct Node.js and pnpm versions 