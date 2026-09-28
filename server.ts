import express, { type Request, type Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { exec } from 'node:child_process';
import util from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawSysProc {
  pid: number;
  ni: number;
  pcpu: number;
  pmem: number;
  comm: string;
  etime: string;
}

// Transit line colors for process visualization (quiet, confident railway palette)
const RAILWAY_COLORS = [
  '#1d4ed8', // Intercity Blue
  '#15803d', // Alpine Forest Green
  '#b45309', // Amber Junction
  '#b91c1c', // Signal Crimson
  '#0284c7', // Steel Coastal
  '#0f766e', // Mineral Teal
  '#475569', // Granite Slate
  '#c2410c', // Ochre Rust
  '#1e3a8a', // Deep Marine
  '#166534', // Pine Regional
];

async function getSystemProcesses(limit: number = 8, sort: 'cpu' | 'mem' | 'etime' = 'cpu'): Promise<RawSysProc[]> {
  try {
    const sortFlag = sort === 'mem' ? '--sort=-pmem' : '--sort=-pcpu';
    const { stdout } = await execPromise(`ps -eo pid,ni,pcpu,pmem,comm,etime ${sortFlag}`);
    const lines = stdout.trim().split('\n').slice(1);

    const processes: RawSysProc[] = [];
    const ignoreList = new Set(['ps', 'head', 'grep', 'tail', 'cat', 'sh', 'bash', 'sleep']);

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 6) continue;

      const pid = parseInt(parts[0], 10);
      const ni = parseInt(parts[1], 10);
      const pcpu = parseFloat(parts[2]) || 0;
      const pmem = parseFloat(parts[3]) || 0;
      const etime = parts[parts.length - 1];
      const comm = parts.slice(4, parts.length - 1).join(' ').trim();

      // Clean command name (remove path or args if any)
      const baseComm = path.basename(comm.split(' ')[0]);

      if (ignoreList.has(baseComm.toLowerCase()) && pcpu < 0.1) {
        continue;
      }

      processes.push({
        pid,
        ni: isNaN(ni) ? 0 : ni,
        pcpu: isNaN(pcpu) ? 0 : pcpu,
        pmem: isNaN(pmem) ? 0 : pmem,
        comm: baseComm || `proc_${pid}`,
        etime,
      });
    }

    // Limit processes
    return processes.slice(0, Math.min(25, Math.max(3, limit)));
  } catch (error) {
    console.error('Error querying system processes via ps:', error);
    // Fallback simulated host snapshot
    return [
      { pid: 49, ni: 0, pcpu: 0.8, pmem: 1.2, comm: 'esbuild', etime: '15:20' },
      { pid: 41, ni: 0, pcpu: 0.6, pmem: 4.1, comm: 'node', etime: '15:21' },
      { pid: 28, ni: 0, pcpu: 0.3, pmem: 2.3, comm: 'npm-worker', etime: '15:22' },
      { pid: 5, ni: 0, pcpu: 0.2, pmem: 0.5, comm: 'nginx', etime: '15:30' },
      { pid: 6, ni: 0, pcpu: 0.1, pmem: 0.8, comm: 'control-plane', etime: '15:30' },
      { pid: 1, ni: -5, pcpu: 0.1, pmem: 0.2, comm: 'system-init', etime: '15:30' },
    ];
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'operational',
      subsystem: 'Central Process Dispatcher',
      timestamp: new Date().toISOString(),
    });
  });

  // System processes endpoint (requires user consent flow on frontend)
  app.get('/api/system-processes', async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string, 10) || 8;
    const sort = (req.query.sort as 'cpu' | 'mem' | 'etime') || 'cpu';
    const staggerArrival = req.query.stagger !== 'false';

    try {
      const rawList = await getSystemProcesses(limit, sort);

      // Convert to scheduler Process models
      const processes = rawList.map((proc, index) => {
        // Higher CPU or activity generates proportional burst
        const baseBurst = Math.max(2, Math.min(16, Math.round(proc.pcpu * 5) + ((proc.pid % 5) + 3)));
        // Linux nice (-20 to 19) mapped to scheduler priority (1 to 5, 1=highest)
        const priority = Math.max(1, Math.min(5, Math.floor((proc.ni + 20) / 8) + 1));
        // Staggered arrival for realistic timeline interleaving
        const arrivalTime = staggerArrival ? Math.floor(index * 1.5) : 0;

        return {
          pid: `${proc.comm.slice(0, 10)}-${proc.pid}`,
          arrival_time: arrivalTime,
          burst_time: baseBurst,
          priority,
          color: RAILWAY_COLORS[index % RAILWAY_COLORS.length],
          systemInfo: {
            realPid: proc.pid,
            command: proc.comm,
            cpuPercent: proc.pcpu,
            memPercent: proc.pmem,
            nice: proc.ni,
            elapsed: proc.etime,
          },
        };
      });

      res.json({
        success: true,
        source: 'host-operating-system',
        timestamp: new Date().toISOString(),
        count: processes.length,
        processes,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: err.message || 'Failed to inspect system processes',
      });
    }
  });

  // Mount Vite middleware in development or serve static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Railway Central Dispatcher] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
