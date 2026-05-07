import { useState, useRef, useEffect } from "react";

// ─── DATOS DEMO ───────────────────────────────────────────────────────────────

const EMPRESAS_DEMO = [
  { id: 1, nombre: "CAFE 2001", rut: "", sector: "" },
];

const CONDUCTORES_INIT = [
  { id: 1, empresaId: 1, nombre: "Carlos Muñoz Pérez", rut: "12.345.678-9", telefono: "+56 9 8765 4321", licencia: "AB-0012345", categoria: "A2", venceLicencia: "2025-07-15" },
  { id: 2, empresaId: 1, nombre: "Pedro Rojas Silva", rut: "14.567.890-1", telefono: "+56 9 7654 3210", licencia: "AB-0067890", categoria: "B", venceLicencia: "2026-03-20" },
  { id: 3, empresaId: 1, nombre: "Ana Torres Vega", rut: "16.789.012-3", telefono: "+56 9 6543 2109", licencia: "AB-0099123", categoria: "A2", venceLicencia: "2025-05-30" },
  { id: 4, empresaId: 1, nombre: "Luis Díaz Mora", rut: "13.456.789-0", telefono: "+56 9 5432 1098", licencia: "AB-0045678", categoria: "A3", venceLicencia: "2027-01-10" },
];

const VEHICULOS_INIT = [
  { id: 1, empresaId: 1, tipo: "Camioneta", patente: "GJKP21", marca: "Toyota", modelo: "Hilux", año: 2021, color: "Blanco", kmActual: 87500, kmProxMantencion: 90000, conductorId: 1 },
  { id: 2, empresaId: 1, tipo: "Furgón", patente: "BHTM54", marca: "Mercedes-Benz", modelo: "Sprinter", año: 2020, color: "Gris", kmActual: 124300, kmProxMantencion: 125000, conductorId: 2 },
  { id: 3, empresaId: 1, tipo: "Sedan", patente: "FKRW88", marca: "Kia", modelo: "K3", año: 2023, color: "Negro", kmActual: 34200, kmProxMantencion: 40000, conductorId: 3 },
  { id: 4, empresaId: 1, tipo: "Camión", patente: "CXNB33", marca: "Volvo", modelo: "FH540", año: 2019, color: "Rojo", kmActual: 310000, kmProxMantencion: 315000, conductorId: 4 },
];

const BITACORA_INIT = [
  { id: 1, vehiculoId: 1, fecha: "2025-04-28", tipo: "Viaje", descripcion: "Entrega en bodega Temuco–Santiago", kmInicio: 86900, kmFin: 87500, conductorId: 1 },
  { id: 2, vehiculoId: 1, fecha: "2025-04-15", tipo: "Observación", descripcion: "Ruido en suspensión delantera izquierda", kmInicio: 86200, kmFin: 86200, conductorId: 1 },
  { id: 3, vehiculoId: 2, fecha: "2025-05-02", tipo: "Viaje", descripcion: "Reparto zona sur – 12 despachos", kmInicio: 123700, kmFin: 124300, conductorId: 2 },
  { id: 4, vehiculoId: 3, fecha: "2025-04-20", tipo: "Evento", descripcion: "Revisión técnica aprobada", kmInicio: 33900, kmFin: 33900, conductorId: 3 },
  { id: 5, vehiculoId: 1, fecha: "2025-03-10", tipo: "Viaje", descripcion: "Visita clientes región Maule", kmInicio: 82400, kmFin: 83000, conductorId: 1 },
];

const MANTENCIONES_INIT = [
  { id: 1, vehiculoId: 1, tipo: "Preventiva", descripcion: "Cambio aceite y filtros, revisión frenos", costo: 320000, boleta: "B-004512", fecha: "2025-01-15", km: 82000, kmProxima: 90000, taller: "Taller Toyota Temuco" },
  { id: 2, vehiculoId: 2, tipo: "Correctiva", descripcion: "Reparación sistema de inyección", costo: 890000, boleta: "B-007231", fecha: "2025-02-08", km: 121000, kmProxima: 125000, taller: "Automotriz Mercedes" },
  { id: 3, vehiculoId: 2, tipo: "Preventiva", descripcion: "Cambio aceite, filtros y bujías", costo: 410000, boleta: "B-003189", fecha: "2024-09-20", km: 115000, kmProxima: 121000, taller: "Taller Express" },
  { id: 4, vehiculoId: 4, tipo: "Preventiva", descripcion: "Cambio aceite motor y caja, revisión general", costo: 1200000, boleta: "F-009821", fecha: "2025-03-01", km: 305000, kmProxima: 315000, taller: "Volvo Service" },
];

const NEUMATICOS_INIT = [
  { id: 1, vehiculoId: 1, fecha: "2025-01-15", marca: "Bridgestone", medida: "265/65 R17", posicion: "4 ruedas", km: 82000, costo: 680000, boleta: "B-004513", obs: "Desgaste uniforme" },
  { id: 2, vehiculoId: 2, fecha: "2024-09-20", marca: "Michelin", medida: "215/65 R16", posicion: "Eje delantero", km: 115000, costo: 280000, boleta: "B-003190", obs: "Desgaste irregular lado izq" },
  { id: 3, vehiculoId: 4, fecha: "2024-11-10", marca: "Continental", medida: "315/70 R22.5", posicion: "Eje trasero doble", km: 295000, costo: 1400000, boleta: "F-008432", obs: "Cambio preventivo" },
];

const COSTOS_INIT = [
  { id: 1, vehiculoId: 1, tipo: "Combustible", descripcion: "Carga combustible COPEC", monto: 85000, boleta: "T-001234", fecha: "2025-04-28", conductorId: 1 },
  { id: 2, vehiculoId: 2, tipo: "Peaje", descripcion: "Peajes autopista A-5", monto: 12500, boleta: "ELEC-44321", fecha: "2025-05-02", conductorId: 2 },
  { id: 3, vehiculoId: 1, tipo: "Combustible", descripcion: "Carga combustible Shell", monto: 92000, boleta: "T-005678", fecha: "2025-04-15", conductorId: 1 },
  { id: 4, vehiculoId: 4, tipo: "Permiso", descripcion: "Permiso de circulación 2025", monto: 380000, boleta: "MUN-2025-4521", fecha: "2025-03-30", conductorId: 4 },
  { id: 5, vehiculoId: 3, tipo: "Revisión Técnica", descripcion: "Revisión técnica + gases", monto: 35000, boleta: "RT-112233", fecha: "2025-04-20", conductorId: 3 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fmt = (n) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n || 0);
const fmtDate = (s) => s ? new Date(s + "T12:00:00").toLocaleDateString("es-CL") : "—";
const fmtKm = (n) => n != null ? n.toLocaleString("es-CL") + " km" : "—";
const dias = (fecha) => fecha ? Math.ceil((new Date(fecha + "T12:00:00") - new Date()) / 86400000) : 999;
const today = () => new Date().toISOString().split("T")[0];
const newId = (arr) => Math.max(0, ...arr.map(x => x.id)) + 1;

const TIPOS_VEH = ["Camioneta", "Sedan", "SUV", "Furgón", "Camión", "Bus", "Moto", "Van"];
const TIPOS_COSTO = ["Combustible", "Peaje", "Permiso", "Revisión Técnica", "Lavado", "Seguro", "Multa", "Otro"];
const TIPOS_BIT = ["Viaje", "Observación", "Evento", "Incidente"];

// ─── THEME ────────────────────────────────────────────────────────────────────

const C = {
  bg: "#f1f5f9", surface: "#ffffff", card: "#ffffff",
  border: "#e2e8f0", borderHi: "#cbd5e1",
  accent: "#3b82f6", accentDim: "rgba(59,130,246,0.10)",
  text: "#0f172a", sub: "#475569", muted: "#94a3b8",
  ok: "#16a34a", warn: "#d97706", danger: "#dc2626",
};

const ss = {
  app: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column" },
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 0%, #dbeafe 0%, ${C.bg} 65%)` },
  loginCard: { width: 430, background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 40 },
  nav: { background: "#ffffff", borderBottom: `1px solid ${C.border}`, padding: "0 20px", display: "flex", alignItems: "center", gap: 2, height: 52, flexShrink: 0, overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  navLogo: { fontWeight: 800, fontSize: 16, color: C.accent, marginRight: 16, whiteSpace: "nowrap", letterSpacing: -0.5 },
  nb: (a) => ({ padding: "5px 11px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500, background: a ? C.accentDim : "transparent", color: a ? C.accent : C.muted, transition: "all 0.15s", whiteSpace: "nowrap" }),
  main: { flex: 1, padding: "22px 26px", maxWidth: 1140, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  g4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 },
  g2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  sc: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 },
  sv: { fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 3 },
  sl: { fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  tbox: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" },
  tbl: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "9px 14px", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" },
  td: { padding: "10px 14px", fontSize: 13, borderBottom: `1px solid #f1f5f9`, color: C.sub, verticalAlign: "middle" },
  btnP: { background: C.accent, color: "#fff", border: "none", borderRadius: 7, padding: "8px 15px", fontWeight: 700, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" },
  btnS: { background: "transparent", color: C.sub, border: `1px solid ${C.borderHi}`, borderRadius: 7, padding: "8px 15px", fontWeight: 500, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap" },
  badge: (c) => ({ background: `${c}22`, color: c, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, display: "inline-block", whiteSpace: "nowrap" }),
  inp: { background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 11px", color: C.text, fontSize: 13, width: "100%", boxSizing: "border-box", outline: "none" },
  lbl: { display: "block", fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  title: { fontSize: 18, fontWeight: 700, color: C.text },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  mc: { background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28, width: 580, maxHeight: "92vh", overflowY: "auto", boxSizing: "border-box" },
};

// ─── INPUT HELPER (fuera del componente para no perder foco) ─────────────────

function Inp({ lbl, val, onChange, type = "text", ph = "", full = false, opts = null }) {
  return (
    <div style={{ gridColumn: full ? "1 / -1" : undefined }}>
      <label style={ss.lbl}>{lbl}</label>
      {opts ? (
        <select style={ss.inp} value={val} onChange={e => onChange(e.target.value)}>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} style={ss.inp} placeholder={ph} value={val} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

// ─── GUARDADO LOCAL ───────────────────────────────────────────────────────────

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function App() {
  const [empresa, setEmpresa] = useState(() => load("cf_empresa", null));
  const [view, setView] = useState("dashboard");
  const [vehiculos, setVehiculos] = useState(() => load("cf_vehiculos", VEHICULOS_INIT));
  const [conductores, setConductores] = useState(() => load("cf_conductores", CONDUCTORES_INIT));
  const [bitacora, setBitacora] = useState(() => load("cf_bitacora", BITACORA_INIT));
  const [mantenciones, setMantenciones] = useState(() => load("cf_mantenciones", MANTENCIONES_INIT));
  const [neumaticos, setNeumaticos] = useState(() => load("cf_neumaticos", NEUMATICOS_INIT));
  const [costos, setCostos] = useState(() => load("cf_costos", COSTOS_INIT));

  // modals
  const [modVeh, setModVeh] = useState(false);
  const [modCond, setModCond] = useState(false);
  const [modBit, setModBit] = useState(false);
  const [modMant, setModMant] = useState(false);
  const [modNeum, setModNeum] = useState(false);
  const [modCosto, setModCosto] = useState(false);

  // forms
  const emptyVeh = { tipo: "Camioneta", patente: "", marca: "", modelo: "", año: new Date().getFullYear(), color: "", kmActual: "", kmProxMantencion: "", conductorId: "" };
  const emptyCond = { nombre: "", rut: "", telefono: "", licencia: "", categoria: "B", venceLicencia: "" };
  const emptyBit = { vehiculoId: "", fecha: today(), tipo: "Viaje", descripcion: "", kmInicio: "", kmFin: "", conductorId: "" };
  const emptyMant = { vehiculoId: "", tipo: "Preventiva", descripcion: "", costo: "", boleta: "", fecha: today(), km: "", kmProxima: "", taller: "" };
  const emptyNeum = { vehiculoId: "", fecha: today(), marca: "", medida: "", posicion: "", km: "", costo: "", boleta: "", obs: "" };
  const emptyCosto = { vehiculoId: "", tipo: "Combustible", descripcion: "", monto: "", boleta: "", fecha: today(), conductorId: "" };

  const [fVeh, setFVeh] = useState(emptyVeh);
  const [fCond, setFCond] = useState(emptyCond);
  const [fBit, setFBit] = useState(emptyBit);
  const [fMant, setFMant] = useState(emptyMant);
  const [fNeum, setFNeum] = useState(emptyNeum);
  const [fCosto, setFCosto] = useState(emptyCosto);

  // bitacora filter
  const [bitVehFiltro, setBitVehFiltro] = useState("");

  // new empresa login
  const [showNE, setShowNE] = useState(false);
  const [ne, setNe] = useState({ nombre: "", rut: "", sector: "" });

  // chat
  const [chat, setChat] = useState([{ role: "assistant", content: "¡Hola! Soy tu asistente de flota. Puedo responder preguntas sobre vehículos, conductores, mantenciones, costos y alertas. ¿En qué te ayudo?" }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  useEffect(() => { save("cf_empresa", empresa); }, [empresa]);
  useEffect(() => { save("cf_vehiculos", vehiculos); }, [vehiculos]);
  useEffect(() => { save("cf_conductores", conductores); }, [conductores]);
  useEffect(() => { save("cf_bitacora", bitacora); }, [bitacora]);
  useEffect(() => { save("cf_mantenciones", mantenciones); }, [mantenciones]);
  useEffect(() => { save("cf_neumaticos", neumaticos); }, [neumaticos]);
  useEffect(() => { save("cf_costos", costos); }, [costos]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  // ── computed ──
  const myVeh = empresa ? vehiculos.filter(v => v.empresaId === empresa.id) : [];
  const myCond = empresa ? conductores.filter(c => c.empresaId === empresa.id) : [];
  const myBit = bitacora.filter(b => myVeh.some(v => v.id === b.vehiculoId));
  const myMant = mantenciones.filter(m => myVeh.some(v => v.id === m.vehiculoId));
  const myNeum = neumaticos.filter(n => myVeh.some(v => v.id === n.vehiculoId));
  const myCosto = costos.filter(c => myVeh.some(v => v.id === c.vehiculoId));

  const alertasLic = myCond.filter(c => dias(c.venceLicencia) < 60);
  const alertasKm = myVeh.filter(v => v.kmActual >= v.kmProxMantencion - 1500);

  const totalCostos = [...myMant, ...myNeum].reduce((a, b) => a + (b.costo || 0), 0)
    + myCosto.reduce((a, b) => a + (b.monto || 0), 0);

  const nombre = (cId) => conductores.find(c => c.id === Number(cId))?.nombre || "—";
  const patente = (vId) => vehiculos.find(v => v.id === Number(vId))?.patente || "—";
  const vehNombre = (vId) => { const v = vehiculos.find(v => v.id === Number(vId)); return v ? `${v.marca} ${v.modelo}` : "—"; };

  // ── handlers ──
  const addVeh = () => {
    if (!fVeh.patente) return;
    setVehiculos([...vehiculos, { ...fVeh, id: newId(vehiculos), empresaId: empresa.id, kmActual: Number(fVeh.kmActual), kmProxMantencion: Number(fVeh.kmProxMantencion), año: Number(fVeh.año), conductorId: Number(fVeh.conductorId) }]);
    setFVeh(emptyVeh); setModVeh(false);
  };
  const addCond = () => {
    if (!fCond.nombre) return;
    setConductores([...conductores, { ...fCond, id: newId(conductores), empresaId: empresa.id }]);
    setFCond(emptyCond); setModCond(false);
  };
  const addBit = () => {
    if (!fBit.vehiculoId || !fBit.descripcion) return;
    const entry = { ...fBit, id: newId(bitacora), vehiculoId: Number(fBit.vehiculoId), conductorId: Number(fBit.conductorId), kmInicio: Number(fBit.kmInicio), kmFin: Number(fBit.kmFin) };
    setBitacora([entry, ...bitacora]);
    // update km
    if (entry.kmFin > 0) setVehiculos(vehiculos.map(v => v.id === entry.vehiculoId ? { ...v, kmActual: Math.max(v.kmActual, entry.kmFin) } : v));
    setFBit(emptyBit); setModBit(false);
  };
  const addMant = () => {
    if (!fMant.vehiculoId) return;
    setMantenciones([...mantenciones, { ...fMant, id: newId(mantenciones), vehiculoId: Number(fMant.vehiculoId), costo: Number(fMant.costo), km: Number(fMant.km), kmProxima: Number(fMant.kmProxima) }]);
    if (fMant.kmProxima) setVehiculos(vehiculos.map(v => v.id === Number(fMant.vehiculoId) ? { ...v, kmProxMantencion: Number(fMant.kmProxima) } : v));
    setFMant(emptyMant); setModMant(false);
  };
  const addNeum = () => {
    if (!fNeum.vehiculoId) return;
    setNeumaticos([...neumaticos, { ...fNeum, id: newId(neumaticos), vehiculoId: Number(fNeum.vehiculoId), costo: Number(fNeum.costo), km: Number(fNeum.km) }]);
    setFNeum(emptyNeum); setModNeum(false);
  };
  const addCosto = () => {
    if (!fCosto.vehiculoId) return;
    setCostos([...costos, { ...fCosto, id: newId(costos), vehiculoId: Number(fCosto.vehiculoId), monto: Number(fCosto.monto), conductorId: Number(fCosto.conductorId) }]);
    setFCosto(emptyCosto); setModCosto(false);
  };

  // ── AI chat ──
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: "user", content: chatInput };
    const history = [...chat, userMsg];
    setChat(history); setChatInput(""); setChatLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Eres un asistente de gestión de flota vehicular para "${empresa?.nombre}". Responde en español, conciso y útil.

VEHÍCULOS: ${JSON.stringify(myVeh.map(v => ({ ...v, conductor: nombre(v.conductorId), alertaKm: v.kmActual >= v.kmProxMantencion - 1500 ? "PRÓXIMA MANTENCIÓN" : "ok" })))}
CONDUCTORES: ${JSON.stringify(myCond.map(c => ({ ...c, diasCarnet: dias(c.venceLicencia), alertaCarnet: dias(c.venceLicencia) < 60 ? "PRÓXIMO A VENCER" : "ok" })))}
MANTENCIONES: ${JSON.stringify(myMant)}
NEUMÁTICOS: ${JSON.stringify(myNeum)}
COSTOS GENERALES: ${JSON.stringify(myCosto)}
TOTAL GASTO FLOTA: $${totalCostos.toLocaleString("es-CL")} CLP

Puedes analizar costos por vehículo, alertar sobre vencimientos, identificar vehículos problemáticos, comparar conductores, etc.`,
          messages: history.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      setChat(prev => [...prev, { role: "assistant", content: data.content?.[0]?.text || "Sin respuesta." }]);
    } catch {
      setChat(prev => [...prev, { role: "assistant", content: "Error de conexión. Intenta de nuevo." }]);
    }
    setChatLoading(false);
  };

  // ── close modal ──
  const closeOn = (setter) => (e) => { if (e.target === e.currentTarget) setter(false); };

  // ─── LOGIN ────────────────────────────────────────────────────────────────

  if (!empresa) return (
    <div style={ss.loginWrap}>
      <div style={ss.loginCard}>
        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 6, fontWeight: 700 }}>GESTIÓN DE FLOTA</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text, marginBottom: 2 }}>CAFE 2001</div>
        <div style={{ color: C.muted, fontSize: 13, marginBottom: 32 }}>Control vehicular inteligente con asistente IA</div>

        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Seleccionar empresa</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {EMPRESAS_DEMO.map(emp => (
            <button key={emp.id} onClick={() => { setEmpresa(emp); }}
              style={{ background: "#f8fafc", border: `1px solid ${C.border}`, borderRadius: 8, padding: "13px 16px", cursor: "pointer", textAlign: "left", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{emp.nombre}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>RUT {emp.rut} · {emp.sector}</div>
            </button>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18 }}>
          {!showNE ? (
            <button onClick={() => setShowNE(true)} style={{ ...ss.btnS, width: "100%", textAlign: "center" }}>+ Registrar nueva empresa</button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Nombre", "nombre"], ["RUT", "rut"], ["Sector", "sector"]].map(([l, k]) => (
                <div key={k}><label style={ss.lbl}>{l}</label><input style={ss.inp} value={ne[k]} onChange={e => setNe({ ...ne, [k]: e.target.value })} /></div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <button style={ss.btnS} onClick={() => setShowNE(false)}>Cancelar</button>
                <button style={{ ...ss.btnP, flex: 1 }} onClick={() => { if (ne.nombre) { setEmpresa({ id: Date.now(), ...ne }); } }}>Entrar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ─── SHELL ────────────────────────────────────────────────────────────────

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "vehiculos", label: "Vehículos" },
    { id: "conductores", label: "Conductores" },
    { id: "bitacora", label: "Bitácora" },
    { id: "mantenciones", label: "Mantenciones" },
    { id: "neumaticos", label: "Neumáticos" },
    { id: "costos", label: "Costos" },
    { id: "asistente", label: "🤖 Asistente IA" },
  ];

  return (
    <div style={ss.app}>
      {/* NAV */}
      <nav style={ss.nav}>
        <span style={ss.navLogo}>CAFE 2001</span>
        {tabs.map(t => <button key={t.id} style={ss.nb(view === t.id)} onClick={() => setView(t.id)}>{t.label}</button>)}
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
          {(alertasKm.length + alertasLic.length) > 0 && (
            <span style={{ background: `${C.danger}22`, color: C.danger, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>
              ⚠ {alertasKm.length + alertasLic.length} alertas
            </span>
          )}
          <span style={{ color: C.accent, fontWeight: 600 }}>{empresa.nombre}</span>
          <button onClick={() => setEmpresa(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 12 }}>Salir</button>
        </div>
      </nav>

      <div style={ss.main}>

        {/* ── DASHBOARD ─────────────────────────────────────────────────────── */}
        {view === "dashboard" && <>
          <div style={{ marginBottom: 20 }}>
            <div style={ss.title}>Dashboard</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{empresa.nombre} · Resumen de flota</div>
          </div>

          {/* Stats */}
          <div style={ss.g4}>
            {[
              { v: myVeh.length, l: "Vehículos" },
              { v: myCond.length, l: "Conductores" },
              { v: fmt(totalCostos), l: "Gasto total flota", sm: true },
              { v: alertasKm.length + alertasLic.length, l: "Alertas activas", red: true },
            ].map((s, i) => (
              <div key={i} style={{ ...ss.sc, borderColor: s.red && s.v > 0 ? C.danger : C.border }}>
                <div style={{ ...ss.sv, fontSize: s.sm ? 18 : 24, color: s.red && s.v > 0 ? C.danger : C.text }}>{s.v}</div>
                <div style={ss.sl}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Alertas km */}
          {alertasKm.length > 0 && (
            <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "14px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.danger, marginBottom: 8 }}>⚠ Mantenciones próximas por kilometraje</div>
              {alertasKm.map(v => (
                <div key={v.id} style={{ fontSize: 13, color: "#fca5a5", marginBottom: 3 }}>
                  · {v.marca} {v.modelo} ({v.patente}): {fmtKm(v.kmActual)} — próxima mantención a {fmtKm(v.kmProxMantencion)} ({v.kmProxMantencion - v.kmActual <= 0 ? "VENCIDA" : `faltan ${fmtKm(v.kmProxMantencion - v.kmActual)}`})
                </div>
              ))}
            </div>
          )}

          {/* Alertas licencia */}
          {alertasLic.length > 0 && (
            <div style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 8, padding: "14px 18px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.warn, marginBottom: 8 }}>⚠ Licencias de conducir por vencer</div>
              {alertasLic.map(c => {
                const d = dias(c.venceLicencia);
                return <div key={c.id} style={{ fontSize: 13, color: "#fde68a", marginBottom: 3 }}>· {c.nombre}: {d <= 0 ? `VENCIDA hace ${Math.abs(d)} días` : `vence en ${d} días (${fmtDate(c.venceLicencia)})`}</div>;
              })}
            </div>
          )}

          {/* Flota overview */}
          <div style={ss.tbox}>
            <div style={{ padding: "13px 18px", borderBottom: `1px solid ${C.border}`, fontSize: 14, fontWeight: 600, color: C.text }}>Estado de la flota</div>
            <table style={ss.tbl}>
              <thead><tr>
                {["Vehículo", "Patente", "Conductor", "Km actual", "Prox. mantención", "Estado"].map(h => <th key={h} style={ss.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {myVeh.map(v => {
                  const diff = v.kmProxMantencion - v.kmActual;
                  const pct = Math.min(100, (v.kmActual / v.kmProxMantencion) * 100);
                  const color = diff <= 0 ? C.danger : diff < 1500 ? C.warn : C.ok;
                  return (
                    <tr key={v.id}>
                      <td style={{ ...ss.td, color: C.text, fontWeight: 500 }}>{v.marca} {v.modelo}</td>
                      <td style={{ ...ss.td, fontFamily: "monospace", color: C.accent, fontWeight: 700 }}>{v.patente}</td>
                      <td style={ss.td}>{nombre(v.conductorId)}</td>
                      <td style={{ ...ss.td, fontFamily: "monospace" }}>{fmtKm(v.kmActual)}</td>
                      <td style={ss.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 11, color, fontFamily: "monospace", whiteSpace: "nowrap" }}>{fmtKm(v.kmProxMantencion)}</span>
                        </div>
                      </td>
                      <td style={ss.td}><span style={ss.badge(color)}>{diff <= 0 ? "Vencida" : diff < 1500 ? "Próxima" : "Al día"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── VEHÍCULOS ─────────────────────────────────────────────────────── */}
        {view === "vehiculos" && <>
          <div style={ss.head}>
            <div><div style={ss.title}>Vehículos</div><div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{myVeh.length} vehículos registrados</div></div>
            <button style={ss.btnP} onClick={() => setModVeh(true)}>+ Agregar vehículo</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {myVeh.map(v => {
              const diff = v.kmProxMantencion - v.kmActual;
              const alertColor = diff <= 0 ? C.danger : diff < 1500 ? C.warn : C.ok;
              const cond = conductores.find(c => c.id === v.conductorId);
              const costVeh = [...myMant, ...myNeum].filter(x => x.vehiculoId === v.id).reduce((a, b) => a + b.costo, 0)
                + myCosto.filter(x => x.vehiculoId === v.id).reduce((a, b) => a + b.monto, 0);
              return (
                <div key={v.id} style={{ background: C.card, border: `1px solid ${alertColor === C.danger ? C.danger : C.border}`, borderRadius: 10, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{v.marca} {v.modelo} <span style={{ color: C.muted, fontWeight: 400 }}>({v.año})</span></div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: C.accent, letterSpacing: 1, marginTop: 2 }}>{v.patente}</div>
                    </div>
                    <span style={{ ...ss.badge(alertColor), fontSize: 12 }}>{v.tipo}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, marginBottom: 14 }}>
                    <div><span style={{ color: C.muted }}>Color: </span><span style={{ color: C.sub }}>{v.color}</span></div>
                    <div><span style={{ color: C.muted }}>Conductor: </span><span style={{ color: C.sub }}>{cond?.nombre || "—"}</span></div>
                    <div><span style={{ color: C.muted }}>Km actual: </span><span style={{ color: C.text, fontWeight: 600 }}>{fmtKm(v.kmActual)}</span></div>
                    <div><span style={{ color: C.muted }}>Prox. mantención: </span><span style={{ color: alertColor, fontWeight: 600 }}>{fmtKm(v.kmProxMantencion)}</span></div>
                    <div><span style={{ color: C.muted }}>Mantenciones: </span><span style={{ color: C.sub }}>{myMant.filter(m => m.vehiculoId === v.id).length}</span></div>
                    <div><span style={{ color: C.muted }}>Costo total: </span><span style={{ color: C.accent, fontWeight: 700 }}>{fmt(costVeh)}</span></div>
                  </div>
                  <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (v.kmActual / v.kmProxMantencion) * 100)}%`, background: alertColor, borderRadius: 3, transition: "width 0.4s" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.muted, marginTop: 4 }}>
                    <span>{fmtKm(v.kmActual)}</span>
                    <span>Prox: {fmtKm(v.kmProxMantencion)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ── CONDUCTORES ───────────────────────────────────────────────────── */}
        {view === "conductores" && <>
          <div style={ss.head}>
            <div><div style={ss.title}>Conductores</div><div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{myCond.length} conductores registrados</div></div>
            <button style={ss.btnP} onClick={() => setModCond(true)}>+ Agregar conductor</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {myCond.map(c => {
              const d = dias(c.venceLicencia);
              const lColor = d <= 0 ? C.danger : d < 60 ? C.warn : C.ok;
              const vehAsig = myVeh.filter(v => v.conductorId === c.id);
              return (
                <div key={c.id} style={{ background: C.card, border: `1px solid ${d < 60 ? lColor : C.border}`, borderRadius: 10, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{c.nombre}</div>
                      <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>RUT: {c.rut}</div>
                    </div>
                    <span style={ss.badge(lColor)}>{d <= 0 ? "Carnet vencido" : d < 60 ? `${d}d carnet` : "Vigente"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12 }}>
                    <div><span style={{ color: C.muted }}>Teléfono: </span><span style={{ color: C.sub }}>{c.telefono}</span></div>
                    <div><span style={{ color: C.muted }}>Licencia Nº: </span><span style={{ color: C.sub, fontFamily: "monospace" }}>{c.licencia}</span></div>
                    <div><span style={{ color: C.muted }}>Categoría: </span><span style={{ color: C.accent, fontWeight: 700 }}>{c.categoria}</span></div>
                    <div><span style={{ color: C.muted }}>Vence: </span><span style={{ color: lColor, fontWeight: 600 }}>{fmtDate(c.venceLicencia)}</span></div>
                    <div style={{ gridColumn: "1 / -1" }}><span style={{ color: C.muted }}>Vehículos asignados: </span><span style={{ color: C.sub }}>{vehAsig.length > 0 ? vehAsig.map(v => v.patente).join(", ") : "Ninguno"}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* ── BITÁCORA ──────────────────────────────────────────────────────── */}
        {view === "bitacora" && <>
          <div style={ss.head}>
            <div>
              <div style={ss.title}>Bitácora</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{myBit.length} registros</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <select style={{ ...ss.inp, width: 200 }} value={bitVehFiltro} onChange={e => setBitVehFiltro(e.target.value)}>
                <option value="">Todos los vehículos</option>
                {myVeh.map(v => <option key={v.id} value={v.id}>{v.patente} – {v.marca} {v.modelo}</option>)}
              </select>
              <button style={ss.btnP} onClick={() => setModBit(true)}>+ Agregar entrada</button>
            </div>
          </div>
          <div style={ss.tbox}>
            <table style={ss.tbl}>
              <thead><tr>{["Fecha", "Vehículo", "Tipo", "Descripción", "Km inicio", "Km fin", "Conductor"].map(h => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
              <tbody>
                {myBit.filter(b => !bitVehFiltro || b.vehiculoId === Number(bitVehFiltro))
                  .sort((a, b) => b.fecha.localeCompare(a.fecha))
                  .map(b => {
                    const tipColor = { Viaje: C.accent, Observación: C.warn, Evento: C.ok, Incidente: C.danger }[b.tipo] || C.muted;
                    return (
                      <tr key={b.id}>
                        <td style={{ ...ss.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtDate(b.fecha)}</td>
                        <td style={{ ...ss.td, color: C.accent, fontFamily: "monospace", fontWeight: 700 }}>{patente(b.vehiculoId)}</td>
                        <td style={ss.td}><span style={ss.badge(tipColor)}>{b.tipo}</span></td>
                        <td style={{ ...ss.td, maxWidth: 260 }}>{b.descripcion}</td>
                        <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 12 }}>{fmtKm(b.kmInicio)}</td>
                        <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 12 }}>{b.kmFin ? fmtKm(b.kmFin) : "—"}</td>
                        <td style={ss.td}>{nombre(b.conductorId)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── MANTENCIONES ──────────────────────────────────────────────────── */}
        {view === "mantenciones" && <>
          <div style={ss.head}>
            <div><div style={ss.title}>Mantenciones</div><div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{myMant.length} registros · {fmt(myMant.reduce((a, b) => a + b.costo, 0))} total</div></div>
            <button style={ss.btnP} onClick={() => setModMant(true)}>+ Registrar mantención</button>
          </div>
          <div style={ss.tbox}>
            <table style={ss.tbl}>
              <thead><tr>{["Vehículo", "Tipo", "Descripción", "Taller", "Km", "Prox. km", "Costo", "Boleta", "Fecha"].map(h => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
              <tbody>
                {[...myMant].sort((a, b) => b.fecha.localeCompare(a.fecha)).map(m => (
                  <tr key={m.id}>
                    <td style={{ ...ss.td, color: C.accent, fontFamily: "monospace", fontWeight: 700 }}>{patente(m.vehiculoId)}</td>
                    <td style={ss.td}><span style={ss.badge(m.tipo === "Preventiva" ? C.ok : C.danger)}>{m.tipo}</span></td>
                    <td style={{ ...ss.td, maxWidth: 200 }}>{m.descripcion}</td>
                    <td style={{ ...ss.td, fontSize: 12 }}>{m.taller}</td>
                    <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 12 }}>{fmtKm(m.km)}</td>
                    <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 12, color: C.warn }}>{fmtKm(m.kmProxima)}</td>
                    <td style={{ ...ss.td, color: C.accent, fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(m.costo)}</td>
                    <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 11, color: C.muted }}>{m.boleta}</td>
                    <td style={{ ...ss.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtDate(m.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── NEUMÁTICOS ────────────────────────────────────────────────────── */}
        {view === "neumaticos" && <>
          <div style={ss.head}>
            <div><div style={ss.title}>Neumáticos</div><div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{myNeum.length} cambios registrados · {fmt(myNeum.reduce((a, b) => a + b.costo, 0))} total</div></div>
            <button style={ss.btnP} onClick={() => setModNeum(true)}>+ Registrar cambio</button>
          </div>
          <div style={ss.tbox}>
            <table style={ss.tbl}>
              <thead><tr>{["Vehículo", "Fecha", "Marca", "Medida", "Posición", "Km", "Observación", "Costo", "Boleta"].map(h => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
              <tbody>
                {[...myNeum].sort((a, b) => b.fecha.localeCompare(a.fecha)).map(n => (
                  <tr key={n.id}>
                    <td style={{ ...ss.td, color: C.accent, fontFamily: "monospace", fontWeight: 700 }}>{patente(n.vehiculoId)}</td>
                    <td style={{ ...ss.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtDate(n.fecha)}</td>
                    <td style={{ ...ss.td, fontWeight: 500, color: C.text }}>{n.marca}</td>
                    <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 12 }}>{n.medida}</td>
                    <td style={ss.td}>{n.posicion}</td>
                    <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 12 }}>{fmtKm(n.km)}</td>
                    <td style={{ ...ss.td, fontSize: 12, color: C.muted }}>{n.obs}</td>
                    <td style={{ ...ss.td, color: C.accent, fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(n.costo)}</td>
                    <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 11, color: C.muted }}>{n.boleta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── COSTOS ────────────────────────────────────────────────────────── */}
        {view === "costos" && <>
          <div style={ss.head}>
            <div>
              <div style={ss.title}>Registro de Costos</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>Combustible, peajes, permisos y otros gastos</div>
            </div>
            <button style={ss.btnP} onClick={() => setModCosto(true)}>+ Agregar costo</button>
          </div>

          {/* resumen por tipo */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            {TIPOS_COSTO.filter(t => myCosto.some(c => c.tipo === t)).map(t => {
              const total = myCosto.filter(c => c.tipo === t).reduce((a, b) => a + b.monto, 0);
              return (
                <div key={t} style={{ ...ss.sc }}>
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{t}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>{fmt(total)}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{myCosto.filter(c => c.tipo === t).length} registros</div>
                </div>
              );
            })}
          </div>

          <div style={ss.tbox}>
            <table style={ss.tbl}>
              <thead><tr>{["Fecha", "Vehículo", "Tipo", "Descripción", "Conductor", "Monto", "Boleta/Ticket"].map(h => <th key={h} style={ss.th}>{h}</th>)}</tr></thead>
              <tbody>
                {[...myCosto].sort((a, b) => b.fecha.localeCompare(a.fecha)).map(c => (
                  <tr key={c.id}>
                    <td style={{ ...ss.td, color: C.muted, whiteSpace: "nowrap" }}>{fmtDate(c.fecha)}</td>
                    <td style={{ ...ss.td, color: C.accent, fontFamily: "monospace", fontWeight: 700 }}>{patente(c.vehiculoId)}</td>
                    <td style={ss.td}><span style={ss.badge(C.accent)}>{c.tipo}</span></td>
                    <td style={ss.td}>{c.descripcion}</td>
                    <td style={ss.td}>{nombre(c.conductorId)}</td>
                    <td style={{ ...ss.td, color: C.accent, fontFamily: "monospace", fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(c.monto)}</td>
                    <td style={{ ...ss.td, fontFamily: "monospace", fontSize: 11, color: C.muted }}>{c.boleta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>}

        {/* ── ASISTENTE IA ──────────────────────────────────────────────────── */}
        {view === "asistente" && (
          <div style={{ height: "calc(100vh - 130px)", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={ss.title}>🤖 Asistente IA</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>Consulta sobre tu flota en lenguaje natural</div>
            </div>
            <div style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
              {chat.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "72%", padding: "10px 14px", lineHeight: 1.55, fontSize: 13, borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px", background: msg.role === "user" ? C.accent : "#f1f5f9", color: msg.role === "user" ? "#fff" : C.text, whiteSpace: "pre-wrap", border: msg.role === "user" ? "none" : `1px solid ${C.border}` }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && <div style={{ display: "flex" }}><div style={{ background: "#f1f5f9", border: `1px solid ${C.border}`, borderRadius: "10px 10px 10px 2px", padding: "10px 14px", fontSize: 13, color: C.muted }}>Analizando flota...</div></div>}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {["¿Qué vehículo tiene más gastos?", "¿Qué licencias vencen pronto?", "¿Cuánto hemos gastado en combustible?", "¿Qué vehículo necesita mantención urgente?"].map(q => (
                <button key={q} onClick={() => setChatInput(q)} style={{ background: "transparent", border: `1px solid ${C.borderHi}`, borderRadius: 20, padding: "4px 11px", fontSize: 11, color: C.muted, cursor: "pointer" }}>{q}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...ss.inp, flex: 1 }} placeholder="Escribe tu consulta sobre la flota..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
              <button style={{ ...ss.btnP, opacity: chatLoading ? 0.6 : 1 }} onClick={sendChat} disabled={chatLoading}>{chatLoading ? "···" : "Enviar"}</button>
            </div>
          </div>
        )}
      </div>

      {/* ──── MODALES ──────────────────────────────────────────────────────── */}

      {/* VEHÍCULO */}
      {modVeh && (
        <div style={ss.modal} onClick={closeOn(setModVeh)}>
          <div style={ss.mc}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.text }}>Agregar Vehículo</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp lbl="Tipo" val={fVeh.tipo} onChange={v => setFVeh({ ...fVeh, tipo: v })} opts={TIPOS_VEH} />
              <Inp lbl="Patente *" val={fVeh.patente} onChange={v => setFVeh({ ...fVeh, patente: v })} ph="GJKP21" />
              <Inp lbl="Marca" val={fVeh.marca} onChange={v => setFVeh({ ...fVeh, marca: v })} ph="Toyota" />
              <Inp lbl="Modelo" val={fVeh.modelo} onChange={v => setFVeh({ ...fVeh, modelo: v })} ph="Hilux" />
              <Inp lbl="Año" val={fVeh.año} onChange={v => setFVeh({ ...fVeh, año: v })} type="number" />
              <Inp lbl="Color" val={fVeh.color} onChange={v => setFVeh({ ...fVeh, color: v })} ph="Blanco" />
              <Inp lbl="Km actual" val={fVeh.kmActual} onChange={v => setFVeh({ ...fVeh, kmActual: v })} type="number" ph="87500" />
              <Inp lbl="Km próxima mantención" val={fVeh.kmProxMantencion} onChange={v => setFVeh({ ...fVeh, kmProxMantencion: v })} type="number" ph="90000" />
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={ss.lbl}>Conductor asignado</label>
                <select style={ss.inp} value={fVeh.conductorId} onChange={e => setFVeh({ ...fVeh, conductorId: e.target.value })}>
                  <option value="">Sin asignar</option>
                  {myCond.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={ss.btnS} onClick={() => setModVeh(false)}>Cancelar</button>
              <button style={ss.btnP} onClick={addVeh}>Guardar vehículo</button>
            </div>
          </div>
        </div>
      )}

      {/* CONDUCTOR */}
      {modCond && (
        <div style={ss.modal} onClick={closeOn(setModCond)}>
          <div style={ss.mc}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.text }}>Agregar Conductor</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp lbl="Nombre completo *" val={fCond.nombre} onChange={v => setFCond({ ...fCond, nombre: v })} ph="Carlos Muñoz" full />
              <Inp lbl="RUT" val={fCond.rut} onChange={v => setFCond({ ...fCond, rut: v })} ph="12.345.678-9" />
              <Inp lbl="Teléfono" val={fCond.telefono} onChange={v => setFCond({ ...fCond, telefono: v })} ph="+56 9 ..." />
              <Inp lbl="N° Licencia (carnet)" val={fCond.licencia} onChange={v => setFCond({ ...fCond, licencia: v })} ph="AB-0012345" />
              <Inp lbl="Categoría licencia" val={fCond.categoria} onChange={v => setFCond({ ...fCond, categoria: v })} opts={["A1", "A2", "A3", "A4", "A5", "B", "C", "D", "E", "F"]} />
              <Inp lbl="Vencimiento licencia" val={fCond.venceLicencia} onChange={v => setFCond({ ...fCond, venceLicencia: v })} type="date" />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={ss.btnS} onClick={() => setModCond(false)}>Cancelar</button>
              <button style={ss.btnP} onClick={addCond}>Guardar conductor</button>
            </div>
          </div>
        </div>
      )}

      {/* BITÁCORA */}
      {modBit && (
        <div style={ss.modal} onClick={closeOn(setModBit)}>
          <div style={ss.mc}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.text }}>Agregar a Bitácora</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={ss.lbl}>Vehículo *</label>
                <select style={ss.inp} value={fBit.vehiculoId} onChange={e => setFBit({ ...fBit, vehiculoId: e.target.value })}>
                  <option value="">Seleccionar vehículo...</option>
                  {myVeh.map(v => <option key={v.id} value={v.id}>{v.patente} – {v.marca} {v.modelo}</option>)}
                </select>
              </div>
              <Inp lbl="Tipo" val={fBit.tipo} onChange={v => setFBit({ ...fBit, tipo: v })} opts={TIPOS_BIT} />
              <Inp lbl="Fecha" val={fBit.fecha} onChange={v => setFBit({ ...fBit, fecha: v })} type="date" />
              <Inp lbl="Descripción *" val={fBit.descripcion} onChange={v => setFBit({ ...fBit, descripcion: v })} ph="Descripción del evento o viaje" full />
              <Inp lbl="Km inicio" val={fBit.kmInicio} onChange={v => setFBit({ ...fBit, kmInicio: v })} type="number" ph="87000" />
              <Inp lbl="Km fin" val={fBit.kmFin} onChange={v => setFBit({ ...fBit, kmFin: v })} type="number" ph="87500" />
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={ss.lbl}>Conductor</label>
                <select style={ss.inp} value={fBit.conductorId} onChange={e => setFBit({ ...fBit, conductorId: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {myCond.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={ss.btnS} onClick={() => setModBit(false)}>Cancelar</button>
              <button style={ss.btnP} onClick={addBit}>Guardar entrada</button>
            </div>
          </div>
        </div>
      )}

      {/* MANTENCIÓN */}
      {modMant && (
        <div style={ss.modal} onClick={closeOn(setModMant)}>
          <div style={ss.mc}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.text }}>Registrar Mantención</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={ss.lbl}>Vehículo *</label>
                <select style={ss.inp} value={fMant.vehiculoId} onChange={e => setFMant({ ...fMant, vehiculoId: e.target.value })}>
                  <option value="">Seleccionar vehículo...</option>
                  {myVeh.map(v => <option key={v.id} value={v.id}>{v.patente} – {v.marca} {v.modelo}</option>)}
                </select>
              </div>
              <Inp lbl="Tipo" val={fMant.tipo} onChange={v => setFMant({ ...fMant, tipo: v })} opts={["Preventiva", "Correctiva"]} />
              <Inp lbl="Fecha" val={fMant.fecha} onChange={v => setFMant({ ...fMant, fecha: v })} type="date" />
              <Inp lbl="Descripción *" val={fMant.descripcion} onChange={v => setFMant({ ...fMant, descripcion: v })} ph="Cambio aceite y filtros..." full />
              <Inp lbl="Km al momento" val={fMant.km} onChange={v => setFMant({ ...fMant, km: v })} type="number" ph="87500" />
              <Inp lbl="Km próxima mantención" val={fMant.kmProxima} onChange={v => setFMant({ ...fMant, kmProxima: v })} type="number" ph="95000" />
              <Inp lbl="Costo (CLP)" val={fMant.costo} onChange={v => setFMant({ ...fMant, costo: v })} type="number" ph="320000" />
              <Inp lbl="N° Boleta / Factura" val={fMant.boleta} onChange={v => setFMant({ ...fMant, boleta: v })} ph="B-004512" />
              <Inp lbl="Taller / Proveedor" val={fMant.taller} onChange={v => setFMant({ ...fMant, taller: v })} ph="Taller Toyota" full />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={ss.btnS} onClick={() => setModMant(false)}>Cancelar</button>
              <button style={ss.btnP} onClick={addMant}>Guardar mantención</button>
            </div>
          </div>
        </div>
      )}

      {/* NEUMÁTICOS */}
      {modNeum && (
        <div style={ss.modal} onClick={closeOn(setModNeum)}>
          <div style={ss.mc}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.text }}>Registrar Cambio de Neumáticos</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={ss.lbl}>Vehículo *</label>
                <select style={ss.inp} value={fNeum.vehiculoId} onChange={e => setFNeum({ ...fNeum, vehiculoId: e.target.value })}>
                  <option value="">Seleccionar vehículo...</option>
                  {myVeh.map(v => <option key={v.id} value={v.id}>{v.patente} – {v.marca} {v.modelo}</option>)}
                </select>
              </div>
              <Inp lbl="Fecha" val={fNeum.fecha} onChange={v => setFNeum({ ...fNeum, fecha: v })} type="date" />
              <Inp lbl="Km al momento" val={fNeum.km} onChange={v => setFNeum({ ...fNeum, km: v })} type="number" ph="87500" />
              <Inp lbl="Marca neumático" val={fNeum.marca} onChange={v => setFNeum({ ...fNeum, marca: v })} ph="Bridgestone" />
              <Inp lbl="Medida" val={fNeum.medida} onChange={v => setFNeum({ ...fNeum, medida: v })} ph="265/65 R17" />
              <Inp lbl="Posición" val={fNeum.posicion} onChange={v => setFNeum({ ...fNeum, posicion: v })} ph="4 ruedas / Eje delantero" full />
              <Inp lbl="Costo (CLP)" val={fNeum.costo} onChange={v => setFNeum({ ...fNeum, costo: v })} type="number" ph="680000" />
              <Inp lbl="N° Boleta / Factura" val={fNeum.boleta} onChange={v => setFNeum({ ...fNeum, boleta: v })} ph="B-004513" />
              <Inp lbl="Observaciones" val={fNeum.obs} onChange={v => setFNeum({ ...fNeum, obs: v })} ph="Desgaste uniforme..." full />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={ss.btnS} onClick={() => setModNeum(false)}>Cancelar</button>
              <button style={ss.btnP} onClick={addNeum}>Guardar cambio</button>
            </div>
          </div>
        </div>
      )}

      {/* COSTO */}
      {modCosto && (
        <div style={ss.modal} onClick={closeOn(setModCosto)}>
          <div style={ss.mc}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: C.text }}>Registrar Costo</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={ss.lbl}>Vehículo *</label>
                <select style={ss.inp} value={fCosto.vehiculoId} onChange={e => setFCosto({ ...fCosto, vehiculoId: e.target.value })}>
                  <option value="">Seleccionar vehículo...</option>
                  {myVeh.map(v => <option key={v.id} value={v.id}>{v.patente} – {v.marca} {v.modelo}</option>)}
                </select>
              </div>
              <Inp lbl="Tipo de gasto" val={fCosto.tipo} onChange={v => setFCosto({ ...fCosto, tipo: v })} opts={TIPOS_COSTO} />
              <Inp lbl="Fecha" val={fCosto.fecha} onChange={v => setFCosto({ ...fCosto, fecha: v })} type="date" />
              <Inp lbl="Descripción" val={fCosto.descripcion} onChange={v => setFCosto({ ...fCosto, descripcion: v })} ph="Carga combustible COPEC" full />
              <Inp lbl="Monto (CLP)" val={fCosto.monto} onChange={v => setFCosto({ ...fCosto, monto: v })} type="number" ph="85000" />
              <Inp lbl="N° Boleta / Ticket" val={fCosto.boleta} onChange={v => setFCosto({ ...fCosto, boleta: v })} ph="T-001234" />
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={ss.lbl}>Conductor</label>
                <select style={ss.inp} value={fCosto.conductorId} onChange={e => setFCosto({ ...fCosto, conductorId: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {myCond.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "flex-end" }}>
              <button style={ss.btnS} onClick={() => setModCosto(false)}>Cancelar</button>
              <button style={ss.btnP} onClick={addCosto}>Guardar costo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
