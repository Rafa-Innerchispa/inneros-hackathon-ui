export interface TranslationSet {
  headerTitle: string;
  headerSub: string;
  demoMode: string;
  cloudMode: string;
  settingsButton: string;
  tourActiveTitle: string;
  tourStep1: string;
  tourStep2: string;
  tourStep3: string;
  tourStep4: string;
  tourStep5: string;
  tourStep1Full: string;
  tourStep2Full: string;
  tourStep3Full: string;
  tourStep4Full: string;
  tourStep5Full: string;
  tourNextStep: string;
  tourPrevStep: string;
  tourFinish: string;
  tourAutoAdvance: string;
  stepOf: string;
  droidArchitecture: string;
  activeStatus: string;
  activeGridChannels: string;
  droidHelpTip: string;
  playTourButton: string;
  consoleTitle: string;
  clearLogs: string;
  emptyLogs: string;
  chatTitle: string;
  chipRuc: string;
  chipQuote: string;
  chipSupport: string;
  chatPlaceholder: string;
  dbInspectorTitle: string;
  searchPlaceholder: string;
  dbTabs: Record<string, string>;
  hackathonScoutInfo: string;
  hackathonScanLive: string;
  hackathonTable: Record<string, string>;
  mediaQueuePlatform: string;
  mediaQueueState: string;
  mediaQueueReview: string;
  mediaQueueApprove: string;
  mediaQueueReject: string;
  emptyTableMatches: string;
  modalTitle: string;
  modalTabs: Record<string, string>;
  mongoUriLabel: string;
  waNotificationsLabel: string;
  waUrlLabel: string;
  waKeyLabel: string;
  waInstanceLabel: string;
  waPhoneLabel: string;
  imapLabel: string;
  newAccountPlaceholder: string;
  passPlaceholder: string;
  addButton: string;
  deleteButton: string;
  contificoApiKeyLabel: string;
  contificoUserLabel: string;
  contificoPassLabel: string;
  contableCuentasLabel: string;
  contableClientesLabel: string;
  contableProveedoresLabel: string;
  ivaLabel: string;
  sriEnvLabel: string;
  sigPathLabel: string;
  sigPassLabel: string;
  imapCheckButton: string;
  saveChangesButton: string;
  activeDroids: Record<string, { role: string; task: string; desc: string }>;
  
  // Workspace Translations
  gWorkspaceTitle: string;
  gmailTitle: string;
  driveTitle: string;
  contactsTitle: string;
  gmailDesc: string;
  driveDesc: string;
  contactsDesc: string;
  connectGoogleButton: string;
  connectedAs: string;
  disconnectGoogleButton: string;
  searchMail: string;
  sendMailTitle: string;
  toLabel: string;
  subjectLabel: string;
  bodyLabel: string;
  sendMailButton: string;
  uploadToDrive: string;
  addContactTitle: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  addContactButton: string;
  recentEmails: string;
  recentFiles: string;
  savedPdfName: string;
  addContactSuccess: string;
  fetchingEmails: string;
  fetchingFiles: string;
  fetchingContacts: string;
}

export const translations: Record<'es' | 'en', TranslationSet> = {
  es: {
    headerTitle: "INNERSPARK SWARM-OS",
    headerSub: "Administración Central Multidisciplinaria • PC Doctor S.A.",
    demoMode: "Demo Local",
    cloudMode: "Cloud Run Pro",
    settingsButton: "Configuración",
    tourActiveTitle: "Demostración de Flujo: Cómo Cotizar a un Cliente",
    tourStep1: "PASO 1: Ingesta técnica de inspección en campo por voz (Whisper / Droid 2)...",
    tourStep2: "PASO 2: Consulta SRI, anti-duplicación y generación de carpeta Hub de Cliente en MongoDB Atlas...",
    tourStep3: "PASO 3: Búsqueda de hardware en inventario local e inserción matemática en DB38 (Líneas de Cotización)...",
    tourStep4: "PASO 4: Asignación de secuencial libre DB40 y exportación del archivo PDF-First corporativo...",
    tourStep5: "PASO 5: Notificación automática en el celular de Ralphi vía WhatsApp Business (Evolution API)...",
    tourStep1Full: "🎙️ PASO 1: Ingesta por Voz (Voz de Campo -> Mail Gatekeeper). El técnico Rafael López llega a campo en 'Torres de la Merced', observa un rack caótico y dicta por micrófono: 'Quiero cotizar un switch PoE de 16 puertos para el Edificio Torres de la Merced porque las cámaras están sin energía'. Droid 2 captura el audio y Droid 1 clasifica la intención de cotización.",
    tourStep2Full: "🧬 PASO 2: Anti-Duplicación y Hub. Droid 3 (Cosmos Central) lee la base DB04 en MongoDB Atlas para saber si el cliente ya existe. Al confirmar que existe bajo el RUC 0991355529001, recupera sus contratos de DB46 y unifica los recursos en la carpeta estructurada del Hub del cliente.",
    tourStep3Full: "📊 PASO 3: Líneas de Cotización (DB38). Droid 4 (Care-Taker) consulta el stock en el inventario de hardware (DB26) para cotizar el switch y cable UTP. Droid 5 (Financial Ledger) inserta el detalle en DB38 (Líneas de Cotización) computando de manera atómica el IVA del 15% y los márgenes sugeridos de ganancia.",
    tourStep4Full: "📄 PASO 4: PDF-First e Historiales. Droid 4 consulta el secuencial actual en DB40 para apartar el correlativo 'PCD-COT-26-000016', crea la cotización en DB27 y compila un PDF-First de alta fidelidad guardándolo en el repositorio seguro para su visualización inmediata en el inspector.",
    tourStep5Full: "📲 PASO 5: Notificación y Cierre. Droid 6 (Catalyst RAG) genera un enlace dinámico de aprobación y llama a la Evolution API de WhatsApp para enviar un mensaje directo al WhatsApp personal de Ralphi con la pre-visualización y botones rápidos de aprobación.",
    tourNextStep: "Siguiente Paso ➔",
    tourPrevStep: "⬅ Paso Anterior",
    tourFinish: "Finalizar Tour 🎉",
    tourAutoAdvance: "Avance Auto: ",
    stepOf: "Paso {step} de 5",
    droidArchitecture: "Arquitectura de Droides",
    activeStatus: "Activo",
    activeGridChannels: "CANALES DE RED ACTIVO",
    droidHelpTip: "💡 ¿Qué hacen los droides? Haz clic en cualquiera de las burbujas (D1-D8) en el mapa para ver su rol en tiempo real dentro de PC Doctor.",
    playTourButton: "PLAY TOUR: ¿CÓMO COTIZAR?",
    consoleTitle: "Consola del Enjambre",
    clearLogs: "Limpiar logs",
    emptyLogs: "Consola de logs vacía. Ejecute una acción operativa en el chat...",
    chatTitle: "RalphIA Main Entrance ( HITL Companion )",
    chipRuc: "🔍 Consultar RUC Dolupa",
    chipQuote: "💼 Cotizar Hardware",
    chipSupport: "🛠️ Registrar Soporte",
    chatPlaceholder: "Dictar nota técnica, consultar RUC en SRI o crear cotización...",
    dbInspectorTitle: "Inspector de BD MongoDB ( Notion Sync )",
    searchPlaceholder: "Buscar en colección...",
    dbTabs: {
      DB04: "Clientes (DB04)",
      DB26: "Inventario (DB26)",
      DB27: "Cotizaciones (DB27)",
      DB31: "Transacciones (DB31)",
      DB40: "Secuenciales (DB40)",
      DB11: "Ideas / R&D (DB11)",
      DB45: "Reportes Técnicos (DB45)",
      OS_REGISTRY: "📖 Diccionario OS Central (40+ DBs)",
      HACKATHONS: "Hackathon Scout",
      MEDIA_QUEUE: "Medios (HITL)",
      GMAIL: "Gmail Integrado",
      DRIVE: "Google Drive Hub",
      CONTACTS: "Contactos Celular"
    },
    hackathonScoutInfo: "Scout de concursos y hackathons (Devpost y Lablab)",
    hackathonScanLive: "⚡ Escanear Live",
    hackathonTable: {
      event: "Evento",
      deadline: "Fecha Límite",
      stack: "Stack Técnico",
      status: "Estado",
      action: "Acción",
      register: "Registrarse",
      registered: "Registrado"
    },
    mediaQueuePlatform: "Canal",
    mediaQueueState: "Estado: ",
    mediaQueueReview: "Revisión Requerida",
    mediaQueueApprove: "Aprobar Publicación",
    mediaQueueReject: "Rechazar",
    emptyTableMatches: "Sincronizando u omitiendo filtros... No hay coincidencias en esta colección.",
    modalTitle: "Panel de Control de APIs de PC Doctor",
    modalTabs: {
      env: "Enjambre & WA",
      contifico: "Conexión Contífico",
      sri: "Firma SRI & IVA"
    },
    mongoUriLabel: "URI de Conexión MongoDB Atlas:",
    waNotificationsLabel: "Notificaciones WhatsApp (Evolution API):",
    waUrlLabel: "Evolution URL:",
    waKeyLabel: "Evolution API Key:",
    waInstanceLabel: "Instance Name:",
    waPhoneLabel: "Celular Destino (+593...):",
    imapLabel: "Correo IMAP (Onboarding y Alertas):",
    newAccountPlaceholder: "Nueva cuenta...",
    passPlaceholder: "Contraseña...",
    addButton: "Añadir",
    deleteButton: "Eliminar",
    contificoApiKeyLabel: "Contífico API Key:",
    contificoUserLabel: "Usuario Web Contífico:",
    contificoPassLabel: "Contraseña Web Contífico:",
    contableCuentasLabel: "Cuentas Contables Maestras (SOP):",
    contableClientesLabel: "Clientes local:",
    contableProveedoresLabel: "Proveedores local:",
    ivaLabel: "Porcentaje de IVA (%):",
    sriEnvLabel: "Ambiente de Emisión SRI:",
    sigPathLabel: "Ruta de Firma Digital (.p12):",
    sigPassLabel: "Contraseña de Firma Electrónica:",
    imapCheckButton: "Prueba IMAP Check",
    saveChangesButton: "Guardar Cambios",
    activeDroids: {
      droid1: {
        role: "Droid 1: Mail Gatekeeper",
        task: "Ingesta IMAP & Anti-Spam",
        desc: "Escanea constantemente tus cuentas email corporativas. Filtra el SPAM sin costo de tokens, detecta cotizaciones de compra e inicia el onboarding de clientes."
      },
      droid2: {
        role: "Droid 2: Voz de Campo",
        task: "Whisper & Multimodalidad",
        desc: "Captura los dictados de audio de instalaciones de campo de los técnicos masculinos. Lee imágenes en busca de diagramas de red o switches desordenados."
      },
      droid3: {
        role: "Droid 3: Cosmos Central",
        task: "Orquestador Notion/Atlas",
        desc: "Orquesta la conexión Atlas vector search y Notion. Es el guardián de que la base de datos no tenga duplicados de clientes ni RUC huerfános."
      },
      droid4: {
        role: "Droid 4: Care-Taker",
        task: "Generador Informes / PDFs",
        desc: "Genera secuenciales DB40 y compila las plantillas HTML a PDF-First listos para entregar en la carpeta PDFs/Exportables en el Hub del cliente."
      },
      droid5: {
        role: "Droid 5: Financial Ledger",
        task: "Consolidador Financiero",
        desc: "Carga transacciones financieras DB31, se encarga de que todo de cobro quede auditado, calcula las retenciones de IVA/IR del SRI y los márgenes."
      },
      droid6: {
        role: "Droid 6: Catalyst RAG",
        task: "AnythingLLM & Domótica",
        desc: "Conecta tu base de conocimiento AnythingLLM a tus droids. Adicionalmente, se integra vía API a Home Assistant para el control domótico."
      },
      droid7: {
        role: "Droid 7: Signer / Fiscal",
        task: "Firma Electrónica XML",
        desc: "Firma facturas y comprobantes digitalmente en formato XML XAdES-BES usando tu certificado .p12 para enviarlas de forma oficial al SRI."
      },
      droid8: {
        role: "Droid 8: Media Agent",
        task: "HITL Growth Marketing",
        desc: "Construye borradores de crecimiento (build-in-public) para LinkedIn / IndieHackers y los coloca en una cola (Media Queue) para que los apruebes con un clic."
      }
    },
    
    // Workspace Integration Details
    gWorkspaceTitle: "Integraciones de Google Workspace",
    gmailTitle: "Gmail de Facturación",
    driveTitle: "Google Drive Almacon",
    contactsTitle: "Contactos de Teléfono",
    gmailDesc: "Consulta el correo pcdoctorgye@gmail.com para analizar los últimos mensajes comerciales.",
    driveDesc: "Administra directorios de PC Doctor y sube PDFs generados.",
    contactsDesc: "Sincroniza y añade contactos de clientes directamente al celular de soporte.",
    connectGoogleButton: "Conectar con Google Workspace",
    connectedAs: "Conectado como: ",
    disconnectGoogleButton: "Desconectar Cuenta",
    searchMail: "Buscar correo en Gmail...",
    sendMailTitle: "Enviar Correo Autónomo por Gmail",
    toLabel: "Destinatario: ",
    subjectLabel: "Asunto: ",
    bodyLabel: "Cuerpo del Mensaje: ",
    sendMailButton: "Enviar mediante Gmail",
    uploadToDrive: "Sincronizar a Google Drive",
    addContactTitle: "Añadir Nuevo Contacto al Móvil",
    contactName: "Nombre Completo: ",
    contactEmail: "Correo Corporativo: ",
    contactPhone: "Número de Teléfono: ",
    addContactButton: "Crear Nuevo Contacto",
    recentEmails: "Últimos Mensajes en Gmail:",
    recentFiles: "Archivos en Google Drive Hub (PC-Doctor):",
    savedPdfName: "Archivo guardado exitosamente en Google Drive.",
    addContactSuccess: "Contacto agregado exitosamente a tus contactos de Google.",
    fetchingEmails: "Cargando correos electrónicos...",
    fetchingFiles: "Examinando sistema de archivos de Google Drive...",
    fetchingContacts: "Cargando contactos de Google..."
  },
  en: {
    headerTitle: "INNERSPARK SWARM-OS",
    headerSub: "Central Multidisciplinary Administration • PC Doctor S.A.",
    demoMode: "Local Demo",
    cloudMode: "Cloud Run Pro",
    settingsButton: "Configuration",
    tourActiveTitle: "Flow Demonstration: How to Create a Quote",
    tourStep1: "STEP 1: Technical capture of field inspection by voice (Whisper / Droid 2)...",
    tourStep2: "STEP 2: SRI Check, search anti-duplication, and Customer Hub folder generation in MongoDB Atlas...",
    tourStep3: "STEP 3: Hardware lookup in local inventory & mathematical insertion in DB38 (Line Items)...",
    tourStep4: "STEP 4: Free sequential block DB40 allocation and corporate PDF-First compilation export...",
    tourStep5: "STEP 5: Automated mobile notification to Ralphi's celular via WhatsApp (Evolution API)...",
    tourStep1Full: "🎙️ STEP 1: Voice Ingestion (Field Voice -> Mail Gatekeeper). Technical specialist Rafael López arrives at 'Torres de la Merced', observes a messy rack and dictates by microphone: 'I want to quote a 16-port PoE switch for Torres de la Merced Building because the cameras are down'. Droid 2 captures the audio and Droid 1 classifies the quote objective.",
    tourStep2Full: "🧬 STEP 2: Anti-Duplication & Hub. Droid 3 (Cosmos Central) connects to MongoDB Atlas (DB04 Collection) to see if the customer exists. Since the client exists under ID RUC 0991355529001, it pulls all past active files from DB46 and aligns them in the customer's cloud Hub storage directory.",
    tourStep3Full: "📊 STEP 3: Quote Line Items (DB38). Droid 4 (Care-Taker) queries DB26 inventory stock to find costs of the switch and UTP raw materials. Droid 5 (Financial Ledger) inserts the data block into DB38 (Line Items), atomically computing 15% VAT and financial margins.",
    tourStep4Full: "📄 STEP 4: PDF-First & History. Droid 4 queries DB40 for the next sequential ID, locks the value 'PCD-COT-26-000016', logs the metadata into DB27 and processes high-fidelity HTML boilerplate compiling into a static PDF file for instant viewing in the browser.",
    tourStep5Full: "📲 STEP 5: Notification & Delivery. Droid 6 (Catalyst RAG) creates a custom secure activation url link and connects to the active WhatsApp Evolution API to trigger a live customer notification directly to Ralphi's whatsapp with fast margin-check and quick accept buttons.",
    tourNextStep: "Next Step ➔",
    tourPrevStep: "⬅ Previous Step",
    tourFinish: "Finish Tour 🎉",
    tourAutoAdvance: "Auto Advance: ",
    stepOf: "Step {step} of 5",
    droidArchitecture: "Droid Architecture",
    activeStatus: "Active",
    activeGridChannels: "ACTIVE GRID CHANNELS",
    droidHelpTip: "💡 What do droids do? Click on any of the bubbles (D1-D8) on the map to see their real-time role within PC Doctor.",
    playTourButton: "PLAY TOUR: HOW TO QUOTE?",
    consoleTitle: "Swarm Console",
    clearLogs: "Clear logs",
    emptyLogs: "Log console is empty. Run an operation from the companion chat...",
    chatTitle: "RalphIA Main Entrance ( HITL Companion )",
    chipRuc: "🔍 Check RUC Dolupa",
    chipQuote: "💼 Quote Hardware",
    chipSupport: "🛠️ Register Support",
    chatPlaceholder: "Dictate tech note, check RUC in SRI, or create a quote...",
    dbInspectorTitle: "MongoDB Database Inspector ( Notion Sync )",
    searchPlaceholder: "Search in collection...",
    dbTabs: {
      DB04: "Clients (DB04)",
      DB26: "Inventory (DB26)",
      DB27: "Quotes (DB27)",
      DB31: "Transactions (DB31)",
      DB40: "Sequences (DB40)",
      DB11: "Ideas / R&D (DB11)",
      DB45: "Technical Reports (DB45)",
      OS_REGISTRY: "📖 OS Central Dictionary (40+ DBs)",
      HACKATHONS: "Hackathon Scout",
      MEDIA_QUEUE: "Media Queue (HITL)",
      GMAIL: "Integrated Gmail",
      DRIVE: "Google Drive Hub",
      CONTACTS: "Phone Contacts"
    },
    hackathonScoutInfo: "Hackathon & contest scout (Devpost & Lablab)",
    hackathonScanLive: "⚡ Scan Live",
    hackathonTable: {
      event: "Event",
      deadline: "Deadline",
      stack: "Technical Stack",
      status: "Status",
      action: "Action",
      register: "Register",
      registered: "Registered"
    },
    mediaQueuePlatform: "Platform",
    mediaQueueState: "State: ",
    mediaQueueReview: "Needs Review",
    mediaQueueApprove: "Approve Publication",
    mediaQueueReject: "Reject",
    emptyTableMatches: "Syncing or omitting filters... No records found in this collection.",
    modalTitle: "PC Doctor Central APIs Control Panel",
    modalTabs: {
      env: "Swarm & WA Config",
      contifico: "Contífico Ledger",
      sri: "SRI Signature & Taxes"
    },
    mongoUriLabel: "MongoDB Atlas Connection URI:",
    waNotificationsLabel: "WhatsApp Notifications (Evolution API):",
    waUrlLabel: "Evolution URL:",
    waKeyLabel: "Evolution API Key:",
    waInstanceLabel: "Instance Name:",
    waPhoneLabel: "Destination Celular (+593...):",
    imapLabel: "IMAP Email Account (Onboarding & Alerts):",
    newAccountPlaceholder: "New email account...",
    passPlaceholder: "Password...",
    addButton: "Add",
    deleteButton: "Delete",
    contificoApiKeyLabel: "Contífico API Key:",
    contificoUserLabel: "Contífico Web Username:",
    contificoPassLabel: "Contífico Web Password:",
    contableCuentasLabel: "Master Accounting Accounts (SOP):",
    contableClientesLabel: "Local Clients account:",
    contableProveedoresLabel: "Local Suppliers account:",
    ivaLabel: "VAT Percentage (%):",
    sriEnvLabel: "SRI Issuing Environment:",
    sigPathLabel: "Digital Signature Path (.p12):",
    sigPassLabel: "Digital Signature Password:",
    imapCheckButton: "Test IMAP Check",
    saveChangesButton: "Save Changes",
    activeDroids: {
      droid1: {
        role: "Droid 1: Mail Gatekeeper",
        task: "IMAP Ingestion & Anti-Spam",
        desc: "Constantly scans your business emails. Filters spam at no token cost, detects purchase RFQs, and auto-starts local boarding."
      },
      droid2: {
        role: "Droid 2: Voice Dictator",
        task: "Whisper & Multimodal",
        desc: "Captures audio dictation of field services from tech engineers. Scans images to detect diagram configurations and messy server racks."
      },
      droid3: {
        role: "Droid 3: Cosmos Central",
        task: "Notion/Atlas Coordinator",
        desc: "Coordinates Atlas vector search and Notion. Acts as the database guardian saving you from duplicate clients or orphan tax IDs."
      },
      droid4: {
        role: "Droid 4: Care-Taker",
        task: "Reports & PDF compiler",
        desc: "Retrieves sequentials and compiles flat HTML blueprints to PDF-First deliverables in the target GCS folder under customer Hubs."
      },
      droid5: {
        role: "Droid 5: Financial Ledger",
        task: "Accounting Auditor",
        desc: "Monitors DB31 financial transactions, manages payments, reviews VAT/IR receipts for the SRI, and tracks profit margins."
      },
      droid6: {
        role: "Droid 6: Catalyst RAG",
        task: "AnythingLLM & Domotics",
        desc: "Mounts AnythingLLM knowledge bases on top of your droids. Connects securely with Home Assistant for automation."
      },
      droid7: {
        role: "Droid 7: Signer / Fiscal",
        task: "XML Electronic Signature",
        desc: "Signs invoices and bills electronically in official XML XAdES-BES format using your certificate file for SRI authorization."
      },
      droid8: {
        role: "Droid 8: Media Agent",
        task: "HITL Growth marketer",
        desc: "Gathers build-in-public logs and drafts LinkedIn / IndieHackers updates, enqueuing them on the Media queue for single-click approvals."
      }
    },
    
    // Workspace Integration Details
    gWorkspaceTitle: "Google Workspace Connections",
    gmailTitle: "Inbox Gmail Billing",
    driveTitle: "Google Drive Almacon",
    contactsTitle: "Phone Contacts Sync",
    gmailDesc: "Read inbox messages from pcdoctorgye@gmail.com to scan for prospective deals.",
    driveDesc: "Manage PC Doctor directories and upload generated PDFs to folders.",
    contactsDesc: "Sync and queue client contacts directly to our support smartphone.",
    connectGoogleButton: "Sign in with Google Workspace",
    connectedAs: "Connected as: ",
    disconnectGoogleButton: "Disconnect Account",
    searchMail: "Search in Gmail...",
    sendMailTitle: "Autonomously Send Email via Gmail",
    toLabel: "Recipient (To): ",
    subjectLabel: "Subject: ",
    bodyLabel: "Message Body: ",
    sendMailButton: "Send Email (Gmail)",
    uploadToDrive: "Sync/Upload to Drive",
    addContactTitle: "Add New Contact to Phonebook",
    contactName: "Display Name: ",
    contactEmail: "Corporate Email: ",
    contactPhone: "Telephone Number: ",
    addContactButton: "Create Google Contact",
    recentEmails: "Gmail Recent Messages:",
    recentFiles: "Google Drive Hub files (PC-Doctor):",
    savedPdfName: "File successfully saved on Google Drive.",
    addContactSuccess: "Contact successfully uploaded to Google Contacts.",
    fetchingEmails: "Fetching emails...",
    fetchingFiles: "Listing directories from Google Drive...",
    fetchingContacts: "Fetching Google Contacts..."
  }
};
