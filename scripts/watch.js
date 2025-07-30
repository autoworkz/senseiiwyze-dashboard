const chokidar = require('chokidar');
const { execa } = require('execa');

let nextProcess = null;
let isRestarting = false;

// Function to handle process cleanup
const handleExit = () => {
  const cleanup = async () => {
    console.log('\nShutting down gracefully...');
    if (nextProcess) {
      nextProcess.kill('SIGTERM');
      await nextProcess.catch(() => {}); // Ignore exit errors
    }
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

// Function to start Next.js process
const startNextProcess = async () => {
  console.log('Starting Next.js dev server...');
  try {
    const subprocess = execa('pnpm', ['dev', '--turbo'], {
      stdio: 'inherit',
      shell: true,
    });
    
    subprocess.on('error', (error) => {
      console.error('Failed to start Next.js process:', error);
    });
    
    subprocess.on('exit', (code) => {
      if (code !== 0 && !isRestarting) {
        console.error(`Next.js process exited with code ${code}`);
      }
    });
    
    return subprocess;
  } catch (error) {
    console.error('Error starting Next.js process:', error);
    process.exit(1);
  }
};

// Initialize
(async () => {
  // Start Next.js process
  nextProcess = await startNextProcess();
  
  // Setup exit handlers
  handleExit();
  
  console.log('Watching for file changes...');
  
  // Watch for changes in src, pages, and components directories (hot-reload)
  const hotReloadWatcher = chokidar.watch(
    ['src/**/*', 'pages/**/*', 'components/**/*'],
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
    }
  );
  
  hotReloadWatcher.on('change', (path) => {
    console.log(`[Hot-reload] File changed: ${path}`);
    if (nextProcess && nextProcess.pid && !nextProcess.killed) {
      try {
        process.kill(nextProcess.pid, 'SIGUSR2');
      } catch (error) {
        console.error('Failed to send SIGUSR2:', error.message);
      }
    }
  });
  
  // Watch for changes that require restart
  const restartWatcher = chokidar.watch(
    ['node_modules/**', 'package.json', '.next/**'],
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      depth: 1, // Limit depth for performance
    }
  );
  
  restartWatcher.on('change', async (path) => {
    if (isRestarting) return;
    
    console.log(`[Restart required] File changed: ${path}`);
    isRestarting = true;
    
    try {
      // Kill existing process
      if (nextProcess && !nextProcess.killed) {
        nextProcess.kill('SIGTERM');
        await nextProcess.catch(() => {}); // Ignore exit errors
      }
      
      // Start new process
      nextProcess = await startNextProcess();
      isRestarting = false;
    } catch (error) {
      console.error('Error restarting Next.js process:', error);
      isRestarting = false;
    }
  });
  
  // Handle watcher errors
  hotReloadWatcher.on('error', error => console.error('Hot-reload watcher error:', error));
  restartWatcher.on('error', error => console.error('Restart watcher error:', error));
})();

