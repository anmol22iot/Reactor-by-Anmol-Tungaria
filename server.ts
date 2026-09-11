import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  advanceMissionStep,
  approveHumanOverride,
  getInitialStateForChaos,
  INITIAL_MISSION_STATE,
} from './src/engine/reactorEngine.js';
import { ChaosMode, MissionState } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory mission state for backend
let currentMissionState: MissionState = { ...INITIAL_MISSION_STATE };

// Lazy initialize Gemini client on server
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// REST API Endpoints for Reactor Operational Engine
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    engine: 'REACTOR Operational Recovery Engine',
    version: '2.4 Autonomous',
    time: new Date().toISOString(),
  });
});

app.get('/api/mission/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    state: currentMissionState,
  });
});

app.post('/api/mission/reset', (req: Request, res: Response) => {
  const chaos = (req.body?.chaosMode as ChaosMode) || currentMissionState.chaosMode || 'supplier_failure';
  currentMissionState = getInitialStateForChaos(chaos);
  res.json({
    success: true,
    state: currentMissionState,
  });
});

app.post('/api/mission/chaos', (req: Request, res: Response) => {
  const mode = req.body?.chaosMode as ChaosMode;
  if (!mode) {
    return res.status(400).json({ error: 'chaosMode is required' });
  }
  currentMissionState = getInitialStateForChaos(mode);
  res.json({
    success: true,
    message: `Chaos Mode configured to: ${mode}`,
    state: currentMissionState,
  });
});

app.post('/api/mission/step', (req: Request, res: Response) => {
  currentMissionState = advanceMissionStep(currentMissionState);
  res.json({
    success: true,
    state: currentMissionState,
  });
});

app.post('/api/mission/approve', (req: Request, res: Response) => {
  currentMissionState = approveHumanOverride(currentMissionState);
  res.json({
    success: true,
    message: 'Supervisor human-in-the-loop override authorized',
    state: currentMissionState,
  });
});

// AI Agent Cognitive Reasoning Endpoint using Gemini 3.8 Flash (if key present) or deterministic telemetry
app.post('/api/mission/gemini-reason', async (req: Request, res: Response) => {
  const { prompt, state } = req.body;
  const client = getGeminiClient();

  if (client) {
    try {
      const systemInstruction = `You are REACTOR's internal cognitive controller and real-time operational reasoning agent. 
Analyze the operational state, supplier failure anomaly, and recovery strategy concisely and authoritatively.
Focus on closed-loop resilience, mathematical budget verification, carrier SLA fulfillment, and zero-human-lag autonomous replanning.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Current Mission Objective: ${state?.goal || currentMissionState.goal}
Phase: ${state?.phase || currentMissionState.phase}
Anomaly: ${state?.triggeringAnomaly || currentMissionState.triggeringAnomaly || 'None'}
Spend vs Budget: ₹${state?.actualSpend || currentMissionState.actualSpend} / ₹${state?.budgetCap || currentMissionState.budgetCap}
User Request: ${prompt || 'Provide cognitive analysis of the recovery formulation.'}`,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return res.json({
        success: true,
        source: 'gemini-3.8-flash',
        analysis: response.text || 'Cognitive policy verified: Multi-supplier hedge maintains 100% order volume with ₹1,200 surplus.',
      });
    } catch (err: any) {
      console.warn('Gemini inference fallback:', err?.message);
    }
  }

  // High-fidelity autonomous simulation fallback
  res.json({
    success: true,
    source: 'deterministic-cognitive-policy',
    analysis: `[REACTOR Autonomous Policy Evaluation]:
1. Failure Root Cause: Supplier A returned HTTP 422 (regional depot capacity limit).
2. Autonomous State Mutation: Supplier A blacklisted from active routing table in 420ms.
3. Replanning Matrix: Selected Supplier B (50 units @ ₹8,000, 17:15 SLA) + Supplier C (35 units @ ₹5,800, 17:30 SLA).
4. Constraint Verification: ₹13,800 combined spend is strictly ≤ ₹15,000 threshold with ₹1,200 reserve preserved.
5. Verifier Verdict: Independent external ERP check confirms 500/500 orders intact before 18:00 cutoff.`,
  });
});

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`REACTOR server online on http://0.0.0.0:${PORT}`);
  });
}

startServer();
