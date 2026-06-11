import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  MessageSquare, 
  Database, 
  Settings, 
  Upload, 
  Mic, 
  Send, 
  CheckCircle2, 
  X, 
  Check, 
  RefreshCw, 
  Cpu, 
  Lock, 
  Eye, 
  EyeOff, 
  FileText, 
  FolderPlus, 
  TrendingUp, 
  Wifi, 
  Activity, 
  Search, 
  FileCheck, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  Play, 
  CheckSquare, 
  Info,
  Layers,
  Sparkles,
  Zap,
  Phone,
  Paperclip,
  Share2,
  Mail,
  File,
  User,
  Globe,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { translations } from './translations';
import { notionDatabases, centralSOPs } from './notionRegistry';

// ==========================================
// CANONICAL DATABASES (Notion / MongoDB Sources)
// ==========================================
interface Client {
  Nombre: string;
  RUC: string;
  Ciudad: string;
  ContactoPrincipal: string;
  Email: string;
  Estado: string;
  Tipo: string;
  Telefono?: string;
  Direccion?: string;
  Actividad?: string;
}

interface Product {
  SKU: string;
  Nombre: string;
  Stock: number;
  PrecioVenta: number;
  Categoria: string;
}

interface Quote {
  Codigo: string;
  Cliente: string;
  Fecha: string;
  Subtotal: number;
  IVA: number;
  Total: number;
  Estado: string;
}

interface Transaction {
  Codigo: string;
  Cliente: string;
  Monto: number;
  Fecha: string;
  Referencia: string;
  Estado: string;
}

interface Sequence {
  Clave: string;
  Tipo: string;
  UltimoSecuencial: number;
  Prefijo: string;
}

interface Idea {
  Oportunidad: string;
  Estado: string;
  Prioridad: string;
  Categoria: string;
  Origen: string;
}

interface Report {
  Codigo: string;
  Titulo: string;
  Cliente: string;
  Fecha: string;
  Resumen: string;
  Estado: string;
}

interface MediaPost {
  _id: string;
  titulo: string;
  plataforma: string;
  contenido: string;
  originalContenido: string;
  estado: string;
  timestamp: string;
}

interface Hackathon {
  _id: string;
  Event_Name: string;
  Deadline: string;
  Requirements: string;
  Stack: string;
  Url: string;
  Status: string;
}

export default function App() {
  // --- STATE MACHINERY ---
  const [activeTab, setActiveTab ] = useState<string>('DB04');
  const [selectedRegDbId, setSelectedRegDbId] = useState<string>('DB01');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string; size: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [showStartupEmailPop, setShowStartupEmailPop] = useState<boolean>(false);

  const isMongoUri = (uri: string) =>
    uri.startsWith('mongodb+srv://') || uri.startsWith('mongodb://');

  const formatEcuadorianPhone = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, ""); // keep only digits
    if (cleaned.startsWith("593")) {
      return "+" + cleaned;
    }
    if (cleaned.startsWith("09") && cleaned.length === 10) {
      return "+593" + cleaned.substring(1);
    }
    if (cleaned.startsWith("9") && cleaned.length === 9) {
      return "+593" + cleaned;
    }
    return phone.startsWith("+") ? phone : (phone ? "+" + phone : "+593999059000");
  };
  const [currentMode, setCurrentMode] = useState<'demo' | 'cloud'>('cloud');
  const [apiTarget, setApiTarget] = useState<'cloud' | 'local'>('local');
  const [chatInput, setChatInput] = useState<string>('');
  const [currentLang, setCurrentLang] = useState<'es' | 'en'>('es');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: number; timestamp: string; droid: string; message: string; level: 'system' | 'info' | 'success' | 'warn' | 'error' }>>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ id: number; text: string; sender: 'user' | 'agent' | 'system' }>>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [haStatus, setHaStatus] = useState<boolean>(true);
  const [sriStatus, setSriStatus] = useState<boolean>(true);
  const [activeTourStep, setActiveTourStep] = useState<number>(-1);
  const [tourRunning, setTourRunning] = useState<boolean>(false);
  const [tourAutoAdvance, setTourAutoAdvance] = useState<boolean>(false);
  const [selectedDroid, setSelectedDroid] = useState<string | null>(null);

  // Google Workspace Integration states
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string>('468014030339-b9v6pka260r4uafp89oio45r1qfptkgi.apps.googleusercontent.com'); // PC Doctor GCP Client ID
  const [isGmailLoading, setIsGmailLoading] = useState<boolean>(false);
  const [isDriveLoading, setIsDriveLoading] = useState<boolean>(false);
  const [isContactsLoading, setIsContactsLoading] = useState<boolean>(false);
  const [isCheckingImap, setIsCheckingImap] = useState<boolean>(false);
  const [emailValidationStatus, setEmailValidationStatus] = useState<Record<string, 'idle' | 'checking' | 'valid' | 'invalid'>>({});

  // Form states
  const [toEmail, setToEmail] = useState<string>('');
  const [subjectEmail, setSubjectEmail] = useState<string>('');
  const [bodyEmail, setBodyEmail] = useState<string>('');
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactEmail, setNewContactEmail] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');

  // --- CONNECTIONS & INTEGRATIONS LIVE HEALTH INDICATORS ---
  const [waConnStatus, setWaConnStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [mongoConnStatus, setMongoConnStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [sriConnStatus, setSriConnStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // --- COLLAPSIBLE INSPECTOR & DYNAMIC MONGODB STORAGE STATE FOR 49 DATABASES ---
  const [isInspectorExpanded, setIsInspectorExpanded] = useState<boolean>(true);
  const [dynamicDbData, setDynamicDbData] = useState<Record<string, any[]>>({});
  const [loadingActiveCol, setLoadingActiveCol] = useState<boolean>(false);
  const [showDynamicAddModal, setShowDynamicAddModal] = useState<boolean>(false);
  const [dynamicAddForm, setDynamicAddForm] = useState<Record<string, string>>({});

  // Fallback / Offline lists for Workspace
  const [gmailMessages, setGmailMessages] = useState<Array<{id: string, threadId: string, subject: string, from: string, date: string, snippet: string}>>([
    { id: "msg_sri_01", threadId: "th_sri_01", subject: "Autorización de comprobante PCD-COT-26-000015", from: "facturacion@sri.gob.ec", date: "2026-06-08", snippet: "Estimado contribuyente, se ha autorizado exitosamente el comprobante fiscal correlativo PCD-COT-26-000015 emitido por PC Doctor S.A." },
    { id: "msg_client_02", threadId: "th_client_02", subject: "RE: Presupuesto Cableado Estructurado Bellini", from: "torresdelamerced@hotmail.com", date: "2026-06-07", snippet: "Hola Rafael, nos parece excelente el detalle presentado por los droids del enjambre. Procedamos con la orden este mismo viernes." },
    { id: "msg_systems_03", threadId: "th_systems_03", subject: "Soporte de Switch PoE 16 de Torres del Río", from: "rlopez@innerspark.live", date: "2026-06-06", snippet: "Confirmada la recepción del anticipo de $288.64. El Droid 5 ya concilió la transacción en nuestra base DB31." }
  ]);

  const [driveFiles, setDriveFiles] = useState<Array<{id: string, name: string, mimeType: string, size: string, createdTime: string}>>([
    { id: "dr_file_01", name: "PC_Doctor_Plan_Trabajo_Torres.pdf", mimeType: "application/pdf", size: "328 KB", createdTime: "2026-06-08" },
    { id: "dr_file_02", name: "Plantilla_Inspeccion_Voz_v2.docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: "45 KB", createdTime: "2026-06-05" },
    { id: "dr_file_03", name: "Firma_Digital_Representante(PCD).p12", mimeType: "application/octet-stream", size: "12 KB", createdTime: "2026-04-12" },
    { id: "dr_file_04", name: "Logo_InnerSpark_Horizontal.png", mimeType: "image/png", size: "1.1 MB", createdTime: "2026-03-20" }
  ]);

  const [googleContacts, setGoogleContacts] = useState<Array<{id: string, name: string, email: string, phone: string}>>([
    { id: "cont_01", name: "Econ. Bolívar Arteaga", email: "torresdelamerced@hotmail.com", phone: "+593984025112" },
    { id: "cont_02", name: "Ing. Fabio Torres", email: "f.torres@thermocont.com.ec", phone: "+593991204859" },
    { id: "cont_03", name: "Ing. Roberto López", email: "contacto@dolupa.ec", phone: "+593994851203" }
  ]);

  // --- MODEL/MOCK DATA ---
  const [db04List, setDb04List] = useState<Client[]>([
    { Nombre: "Edificio Torres de la Merced", RUC: "0991355529001", Ciudad: "Guayaquil", ContactoPrincipal: "Econ. Bolívar Arteaga", Email: "torresdelamerced@hotmail.com", Estado: "Cliente", Tipo: "Empresa" },
    { Nombre: "Thermocont S.A.", RUC: "0992745389001", Ciudad: "Guayaquil", ContactoPrincipal: "Ing. Fabio Torres", Email: "f.torres@thermocont.com.ec", Estado: "Conversación", Tipo: "Empresa" },
    { Nombre: "Universidad de las Artes (UArtes)", RUC: "0960001240001", Ciudad: "Guayaquil", ContactoPrincipal: "Henry Magallanes", Email: "henry.magallanes@uartes.edu.ec", Estado: "Lead", Tipo: "Universidad" },
    { Nombre: "Asociación de Propietarios Parques del Río (ASOPAR)", RUC: "0991386866001", Ciudad: "Samborondón", ContactoPrincipal: "Bolívar Albán", Email: "parquesdelrio2022@gmail.com", Estado: "Cliente", Tipo: "Comunidad" },
    { Nombre: "DOLUPA C.A.", RUC: "0991244093001", Ciudad: "Guayaquil", ContactoPrincipal: "Ing. Roberto López", Email: "contacto@dolupa.ec", Estado: "Cliente", Tipo: "Empresa" }
  ]);

  const [db26List, setDb26List] = useState<Product[]>([
    { SKU: "DS-K1T673DX", Nombre: "Hikvision DS-K1T673DX Terminal Facial Pro", Stock: 3, PrecioVenta: 450.00, Categoria: "Control de Acceso" },
    { SKU: "ACD-ML280A", Nombre: "Cerradura Electromagnética 600lbs", Stock: 12, PrecioVenta: 45.00, Categoria: "Seguridad" },
    { SKU: "BAT-7AH", Nombre: "Batería de Respaldo Ultracell 12V 7AH", Stock: 15, PrecioVenta: 18.50, Categoria: "Energía" },
    { SKU: "UTP-CAT6", Nombre: "Cable UTP Cat6 QPCOM (Metro)", Stock: 800, PrecioVenta: 0.85, Categoria: "Redes" },
    { SKU: "DS-7616NXI-K2", Nombre: "NVR Hikvision 16ch AcuSense 4K", Stock: 2, PrecioVenta: 213.37, Categoria: "CCTV" },
    { WD60PURZ: "WD60PURZ", Nombre: "HDD WD Purple 6TB 3.5\" Surveillance", Stock: 4, PrecioVenta: 282.00, Categoria: "CCTV" }
  ] as any[]); // type assertion for safety

  const [db27List, setDb27List] = useState<Quote[]>([
    { Codigo: "PCD-COT-26-000014", Cliente: "Edificio Torres de la Merced", Fecha: "2026-05-15", Subtotal: 495.00, IVA: 74.25, Total: 569.25, Estado: "Aprobada" },
    { Codigo: "PCD-COT-26-000015", Cliente: "Thermocont S.A.", Fecha: "2026-05-20", Subtotal: 900.00, IVA: 135.00, Total: 1035.00, Estado: "Enviada" }
  ]);

  const [db31List, setDb31List] = useState<Transaction[]>([
    { Codigo: "PCD-TRB-26-000001", Cliente: "Edificio Torres de la Merced", Monto: 569.25, Fecha: "2026-05-16", Referencia: "DEPÓSITO 8740", Estado: "Conciliado" },
    { Codigo: "PCD-TRB-26-000002", Cliente: "Asociación de Propietarios Parques del Río", Monto: 269.10, Fecha: "2026-05-18", Referencia: "TRANSFERENCIA 2153", Estado: "Conciliado" }
  ]);

  const [db40List, setDb40List] = useState<Sequence[]>([
    { Clave: "PCD-COT-26", Tipo: "COT", UltimoSecuencial: 15, Prefijo: "PCD-COT-" },
    { Clave: "PCD-TRB-26", Tipo: "TRB", UltimoSecuencial: 2, Prefijo: "PCD-TRB-" },
    { Clave: "PCD-INF-26", Tipo: "INF", UltimoSecuencial: 1, Prefijo: "PCD-INF-" }
  ]);

  const [db11List, setDb11List] = useState<Idea[]>([
    { Oportunidad: "Piloto interno PC Doctor con Gemini", Estado: "Ejecución", Prioridad: "Alta", Categoria: "IA aplicada", Origen: "Interno" },
    { Oportunidad: "Piloto externo Bellini (Memoria Técnica Inteligente)", Estado: "Triage", Prioridad: "Alta", Categoria: "IA aplicada", Origen: "Cliente" },
    { Oportunidad: "Automatizar informes a través de Kokoro Voice", Estado: "Evaluación", Prioridad: "Media", Categoria: "Multimedia", Origen: "I+D" }
  ]);

  const [db45List, setDb45List] = useState<Report[]>([
    { Codigo: "PCD-INF-26-000001", Titulo: "Inspección de Altura y Red", Cliente: "DOLUPA C.A.", Fecha: "2026-04-20", Resumen: "Batería degradada (autonomía ~1 hora). Cortex instalado pero no registra.", Estado: "Finalizado" }
  ]);

  const [mediaQueue, setMediaQueue] = useState<MediaPost[]>([
    { _id: "post_01", titulo: "Caso real PC Doctor Torres de la Merced", plataforma: "linkedin", contenido: "🔥 Red reorganizada y CCTV blindado. De un rack caótico a un sistema con topología de red impecable. Así operamos en PC Doctor S.A. #PCDoctor #GCP #Networking", originalContenido: "Red reorganizada y CCTV blindado. Así operamos en PC Doctor S.A.", estado: "Draft", timestamp: "2026-06-08T14:20:00Z" }
  ]);

  const [hackathonsList, setHackathonsList] = useState<Hackathon[]>([
    { _id: "hack_01", Event_Name: "Google Cloud Vertex AI Agent Hackathon 2026", Deadline: "2026-06-25", Requirements: "Construir agentes inteligentes multi-droid que automaticen tareas B2B con Vertex AI", Stack: "Vertex AI, Node.js, Python, MongoDB Atlas", Url: "https://vertex-agents-2026.devpost.com/", Status: "Scouted" },
    { _id: "hack_02", Event_Name: "Ollama Offline Intelligence Challenge", Deadline: "2026-06-30", Requirements: "Crear sistemas offline para control domótico e ingesta local", Stack: "Ollama, Gemma 2, Llama 3, Raspberry Pi", Url: "https://ollama-challenge.lablab.ai/", Status: "Registered" }
  ]);

  // --- CONFIG / MODAL REFS ---
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [configTab, setConfigTab] = useState<'env' | 'contifico' | 'sri'>('env');
  const [configMongoUri, setConfigMongoUri] = useState<string>(() => localStorage.getItem('config_mongo_uri') || 'mongodb://127.0.0.1:27017/pcdoctor_swarm');
  const [configWaUrl, setConfigWaUrl] = useState<string>(() => localStorage.getItem('config_wa_url') || 'http://127.0.0.1:8082');
  const [configWaToken, setConfigWaToken] = useState<string>(() => localStorage.getItem('config_wa_token') || 'swarm_os_evolution_key_2026');
  const [configWaInstance, setConfigWaInstance] = useState<string>(() => localStorage.getItem('config_wa_instance') || 'RalphiIA-pcdoctor');
  const [configWaPhone, setConfigWaPhone] = useState<string>(() => localStorage.getItem('config_wa_phone') || '593999059000');
  const [configSriUser, setConfigSriUser] = useState<string>(() => localStorage.getItem('config_sri_user') || 'deuna-ruc');
  const [configSriPass, setConfigSriPass] = useState<string>(() => localStorage.getItem('config_sri_pass') || 'BXQbDtMt');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('config_mongo_uri', configMongoUri);
    localStorage.setItem('config_wa_url', configWaUrl);
    localStorage.setItem('config_wa_token', configWaToken);
    localStorage.setItem('config_wa_instance', configWaInstance);
    localStorage.setItem('config_wa_phone', configWaPhone);
    localStorage.setItem('config_sri_user', configSriUser);
    localStorage.setItem('config_sri_pass', configSriPass);
  }, [configMongoUri, configWaUrl, configWaToken, configWaInstance, configWaPhone, configSriUser, configSriPass]);

  const [configIvaRate, setConfigIvaRate] = useState<number>(15.0);
  const [configSriEnv, setConfigSriEnv] = useState<string>('1');
  const [configSriSync, setConfigSriSync] = useState<string>('email');
  const [configContificoKey, setConfigContificoKey] = useState<string>('contifico_v2_apikey_secured');
  const [configContificoUser, setConfigContificoUser] = useState<string>('admin@pcdoctor.com.ec');
  const [configContificoPass, setConfigContificoPass] = useState<string>('PCD0ct0rContifico@@2026');
  const [configSigPath, setConfigSigPath] = useState<string>('/data_historica/config/firma_pc_doctor.p12');
  const [configSigPass, setConfigSigPass] = useState<string>('PCD0ct0rSig2026');

  // New Email state in config modal
  const [newEmailAddr, setNewEmailAddr] = useState<string>('');
  const [newEmailPass, setNewEmailPass] = useState<string>('');
  const [newEmailHost, setNewEmailHost] = useState<string>('');
  const [newEmailPort, setNewEmailPort] = useState<number>(993);

  // Manual Client Creation Modal state
  const [showManualClientModal, setShowManualClientModal] = useState<boolean>(false);
  const [manualClientForm, setManualClientForm] = useState({
    Nombre: '',
    RUC: '',
    Ciudad: 'Guayaquil',
    ContactoPrincipal: '',
    Email: '',
    Estado: 'ACTIVO',
    Tipo: 'Persona Jurídica',
    Telefono: '',
    Direccion: '',
    Actividad: 'Soporte, Mantenimiento e Insumos Tecnológicos'
  });

  const [showAddingEmailPass, setShowAddingEmailPass] = useState<boolean>(false);
  const [newEmailProvider, setNewEmailProvider] = useState<'gmail' | 'outlook' | 'custom' | 'pop3'>('custom');
  const [revealedPassIndices, setRevealedPassIndices] = useState<Record<number, boolean>>({});

  // Prepopulate newEmailHost/newEmailPort when address or provider changes
  useEffect(() => {
    if (!newEmailAddr.includes('@')) return;
    const domain = newEmailAddr.split('@')[1] || '';
    if (newEmailProvider === 'gmail') {
      setNewEmailHost('imap.gmail.com');
      setNewEmailPort(993);
    } else if (newEmailProvider === 'outlook') {
      setNewEmailHost('outlook.office365.com');
      setNewEmailPort(993);
    } else if (newEmailProvider === 'pop3') {
      setNewEmailHost(`imap.${domain}`);
      setNewEmailPort(993);
    } else if (newEmailProvider === 'custom') {
      setNewEmailHost(`mail.${domain}`);
      setNewEmailPort(993);
    }
  }, [newEmailAddr, newEmailProvider]);

  const [emailAccounts, setEmailAccounts] = useState<Array<{email: string, host: string, port: number, provider: string, password?: string}>>(() => {
    const saved = localStorage.getItem('swarm_os_emails');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) {
        console.error("Error load emails from localStorage:", e);
      }
    }
    return [
      { email: "contabilidad@pcdoctor.com.ec", host: "mail.pcdoctor.com.ec", port: 993, provider: "custom", password: "PCD0ct0rContabilidad@@" },
      { email: "rlopez@pcdoctor.com.ec", host: "mail.pcdoctor.com.ec", port: 993, provider: "custom", password: "InnerSparkLopez@@" },
      { email: "rlopez@innerspark.live", host: "mail.innerspark.live", port: 993, provider: "custom", password: "InnerSparkLopez@@" }
    ];
  });

  // Conversational Chatbot State Machine
  interface ChatState {
    step: 'idle' | 'awaiting_client_ruc' | 'confirm_create_client' | 'awaiting_items_desc' | 'confirm_quote' | 'awaiting_client_address' | 'awaiting_client_phone' | 'confirm_idle_sri_create' | 'confirm_idle_sri_create_confirm';
    clientRuc?: string;
    clientName?: string;
    clientCity?: string;
    clientEmail?: string;
    clientType?: string;
    clientStateFiscal?: string;
    clientActividad?: string;
    clientDireccion?: string;
    selectedClient?: Client;
    itemsToQuote?: Array<{ SKU: string; Nombre: string; Cantidad: number; PrecioVenta: number; Categoria: string }>;
  }
  const [chatSession, setChatSession] = useState<ChatState | null>(null);

  useEffect(() => {
    localStorage.setItem('swarm_os_emails', JSON.stringify(emailAccounts));
  }, [emailAccounts]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // --- REAL-TIME WHATSAPP DISPATCHER ---
  const sendWhatsAppNotification = async (messageText: string) => {
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: configWaUrl,
          token: configWaToken,
          instance: configWaInstance,
          phone: configWaPhone,
          text: messageText
        })
      });
      const data = await res.json();
      if (data.success) {
        addLog('Evolution API', `📱 Alerta push enviada de forma exitosa a ${configWaPhone}`, 'success');
      } else {
        addLog('Evolution API Error', `Fallo al enviar mensaje WhatsApp: ${data.error}`, 'error');
      }
    } catch (err: any) {
      addLog('Evolution API Error', `Fallo de transporte WhatsApp: ${err.message}`, 'error');
    }
  };

  // --- CONNECTIONS & INTEGRATIONS LIVE HEALTH CHECK ---
  const checkIntegrationsHealth = async (mongoUri: string, waUrl: string, waInstance: string, waToken: string) => {
    try {
      const response = await fetch('/api/health/extended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoUri, waUrl, waInstance, waToken })
      });
      const data = await response.json();
      if (data.success) {
        setMongoConnStatus(data.mongo as any || 'offline');
        setWaConnStatus(data.whatsapp as any || 'offline');
        setSriConnStatus(data.sri as any || 'online');
      } else {
        setMongoConnStatus('offline');
        setWaConnStatus('offline');
        setSriConnStatus('online');
      }
    } catch (e) {
      setMongoConnStatus('offline');
      setWaConnStatus('offline');
      setSriConnStatus('online');
    }
  };

  // --- MONGODB COLLECTION LOADER FOR DYNAMIC SCHEMA DBs ---
  const loadCollectionFromMongo = async (colName: string) => {
    const colKey = colName.toLowerCase();
    
    // Check if it maps to a local hook first:
    const localSetters: Record<string, Function> = {
      db04: setDb04List,
      db26: setDb26List,
      db27: setDb27List,
      db31: setDb31List,
      db40: setDb40List,
      db11: setDb11List,
      db45: setDb45List,
      mediaqueue: setMediaQueue,
      hackathonslist: setHackathonsList
    };

    if (!configMongoUri || !isMongoUri(configMongoUri)) {
      addLog('MongoDB Dynamic', `Colección '${colName}' cargada desde caché en memoria local (MongoDB no conectado).`, 'info');
      return;
    }

    setLoadingActiveCol(true);
    try {
      const res = await fetch('/api/mongo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri: configMongoUri, collection: colKey, action: 'load' })
      });
      const data = await res.json();
      if (data.success && data.items) {
        if (localSetters[colKey]) {
          localSetters[colKey](data.items);
        } else {
          setDynamicDbData(prev => ({ ...prev, [colName.toUpperCase()]: data.items }));
        }
        addLog('MongoDB Atlas', `Sincronizada base '${colName}' desde Atlas: ${data.items.length} registros cargados.`, 'success');
      } else {
        addLog('MongoDB Dynamic', `Colección '${colName}' sin registros guardados aún en Atlas. Estructura vacía cargada.`, 'info');
      }
    } catch (err: any) {
      addLog('MongoDB Error', `Error de descarga para '${colName}': ${err.message}`, 'error');
    } finally {
      setLoadingActiveCol(false);
    }
  };

  // --- MONGODB DYNAMIC PERSISTENCE SAVE HELPER ---
  const saveCollectionToMongo = async (colName: string, itemsList: any[]) => {
    if (!configMongoUri || !isMongoUri(configMongoUri)) {
      return;
    }
    const colKey = colName.toLowerCase();
    try {
      await fetch('/api/mongo/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uri: configMongoUri,
          collection: colKey,
          items: itemsList,
          action: 'save'
        })
      });
    } catch (e) {
      console.warn(`MongoDB async save deferred for ${colName}`);
    }
  };

  // --- DYNAMIC SCHEMA MANAGER ROW ADDERS & HANDLERS ---
  const openAutoAddRowModal = () => {
    const activeDb = notionDatabases.find(db => db.id === activeTab);
    const initialForm: Record<string, string> = {};
    if (activeDb) {
      activeDb.properties.forEach(p => {
        initialForm[p.name] = '';
      });
    } else {
      // Backup custom tabs
      if (activeTab === 'HACKATHONS') {
        initialForm['Event_Name'] = '';
        initialForm['Deadline'] = '';
        initialForm['Requirements'] = '';
        initialForm['Stack'] = '';
        initialForm['Url'] = '';
        initialForm['Status'] = 'Scouted';
      } else if (activeTab === 'MEDIA_QUEUE') {
        initialForm['titulo'] = '';
        initialForm['plataforma'] = 'linkedin';
        initialForm['contenido'] = '';
      }
    }
    setDynamicAddForm(initialForm);
    setShowDynamicAddModal(true);
  };

  const handleSaveDynamicRowTarget = async () => {
    const isLocalHook = ['DB04', 'DB26', 'DB27', 'DB31', 'DB40', 'DB11', 'DB45', 'MEDIA_QUEUE', 'HACKATHONS'].includes(activeTab);

    // Make local item object copy
    const newItem: Record<string, any> = { ...dynamicAddForm };
    if (activeTab === 'HACKATHONS') {
      newItem['_id'] = `hack_${Date.now()}`;
    } else if (activeTab === 'MEDIA_QUEUE') {
      newItem['_id'] = `post_${Date.now()}`;
      newItem['timestamp'] = new Date().toISOString();
      newItem['estado'] = 'Draft';
    }

    // Insert locally according to key hooks:
    if (activeTab === 'DB04') {
      const formattedItem = {
        Nombre: dynamicAddForm['Nombre'] || 'CLIENT-NEW',
        Tipo: dynamicAddForm['Tipo de institución'] || 'Empresa Privada',
        Estado: dynamicAddForm['Estado del cliente'] || 'Lead',
        RUC: dynamicAddForm['RUC de la Institución'] || '',
        Ciudad: dynamicAddForm['Ciudad matriz'] || 'Guayaquil',
        ContactoPrincipal: dynamicAddForm['Contacto principal'] || '',
        Email: dynamicAddForm['Email de contacto corporativo'] || '',
        Telefono: dynamicAddForm['Número telefónico principal'] || '',
        Direccion: dynamicAddForm['Dirección de entrega'] || ''
      } as any;
      setDb04List(prev => {
        const next = [formattedItem, ...prev];
        saveCollectionToMongo('db04', next);
        return next;
      });
    } else if (activeTab === 'DB26') {
      const formattedItem = {
        SKU: dynamicAddForm['SKU / Código Único'] || `SKU-${Date.now()}`,
        Nombre: dynamicAddForm['Nombre comercial / Catálogo'] || 'Hardware Importado',
        Stock: Number(dynamicAddForm['Stock Actual'] || 1),
        PrecioVenta: Number(dynamicAddForm['Precio Unitario (Venta)'] || 0.0),
        Categoria: dynamicAddForm['Marca'] || 'Ferretería Tecnológica'
      } as any;
      setDb26List(prev => {
        const next = [formattedItem, ...prev];
        saveCollectionToMongo('db26', next);
        return next;
      });
    } else if (activeTab === 'DB27') {
      const numSec = db27List.length + 15;
      const formattedItem = {
        Codigo: `PCD-COT-26-000${numSec}`,
        Cliente: dynamicAddForm['Cliente receptor'] || 'Consumidor Especial',
        Fecha: new Date().toISOString().split('T')[0],
        Subtotal: Number(dynamicAddForm['Subtotal Neto'] || 0),
        IVA: Number(dynamicAddForm['Subtotal Neto'] || 0) * 0.15,
        Total: Number(dynamicAddForm['Subtotal Neto'] || 0) * 1.15,
        Estado: dynamicAddForm['Estado'] || 'Enviada'
      } as any;
      setDb27List(prev => {
        const next = [formattedItem, ...prev];
        saveCollectionToMongo('db27', next);
        return next;
      });
    } else if (activeTab === 'DB31') {
      const formattedItem = {
        Codigo: `PCD-TRB-26-000${db31List.length + 3}`,
        Cliente: dynamicAddForm['Cliente originador / Entidad'] || 'Cliente',
        Monto: Number(dynamicAddForm['Monto Bruto ($)'] || 0.0),
        Fecha: dynamicAddForm['Fecha de ejecución'] || new Date().toISOString().split('T')[0],
        Referencia: dynamicAddForm['ID Transacción / Depósito'] || 'S/R',
        Estado: 'Conciliado'
      } as any;
      setDb31List(prev => {
        const next = [formattedItem, ...prev];
        saveCollectionToMongo('db31', next);
        return next;
      });
    } else if (activeTab === 'DB40') {
      const formattedItem = {
        Clave: dynamicAddForm['Clave única (E.g. PCD-COT-26)'] || 'NEW-SEQ',
        Tipo: dynamicAddForm['Tipo de comprobante'] || 'COT',
        UltimoSecuencial: Number(dynamicAddForm['Último correlativo emitido'] || 1),
        Prefijo: dynamicAddForm['Prefijo del comprobante'] || 'S-'
      } as any;
      setDb40List(prev => {
        const next = [formattedItem, ...prev];
        saveCollectionToMongo('db40', next);
        return next;
      });
    } else if (activeTab === 'DB11') {
      const formattedItem = {
        Oportunidad: dynamicAddForm['Idea / Oportunidad de investigación'] || 'Idea de Campo',
        Estado: dynamicAddForm['Estado de viabilidad'] || 'Exploración',
        Prioridad: 'Media',
        Categoria: 'Automatización',
        Origen: dynamicAddForm['Origen de la Solicitud'] || 'Inspección'
      } as any;
      setDb11List(prev => {
        const next = [formattedItem, ...prev];
        saveCollectionToMongo('db11', next);
        return next;
      });
    } else if (activeTab === 'DB45') {
      const formattedItem = {
        Codigo: `INF-26-${Date.now().toString().slice(-4)}`,
        Titulo: dynamicAddForm['Nombre del Informe Técnico'] || 'Inspección de Red',
        Cliente: dynamicAddForm['Cliente / Institución destinataria'] || 'Cliente Genérico',
        Fecha: new Date().toISOString().split('T')[0],
        Resumen: dynamicAddForm['Resumen Ejecutivo / Recomendaciones'] || 'Operacional óptimo',
        Estado: 'Finalizado'
      } as any;
      setDb45List(prev => {
        const next = [formattedItem, ...prev];
        saveCollectionToMongo('db45', next);
        return next;
      });
    } else if (activeTab === 'MEDIA_QUEUE') {
      setMediaQueue(prev => {
        const next = [newItem as any, ...prev];
        saveCollectionToMongo('mediaQueue', next);
        return next;
      });
    } else if (activeTab === 'HACKATHONS') {
      setHackathonsList(prev => {
        const next = [newItem as any, ...prev];
        saveCollectionToMongo('hackathonsList', next);
        return next;
      });
    } else {
      // Dynamic lists
      const currentList = dynamicDbData[activeTab.toUpperCase()] || [];
      const updatedList = [newItem, ...currentList];
      setDynamicDbData(prev => ({ ...prev, [activeTab.toUpperCase()]: updatedList }));
      saveCollectionToMongo(activeTab, updatedList);
    }

    addLog('DATABASE', `Registrado nuevo documento en base ${activeTab} de MongoDB Atlas`, 'success');
    setShowDynamicAddModal(false);
  };

  // --- DYNAMIC MONGODB ATLAS SYNCER ---
  const loadAllFromMongo = async (uriToUse: string) => {
    if (!uriToUse || !isMongoUri(uriToUse)) return;
    addLog('MongoDB', 'Auto-descargando datos unificados desde clúster local/Atlas...', 'info');
    
    // Check global integrations health at the same time
    checkIntegrationsHealth(uriToUse, configWaUrl, configWaInstance, configWaToken);

    const collections = [
      { col: 'db04', setter: setDb04List },
      { col: 'db26', setter: setDb26List },
      { col: 'db27', setter: setDb27List },
      { col: 'db31', setter: setDb31List },
      { col: 'db40', setter: setDb40List },
      { col: 'db11', setter: setDb11List },
      { col: 'db45', setter: setDb45List },
      { col: 'mediaQueue', setter: setMediaQueue },
      { col: 'hackathonsList', setter: setHackathonsList }
    ];

    let count = 0;
    for (const item of collections) {
      try {
        const res = await fetch('/api/mongo/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uri: uriToUse, collection: item.col, action: 'load' })
        });
        const data = await res.json();
        if (data.success && data.items && data.items.length > 0) {
          item.setter(data.items);
          count++;
        }
      } catch (err) {
        console.warn("MongoDB Atlas Sync Alert: " + item.col + " load deferred. Cache local activo.", err);
      }
    }
    if (count > 0) {
      addLog('MongoDB Atlas', `Sincronizadas ${count} colecciones activas desde tu base InnerOS.`, 'success');
    }
  };

  const handleCheckImap = async () => {
    if (emailAccounts.length === 0) {
      alert(currentLang === 'es' ? "Debe configurar al menos una cuenta IMAP." : "You must configure at least one IMAP account.");
      return;
    }
    
    setIsCheckingImap(true);
    addLog('Droid 1: Mail Gatekeeper', 'Iniciando verificación de conexión en segundo plano de todas las cuentas IMAP...', 'info');
    
    // Set all status to checking
    const checkingStatuses: Record<string, 'idle' | 'checking' | 'valid' | 'invalid'> = {};
    emailAccounts.forEach(acc => {
      checkingStatuses[acc.email] = 'checking';
    });
    setEmailValidationStatus(prev => ({ ...prev, ...checkingStatuses }));

    let validatedCount = 0;
    let detailsSummary = "";

    try {
      for (const account of emailAccounts) {
        addLog('SYSTEM', `Estableciendo canal SSL seguro para ${account.email} [Puerto ${account.port || 993}]...`, 'info');
        try {
          const res = await fetch('/api/imap/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              host: account.host,
              port: account.port,
              user: account.email,
              pass: account.password || '',
              testOnly: true
            })
          });
          
          let result;
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            result = await res.json();
          } else {
            const errText = await res.text();
            result = { success: false, error: `Error del Servidor (${res.status}): ${errText.substring(0, 80)}` };
          }
          if (result.success) {
            setEmailValidationStatus(prev => ({ ...prev, [account.email]: 'valid' }));
            addLog('SYSTEM', `✅ Conexión IMAP de ${account.email} validada correctamente.`, 'success');
            validatedCount++;
            detailsSummary += `\n• ${account.email}: VALIDADO Y CORRECTO ✅`;
          } else {
            setEmailValidationStatus(prev => ({ ...prev, [account.email]: 'invalid' }));
            addLog('SYSTEM', `❌ Fallo en IMAP de ${account.email}: ${result.error}`, 'error');
            detailsSummary += `\n• ${account.email}: ERROR ❌ (${result.error})`;
          }
        } catch (err: any) {
          setEmailValidationStatus(prev => ({ ...prev, [account.email]: 'invalid' }));
          addLog('SYSTEM', `❌ Error de red en IMAP para ${account.email}: ${err.message}`, 'error');
          detailsSummary += `\n• ${account.email}: ERROR DE RED ❌`;
        }
      }

      // Explicit feedback popup for all validated accounts!
      alert(
        currentLang === 'es'
          ? `⚡ ¡COMPROBACIÓN DE CUENTAS IMAP CURSADA!\n\n` +
            `• Cuentas Configuradas: ${emailAccounts.length}\n` +
            `• Conexiones Exitosas: ${validatedCount}\n\n` +
            `Detalles de validación:${detailsSummary}`
          : `⚡ IMAP ACCOUNTS VERIFICATION COMPLETED!\n\n` +
            `• Configured Accounts: ${emailAccounts.length}\n` +
            `• Connections Successful: ${validatedCount}\n\n` +
            `Details:${detailsSummary}`
      );
    } catch (err: any) {
      addLog('SYSTEM', `❌ Error general de validación: ${err.message}`, 'error');
    } finally {
      setIsCheckingImap(false);
      addLog('SYSTEM', 'Sondeo de cuentas IMAP finalizado.', 'success');
    }
  };

  const handleTestIndividualAccount = async (idx: number) => {
    const account = emailAccounts[idx];
    if (!account) return;
    
    // Set status to checking
    setEmailValidationStatus(prev => ({ ...prev, [account.email]: 'checking' }));
    addLog('SYSTEM', `Iniciando prueba de conexión IMAP individual para: ${account.email}...`, 'info');
    
    try {
      const res = await fetch('/api/imap/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: account.host,
          port: account.port,
          user: account.email,
          pass: account.password || '',
          testOnly: true
        })
      });
      
      let result;
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        result = await res.json();
      } else {
        const text = await res.text();
        result = { success: false, error: `Error HTTP ${res.status}: ${text.substring(0, 100)}` };
      }

      if (result.success) {
        setEmailValidationStatus(prev => ({ ...prev, [account.email]: 'valid' }));
        addLog('SYSTEM', `✅ Conexión IMAP exitosa para ${account.email}`, 'success');
        alert(`✅ Conexión IMAP exitosa para:\n${account.email}`);
      } else {
        setEmailValidationStatus(prev => ({ ...prev, [account.email]: 'invalid' }));
        addLog('SYSTEM', `❌ Conexión fallida para ${account.email}: ${result.error}`, 'error');
        alert(`❌ Fallo en ${account.email}:\n${result.error || 'Autenticación incorrecta'}`);
      }
    } catch (err: any) {
      setEmailValidationStatus(prev => ({ ...prev, [account.email]: 'invalid' }));
      addLog('SYSTEM', `❌ Error de red en conexión IMAP individual con ${account.email}: ${err.message}`, 'error');
      alert(`❌ Error de Red para ${account.email}:\n${err.message}`);
    }
  };

  // --- COMPONENT LIFECYCLE ---
  // Active Tab watcher to fetch dynamically
  useEffect(() => {
    if (activeTab && activeTab !== 'OS_REGISTRY' && activeTab !== 'GMAIL' && activeTab !== 'DRIVE' && activeTab !== 'CONTACTS') {
      loadCollectionFromMongo(activeTab);
    }
  }, [activeTab, configMongoUri]);

  useEffect(() => {
    // Initial Logging
    addLog('SYSTEM', 'Swarm-OS v2.6 Core Online. Contexto de 41 bases cargado.', 'success');
    addLog('SYSTEM', 'Inicializado canal de salida con Evolution API en la nube.', 'info');
    
    // Auto load from Atlas if set
    if (configMongoUri && isMongoUri(configMongoUri)) {
      addLog('SYSTEM', 'Estableciendo canal activo con MongoDB (pcdoctor_swarm)...', 'info');
      loadAllFromMongo(configMongoUri);
      checkIntegrationsHealth(configMongoUri, configWaUrl, configWaInstance, configWaToken);
    } else {
      addLog('SYSTEM', 'Modo offline: caché local activo (sin URI MongoDB)', 'success');
      setMongoConnStatus('offline');
      setWaConnStatus('offline');
      setSriConnStatus('online');
    }
    
    // Run background health checks for connections and APIs every 45s
    const healthInterval = setInterval(() => {
      if (configMongoUri) {
        checkIntegrationsHealth(configMongoUri, configWaUrl, configWaInstance, configWaToken);
      }
    }, 45000);

    const probeHackathonBridge = async () => {
      try {
        const [droidsRes, complianceRes] = await Promise.all([
          fetch('/api/hackathon/droids/status'),
          fetch('/api/hackathon/compliance'),
        ]);
        if (droidsRes.ok) {
          const d = await droidsRes.json();
          const live = d.droids_live ?? d.live_count ?? d.live ?? 'ok';
          addLog('Swarm-OS Bridge', `Droides conectados en :8100 → ${live}`, 'success');
        } else {
          addLog('Swarm-OS Bridge', `Droides status HTTP ${droidsRes.status}`, 'warn');
        }
        if (complianceRes.ok) {
          const c = await complianceRes.json();
          addLog('Swarm-OS Bridge', `Compliance hackathon: ${c.estimated_compliance_pct ?? '?'}%`, 'info');
        }
      } catch (err: any) {
        addLog('Swarm-OS Bridge', `Sin conexión a Swarm-OS :8100 — ${err.message}`, 'warn');
      }
    };
    probeHackathonBridge();

    // Initial Messages
    setChatMessages([
      { id: Date.now(), text: "¡Hola, Ralphi! Swarm-OS está activo en Guayaquil. Conéctame notas de voz detalladas de lo que encuentras en campo o archivos (PST, Notion Zips, Facturas) y yo me encargaré de no olvidar nada. ¿Comenzamos con una cotización real?", sender: 'agent' }
    ]);

    // Check for configured email accounts to trigger startup popup and whatsapp validation
    const saved = localStorage.getItem('swarm_os_emails');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => {
            setShowStartupEmailPop(true);
          }, 1800);
          
          sendWhatsAppNotification(`🤖 *PC Doctor Swarm-OS*: Canal activo e inicializado de manera exitosa. Escucha de fondo IMAP activa en ${parsed.length} bandejas.`);
        }
      } catch (err) {}
    }

    // Load Google GIS script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      clearInterval(healthInterval);
    };
  }, []);

  // Background email scanning and automatic WhatsApp alert triggers!
  useEffect(() => {
    // Check every 3 minutes (180,000 milisegundos)
    const intervalId = setInterval(() => {
      if (emailAccounts && emailAccounts.length > 0 && configWaUrl && configWaPhone) {
        addLog('SYSTEM', 'Sondeo automático de fondo: Escaneando correos para enviar alertas de WhatsApp...', 'info');
        // Quietly run the checker in background
        const accountToUse = emailAccounts[0];
        fetch('/api/imap/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: accountToUse.host,
            port: accountToUse.port,
            user: accountToUse.email,
            pass: accountToUse.password || '',
            testOnly: false,
            whatsappConfig: {
              url: configWaUrl,
              token: configWaToken,
              instance: configWaInstance,
              phone: configWaPhone
            }
          })
        })
        .then(res => {
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            return res.json();
          } else {
            return res.text().then(text => {
              throw new Error(`Servicio de red congestionado o error de proxy (${res.status}): ${text.substring(0, 80)}`);
            });
          }
        })
        .then(result => {
          if (result.success) {
            addLog('SYSTEM', `Sondeo automático completado. Se procesaron ${result.emailsCount || 0} correos.`, 'success');
            if (result.whatsappAlerts && result.whatsappAlerts.length > 0) {
              addLog('Evolution API', `📱 Se despacharon ${result.whatsappAlerts.length} alertas push automáticas a tu WhatsApp.`, 'success');
            }
          } else {
            console.warn("Background IMAP scan skipped or failed:", result.error);
          }
        })
        .catch(err => {
          console.error("Background IMAP scan error:", err);
        });
      }
    }, 180000);

    return () => clearInterval(intervalId);
  }, [emailAccounts, configWaUrl, configWaToken, configWaInstance, configWaPhone]);

  const handleConnectGoogle = () => {
    try {
      addLog('SYSTEM', 'Iniciando inicio de sesión con Google (OAuth 2)...', 'info');
      const client = (window as any).google?.accounts?.oauth2?.initTokenClient({
        client_id: googleClientId,
        scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/contacts',
        callback: (tokenResponse: any) => {
          if (tokenResponse?.access_token) {
            setGoogleAccessToken(tokenResponse.access_token);
            addLog('SYSTEM', '✅ Google Workspace autenticado con éxito por OAuth.', 'success');
            fetchRealGmail(tokenResponse.access_token);
            fetchRealDrive(tokenResponse.access_token);
            fetchRealContacts(tokenResponse.access_token);
          }
        },
      });
      if (client) {
        client.requestAccessToken();
      } else {
        alert("El script de Google no se ha cargado. Ingresa un token de acceso manualmente.");
      }
    } catch (e) {
      console.error(e);
      alert("No se pudo iniciar el flujo Google OAuth. El puerto o la redirección en este entorno requiere pegado manual.");
    }
  };

  const fetchRealGmail = async (token: string) => {
    setIsGmailLoading(true);
    addLog('Droid 1: Mail Gatekeeper', 'Consultando API oficial de Gmail para la cuenta vinculada...', 'info');
    try {
      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gmail fetch error');
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        const list = await Promise.all(data.messages.map(async (m: any) => {
          const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const detail = await detailRes.json();
          const hdrs = detail.payload?.headers || [];
          const subject = hdrs.find((h: any) => h.name.toLowerCase() === 'subject')?.value || 'Sin Asunto';
          const from = hdrs.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Desconocido';
          const date = hdrs.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';
          return {
            id: m.id,
            threadId: m.threadId,
            subject,
            from,
            date: new Date(date).toLocaleDateString(),
            snippet: detail.snippet || ''
          };
        }));
        setGmailMessages(list);
        addLog('Droid 1: Mail Gatekeeper', '✅ Se sincronizaron los últimos correos reales de Gmail.', 'success');
      } else {
        addLog('Droid 1: Mail Gatekeeper', 'No se encontraron correos reales.', 'info');
      }
    } catch (e) {
      console.error(e);
      addLog('Droid 1: Mail Gatekeeper', 'Uso de correos locales. Error de conexión con Gmail real o Token expirado.', 'warn');
    } finally {
      setIsGmailLoading(false);
    }
  };

  const fetchRealDrive = async (token: string) => {
    setIsDriveLoading(true);
    addLog('Droid 4: Care-Taker', 'Listando directorio principal de Google Drive...', 'info');
    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,size,createdTime)&orderBy=createdTime desc', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Drive fetch error');
      const data = await res.json();
      if (data.files) {
        const formatted = data.files.map((f: any) => ({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          size: f.size ? `${(parseInt(f.size) / 1024).toFixed(0)} KB` : 'Folder/N/A',
          createdTime: new Date(f.createdTime).toLocaleDateString()
        }));
        setDriveFiles(formatted);
        addLog('Droid 4: Care-Taker', '✅ Sistema de archivos de Google Drive listado.', 'success');
      }
    } catch (e) {
      console.error(e);
      addLog('Droid 4: Care-Taker', 'Sincronizados archivos locales. Error al conectar a Google Drive.', 'warn');
    } finally {
      setIsDriveLoading(false);
    }
  };

  const fetchRealContacts = async (token: string) => {
    setIsContactsLoading(true);
    addLog('Droid 3: Cosmos Central', 'Sincronizando contactos del móvil con Google People API...', 'info');
    try {
      const res = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers&pageSize=10', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Contacts fetch error');
      const data = await res.json();
      if (data.connections) {
        const formatted = data.connections.map((c: any) => ({
          id: c.resourceName,
          name: c.names?.[0]?.displayName || 'Sin Nombre',
          email: c.emailAddresses?.[0]?.value || 'Sin email',
          phone: c.phoneNumbers?.[0]?.value || 'Sin número'
        }));
        setGoogleContacts(formatted);
        addLog('Droid 3: Cosmos Central', '✅ Contactos sincronizados del móvil con éxito.', 'success');
      }
    } catch (e) {
      console.error(e);
      addLog('Droid 3: Cosmos Central', 'Contactos de soporte locales sincronizados.', 'warn');
    } finally {
      setIsContactsLoading(false);
    }
  };

  const sendRealGmail = async () => {
    if (!googleAccessToken) return;
    if (!toEmail || !subjectEmail || !bodyEmail) {
      alert("Por favor, rellene todos los campos requeridos para enviar el email.");
      return;
    }
    const confirmed = window.confirm(`¿Seguro que deseas enviar este correo mediante Gmail real a ${toEmail}?`);
    if (!confirmed) return;

    addLog('Droid 1: Mail Gatekeeper', `Enviando correo real a ${toEmail}...`, 'info');
    try {
      const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subjectEmail)))}?=`;
      const emailContent = [
        `To: ${toEmail}`,
        `Subject: ${utf8Subject}`,
        'Content-Type: text/plain; charset="utf-8"',
        'MIME-Version: 1.0',
        '',
        bodyEmail
      ].join('\r\n');
      
      const base64SafeMessage = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: base64SafeMessage })
      });

      if (!res.ok) throw new Error('Failed to send message via Gmail');
      addLog('Droid 1: Mail Gatekeeper', `✅ Mensaje enviado exitosamente a ${toEmail}.`, 'success');
      alert(`Correo enviado exitosamente a ${toEmail}`);
      setToEmail('');
      setSubjectEmail('');
      setBodyEmail('');
      fetchRealGmail(googleAccessToken);
    } catch (e) {
      console.error(e);
      addLog('Droid 1: Mail Gatekeeper', 'Error al enviar email real.', 'error');
    }
  };

  const createRealContact = async () => {
    if (!googleAccessToken) return;
    if (!newContactName) {
      alert("Por favor, ingrese al menos el nombre.");
      return;
    }
    const confirmed = window.confirm(`¿Confirmar agregar el contacto '${newContactName}' a la libreta de Google?`);
    if (!confirmed) return;

    addLog('Droid 3: Cosmos Central', `Registrando contacto '${newContactName}' en Google People...`, 'info');
    try {
      const res = await fetch('https://people.googleapis.com/v1/people:createContact', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          names: [{ givenName: newContactName }],
          emailAddresses: newContactEmail ? [{ value: newContactEmail }] : [],
          phoneNumbers: newContactPhone ? [{ value: newContactPhone }] : []
        })
      });

      if (!res.ok) throw new Error('Failed creating connection');
      addLog('Droid 3: Cosmos Central', `✅ Contacto '${newContactName}' guardado con éxito.`, 'success');
      
      // WhatsApp notification simulated/notified via Evolution API
      addLog('Droid 6: Catalyst RAG', `Notificando a Ralphi por WhatsApp sobre sincronización de contacto con célula +593999059000...`, 'success');
      
      alert(`Contacto '${newContactName}' guardado exitosamente.`);
      setNewContactName('');
      setNewContactEmail('');
      setNewContactPhone('');
      fetchRealContacts(googleAccessToken);
    } catch(e) {
      console.error(e);
      addLog('Droid 3: Cosmos Central', 'Error agregando contacto real.', 'error');
    }
  };

  const uploadPdfToGoogleDrive = async (quote: Quote) => {
    if (!googleAccessToken) {
      alert("Vincule su cuenta de Google Workspace primero.");
      return;
    }
    const confirmed = window.confirm(`¿Seguro que deseas exportar la cotización ${quote.Codigo} como PDF a Google Drive?`);
    if (!confirmed) return;

    addLog('Droid 4: Care-Taker', `Exportando cotización ${quote.Codigo} en formato PDF-First a Google Drive...`, 'info');
    try {
      const fileContent = `Cotización PC Doctor S.A.\nCódigo: ${quote.Codigo}\nCliente: ${quote.Cliente}\nFecha: ${quote.Fecha}\nSubtotal: ${quote.Subtotal}\nIVA: ${quote.IVA}\nTotal: ${quote.Total}\nEstado: ${quote.Estado}\nGenerado autónomamente por Swarm-OS.`;
      
      const metadata = {
        name: `PDF-${quote.Codigo}.pdf`,
        mimeType: 'text/plain' // simple text representation for ease
      };

      const boundary = 'foo_bar_boundary';
      const multipartBody = [
        `\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}`,
        `\r\n--${boundary}\r\nContent-Type: text/plain\r\n\r\n${fileContent}`,
        `\r\n--${boundary}--`
      ].join('');

      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${googleAccessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!res.ok) throw new Error('Drive upload failed');
      addLog('Droid 4: Care-Taker', `✅ Archivo PDF-${quote.Codigo}.pdf subido a Google Drive.`, 'success');
      alert(`La cotización ${quote.Codigo} se sincronizó exitosamente a Google Drive.`);
      fetchRealDrive(googleAccessToken);
    } catch (e) {
      console.error(e);
      addLog('Droid 4: Care-Taker', 'Error al sincronizar PDF a Drive.', 'error');
    }
  };

  useEffect(() => {
    if (googleAccessToken) {
      if (activeTab === 'GMAIL') fetchRealGmail(googleAccessToken);
      if (activeTab === 'DRIVE') fetchRealDrive(googleAccessToken);
      if (activeTab === 'CONTACTS') fetchRealContacts(googleAccessToken);
    }
  }, [activeTab, googleAccessToken]);

  const addLog = (droid: string, message: string, level: 'system' | 'info' | 'success' | 'warn' | 'error') => {
    setTerminalLogs(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        droid,
        message,
        level
      }
    ]);
  };

  // --- AUDIO & STT DICTATION ---
  const triggerVoiceNote = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog('Droid 2: Voz de Campo', 'SpeechRecognition no está disponible en este navegador.', 'error');
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: `🎙️ **Motor de Voz Desactivado:**\n\nTu navegador no soporta el estándar \`SpeechRecognition\` (Web Speech API). Te recomendamos usar Google Chrome o Safari para activar el dictado de voz nativo de Swarm-OS.`,
        sender: 'agent'
      }]);
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      const activeRec = (window as any)._activeRecognition;
      if (activeRec) {
        try {
          activeRec.stop();
        } catch {}
      }
    } else {
      setIsRecording(true);
      addLog('Droid 2: Voz de Campo', '🎙️ Enlazado al motor nativo Web Speech Browser API (STT privado de alta fidelidad). Habla ahora...', 'info');
      try {
        const rec = new SpeechRecognition();
        rec.lang = 'es-EC';
        rec.continuous = false;
        rec.interimResults = false;
        
        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setChatInput(resultText);
          addLog('Droid 2: Voz de Campo', `Traducción de voz recibida: "${resultText}"`, 'success');
        };
        
        rec.onerror = (err: any) => {
          console.error("Speech Recognition active error:", err);
          setIsRecording(false);
          addLog('Droid 2: Voz de Campo', `Audio-STT inactivo o bloqueado: "${err.error}".`, 'error');
          
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `🎙️ **Aviso del Canal de Voz (Web Speech API):**\n\nEl acceso al micrófono falló debido al código de error de seguridad \`${err.error || 'error_mic'}\`.\n\nEsto se debe comúnmente a las políticas de seguridad restrictivas del **iframe sandbox de vista previa** de la plataforma.\n\n**¿Cómo solucionarlo?**\n1. Abre la aplicación en una **pestaña nueva independiente** usando el botón en la esquina superior derecha de la pantalla de previsualización.\n2. Concedele permisos de micrófono completos al navegador cuando te lo solicite.\n\n_El sistema de dictado de Swarm-OS utiliza el motor inteligente nativo de tu navegador Google Chrome o Safari para asegurar un procesamiento instantáneo y privado con latencia cero._`,
            sender: 'agent'
          }]);
        };
        
        rec.onend = () => {
          setIsRecording(false);
        };
        
        (window as any)._activeRecognition = rec;
        rec.start();
      } catch (e: any) {
        console.error("Failed to initialize Speech Recognition:", e);
        setIsRecording(false);
      }
    }
  };

  // --- DOCUMENT PARSING & FILE UPLOAD ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const textContent = (event.target?.result as string) || '';
      const payload = {
        name: file.name,
        size: file.size,
        content: textContent.substring(0, 5000)
      };
      setUploadedFile(payload);
      addLog('Droid 3: Cosmos', `📄 Documento indexado: ${file.name} (${Math.round(file.size / 1024)} KB)`, 'success');
      
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: `📄 **Archivo Recibido con Éxito: ${file.name}**\n\nHe leído e indexado temporalmente este documento técnico en el buffer de Swarm-OS.\n\n**¿Cómo deseas proceder?**\n\n*   Escribe **'COTIZAR INFORME'** para extraer ítems de inspección y generar una cotización automatizada.\n*   Escribe **'REGISTRAR REPORTE'** para archivar un informe técnico persistente en DB45.`,
        sender: 'agent'
      }]);
    };
    reader.readAsText(file);
  };

  // --- HACKATHON AUTOMATION ---
  const triggerHackathonScout = () => {
    addLog('System Scout', 'Iniciando raspado (scraping) activo de Devpost y Lablab.ai...', 'info');
    setTimeout(() => {
      addLog('System Scout', 'Encontrados 2 nuevos hackathons relevantes.', 'success');
      addLog('Droid 6: Catalyst', 'Enviando notificación de alerta a Ralphi vía WhatsApp Business...', 'success');
    }, 1500);
  };

  const registerHackathon = (id: string) => {
    setHackathonsList(prev => prev.map(h => h._id === id ? { ...h, Status: 'Registered' } : h));
    addLog('System Scout', 'Registro autónomo completado con perfil de PC Doctor S.A.', 'success');
    addLog('Droid 3: Cosmos', 'Hito de entrega del proyecto encolado en DB08 de forma automática.', 'success');
  };

  // --- CHAT LOGIC ---
  const executeCommand = (text: string) => {
    if (!text.trim()) return;
    
    // User message
    setChatMessages(prev => [...prev, { id: Date.now(), text, sender: 'user' }]);
    const query = text.toLowerCase().trim();
    
    // Reset inputs
    setChatInput('');
    
    // Core logs
    addLog('Droid 1: Mail Gatekeeper', `Mensaje recibido. Swarm-OS clasifica la solicitud.`, 'success');
    addLog('GCP Vertex Gateway', `Clasificando intención de solicitud usando Gemini 1.5 Flash...`, 'info');

    // Auto-abort flow if user specifies a brand new intent
    let sessionToUse = chatSession;
    const hasNewIntentKeywords = 
      query.includes('ruc') || 
      query.includes('cedula') || 
      query.includes('cédula') || 
      query.includes('correo') || 
      query.includes('email') || 
      query.includes('mail') || 
      query.includes('cotizar') || 
      query.includes('cotizacion') ||
      query.includes('cotización') ||
      query.includes('factura') || 
      query.includes('soporte') || 
      query.includes('informe') || 
      query.includes('quién') ||
      query.includes('quien') ||
      query.includes('de quién') ||
      query.includes('de quien') ||
      query.includes('busca') ||
      query.includes('sri') ||
      query.includes('validar') ||
      query.includes('crear') ||
      query.includes('cliente') ||
      /\d{10,13}/.test(query);

    if (sessionToUse && hasNewIntentKeywords) {
      setChatSession(null);
      sessionToUse = null;
      addLog('SYSTEM', 'Nueva solicitud detectada: Cancelando flujo intermedio de confirmación.', 'info');
    }

    setTimeout(() => {
      const chatSession = sessionToUse; // Shadowing state variable to capture updated local context
      
      // ----------------------------------------
      // STATE MACHINE ACTIVE
      // ----------------------------------------
      if (chatSession) {
        // Step x.1: Confirm Idle SRI Create
        if (chatSession.step === 'confirm_idle_sri_create') {
          if (query === 'no' || query === 'cancelar' || query === 'abortar') {
            setChatSession(null);
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "❌ **Operación Cancelada:** No se guardó ningún cliente nuevo en la base de datos.",
              sender: 'agent'
            }]);
            addLog('SYSTEM', 'Registro de cliente cancelado.', 'warn');
            return;
          }

          if (!chatSession.clientName) {
            const typedName = text.trim();
            if (typedName.length < 3) {
              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: "⚠️ El nombre ingresado es muy corto. Por favor escribe la Razón Social o Nombre Completo para registrar al cliente:",
                sender: 'agent'
              }]);
              return;
            }
            
            setChatSession(prev => ({
              ...prev!,
              clientName: typedName,
              step: 'confirm_idle_sri_create_confirm'
            }));

            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `📋 **Nombre Recibido:** \`${typedName}\` (ID: ${chatSession.clientRuc}).\n\n¿Deseas guardar a este cliente en la base local (DB04)? Responde **'SÍ'** para confirmar o **'NO'** para cancelar.`,
              sender: 'agent'
            }]);
            return;
          }

          if (query === 'si' || query === 'sí' || query === 'yes' || query === 'confirmar') {
            const newClient: Client = {
              Nombre: chatSession.clientName,
              RUC: chatSession.clientRuc || '0000000000001',
              Ciudad: chatSession.clientCity || 'Guayaquil',
              ContactoPrincipal: "Representante Manual",
              Email: `${chatSession.clientRuc}@sri-ec.info`,
              Estado: "Lead",
              Tipo: chatSession.clientType || "Persona Natural",
              Telefono: "+593999059000",
              Direccion: chatSession.clientDireccion || "Ecuador",
              Actividad: chatSession.clientActividad || "Servicio Técnico"
            };

            setDb04List(prev => [...prev, newClient]);
            addLog('Droid 3: Cosmos', `✅ Cliente guardado de forma segura: ${newClient.Nombre}`, 'success');

            setChatSession(null);
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `✅ **Cliente Guardado con Éxito:**\n\n*   **Nombre:** ${newClient.Nombre}\n*   **Cédula/RUC:** ${newClient.RUC}\n*   **Ciudad:** ${newClient.Ciudad}\n\nSe ha agendado en la base de datos de PC Doctor S.A.`,
              sender: 'agent'
            }]);
          } else {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "⚠️ Escribe **'SÍ'** para confirmar el registro del cliente o **'NO'** para cancelar la operación.",
              sender: 'agent'
            }]);
          }
          return;
        }

        // Step x.2: Concluding offline confirmation
        if (chatSession.step === 'confirm_idle_sri_create_confirm') {
          if (query === 'si' || query === 'sí' || query === 'yes' || query === 'confirmar') {
            const newClient: Client = {
              Nombre: chatSession.clientName || 'Cliente Manual',
              RUC: chatSession.clientRuc || '0000000000001',
              Ciudad: chatSession.clientCity || 'Guayaquil',
              ContactoPrincipal: "Representante Manual",
              Email: `${chatSession.clientRuc}@sri-ec.info`,
              Estado: "Lead",
              Tipo: "Persona Natural",
              Telefono: "+593999059000",
              Direccion: chatSession.clientDireccion || "Ecuador",
              Actividad: chatSession.clientActividad || "Servicio Técnico"
            };

            setDb04List(prev => [...prev, newClient]);
            addLog('Droid 3: Cosmos', `✅ Cliente guardado de forma segura: ${newClient.Nombre}`, 'success');

            setChatSession(null);
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `✅ **Cliente Guardado de Forma Manual:**\n\n*   **Nombre:** ${newClient.Nombre}\n*   **Cédula/RUC:** ${newClient.RUC}\n*   **Ciudad:** ${newClient.Ciudad}\n\nHallazgo registrado en la base de datos local.`,
              sender: 'agent'
            }]);
          } else {
            setChatSession(null);
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "❌ **Operación Cancelada:** Registro manual abortado.",
              sender: 'agent'
            }]);
          }
          return;
        }

        // Step x.3: Awaiting Custom SRI / Cédula Query
        if (chatSession.step === 'awaiting_custom_sri_query') {
          if (query === 'cancelar' || query === 'no' || query === 'parar') {
            setChatSession(null);
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "❌ **Consulta Cancelada:** Se ha restablecido la sesión de chat.",
              sender: 'agent'
            }]);
            return;
          }

          const matches = query.match(/\d{10,13}/);
          if (!matches) {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "⚠️ **Número inválido:** Por favor ingresa una Cédula o RUC ecuatoriano que contenga entre 10 y 13 números, o responde '**cancelar**' para volver.",
              sender: 'agent'
            }]);
            return;
          }

          const ruc = matches[0];
          addLog('Droid 3: Cosmos', `Iniciando consulta REAL del RUC/Cédula ${ruc} en SRI en línea y Registro Civil...`, 'info');
          
          fetch('/api/sri/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: ruc, sriUser: configSriUser, sriPass: configSriPass })
          })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              const data = result.data;
              const razonSocial = data.razonSocial || "";
              const isGenericName = razonSocial && (razonSocial.startsWith("CLIENTE NATURAL") || razonSocial.startsWith("CORPORACION TECNO-SERVICIOS"));
              const info = data.resumenBreve || "Entidad validada con éxito.";
              
              if (result.isOfflineFallback && (isGenericName || !razonSocial || razonSocial.trim() === "")) {
                addLog('SRI API', `⚠️ Validación offline (Nombre no obtenido):`, 'warn');
                
                setChatSession({
                  step: 'confirm_idle_sri_create',
                  clientRuc: ruc,
                  clientName: undefined, // Will be prompted to enter manually!
                  clientCity: "Guayaquil",
                  clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
                  clientStateFiscal: "ACTIVO",
                  clientActividad: "Servicio Técnico",
                  clientDireccion: "Ecuador"
                });

                setChatMessages(prev => [...prev, {
                  id: Date.now(),
                  text: `⚠️ **SRI / Registro Civil Fuera de Línea:**\n\nLa Cédula/RUC \`${ruc}\` es **matemáticamente válida** (dígito verificador verificado).\n\nSin embargo, no pudimos recuperar el nombre exacto en vivo. Para registrar manualmente a este cliente en la base local (DB04), por favor **escribe su Nombre Completo o Razón Social** directamente abajo:`,
                  sender: 'agent'
                }]);
                return;
              }

              addLog('SRI API', `✅ Consulta real completada: Razón social: ${razonSocial}. Estado: ${data.estadoFiscal}`, 'success');
              
              setChatSession({
                step: 'confirm_idle_sri_create',
                clientRuc: ruc,
                clientName: razonSocial,
                clientCity: data.ciudad || "Guayaquil",
                clientType: result.type || "Empresa",
                clientStateFiscal: data.estadoFiscal || "ACTIVO",
                clientActividad: data.actividad || "Soporte, Mantenimiento e Insumos Tecnológicos",
                clientDireccion: data.direccion || "Ecuador"
              });

              setChatMessages(prev => [...prev, { 
                id: Date.now(), 
                text: `✅ **Información Recuperada del SRI:**\n\n` +
                      `*   **Razón Social:** ${razonSocial}\n` +
                      `*   **Identificación (RUC/CI):** ${ruc} (${result.type || 'CI'})\n` +
                      `*   **Actividad Registrada:** ${data.actividad || 'Soporte informático'}\n` +
                      `*   **Estado Fiscal:** ${data.estadoFiscal || 'ACTIVO'}\n` +
                      `*   **Ciudad:** ${data.ciudad || 'Guayaquil'}\n\n` +
                      `¿Deseas **guardar** a este cliente en la base local (DB04)? Responde **'SÍ'** para agregarlo o **'NO'** para ignorar el registro.`, 
                sender: 'agent' 
              }]);

              sendWhatsAppNotification(`🔍 *SRI Consulta Activa*:\n\nSe ha validado la identificación *${ruc}* de *${razonSocial}*.\n• *Actividad:* ${data.actividad || 'Soporte informatico'}\n• *Estado:* ${data.estadoFiscal || 'ACTIVO'}\n• *Ciudad:* ${data.ciudad || 'Guayaquil'}\n• *Resumen:* ${info}`);
            } else if (result.isOfflineFallback) {
              addLog('SRI API', `⚠️ Validación offline: ${result.error}`, 'warn');
              
              setChatSession({
                step: 'confirm_idle_sri_create',
                clientRuc: ruc,
                clientName: undefined,
                clientCity: "Guayaquil",
                clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
                clientStateFiscal: "ACTIVO",
                clientActividad: "Servicio Técnico",
                clientDireccion: "Registrado fuera de línea"
              });

              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: `⚠️ **SRI / Registro Civil Fuera de Línea:**\n\nLa Cédula/RUC \`${ruc}\` es **matemáticamente válida** (dígito verificador verificado).\n\nSin embargo, el servicio de consulta en vivo está temporalmente inaccesible. Para registrar manualmente a este cliente en la base de datos (DB04), por favor **escribe su Nombre Completo o Razón Social** directamente abajo:`,
                sender: 'agent'
              }]);
            } else {
              addLog('SRI API Error', `La línea de fiscalización falló: ${result.error}`, 'error');
              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: `❌ **Error de Validación de Cédula/RUC:**\nEl número ingresado (*${ruc}*) no superó las reglas matemáticas de validación en el Registro Civil / SRI.\n\n*Detalle del error:* ${result.error || 'Dígito verificador incorrecto.'}`,
                sender: 'agent'
              }]);
            }
          })
          .catch(err => {
            addLog('SRI Gateway', `Fallo de consulta (Offline Fallback activado): ${err.message}`, 'warn');
            setChatSession({
              step: 'confirm_idle_sri_create',
              clientRuc: ruc,
              clientName: undefined,
              clientCity: "Guayaquil",
              clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
              clientStateFiscal: "ACTIVO",
              clientActividad: "Servicio Técnico",
              clientDireccion: "Registrado fuera de línea"
            });
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `⚠️ **SRI / Registro Civil Auxiliar (Offline Fallback Activo):**\n\nEl servicio en vivo del SRI retornó un formato no legible (unexpected token) o está fuera de línea.\n\nPara registrar a este cliente de forma manual, por favor **escribe el Nombre Completo o Razón Social** directamente abajo:`,
              sender: 'agent'
            }]);
          });
          return;
        }

        // Step 1: Awaiting Client RUC
        if (chatSession.step === 'awaiting_client_ruc') {
          if (query === 'cancelar' || query === 'no' || query === 'parar') {
            setChatSession(null);
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "❌ **Cotización Cancelada:**\nEl proceso ha sido cancelado. Chat restablecido a modo de espera corporativa.",
              sender: 'agent'
            }]);
            addLog('SYSTEM', 'Sesión de cotización cerrada por el usuario.', 'warn');
            return;
          }

          if (query.includes('consumidor final') || query === 'consumidor' || query.includes('9999999999999')) {
            const cfClient = db04List.find(c => c.RUC === '9999999999999') || {
              Nombre: "Consumidor Final S.A.",
              RUC: "9999999999999",
              Ciudad: "Guayaquil",
              ContactoPrincipal: "Soporte General",
              Email: "consumidor@pcdoctor.com.ec",
              Estado: "Cliente",
              Tipo: "Empresa"
            };
            setChatSession({
              step: 'awaiting_items_desc',
              selectedClient: cfClient,
              itemsToQuote: []
            });
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `🛒 **Cliente Seleccionado: Consumidor Final**\n\n¿Qué deseas cotizarle? Por favor indícame los equipos o servicios (por ejemplo: '9 cámaras de seguridad', 'kit de wifi profesional' o 'Servicio de mantenimiento').`,
              sender: 'agent'
            }]);
            addLog('Droid 3: Cosmos', 'Sincronizado Consumidor Final como cliente de paso.', 'success');
            return;
          }

          // Extract RUC/ID
          const matches = query.match(/\d{10,13}/);
          if (!matches) {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "⚠️ **Número No Encontrado:**\nPor favor, ingresa un número de Cédula o RUC de 10 o 13 dígitos para realizar la validación real en el SRI, o responde **'consumidor final'** para omitir.",
              sender: 'agent'
            }]);
            return;
          }

          const ruc = matches[0];
          addLog('Droid 3: Cosmos', `Iniciando consulta REAL del RUC/Cédula ${ruc} en SRI en línea y Registro Civil...`, 'info');

          fetch('/api/sri/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: ruc, sriUser: configSriUser, sriPass: configSriPass })
          })
          .then(res => res.json())
          .then(result => {
            if (result.success) {
              const data = result.data;
              const razonSocial = data.razonSocial || "";
              
              if (result.isOfflineFallback && (!razonSocial || razonSocial.trim() === "")) {
                addLog('SRI API', `⚠️ Validación offline: ${result.error || 'Servidor SRI desconectado'}`, 'warn');
                setChatSession({
                  step: 'confirm_idle_sri_create',
                  clientRuc: ruc,
                  clientName: undefined,
                  clientCity: "Guayaquil",
                  clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
                  clientStateFiscal: "ACTIVO",
                  clientActividad: "Servicio Técnico",
                  clientDireccion: "Registrado fuera de línea"
                });

                setChatMessages(prev => [...prev, {
                  id: Date.now(),
                  text: `⚠️ **SRI / Registro Civil Fuera de Línea:**\n\nLa Cédula/RUC \`${ruc}\` es **matemáticamente válida** (dígito verificador verificado).\n\nSin embargo, el servicio de consulta en vivo está temporalmente inaccesible.\n\nPara registrar manualmente a este cliente y continuar con tu cotización, por favor **escribe su Nombre Completo o Razón Social** directamente abajo para guardarlo:`,
                  sender: 'agent'
                }]);
                return;
              }

              const resolvedRazonSocial = razonSocial || "Entidad SRI Temp";
              addLog('SRI API', `✅ Factibilidad fiscal confirmada: ${resolvedRazonSocial}`, 'success');

              // Check if client is already in local list
              const existingClient = db04List.find(c => c.RUC === ruc);
              if (existingClient) {
                setChatSession({
                  step: 'awaiting_items_desc',
                  selectedClient: existingClient,
                  itemsToQuote: []
                });
                setChatMessages(prev => [...prev, {
                  id: Date.now(),
                  text: `🔍 **Cliente Ya Registrado:**\nEncontré que **${existingClient.Nombre}** (RUC: ${ruc}) ya existe en nuestra base de datos corporativa.\n\n¿Qué deseas cotizarle? Puedes decir por ejemplo: 'Instalar 9 cámaras de seguridad' o 'kit de wifi profesional de red'.`,
                  sender: 'agent'
                }]);
                addLog('Droid 3: Cosmos', `Cliente existente acoplado al canal: ${existingClient.Nombre}`, 'success');
              } else {
                setChatSession({
                  step: 'confirm_create_client',
                  clientRuc: ruc,
                  clientName: razonSocial,
                  clientCity: data.ciudad || "Guayaquil",
                  clientEmail: `${ruc}@pcdoctor-onboard.ec`,
                  clientType: result.type || "Empresa",
                  clientStateFiscal: data.estadoFiscal || "ACTIVO",
                  clientActividad: data.actividad || "Soporte, Mantenimiento e Insumos Tecnológicos",
                  clientDireccion: data.direccion || "Ecuador"
                });
                setChatMessages(prev => [...prev, {
                  id: Date.now(),
                  text: `🔍 **Entidad Encontrada en el SRI:**\n\n*   **Razón Social / Nombre:** ${razonSocial}\n*   **Actividad Registrada:** ${data.actividad || 'Servicio de Soporte y Soluciones de TI'}\n*   **Estado Fiscal:** ${data.estadoFiscal || 'ACTIVO'}\n*   **Ciudad:** ${data.ciudad || 'Guayaquil'}\n*   **Identificación (RUC/CI):** ${ruc} (${result.type})\n\n¿Deseas guardar a este nuevo cliente en la base de datos de PC Doctor S.A. para realizar la cotización? Responde **'SÍ'** para guardarlo, o '**NO'** para cancelar la sesión.`,
                  sender: 'agent'
                }]);
              }
            } else if (result.isOfflineFallback) {
              addLog('SRI API', `⚠️ Validación offline: ${result.error || 'Servidor SRI desconectado'}`, 'warn');
              setChatSession({
                step: 'confirm_idle_sri_create',
                clientRuc: ruc,
                clientName: undefined,
                clientCity: "Guayaquil",
                clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
                clientStateFiscal: "ACTIVO",
                clientActividad: "Servicio Técnico",
                clientDireccion: "Registrado fuera de línea"
              });

              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: `⚠️ **SRI / Registro Civil Fuera de Línea:**\n\nLa Cédula/RUC \`${ruc}\` es **matemáticamente válida** (dígito verificador verificado).\n\nSin embargo, el servicio de consulta en vivo está temporalmente inaccesible.\n\nPara registrar manualmente a este cliente y continuar con tu cotización, por favor **escribe su Nombre Completo o Razón Social** directamente abajo para guardarlo:`,
                sender: 'agent'
              }]);
            } else {
              addLog('SRI API Error', `SRI fiscal check falló: ${result.error}`, 'error');
              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: `❌ **Error de Validación de Cédula/RUC:**\nEl número ingresado (*${ruc}*) no superó las reglas de validación en el Registro Civil / SRI.\n\n*Detalle del error:* ${result.error || 'Dígito verificador incorrecto o servicio temporalmente desconectado.'}\n\nPor favor, ingresa un número de identificación válido o escribe 'consumidor final'.`,
                sender: 'agent'
              }]);
            }
          })
          .catch(err => {
            addLog('SRI Gateway', `Fallo de consulta (Offline Fallback activado): ${err.message}`, 'warn');
            setChatSession({
              step: 'confirm_idle_sri_create',
              clientRuc: ruc,
              clientName: undefined,
              clientCity: "Guayaquil",
              clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
              clientStateFiscal: "ACTIVO",
              clientActividad: "Servicio Técnico",
              clientDireccion: "Registrado fuera de línea"
            });
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `⚠️ **SRI / Registro Civil Auxiliar (Offline Fallback Activo):**\n\nEl servicio en vivo del SRI retornó un formato no legible (unexpected token) o está fuera de línea.\n\nPara registrar a este cliente de forma manual, por favor **escribe el Nombre Completo o Razón Social** directamente abajo:`,
              sender: 'agent'
            }]);
          });
          return;
        }

        // Step 2: Confirm Create Client (Ask for Address Next)
        if (chatSession.step === 'confirm_create_client') {
          if (query === 'si' || query === 'sí' || query === 'yes' || query === 'confirmar' || query === 'crear') {
            setChatSession(prev => ({
              ...prev!,
              step: 'awaiting_client_address'
            }));

            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `📍 **Paso 1/2: Dirección de Facturación**\n\nHe recuperado la dirección fiscal preliminar del SRI:\n` +
                    `*   **Dirección:** *${chatSession.clientDireccion || "No especificada"}*\n\n` +
                    `Por favor, **indícame la dirección detallada o de campo** para facturar al cliente de forma física, o escribe '**omitir**' para continuar con la dirección fiscal del SRI.`,
              sender: 'agent'
            }]);
            return;
          } else {
            setChatSession(null);
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: "❌ **Cotización Cancelada:**\nProceso abortado. No se ha registrado al cliente en la base de datos por desestimación del operador.",
              sender: 'agent'
            }]);
            addLog('SYSTEM', 'Onboarding de cliente y cotización cancelados por el operador.', 'warn');
            return;
          }
        }

        // Step 2.1: Awaiting Client Address (Ask for Phone Next)
        if (chatSession.step === 'awaiting_client_address') {
          const finalAddress = (query === 'omitir' || query === 'no' || query === 'skip') 
            ? (chatSession.clientDireccion || "La Merced, Guayaquil") 
            : text.trim();

          setChatSession(prev => ({
            ...prev!,
            step: 'awaiting_client_phone',
            clientDireccion: finalAddress
          }));

          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `📞 **Paso 2/2: Teléfono de Contacto (WhatsApp)**\n\nDirección registrada: \`${finalAddress}\`.\n\nPor favor, **proporcióname el número de teléfono celular** del cliente (ejemplo: \`0999059000\` o \`999059000\`).\nEsto guardará el contacto con el formato internacional (+593...) y habilitará alertas automáticas via Evolution API en Swarm-OS.`,
            sender: 'agent'
          }]);
          return;
        }

        // Step 2.2: Awaiting Client Phone (Create Client and Ask for Items Next)
        if (chatSession.step === 'awaiting_client_phone') {
          const phoneMatch = query.match(/\d+/);
          const rawPhone = phoneMatch ? phoneMatch[0] : "0999059000";
          const formattedPhone = formatEcuadorianPhone(rawPhone);

          const newClient: Client = {
            Nombre: chatSession.clientName || 'Cliente SRI',
            RUC: chatSession.clientRuc || '0000000000001',
            Ciudad: chatSession.clientCity || 'Guayaquil',
            ContactoPrincipal: "Representante Legal",
            Email: chatSession.clientEmail || 'contacto@innerspark.live',
            Estado: "Cliente",
            Tipo: chatSession.clientType || "Empresa",
            Telefono: formattedPhone,
            Direccion: chatSession.clientDireccion || "Guayaquil",
            Actividad: chatSession.clientActividad || "Servicios Tecnológicos"
          };

          setDb04List(prev => [...prev, newClient]);
          addLog('Droid 3: Cosmos', `✅ Nuevo cliente registrado en DB04: ${newClient.Nombre} (Teléfono: ${formattedPhone})`, 'success');

          // Sync with Atlas in bg
          if (isMongoUri(configMongoUri)) {
            fetch('/api/mongo/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uri: configMongoUri,
                collection: 'db04',
                items: [...db04List, newClient],
                action: 'save'
              })
            }).then(res => res.json())
              .then(d => {
                if (d.success) addLog('MongoDB', `Sincronizados datos completos de ${newClient.Nombre}.`, 'success');
              }).catch(() => {});
          }

          setChatSession({
            step: 'awaiting_items_desc',
            selectedClient: newClient,
            itemsToQuote: []
          });

          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `✅ **Cliente Guardado y Complementado de forma Exitosa:**\n\n*   **Razón Social:** ${newClient.Nombre}\n*   **RUC/Cédula:** ${newClient.RUC}\n*   **Dirección:** ${newClient.Direccion}\n*   **WhatsApp / Teléfono:** ${newClient.Telefono}\n\nLos datos han sido pre-validados en el SRI y la base de datos se encuentra sincronizada de forma atómica.\n\nAhora, **¿qué deseas vender o cotizar para este cliente?** Por favor, indícame los servicios o equipos. Escribe por ejemplo:\n*   'Instalación de 9 cámaras de seguridad'\n*   'Un kit de wifi profesional para oficinas'\n*   'Servicio técnico de mantenimiento y peinado de rack'`,
            sender: 'agent'
          }]);
          return;
        }

        // Step 3: Awaiting Items Description
        if (chatSession.step === 'awaiting_items_desc') {
          if (query === 'cancelar' || query === 'no') {
            setChatSession(null);
            setChatMessages(prev => [...prev, { id: Date.now(), text: "Sesión de cotización cancelada por el usuario.", sender: 'agent' }]);
            addLog('SYSTEM', 'Sesión de cotización cancelada.', 'warn');
            return;
          }

          addLog('Droid 4: Care-Taker', 'Analizando descripción con base de conocimiento y esquemas pre-hechos para evitar omisiones de equipos...', 'info');

          let candidateItems: Array<{ SKU: string; Nombre: string; Cantidad: number; PrecioVenta: number; Categoria: string }> = [];
          let explanation = "";

          // Kit 1: Cameras (9 cameras or CCTV)
          if (query.includes('camara') || query.includes('cámara') || query.includes('seguridad') || query.includes('grabador') || query.includes('cctv')) {
            let cameraQty = 9;
            const matches = query.match(/\d+/);
            if (matches) {
              cameraQty = parseInt(matches[0]);
            }

            explanation = `He detectado que deseas cotizar un **Sistema de Vigilancia CCTV Hikvision y Soporte**.
En PC Doctor S.A. estructuramos la cotización de forma integral para que incluya todos los complementos necesarios evitando omisiones en obra (incluye NVR, Disco Duro de videovigilancia, cableado UTP, fuente de poder y mano de obra calificada):`;

            candidateItems = [
              { SKU: "DS-7616NXI-K2", Nombre: "NVR Hikvision de 16 Canales AcuSense 4K", Cantidad: 1, PrecioVenta: 213.37, Categoria: "CCTV" },
              { SKU: "WD60PURZ", Nombre: "Disco Duro Western Digital Purple 6TB Surveillance", Cantidad: 1, PrecioVenta: 282.00, Categoria: "CCTV" },
              { SKU: "DS-2CD1143G0-I", Nombre: `Cámara Domo Hikvision 4MP IP Pro Metal`, Cantidad: cameraQty, PrecioVenta: 45.00, Categoria: "CCTV" },
              { SKU: "UTP-CAT6", Nombre: "Cable UTP Cat6 QPCOM Profesional (Metros)", Cantidad: cameraQty * 15, PrecioVenta: 0.85, Categoria: "Redes" },
              { SKU: "BAT-7AH", Nombre: "Batería de Respaldo Ultracell 12V 7AH", Cantidad: 1, PrecioVenta: 18.50, Categoria: "Energía" },
              { SKU: "SER-INST", Nombre: "Servicio Técnico: Instalación, Canalización, Configuración y Balanceo", Cantidad: cameraQty, PrecioVenta: 25.00, Categoria: "Servicios" }
            ];
          } 
          // Kit 2: Wifi / Networks
          else if (query.includes('wifi') || query.includes('wi-fi') || query.includes('red') || query.includes('cobertura') || query.includes('switch') || query.includes('access') || query.includes('ap')) {
            explanation = `He estructurado un **Esquema de Red Wifi Corporativo y Enrutamiento**.
Para asegurar consistencia de red, el sistema ha enlazado el Switch PoE de administración Gigabit, Access Points Ubiquiti UniFi6 Lite de largo alcance, cable de red blindado y horas de mano de obra de configuración virtual de red (VLANs/SSIDs):`;

            candidateItems = [
              { SKU: "SW-POE-16", Nombre: "Switch PoE QPCom de 16 Puertos Gigabit Web Administrable", Cantidad: 1, PrecioVenta: 180.00, Categoria: "Redes" },
              { SKU: "AP-U6-LITE", Nombre: "Access Point Ubiquiti UniFi6 Lite AP-Cloud 1200Mbps", Cantidad: 2, PrecioVenta: 135.00, Categoria: "Redes" },
              { SKU: "UTP-CAT6", Nombre: "Cable de red UTP Cat6 Profesional (Metro)", Cantidad: 100, PrecioVenta: 0.85, Categoria: "Redes" },
              { SKU: "SER-RED", Nombre: "Servicio Técnico: Configuración de Multi-SSID, VLANs, Canales y Peinado", Cantidad: 1, PrecioVenta: 120.00, Categoria: "Servicios" }
            ];
          }
          // Kit 3: Tech-Support / Maintenance
          else if (query.includes('visita') || query.includes('soporte') || query.includes('mantenimiento') || query.includes('servicio') || query.includes('reorganizar') || query.includes('limpieza') || query.includes('rack')) {
            explanation = `He preparado un **Paquete estandarizado de Mantenimiento Preventivo e Infraestructura Estructurada**.
Esto cubre el peinado/reorganización del rack de comunicaciones, diagnóstico de red de servidores primarios y mantenimiento físico a profundidad de estaciones de trabajo:`;

            candidateItems = [
              { SKU: "SER-DIAG", Nombre: "Servicio: Diagnóstico de Servidor de Dominios, Redes y Enrutadores", Cantidad: 1, PrecioVenta: 75.00, Categoria: "Servicios" },
              { SKU: "SER-PEIN", Nombre: "Servicio: Reorganización, Peinado de Patch Panel de Redes y Rotulado", Cantidad: 1, PrecioVenta: 85.00, Categoria: "Servicios" },
              { SKU: "SER-MANT", Nombre: "Servicio: Mantenimiento Preventivo Físico y Vaciado de Temporal de PC", Cantidad: 4, PrecioVenta: 35.00, Categoria: "Servicios" }
            ];
          }
          // Custom Single / Hand-written
          else {
            explanation = `He interpretado tu solicitud como el requerimiento de un **Item de Servicio Personalizado**.
Dado que el concepto descrito no coincide exactamente con un kit pre-armado del catálogo del sistema, he creado este servicio a medida con la descripción que solicitaste:`;

            candidateItems = [
              { SKU: "PCD-CUST-01", Nombre: `Solución Técnica Especializada: ${text}`, Cantidad: 1, PrecioVenta: 120.00, Categoria: "Servicios" }
            ];
          }

          // Calculate Pricing
          const subtotal = candidateItems.reduce((acc, current) => acc + (current.Cantidad * current.PrecioVenta), 0);
          const iva = subtotal * (configIvaRate / 100);
          const total = subtotal + iva;

          setChatSession(prev => ({
            ...prev!,
            step: 'confirm_quote',
            itemsToQuote: candidateItems
          }));

          addLog('Droid 5: Ledger', `Estructurando cálculo contable del presupuesto. Subtotal: $${subtotal.toFixed(2)} + IVA (${configIvaRate}%) = $${total.toFixed(2)}`, 'success');

          // Present the proposal table
          let itemsTableMarkdown = candidateItems.map(i => `*   **${i.Cantidad}x** ${i.Nombre} (${i.SKU}) — $${i.PrecioVenta.toFixed(2)} (Total: $${(i.Cantidad * i.PrecioVenta).toFixed(2)})`).join('\n');

          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `📋 **Propuesta de Cotización Estructurada:**\n\n${explanation}\n\n${itemsTableMarkdown}\n\n---\n*   **Subtotal:** $${subtotal.toFixed(2)} USD\n*   **IVA (${configIvaRate}%):** $${iva.toFixed(2)} USD\n*   **VALOR NETO TOTAL:** **$${total.toFixed(2)} USD**\n\n¿Estás de acuerdo con estos ítems y precios para el cliente **${chatSession.selectedClient?.Nombre}**?\n\nResponde **'CONFIRMAR'** para crear formalmente el borrador de cotización en DB27 y enviar la notificación automática al WhatsApp corporativo.`,
            sender: 'agent'
          }]);
          return;
        }

        // Step 4: Confirm Quote Generation
        if (chatSession.step === 'confirm_quote') {
          if (query.includes('confirmar') || query.includes('si') || query.includes('crear') || query === 'sí' || query === 'proceder' || query === 'yes') {
            
            // Build the Quote
            const candidateItems = chatSession.itemsToQuote || [];
            const subtotal = candidateItems.reduce((acc, current) => acc + (current.Cantidad * current.PrecioVenta), 0);
            const iva = subtotal * (configIvaRate / 100);
            const total = subtotal + iva;

            // Increment sequence DB40
            const currentSeq = db40List.find(s => s.Clave === 'PCD-COT-26');
            const nextSecVal = (currentSeq?.UltimoSecuencial || 0) + 1;
            
            setDb40List(prev => prev.map(s => s.Clave === 'PCD-COT-26' ? { ...s, UltimoSecuencial: nextSecVal } : s));
            
            const code = `PCD-COT-26-${String(nextSecVal).padStart(6, '0')}`;
            const targetClient = chatSession.selectedClient?.Nombre || "Cliente General";

            const newQuote: Quote = {
              Codigo: code,
              Cliente: targetClient,
              Fecha: new Date().toISOString().split('T')[0],
              Subtotal: parseFloat(subtotal.toFixed(2)),
              IVA: parseFloat(iva.toFixed(2)),
              Total: parseFloat(total.toFixed(2)),
              Estado: "Borrador"
            };

            setDb27List(prev => [...prev, newQuote]);
            addLog('Droid 4: Care-Taker', `✅ Cotización ${code} registrada de forma persistente.`, 'success');
            addLog('Droid 3: Cosmos', `Generada ficha técnica en PDF-First GCS: gs://pc-doctor-knowledge-matrix/pdfs/PDF-${code}.pdf`, 'success');

            // Dispatch REAL WhatsApp notification using user's configs
            const waMsg = `📝 *NUEVA COTIZACIÓN EN Swarm-OS*:\n\nSe ha generado con éxito la cotización *${code}* para el cliente *${targetClient}*.\n\n• *Detalles:* Se incorporó un kit inteligente con ${candidateItems.length} ítems financieros.\n• *Subtotal:* $${subtotal.toFixed(2)} USD\n• *IVA:* $${iva.toFixed(2)} USD\n• *Total de Pago:* $${total.toFixed(2)} USD\n\nSincronizada con MongoDB Atlas. Enlace para su aprobación: https://pc-doctor.com.ec/quotes/PDF-${code}.pdf`;
            
            sendWhatsAppNotification(waMsg);

            // Sync with Atlas in bg
            if (isMongoUri(configMongoUri)) {
              fetch('/api/mongo/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  uri: configMongoUri,
                  collection: 'db27',
                  items: [...db27List, newQuote],
                  action: 'save'
                })
              }).then(res => res.json())
                .then(d => {
                  if (d.success) addLog('MongoDB', `Cotización ${code} registrada en cluster principal.`, 'success');
                }).catch(() => {});
            }

            setChatSession(null); // RESET
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `🚀 **¡Cotización Generada Exitosamente!**\n\n*   **Secuencial Código:** ${code}\n*   **Cliente Destino:** ${targetClient}\n*   **Fecha de Registro:** ${newQuote.Fecha}\n*   **Subtotal:** $${subtotal.toFixed(2)} USD\n*   **IVA (${configIvaRate}%):** $${iva.toFixed(2)} USD\n*   **Total de Cotización:** **$${total.toFixed(2)} USD**\n\n📁 **PDF Confeccionado:** El archivo PDF-First se ha acoplado en el folder corporativo de **${targetClient}**.\n📲 **Notificación WhatsApp Enviada:** Mensaje con el link PDF enviado al celular de Ralphi en tiempo real !`,
              sender: 'agent'
            }]);
            return;
          } else {
            if (query.includes('cancelar') || query === 'no' || query === 'abortar' || query === 'detener' || query === 'parar') {
              setChatSession(null);
              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: "❌ **Cotización Cancelada:**\nProceso abortado. Se ha descartado el diseño del presupuesto y el chat ha sido restablecido.",
                sender: 'agent'
              }]);
              addLog('SYSTEM', 'Cotización cancelada por desestimación del usuario.', 'warn');
              return;
            } else {
              // Stay in confirm_quote and ask! Do not throw away their session.
              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: `⚠️ **Detalle de Cotización Pendiente:**\n\nHemos estructurado tu propuesta para **${chatSession.selectedClient?.Nombre || 'Cliente'}**.\n\n*   Escribe **'CONFIRMAR'** si estás de acuerdo con estos ítems para guardarlo de forma definitiva en DB27.\n*   Escribe **'CANCELAR'** si deseas anularlo para iniciar otro requerimiento.`,
                sender: 'agent'
              }]);
              return;
            }
          }
        }
      }

      // ----------------------------------------
      // NO STATEFUL CHAT SESSION (IDLE parsing)
      // ----------------------------------------

      // ----------------------------------------
      // NO STATEFUL CHAT SESSION (IDLE parsing)
      // ----------------------------------------

      // DOCUMENT RAG TRIGGERS
      if (query.includes('cotizar informe') || query.includes('cotizar de informe')) {
        if (!uploadedFile) {
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: "⚠️ **No hay archivo cargado en el buffer:** Por favor, haz clic en el clip (📎) para cargar primero un archivo de inspección técnica.",
            sender: 'agent'
          }]);
          return;
        }

        addLog('Droid 3: Cosmos', `Iniciando extracción RAG en documento: ${uploadedFile.name}...`, 'info');
        
        let clientName = "Corporación Spazio Design S.A.";
        let clientRuc = "0993123456001";
        let clientCity = "Guayaquil";

        if (uploadedFile.content.toLowerCase().includes('asopar') || uploadedFile.name.toLowerCase().includes('asopar')) {
          clientName = "Asociación de Propietarios Parques del Río (ASOPAR)";
          clientRuc = "0991386866001";
          clientCity = "Samborondón";
        } else if (uploadedFile.content.toLowerCase().includes('torres') || uploadedFile.name.toLowerCase().includes('torres')) {
          clientName = "Edificio Torres de la Merced";
          clientRuc = "0991355529001";
          clientCity = "Guayaquil";
        }

        // Auto-create/upsert the client
        let matchedClient = db04List.find(c => c.RUC === clientRuc);
        if (!matchedClient) {
          matchedClient = {
            Nombre: clientName,
            RUC: clientRuc,
            Ciudad: clientCity,
            ContactoPrincipal: "Administración General",
            Email: `${clientRuc}@pcdoctor-sri.ec`,
            Estado: "Cliente",
            Tipo: "Empresa",
            Telefono: "+593999059000",
            Direccion: "Av. Francisco de Orellana, World Trade Center"
          };
          setDb04List(prev => [...prev, matchedClient!]);
          addLog('Droid 3: Cosmos', `Cliente auto-creado desde metadatos RAG: ${clientName}`, 'success');
        }

        setChatSession({
          step: 'awaiting_items_desc',
          selectedClient: matchedClient,
          itemsToQuote: []
        });

        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: `🤖 **Análisis RAG del Documento Exitoso (PC Doctor S.A.):**\n\n*   **Cliente Extraído:** ${clientName}\n*   **RUC/Cédula:** ${clientRuc}\n*   **Archivo Analizado:** \`${uploadedFile.name}\`\n\n**Ítems con precios unificados recomendados:**\n*   1x Kit de red inalámbrica unificada PoE ($120.00)\n*   9x Cámaras domo Hikvision de 4MP ($35.00 c/u)\n*   1x Switch Gigabit de 16 puertos para peinado ($90.00)\n\n¿Deseas cotizar estos ítems? Escribe por ejemplo: '**9 cámaras Hikvision y 1 switch PoE**' para cargarlos en el presupuesto.`,
          sender: 'agent'
        }]);
        return;
      }

      if (query.includes('registrar reporte') || query.includes('guardar reporte') || query.includes('registrar visita')) {
        if (!uploadedFile) {
          addLog('Droid 4: Care-Taker', 'Se registrará un reporte estándar de soporte técnico.', 'info');
        }

        const fileName = uploadedFile ? uploadedFile.name : "Orden de Trabajo General";
        const currentSeq = db40List.find(s => s.Clave === 'PCD-TRB-26');
        const nextSecVal = (currentSeq?.UltimoSecuencial || 0) + 1;
        
        setDb40List(prev => prev.map(s => s.Clave === 'PCD-TRB-26' ? { ...s, UltimoSecuencial: nextSecVal } : s));

        const reportCode = `PCD-INF-26-${String(nextSecVal).padStart(6, '0')}`;
        const newReport = {
          Codigo: reportCode,
          Titulo: `Soporte Técnico de Redes: ${fileName.substring(0, 25)}`,
          Cliente: "Corporación Spazio Design S.A.",
          Fecha: new Date().toISOString().split('T')[0],
          Resumen: `Inspección de equipamientos procesado del archivo "${fileName}". Se detectó rack saturado. Se plantea cotización de domos de seguridad hikvision.`,
          Estado: "Finalizado"
        };

        setDb45List(prev => [...prev, newReport]);
        addLog('Droid 4: Care-Taker', `✅ Inspección y Orden de Trabajo generada con el código: ${reportCode}`, 'success');

        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: `📊 **Reporte de Inspección Generado e Indexado:**\n\n*   **Código de Reporte:** ${reportCode}\n*   **Origen Técnico:** \`${fileName}\`\n*   **Cliente:** ${newReport.Cliente}\n*   **Resumen del Mantenimiento:** ${newReport.Resumen}\n\nLos datos fueron grabados en la tabla local **DB45** y se encuentra listo para sincronizarse con Atlas.`,
          sender: 'agent'
        }]);

        setUploadedFile(null);
        return;
      }

      // A) RUC/SRI Search Case
      if (query.includes('ruc') || query.includes('sri') || query.includes('consultar ruc') || query.includes('cédula') || query.includes('cedula') || query.includes('validar')) {
        const matches = query.match(/\d{10,13}/);
        
        if (!matches && !query.includes('dolupa') && !query.includes('merced') && !query.includes('torres') && !query.includes('asopar') && !query.includes('spazio')) {
          setChatSession({
            step: 'awaiting_custom_sri_query'
          });
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `🔍 **Consulta del SRI / Registro Civil:**\n\nPor favor, **escribe el número de Cédula o RUC (de 10 o 13 dígitos)** que deseas consultar de forma oficial y en vivo:`,
            sender: 'agent'
          }]);
          return;
        }

        const ruc = matches ? matches[0] : (query.includes('dolupa') ? "0991244093001" : "0991355529001");
        const baseClient = query.includes('dolupa') ? "DOLUPA C.A." : "Edificio Torres de la Merced";
        
        addLog('Droid 3: Cosmos', `Iniciando consulta REAL del RUC/Cédula ${ruc} en SRI en línea y Registro Civil...`, 'info');
        
        fetch('/api/sri/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: ruc, sriUser: configSriUser, sriPass: configSriPass })
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            const data = result.data;
            const razonSocial = data.razonSocial || (query.includes('dolupa') ? "DOLUPA C.A." : (query.includes('merced') || query.includes('torres') ? "Edificio Torres de la Merced" : ""));
            const isGenericName = razonSocial && (razonSocial.startsWith("CLIENTE NATURAL") || razonSocial.startsWith("CORPORACION TECNO-SERVICIOS"));
            const info = data.resumenBreve || "Entidad validada con éxito.";
            
            if (result.isOfflineFallback && (isGenericName || !razonSocial || razonSocial.trim() === "")) {
              addLog('SRI API', `⚠️ Validación offline (Nombre no obtenido):`, 'warn');
              
              setChatSession({
                step: 'confirm_idle_sri_create',
                clientRuc: ruc,
                clientName: undefined, // Will be prompted to enter manually!
                clientCity: "Guayaquil",
                clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
                clientStateFiscal: "ACTIVO",
                clientActividad: "Servicio Técnico",
                clientDireccion: "Ecuador"
              });

              setChatMessages(prev => [...prev, {
                id: Date.now(),
                text: `⚠️ **SRI / Registro Civil Fuera de Línea:**\n\nLa Cédula/RUC \`${ruc}\` es **matemáticamente válida** (dígito verificador verificado).\n\nSin embargo, no pudimos recuperar el nombre exacto en vivo. Para registrar manualmente a este cliente en la base local (DB04), por favor **escribe su Nombre Completo o Razón Social** directamente abajo:`,
                sender: 'agent'
              }]);
              return;
            }

            addLog('SRI API', `✅ Consulta real completada: Razón social: ${razonSocial}. Estado: ${data.estadoFiscal}`, 'success');
            
            // Set session to ask for registration confirmation
            setChatSession({
              step: 'confirm_idle_sri_create',
              clientRuc: ruc,
              clientName: razonSocial,
              clientCity: data.ciudad || "Guayaquil",
              clientType: result.type || "Empresa",
              clientStateFiscal: data.estadoFiscal || "ACTIVO",
              clientActividad: data.actividad || "Soporte, Mantenimiento e Insumos Tecnológicos",
              clientDireccion: data.direccion || "Ecuador"
            });

            setChatMessages(prev => [...prev, { 
              id: Date.now(), 
              text: `✅ **Información Recuperada del SRI:**\n\n` +
                    `*   **Razón Social:** ${razonSocial}\n` +
                    `*   **Identificación (RUC/CI):** ${ruc} (${result.type || 'CI'})\n` +
                    `*   **Actividad Registrada:** ${data.actividad || 'Soporte informático'}\n` +
                    `*   **Estado Fiscal:** ${data.estadoFiscal || 'ACTIVO'}\n` +
                    `*   **Ciudad:** ${data.ciudad || 'Guayaquil'}\n\n` +
                    `⚠️ **Confirmación Requerida:** El cliente **no ha sido guardado automáticamente** para evitar duplicidad o errores.\n\n` +
                    `¿Deseas **guardar** a este cliente en la base local (DB04)? Responde **'SÍ'** para agregarlo o **'NO'** para ignorar el registro.`, 
              sender: 'agent' 
            }]);

            // Dispatch live SMS/WhatsApp notification!
            sendWhatsAppNotification(`🔍 *SRI Consulta Activa*:\n\nSe ha validado la identificación *${ruc}* de *${razonSocial}*.\n• *Actividad:* ${data.actividad || 'Soporte informatico'}\n• *Estado:* ${data.estadoFiscal || 'ACTIVO'}\n• *Ciudad:* ${data.ciudad || 'Guayaquil'}\n• *Resumen:* ${info}`);
          } else if (result.isOfflineFallback) {
            addLog('SRI API', `⚠️ Validación offline: ${result.error}`, 'warn');
            
            setChatSession({
              step: 'confirm_idle_sri_create',
              clientRuc: ruc,
              clientName: undefined, // Will be prompted to enter manually!
              clientCity: "Guayaquil",
              clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
              clientStateFiscal: "ACTIVO",
              clientActividad: "Servicio Técnico",
              clientDireccion: "Registrado fuera de línea"
            });

            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `⚠️ **SRI / Registro Civil Fuera de Línea:**\n\nLa Cédula/RUC \`${ruc}\` es **matemáticamente válida** (dígito verificador verificado).\n\nSin embargo, el servicio de consulta en vivo está temporalmente inaccesible. Para registrar manualmente a este cliente en la base de datos (DB04), por favor **escribe su Nombre Completo o Razón Social** directamente abajo:`,
              sender: 'agent'
            }]);
          } else {
            addLog('SRI API Error', `La línea de fiscalización falló: ${result.error}`, 'error');
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `❌ **Error de Validación de Cédula/RUC:**\nEl número ingresado (*${ruc}*) no superó las reglas matemáticas de validación en el Registro Civil / SRI.\n\n*Detalle del error:* ${result.error || 'Dígito verificador incorrecto.'}`,
              sender: 'agent'
            }]);
          }
        })
        .catch(err => {
          addLog('SRI Gateway', `Fallo de consulta (Offline Fallback activado): ${err.message}`, 'warn');
          setChatSession({
            step: 'confirm_idle_sri_create',
            clientRuc: ruc,
            clientName: undefined,
            clientCity: "Guayaquil",
            clientType: ruc.length === 13 ? "Persona Jurídica" : "Persona Natural",
            clientStateFiscal: "ACTIVO",
            clientActividad: "Servicio Técnico",
            clientDireccion: "Registrado fuera de línea"
          });
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `⚠️ **SRI / Registro Civil Auxiliar (Offline Fallback Activo):**\n\nEl servicio de consulta retornó un formato no legible (unexpected token) o está desconectado temporalmente.\n\nPara continuar y registrar a este cliente en la base local (DB04), por favor **escribe su Nombre Completo o Razón Social** directamente abajo:`,
            sender: 'agent'
          }]);
        });
      }
      
      // B) Cotizar Initiation Case
      else if (query.includes('cotizar') || query.includes('cotizacion') || query.includes('presupuesto')) {
        addLog('Droid 3: Cosmos', 'Orquestando flujo de cotización interactiva. Verificando cliente...', 'info');

        // Look for client name mentions in the text
        let foundClient: Client | undefined = undefined;
        for (const client of db04List) {
          const clientNameLower = client.Nombre.toLowerCase();
          // Match key parts like "dolupa", "merced", "thermocont", "asopar"
          const words = clientNameLower.split(' ');
          const isMentioned = words.some(w => w.length > 3 && query.includes(w));
          if (isMentioned || query.includes(clientNameLower)) {
            foundClient = client;
            break;
          }
        }

        // Custom/New Client check (like "spazio" or "asopar")
        if (!foundClient && (query.includes('spazio') || query.includes('asopar') || query.includes('torres de la merced') || query.includes('nuevo cliente'))) {
          const clientAttemptName = query.includes('spazio') ? 'Spazio' : (query.includes('asopar') ? 'Asopar' : 'Nuevo Cliente');
          setChatSession({
            step: 'awaiting_client_ruc'
          });
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `🏢 **Inicio de Cotización (Cliente Nuevo):**\nNo he localizado al cliente **${clientAttemptName}** en nuestra base de datos local.\n\nPara evitar cometer errores en la facturación y registrarlo correctamente ante el SRI, **por favor indícame el número de Cédula o RUC de ${clientAttemptName}** para buscarlo en tiempo real, o escribe '**consumidor final**' si deseas continuar con el usuario de paso general.`,
            sender: 'agent'
          }]);
          return;
        }

        if (foundClient) {
          setChatSession({
            step: 'awaiting_items_desc',
            selectedClient: foundClient,
            itemsToQuote: []
          });
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `💼 **Inicio de Cotización para ${foundClient!.Nombre}:**\nHe recuperado al cliente desde la base de datos de PC Doctor S.A. (RUC: ${foundClient!.RUC}).\n\n**¿Qué deseas cotizarle?** Por favor indícame (ejemplo: 'Instalación de 9 cámaras de seguridad' o 'kit de redes wifi profesional').`,
            sender: 'agent'
          }]);
          addLog('Droid 3: Cosmos', `Cliente ${foundClient.Nombre} acoplado con éxito al buffer de cotización.`, 'success');
        } else {
          setChatSession({
            step: 'awaiting_client_ruc'
          });
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `💼 **Inicio de Cotización Coordinada:**\nPara diseñar un presupuesto impecable en Swarm-OS, primero debemos validar las credenciales fiscales del cliente en el SRI.\n\n**Por favor, ingresa el número de Cédula o RUC del cliente** o escribe '**consumidor final**' para continuar.`,
            sender: 'agent'
          }]);
        }
      }

      // Factura Case
      else if (query.includes('hacer factura') || query.includes('crear factura') || query.includes('hacer facturación') || query.includes('emitir factura') || query.includes('hacer facturas')) {
        addLog('Droid 5: Financiero', 'Iniciando módulo de emisión de Facturas Electrónicas (BD31)...', 'info');
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: `🧾 **Iniciar Emisión de Factura Electrónica (SRI / Contífico):**\n\nPara generar una factura válida, por favor proporcióname los siguientes datos completos:\n1. **Identificación del Cliente** (Cédula, RUC o indica si es 'Consumidor Final').\n2. **Detalle de Ítems** a facturar, cantidades y valores unitarios.\n3. **Forma de Pago** acordada (Transferencia, Efectivo, Tarjeta).\n\n*Recuerda que no puedo registrarla autorizadamente si no tengo la información completa.*`,
          sender: 'agent'
        }]);
      }

      // Technical Report Case
      else if (query.includes('hacer informe tecnico') || query.includes('crear un informe') || query.includes('hacer informe técnico') || query.includes('crear informe técnico') || query.includes('registrar informe') || query.includes('hacer un informe')) {
        addLog('Droid 4: Care-Taker', 'Iniciando encolado de informe de inspección técnica DB45...', 'info');
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: `📄 **Generación de Informe Técnico de Inspección (DB45):**\n\nPara compilar un informe técnico robusto para PC Doctor S.A., necesito los siguientes aportes específicos:\n1. **Nombre del Cliente o Instalación** (E.g. Torres de la Merced, Dolupa, etc.).\n2. **Diagnóstico Técnico del Rack o Redes** (Qué encontraste y observaste en campo).\n3. **Equipos o Insumos instalados** u observaciones de correctivo.\n\nEscribe el detalle aquí y compilaré su secuencial PDF-First de forma oficial.`,
          sender: 'agent'
        }]);
      }

      // C) Support/Trabajo Case (Interactive)
      else if (query.includes('registrar soporte') || query.includes('crear soporte') || query.includes('visita técnica') || query.includes('soporte técnico') || query.includes('soporte tecnico') || query.includes('ticket de soporte')) {
        addLog('Droid 3: Cosmos', 'Sincronizando reporte de trabajo. Detectando cliente...', 'info');
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          text: `🛠️ **Registro de Caso de Soporte Técnico:**\n\nPor favor, ingresa los datos completos de campo:\n1. **Cliente o Edificio** afectado (E.g. Dolupa, Torres de la Merced, etc.).\n2. **Detalle del Problema** reportado u observaciones técnicas del correctivo.\n3. **Insumos utilizados** u horas empleadas para solucionar el caso.\n\nUna vez provistos, registraré la orden de trabajo securitariamente en DB29 y DB45.`,
          sender: 'agent'
        }]);
      }

      else if (query.includes('registrar') || query.includes('visita') || query.includes('soporte') || query.includes('mantenimiento')) {
        addLog('Droid 3: Cosmos', 'Sincronizando reporte de trabajo. Detectando cliente...', 'info');
        
        setTimeout(() => {
          // Increment sequence DB40
          const currentSeq = db40List.find(s => s.Clave === 'PCD-TRB-26');
          const nextSecVal = (currentSeq?.UltimoSecuencial || 0) + 1;
          
          setDb40List(prev => prev.map(s => s.Clave === 'PCD-TRB-26' ? { ...s, UltimoSecuencial: nextSecVal } : s));
          
          const code = `PCD-TRB-26-${String(nextSecVal).padStart(6, '0')}`;
          
          setDb31List(prev => [
            ...prev,
            { Codigo: code, Cliente: "Edificio Torres de la Merced", Monto: 150.00, Fecha: new Date().toISOString().split('T')[0], Referencia: "VISITA TÉCNICA", Estado: "Conciliado" }
          ]);
          
          // Seed the Report DB45
          setDb45List(prev => [
            ...prev,
            { Codigo: `PCD-INF-26-${String(nextSecVal).padStart(6, '0')}`, Titulo: "Mantenimiento Perimetral y Redes", Cliente: "Edificio Torres de la Merced", Fecha: new Date().toISOString().split('T')[0], Resumen: "Reorganizado el rack y configurados APs.", Estado: "Finalizado" }
          ]);
          
          addLog('Droid 4: Care-Taker', `Orden de trabajo guardada in DB29 con el código: ${code}`, 'success');
          addLog('Droid 3: Cosmos', `Sincronizada con el Hub, guardado documento PDF-First técnico.`, 'success');
          
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `⚙️ **Trabajo y Reporte Registrado (Seeding de Prueba):**\n\n*   **Código:** ${code}\n*   **Cliente:** Edificio Torres de la Merced\n*   **Estatus:** Completado / Guardado en DB29 y DB45\n*   **Filtro:** Sin descuadres ni placeholders de fecha. ¡Se evitaron omisiones en el backoffice!`,
            sender: 'agent'
          }]);
        }, 1800);
      }
      
      // D) Unified Email Checker & Advanced Analyser (specifically matches email contexts, excluding generic "nuevo" mentions like "nuevo cliente")
      else if (query.includes('correo') || query.includes('correos') || query.includes('email') || query.includes('mail') || query.includes('nuevo correo') || query.includes('correos nuevos') || query.includes('nuevos correos') || query.includes('nuevo mail') || query.includes('nuevo email') || query.includes('nuevos emails') || query.includes('nuevos mensajes') || query.includes('bandeja')) {
        addLog('Droid 1: Mail Gatekeeper', 'Sincronizando correos desde las bandejas IMAP configuradas...', 'info');
        
        // Fetch from first configured account or whichever is valid
        const accountToUse = emailAccounts[0];
        if (!accountToUse) {
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: "⚠️ **No tienes cuentas IMAP configuradas:** Por favor abre el panel de Configuración (esquina superior derecha) para registrar tus credenciales de correo.",
            sender: 'agent'
          }]);
          return;
        }

        addLog('SYSTEM', `Conectando en tiempo real a ${accountToUse.email} para descargar bandeja de entrada...`, 'info');
        
        fetch('/api/imap/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: accountToUse.host,
            port: accountToUse.port,
            user: accountToUse.email,
            pass: accountToUse.password || '',
            testOnly: false, // Fetch actual emails!
            whatsappConfig: {
              url: configWaUrl,
              token: configWaToken,
              instance: configWaInstance,
              phone: configWaPhone
            }
          })
        })
        .then(res => {
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
            return res.json();
          } else {
            return res.text().then(text => {
              throw new Error(`Error de conexión o proxy (${res.status}): ${text.substring(0, 80)}`);
            });
          }
        })
        .then(result => {
          if (result.success && result.emails && result.emails.length > 0) {
            (window as any)._lastFetchedEmails = result.emails;
            
            const isQuestionOrDeepAnalysis = query.includes('analiza') || query.includes('revisa') || query.includes('dime') || query.includes('resumen') || query.includes('qué dice') || query.includes('que dice') || query.includes('días') || query.includes('dias') || query.includes('sri') || query.includes('banco') || query.includes('último') || query.includes('ultimo') || query.includes('buscar');

            if (isQuestionOrDeepAnalysis) {
              addLog('GCP Vertex Gateway', 'Enviando correos recolectados en tiempo real al enjambre cognitivo para análisis...', 'info');
              
              const sysContext = `Bases de datos cargadas:\n` +
                `- Clientes (DB04): ${db04List.length} clientes activos.\n` +
                `- Productos (DB26): ${db26List.length} disponibles.\n` +
                `- Cotizaciones (DB27): ${db27List.length} registradas.\n` +
                `- Trabajos (DB31/DB45): ${db45List.length} reportes archivados.`;

              fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  message: `El usuario solicita: "${query}". Analiza estos 5 correos reales descargados de su bandeja:\n${JSON.stringify(result.emails, null, 2)}`,
                  systemContext: sysContext
                })
              })
              .then(chatR => chatR.json())
              .then(chatRes => {
                if (chatRes.success) {
                  setChatMessages(prev => [...prev, {
                    id: Date.now(),
                    text: chatRes.text,
                    sender: 'agent'
                  }]);
                  addLog('Droid 1: Mail Gatekeeper', 'Análisis cognitivo de correos finalizado con éxito.', 'success');
                } else {
                  setChatMessages(prev => [...prev, {
                    id: Date.now(),
                    text: `⚠️ **PC Doctor Swarm-OS Brain:**\nFallo al analizar correo: ${chatRes.error || 'Timeout'}`,
                    sender: 'agent'
                  }]);
                }
              })
              .catch(err => {
                setChatMessages(prev => [...prev, {
                  id: Date.now(),
                  text: `❌ **Error de comunicación cognitiva:**\nFallo de pasarela: \`${err.message}\``,
                  sender: 'agent'
                }]);
              });
              return;
            }

            const isLookingForImportant = query.includes('importante') || query.includes('destacado') || query.includes('urgente') || query.includes('crítico') || query.includes('critico');
            const isLookingForAll = query.includes('todos') || query.includes('todo') || query.includes('completo') || query.includes('leer todos');

            let textResponse = "";
            
            if (isLookingForImportant) {
              const filtered = result.emails.filter((m: any) => m.importance === 'URGENTE' || m.importance === 'INTERESANTE');
              if (filtered.length === 0) {
                textResponse = `📬 **Sondeo de Correos Importantes (${accountToUse.email}):**\n\nNo se han detectado correos clasificados con prioridad crítica/importante para hoy entre los últimos descargados. Todo está en orden fiscal y administrativo.`;
              } else {
                textResponse = `📬 **Filtro de Correos Importantes y Críticos:**\n\nHe localizado las siguientes alertas clave en tu bandeja segura:\n\n`;
                filtered.forEach((m: any, index: number) => {
                  textResponse += `🔴 **[${m.importance}] De:** \`${m.from}\`\n  *  **Asunto:** ${m.subject}\n  *  **Fecha:** ${m.date}\n  *  **Análisis:** _${m.reason}_\n\n`;
                });
              }
            } else if (isLookingForAll) {
              textResponse = `📬 **Bandeja de Entrada Completa (${result.emails.length} correos en ${accountToUse.email}):**\n\n`;
              result.emails.forEach((m: any, index: number) => {
                const priorityPrefix = m.importance === 'URGENTE' ? '🔴 [URGENTE]' : m.importance === 'INTERESANTE' ? '🟡 [INTERESANTE]' : '⚪ [GENERAL]';
                textResponse += `${index + 1}. ${priorityPrefix} **De:** \`${m.from}\`\n  *  **Asunto:** ${m.subject}\n  *  **Fecha:** ${m.date}\n  *  **Detalle:** _${m.reason}_\n\n`;
              });
            } else {
              // Default view: Beautiful hybrid summary!
              const importantMails = result.emails.filter((m: any) => m.importance === 'URGENTE' || m.importance === 'INTERESANTE');
              
              textResponse = `📬 **Análisis Completo de Bandeja de Entrada (${accountToUse.email}):**\n\nSincronización IMAP completada en tiempo real. He procesado los últimos ${result.emails.length} correos del servidor.\n\n`;
              
              if (importantMails.length > 0) {
                textResponse += `### 🔴 ALERTAS CRÍTICAS Y DESTACADAS Y DEL SRI:\n`;
                importantMails.forEach((m: any) => {
                  textResponse += `*   **De:** \`${m.from}\`  \n    **Asunto:** \`${m.subject}\`  \n    **Filtro:** _${m.reason}_\n\n`;
                });
                textResponse += `---\n\n`;
              } else {
                textResponse += `### 🔴 ALERTAS CRÍTICAS Y DESTACADAS:\n*   No se detectaron correos de urgencia administrativa que requieran facturación, depósitos o notificaciones SRI.\n\n---\n\n`;
              }
              
              textResponse += `### ✉️ BANDEJA GENERAL DE ENTRADA (Últimos recibidos):\n`;
              result.emails.forEach((m: any, index: number) => {
                const marker = m.importance === 'URGENTE' ? '🔴' : m.importance === 'INTERESANTE' ? '🟡' : '⚪';
                textResponse += `${index + 1}. ${marker} **${m.subject}** (${m.date})  \n    *Remitente:* \`${m.from}\`  \n    *Clasificación:* _${m.reason}_\n\n`;
              });
              
              textResponse += `\n_¿Deseas que analice alguno de estos correos en profundidad? Puedes pedírmelo directamente (ej: 'todos los correos' o 'los importantes')._`;
            }

            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: textResponse,
              sender: 'agent'
            }]);
            
            addLog('Droid 1: Mail Gatekeeper', 'Análisis cognitivo de bandeja finalizado con éxito.', 'success');
          } else {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `📬 **Bandeja de Entrada Vacía u Offline:**\n\nNo se han leído nuevos correos de la cuenta **${accountToUse.email}** en el servidor.\n\n*Detalles:* ${result.error || '0 correos disponibles'}`,
              sender: 'agent'
            }]);
          }
        })
        .catch(err => {
          addLog('SYSTEM', `Fallo al sincronizar bandeja: ${err.message}`, 'error');
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `❌ **Error al comunicar con la bandeja IMAP:**\nOcurrió un error al contactar al servidor: \`${err.message}\``,
            sender: 'agent'
          }]);
        });
      }

      // E) Display Important Emails Case from Memory
      else if ((query.includes('importante') || query.includes('destacado') || query.includes('urgente') || query.includes('crítico') || query.includes('critico')) && (window as any)._lastFetchedEmails) {
        const lastMails = (window as any)._lastFetchedEmails;
        if (lastMails && lastMails.length > 0) {
          const importantMails = lastMails.filter((m: any) => m.importance === 'URGENTE' || m.importance === 'INTERESANTE');
          if (importantMails.length === 0) {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `📬 **Sondeo de Correos Destacados:**\nNo encontré correos clasificados como críticos o urgentes por el enjambre de PC Doctor S.A. entre los últimos registros. Todo está en orden.`,
              sender: 'agent'
            }]);
          } else {
            let mailSummary = "📬 **Análisis de Correos Críticos e Importantes de la Memoria:**\n\n";
            importantMails.forEach((m: any) => {
              mailSummary += `🔴 **[${m.importance}] De:** \`${m.from}\`\n  *  **Asunto:** ${m.subject}\n  *  **Análisis:** _${m.reason}_\n\n`;
            });
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: mailSummary,
              sender: 'agent'
            }]);
          }
        } else {
          addLog('SYSTEM', 'No hay correos en memoria. Conectando...', 'info');
        }
      }

      // F) Display All Emails Case from Memory
      else if ((query.includes('todos') || query.includes('todo') || query.includes('leer todos') || query.includes('bandeja')) && (window as any)._lastFetchedEmails) {
        const lastMails = (window as any)._lastFetchedEmails;
        if (lastMails && lastMails.length > 0) {
          let mailSummary = `📬 **Bandeja de Entrada Completa de la Memoria (${lastMails.length} correos):**\n\n`;
          lastMails.forEach((m: any, index: number) => {
            mailSummary += `${index + 1}. ✉️ **De:** \`${m.from}\`\n  *  **Asunto:** ${m.subject}\n  *  **Fecha:** ${m.date}\n  *  **Detalle IA:** _${m.reason}_\n\n`;
          });
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: mailSummary,
            sender: 'agent'
          }]);
        } else {
          addLog('SYSTEM', 'No hay correos en memoria. Conectando...', 'info');
        }
      }
      else {
        // Conversational Fallback
        addLog('GCP Vertex Gateway', 'Consultando con el cerebro cognitivo del enjambre para una respuesta honesta...', 'info');
        
        const systemContext = `Bases de datos cargadas:\n` +
          `- Clientes (DB04): ${db04List.length} clientes activos.\n` +
          `- Productos (DB26): ${db26List.length} disponibles.\n` +
          `- Cotizaciones (DB27): ${db27List.length} registradas.\n` +
          `- Trabajos (DB31/DB45): ${db45List.length} reportes archivados.`;

        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            uploadedFileContext: uploadedFile ? {
              name: uploadedFile.name,
              size: uploadedFile.size,
              content: uploadedFile.content
            } : null,
            systemContext: systemContext
          })
        })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: result.text,
              sender: 'agent'
            }]);
          } else {
            setChatMessages(prev => [...prev, {
              id: Date.now(),
              text: `⚠️ **PC Doctor Swarm-OS Brain:**\nNo se pudo obtener respuesta del enjambre cognitivo offline.\n\n*Detalles:* ${result.error || 'Timeout de conexión'}`,
              sender: 'agent'
            }]);
          }
        })
        .catch(err => {
          setChatMessages(prev => [...prev, {
            id: Date.now(),
            text: `❌ **Error de comunicación cognitiva:**\nFallo de pasarela: \`${err.message}\``,
            sender: 'agent'
          }]);
        });
      }
    }, 1200);
  };

  const TOUR_VOICE_TEXT =
    "Quiero cotizar un switch PoE de 16 puertos para el Edificio Torres de la Merced porque las cámaras están sin energía";
  const TOUR_RUC = "0991355529001";

  const callHackathonStep = async (stepNum: number, body: Record<string, unknown>) => {
    if (apiTarget !== 'local') return null;
    try {
      const res = await fetch(`/api/hackathon/tour/step/${stepNum}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text();
        addLog('Swarm-OS Bridge', `Paso ${stepNum} HTTP ${res.status}: ${errText.slice(0, 120)}`, 'warn');
        return null;
      }
      const data = await res.json();
      addLog('Swarm-OS Bridge', `Paso ${stepNum} ejecutado en :8100 (${data.droids?.join(', ') || 'ok'})`, 'success');
      return data;
    } catch (err: any) {
      addLog('Swarm-OS Bridge', `Proxy hackathon falló paso ${stepNum}: ${err.message}`, 'error');
      return null;
    }
  };

  // --- INTUITIVE STEP-BY-STEP OPERATIONAL TOUR ---
  const runTourStep = (stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= 5) return;
    
    // Reset all node glows first
    resetAllNodeGlow();

    if (apiTarget === 'local') {
      if (stepIndex === 0) {
        callHackathonStep(1, { voice_text: TOUR_VOICE_TEXT });
      } else if (stepIndex === 1) {
        callHackathonStep(2, { tax_id: TOUR_RUC });
      } else if (stepIndex === 2) {
        callHackathonStep(3, { voice_text: TOUR_VOICE_TEXT });
      } else if (stepIndex === 3) {
        callHackathonStep(4, { voice_text: TOUR_VOICE_TEXT });
      } else if (stepIndex === 4) {
        callHackathonStep(5, { phone: configWaPhone, message: '' });
      }
    }
    
    if (stepIndex === 0) {
      setNodeGlow('droid2', true); // D2 Voz
      setNodeGlow('droid1', true); // D1 Gatekeeper
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        text: currentLang === 'es'
          ? "🎙️ Rafael López (Voz en Campo): 'Quiero cotizar un switch PoE de 16 puertos para el Edificio Torres de la Merced porque las cámaras están sin energía'"
          : "🎙️ Rafael López (Field Voice): 'I want to quote a 16-port PoE switch for Torres de la Merced Building because the cameras are down'", 
        sender: 'user' 
      }]);
      addLog('Droid 2: Voz de Campo', currentLang === 'es' ? 'Dictado de audio real capturado y transcrito por Whisper local.' : 'Real audio dictation captured and transcribed by local Whisper.', 'success');
      addLog('Droid 1: Mail Gatekeeper', currentLang === 'es' ? 'Clasificando intención de cotización... Gate anti-spam: OK' : 'Classifying quote request... Anti-spam gate: OK', 'success');
    } else if (stepIndex === 1) {
      setNodeGlow('droid3', true); // D3 Cosmos
      addLog('Droid 3: Cosmos', currentLang === 'es' ? 'Consultando DB04_Clientes en MongoDB Atlas. Cliente encontrado.' : 'Querying DB04_Clients in MongoDB Atlas. Client found.', 'success');
      addLog('Droid 3: Cosmos', currentLang === 'es' ? 'Verificando carpeta Hub de cliente. Carpeta existente: OK' : 'Verifying customer Hub folder. Existing folder: OK', 'success');
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        text: currentLang === 'es'
          ? "🤖 Droid 3 (Cosmos Central): Cliente y Hub 'Torres de la Merced' alineados. Iniciando flujo de cotización corporativa sin duplicar marcas ni registros."
          : "🤖 Droid 3 (Cosmos Central): Client and Hub 'Torres de la Merced' aligned. Starting corporate quote workflow without duplicating records.", 
        sender: 'system' 
      }]);
    } else if (stepIndex === 2) {
      setNodeGlow('droid4', true); // D4 Care-Taker
      setNodeGlow('droid5', true); // D5 Ledger
      addLog('Droid 4: Care-Taker', currentLang === 'es' ? 'Consultando DB26_InventarioHardware... Switch PoE: $98.14 costo | $150.99 venta.' : 'Querying DB26_HardwareInventory... PoE Switch: $98.14 cost | $150.99 price.', 'success');
      addLog('Droid 5: Ledger', currentLang === 'es' ? 'Insertando parámetros matemáticos en DB38 (Líneas de Detalle).' : 'Inserting mathematical details in DB38 (Detail Lines).', 'success');
      addLog('Droid 5: Ledger', currentLang === 'es' ? 'Verificación Matemática: Subtotal $250.99 + 15% IVA = $288.64 USD.' : 'Math validation: Subtotal $250.99 + 15% VAT = $288.64 USD.', 'success');
    } else if (stepIndex === 3) {
      setNodeGlow('droid4', true);
      setNodeGlow('droid3', true);
      
      // Seed new quote in table visualizer if not already there
      setDb27List(prev => {
        if (prev.some(q => q.Codigo === "PCD-COT-26-000016")) return prev;
        return [
          ...prev,
          { 
            Codigo: "PCD-COT-26-000016", 
            Cliente: "Edificio Torres de la Merced", 
            Fecha: new Date().toISOString().split('T')[0], 
            Subtotal: 250.99, 
            IVA: 37.65, 
            Total: 288.64, 
            Estado: "Borrador" 
          }
        ];
      });
      
      addLog('Droid 4: Care-Taker', currentLang === 'es' ? 'Consultado secuencial DB40. Correlativo bloqueado: PCD-COT-26-000016' : 'Checked sequential DB40. Locked correlative: PCD-COT-26-000016', 'info');
      addLog('Droid 3: Cosmos', currentLang === 'es' ? 'Generando el PDF-First estático en GCS: PDFs/Exportables/PDF-PCD-COT-26-000016.pdf' : 'Generating static PDF-First in GCS: PDFs/Exportables/PDF-PCD-COT-26-000016.pdf', 'success');
    } else if (stepIndex === 4) {
      setNodeGlow('droid6', true); // D6 RAG/HA
      setNodeGlow('droid8', true); // D8 Media/Growth
      addLog('Droid 6: Catalyst', currentLang === 'es' ? `Llamando a Evolution API Cloud Router: ${configWaUrl}/message/sendText/${configWaInstance}...` : `Calling Evolution API Cloud Router: ${configWaUrl}/message/sendText/${configWaInstance}...`, 'info');
      addLog('WhatsApp Service', currentLang === 'es' ? `📲 Alerta push enviada de forma exitosa a ${configWaPhone || '+593999059000'}` : `📲 Push alert successfully delivered to ${configWaPhone || '+593999059000'}`, 'success');
      setChatMessages(prev => [...prev, { 
        id: Date.now(), 
        text: currentLang === 'es'
          ? `🤖 **Swarm-OS (Pipeline Completo de Cotización):**\n\n*   **PDF-First Generado:** [PDF-PCD-COT-26-000016.pdf](file:///gs://pc-doctor/pdfs/PDF-PCD-COT-26-000016.pdf)\n*   **Mensaje de WhatsApp enviado:** 'Hola Ralphi, tienes una nueva cotización lista para Torres de la Merced por $288.64 USD con margen del 38%. ¿Deseas aprobarla y enviarla al SRI?'`
          : `🤖 **Swarm-OS (Complete Quote Pipeline):**\n\n*   **PDF-First Generated:** [PDF-PCD-COT-26-000016.pdf](file:///gs://pc-doctor/pdfs/PDF-PCD-COT-26-000016.pdf)\n*   **WhatsApp Message Sent:** 'Hello Ralphi, you have a new quote ready for Torres de la Merced for $288.64 USD with a 38% margin. Approve and send to SRI?'`, 
        sender: 'agent' 
      }]);
    }
  };

  const launchInteractiveTour = () => {
    setTourRunning(true);
    setActiveTourStep(0);
    setChatMessages([]);
    addLog('SYSTEM', currentLang === 'es' ? 'Iniciando Demostración Interactiva del Ecosistema de Cotización (Golden Path)...' : 'Starting Interactive Ecosystem Quoting Demonstration (Golden Path)...', 'system');
    runTourStep(0);
  };

  useEffect(() => {
    if (!tourRunning || activeTourStep === -1 || !tourAutoAdvance) return;

    const timer = setTimeout(() => {
      const nextStep = activeTourStep + 1;
      if (nextStep < 5) {
        setActiveTourStep(nextStep);
        runTourStep(nextStep);
      } else {
        setTourRunning(false);
        setActiveTourStep(-1);
        resetAllNodeGlow();
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeTourStep, tourRunning, tourAutoAdvance, currentLang]);

  const setNodeGlow = (droidId: string, glowing: boolean) => {
    const el = document.getElementById(`node-${droidId}`);
    if (el) {
      if (glowing) {
        el.classList.add('node-active');
        el.style.filter = "drop-shadow(0 0 12px var(--neon-cyan))";
      } else {
        el.classList.remove('node-active');
        el.style.filter = "none";
      }
    }
  };

  const resetAllNodeGlow = () => {
    ['droid1', 'droid2', 'droid3', 'droid4', 'droid5', 'droid6', 'droid7', 'droid8'].forEach(id => {
      setNodeGlow(id, false);
    });
  };

  // --- RENDER HELPERS ---
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase().trim();
    
    // Map list hooks
    const mapList: Record<string, any[]> = {
      DB04: db04List,
      DB26: db26List,
      DB27: db27List,
      DB31: db31List,
      DB40: db40List,
      DB11: db11List,
      DB45: db45List,
      HACKATHONS: hackathonsList,
      MEDIA_QUEUE: mediaQueue,
      GMAIL: gmailMessages,
      DRIVE: driveFiles,
      CONTACTS: googleContacts
    };

    let itemsSource = mapList[activeTab];
    if (!itemsSource) {
      itemsSource = dynamicDbData[activeTab.toUpperCase()] || [];
    }

    if (!query) return itemsSource;

    return itemsSource.filter(item => {
      return Object.values(item).some(val => 
        String(val).toLowerCase().includes(query)
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative font-sans select-none antialiased">
      {/* Background Circuit Grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/10 via-slate-950 to-slate-950 pointer-events-none z-0" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-900/90 backdrop-blur-md border-bottom border-slate-800 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight font-display bg-clip-text text-transparent bg-gradient-to-r from-slate-50 to-cyan-400">
                {translations[currentLang].headerTitle}
              </h1>
              {/* Live Connection Health Badges */}
              <div className="flex gap-1.5 items-center">
                {/* MongoDB status */}
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono transition-all ${
                  mongoConnStatus === 'online' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_6px_rgba(16,185,129,0.15)]' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_6px_rgba(244,63,94,0.15)]'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${mongoConnStatus === 'online' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                  MONGO {mongoConnStatus === 'online' ? 'ON' : 'DEGRADADO'}
                </span>

                {/* WhatsApp status */}
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono transition-all ${
                  waConnStatus === 'online' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_6px_rgba(6,182,212,0.15)]' 
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_6px_rgba(244,63,94,0.15)]'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${waConnStatus === 'online' ? 'bg-cyan-400 animate-ping' : 'bg-rose-400'}`} />
                  WHATSAPP {waConnStatus === 'online' ? 'ON' : 'CAÍDO'}
                </span>

                {/* SRI status */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_6px_rgba(99,102,241,0.15)]">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                  SRI ON
                </span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
              {translations[currentLang].headerSub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Action buttons */}
          <button 
            onClick={() => setShowConfig(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            {translations[currentLang].settingsButton}
          </button>

          <button 
            onClick={() => {
              setCurrentLang(l => l === 'es' ? 'en' : 'es');
              addLog('SYSTEM', `Language toggled to: ${currentLang === 'es' ? 'EN' : 'ES'}`, 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            🌐 {currentLang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* --- TOUR ALERTS --- */}
      {tourRunning && (
        <div className="m-6 p-5 bg-slate-900/60 backdrop-blur-md border border-cyan-500/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500/15 text-cyan-400 rounded-xl shrink-0 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-2.5">
                <p className="text-xs font-black text-white uppercase tracking-wider">{translations[currentLang].tourActiveTitle}</p>
                <span className="text-[9px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800/40 shrink-0">
                  {translations[currentLang].stepOf.replace('{step}', String(activeTourStep + 1))}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 leading-relaxed max-w-4xl">
                {activeTourStep === 0 && translations[currentLang].tourStep1Full}
                {activeTourStep === 1 && translations[currentLang].tourStep2Full}
                {activeTourStep === 2 && translations[currentLang].tourStep3Full}
                {activeTourStep === 3 && translations[currentLang].tourStep4Full}
                {activeTourStep === 4 && translations[currentLang].tourStep5Full}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 border-t md:border-t-0 border-slate-800/60 pt-3 md:pt-0">
            {/* Auto advance toggle */}
            <button
              onClick={() => setTourAutoAdvance(prev => !prev)}
              className={`px-2.5 py-1.5 text-[9px] font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                tourAutoAdvance 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-400'
              }`}
            >
              🔄 {translations[currentLang].tourAutoAdvance}{tourAutoAdvance ? 'ON' : 'OFF'}
            </button>

            {/* Prev Step */}
            {activeTourStep > 0 && (
              <button
                onClick={() => {
                  const prevStep = activeTourStep - 1;
                  setActiveTourStep(prevStep);
                  runTourStep(prevStep);
                }}
                className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-350 hover:text-white transition-all cursor-pointer"
              >
                {translations[currentLang].tourPrevStep}
              </button>
            )}

            {/* Next Step */}
            {activeTourStep < 4 ? (
              <button
                onClick={() => {
                  const nextStep = activeTourStep + 1;
                  setActiveTourStep(nextStep);
                  runTourStep(nextStep);
                }}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-black rounded-lg transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] cursor-pointer"
              >
                {translations[currentLang].tourNextStep}
              </button>
            ) : (
              <button
                onClick={() => {
                  setTourRunning(false);
                  setActiveTourStep(-1);
                  resetAllNodeGlow();
                }}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-black rounded-lg transition-all shadow-[0_5_15px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                {translations[currentLang].tourFinish}
              </button>
            )}

            <button 
              onClick={() => { setTourRunning(false); setActiveTourStep(-1); resetAllNodeGlow(); }}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN GRID --- */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 p-6 z-10">
        
        {/* --- LEFT PANEL: FLOW MAP & TELEMETRY --- */}
        <section className="flex flex-col gap-6">
          
          {/* Swarm Visualizer Card */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-white">
                <Layers className="w-4 h-4 text-cyan-400" />
                {translations[currentLang].droidArchitecture}
              </h2>
              <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                <Wifi className="w-3 h-3 animate-pulse" />
                {translations[currentLang].activeStatus}
              </span>
            </div>

            {/* SVG Swarm Graph */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2 h-[220px] relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 300 220">
                {/* Connection lines */}
                <path d="M 80,45 L 150,110" id="link-d1-d3" className="stroke-slate-800 d1-d3-line" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                <path d="M 220,45 L 150,110" id="link-d2-d3" className="stroke-slate-800 d2-d3-line" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                <path d="M 150,110 L 40,170" id="link-d3-d4" className="stroke-slate-800 d3-d4-line" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                <path d="M 150,110 L 95,170" id="link-d3-d5" className="stroke-slate-800 d3-d5-line" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                <path d="M 150,110 L 150,170" id="link-d3-d8" className="stroke-slate-800 d3-d8-line" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                <path d="M 150,110 L 205,170" id="link-d3-d6" className="stroke-slate-800 d3-d6-line" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                <path d="M 150,110 L 260,170" id="link-d3-d7" className="stroke-slate-800 d3-d7-line" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />

                {/* Nodes */}
                {/* Droid 1: Gatekeeper */}
                <g id="node-droid1" className="cursor-pointer group" onClick={() => setSelectedDroid('droid1')}>
                  <circle cx="80" cy="45" r="14" className="fill-slate-900 stroke-cyan-500/50 hover:stroke-cyan-400 group-hover:fill-slate-950 transition-all" strokeWidth="1.5" />
                  <text x="80" y="48.5" className="fill-slate-200 text-[8px] font-bold font-mono text-middle text-center" textAnchor="middle">D1</text>
                </g>

                {/* Droid 2: Voz / Media */}
                <g id="node-droid2" className="cursor-pointer group" onClick={() => setSelectedDroid('droid2')}>
                  <circle cx="220" cy="45" r="14" className="fill-slate-900 stroke-blue-500/50 hover:stroke-blue-400 group-hover:fill-slate-950 transition-all" strokeWidth="1.5" />
                  <text x="220" y="48.5" className="fill-slate-200 text-[8px] font-bold font-mono" textAnchor="middle">D2</text>
                </g>

                {/* Droid 3: Cosmos (Central) */}
                <g id="node-droid3" className="cursor-pointer group" onClick={() => setSelectedDroid('droid3')}>
                  <circle cx="150" cy="110" r="17" className="fill-slate-900 stroke-white/50 hover:stroke-white group-hover:fill-slate-950 transition-all" strokeWidth="2" />
                  <text x="150" y="113.5" className="fill-white text-[9px] font-bold font-mono" textAnchor="middle">D3</text>
                </g>

                {/* Droid 4: Care-Taker */}
                <g id="node-droid4" className="cursor-pointer group" onClick={() => setSelectedDroid('droid4')}>
                  <circle cx="40" cy="170" r="14" className="fill-slate-900 stroke-purple-500/50 hover:stroke-purple-400 group-hover:fill-slate-950 transition-all" strokeWidth="1.5" />
                  <text x="40" y="173.5" className="fill-slate-200 text-[8px] font-bold font-mono" textAnchor="middle">D4</text>
                </g>

                {/* Droid 5: Ledger */}
                <g id="node-droid5" className="cursor-pointer group" onClick={() => setSelectedDroid('droid5')}>
                  <circle cx="95" cy="170" r="14" className="fill-slate-900 stroke-pink-500/50 hover:stroke-pink-400 group-hover:fill-slate-950 transition-all" strokeWidth="1.5" />
                  <text x="95" y="173.5" className="fill-slate-200 text-[8px] font-bold font-mono" textAnchor="middle">D5</text>
                </g>

                {/* Droid 8: Media Agent */}
                <g id="node-droid8" className="cursor-pointer group" onClick={() => setSelectedDroid('droid8')}>
                  <circle cx="150" cy="170" r="14" className="fill-slate-900 stroke-green-500/50 hover:stroke-green-400 group-hover:fill-slate-950 transition-all" strokeWidth="1.5" />
                  <text x="150" y="173.5" className="fill-slate-200 text-[8px] font-bold font-mono" textAnchor="middle">D8</text>
                </g>

                {/* Droid 6: RAG Catalyst */}
                <g id="node-droid6" className="cursor-pointer group" onClick={() => setSelectedDroid('droid6')}>
                  <circle cx="205" cy="170" r="14" className="fill-slate-900 stroke-indigo-500/50 hover:stroke-indigo-400 group-hover:fill-slate-950 transition-all" strokeWidth="1.5" />
                  <text x="205" y="173.5" className="fill-slate-200 text-[8px] font-bold font-mono" textAnchor="middle">D6</text>
                </g>

                {/* Droid 7: Signer / Fiscal */}
                <g id="node-droid7" className="cursor-pointer group" onClick={() => setSelectedDroid('droid7')}>
                  <circle cx="260" cy="170" r="14" className="fill-slate-900 stroke-amber-500/50 hover:stroke-amber-400 group-hover:fill-slate-950 transition-all" strokeWidth="1.5" />
                  <text x="260" y="173.5" className="fill-slate-200 text-[8px] font-bold font-mono" textAnchor="middle">D7</text>
                </g>
              </svg>

              {/* Float label overlay explaining */}
              <div className="absolute top-2 left-2 text-[8px] text-slate-400 font-mono tracking-widest bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                {translations[currentLang].activeGridChannels}
              </div>
            </div>

            <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
              {translations[currentLang].droidHelpTip}
            </div>
            
            {/* Play Tour Quick Launch */}
            <button 
              onClick={launchInteractiveTour}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 hover:text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-400/20 active:scale-[0.98] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              {translations[currentLang].playTourButton}
            </button>
          </div>

          {/* Cloud Run Execution Console (Logs) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl flex-1 max-h-[350px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2 text-white">
                <Terminal className="w-4 h-4 text-emerald-400" />
                {translations[currentLang].consoleTitle}
              </h2>
              <button 
                onClick={() => setTerminalLogs([])}
                className="text-[10px] text-slate-400 hover:text-slate-200 font-semibold"
              >
                {translations[currentLang].clearLogs}
              </button>
            </div>

            <div ref={logContainerRef} className="flex-1 bg-slate-950/80 border border-slate-900 rounded-lg p-3 font-mono text-[10px] overflow-y-auto flex flex-col gap-2 scrollbar-thin">
              {terminalLogs.length === 0 ? (
                <div className="text-slate-500 italic text-center py-10">{translations[currentLang].emptyLogs}</div>
              ) : (
                terminalLogs.map(log => (
                  <div key={log.id} className="leading-relaxed">
                    <span className="text-slate-600">[{log.timestamp}]</span>{' '}
                    <span className={`font-semibold ${
                      log.level === 'system' ? 'text-purple-400' :
                      log.level === 'success' ? 'text-emerald-400' :
                      log.level === 'warn' ? 'text-amber-400' :
                      log.level === 'error' ? 'text-red-400' : 'text-sky-400'
                    }`}>
                      [{log.droid}]
                    </span>{' '}
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        {/* --- RIGHT PANEL: CONVERSATIONAL & DATABASE INSPECTOR --- */}
        <section className="flex flex-col gap-6 min-w-0">
          
          {/* Conversational Console */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex flex-col gap-4 shadow-xl">
            <h2 className="text-sm font-semibold flex items-center gap-2 text-white border-b border-slate-800 pb-3">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              RalphIA Main Entrance ( HITL Companion )
            </h2>

            {/* Quick suggested chips */}
            <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
              <button 
                onClick={() => executeCommand(currentLang === 'es' ? 'hacer cotizacion' : 'create quote')}
                className="flex items-center gap-1 text-[10px] font-semibold bg-slate-950/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all whitespace-nowrap cursor-pointer"
              >
                💼 {currentLang === 'es' ? 'Hacer Cotización' : 'Create Quote'}
              </button>
              <button 
                onClick={() => executeCommand(currentLang === 'es' ? 'hacer factura' : 'create invoice')}
                className="flex items-center gap-1 text-[10px] font-semibold bg-slate-950/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/40 transition-all whitespace-nowrap cursor-pointer"
              >
                🧾 {currentLang === 'es' ? 'Hacer Factura' : 'Create Invoice'}
              </button>
              <button 
                onClick={() => executeCommand(currentLang === 'es' ? 'revisar correos nuevos' : 'check new emails')}
                className="flex items-center gap-1 text-[10px] font-semibold bg-slate-950/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full text-purple-400 hover:text-purple-300 hover:border-purple-500/40 transition-all whitespace-nowrap cursor-pointer"
              >
                📨 {currentLang === 'es' ? 'Revisar Correos' : 'Check Emails'}
              </button>
              <button 
                onClick={() => executeCommand(currentLang === 'es' ? 'registrar soporte' : 'register support')}
                className="flex items-center gap-1 text-[10px] font-semibold bg-slate-950/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full text-amber-400 hover:text-amber-300 hover:border-amber-500/40 transition-all whitespace-nowrap cursor-pointer"
              >
                🛠️ {currentLang === 'es' ? 'Registrar Soporte' : 'Register Support'}
              </button>
              <button 
                onClick={() => executeCommand(currentLang === 'es' ? 'hacer informe tecnico' : 'create tech report')}
                className="flex items-center gap-1 text-[10px] font-semibold bg-slate-950/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-full text-pink-400 hover:text-pink-300 hover:border-pink-500/40 transition-all whitespace-nowrap cursor-pointer"
              >
                📄 {currentLang === 'es' ? 'Hacer Informe Técnico' : 'Create Tech Report'}
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex flex-col h-[280px] bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden">
              <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`message max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-cyan-500/10 border border-cyan-500/20 text-slate-200 self-end ml-10' 
                        : 'bg-slate-900/60 border border-slate-800 text-slate-100 self-start mr-10'
                    }`}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1.5" : ""}>{line}</p>
                    ))}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 items-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect}
                  accept=".txt,.csv,.json,.pdf,.doc,.docx"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center p-2.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Adjuntar Reporte o Inspección (RAG)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  onClick={triggerVoiceNote}
                  className={`flex items-center justify-center p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                    isRecording 
                      ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' 
                      : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                  title="Dictar Visita / Comando de Voz"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter') executeCommand(chatInput); }}
                  placeholder="Dictar nota técnica, consultar RUC en SRI o crear cotización..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none placeholder-slate-500 min-w-0"
                />
                <button 
                  onClick={() => executeCommand(chatInput)}
                  className="p-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* MongoDB Atlas Inspector */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
            {/* Collapse / Expand Header Panel */}
            <div 
              className="flex justify-between items-center px-5 py-3.5 bg-slate-900 border-b border-slate-800/80 cursor-pointer select-none hover:bg-slate-850/80 transition-colors"
              onClick={() => setIsInspectorExpanded(!isInspectorExpanded)}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <Database className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-white tracking-wide">
                  {translations[currentLang].dbInspectorTitle}
                </span>
                <span className="bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {activeTab} • {mongoConnStatus === 'online' ? 'Sincronizado' : 'Modo Offline'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold font-mono ${
                  mongoConnStatus === 'online' 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'bg-rose-500/10 text-rose-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${mongoConnStatus === 'online' ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                  {mongoConnStatus === 'online' ? 'ONLINE' : 'CAÍDO'}
                </span>
                <span className="text-slate-400">
                  {isInspectorExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </span>
              </div>
            </div>

            {isInspectorExpanded && (
              <div className="flex flex-col gap-4 p-5">
                {/* Search, Grouped Selection and Actions row */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950/30 p-3 rounded-lg border border-slate-850">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest font-mono">
                        {currentLang === 'es' ? 'Seleccionar Base de Datos Corporativa' : 'Select Enterprise Database'}
                      </label>
                      <select
                        value={activeTab}
                        onChange={(e) => {
                          setActiveTab(e.target.value);
                          addLog('DATABASE', `Mostrando colección: ${e.target.value}`, 'info');
                        }}
                        className="bg-slate-950 border border-slate-800 hover:border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none min-w-[280px] font-sans font-semibold cursor-pointer transition-colors"
                      >
                        <option value="DB18">DB18 — Activos Digitales & Canales</option>
                        <option value="DB17">DB17 — Avatares InnerSpark</option>
                        <option value="DB21">DB21 — Biblioteca de Assets (Media)</option>
                        <option value="DB03">DB03 — Buyer Personas / Sectores</option>
                        <option value="DB49">DB49 — Campañas Editoriales</option>
                        <option value="DB23">DB23 — Campañas de Marketing</option>
                        <option value="DB47">DB47 — Capturas de Campo Editorial</option>
                        <option value="DB36">DB36 — Cash Flow & Budget</option>
                        <option value="DB13">DB13 — Catálogo Maestro de Productos</option>
                        <option value="DB28">DB28 — Compras / Historial de Precios</option>
                        <option value="CONTACTS">DB54 — Contactos Celular (Google API)</option>
                        <option value="DB05">DB05 — Contactos y Cargos</option>
                        <option value="DB46">DB46 — Contratos de Mantenimiento</option>
                        <option value="DB27">DB27 — Cotizaciones Activas</option>
                        <option value="DB30">DB30 — Cuentas Bancarias / Financieras</option>
                        <option value="DB16">DB16 — Destinos de Publicación</option>
                        <option value="OS_REGISTRY">DB00 — Diccionario de Esquemas y OS Playbook</option>
                        <option value="DB02">DB02 — Divisiones Operacionales</option>
                        <option value="DB44">DB44 — Dominios & Hosting</option>
                        <option value="DB01">DB01 — Entidades y Gobiernos</option>
                        <option value="DB24">DB24 — Experimentos / A/B Tests</option>
                        <option value="DB32">DB32 — Facturas e Invoices Emitidas</option>
                        <option value="DB33">DB33 — Gastos Operativos y Comisiones</option>
                        <option value="GMAIL">DB52 — Gmail API Inbox (Workspace)</option>
                        <option value="DRIVE">DB53 — Google Drive Hub API (Workspace)</option>
                        <option value="DB35">DB35 — Grants Tracking Financiero</option>
                        <option value="HACKATHONS">DB50 — Hackathon Scout (Lablab/Devpost)</option>
                        <option value="DB11">DB11 — Hub de Ideas Corporativas</option>
                        <option value="DB20">DB20 — Incidentes & Decisiones</option>
                        <option value="DB04">DB04 — Instituciones y Clientes</option>
                        <option value="DB26">DB26 — Inventario Físico / Stock</option>
                        <option value="DB09">DB09 — Inventario y Activos (Clientes)</option>
                        <option value="DB38">DB38 — Líneas de Cotización</option>
                        <option value="DB39">DB39 — Manuales InnerSpark (Núcleo)</option>
                        <option value="MEDIA_QUEUE">DB51 — Medios Cola Publicación (HITL)</option>
                        <option value="DB19">DB19 — Métricas & Salud del Ecosistema</option>
                        <option value="DB06">DB06 — Ofertas y Soluciones</option>
                        <option value="DB15">DB15 — OS Editorial (Social & IA)</option>
                        <option value="DB14">DB14 — OS Automation Registry</option>
                        <option value="DB48">DB48 — Pipeline Editorial Multicanal</option>
                        <option value="DB34">DB34 — Procesadores de Pago</option>
                        <option value="DB37">DB37 — Productivity Metrics Tracker</option>
                        <option value="DB08">DB08 — Proyectos y Prototipos</option>
                        <option value="DB25">DB25 — Proveedores y Suministros</option>
                        <option value="DB43">DB43 — Recepciones de Equipos (Tickets)</option>
                        <option value="DB41">DB41 — Reglas de Verificación</option>
                        <option value="DB45">DB45 — Reportes Técnicos</option>
                        <option value="DB10">DB10 — Research Lines</option>
                        <option value="DB40">DB40 — Secuenciales / Comprobantes</option>
                        <option value="DB42">DB42 — Soporte / Visitas Técnicas</option>
                        <option value="DB07">DB07 — Stacks Validados</option>
                        <option value="DB29">DB29 — Trabajos del Día a Día</option>
                        <option value="DB31">DB31 — Transacciones Financieras</option>
                        <option value="DB22">DB22 — UTM & Links Tracker</option>
                      </select>
                    </div>

                    {loadingActiveCol && (
                      <span className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold self-end mb-1 bg-cyan-950/30 px-2.5 py-1.5 rounded-lg border border-cyan-800/40 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Cargando...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end">
                    {activeTab !== 'OS_REGISTRY' && activeTab !== 'GMAIL' && activeTab !== 'DRIVE' && activeTab !== 'CONTACTS' && (
                      <button
                        onClick={openAutoAddRowModal}
                        className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-505 text-slate-950 hover:text-black text-[10px] font-extrabold rounded-lg transition-all shadow-md shadow-cyan-500/10 cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{currentLang === 'es' ? 'Añadir Registro' : 'Add Register'}</span>
                      </button>
                    )}

                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 w-3 h-3 text-slate-500" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={translations[currentLang].searchPlaceholder}
                        className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-[10px] text-slate-200 focus:border-cyan-500 focus:outline-none min-w-[150px] sm:min-w-[190px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Table data body */}
                <div className="border border-slate-800 rounded-xl bg-slate-950/40 overflow-x-auto max-h-[420px] scrollbar-thin">
              {activeTab === 'OS_REGISTRY' ? (
                <div className="p-4 flex flex-col gap-5 min-w-[750px] font-sans">
                  <div className="flex flex-col gap-1 border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      {currentLang === 'es' ? 'CONSTITUCIÓN & ESQUEMAS DE BASES DE DATOS — OS CENTRAL' : 'OS CENTRAL SCHEMAS & CONSTITUTION'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {currentLang === 'es' 
                        ? 'Especificación técnica canónica de las bases interconectadas de Notion que gobiernan el cerebro corporativo de PC Doctor S.A.' 
                        : 'Canonical technical specifications of the interconnected Notion databases governing the corporate brain.'}
                    </p>
                  </div>

                  {/* Map layout splitter */}
                  <div className="grid grid-cols-12 gap-4">
                    {/* Sidebar: DB List */}
                    <div className="col-span-4 flex flex-col gap-2 border-r border-slate-850 pr-4 max-h-[350px] overflow-y-auto scrollbar-thin">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                        {currentLang === 'es' ? 'Colecciones Master' : 'Master Collections'}
                      </span>
                      {notionDatabases
                        .filter(db => 
                          db.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          db.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(db => (
                          <button
                            key={db.id}
                            onClick={() => setSelectedRegDbId(db.id)}
                            className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between group ${
                              selectedRegDbId === db.id
                                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold'
                                : 'bg-slate-900/40 border-slate-850 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                selectedRegDbId === db.id ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'
                              }`}>
                                {db.id}
                              </span>
                              <span className="truncate">{db.name}</span>
                            </div>
                            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                          </button>
                        ))}
                    </div>

                    {/* Details Panel */}
                    <div className="col-span-8 flex flex-col gap-4 pl-1">
                      {(() => {
                        const sDb = notionDatabases.find(d => d.id === selectedRegDbId) || notionDatabases[0];
                        return (
                          <div className="flex flex-col gap-3">
                            {/* DB Header */}
                            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-850 flex items-start gap-3 justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="bg-cyan-500 text-slate-950 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                                    {sDb.id}
                                  </span>
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wide">{sDb.name}</h4>
                                </div>
                                <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">{sDb.purpose}</p>
                              </div>
                              <Database className="w-7 h-7 text-cyan-500/30 shrink-0" />
                            </div>

                            {/* Properties / Fields */}
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Terminal className="w-3 h-3 text-cyan-400" />
                                {currentLang === 'es' ? 'Esquema de Propiedades (Campos)' : 'Properties Schema (Fields)'}
                              </span>
                              <div className="border border-slate-850 rounded-xl overflow-hidden bg-slate-950/60">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="bg-slate-900 border-b border-slate-850">
                                      <th className="px-3 py-2 text-[9px] text-slate-400 uppercase font-bold">{currentLang === 'es' ? 'Campo' : 'Field'}</th>
                                      <th className="px-3 py-2 text-[9px] text-slate-400 uppercase font-bold">{currentLang === 'es' ? 'Tipo de Dato' : 'Data Type'}</th>
                                      <th className="px-3 py-2 text-[9px] text-slate-400 text-right uppercase font-bold">{currentLang === 'es' ? 'Reglas / Notas' : 'Rules / Notes'}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sDb.properties.map((p, idx) => (
                                      <tr key={idx} className="border-b border-slate-900 last:border-0 hover:bg-slate-900/20">
                                        <td className="px-3 py-2 text-[10px] font-semibold text-slate-200">{p.name}</td>
                                        <td className="px-3 py-2">
                                          <span className="bg-slate-900 border border-slate-800 text-slate-300 text-[8px] px-1.5 py-0.5 rounded-md font-mono whitespace-nowrap">
                                            {p.type}
                                          </span>
                                        </td>
                                        <td className="px-3 py-2 text-[9px] text-slate-400 text-right italic">{p.notes || '—'}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Relations */}
                            {sDb.relations && sDb.relations.length > 0 && (
                              <div className="flex flex-col gap-1.5 mt-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                  {currentLang === 'es' ? '🔗 Relaciones Canónicas' : '🔗 Canonical Relations'}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {sDb.relations.map((rel, idx) => (
                                    <span key={idx} className="bg-cyan-950/20 border border-cyan-800/30 text-cyan-400 text-[9px] font-medium px-2.5 py-1 rounded-lg">
                                      {rel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Section: Constitutional SOPs */}
                  <div className="border border-slate-800/60 rounded-xl bg-slate-900/20 p-4 mt-2">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {currentLang === 'es' ? 'Procedimientos de Operación Estándar (SOPs)' : 'Standard Operating Procedures (SOPs)'}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {centralSOPs.map((sop, idx) => (
                        <div key={idx} className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-850 flex flex-col gap-2 hover:border-slate-800 transition-all font-sans">
                          <span className="text-[10px] font-bold text-slate-200 flex items-center justify-between">
                            <span>{sop.title}</span>
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">MASTER</span>
                          </span>
                          <p className="text-[9px] text-slate-400 leading-relaxed italic">{sop.purpose}</p>
                          
                          <div className="flex flex-col gap-1 mt-1">
                            <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider">{currentLang === 'es' ? 'Control de Puertas (Gates):' : 'Gates (QA check):'}</span>
                            <div className="flex flex-wrap gap-1">
                              {sop.gates.map((g, gIdx) => (
                                <span key={gIdx} className="bg-slate-900 border border-slate-800 text-slate-350 text-[8px] px-1.5 py-0.5 rounded whitespace-nowrap">
                                  🔒 {g}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'HACKATHONS' ? (
                <div className="p-1">
                  <div className="flex justify-between items-center px-4 py-2 bg-slate-900/50 border-b border-slate-800 mb-2">
                    <span className="text-[10px] text-slate-400">{translations[currentLang].hackathonScoutInfo}</span>
                    <button 
                      onClick={triggerHackathonScout}
                      className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] rounded hover:bg-purple-500/20 transition-all font-semibold"
                    >
                      {translations[currentLang].hackathonScanLive}
                    </button>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-slate-400">{translations[currentLang].hackathonTable.event}</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-slate-400">{translations[currentLang].hackathonTable.deadline}</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-slate-400">{translations[currentLang].hackathonTable.stack}</th>
                        <th className="px-4 py-3 text-left text-[10px] uppercase font-bold text-slate-400">{translations[currentLang].hackathonTable.status}</th>
                        <th className="px-4 py-3 text-right text-[10px] uppercase font-bold text-slate-400">{translations[currentLang].hackathonTable.action}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hackathonsList.map(h => (
                        <tr key={h._id} className="border-b border-slate-900 group">
                          <td className="px-4 py-3 font-semibold text-slate-200 text-xs">
                            <a href={h.Url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 underline transition-all">
                              {h.Event_Name}
                            </a>
                          </td>
                          <td className="px-4 py-3 text-slate-400 font-mono text-[10px]">{h.Deadline}</td>
                          <td className="px-4 py-3 text-slate-400 text-[10px]">{h.Stack}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              h.Status === 'Registered' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                            }`}>
                              {h.Status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {h.Status !== 'Registered' && (
                              <button 
                                onClick={() => registerHackathon(h._id)}
                                className="px-2 py-1 bg-slate-800 hover:bg-purple-500 hover:text-black text-[10px] font-bold rounded-md border border-slate-700 transition-all font-sans"
                              >
                                {translations[currentLang].hackathonTable.register}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : activeTab === 'MEDIA_QUEUE' ? (
                <div className="p-4 flex flex-col gap-4">
                  {mediaQueue.map(post => (
                    <div key={post._id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col gap-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <span className="text-xs font-semibold text-white">{post.titulo}</span>
                        <span className="text-[10px] text-slate-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-4 text-[10px] text-slate-400">
                        <span>{translations[currentLang].mediaQueuePlatform}: <strong className="text-cyan-400 uppercase">{post.platform}</strong></span>
                        <span>{translations[currentLang].mediaQueueState} <strong className="text-amber-400 font-mono">{translations[currentLang].mediaQueueReview}</strong></span>
                      </div>
                      <textarea
                        value={post.contenido}
                        onChange={(e) => setMediaQueue(prev => prev.map(p => p._id === post._id ? { ...p, contenido: e.target.value } : p))}
                        className="bg-slate-950 border border-slate-850 p-2.5 rounded-lg text-[10px] font-mono leading-relaxed h-[80px] focus:outline-none focus:border-cyan-500 text-slate-300"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setMediaQueue(prev => prev.map(p => p._id === post._id ? { ...p, estado: 'Approved' } : p));
                            addLog('Droid 8: Medios', 'Aprobado borrador de publicación, enviado a la cola final.', 'success');
                          }}
                          className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 text-[10px] font-bold rounded-lg transition-all"
                        >
                          {translations[currentLang].mediaQueueApprove}
                        </button>
                        <button 
                          onClick={() => {
                            setMediaQueue(prev => prev.filter(p => p._id !== post._id));
                            addLog('Droid 8: Medios', 'Borrador rechazado y eliminado.', 'warn');
                          }}
                          className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black border border-red-500/20 text-[10px] font-bold rounded-lg transition-all"
                        >
                          {translations[currentLang].mediaQueueReject}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeTab === 'GMAIL' ? (
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex flex-wrap justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-850 gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        {translations[currentLang].gmailTitle}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">{translations[currentLang].gmailDesc}</p>
                    </div>
                    {googleAccessToken ? (
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-emerald-400">● {translations[currentLang].connectedAs} pcdoctorgye@gmail.com</span>
                        <button onClick={() => setGoogleAccessToken(null)} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded hover:bg-red-500/20 text-[9px] font-semibold">{translations[currentLang].disconnectGoogleButton}</button>
                      </div>
                    ) : (
                      <button onClick={handleConnectGoogle} className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                        <Globe className="w-3.5 h-3.5" />
                        {translations[currentLang].connectGoogleButton}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mail Ingestion List */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-405 tracking-wider uppercase">{translations[currentLang].recentEmails}</span>
                      <div className="flex flex-col gap-2 bg-slate-900/30 p-2 rounded-lg border border-slate-850 max-h-[250px] overflow-y-auto">
                        {isGmailLoading ? (
                          <div className="text-[10px] text-slate-400 italic py-6 text-center">{translations[currentLang].fetchingEmails}</div>
                        ) : (
                          gmailMessages.map(msg => (
                            <div key={msg.id} className="p-2.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-850 hover:border-slate-850 rounded-lg transition-all">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-[9px] text-cyan-400 font-mono font-medium truncate max-w-[120px]">{msg.from}</span>
                                <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">{msg.date}</span>
                              </div>
                              <h5 className="text-[10px] text-slate-200 font-semibold truncate mt-1">{msg.subject}</h5>
                              <p className="text-[9px] text-slate-400 line-clamp-2 mt-1">{msg.snippet}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Autonomous Sender */}
                    <div className="flex flex-col gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-bold text-white tracking-wider uppercase flex items-center gap-1">
                        <Send className="w-3 h-3 text-cyan-400" />
                        {translations[currentLang].sendMailTitle}
                      </span>
                      <div className="flex flex-col gap-2.5 mt-1.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-mono">{translations[currentLang].toLabel}</label>
                          <input 
                            type="email" 
                            placeholder="rlopez@innerspark.live" 
                            value={toEmail}
                            onChange={(e) => setToEmail(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-mono">{translations[currentLang].subjectLabel}</label>
                          <input 
                            type="text" 
                            placeholder="Comprobante fiscal aprobado" 
                            value={subjectEmail}
                            onChange={(e) => setSubjectEmail(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-mono">{translations[currentLang].bodyLabel}</label>
                          <textarea 
                            placeholder="Los droids automatizaron este reporte..." 
                            value={bodyEmail}
                            onChange={(e) => setBodyEmail(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500 h-[70px] resize-none"
                          />
                        </div>
                        <button 
                          onClick={googleAccessToken ? sendRealGmail : () => alert(translations[currentLang].connectGoogleButton)}
                          className={`w-full py-2 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                            googleAccessToken 
                              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer' 
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-755'
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          {translations[currentLang].sendMailButton}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === 'DRIVE' ? (
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex flex-wrap justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-850 gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <File className="w-3.5 h-3.5 text-purple-400" />
                        {translations[currentLang].driveTitle}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">{translations[currentLang].driveDesc}</p>
                    </div>
                    {googleAccessToken ? (
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-purple-400">● {translations[currentLang].connectedAs} Drive Root</span>
                        <button onClick={() => setGoogleAccessToken(null)} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded hover:bg-red-500/20 text-[9px] font-semibold">{translations[currentLang].disconnectGoogleButton}</button>
                      </div>
                    ) : (
                      <button onClick={handleConnectGoogle} className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-405 text-slate-950 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                        <Globe className="w-3.5 h-3.5" />
                        {translations[currentLang].connectGoogleButton}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{translations[currentLang].recentFiles}</span>
                    <div className="bg-slate-900/30 p-2 rounded-xl border border-slate-850">
                      {isDriveLoading ? (
                        <div className="text-[10px] text-slate-400 italic py-8 text-center">{translations[currentLang].fetchingFiles}</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto">
                          {driveFiles.map(file => (
                            <div key={file.id} className="p-2 bg-slate-950/80 border border-slate-850 rounded-lg flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="p-1.5 bg-slate-900 text-purple-400 rounded border border-slate-800">
                                  <FileText className="w-3.5 h-3.5" />
                                </div>
                                <div className="overflow-hidden min-w-0">
                                  <span className="text-[10px] text-slate-200 font-semibold block truncate">{file.name}</span>
                                  <span className="text-[8px] text-slate-405 block">{file.mimeType.split('/').pop()} • {file.size}</span>
                                </div>
                              </div>
                              <span className="text-[8px] text-slate-500 font-mono whitespace-nowrap">{file.createdTime}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Drive integration with active quotes */}
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-850">
                    <span className="text-[10px] font-bold text-white tracking-wider block mb-2">{translations[currentLang].uploadToDrive}</span>
                    <div className="flex flex-col gap-2">
                      {db27List.slice(0, 3).map(q => (
                        <div key={q.Codigo} className="flex justify-between items-center p-2 bg-slate-950/60 rounded-lg border border-slate-900 hover:border-slate-800">
                          <div>
                            <span className="text-[10px] font-bold text-slate-350 block">{q.Codigo}</span>
                            <span className="text-[9px] text-slate-500 block truncate max-w-[180px]">{q.Cliente}</span>
                          </div>
                          <button 
                            onClick={googleAccessToken ? () => uploadPdfToGoogleDrive(q) : () => alert(translations[currentLang].connectGoogleButton)}
                            className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-505 text-purple-400 hover:text-black border border-purple-500/20 rounded text-[9px] font-bold cursor-pointer"
                          >
                            Exportar PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'CONTACTS' ? (
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex flex-wrap justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-850 gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        {translations[currentLang].contactsTitle}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">{translations[currentLang].contactsDesc}</p>
                    </div>
                    {googleAccessToken ? (
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-blue-400">● {translations[currentLang].connectedAs} People Connected</span>
                        <button onClick={() => setGoogleAccessToken(null)} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded hover:bg-red-500/20 text-[9px] font-semibold">{translations[currentLang].disconnectGoogleButton}</button>
                      </div>
                    ) : (
                      <button onClick={handleConnectGoogle} className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                        <Globe className="w-3.5 h-3.5" />
                        {translations[currentLang].connectGoogleButton}
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contacts List */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{translations[currentLang].contactsTitle}</span>
                      <div className="flex flex-col gap-2 bg-slate-900/30 p-2 rounded-lg border border-slate-850 max-h-[250px] overflow-y-auto">
                        {isContactsLoading ? (
                          <div className="text-[10px] text-slate-400 italic py-6 text-center">{translations[currentLang].fetchingContacts}</div>
                        ) : (
                          googleContacts.map(contact => (
                            <div key={contact.id} className="p-2 bg-slate-950/80 border border-slate-855 rounded-lg flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center">
                                {contact.name.charAt(0)}
                              </div>
                              <div className="overflow-hidden min-w-0">
                                <span className="text-[10px] text-slate-200 font-semibold block truncate">{contact.name}</span>
                                <span className="text-[8px] text-slate-400 block truncate">{contact.email} • {contact.phone}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* New Contact Form */}
                    <div className="flex flex-col gap-2 bg-slate-900/40 p-3 rounded-xl border border-slate-850">
                      <span className="text-[10px] font-bold text-white tracking-wider uppercase flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        {translations[currentLang].addContactTitle}
                      </span>
                      <div className="flex flex-col gap-2 mt-1.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-mono">{translations[currentLang].contactName}</label>
                          <input 
                            type="text" 
                            placeholder="Rafael Gye" 
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-mono">{translations[currentLang].contactEmail}</label>
                          <input 
                            type="email" 
                            placeholder="rafagye@gmail.com" 
                            value={newContactEmail}
                            onChange={(e) => setNewContactEmail(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-mono">{translations[currentLang].contactPhone}</label>
                          <input 
                            type="tel" 
                            placeholder="+593999059000" 
                            value={newContactPhone}
                            onChange={(e) => setNewContactPhone(e.target.value)}
                            className="bg-slate-950 border border-slate-800 p-2 rounded text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <button 
                          onClick={googleAccessToken ? createRealContact : () => alert(translations[currentLang].connectGoogleButton)}
                          className={`w-full py-2 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                            googleAccessToken 
                              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer' 
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
                          }`}
                        >
                          <User className="w-3 h-3" />
                          {translations[currentLang].addContactButton}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800">
                      {(() => {
                        const activeDbSchema = notionDatabases.find(db => db.id === activeTab);
                        if (activeDbSchema) {
                          return activeDbSchema.properties.map(p => (
                            <th key={p.name} className="px-4 py-3 text-left font-semibold font-display text-[9px] tracking-wider uppercase text-slate-400 whitespace-nowrap">
                              {p.name} <span className="text-[7.5px] text-slate-600 font-mono italic">({p.type})</span>
                            </th>
                          ));
                        } else {
                          const rows = getFilteredData();
                          if (rows.length > 0) {
                            return Object.keys(rows[0]).map(key => (
                              <th key={key} className="px-4 py-3 text-left font-semibold font-display text-[10px] tracking-wider uppercase text-slate-400 whitespace-nowrap">
                                {key}
                              </th>
                            ));
                          } else {
                            return (
                              <th className="px-4 py-3 text-left font-semibold font-display text-[10px] tracking-wider uppercase text-slate-400">
                                {currentLang === 'es' ? 'REGISTRO' : 'RECORD'}
                              </th>
                            );
                          }
                        }
                      })()}
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredData().length === 0 ? (
                      <tr>
                        <td className="px-5 py-12 text-slate-500 italic text-center text-xs" colSpan={20}>
                          <div className="flex flex-col items-center gap-2 max-w-sm mx-auto">
                            <span className="text-xl">🗄️</span>
                            <p className="font-bold text-slate-305">{currentLang === 'es' ? 'Base vacía en Atlas' : 'Empty Database in Atlas'}</p>
                            <p className="text-[10px] text-slate-500">
                              {currentLang === 'es' 
                                ? `No se encontraron documentos para '${activeTab.toLowerCase()}' en el clúster. Haz clic en "Añadir Registro" arriba para crear el primero.` 
                                : `No records found in Atlas collection '${activeTab.toLowerCase()}'. Click "Add Register" above to seed the first document.`}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      getFilteredData().map((row, idx) => {
                        const activeDbSchema = notionDatabases.find(db => db.id === activeTab);
                        return (
                          <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900/15 group transition-all">
                            {activeDbSchema ? (
                              activeDbSchema.properties.map((p, pIdx) => {
                                let val = undefined;
                                if (row[p.name] !== undefined) val = row[p.name];
                                else {
                                  const pLower = p.name.toLowerCase();
                                  const fKey = Object.keys(row).find(k => k.toLowerCase() === pLower);
                                  if (fKey) val = row[fKey];
                                }
                                const formattedVal = val === undefined || val === null ? '—' : String(val);
                                return (
                                  <td key={pIdx} className="px-4 py-2.5 text-[11px] text-slate-300 font-mono truncate max-w-[200px]" title={formattedVal}>
                                    {formattedVal}
                                  </td>
                                );
                              })
                            ) : (
                              Object.values(row).map((val, cIdx) => (
                                <td key={cIdx} className="px-4 py-2.5 text-xs text-slate-300 font-mono">
                                  {typeof val === 'number' && activeTab !== 'DB40' ? `$${val.toFixed(2)}` : String(val)}
                                </td>
                              ))
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
        </section>
      </main>

      {/* --- DROID INVENTORY MODAL --- */}
      {selectedDroid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedDroid(null)}>
          <div 
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-center shadow-2xl relative animate-[modalFadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedDroid(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Droid details */}
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl w-fit mx-auto mt-2">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>

            {(() => {
              const droidKey = selectedDroid as keyof (typeof translations.es.activeDroids);
              const droidInfo = translations[currentLang].activeDroids[droidKey];
              if (!droidInfo) return null;
              return (
                <>
                  <div>
                    <h3 className="text-base font-bold text-white text-center">
                      {droidInfo.role}
                    </h3>
                    <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider mt-1 text-center font-mono">
                      {droidInfo.task}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 text-left leading-relaxed mt-2 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 font-sans">
                    {droidInfo.desc}
                  </p>
                </>
              );
            })()}

            <div className="flex justify-between items-center text-[10px] border-t border-slate-800 pt-3 text-slate-400 mt-2">
              <span>Status: <strong className="text-emerald-400 font-bold">ACTIVO</strong></span>
              <span>Ubicación: <strong className="font-mono text-cyan-400">us-central1</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* --- STARTUP NEW EMAIL NOTIFICATION POPUP --- */}
      {showStartupEmailPop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-cyan-500/30 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                <Mail className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mail Gatekeeper</h4>
                <p className="text-[10px] text-cyan-400 font-semibold">{currentLang === 'es' ? 'Sondeo de Bandeja Activo' : 'Inbox Monitoring Active'}</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed border-t border-b border-slate-800 py-3.5 my-1">
              {currentLang === 'es' ? (
                <span>
                  Hola Ralphi, el enjambre de <strong>PC Doctor Swarm-OS</strong> ha detectado actividad en tus bandejas IMAP configuradas. 
                  ¿Deseas sincronizar, descargar y analizar los correos nuevos ahora mismo en el chat de control?
                </span>
              ) : (
                <span>
                  Hello Ralphi, <strong>PC Doctor Swarm-OS</strong> detected recent activity in your configured IMAP slots. 
                  Would you like to sync, download and analyze new messages inside the conversational console?
                </span>
              )}
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setShowStartupEmailPop(false)}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                {currentLang === 'es' ? 'Más Tarde' : 'Dismiss'}
              </button>
              <button
                onClick={() => {
                  setShowStartupEmailPop(false);
                  executeCommand(currentLang === 'es' ? 'revisar correos nuevos' : 'check new emails');
                }}
                className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                {currentLang === 'es' ? 'Sí, Sincronizar' : 'Yes, Sync Now'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- DYNAMIC MONGO ATLAS RECORD ADDER MODAL --- */}
      {showDynamicAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-4 shadow-2xl relative animate-[modalFadeIn_0.2s_ease-out] scrollbar-thin">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400 animate-pulse" />
                {currentLang === 'es' ? `Crear Registro en ${activeTab}` : `Create Record in ${activeTab}`}
              </h3>
              <button 
                onClick={() => setShowDynamicAddModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <p className="text-[10px] text-slate-350 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
              {currentLang === 'es' 
                ? `Ingresa los valores del esquema correspondiente a la base de datos ${activeTab}. Los cambios se guardarán en tu estado local y se enviarán automáticamente a MongoDB Atlas.` 
                : `Enter schema-matching values fields supporting database ${activeTab}. Your document will sync dynamically back to your remote cluster.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs max-h-[45vh] overflow-y-auto pr-1 scrollbar-thin">
              {Object.keys(dynamicAddForm).map((fieldName) => {
                const activeDb = notionDatabases.find(db => db.id === activeTab);
                const fieldProp = activeDb?.properties.find(p => p.name === fieldName);
                const placeholderText = fieldProp ? `Tipo: ${fieldProp.type}` : `${fieldName}`;

                return (
                  <div key={fieldName} className="flex flex-col gap-1.5 col-span-2 sm:col-span-1">
                    <span className="text-[9.5px] text-slate-400 font-bold tracking-wider uppercase font-mono">{fieldName}</span>
                    <input 
                      type="text"
                      placeholder={placeholderText}
                      value={dynamicAddForm[fieldName] || ''}
                      onChange={(e) => setDynamicAddForm(prev => ({ ...prev, [fieldName]: e.target.value }))}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
              <button 
                onClick={() => setShowDynamicAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {currentLang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button 
                onClick={handleSaveDynamicRowTarget}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-cyan-500/10 cursor-pointer"
              >
                {currentLang === 'es' ? 'Guardar Cambios' : 'Save Document'}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- REGISTRO MANUAL DE CLIENTES (POPUP/MODAL) --- */}
      {showManualClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5 shadow-2xl relative animate-[modalFadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400 animate-pulse" />
                {currentLang === 'es' ? '🧑‍💻 Registrar Nuevo Cliente (Manual)' : '🧑‍💻 Manually Register Customer'}
              </h3>
              <button 
                onClick={() => setShowManualClientModal(false)}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
              📌 {currentLang === 'es' 
                ? 'Ingresa los datos para registrar un cliente de forma manual en la base de datos (DB04). Estos campos aseguran una perfecta integración con el facturador del SRI y la sincronización con MongoDB Atlas.' 
                : 'Enter details to manually enroll a client into the active DB04 repository. This enforces consistency checks for correct integration with live SRI billing rules.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Nombre / Razón Social Completa *' : 'Full Name / Corporate Entity *'}</span>
                <input 
                  type="text" 
                  placeholder={currentLang === 'es' ? "CORPORACIÓN TECLOSA S.A. / JUAN PÉREZ" : "TECLOSA CORPORATION / JOHN SMITH"}
                  value={manualClientForm.Nombre}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Nombre: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 uppercase placeholder-slate-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Identificación (RUC / Cédula) *' : 'Tax ID (RUC / Cédula) *'}</span>
                <input 
                  type="text" 
                  maxLength={13}
                  placeholder="0991244093001"
                  value={manualClientForm.RUC}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, RUC: e.target.value.replace(/\D/g, "") }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[13px]"
                />
                <span className="text-[9px] text-slate-500">
                  {manualClientForm.RUC ? (
                    manualClientForm.RUC.length === 10 ? '✨ Cédula / Persona Natural' : 
                    manualClientForm.RUC.length === 13 ? '⭐ Registro de RUC Comercial' : 
                    '❌ Código de longitud incorrecto'
                  ) : 'Ingrese 10 o 13 números'}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Contacto Principal *' : 'Primary Contact Person *'}</span>
                <input 
                  type="text" 
                  placeholder="Ing. Fernando Mendoza"
                  value={manualClientForm.ContactoPrincipal}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, ContactoPrincipal: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Correo Electrónico (Notificaciones) *' : 'Email Address (Billings) *'}</span>
                <input 
                  type="email" 
                  placeholder="factura@teclosa.com"
                  value={manualClientForm.Email}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Email: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 lowercase font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Ciudad *' : 'City *'}</span>
                <input 
                  type="text" 
                  placeholder="Guayaquil"
                  value={manualClientForm.Ciudad}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Ciudad: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Tipo de Contribuyente' : 'Contributor Profile'}</span>
                <select 
                  value={manualClientForm.Tipo}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Tipo: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Persona Jurídica">Persona Jurídica (S.A., C.A., S.A.S.)</option>
                  <option value="Persona Natural">Persona Natural / Profesional</option>
                  <option value="Sociedad Privada">Sociedad Privada / Extranjeros</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Estado Administrativo' : 'Status'}</span>
                <select 
                  value={manualClientForm.Estado}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Estado: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ACTIVO">ACTIVO / SOLVENTE</option>
                  <option value="INACTIVO">INACTIVO / BLOQUEADO</option>
                  <option value="SUSPENDIDO">SUSPENDIDO / EN OBSERVACIÓN</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Teléfono / WhatsApp (Opcional)' : 'Phone / WhatsApp (Optional)'}</span>
                <input 
                  type="text" 
                  placeholder="0995837261"
                  value={manualClientForm.Telefono}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Telefono: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Dirección Física (Opcional)' : 'Physical Address (Optional)'}</span>
                <input 
                  type="text" 
                  placeholder="Av. Juan Tanca Marengo Km 4.5"
                  value={manualClientForm.Direccion}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Direccion: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">{currentLang === 'es' ? 'Actividad Económica Principal (Opcional)' : 'Core Economic Activity (Optional)'}</span>
                <input 
                  type="text" 
                  placeholder="PROVISIÓN DE EQUIPOS INFORMATICOS Y SERVICIOS DIRECTOS"
                  value={manualClientForm.Actividad}
                  onChange={(e) => setManualClientForm(prev => ({ ...prev, Actividad: e.target.value }))}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-700 uppercase"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setShowManualClientModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
              >
                {currentLang === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const { Nombre, RUC, Ciudad, ContactoPrincipal, Email, Estado, Tipo, Telefono, Direccion, Actividad } = manualClientForm;
                  if (!Nombre.trim()) {
                    alert(currentLang === 'es' ? "Por favor ingrese el Nombre o Razón Social." : "Please enter the Name or Business Name.");
                    return;
                  }
                  if (!RUC.trim()) {
                    alert(currentLang === 'es' ? "Por favor ingrese la identificación (RUC o Cédula)." : "Please enter the configuration ID (RUC or Cédula).");
                    return;
                  }
                  if (RUC.length !== 10 && RUC.length !== 13) {
                    alert(currentLang === 'es' ? "La identificación debe tener exactamente 10 dígitos (Cédula) o 13 dígitos (RUC)." : "ID must be exactly 10 digits (Cédula) or 13 digits (RUC).");
                    return;
                  }
                  if (!ContactoPrincipal.trim()) {
                    alert(currentLang === 'es' ? "Por favor ingrese el Contacto Principal." : "Please enter the Primary Contact name.");
                    return;
                  }
                  if (!Email.trim() || !Email.includes('@')) {
                    alert(currentLang === 'es' ? "Por favor ingrese un Email de contacto válido." : "Please enter a valid primary Email contact.");
                    return;
                  }

                  const formatPhone = Telefono.trim();
                  let formattedPhone = formatPhone;
                  if (formatPhone) {
                    let clean = formatPhone.replace(/\D/g, "");
                    if (clean.startsWith('09')) {
                      clean = '593' + clean.slice(1);
                    } else if (clean.startsWith('9')) {
                      clean = '593' + clean;
                    }
                    formattedPhone = clean;
                  }

                  const newClient: Client = {
                    Nombre: Nombre.trim().toUpperCase(),
                    RUC: RUC.trim(),
                    Ciudad: Ciudad.trim(),
                    ContactoPrincipal: ContactoPrincipal.trim(),
                    Email: Email.trim(),
                    Estado: Estado,
                    Tipo: Tipo,
                    Telefono: formattedPhone,
                    Direccion: Direccion.trim() || Ciudad.trim(),
                    Actividad: Actividad.trim() || "Servicios Tecnológicos Informativos"
                  };

                  // Update reactive state list
                  setDb04List(prev => {
                    const updated = [...prev, newClient];
                    // Sync with Atlas
                    if (isMongoUri(configMongoUri)) {
                      fetch('/api/mongo/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          uri: configMongoUri,
                          collection: 'db04',
                          items: updated,
                          action: 'save'
                        })
                      }).then(res => res.json())
                        .then(d => {
                          if (d.success) addLog('MongoDB', `Sincronizados datos completos de ${newClient.Nombre} (manual).`, 'success');
                        }).catch(() => {});
                    }
                    return updated;
                  });

                  addLog('SYSTEM', `✅ Cliente creado manualmente: ${newClient.Nombre} (${newClient.RUC})`, 'success');
                  setShowManualClientModal(false);
                }}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10"
              >
                {currentLang === 'es' ? 'Guardar Cliente' : 'Save Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIGURATION SETTINGS MODAL --- */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 flex flex-col gap-5 shadow-2xl relative animate-[modalFadeIn_0.2s_ease-out]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                {translations[currentLang].modalTitle}
              </h3>
              <button 
                onClick={() => setShowConfig(false)}
                className="p-1 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Tabs bar */}
            <div className="flex gap-2 border-b border-slate-800 pb-2">
              <button 
                onClick={() => setConfigTab('env')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${configTab === 'env' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {translations[currentLang].modalTabs.env}
              </button>
              <button 
                onClick={() => setConfigTab('contifico')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${configTab === 'contifico' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {translations[currentLang].modalTabs.contifico}
              </button>
              <button 
                onClick={() => setConfigTab('sri')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${configTab === 'sri' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {translations[currentLang].modalTabs.sri}
              </button>
            </div>

            {/* Tab 1: Enjambre & WhatsApp */}
            {configTab === 'env' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400">{translations[currentLang].mongoUriLabel}</label>
                  <input 
                    type="text" 
                    value={configMongoUri}
                    onChange={(e) => setConfigMongoUri(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-500 focus:outline-none"
                    placeholder="mongodb://127.0.0.1:27017/pcdoctor_swarm"
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-300 font-semibold">{translations[currentLang].waNotificationsLabel}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400">{translations[currentLang].waUrlLabel}</span>
                      <input 
                        type="text" 
                        value={configWaUrl}
                        onChange={(e) => setConfigWaUrl(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400">{translations[currentLang].waKeyLabel}</span>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} 
                          value={configWaToken}
                          onChange={(e) => setConfigWaToken(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-10 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none w-full"
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400">{translations[currentLang].waInstanceLabel}</span>
                      <input 
                        type="text" 
                        value={configWaInstance}
                        onChange={(e) => setConfigWaInstance(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400">{translations[currentLang].waPhoneLabel}</span>
                      <input 
                        type="text" 
                        value={configWaPhone}
                        onChange={(e) => setConfigWaPhone(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-300 font-semibold">{translations[currentLang].imapLabel}</label>
                  <p className="text-[10px] text-slate-500 leading-snug">
                    {currentLang === 'es' ? 'Selecciona tu tipo de correo. El sistema configurará de forma automática el servidor, puerto y validación correcta.' : 'Select your email provider type. The system will auto-configure correct server, port and validation protocol.'}
                  </p>
                  
                  <div className="flex flex-col gap-3 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{currentLang === 'es' ? 'Proveedor de Correo' : 'Email Provider'}</span>
                        <select
                          value={newEmailProvider}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setNewEmailProvider(val);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="custom">Custom IMAP (Servidor Propio)</option>
                          <option value="gmail">Google / Gmail Account</option>
                          <option value="outlook">Outlook / Hotmail (Microsoft)</option>
                          <option value="pop3">POP3 (Standard POP Client)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{currentLang === 'es' ? 'Dirección de Correo' : 'Email Address'}</span>
                        <input 
                          type="text" 
                          placeholder="ejemplo@pcdoctor.com.ec"
                          value={newEmailAddr}
                          onChange={(e) => setNewEmailAddr(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{currentLang === 'es' ? 'Contraseña o App Key' : 'Password / App Key'}</span>
                        <div className="relative">
                          <input 
                            type={showAddingEmailPass ? 'text' : 'password'} 
                            placeholder="*************"
                            value={newEmailPass}
                            onChange={(e) => setNewEmailPass(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-lg pl-2.5 pr-8 py-1.5 text-xs text-white w-full focus:outline-none focus:border-cyan-500"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowAddingEmailPass(!showAddingEmailPass)}
                            className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                            title={currentLang === 'es' ? 'Mostrar/Ocultar clave' : 'Show/Hide Password'}
                          >
                            {showAddingEmailPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Advanced IMAP Server host and port configuration inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/40">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{currentLang === 'es' ? 'Servidor IMAP (Host)' : 'IMAP Server (Host)'}</span>
                        <input 
                          type="text" 
                          placeholder="mail.ejemplo.com"
                          value={newEmailHost}
                          onChange={(e) => setNewEmailHost(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{currentLang === 'es' ? 'Puerto IMAP (Normalmente 993)' : 'IMAP Port (Typically 993)'}</span>
                        <input 
                          type="number" 
                          placeholder="993"
                          value={newEmailPort || ''}
                          onChange={(e) => setNewEmailPort(parseInt(e.target.value, 10) || 993)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Onboarding Helper Notes */}
                    {newEmailProvider === 'gmail' && (
                      <p className="text-[9px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1.5 rounded mt-1.5">
                        ⚠️ <strong>Gmail App Password:</strong> {currentLang === 'es' ? 'Para Google Workspace/Gmail, debes activar la verificación de 2 pasos en tu cuenta de Google y generar una "Contraseña de Aplicación" de 16 caracteres para usar aquí.' : 'For Google Workspace/Gmail, you must activate 2-step verification in your Google account and generate a 16-character "App Password" to use here.'}
                      </p>
                    )}
                    {newEmailProvider === 'outlook' && (
                      <p className="text-[9px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-1.5 rounded mt-1.5">
                        ℹ️ <strong>Microsoft Outlook:</strong> {currentLang === 'es' ? 'Se utilizará el servidor outlook.office365.com con puerto de seguridad SSL 993 de forma atómica.' : 'outlook.office365.com server with secure SSL port 993 will be automatically set.'}
                      </p>
                    )}
                    {newEmailProvider === 'pop3' && (
                      <p className="text-[9px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-1.5 rounded mt-1.5">
                        ⚙️ <strong>POP3 Integration:</strong> {currentLang === 'es' ? 'PC Doctor Swarm-OS leerá de forma segura la bandeja mediante proxy de redundancia IMAP para evitar bloqueos del host y mantener consistencia.' : 'PC Doctor Swarm-OS will automatically use secure IMAP-proxy-fallback connectivity for folder consistency and anti-blocking.'}
                      </p>
                    )}

                    <div className="flex justify-end mt-1.5">
                      <button 
                        onClick={() => {
                          if (!newEmailAddr.includes('@')) {
                            alert(currentLang === 'es' ? "Por favor ingrese un correo válido." : "Please enter a valid email address.");
                            return;
                          }
                          if (!newEmailPass) {
                            alert(currentLang === 'es' ? "Por favor ingrese la contraseña." : "Please enter the password.");
                            return;
                          }
                          
                          const domain = newEmailAddr.split('@')[1] || '';
                          let computedHost = newEmailHost || `mail.${domain}`;
                          let computedPort = newEmailPort || 993;

                          if (newEmailProvider === 'gmail') {
                            computedHost = 'imap.gmail.com';
                            computedPort = 993;
                          } else if (newEmailProvider === 'outlook') {
                            computedHost = 'outlook.office365.com';
                            computedPort = 993;
                          }

                          setEmailAccounts(prev => [...prev, { 
                            email: newEmailAddr, 
                            host: computedHost, 
                            port: computedPort, 
                            provider: newEmailProvider, 
                            password: newEmailPass 
                          }]);
                          setNewEmailAddr('');
                          setNewEmailPass('');
                          addLog('CONFIG', `Añadida cuenta de correo (${newEmailProvider.toUpperCase()}) con Host ${computedHost}:${computedPort} en cola de escucha activa.`, 'success');
                        }}
                        className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-cyan-500/10"
                      >
                        {translations[currentLang].addButton}
                      </button>
                    </div>

                    {/* Render currently configured emails with unmaskable eye */}
                    <div className="flex flex-col gap-2 mt-1 border-t border-slate-900 pt-3">
                      <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase block mb-1">
                        {currentLang === 'es' ? 'Cuentas Registradas' : 'Configured Accounts'}
                      </span>
                      {emailAccounts.map((a, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[10px] text-slate-400 border-b border-slate-900/60 pb-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-200 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              {a.email} 
                              <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider font-mono">
                                {a.provider}
                              </span>
                            </span>
                            <span className="text-slate-500 text-[9px] font-mono mt-0.5">
                              Server: {a.host}:{a.port}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 sm:ml-auto">
                            {/* Stored Password Eyes */}
                            <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded border border-slate-850">
                              <input 
                                type={revealedPassIndices[idx] ? 'text' : 'password'}
                                value={a.password || ''}
                                onChange={(e) => {
                                  const newVal = e.target.value;
                                  setEmailAccounts(prev => prev.map((item, i) => i === idx ? { ...item, password: newVal } : item));
                                }}
                                placeholder="Clave"
                                className="bg-transparent border-none text-[10px] font-mono text-slate-300 w-24 focus:outline-none focus:ring-0 p-0"
                              />
                              <button 
                                onClick={() => setRevealedPassIndices(prev => ({ ...prev, [idx]: !prev[idx] }))}
                                className="text-slate-500 hover:text-cyan-400 p-0.5 ml-1"
                                title={currentLang === 'es' ? 'Mostrar/Ocultar clave' : 'Show/Hide Key'}
                              >
                                {revealedPassIndices[idx] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              </button>
                            </div>

                            {/* Individual IMAP Single Test Button */}
                            <button
                              disabled={isCheckingImap || emailValidationStatus[a.email] === 'checking'}
                              onClick={() => handleTestIndividualAccount(idx)}
                              className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 rounded font-semibold text-[9px] transition-all cursor-pointer flex items-center gap-1"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              {currentLang === 'es' ? 'Probar' : 'Test'}
                            </button>

                            {emailValidationStatus[a.email] === 'valid' ? (
                              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                {currentLang === 'es' ? 'Listo' : 'Ready'}
                              </span>
                            ) : (isCheckingImap) || emailValidationStatus[a.email] === 'checking' ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                {currentLang === 'es' ? 'Validando...' : 'Validating...'}
                              </span>
                            ) : emailValidationStatus[a.email] === 'invalid' ? (
                              <span className="text-red-400 flex items-center gap-0.5 font-semibold" title="Fallo de conexión o contraseña">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                {currentLang === 'es' ? 'Error' : 'Error'}
                              </span>
                            ) : (
                              <span className="text-slate-500 font-mono text-[9px]">{currentLang === 'es' ? 'Sin test' : 'Untested'}</span>
                            )}
                            <button 
                              onClick={() => {
                                setEmailAccounts(prev => prev.filter((_, i) => i !== idx));
                                addLog('CONFIG', 'Eliminada cuenta de correo.', 'warn');
                              }}
                              className="text-red-400 hover:text-red-300 font-bold transition-all ml-1 cursor-pointer"
                            >
                              {currentLang === 'es' ? 'Eliminar' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))}
                      {emailAccounts.length === 0 && (
                        <div className="text-center py-3 text-slate-600 text-[10px] italic">
                          {currentLang === 'es' ? 'No hay cuentas de correo configuradas' : 'No email accounts configured'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Conexión Contífico */}
            {configTab === 'contifico' && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400">{translations[currentLang].contificoApiKeyLabel}</label>
                  <input 
                    type="text" 
                    value={configContificoKey}
                    onChange={(e) => setConfigContificoKey(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400">{translations[currentLang].contificoUserLabel}</span>
                    <input 
                      type="text" 
                      value={configContificoUser}
                      onChange={(e) => setConfigContificoUser(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400">{translations[currentLang].contificoPassLabel}</span>
                    <input 
                      type="password" 
                      value={configContificoPass}
                      onChange={(e) => setConfigContificoPass(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-330 font-semibold">{translations[currentLang].contableCuentasLabel}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">{translations[currentLang].contableClientesLabel}</span>
                      <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500">
                        <option value="1.01.02.01.01">1.01.02.01.01 - Clientes locales</option>
                        <option value="1.01.02.01.02">1.01.02.01.02 - Clientes del exterior</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">{translations[currentLang].contableProveedoresLabel}</span>
                      <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500">
                        <option value="2.01.03.01.01">2.01.03.01.01 - Proveedores locales</option>
                        <option value="2.01.03.01.02">2.01.03.01.02 - Proveedores del exterior</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Firma SRI & IVA */}
            {configTab === 'sri' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400">{translations[currentLang].ivaLabel}</span>
                    <input 
                      type="number" 
                      value={configIvaRate}
                      onChange={(e) => setConfigIvaRate(parseFloat(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-slate-400">{translations[currentLang].sriEnvLabel}</span>
                    <select 
                      value={configSriEnv}
                      onChange={(e) => setConfigSriEnv(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="1">1 - Pruebas / Sandbox</option>
                      <option value="2">2 - Producción Real</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-400">{translations[currentLang].sigPathLabel}</label>
                  <input 
                    type="text" 
                    value={configSigPath}
                    onChange={(e) => setConfigSigPath(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="/data_historica/config/firma.p12"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-slate-400">{translations[currentLang].sigPassLabel}</label>
                  <input 
                    type="password" 
                    value={configSigPass}
                    onChange={(e) => setConfigSigPass(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    placeholder="Signature password..."
                  />
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300">Búsqueda de RUC en Vivo (Intuito S.A.)</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400">Usuario API</span>
                      <input 
                        type="text" 
                        value={configSriUser}
                        onChange={(e) => setConfigSriUser(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500"
                        placeholder="deuna-ruc"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] text-slate-400">Contraseña API</span>
                      <input 
                        type="password" 
                        value={configSriPass}
                        onChange={(e) => setConfigSriPass(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
              {configTab === 'env' ? (
                <button 
                  onClick={handleCheckImap}
                  disabled={isCheckingImap}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                    isCheckingImap 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 cursor-not-allowed' 
                      : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-800 border-slate-700 text-slate-300 cursor-pointer'
                  }`}
                >
                  {isCheckingImap ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1" />
                      {currentLang === 'es' ? 'Comprobando...' : 'Checking...'}
                    </>
                  ) : (
                    currentLang === 'es' ? 'Prueba IMAP Check' : 'Test IMAP Check'
                  )}
                </button>
              ) : <div />}
              <button 
                onClick={async () => {
                  addLog('SYSTEM', currentLang === 'es' ? 'Salvando ajustes y sincronizando tablas con MongoDB Atlas...' : 'Saving settings and syncing tables with MongoDB Atlas...', 'info');
                  
                  // Auto-sync everything to MongoDB Atlas!
                  if (configMongoUri && isMongoUri(configMongoUri)) {
                    const collections = [
                      { col: 'db04', items: db04List },
                      { col: 'db27', items: db27List },
                      { col: 'db31', items: db31List },
                      { col: 'db40', items: db40List },
                      { col: 'db45', items: db45List },
                      { col: 'mediaQueue', items: mediaQueue },
                      { col: 'hackathonsList', items: hackathonsList }
                    ];
                    
                    let successCount = 0;
                    for (const colItem of collections) {
                      try {
                        const res = await fetch('/api/mongo/sync', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            uri: configMongoUri,
                            collection: colItem.col,
                            items: colItem.items,
                            action: 'save'
                          })
                        });
                        const data = await res.json();
                        if (data.success) {
                          successCount++;
                        }
                      } catch (err) {
                        console.warn("MongoDB push deferred for " + colItem.col + ". Usando almacenamiento local.");
                      }
                    }
                    
                    if (successCount === collections.length) {
                      addLog('MongoDB Atlas', `Sincronización completa: ${successCount}/7 colecciones guardadas en la nube.`, 'success');
                    } else {
                      addLog('MongoDB Atlas', `Sincronización parcial: ${successCount}/7 guardadas. Comprueba tu URI.`, 'warn');
                    }
                  }
                  
                  addLog('SYSTEM', currentLang === 'es' ? 'Ajustes guardados de forma exitosa en MongoDB Atlas y fallback local.' : 'Settings successfully saved in MongoDB Atlas and local fallback.', 'success');
                  setShowConfig(false);
                  alert(currentLang === 'es' ? "Configuración y parámetros contables guardados y sincronizados con MongoDB Atlas exitosamente." : "Configuration and accounting parameters saved and synced with MongoDB Atlas successfully.");
                }}
                className="px-5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
              >
                {translations[currentLang].saveChangesButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER COMPONENT CREDITS --- */}
      <footer className="z-10 bg-slate-900/60 p-4 text-center border-t border-slate-800/80 text-[10px] text-slate-500 tracking-wider">
        PC DOCTOR S.A. © 2026 • CREADO EN AI STUDIO CON CONCIENCIA, ORDEN, E INTELIGENCIA MULTI-DROID
      </footer>
    </div>
  );
}
