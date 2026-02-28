'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { Activity, Gauge, Thermometer, Battery, Car, Radio, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';

// Mock Data Generator (Based on your Hyundai-VDO format)
const MODELS = ["Hyundai-VDO", "Toyota-TPMS", "Ford-TPMS", "Schrader-EVO", "Continental-G5"];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const generateMockData = () => {
  const sensors = [
    { id: 'd086e278', pos: 'Front Left' },
    { id: 'd086e279', pos: 'Front Right' },
    { id: 'd086e280', pos: 'Rear Left' },
    { id: 'd086e281', pos: 'Rear Right' }
  ];
  
  const selectedModel = MODELS[Math.floor(Math.random() * MODELS.length)];
  
  return sensors.map(s => ({
    time: new Date().toLocaleTimeString(),
    model: selectedModel,
    id: s.id,
    position: s.pos,
    pressure_kPa: (215 + Math.random() * 5).toFixed(2),
    temperature_C: (28 + Math.random() * 4).toFixed(1),
    maybe_battery: 56,
    rssi: -Math.floor(Math.random() * 40 + 50) // Signal strength simulation
  }));
};

const RFDashboard = () => {
  const [data, setData] = useState(generateMockData());
  const [modelCounts, setModelCounts] = useState({});

  // Simulate incoming live RF packets
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateMockData();
      setData(prev => [...prev.slice(-30), ...newData]);
      
      // Update model counts for distribution
      const model = newData[0].model;
      setModelCounts(prev => ({
        ...prev,
        [model]: (prev[model] || 0) + 1
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const distributionData = useMemo(() => {
    return Object.keys(modelCounts).map((model, index) => ({
      name: model,
      count: modelCounts[model],
      fill: COLORS[index % COLORS.length]
    })).sort((a, b) => b.count - a.count);
  }, [modelCounts]);

  const currentTires = data.slice(-4);
  const totalVehiclesObserved = Object.values(modelCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Radio className="text-blue-400" /> RF Tire Intelligence
          </h1>
          <p className="text-slate-400 text-sm">Monitoring ISM 433.92MHz / 315MHz</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-500 block">ACTIVE SENSORS</span>
            <span className="text-xl font-mono text-green-400">04</span>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-500 block">EST. VEHICLES</span>
            <span className="text-xl font-mono text-blue-400">{String(totalVehiclesObserved).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Live Sensor Feed & Model Distribution */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-semibold flex items-center gap-2"><Activity size={18}/> Incoming Packets</h2>
              <span className="animate-pulse h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div className="p-4 space-y-3 h-[300px] overflow-y-auto">
              {data.slice().reverse().map((packet, i) => (
                <div key={i} className="text-xs font-mono p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                  <span className="text-blue-400">[{packet.time}]</span> {packet.model} ID:{packet.id} | {packet.pressure_kPa}kPa | {packet.rssi}dBm
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-sm text-slate-400"><PieChartIcon size={16}/> Model Distribution</h2>
              <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-wider">Total: {totalVehiclesObserved}</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    stroke="#94a3b8" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{backgroundColor: '#0f172a', border: '#1e293b', fontSize: '12px'}}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Mid/Right Col: Vehicle Visualization & Graphs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vehicle Status Card */}
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                <Car size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Vehicle Cluster: {currentTires[0]?.model || 'Scanning...'} Group</h2>
                <p className="text-slate-400 text-sm">Target ID Range: {currentTires[0]?.id || '...'} - {currentTires[3]?.id || '...'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentTires.map((tire, i) => (
                <div key={i} className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest">{tire.position}</span>
                  <div className="my-2 flex justify-center text-blue-400">
                    <Gauge size={20} />
                  </div>
                  <div className="text-xl font-bold">{Math.round(tire.pressure_kPa * 0.145038)} <span className="text-sm font-normal text-slate-500">PSI</span></div>
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mt-1">
                    <Thermometer size={12}/> {tire.temperature_C}°C
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphs Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-semibold mb-4 text-slate-400">Pressure Stability (kPa)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.filter(d => d.id === currentTires[0]?.id)}>
                    <defs>
                      <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '#1e293b'}} />
                    <Area type="monotone" dataKey="pressure_kPa" stroke="#3b82f6" fillOpacity={1} fill="url(#colorP)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-semibold mb-4 text-slate-400">Signal Strength (RSSI)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.filter(d => d.id === currentTires[0]?.id)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[-100, -30]} />
                    <Tooltip />
                    <Line type="stepAfter" dataKey="rssi" stroke="#10b981" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RFDashboard;