export interface NotionDBProperty {
  name: string;
  type: string;
  notes?: string;
}

export interface NotionDB {
  id: string; // e.g. "DB01"
  name: string;
  purpose: string;
  properties: NotionDBProperty[];
  relations: string[];
  rules?: string[];
  vistas?: string[];
}

export const notionDatabases: NotionDB[] = [
  {
    id: "DB01",
    name: "Entidades",
    purpose: "Registro maestro de personas jurídicas, marcas, canales y socios que forman la estructura corporativa central de OS Central.",
    properties: [
      { name: "Nombre", type: "title", notes: "Nombre corporativo" },
      { name: "Tipo", type: "select", notes: "Persona | Empresa | Marca | Canal" },
      { name: "Rol", type: "multi_select", notes: "CEO | Research | Ejecución | Producto | Legal | Partner | Mentor | Canal de Contenido" },
      { name: "Email principal", type: "email" },
      { name: "Web", type: "url" },
      { name: "País", type: "select" },
      { name: "Notas", type: "text" },
      { name: "Contactos", type: "relation (DB05)", notes: "Espejo: Entidad asociada" },
      { name: "Cuentas financieras", type: "relation (DB30)" },
      { name: "Procesadores de pago", type: "relation (DB34)" },
      { name: "Presupuestos mensuales", type: "relation (DB36)" }
    ],
    relations: ["DB05 - Contactos", "DB30 - Cuentas Financieras", "DB34 - Procesadores de Pago", "DB36 - Cash Flow & Budget"],
    vistas: ["Tabla Principal (Nombre, Contactos, Cuentas, Email, Notas, Rol, Tipo, Web)"]
  },
  {
    id: "DB02",
    name: "Divisiones",
    purpose: "Líneas de negocio operativas asociadas a una entidad dueña y una oferta principal (PC Doctor, Domotika, Energía Consciente, etc.)",
    properties: [
      { name: "División", type: "title" },
      { name: "Descripción", type: "text" },
      { name: "Estado", type: "select", notes: "Activo | Pausado | Reserva" },
      { name: "Entidad dueña", type: "relation (DB01)" },
      { name: "Oferta principal", type: "relation (DB06)" }
    ],
    relations: ["DB01 - Entidades", "DB06 - Ofertas y Soluciones"],
    vistas: ["Tabla general de divisiones"]
  },
  {
    id: "DB03",
    name: "Buyer Personas",
    purpose: "Fichas psicográficas completas del cliente ideal segmentado por dolores, deseos, canales y ticket ideal.",
    properties: [
      { name: "Persona", type: "title" },
      { name: "Industria", type: "select", notes: "Universidad | Salud | Inmobiliario | Empresa | Gobierno | Ong | Comunidad" },
      { name: "Cargo típico", type: "text" },
      { name: "Dolores", type: "text" },
      { name: "Deseos", type: "text" },
      { name: "Objeciones", type: "text" },
      { name: "Ticket ideal", type: "select", notes: "Bajo | Medio | Alto | Enterprise" },
      { name: "CTA / siguiente paso", type: "text" },
      { name: "Documentos", type: "files" },
      { name: "División principal", type: "relation (DB02)" },
      { name: "Avatar espiritual/emocional", type: "relation (DB17)" }
    ],
    relations: ["DB02 - Divisiones", "DB17 - Avatares InnerSpark"],
    vistas: ["Segmentación por Industria y Nivel de Ticket"]
  },
  {
    id: "DB04",
    name: "Instituciones y Clientes",
    purpose: "Registro oficial de los clientes empresariales, residenciales e institucionales de PC Doctor S.A. y OS Central.",
    properties: [
      { name: "Nombre", type: "title" },
      { name: "Tipo", type: "select", notes: "Universidad | Empresa | Gobierno | ONG | Comunidad" },
      { name: "Estado", type: "select", notes: "Lead | Conversación | Piloto | Cliente | Dormido" },
      { name: "País", type: "select", notes: "Default: ecu" },
      { name: "Ciudad", type: "text" },
      { name: "Dirección", type: "text" },
      { name: "RUC", type: "text", notes: "13 dígitos obligatorios para facturación SRI" },
      { name: "Teléfono", type: "phone_number" },
      { name: "Sitio web", type: "url" },
      { name: "Email contacto", type: "email" },
      { name: "Email documentos electrónicos", type: "email", notes: "Para envío directo de XML/PDF del SRI" },
      { name: "Notas", type: "text" },
      { name: "Intereses", type: "multi_select", notes: "Security IA | Automation | Lab IA | Networks | Hardware" },
      { name: "Buyer persona", type: "relation (DB03)" },
      { name: "Contacto principal", type: "relation (DB05)" }
    ],
    relations: ["DB03 - Buyer Personas", "DB05 - Contactos"],
    vistas: ["Tabla Maestra de Clientes", "Clientes Activos GYE", "Fichas RUC Oficiales"]
  },
  {
    id: "DB05",
    name: "Contactos",
    purpose: "Directorio central de personas naturales asociadas a clientes, proveedores, prestadores o cooperadores internos.",
    properties: [
      { name: "Nombre", type: "title" },
      { name: "Institución", type: "relation (DB04)" },
      { name: "Entidad asociada", type: "relation (DB01)" },
      { name: "Tipo de contacto", type: "multi_select", notes: "Cliente | Proveedor | Socio/Partner | Referido | Amigo/Personal | Interno" },
      { name: "Perfil", type: "select", notes: "Técnico | Administrativo | Directivo | Académico" },
      { name: "Cargo", type: "text" },
      { name: "Teléfono", type: "phone_number" },
      { name: "Email", type: "email" },
      { name: "RUC/Cédula", type: "text" },
      { name: "Skills técnicos", type: "multi_select", notes: "CCTV | Redes | Cercos | Instalación | Programación | Soporte | IA" },
      { name: "Tarifa/hora / Sueldo", type: "number", notes: "Para cálculo de costos de personal" },
      { name: "Rating de proveedor", type: "select", notes: "Excelente | Muy bueno | Bueno | Regular | Deficiente" }
    ],
    relations: ["DB04 - Clientes", "DB01 - Entidades"],
    vistas: ["Todos los contactos", "Colaboradores PC Doctor", "Proveedores calificados", "Directorio Comercial"]
  },
  {
    id: "DB06",
    name: "Ofertas y Soluciones",
    purpose: "Paquetes estandarizados de servicios y soluciones estructuradas que se comercializan a segmentos específicos.",
    properties: [
      { name: "Oferta", type: "title" },
      { name: "Tipo", type: "select", notes: "Piloto | Implementación | Retainer | Investigación | Mentoring" },
      { name: "Precio orientativo", type: "number" },
      { name: "Stack recomendado", type: "relation (DB07)" },
      { name: "Buyer persona ideal", type: "relation (DB03)" },
      { name: "Descripción breve", type: "text" },
      { name: "KPIs / Riesgos", type: "text" }
    ],
    relations: ["DB07 - Stacks Validados", "DB03 - Buyer Personas"],
    vistas: ["Listado de Soluciones Comerciales"]
  },
  {
    id: "DB07",
    name: "Stacks Validados",
    purpose: "Combinaciones de hardware y software (VMS, CCTV, IA) homologados y pre-aprobados en laboratorios.",
    properties: [
      { name: "Stack", type: "title" },
      { name: "Categoría", type: "select", notes: "Video IA | Infra GPU | Automatización | Gestión | VMS | Orquestación" },
      { name: "Nivel", type: "select", notes: "Open Source | Enterprise | Híbrido" },
      { name: "Requisitos", type: "text" },
      { name: "Docs oficiales", type: "url" }
    ],
    relations: [],
    vistas: ["Índice de Stacks Tecnológicos"]
  },
  {
    id: "DB08",
    name: "Proyectos",
    purpose: "Contenedor de alto nivel para el seguimiento de implementaciones operativas, márgenes reales y KPIs de ingeniería.",
    properties: [
      { name: "Proyecto", type: "title" },
      { name: "Estado", type: "select", notes: "Descubrimiento | Propuesta | Piloto | Implementación | Operación | Cerrado" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Ingresos totales / Gastos", type: "number" },
      { name: "Margen real USD y %", type: "formula" },
      { name: "Código de proyecto", type: "text" },
      { name: "Cotizaciones vinculadas", type: "relation (DB27)" },
      { name: "Facturas", type: "relation (DB32)" }
    ],
    relations: ["DB04 - Instituciones y Clientes", "DB27 - Cotizaciones", "DB32 - Facturas e Invoices"],
    vistas: ["Tablero Kanban de Proyectos", "Márgenes y KPI Financieros por Proyecto"]
  },
  {
    id: "DB09",
    name: "Inventario y Activos (Clientes)",
    purpose: "Seguimiento de hardware y licencias instalados físicamente en las oficinas o hubs de los clientes.",
    properties: [
      { name: "Activo", type: "title" },
      { name: "Categoría", type: "select", notes: "Cámara | NVR | Servidor | GPU | Red | Acceso | Sensor | Otro" },
      { name: "Estado", type: "select", notes: "En stock | Instalado | Mantenimiento | Baja" },
      { name: "Serial / Modelo", type: "text" },
      { name: "Cliente asignado", type: "relation (DB04)" },
      { name: "Asignado a proyecto", type: "relation (DB08)" }
    ],
    relations: ["DB04 - Clientes", "DB08 - Proyectos"],
    vistas: ["Activos Instalados", "Garantías por vencer"]
  },
  {
    id: "DB10",
    name: "Research Lines",
    purpose: "Líneas de investigación y experimentación avanzada para I+D, proyectos de IA y alianzas universitarias.",
    properties: [
      { name: "Línea", type: "title" },
      { name: "Estado", type: "select", notes: "Ideación | Búsqueda y Alianza | Activa | Propuesta" },
      { name: "Objetivo", type: "text" },
      { name: "Metodología", type: "text" },
      { name: "Entidad dueña", type: "relation (DB01)" }
    ],
    relations: ["DB01 - Entidades", "DB08 - Proyectos"],
    vistas: ["Líneas de Desarrollo Científico"]
  },
  {
    id: "DB11",
    name: "Ideas y Viabilidad",
    purpose: "Bandeja maestra (Inbox) para capturar oportunidades innovadoras, evaluar viabilidad técnica y triage antes de convertirlas en proyectos.",
    properties: [
      { name: "Idea / Proyecto potencial", type: "title" },
      { name: "Estado operativo", type: "status", notes: "Capturada | En análisis | Accionable | Para piloto | En ejecución | Archivada" },
      { name: "Viabilidad técnica / económica", type: "select", notes: "Sí | No | Parcial" },
      { name: "Origen", type: "select", notes: "Cliente | Campo | Técnico | WhatsApp | Gmail | Investigación" },
      { name: "Valor potencial / Riesgo", type: "number", notes: "Escala 1 a 5" },
      { name: "Proyecto resultante", type: "relation (DB08)" }
    ],
    relations: ["DB08 - Proyectos"],
    vistas: ["Inbox - Bandeja Maestra", "Kanban de Análisis de Viabilidad", "Proyectos Pendientes"]
  },
  {
    id: "DB12",
    name: "Grants & Funding",
    purpose: "Oportunidades de subvención y financiamiento tecnológico mapeadas a sus requisitos obligatorios.",
    properties: [
      { name: "Subvención", type: "title" },
      { name: "Organización emisora", type: "text" },
      { name: "Monto máximo", type: "number" },
      { name: "Fechas límite", type: "date" }
    ],
    relations: ["DB35 - Grants Tracking"],
    vistas: ["Concursos de Financiamiento Abiertos"]
  },
  {
    id: "DB13",
    name: "Catálogo Maestro de Productos",
    purpose: "Portafolio comercial de productos y licencias que componen las líneas de cotizaciones del ecosistema.",
    properties: [
      { name: "Nombre del producto", type: "title" },
      { name: "Código", type: "text" },
      { name: "Marca", type: "select", notes: "PC Doctor | InnerSpark | Domotika" },
      { name: "Precio sugerido venta / Costo base", type: "number" },
      { name: "Margen real %", type: "formula" },
      { name: "Modelo de ingreso", type: "select", notes: "One-time | Retainer mensual | Anual" }
    ],
    relations: [],
    vistas: ["Catálogo Activo", "Análisis Financiero de Productos", "Roadmap Comercial"]
  },
  {
    id: "DB14",
    name: "OS Automation Registry",
    purpose: "Inventario de flujos automatizados activos (n8n, OpenAI, APIs de terceros) con niveles de autonomía y umbrales de riesgo.",
    properties: [
      { name: "Nombre", type: "title" },
      { name: "Estado Operativo", type: "select", notes: "Diseño | Activo | Pausado | Degradado" },
      { name: "Nivel de Autonomía", type: "select", notes: "Manual | Semi-automático | Automático con revisión" },
      { name: "Enlace Workflow n8n", type: "url" },
      { name: "Riesgo", type: "select", notes: "Bajo | Medio | Alto | Crítico" }
    ],
    relations: [],
    vistas: ["Automatizaciones Activas", "Alerta de Procesos Críticos"]
  },
  {
    id: "DB15",
    name: "OS Editorial (Social & IA)",
    purpose: "Gestión unificada de las redes sociales del ecosistema, programadas mediante el Droid 8.",
    properties: [
      { name: "Título", type: "title" },
      { name: "Estado", type: "select", notes: "Idea | En revisión | Aprobado | Procesando | Publicado | Error" },
      { name: "Canal", type: "select", notes: "Facebook | LinkedIn | Instagram | Twitter" },
      { name: "Texto Generado", type: "text" },
      { name: "URL del Post", type: "url" }
    ],
    relations: ["DB17 - Avatares", "DB16 - Destinos Sociales", "DB23 - Campañas"],
    vistas: ["Bandeja de Ideas", "Cola listos para publicar", "Logs de errores API"]
  },
  {
    id: "DB16",
    name: "Destinos Sociales",
    purpose: "Cuentas y páginas destinos oficiales autorizadas para la distribución de contenido multicanal.",
    properties: [
      { name: "Nombre del Destino", type: "title" },
      { name: "Entidad titular", type: "select" },
      { name: "Plataforma", type: "select" },
      { name: "ID Plataforma", type: "text" },
      { name: "Activo", type: "checkbox" }
    ],
    relations: ["DB15 - OS Editorial", "DB18 - Activos Digitales"],
    vistas: ["Destinos Activos"]
  },
  {
    id: "DB17",
    name: "Avatares InnerSpark",
    purpose: "Segmentación psicográfica avanzada del público objetivo (dolores, nivel de consciencia espiritual/tecnológica).",
    properties: [
      { name: "Nombre del Avatar", type: "title" },
      { name: "Cluster", type: "select", notes: "Emocional | Espiritual | Negocio | Existencial" },
      { name: "Dolor Principal / Deseo Key", type: "text" },
      { name: "Hook activo / CTA ideal", type: "text" }
    ],
    relations: ["DB03 - Buyer Personas", "DB13 - Productos"],
    vistas: ["Fichas Psicográficas", "Pauta Alto Ticket"]
  },
  {
    id: "DB18",
    name: "Activos Digitales & Canales",
    purpose: "Inventario de páginas de Facebook, integraciones de API, bots de WhatsApp y dominios controlados.",
    properties: [
      { name: "Nombre del Activo", type: "title" },
      { name: "Tipo", type: "select" },
      { name: "Estado Operativo", type: "select", notes: "Activo | Pausado | Suspendido" },
      { name: "ENV Key", type: "text", notes: "Referencia para variables del sistema" }
    ],
    relations: ["DB16 - Destinos Sociales"],
    vistas: ["Listado Técnico de Canales", "Auditoría de Tokens"]
  },
  {
    id: "DB19",
    name: "Métricas & Salud del Ecosistema",
    purpose: "KPIs unificados mensuales de PC Doctor S.A e InnerSpark para decisiones del comité ejecutivo.",
    properties: [
      { name: "Métrica", type: "title" },
      { name: "Categoría", type: "select", notes: "Financiero | Operacional | Marketing | Técnico" },
      { name: "Valor Actual", type: "number" },
      { name: "Valor Objetivo", type: "number" },
      { name: "Tendencia", type: "select", notes: "↑ Creciendo | → Estable | ↓ Decreciendo" }
    ],
    relations: [],
    vistas: ["Dashboard General de Salud"]
  },
  {
    id: "DB20",
    name: "Incidentes & Decisiones",
    purpose: "Libro de bitácora técnico de control de fallas en producción, bloqueos de APIs, decisiones arquitectónicas y lecciones aprendidas.",
    properties: [
      { name: "Título", type: "title" },
      { name: "Tipo", type: "select", notes: "Incidente Técnico | Decisión Estratégica | Cambio de Arquitectura | Lección Aprendida" },
      { name: "Severidad", type: "select", notes: "Baja | Media | Alta | Crítica" },
      { name: "Estado", type: "status", notes: "Nuevo | En análisis | Bloqueado | Resuelto" },
      { name: "Solución Aplicada", type: "text" }
    ],
    relations: ["DB14 - OS Automation Registry", "DB18 - Activos Digitales"],
    vistas: ["Soporte de Incidentes Abiertos", "Registro Histórico de Lecciones Aprendidas"]
  },
  {
    id: "DB21",
    name: "Biblioteca de Assets (Media)",
    purpose: "Archivos binarios o links a imágenes vectoriales, templates de Canva, PDFs de marca e instructivos del sistema.",
    properties: [
      { name: "Nombre del Asset", type: "title" },
      { name: "Tipo de Asset", type: "select", notes: "Imagen | Video | PDF | Canva" },
      { name: "Marca", type: "select" },
      { name: "Archivo", type: "files" }
    ],
    relations: ["DB15 - OS Editorial"],
    vistas: ["Galería de Assets de Contenido"]
  },
  {
    id: "DB22",
    name: "UTM & Links Tracker",
    purpose: "Trazabilidad de clics, registros, conversiones y enlaces cortos de marketing.",
    properties: [
      { name: "Nombre del Link", type: "title" },
      { name: "URL Destino", type: "url" },
      { name: "Short Link", type: "url" },
      { name: "Clicks Totales", type: "number" }
    ],
    relations: ["DB15 - OS Editorial"],
    vistas: ["Control de Enlaces UTM Activos"]
  },
  {
    id: "DB23",
    name: "Campañas",
    purpose: "Campañas comerciales masivas para productos con objetivos cuantitativos de venta, leads y ROI.",
    properties: [
      { name: "Nombre de la Campaña", type: "title" },
      { name: "Estado", type: "status", notes: "Ideando | Lanzada | En ejecución | Completada" },
      { name: "Presupuesto", type: "number" },
      { name: "Gasto Real", type: "number" },
      { name: "Ventas Cerradas", type: "number" }
    ],
    relations: ["DB13 - Productos", "DB17 - Avatares"],
    vistas: ["Rendimiento General de Campañas"]
  },
  {
    id: "DB24",
    name: "Experimentos / A/B Tests",
    purpose: "Bitácora científica de testing de copias, anuncios, rangos de precio u ofertas.",
    properties: [
      { name: "Nombre del Experimento", type: "title" },
      { name: "Estado", type: "status" },
      { name: "Variante A / B Result", type: "text" },
      { name: "Ganador", type: "select" }
    ],
    relations: ["DB23 - Campañas"],
    vistas: ["Fórmulas Ganadoras A/B"]
  },
  {
    id: "DB25",
    name: "Proveedores y Suppliers",
    purpose: "Directorio de fabricantes, distribuidores de CCTV e instaladores homologados con sus datos fiscales (SRI).",
    properties: [
      { name: "Nombre del proveedor", type: "title" },
      { name: "Estado", type: "select", notes: "Activo | Evaluación | Pausado" },
      { name: "Tipo de proveedor", type: "select", notes: "Fabricante | Distribuidor | Instalador | Mixto" },
      { name: "RUC", type: "text" },
      { name: "Retención IVA default %", type: "select" },
      { name: "Retención IR default %", type: "select" },
      { name: "Calificación / Puntualidad", type: "select" }
    ],
    relations: ["DB08 - Proyectos", "DB13 - Productos", "DB26 - Inventario Hardware"],
    vistas: ["Directorio de Proveedores CCTV", "Configuración de Retenciones Fiscales"]
  },
  {
    id: "DB26",
    name: "Inventario Hardware",
    purpose: "Stock físico de hardware de seguridad electrónica disponible en PC Doctor (Cámaras, NVR, Switches).",
    properties: [
      { name: "Nombre del producto", type: "title" },
      { name: "SKU o Código", type: "text" },
      { name: "Marca / Modelo", type: "text" },
      { name: "Stock actual / Stock mínimo", type: "number" },
      { name: "Costo proveedor / Precio venta", type: "number" },
      { name: "Margen %", type: "formula" },
      { name: "Disponible para cotizar", type: "checkbox" },
      { name: "Proveedor principal", type: "relation (DB25)" }
    ],
    relations: ["DB25 - Proveedores", "DB27 - Cotizaciones"],
    vistas: ["Bodega Completa", "Productos Cotizables", "Alerta de Stock Bajo"]
  },
  {
    id: "DB27",
    name: "Cotizaciones",
    purpose: "Cabeceras de ofertas comerciales calculadas de forma estricta y vinculadas a su PDF corporativo.",
    properties: [
      { name: "Título cotización", type: "title" },
      { name: "Código", type: "text" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Estado", type: "select", notes: "Borrador | Enviada | En negociación | Aprobada" },
      { name: "Fecha emisión / vencimiento", type: "date" },
      { name: "IVA 15%", type: "checkbox" },
      { name: "Subtotal / Monto IVA / Total", type: "number" },
      { name: "Subtotal Calculado", type: "rollup", notes: "Suma de DB38" },
      { name: "Archivo PDF", type: "files" }
    ],
    relations: ["DB04 - Clientes", "DB26 - Inventario Hardware", "DB38 - Líneas de Cotización"],
    vistas: ["Historial de Cotizaciones", "Cotizaciones Pendientes", "Pipeline Comercial"]
  },
  {
    id: "DB28",
    name: "Compras / Historial de Precios",
    purpose: "Registro pormenorizado de compras a fabricantes y proformas vigentes de proveedores.",
    properties: [
      { name: "Compra / Registro", type: "title" },
      { name: "Fecha", type: "date" },
      { name: "Ítem (Inventario)", type: "relation (DB26)" },
      { name: "Costo unitario", type: "number" },
      { name: "Cantidad", type: "number" }
    ],
    relations: ["DB26 - Inventario", "DB25 - Proveedores"],
    vistas: ["Histórico de Costos de Hardware"]
  },
  {
    id: "DB29",
    name: "Trabajos del Día a Día",
    purpose: "Hojas de ruta técnicas diarias para visitas, soporte, instalación de cámaras, cableado y mantenimiento.",
    properties: [
      { name: "Nombre del trabajo", type: "title" },
      { name: "Código", type: "text" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Fecha", type: "date" },
      { name: "Tipo de servicio", type: "select", notes: "Mantenimiento CCTV | Reparación | Cerco Eléctrico | Redes" },
      { name: "Técnico/ejecutor", type: "relation (DB05)" },
      { name: "Estado facturación", type: "select" },
      { name: "Precio cobrado / Costo", type: "number" }
    ],
    relations: ["DB04 - Clientes", "DB05 - Contactos", "DB27 - Cotizaciones"],
    vistas: ["Visitas del Día", "Trabajos Pendientes de Facturar"]
  },
  {
    id: "DB30",
    name: "Cuentas Financieras",
    purpose: "Control centralizado de cuentas bancarias de las compañías de OS Central con sus balances actuales.",
    properties: [
      { name: "Nombre cuenta", type: "title" },
      { name: "Tipo", type: "select", notes: "Banco | Procesador Pago | Tarjeta" },
      { name: "Balance actual", type: "number" },
      { name: "Moneda principal", type: "select" },
      { name: "Estado", type: "status" }
    ],
    relations: ["DB01 - Entidades", "DB31 - Transacciones"],
    vistas: ["Balances Activos", "Control de Saldos por Entidad"]
  },
  {
    id: "DB31",
    name: "Transacciones Financieras",
    purpose: "Libro diario real contable de ingresos y gastos. Es la fuente de verdad del flujo monetario.",
    properties: [
      { name: "Concepto", type: "title" },
      { name: "Tipo", type: "select", notes: "Ingreso | Gasto | Transfer Interno" },
      { name: "Monto / Comisión / Neto", type: "number" },
      { name: "Fecha transacción", type: "date" },
      { name: "Factura relacionada", type: "relation (DB32)" },
      { name: "Número retención SRI", type: "text" },
      { name: "Cuenta origen / destino", type: "relation (DB30)" }
    ],
    relations: ["DB32 - Facturas", "DB30 - Cuentas", "DB08 - Proyectos"],
    vistas: ["Libro Diario Completo", "Historial de Ingresos", "Historial de Gastos"]
  },
  {
    id: "DB32",
    name: "Facturas e Invoices",
    purpose: "Control contable de facturas emitidas y recibidas con su estado fiscal del SRI.",
    properties: [
      { name: "Número factura", type: "title" },
      { name: "Código factura", type: "text" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Subtotal / Impuestos / Total", type: "number" },
      { name: "Estado", type: "status", notes: "Borrador | Enviada | Pagada" }
    ],
    relations: ["DB04 - Clientes", "DB27 - Cotizaciones", "DB31 - Transacciones"],
    vistas: ["Facturador SRI", "Cuentas por Cobrar"]
  },
  {
    id: "DB33",
    name: "Gastos Operativos",
    purpose: "Control de egresos recurrentes y facturación mensual de servidores, licencias y servicios públicos.",
    properties: [
      { name: "Descripción", type: "title" },
      { name: "Estado", type: "status" },
      { name: "Categoría", type: "select", notes: "Servidores | Software | Honorarios | Oficina" },
      { name: "Monto", type: "number" },
      { name: "Recurrente", type: "checkbox" }
    ],
    relations: ["DB30 - Cuentas", "DB25 - Proveedores"],
    vistas: ["Gastos Recurrentes", "Liquidación de Gastos Mensuales"]
  },
  {
    id: "DB34",
    name: "Procesadores de Pago",
    purpose: "Portales de pasarela de cobro integrados (Stripe, Paypal, Wise) con comisiones parametrizables.",
    properties: [
      { name: "Nombre procesador", type: "title" },
      { name: "Estado", type: "status" },
      { name: "Comisión %", type: "number" },
      { name: "Comisión fija USD", type: "number" }
    ],
    relations: ["DB1 - Entidades"],
    vistas: ["Procesadores Activos"]
  },
  {
    id: "DB35",
    name: "Grants Tracking Financiero",
    purpose: "Seguimiento financiero detallado de los fondos aprobados y su ejecución por partida.",
    properties: [
      { name: "Nombre grant", type: "title" },
      { name: "Estado financiero", type: "status" },
      { name: "Monto aprobado", type: "number" },
      { name: "Monto recibido", type: "number" }
    ],
    relations: ["DB12 - Grants", "DB30 - Cuentas"],
    vistas: ["Rendición de Fondos Tecnológicos"]
  },
  {
    id: "DB36",
    name: "Cash Flow & Budget",
    purpose: "Previsiones mensuales de ingresos y gastos vs realidad de cada entidad.",
    properties: [
      { name: "Período", type: "title" },
      { name: "Estado", type: "status" },
      { name: "Ingresos proyectados / reales", type: "number" },
      { name: "Gastos proyectados / reales", type: "number" }
    ],
    relations: ["DB01 - Entidades"],
    vistas: ["Control de Flujos Financieros Proyectados"]
  },
  {
    id: "DB37",
    name: "Productivity Metrics Tracker",
    purpose: "Registro automático de ahorro de tiempo y monetario por el uso de agentes autónomos.",
    properties: [
      { name: "Proceso", type: "title" },
      { name: "Fecha de medición", type: "date" },
      { name: "Tiempo Antes (min) / Después", type: "number" },
      { name: "Ahorro mensual (min)", type: "formula" },
      { name: "Impacto monetario mensual / anual", type: "formula" },
      { name: "Validado", type: "checkbox" }
    ],
    relations: ["DB08 - Proyectos"],
    vistas: ["Ahorros de Tiempo por Droide", "Impacto Económico Acumulado"]
  },
  {
    id: "DB38",
    name: "Líneas de Cotización",
    purpose: "Desglose matemático atómico e inquebrantable de ítems dentro de una cotización para evitar descuadres de IVA.",
    properties: [
      { name: "Línea", type: "title", notes: "Descripción de ítem" },
      { name: "Cotización", type: "relation (DB27)" },
      { name: "Tipo", type: "select", notes: "Hardware | Servicio | Material" },
      { name: "Ítem hardware", type: "relation (DB26)" },
      { name: "Cantidad", type: "number" },
      { name: "Precio unitario / Costo unitario", type: "number" },
      { name: "Subtotal línea", type: "formula" },
      { name: "Ganancia línea", type: "formula" }
    ],
    relations: ["DB27 - Cotizaciones", "DB26 - Inventario Hardware"],
    vistas: ["Cálculo de ítems unitarios"]
  },
  {
    id: "DB39",
    name: "Manuales InnerSpark (Núcleo)",
    purpose: "Repositorio y pipeline editorial de guías, toolkits y manuales vendibles en divisas.",
    properties: [
      { name: "Título manual (ES)", type: "title" },
      { name: "Código Manual", type: "text" },
      { name: "Estado", type: "status" },
      { name: "Link Hotmart", type: "url" }
    ],
    relations: ["DB17 - Avatares", "DB13 - Productos"],
    vistas: ["Inventario de Manuales"]
  },
  {
    id: "DB40",
    name: "Secuenciales",
    purpose: "Controlador numérico transaccional de folios y series (COT, TRB, INF, FAC, SOP).",
    properties: [
      { name: "Clave", type: "title", notes: "Código como PCD o IS" },
      { name: "Tipo", type: "select" },
      { name: "Año", type: "number" },
      { name: "Último secuencial", type: "number" },
      { name: "Prefijo", type: "text" }
    ],
    relations: [],
    vistas: ["Configuración de Numeración"]
  },
  {
    id: "DB41",
    name: "Reglas de Verificación",
    purpose: "Lista de chequeo obligatoria que audita el Droid 5 / Droid 7 antes de autorizar el envío de un PDF-First.",
    properties: [
      { name: "Regla", type: "title" },
      { name: "Activa", type: "checkbox" },
      { name: "Severidad", type: "select" },
      { name: "Condición (si falta...)", type: "text" }
    ],
    relations: [],
    vistas: ["Reglas de consistencia CCTV", "Verificaciones requeridas"]
  },
  {
    id: "DB42",
    name: "Soporte / Visitas Técnicas (SOP)",
    purpose: "Registro cronológico de mantenimiento y visitas SOP realizadas en sitio.",
    properties: [
      { name: "Visita", type: "title" },
      { name: "Estado", type: "status" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Código SOP", type: "text" },
      { name: "Fecha", type: "date" }
    ],
    relations: ["DB04 - Clientes", "DB29 - Trabajos"],
    vistas: ["Calendario de Visitas SOP"]
  },
  {
    id: "DB43",
    name: "Recepciones de Equipos (Tickets)",
    purpose: "Control de hardware físico que entra al laboratorio de computadores de PC Doctor (recepción → diagnóstico → entrega).",
    properties: [
      { name: "Ticket", type: "title" },
      { name: "Estado", type: "status", notes: "Ingreso | En diagnóstico | Presupuestado | Entregado" },
      { name: "Cliente", type: "text" },
      { name: "Equipo / Número de serie", type: "text" },
      { name: "Diagnóstico preliminar", type: "text" },
      { name: "Técnico asignado", type: "select" },
      { name: "Estado al entregar", type: "select" }
    ],
    relations: ["DB29 - Trabajos del Día a Día", "DB32 - Facturas"],
    vistas: ["Laboratorio Principal", "Llegadas de hoy"]
  },
  {
    id: "DB44",
    name: "Dominios & Hosting (Clientes + Interno)",
    purpose: "Control técnico e inventario de nombres de dominios, dns y fechas de desactivación de hostings.",
    properties: [
      { name: "Activo", type: "title" },
      { name: "Tipo", type: "select", notes: "Dominio | Hosting" },
      { name: "Proveedor", type: "select", notes: "Namecheap | Cloudflare | AWS" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Vence", type: "date" },
      { name: "Costo / Valor a cobrar", type: "number" }
    ],
    relations: ["DB04 - Clientes", "DB01 - Entidades"],
    vistas: ["Control de Renovaciones de Dominios"]
  },
  {
    id: "DB45",
    name: "Reportes Técnicos",
    purpose: "Hojas de trabajo oficiales redactadas (informes de fase u hojas de entrega) con firmas y hallazgos.",
    properties: [
      { name: "Reporte", type: "title" },
      { name: "Estado", type: "status", notes: "Borrador | Pendiente info | En curso | Finalizado" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Trabajo", type: "relation (DB29)" },
      { name: "Resumen ejecutivo / Hallazgos clave", type: "text" },
      { name: "Listo para exportar PDF", type: "checkbox" },
      { name: "PDF-first (link exportable)", type: "url" }
    ],
    relations: ["DB04 - Clientes", "DB29 - Trabajos del Día a Día"],
    vistas: ["Bitácoras del Técnico", "Historial de Reportes Exportados"]
  },
  {
    id: "DB46",
    name: "Contratos",
    purpose: "Repositorio de documentos legales firmados con clientes para obras complejas o mantenimientos.",
    properties: [
      { name: "Contrato", type: "title" },
      { name: "Estado", type: "status", notes: "Draft | Sent | Signed | Active" },
      { name: "Cliente", type: "relation (DB04)" },
      { name: "Total con IVA", type: "number" },
      { name: "Fecha firma", type: "date" }
    ],
    relations: ["DB04 - Clientes", "DB08 - Proyectos"],
    vistas: ["Contratos Vigentes"]
  },
  {
    id: "DB47",
    name: "Capturas de Campo Editorial",
    purpose: "Imágenes y notas tomadas por técnicos 'en caliente' durante intervenciones en campo con alto potencial comercial.",
    properties: [
      { name: "Registro", type: "title" },
      { name: "Fecha", type: "date" },
      { name: "Tipo de trabajo", type: "select" },
      { name: "Problema observado / Solución", type: "text" },
      { name: "Fotos / Videos", type: "files" }
    ],
    relations: ["DB29 - Trabajos"],
    vistas: ["Evidencias con Potencial Editorial"]
  },
  {
    id: "DB48",
    name: "Pipeline Editorial Multicanal",
    purpose: "Planificador atómico de contenido por plataformas adaptado a sus copys e idiomas.",
    properties: [
      { name: "Pieza", type: "title" },
      { name: "Estado", type: "status" },
      { name: "Canal", type: "select" },
      { name: "Copy base (ES) / Copy EN", type: "text" },
      { name: "CTA de salida", type: "text" }
    ],
    relations: ["DB17 - Avatares", "DB16 - Destinos Sociales", "DB47 - Capturas de Campo"],
    vistas: ["Pipeline multilingüe de redacción"]
  },
  {
    id: "DB49",
    name: "Campañas Editoriales",
    purpose: "Estructuras estratégicas temáticas que dirigen los mensajes de las piezas multicanales.",
    properties: [
      { name: "Campaña", type: "title" },
      { name: "Marca", type: "select" },
      { name: "Tema central", type: "text" },
      { name: "CTA Principal", type: "text" }
    ],
    relations: ["DB13 - Catálogo", "DB17 - Avatares"],
    vistas: ["Frentes Estratégicos Editoriales"]
  }
];

export interface SOPTactic {
  title: string;
  purpose: string;
  gates: string[];
  flow: string[];
}

export const centralSOPs: SOPTactic[] = [
  {
    title: "SOP-01: Flujo Cliente Hub-First",
    purpose: "Garantizar que todo cliente nuevo tenga un repositorio de archivos unificado y ordenado.",
    gates: [
      "Anti-duplicidad en base DB04",
      "Asociación obligatoria de un contacto central DB05",
      "Creación de carpeta en Google Drive Hub (gs://pc-doctor/hubs/)"
    ],
    flow: [
      "Confirmar que el RUC no esté ya registrado en DB04.",
      "Crear el registro de contacto y enlazar la institución.",
      "Clonar la estructura del Hub con las subcarpetas: Cotizaciones, Trabajos, Reportes, PDFs.",
      "Comenzar operaciones desde el Hub, nunca con archivos sueltos."
    ]
  },
  {
    title: "SOP-02: Generación de Cotización Segura",
    purpose: "Evitar descuadres en centavos de IVA en presupuestos comerciales de hardware.",
    gates: [
      "Uso mandatorio de DB38 (Líneas de Detalle)",
      "Vigencia máxima estricta de 15 días en la plantilla",
      "Alerta anti-matemática en el dashboard"
    ],
    flow: [
      "Crear cabecera de Cotización en DB27.",
      "Cargar ítems de hardware desde DB26 en base a stock real.",
      "La matemática local sumará las líneas (DB38), agregando el 15% de IVA de forma atómica.",
      "Una vez sin descuadres, Droid 4 descarga secuencial DB40 e imprime el PDF-First estático."
    ]
  },
  {
    title: "SOP-03: Facturación Electrónica al SRI",
    purpose: "Firmar digitalmente archivos XML de facturas con altos estándares de seguridad y envío directo.",
    gates: [
      "Firma digital .p12 presente en el almacén de claves",
      "RUC de cliente verificado (13 dígitos)",
      "Suscripción activa en Contífico o software integrado"
    ],
    flow: [
      "Consultar secuenciales libres en DB40.",
      "Generar el XML oficial según las especificaciones del SRI.",
      "Aplicar la firma digital con certificado cifrado utilizando Droid 7.",
      "Proceder al envío directo al webservie del SRI. Recibir autorización contable e insertar registro en DB31."
    ]
  },
  {
    title: "SOP-04: Captura de Resiliencia en Campo",
    purpose: "Sincronizar el conocimiento técnico diario levantado en laboratorios o visitas.",
    gates: [
      "Registro inmediato de la foto o evidencia de montaje",
      "Registro de tiempo transcurrido en DB37 para métrica de productividad"
    ],
    flow: [
      "Técnico en campo dicta por voz al canal de WhatsApp o chat.",
      "Droid 2 procesa la nota técnica transformándola a estructura JSON.",
      "Se crea la hoja de ruta DB29 y reporte técnico DB45.",
      "Sincronización a las 6:00 PM con las bases centrales en MongoDB Atlas."
    ]
  }
];
