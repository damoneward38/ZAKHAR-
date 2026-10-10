import React, { useState, useEffect, useRef } from 'react';
import { Waypoint, MapRegionPackage } from '../../types';
import { MapPin, Compass, Navigation, Download, HardDrive, Plus, Trash2, ArrowUpRight, Crosshair, Sun, Eye } from 'lucide-react';

const INITIAL_WAYPOINTS: Waypoint[] = [
  { id: 'wp-1', name: 'Spring Water Source', latitude: 47.6080, longitude: -122.3351, altitudeMeters: 45, type: 'Water', notes: 'Perennial artesian flow ~15 L/min', timestamp: '2026-10-09' },
  { id: 'wp-2', name: 'Rendezvous Point Bravo', latitude: 47.6150, longitude: -122.3210, altitudeMeters: 110, type: 'Rendezvous', notes: 'Radio relay point on high ridge', timestamp: '2026-10-09' },
  { id: 'wp-3', name: 'Emergency Food Cache #1', latitude: 47.5990, longitude: -122.3420, altitudeMeters: 30, type: 'Cache', notes: 'Sealed PVC tube with dry rations', timestamp: '2026-10-08' }
];

const MAP_PACKAGES: MapRegionPackage[] = [
  { id: 'pkg-1', name: 'Pacific Northwest / Cascade Crest', areaKm2: 45000, resolutionMeters: 10, sizeMb: 240, status: 'Downloaded', featuresCount: 18420, lastUpdated: '2026-10-08' },
  { id: 'pkg-2', name: 'Northern Rockies / Bitterroot Corridor', areaKm2: 62000, resolutionMeters: 10, sizeMb: 310, status: 'Downloaded', featuresCount: 22100, lastUpdated: '2026-10-05' },
  { id: 'pkg-3', name: 'Mojave & Great Basin Arid Zone', areaKm2: 80000, resolutionMeters: 15, sizeMb: 195, status: 'Available', featuresCount: 12500, lastUpdated: '2026-10-01' },
  { id: 'pkg-4', name: 'Appalachian Highlands & Ridges', areaKm2: 55000, resolutionMeters: 10, sizeMb: 280, status: 'Downloaded', featuresCount: 26800, lastUpdated: '2026-10-07' }
];

export const OfflineMapsView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Map Center State
  const [centerLat, setCenterLat] = useState<number>(47.6062);
  const [centerLon, setCenterLon] = useState<number>(-122.3321);
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Compass & Navigation
  const [compassHeading, setCompassHeading] = useState<number>(45); // 0-359 deg
  const [magneticDeclination, setMagneticDeclination] = useState<number>(14.5); // East is positive (+14.5° for PNW)

  // Waypoints State
  const [waypoints, setWaypoints] = useState<Waypoint[]>(() => {
    try {
      const saved = localStorage.getItem('zakhar_waypoints');
      return saved ? JSON.parse(saved) : INITIAL_WAYPOINTS;
    } catch (e) {
      return INITIAL_WAYPOINTS;
    }
  });

  const [selectedWaypointId, setSelectedWaypointId] = useState<string>(waypoints[0]?.id || '');
  const [newWpName, setNewWpName] = useState<string>('');
  const [newWpType, setNewWpType] = useState<Waypoint['type']>('Water');

  // Solar & Stellar Nav
  const [solarElevationDeg, setSolarElevationDeg] = useState<number>(42);
  const [sunDeclinationDeg, setSunDeclinationDeg] = useState<number>(-6); // Oct equinox negative

  // True heading vs Magnetic heading
  const trueHeading = (compassHeading + magneticDeclination + 360) % 360;

  // Solar noon latitude: Lat = 90 - elevation + declination
  const estimatedLatitude = (90 - solarElevationDeg + sunDeclinationDeg).toFixed(2);

  // Save waypoints to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zakhar_waypoints', JSON.stringify(waypoints));
    } catch (e) {}
  }, [waypoints]);

  // Render tactical vector map canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dark tactical background
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(0, 0, width, height);

    // Grid coordinates
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.2)';
    ctx.lineWidth = 1;

    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Topographic Contours (Simulated offline vector contour curves)
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
    ctx.lineWidth = 1.2;

    const centerX = width / 2;
    const centerY = height / 2;

    for (let r = 50; r < 240; r += 35) {
      ctx.beginPath();
      for (let angle = 0; angle <= Math.PI * 2; angle += 0.1) {
        // Organic contour noise
        const perturbation = Math.sin(angle * 4 + r) * 12 + Math.cos(angle * 2) * 8;
        const px = centerX + (r + perturbation) * Math.cos(angle);
        const py = centerY + (r + perturbation) * Math.sin(angle);
        if (angle === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Water feature (simulated creek)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width * 0.1, height * 0.85);
    ctx.bezierCurveTo(width * 0.35, height * 0.6, width * 0.5, height * 0.45, width * 0.85, height * 0.15);
    ctx.stroke();

    // Crosshairs Center
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 15, centerY);
    ctx.lineTo(centerX + 15, centerY);
    ctx.moveTo(centerX, centerY - 15);
    ctx.lineTo(centerX, centerY + 15);
    ctx.stroke();

    // Render Waypoints on Canvas
    waypoints.forEach(wp => {
      // Simple offset projection relative to center
      const dLat = (wp.latitude - centerLat) * 8000;
      const dLon = (wp.longitude - centerLon) * 8000;
      const wx = centerX + dLon;
      const wy = centerY - dLat;

      if (wx >= 10 && wx <= width - 10 && wy >= 10 && wy <= height - 10) {
        ctx.fillStyle = wp.type === 'Water' ? '#06b6d4' : wp.type === 'Cache' ? '#10b981' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(wx, wy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '10px monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(wp.name, wx + 8, wy + 3);
      }
    });

    // Compass indicator in top right
    const compX = width - 40;
    const compY = 40;
    ctx.save();
    ctx.translate(compX, compY);
    ctx.rotate((compassHeading * Math.PI) / 180);

    // North arrow (red)
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(6, 0);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();

    // South arrow (gray)
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(6, 0);
    ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [centerLat, centerLon, zoomLevel, compassHeading, waypoints]);

  // Triangulation: Distance and bearing from center to selected waypoint
  const selectedWp = waypoints.find(w => w.id === selectedWaypointId);
  const distanceToSelectedMeters = selectedWp
    ? Math.round(
        6371000 *
          Math.acos(
            Math.sin((centerLat * Math.PI) / 180) * Math.sin((selectedWp.latitude * Math.PI) / 180) +
              Math.cos((centerLat * Math.PI) / 180) *
                Math.cos((selectedWp.latitude * Math.PI) / 180) *
                Math.cos(((selectedWp.longitude - centerLon) * Math.PI) / 180)
          )
      )
    : 0;

  const bearingToSelectedDeg = selectedWp
    ? Math.round(
        ((Math.atan2(
          Math.sin(((selectedWp.longitude - centerLon) * Math.PI) / 180) *
            Math.cos((selectedWp.latitude * Math.PI) / 180),
          Math.cos((centerLat * Math.PI) / 180) * Math.sin((selectedWp.latitude * Math.PI) / 180) -
            Math.sin((centerLat * Math.PI) / 180) *
              Math.cos((selectedWp.latitude * Math.PI) / 180) *
              Math.cos(((selectedWp.longitude - centerLon) * Math.PI) / 180)
        ) *
          180) /
          Math.PI +
          360) %
          360
      )
    : 0;

  const handleAddWaypoint = () => {
    if (!newWpName.trim()) return;
    const newWp: Waypoint = {
      id: `wp-${Date.now()}`,
      name: newWpName.trim(),
      latitude: parseFloat(centerLat.toFixed(4)),
      longitude: parseFloat(centerLon.toFixed(4)),
      altitudeMeters: 50,
      type: newWpType,
      notes: 'Logged at crosshair coordinate',
      timestamp: new Date().toISOString().split('T')[0]
    };
    setWaypoints([...waypoints, newWp]);
    setNewWpName('');
    setSelectedWaypointId(newWp.id);
  };

  const handleDeleteWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
  };

  const exportWaypointsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(waypoints, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'zakhar_waypoints.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Coordinate & Heading Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <span className="block text-[11px] uppercase font-mono text-zinc-500">Crosshair Latitude / Longitude</span>
            <span className="text-sm font-mono font-bold text-amber-400">
              {centerLat.toFixed(4)}° N, {Math.abs(centerLon).toFixed(4)}° W
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-6">
            <span className="block text-[11px] uppercase font-mono text-zinc-500">MGRS Grid Projection</span>
            <span className="text-sm font-mono font-bold text-cyan-400">
              10T ET 0012 7643
            </span>
          </div>

          <div className="border-l border-zinc-800 pl-6">
            <span className="block text-[11px] uppercase font-mono text-zinc-500">True Heading (Compensated)</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {trueHeading.toFixed(1)}° True ({compassHeading}° Mag + {magneticDeclination}° E)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setCenterLat(pos.coords.latitude);
                    setCenterLon(pos.coords.longitude);
                  },
                  () => alert('GPS unavailable or permission denied. Using manual coordinates.')
                );
              }
            }}
            className="flex items-center gap-1.5 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5 text-amber-400" />
            <span>Center on GPS</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tactical Canvas Stage */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 overflow-hidden relative">
            <canvas
              ref={canvasRef}
              width={720}
              height={440}
              className="w-full h-auto rounded cursor-crosshair block"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const dX = (x - rect.width / 2) / 8000;
                const dY = (rect.height / 2 - y) / 8000;
                setCenterLat(lat => lat + dY);
                setCenterLon(lon => lon + dX);
              }}
            />

            {/* Tactical Overlays */}
            <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded text-[11px] font-mono text-zinc-400 flex items-center gap-3">
              <span>Offline Topo: 1:24,000</span>
              <span>·</span>
              <span>Contours: 20m</span>
              <span>·</span>
              <span className="text-emerald-400">Zero Network Leak</span>
            </div>

            <div className="absolute bottom-4 left-4 bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 px-3 py-1.5 rounded text-[11px] font-mono text-zinc-400">
              Click canvas to pan crosshairs
            </div>
          </div>

          {/* Solar & Stellar Navigation Calculator */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-100">
                  Solar Noon & Celestial Latitude Finder
                </h4>
              </div>
              <span className="text-xs font-mono text-zinc-500">No Electronics Required</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1">
                  Solar Noon Angle ($Alt$): <span className="text-amber-400 font-bold">{solarElevationDeg}°</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={solarElevationDeg}
                  onChange={(e) => setSolarElevationDeg(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <span className="text-[11px] text-zinc-500">Measure with protractor / shadow stick</span>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">
                  Solar Declination: <span className="text-amber-400 font-bold">{sunDeclinationDeg}°</span>
                </label>
                <input
                  type="range"
                  min="-23.5"
                  max="23.5"
                  step="0.5"
                  value={sunDeclinationDeg}
                  onChange={(e) => setSunDeclinationDeg(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <span className="text-[11px] text-zinc-500">October: ~ -6° to -14°</span>
              </div>

              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block text-[11px]">Calculated Latitude</span>
                <span className="text-lg font-bold text-amber-400">{estimatedLatitude}° N</span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">Formula: $90^\circ - Alt + Dec$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Waypoint & Region Package Column */}
        <div className="lg:col-span-4 space-y-4">
          {/* Waypoint Manager */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-100">
                  Target Waypoints ({waypoints.length})
                </h4>
              </div>
              <button
                onClick={exportWaypointsJson}
                className="text-xs text-zinc-400 hover:text-zinc-100 font-mono underline"
              >
                Export JSON
              </button>
            </div>

            {/* Selected Waypoint Triangulation HUD */}
            {selectedWp && (
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Target:</span>
                  <span className="font-bold text-zinc-100">{selectedWp.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Range (Distance):</span>
                  <span className="font-bold text-cyan-400">{distanceToSelectedMeters} meters</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Bearing to Steer:</span>
                  <span className="font-bold text-amber-400">{bearingToSelectedDeg}° True</span>
                </div>
              </div>
            )}

            {/* Waypoints List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {waypoints.map(wp => (
                <div
                  key={wp.id}
                  onClick={() => setSelectedWaypointId(wp.id)}
                  className={`p-2.5 rounded border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    selectedWaypointId === wp.id
                      ? 'bg-cyan-950/50 border-cyan-500 text-zinc-100'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{wp.name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {wp.type} · {wp.latitude.toFixed(3)}, {wp.longitude.toFixed(3)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteWaypoint(wp.id); }}
                    className="text-zinc-600 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Waypoint Form */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500 block">Mark Current Crosshair</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Waypoint Name..."
                  value={newWpName}
                  onChange={(e) => setNewWpName(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 text-xs px-2.5 py-1.5 rounded font-mono text-zinc-100"
                />
                <select
                  value={newWpType}
                  onChange={(e) => setNewWpType(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-800 text-xs px-2 py-1.5 rounded font-mono text-zinc-200"
                >
                  <option value="Water">Water</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Cache">Cache</option>
                  <option value="Hazard">Hazard</option>
                  <option value="Rendezvous">Rendezvous</option>
                </select>
              </div>
              <button
                onClick={handleAddWaypoint}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-semibold py-1.5 rounded transition-colors"
              >
                Save Waypoint at Crosshair
              </button>
            </div>
          </div>

          {/* Downloaded Offline Map Packages */}
          <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-lg space-y-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-100">
                Downloaded Map Region Packs
              </h4>
            </div>

            <div className="space-y-2">
              {MAP_PACKAGES.map(pkg => (
                <div key={pkg.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-zinc-200">{pkg.name}</span>
                    <span className={`text-[11px] ${pkg.status === 'Downloaded' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {pkg.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500 text-[11px]">
                    <span>{pkg.sizeMb} MB · {pkg.resolutionMeters}m res</span>
                    <span>{pkg.featuresCount.toLocaleString()} vector contours</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
