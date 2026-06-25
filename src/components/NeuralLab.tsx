import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sliders, Play, RefreshCw, Terminal, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MetricPoint {
  epoch: number;
  loss: number;
  acc: number;
}

export default function NeuralLab() {
  const [modelType, setModelType] = useState<'cnn' | 'lstm' | 'transformer'>('cnn');
  const [learningRate, setLearningRate] = useState<number>(0.01);
  const [epochs, setEpochs] = useState<number>(10);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    '[System] Lab initialized. Choose an architecture, customize hyper-parameters, and execute "Initiate Training Pipeline".'
  ]);
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  
  // Simulated prediction input states
  const [scanSize, setScanSize] = useState<number>(256);
  const [contrast, setContrast] = useState<number>(80);
  const [volatility, setVolatility] = useState<number>(45);
  const [timeSteps, setTimeSteps] = useState<number>(30);
  const [fingers, setFingers] = useState<number>(5);
  const [signingSpeed, setSigningSpeed] = useState<number>(75);
  
  // Inference prediction output state
  const [prediction, setPrediction] = useState<{ result: string; confidence: number } | null>(null);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Handle Training Simulation
  const handleTrain = () => {
    if (isTraining) return;
    setIsTraining(true);
    setCurrentEpoch(0);
    setPrediction(null);
    setMetrics([]);
    setLogs([
      `[System] Launching GPU accelerator cores for Chennai cluster...`,
      `[System] Model Lock: ${modelType.toUpperCase()} neural configuration loaded.`,
      `[System] Hyper-parameters: LR=${learningRate}, Batch Size=${batchSize}, Total Epochs=${epochs}`,
      `[System] Shuffling datasets and initializing weights via Xavier normalization...`
    ]);

    let epoch = 0;
    const history: MetricPoint[] = [];

    const interval = setInterval(() => {
      epoch += 1;
      
      // Calculate realistic loss (descending) and accuracy (ascending) with realistic noise
      const lrModifier = learningRate === 0.01 ? 1.0 : learningRate === 0.1 ? 0.78 : 0.62;
      let loss = 0;
      let acc = 0;

      if (modelType === 'cnn') {
        acc = Math.min(99.5, 68 + (epoch / epochs) * 30 * lrModifier + (Math.random() - 0.5) * 2);
        loss = Math.max(0.012, 0.95 - (epoch / epochs) * 0.92 * lrModifier + (Math.random() - 0.5) * 0.04);
      } else if (modelType === 'lstm') {
        acc = Math.min(98.1, 62 + (epoch / epochs) * 34 * lrModifier + (Math.random() - 0.5) * 3);
        loss = Math.max(0.035, 1.35 - (epoch / epochs) * 1.25 * lrModifier + (Math.random() - 0.5) * 0.06);
      } else { // transformer
        acc = Math.min(99.9, 50 + (epoch / epochs) * 48 * lrModifier + (Math.random() - 0.5) * 1.5);
        loss = Math.max(0.005, 1.85 - (epoch / epochs) * 1.81 * lrModifier + (Math.random() - 0.5) * 0.03);
      }

      const newPoint: MetricPoint = {
        epoch,
        loss: parseFloat(loss.toFixed(4)),
        acc: parseFloat(acc.toFixed(2))
      };

      history.push(newPoint);
      setMetrics([...history]);
      setCurrentEpoch(epoch);
      
      setLogs(prev => [
        ...prev,
        `Epoch [${epoch}/${epochs}] | Train Loss: ${newPoint.loss} | Validation Acc: ${newPoint.acc}%`
      ]);

      if (epoch >= epochs) {
        clearInterval(interval);
        setIsTraining(false);
        setLogs(prev => [
          ...prev,
          `[System] ✓ Training successfully completed in ${(epochs * 0.45).toFixed(2)}s!`,
          `[System] Weights optimized and frozen in production schema.`,
          `[System] Model initialized for real-time inference sandbox.`
        ]);

        // Sparkle confetti!
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#a78bfa', '#10b981', '#3b82f6']
        });
      }
    }, 450);
  };

  // Run Simulated Inference
  const handlePredict = () => {
    if (isTraining || metrics.length === 0) return;
    setIsPredicting(true);
    setPrediction(null);

    setTimeout(() => {
      let result = '';
      let confidence = 0;

      if (modelType === 'cnn') {
        if (contrast > 85 && scanSize > 200) {
          result = 'Glioma Brain Tumor Detected (T1-weighted contrast alert)';
          confidence = 95.8 + Math.random() * 3.5;
        } else if (contrast < 45) {
          result = 'Healthy Scan (No cerebral scan anomalies detected)';
          confidence = 98.4 + Math.random() * 1.3;
        } else {
          result = Math.random() > 0.4 
            ? 'Meningioma Trace Detected (Trace scan hyperintensity)' 
            : 'Unremarkable Clear Brain Scan';
          confidence = 89.2 + Math.random() * 8.5;
        }
      } else if (modelType === 'lstm') {
        if (volatility > 70) {
          result = 'Bearish Breakout (High Volatility Squeeze Pattern)';
          confidence = 81.2 + Math.random() * 6.8;
        } else if (volatility < 30 && timeSteps > 40) {
          result = 'Bullish Expansion (Stable Accumulation Support Level)';
          confidence = 91.5 + Math.random() * 5.2;
        } else {
          result = Math.random() > 0.5 
            ? 'Consolidation Phase (Sideways Market Range)' 
            : 'Moderate Bullish Trend Baseline';
          confidence = 84.0 + Math.random() * 9.5;
        }
      } else { // transformer
        if (fingers === 5 && signingSpeed > 80) {
          result = 'Recognized Gesture: "GREETING / WELCOME" (Class 14)';
          confidence = 97.2 + Math.random() * 2.2;
        } else if (fingers === 2) {
          result = 'Recognized Gesture: "PEACE / COMPASSION" (Class 3)';
          confidence = 98.9 + Math.random() * 0.9;
        } else if (fingers === 0) {
          result = 'Recognized Gesture: "HALT / STOP SIGNAL" (Class 1)';
          confidence = 97.8 + Math.random() * 1.8;
        } else {
          result = 'Recognized Gesture: "ALPHABETIC SPELLING CHORD"';
          confidence = 86.5 + Math.random() * 10;
        }
      }

      setPrediction({
        result,
        confidence: parseFloat(confidence.toFixed(2))
      });
      setIsPredicting(false);
    }, 750);
  };

  // Helper to generate SVG Chart paths
  const getSvgPath = (type: 'loss' | 'acc') => {
    if (metrics.length === 0) return '';
    const width = 280;
    const height = 110;
    const padding = 10;
    
    const usableW = width - padding * 2;
    const usableH = height - padding * 2;
    
    const maxVal = type === 'acc' ? 100 : 2.0;

    return metrics.map((p, i) => {
      const x = padding + (i / (epochs - 1)) * usableW;
      const val = type === 'acc' ? p.acc : p.loss;
      // Invert Y coordinate for SVG
      const y = padding + usableH - (val / maxVal) * usableH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <section className="py-20 px-6 w-full max-w-5xl scroll-mt-20">
      <div className="space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-violet-400 text-xs font-mono uppercase tracking-widest block mb-2">// INTELLECTUAL PLAYGROUND</span>
          <h2 
            className="text-4xl sm:text-5xl text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Neural Laboratory & Epoch Simulator
          </h2>
          <p className="text-zinc-400 font-light mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Test and simulate custom deep learning pipelines directly in the cloud. Run live-epochs, visualize accuracy convergence, and execute prediction tests.
          </p>
        </div>

        {/* Bento Grid Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Column 1: Configuration Deck (4/12) */}
          <div className="lg:col-span-4 liquid-glass rounded-3xl p-6 border border-white/5 bg-zinc-950/20 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sliders size={16} className="text-violet-400" />
                <h3 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Hyper-Parameters</h3>
              </div>

              {/* Model Choice */}
              <div className="space-y-2 mb-5">
                <label className="block text-[10px] font-mono text-zinc-500 uppercase">1. Neural Architecture</label>
                <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                  {(['cnn', 'lstm', 'transformer'] as const).map((model) => (
                    <button
                      key={model}
                      onClick={() => !isTraining && setModelType(model)}
                      disabled={isTraining}
                      className={`py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all uppercase cursor-pointer ${
                        modelType === model
                          ? 'bg-violet-500/10 text-violet-300 border border-violet-500/30 font-semibold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 text-xs font-mono">
                {/* Learning Rate */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 text-[10px] uppercase">2. Learning Rate (α)</span>
                    <span className="text-violet-400 font-bold">{learningRate}</span>
                  </div>
                  <div className="flex gap-2">
                    {[0.001, 0.01, 0.1].map((lr) => (
                      <button
                        key={lr}
                        onClick={() => !isTraining && setLearningRate(lr)}
                        disabled={isTraining}
                        className={`flex-1 py-1 rounded border cursor-pointer text-center text-[10px] ${
                          learningRate === lr 
                            ? 'bg-violet-400/10 border-violet-400/40 text-violet-300' 
                            : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {lr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Epochs */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 text-[10px] uppercase">3. Total Training Epochs</span>
                    <span className="text-violet-400 font-bold">{epochs}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="1"
                    value={epochs}
                    disabled={isTraining}
                    onChange={(e) => setEpochs(parseInt(e.target.value))}
                    className="w-full accent-violet-400 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Batch Size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 text-[10px] uppercase">4. Mini-Batch Size</span>
                    <span className="text-violet-400 font-bold">{batchSize}</span>
                  </div>
                  <div className="flex gap-2">
                    {[16, 32, 64].map((bs) => (
                      <button
                        key={bs}
                        onClick={() => !isTraining && setBatchSize(bs)}
                        disabled={isTraining}
                        className={`flex-1 py-1 rounded border cursor-pointer text-center text-[10px] ${
                          batchSize === bs 
                            ? 'bg-violet-400/10 border-violet-400/40 text-violet-300' 
                            : 'bg-white/5 border-transparent text-zinc-400 hover:bg-white/10'
                        }`}
                      >
                        {bs}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Train Button */}
            <button
              onClick={handleTrain}
              disabled={isTraining}
              className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer border transition-all ${
                isTraining
                  ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                  : 'bg-white text-black border-white hover:bg-zinc-200'
              }`}
            >
              {isTraining ? (
                <>
                  <RefreshCw className="animate-spin" size={14} />
                  <span>Computing Epoch {currentEpoch}/{epochs}...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" />
                  <span>Execute Training Pipeline</span>
                </>
              )}
            </button>
          </div>

          {/* Column 2: Graphing & Live Console (5/12) */}
          <div className="lg:col-span-5 liquid-glass rounded-3xl p-6 border border-white/5 bg-zinc-950/20 flex flex-col gap-5 justify-between">
            
            {/* Loss / Acc Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-violet-400" />
                  <h3 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Metrics Panel</h3>
                </div>
                <div className="flex gap-4 text-[9px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" /> Accuracy
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full inline-block" /> Loss
                  </span>
                </div>
              </div>

              {/* Custom SVG Line Chart */}
              <div className="h-28 w-full bg-black/40 rounded-xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                {metrics.length === 0 ? (
                  <span className="text-[10px] font-mono text-zinc-600 animate-pulse text-center px-4">
                    Chart offline. Awaiting pipeline compilation.
                  </span>
                ) : (
                  <svg className="w-full h-full p-2" viewBox="0 0 280 110" preserveAspectRatio="none">
                    {/* ACCURACY PATH */}
                    <motion.path
                      d={getSvgPath('acc')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    {/* LOSS PATH */}
                    <motion.path
                      d={getSvgPath('loss')}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Live Terminal Log */}
            <div className="flex flex-col flex-1 min-h-[140px] space-y-2">
              <div className="flex items-center gap-1.5">
                <Terminal size={14} className="text-violet-400" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase">GPU Console Stack</span>
              </div>
              <div className="flex-1 bg-black/50 border border-white/5 p-3 rounded-xl overflow-y-auto font-mono text-[10px] text-zinc-400 space-y-1.5 custom-scrollbar h-36">
                {logs.map((log, i) => (
                  <div key={i} className="leading-normal whitespace-pre-wrap">
                    {log.startsWith('✓') ? (
                      <span className="text-emerald-400 font-semibold">{log}</span>
                    ) : log.includes('Loss:') ? (
                      <span className="text-zinc-300">{log}</span>
                    ) : (
                      <span className="text-zinc-500">{log}</span>
                    )}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

          </div>

          {/* Column 3: Live Inference Deck (3/12) */}
          <div className="lg:col-span-3 liquid-glass rounded-3xl p-6 border border-white/5 bg-zinc-950/20 flex flex-col justify-between gap-6 relative overflow-hidden group">
            {metrics.length === 0 && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-10 transition-all">
                <Cpu size={24} className="text-zinc-600 mb-2 animate-bounce" />
                <h4 className="text-xs font-mono text-zinc-300 uppercase tracking-wide">Inference Blocked</h4>
                <p className="text-[10px] text-zinc-500 font-light mt-1.5 leading-relaxed">
                  You must train the selected network model once to load optimized weights into the sandbox.
                </p>
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={16} className="text-violet-400" />
                <h3 className="text-xs font-mono text-zinc-300 uppercase tracking-wider">Inference Deck</h3>
              </div>

              {/* Dynamic inputs based on selected architecture */}
              <div className="space-y-4">
                {modelType === 'cnn' && (
                  <>
                    {/* CNN Input 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Scan Size</span>
                        <span className="text-violet-400">{scanSize} px</span>
                      </div>
                      <input
                        type="range"
                        min="128"
                        max="512"
                        step="64"
                        value={scanSize}
                        onChange={(e) => setScanSize(parseInt(e.target.value))}
                        className="w-full accent-violet-400 h-1 bg-white/5 rounded"
                      />
                    </div>
                    {/* CNN Input 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Contrast Gain</span>
                        <span className="text-violet-400">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value))}
                        className="w-full accent-violet-400 h-1 bg-white/5 rounded"
                      />
                    </div>
                  </>
                )}

                {modelType === 'lstm' && (
                  <>
                    {/* LSTM Input 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Index Volatility</span>
                        <span className="text-violet-400">{volatility}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={volatility}
                        onChange={(e) => setVolatility(parseInt(e.target.value))}
                        className="w-full accent-violet-400 h-1 bg-white/5 rounded"
                      />
                    </div>
                    {/* LSTM Input 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>History Range</span>
                        <span className="text-violet-400">{timeSteps} days</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        step="10"
                        value={timeSteps}
                        onChange={(e) => setTimeSteps(parseInt(e.target.value))}
                        className="w-full accent-violet-400 h-1 bg-white/5 rounded"
                      />
                    </div>
                  </>
                )}

                {modelType === 'transformer' && (
                  <>
                    {/* Transformer Input 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Active Fingers</span>
                        <span className="text-violet-400">{fingers}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="1"
                        value={fingers}
                        onChange={(e) => setFingers(parseInt(e.target.value))}
                        className="w-full accent-violet-400 h-1 bg-white/5 rounded"
                      />
                    </div>
                    {/* Transformer Input 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Signing Velocity</span>
                        <span className="text-violet-400">{signingSpeed} wpm</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="150"
                        step="5"
                        value={signingSpeed}
                        onChange={(e) => setSigningSpeed(parseInt(e.target.value))}
                        className="w-full accent-violet-400 h-1 bg-white/5 rounded"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Prediction Area */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {prediction && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-[11px] font-mono text-left space-y-2.5"
                  >
                    <div>
                      <span className="text-zinc-500 text-[9px] uppercase tracking-wider block mb-0.5">Prediction Result</span>
                      <span className="text-white font-medium block leading-snug">{prediction.result}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] uppercase tracking-wider mb-1 text-zinc-500">
                        <span>Confidence Vector</span>
                        <span className="text-emerald-400 font-semibold">{prediction.confidence}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-emerald-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.confidence}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={handlePredict}
                disabled={isPredicting || isTraining}
                className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-wider cursor-pointer border transition-all ${
                  isPredicting
                    ? 'bg-violet-500/5 border-violet-500/20 text-violet-400'
                    : 'bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:border-white'
                }`}
              >
                {isPredicting ? (
                  <>
                    <RefreshCw className="animate-spin" size={12} />
                    <span>Analyzing Scan Vectors...</span>
                  </>
                ) : (
                  <span>Evaluate Live Sample</span>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
