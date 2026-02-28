'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { Activity, Gauge, Thermometer, Battery, Car, Radio, AlertTriangle, PieChart as PieChartIcon, History, Database, FlaskConical } from 'lucide-react';

// Brand & Logo Mapping using Brandfetch Logo API
const PUBLIC_KEY = '1idBq3T9KsMrIZ385yb';
const BRANDS = [
  { name: "Hyundai", logo: `https://cdn.brandfetch.io/hyundai.com?c=${PUBLIC_KEY}` },
  { name: "Toyota", logo: `https://cdn.brandfetch.io/toyota.com?c=${PUBLIC_KEY}` },
  { name: "Ford", logo: `https://cdn.brandfetch.io/ford.com?c=${PUBLIC_KEY}` },
  { name: "Chevrolet", logo: `https://cdn.brandfetch.io/chevrolet.com?c=${PUBLIC_KEY}` },
  { name: "Mercedes", logo: `https://cdn.brandfetch.io/mercedes-benz.com?c=${PUBLIC_KEY}` },
  { name: "BMW", logo: `https://cdn.brandfetch.io/bmw.com?c=${PUBLIC_KEY}` },
  { name: "Audi", logo: `https://cdn.brandfetch.io/audi.com?c=${PUBLIC_KEY}` },
  { name: "Tesla", logo: `https://cdn.brandfetch.io/tesla.com?c=${PUBLIC_KEY}` },
  { name: "Honda", logo: `https://cdn.brandfetch.io/honda.com?c=${PUBLIC_KEY}` },
  { name: "Nissan", logo: `https://cdn.brandfetch.io/nissan-global.com?c=${PUBLIC_KEY}` },
  { name: "Volkswagen", logo: `https://cdn.brandfetch.io/vw.com?c=${PUBLIC_KEY}` },
  { name: "Kia", logo: `https://cdn.brandfetch.io/kia.com?c=${PUBLIC_KEY}` },
  { name: "Mazda", logo: `https://cdn.brandfetch.io/mazda.com?c=${PUBLIC_KEY}` },
  { name: "Subaru", logo: `https://cdn.brandfetch.io/subaru.com?c=${PUBLIC_KEY}` },
  { name: "Lexus", logo: `https://cdn.brandfetch.io/lexus.com?c=${PUBLIC_KEY}` },
  { name: "Porsche", logo: `https://cdn.brandfetch.io/porsche.com?c=${PUBLIC_KEY}` },
  { name: "Ferrari", logo: `https://cdn.brandfetch.io/ferrari.com?c=${PUBLIC_KEY}` },
  { name: "Lamborghini", logo: `https://cdn.brandfetch.io/lamborghini.com?c=${PUBLIC_KEY}` },
  { name: "Jeep", logo: `https://cdn.brandfetch.io/jeep.com?c=${PUBLIC_KEY}` },
  { name: "Dodge", logo: `https://cdn.brandfetch.io/dodge.com?c=${PUBLIC_KEY}` },
  { name: "Volvo", logo: `https://cdn.brandfetch.io/volvocars.com?c=${PUBLIC_KEY}` },
  { name: "Land Rover", logo: `https://cdn.brandfetch.io/landrover.com?c=${PUBLIC_KEY}` },
  { name: "Jaguar", logo: `https://cdn.brandfetch.io/jaguar.com?c=${PUBLIC_KEY}` },
  { name: "Mitsubishi", logo: `https://cdn.brandfetch.io/mitsubishi-motors.com?c=${PUBLIC_KEY}` },
  { name: "Cadillac", logo: `https://cdn.brandfetch.io/cadillac.com?c=${PUBLIC_KEY}` },
  { name: "GMC", logo: `https://cdn.brandfetch.io/gmc.com?c=${PUBLIC_KEY}` },
  { name: "Ram", logo: `https://cdn.brandfetch.io/ramtrucks.com?c=${PUBLIC_KEY}` },
  { name: "Chrysler", logo: `https://cdn.brandfetch.io/chrysler.com?c=${PUBLIC_KEY}` },
  { name: "Fiat", logo: `https://cdn.brandfetch.io/fiat.com?c=${PUBLIC_KEY}` },
  { name: "Alfa Romeo", logo: `https://cdn.brandfetch.io/alfaromeo.com?c=${PUBLIC_KEY}` },
  { name: "Bentley", logo: `https://cdn.brandfetch.io/bentleymotors.com?c=${PUBLIC_KEY}` },
  { name: "Rolls-Royce", logo: `https://cdn.brandfetch.io/rolls-royce.com?c=${PUBLIC_KEY}` },
  { name: "Aston Martin", logo: `https://cdn.brandfetch.io/astonmartin.com?c=${PUBLIC_KEY}` },
  { name: "McLaren", logo: `https://cdn.brandfetch.io/mclaren.com?c=${PUBLIC_KEY}` },
  { name: "Mini", logo: `https://cdn.brandfetch.io/mini.com?c=${PUBLIC_KEY}` },
  { name: "Infiniti", logo: `https://cdn.brandfetch.io/infiniti.com?c=${PUBLIC_KEY}` },
  { name: "Acura", logo: `https://cdn.brandfetch.io/acura.com?c=${PUBLIC_KEY}` },
  { name: "Rivian", logo: `https://cdn.brandfetch.io/rivian.com?c=${PUBLIC_KEY}` },
  { name: "Lucid", logo: `https://cdn.brandfetch.io/lucidmotors.com?c=${PUBLIC_KEY}` },
  { name: "Polestar", logo: `https://cdn.brandfetch.io/polestar.com?c=${PUBLIC_KEY}` }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const CustomLogoLabel = React.memo((props) => {
  const { x, y, width, height, value } = props;
  if (!value) return null;
  if (width < 30) return null;
  const size = Math.min(24, Math.max(12, height * 0.75));
  const verticalCenter = y + (height / 2) - (size / 2);
  return (
    <foreignObject x={x + 10} y={verticalCenter} width={size} height={size}>
      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 shadow-sm">
        <img src={value} alt="logo" className="w-full h-full object-contain p-0.5" />
      </div>
    </foreignObject>
  );
});

const generateMockData = () => {
  const sensors = [
    { id: 'd086e278', pos: 'Front Left' },
    { id: 'd086e279', pos: 'Front Right' },
    { id: 'd086e280', pos: 'Rear Left' },
    { id: 'd086e281', pos: 'Rear Right' }
  ];
  
  const selectedBrand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  
  return sensors.map(s => ({
    time: new Date().toLocaleTimeString(),
    model: selectedBrand.name,
    logo: selectedBrand.logo,
    id: s.id,
    position: s.pos,
    pressure_kPa: (215 + Math.random() * 5).toFixed(2),
    temperature_C: (28 + Math.random() * 4).toFixed(1),
    maybe_battery: 56,
    rssi: -Math.floor(Math.random() * 40 + 50)
  }));
};

const RFDashboard = () => {
  const [data, setData] = useState([]);
  const [modelCounts, setModelCounts] = useState({});
  const [recentBrands, setRecentBrands] = useState([]);
  const [packetFrequency, setPacketFrequency] = useState({});
  const [isFastMode, setIsFastMode] = useState(false);
  const [isS3Mode, setIsS3Mode] = useState(true);
  const [error, setError] = useState(null);
  
  const processedKeysRef = useRef(new Set());

  const getFiveMinInterval = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = Math.floor(d.getMinutes() / 5) * 5;
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleModeSwitch = (mode) => {
    setIsS3Mode(mode);
    setData([]);
    setModelCounts({});
    setRecentBrands([]);
    setPacketFrequency({});
    processedKeysRef.current.clear();
  };

  const fetchS3Data = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch S3 data');
      const json = await response.json();
      
      if (json.data && json.data.length > 0) {
        const newObjects = json.data.filter(item => !processedKeysRef.current.has(item.s3Key));
        
        if (newObjects.length === 0) return;

        const rawPackets = newObjects.map(item => {
          processedKeysRef.current.add(item.s3Key);
          
          const packet = item.data || item;
          const brandMatch = BRANDS.find(b => 
            packet.model?.toLowerCase().includes(b.name.toLowerCase())
          ) || BRANDS[0];

          return {
            time: packet.time ? new Date(packet.time).toLocaleTimeString() : new Date().toLocaleTimeString(),
            rawTime: packet.time ? new Date(packet.time) : new Date(),
            model: brandMatch.name,
            logo: brandMatch.logo,
            id: packet.id || 'unknown',
            position: packet.position || 'Unknown',
            pressure_kPa: packet.pressure_kPa || 0,
            temperature_C: packet.temperature_C || 0,
            maybe_battery: packet.maybe_battery || 0,
            rssi: packet.rssi || -70,
            timestamp: Date.now() + Math.random()
          };
        });

        setData(prev => [...prev, ...rawPackets].slice(-50));

        rawPackets.forEach(p => {
          setModelCounts(prev => ({
            ...prev,
            [p.model]: (prev[p.model] || 0) + 1
          }));
          
          const interval = getFiveMinInterval(p.rawTime);
          setPacketFrequency(prev => ({
            ...prev,
            [interval]: (prev[interval] || 0) + 1
          }));

          setRecentBrands(prev => [{ brand: p.model, logo: p.logo, timestamp: p.timestamp }, ...prev.slice(0, 11)]);
        });
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const intervalTime = isFastMode ? 800 : 3000;
    
    if (!isS3Mode && data.length === 0) {
      const initial = generateMockData();
      setData(initial);
      const brand = initial[0].model;
      const logo = initial[0].logo;
      setModelCounts({ [brand]: initial.length });
      setRecentBrands([{ brand, logo, timestamp: Date.now() }]);
      const interval = getFiveMinInterval(new Date());
      setPacketFrequency({ [interval]: initial.length });
    }

    const interval = setInterval(() => {
      if (isS3Mode) {
        fetchS3Data();
      } else {
        const newData = generateMockData();
        setData(prev => [...prev.slice(-30), ...newData]);
        const brand = newData[0].model;
        const logo = newData[0].logo;
        setModelCounts(prev => ({
          ...prev,
          [brand]: (prev[brand] || 0) + 1
        }));
        const timeKey = getFiveMinInterval(new Date());
        setPacketFrequency(prev => ({
          ...prev,
          [timeKey]: (prev[timeKey] || 0) + newData.length
        }));
        setRecentBrands(prev => [{ brand, logo, timestamp: Date.now() }, ...prev.slice(0, 11)]);
      }
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [isFastMode, isS3Mode, data.length]);

  const distributionData = useMemo(() => {
    return Object.keys(modelCounts).map((model, index) => {
      const brandInfo = BRANDS.find(b => b.name === model);
      return {
        name: model,
        count: modelCounts[model],
        fill: COLORS[index % COLORS.length],
        logo: brandInfo?.logo
      };
    }).sort((a, b) => b.count - a.count);
  }, [modelCounts]);

  const frequencyChartData = useMemo(() => {
    return Object.keys(packetFrequency)
      .map(time => ({ time, count: packetFrequency[time] }))
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(-12);
  }, [packetFrequency]);

  const currentTires = data.length >= 4 ? data.slice(-4) : (data.length > 0 ? [data[data.length-1]] : []);
  const totalVehiclesObserved = Object.values(modelCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Radio className="text-blue-400" /> RF Tire Intelligence
          </h1>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            Monitoring ISM 433.92MHz 
            {isS3Mode ? (
              <span className="flex items-center gap-1 text-green-400 text-xs bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                <Database size={10}/> LIVE AWS STREAM
              </span>
            ) : (
              <span className="flex items-center gap-1 text-orange-400 text-xs bg-orange-400/10 px-2 py-0.5 rounded-full border border-orange-400/20">
                <FlaskConical size={10}/> SIMULATED
              </span>
            )}
          </p>
        </div>
        
        <div className="flex-1 max-w-2xl bg-slate-900/50 rounded-full border border-slate-800/50 px-4 py-2 overflow-hidden relative group">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>
          <div className="flex gap-6 items-center animate-in fade-in slide-in-from-right-4 duration-500">
            {recentBrands.map((item, idx) => (
              <div 
                key={item.timestamp + idx} 
                className="flex-shrink-0 flex items-center gap-2 transition-all duration-300"
                style={{ opacity: Math.max(0.2, 1 - idx * 0.15) }}
              >
                <div className="w-8 h-8 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/5">
                  <img src={item.logo} alt={item.brand} className="w-6 h-6 rounded-full aspect-square" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:block">{item.brand}</span>
              </div>
            ))}
            {recentBrands.length === 0 && <span className="text-xs text-slate-600 italic">Waiting for signal...</span>}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => handleModeSwitch(true)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${isS3Mode ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Database size={12}/> S3 Live
            </button>
            <button 
              onClick={() => handleModeSwitch(false)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${!isS3Mode ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <FlaskConical size={12}/> Mock
            </button>
          </div>
          
          <button 
            onClick={() => setIsFastMode(!isFastMode)}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${isFastMode ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
          >
            {isFastMode ? 'Fast Mode ON' : 'Normal Mode'}
          </button>
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-500 block">EST. VEHICLES</span>
            <span className="text-xl font-mono text-blue-400">{String(totalVehiclesObserved).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
          <AlertTriangle size={18} />
          <span>AWS Connection Error: {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-semibold flex items-center gap-2"><Activity size={18}/> Incoming Packets</h2>
              <span className="animate-pulse h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div className="p-4 space-y-3 h-[250px] overflow-y-auto">
              {data.slice().reverse().map((packet, i) => (
                <div key={packet.timestamp || i} className="text-xs font-mono p-2 bg-slate-950 rounded border border-slate-800 text-slate-300">
                  <span className="text-blue-400">[{packet.time}]</span> {packet.model} ID:{packet.id} | {packet.pressure_kPa}kPa | {packet.rssi}dBm
                </div>
              ))}
              {data.length === 0 && <div className="text-slate-600 text-center py-8 italic">No packets detected...</div>}
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <h2 className="font-semibold flex items-center gap-2 text-sm text-slate-400 mb-4"><History size={16}/> Packet Frequency (5m)</h2>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={frequencyChartData}>
                  <defs>
                    <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '#1e293b'}} labelStyle={{color: '#94a3b8'}} itemStyle={{color: '#8b5cf6'}} />
                  <Area type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorFreq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold flex items-center gap-2 text-sm text-slate-400"><PieChartIcon size={16}/> Model Distribution</h2>
              <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase tracking-wider">Total: {totalVehiclesObserved}</span>
            </div>
            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#0f172a', border: '#1e293b', fontSize: '12px', borderRadius: '6px'}} itemStyle={{color: '#fff'}} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} isAnimationActive={true}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="absolute top-0 bottom-0 left-[90px] right-0 pointer-events-none flex flex-col py-[5px]">
                {distributionData.map((entry) => {
                  const rowHeight = 150 / (distributionData.length || 1);
                  const iconSize = Math.min(20, Math.max(10, rowHeight * 0.6));
                  return (
                    <div key={entry.name} className="flex-1 flex items-center justify-start">
                      <div className="rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 shadow-sm ml-2" style={{ height: `${iconSize}px`, width: `${iconSize}px` }}>
                        <img src={entry.logo} alt="" className="w-full h-full object-contain p-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                {currentTires[0]?.logo ? (
                   <img src={currentTires[0].logo} alt="brand" className="w-8 h-8 object-contain rounded-full bg-white p-1" />
                ) : <Car size={32} />}
              </div>
              <div>
                <h2 className="text-xl font-bold">Vehicle Cluster: {currentTires[0]?.model || 'Scanning...'}</h2>
                <p className="text-slate-400 text-sm">Target ID Range: {currentTires[0]?.id || '...'} - {currentTires[3]?.id || '...'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentTires.map((tire, i) => (
                <div key={tire.timestamp || i} className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-center">
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
              {currentTires.length === 0 && <div className="col-span-4 py-8 text-center text-slate-600 italic">No tire data...</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-semibold mb-4 text-slate-400">Pressure Stability (kPa)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.filter(d => d.id === (currentTires[0]?.id || 'unknown'))}>
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
                  <LineChart data={data.filter(d => d.id === (currentTires[0]?.id || 'unknown'))}>
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