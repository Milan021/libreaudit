"use client";
import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// LibreAudit — Diagnostic de dépendance aux logiciels propriétaires
// v4 — +catégorie ERP Assurance (22 produits) + BDOC/BDU éditique
// Design: Clair & pro — crème/blanc + bleu marine/indigo
// ═══════════════════════════════════════════════════════════════

const CATEGORIES = [
  { id: "legacy", label: "Legacy & Mainframe", icon: "🏛️" },
  { id: "cobol", label: "COBOL & Langages Legacy", icon: "📟" },
  { id: "middleware", label: "Middleware & Intégration", icon: "🔗" },
  { id: "erp", label: "ERP / CRM / Métier", icon: "🏢" },
  { id: "insurance", label: "ERP Assurance", icon: "🏦" },
  { id: "finance", label: "Comptabilité & Finance", icon: "💰" },
  { id: "editique", label: "Éditique & GED", icon: "🖨️" },
  { id: "os", label: "Systèmes d'exploitation", icon: "🖥️" },
  { id: "office", label: "Bureautique & Création", icon: "📄" },
  { id: "email", label: "Messagerie & Collaboration", icon: "📧" },
  { id: "cloud", label: "Cloud & Infrastructure", icon: "☁️" },
  { id: "db", label: "Bases de données", icon: "🗄️" },
  { id: "dev", label: "Outils de développement", icon: "⚙️" },
  { id: "security", label: "Sécurité", icon: "🛡️" },
  { id: "ai", label: "IA & Assistants IA", icon: "🤖" },
  { id: "rh", label: "RH, Paie & Talent", icon: "👥" },
  { id: "virtualisation", label: "Virtualisation & Conteneurs", icon: "📦" },
  { id: "network", label: "Réseau & Télécom", icon: "🌐" },
  { id: "grc", label: "Conformité / GRC", icon: "📋" },
  { id: "data", label: "Data / Analytics / BI", icon: "📊" },
  { id: "backup", label: "Backup / PRA / BCDR", icon: "💾" },
  { id: "iot", label: "IoT / OT / SCADA", icon: "🏭" },
  { id: "apimgmt", label: "API Management", icon: "🔌" },
];

const PROPRIETARY_DB: Record<string, any[]> = {
  legacy: [
    { name: "IBM z/OS (Mainframe)", riskLevel: 5, lockIn: 5, hausse: 4.5, alternatives: [{ name: "Linux on Z / KVM", maturity: 4 }, { name: "Cloud Foundry", maturity: 3 }] },
    { name: "IBM CICS", riskLevel: 5, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Jakarta EE / WildFly", maturity: 4 }, { name: "Spring Boot", maturity: 5 }] },
    { name: "IBM IMS (DB/TM)", riskLevel: 5, lockIn: 5, hausse: 3.5, alternatives: [{ name: "PostgreSQL + Message Broker", maturity: 4 }] },
    { name: "IBM DB2 for z/OS", riskLevel: 4, lockIn: 5, hausse: 4.2, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "CockroachDB", maturity: 4 }] },
    { name: "Rocket Software (UniVerse/UniData/D3)", riskLevel: 5, lockIn: 5, hausse: 5.0, alternatives: [{ name: "PostgreSQL + jBASE (open)", maturity: 3 }, { name: "MongoDB", maturity: 4 }] },
    { name: "Unisys ClearPath", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Linux clusters", maturity: 4 }] },
    { name: "Bull/Atos GCOS", riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Linux + containers", maturity: 4 }] },
    { name: "HP NonStop (Tandem)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Linux HA clusters", maturity: 4 }] },
    { name: "OpenVMS (DEC/HP)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Linux + VMS Software Inc.", maturity: 3 }] },
  ],
  cobol: [
    { name: "COBOL (programmes métier)", riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Java / Spring Boot", maturity: 5 }, { name: "GnuCOBOL", maturity: 4 }, { name: "CobolCloud (compilateur cloud-native)", maturity: 3 }] },
    { name: "Natural + ADABAS (Software AG)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "PostgreSQL + Java", maturity: 5 }] },
    { name: "MUMPS / Caché (InterSystems)", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "PostgreSQL + Python", maturity: 4 }, { name: "YottaDB (open MUMPS)", maturity: 3 }] },
    { name: "JCL (Job Control Language)", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Apache Airflow", maturity: 5 }, { name: "Ansible / AWX", maturity: 5 }] },
    { name: "PL/I (IBM)", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Java / Go", maturity: 5 }] },
    { name: "RPG (IBM i)", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Python / Java", maturity: 5 }] },
    { name: "Pacbase (IBM/Bull)", riskLevel: 5, lockIn: 5, hausse: 2.0, alternatives: [{ name: "Java + Spring Boot", maturity: 5 }] },
    { name: "PowerBuilder (Appeon)", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "React + .NET / Java", maturity: 5 }] },
    { name: "Delphi (Embarcadero)", riskLevel: 3, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Lazarus (Free Pascal)", maturity: 4 }, { name: "Flutter / Electron", maturity: 4 }] },
    { name: "VB6 / VBA (Microsoft)", riskLevel: 4, lockIn: 4, hausse: 2.0, alternatives: [{ name: "Python + LibreOffice macros", maturity: 4 }] },
    { name: "Progress 4GL / OpenEdge", riskLevel: 4, lockIn: 4, hausse: 4.0, alternatives: [{ name: "PostgreSQL + Java/Node.js", maturity: 5 }] },
    { name: "Fortran (legacy HPC)", riskLevel: 3, lockIn: 3, hausse: 1.5, alternatives: [{ name: "Julia / Python SciPy", maturity: 4 }] },
  ],
  middleware: [
    { name: "IBM WebSphere Application Server", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "WildFly / JBoss", maturity: 5 }, { name: "Apache Tomcat", maturity: 5 }] },
    { name: "Oracle WebLogic", riskLevel: 4, lockIn: 4, hausse: 4.0, alternatives: [{ name: "WildFly", maturity: 5 }, { name: "Quarkus", maturity: 4 }] },
    { name: "IBM MQ (WebSphere MQ)", riskLevel: 3, lockIn: 4, hausse: 3.0, alternatives: [{ name: "RabbitMQ", maturity: 5 }, { name: "Apache Kafka", maturity: 5 }] },
    { name: "TIBCO (EMS, BW, Rendezvous)", riskLevel: 4, lockIn: 4, hausse: 3.5, alternatives: [{ name: "Apache Kafka", maturity: 5 }, { name: "Apache Camel", maturity: 4 }] },
    { name: "Informatica PowerCenter (ETL)", riskLevel: 4, lockIn: 4, hausse: 3.5, alternatives: [{ name: "Apache Airflow + dbt", maturity: 5 }, { name: "Talend Open Studio", maturity: 4 }] },
    { name: "MicroFocus Enterprise Server", riskLevel: 4, lockIn: 4, hausse: 3.5, alternatives: [{ name: "GnuCOBOL + Linux", maturity: 3 }] },
    { name: "Tuxedo (Oracle)", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "gRPC + Kubernetes", maturity: 4 }] },
  ],
  erp: [
    { name: "SAP ERP / S/4HANA", riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Odoo Community", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Oracle E-Business Suite", riskLevel: 5, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Odoo", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Oracle JD Edwards", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "ERPNext", maturity: 4 }] },
    { name: "Oracle PeopleSoft", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Odoo RH", maturity: 4 }] },
    { name: "Oracle Siebel (CRM)", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Odoo CRM", maturity: 4 }] },
    { name: "Salesforce (CRM)", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Odoo CRM", maturity: 4 }] },
    { name: "ServiceNow", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "GLPI", maturity: 4 }, { name: "Zammad", maturity: 3 }] },
    { name: "Microsoft Dynamics 365", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Odoo Community", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Sage X3 / Sage 100", riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "Odoo Community", maturity: 4 }] },
    { name: "Sage Ligne 100 / 1000 (ancien)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "Odoo Community", maturity: 4 }] },
    { name: "Cegid (ERP / RH / Retail)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Odoo Community", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Efficy CRM", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Odoo CRM", maturity: 4 }] },
    { name: "Temenos (banque)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Apache Fineract", maturity: 3 }, { name: "Mambu", maturity: 3 }] },
    { name: "Finastra (banque)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Apache Fineract", maturity: 3 }, { name: "Mambu (SaaS)", maturity: 3 }] },
  ],
  insurance: [
    { name: "Guidewire InsuranceSuite", riskLevel: 5, lockIn: 5, hausse: 3.5, alternatives: [{ name: "Socotra (cloud-native)", maturity: 3 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Duck Creek Technologies", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Instanda (low-code)", maturity: 3 }] },
    { name: "Sapiens IDITSuite / CoreSuite", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "EIS Group", maturity: 3 }, { name: "Socotra", maturity: 3 }] },
    { name: "Majesco (Policy, Billing, Claims)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "BriteCore", maturity: 3 }, { name: "Instanda", maturity: 3 }] },
    { name: "EIS Group (OneSuite)", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Développement microservices", maturity: 5 }] },
    { name: "Prima Solutions (IARD / Santé / Prévoyance)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Développement sur mesure", maturity: 5 }, { name: "Odoo + modules custom", maturity: 2 }] },
    { name: "ALFA System (assurance vie / finance)", riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Apache Fineract + actuariel", maturity: 2 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "RGI (core insurance Europe)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Prima Solutions", maturity: 4 }, { name: "Socotra", maturity: 3 }] },
    { name: "Insurity (CloudChoice)", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "BriteCore", maturity: 3 }, { name: "Socotra", maturity: 3 }] },
    { name: "OneShield (Policy, Claims, Billing)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Instanda", maturity: 3 }, { name: "BriteCore", maturity: 3 }] },
    { name: "Shift Technology (IA fraude / sinistres)", riskLevel: 3, lockIn: 3, hausse: 3.0, alternatives: [{ name: "FRISS (anti-fraude)", maturity: 4 }, { name: "ML interne (scikit-learn)", maturity: 4 }] },
    { name: "Acturis (courtage / distribution)", riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Applied Systems (Epic)", maturity: 4 }, { name: "CRM + sur mesure", maturity: 4 }] },
    { name: "Sofraco / DXC Insurance (legacy France)", riskLevel: 5, lockIn: 5, hausse: 2.0, alternatives: [{ name: "Prima Solutions", maturity: 4 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Instanda (low-code insurance)", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "BriteCore", maturity: 3 }] },
    { name: "Cleva Insurance Solution (Nexpublica)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Wynsure (Wyde / CGI)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Instanda", maturity: 3 }] },
    { name: "Orisha Insurance / Protect (ex-Cunae)", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "BriteCore", maturity: 3 }] },
    { name: "DXC Graphtalk AIA (ex-CSC)", riskLevel: 5, lockIn: 5, hausse: 2.0, alternatives: [{ name: "Cleva Insurance", maturity: 4 }, { name: "Wynsure", maturity: 4 }] },
    { name: "SOLIFE (VERMEG / ex-BSB)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "KELIA (KAPIA-RGI)", maturity: 4 }, { name: "Développement Java", maturity: 5 }] },
    { name: "KELIA (KAPIA-RGI)", riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "SOLIFE", maturity: 4 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Cegedim Assurances (BEYOND / Activ'Infinite)", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "ASSIA plateforme santé", maturity: 3 }, { name: "Développement + tiers payant", maturity: 4 }] },
    { name: "ASSIA (plateforme santé assurance)", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Cegedim BEYOND", maturity: 4 }, { name: "Développement sur mesure", maturity: 5 }] },
  ],
  finance: [
    { name: "Sage Comptabilité", riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr (compta)", maturity: 4 }, { name: "GnuCash", maturity: 3 }, { name: "Odoo Comptabilité", maturity: 4 }] },
    { name: "SAP Financial (FI/CO)", riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Odoo Comptabilité", maturity: 4 }, { name: "ERPNext Finance", maturity: 4 }] },
    { name: "Oracle Financials Cloud", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Odoo Comptabilité", maturity: 4 }] },
    { name: "Cegid Finance", riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "Odoo", maturity: 4 }] },
    { name: "Quadratus (compta)", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }] },
    { name: "Sopra Banking (finance)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Apache Fineract", maturity: 3 }] },
    { name: "Murex (trading / risques)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "QuantLib + Python", maturity: 3 }] },
    { name: "Calypso (post-trade)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "OpenGamma", maturity: 3 }] },
    { name: "SAS (analytics financier)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "R + Python (pandas/scikit)", maturity: 5 }, { name: "Apache Spark", maturity: 5 }] },
  ],
  editique: [
    { name: "SEFAS (éditique)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Apache FOP", maturity: 3 }, { name: "Docmosis", maturity: 3 }] },
    { name: "OpenText Exstream", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Apache FOP + XSL-FO", maturity: 3 }] },
    { name: "Quadient / GMC Inspire", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Apache FOP", maturity: 3 }, { name: "LibreOffice scripting", maturity: 3 }] },
    { name: "Compart DocBridge", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Apache PDFBox + FOP", maturity: 4 }] },
    { name: "ISIS Papyrus", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Alfresco + Apache FOP", maturity: 3 }] },
    { name: "OpenText Content Suite (GED)", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "Hyland OnBase (GED)", riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "DocuSign", riskLevel: 2, lockIn: 2, hausse: 3.0, alternatives: [{ name: "Yousign (FR)", maturity: 4 }, { name: "Open-source: LibreSign", maturity: 2 }] },
    { name: "M-Files", riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "BDOC Suite (Nexpublica / ex-Inetum)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Apache FOP + XSL-FO", maturity: 4 }, { name: "Docmosis", maturity: 3 }] },
    { name: "BDU — Business Document Unity (Nexpublica)", riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Alfresco (GED open source)", maturity: 4 }, { name: "Nuxeo (GED/ECM)", maturity: 4 }] },
  ],
  os: [
    { name: "Microsoft Windows (postes)", riskLevel: 4, lockIn: 4, hausse: 4.0, alternatives: [{ name: "Ubuntu Desktop", maturity: 5 }, { name: "Fedora Workstation", maturity: 4 }] },
    { name: "macOS (Apple)", riskLevel: 3, lockIn: 4, hausse: 2.0, alternatives: [{ name: "Ubuntu Desktop", maturity: 5 }, { name: "Fedora", maturity: 4 }] },
    { name: "Windows Server", riskLevel: 4, lockIn: 4, hausse: 4.0, alternatives: [{ name: "Ubuntu Server / Debian", maturity: 5 }, { name: "Rocky Linux / AlmaLinux", maturity: 5 }] },
    { name: "IBM i (AS/400)", riskLevel: 5, lockIn: 5, hausse: 3.5, alternatives: [{ name: "Linux + PostgreSQL", maturity: 4 }, { name: "CobolCloud", maturity: 3 }] },
    { name: "IBM AIX (Unix IBM)", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Linux (RHEL/Rocky)", maturity: 5 }] },
    { name: "HP-UX", riskLevel: 4, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Linux", maturity: 5 }] },
    { name: "Oracle Solaris", riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "illumos / OmniOS", maturity: 4 }, { name: "Linux", maturity: 5 }] },
    { name: "RHEL (Red Hat)", riskLevel: 2, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Rocky Linux", maturity: 5 }, { name: "AlmaLinux", maturity: 5 }] },
    { name: "SUSE Linux Enterprise", riskLevel: 2, lockIn: 3, hausse: 3.5, alternatives: [{ name: "openSUSE Leap", maturity: 5 }] },
    { name: "ChromeOS (flotte)", riskLevel: 2, lockIn: 3, hausse: 3.0, alternatives: [{ name: "Ubuntu + Firefox", maturity: 4 }] },
    { name: "iOS (flotte mobile)", riskLevel: 2, lockIn: 4, hausse: 2.0, alternatives: [{ name: "Android AOSP (LineageOS)", maturity: 3 }] },
    { name: "Android Enterprise (MDM)", riskLevel: 2, lockIn: 3, hausse: 2.5, alternatives: [{ name: "LineageOS + MDM open", maturity: 3 }] },
  ],
  office: [
    { name: "Microsoft 365", riskLevel: 4, lockIn: 4, hausse: 5.0, alternatives: [{ name: "LibreOffice", maturity: 5 }, { name: "OnlyOffice", maturity: 4 }, { name: "Collabora Online", maturity: 4 }] },
    { name: "Adobe Creative Suite (CC)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "GIMP + Inkscape + Krita", maturity: 4 }, { name: "Blender", maturity: 5 }] },
    { name: "Adobe Acrobat Pro", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "PDF Arranger + LibreOffice", maturity: 4 }] },
    { name: "Figma (design UI)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Penpot", maturity: 4 }] },
    { name: "Notion", riskLevel: 2, lockIn: 3, hausse: 4.0, alternatives: [{ name: "AppFlowy", maturity: 3 }, { name: "Outline", maturity: 4 }] },
    { name: "Confluence (Atlassian)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "BookStack", maturity: 4 }, { name: "Wiki.js", maturity: 4 }] },
    { name: "Miro (tableau blanc)", riskLevel: 2, lockIn: 2, hausse: 4.5, alternatives: [{ name: "Excalidraw", maturity: 4 }] },
    { name: "Monday.com", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "Taiga", maturity: 4 }, { name: "OpenProject", maturity: 4 }] },
    { name: "Asana", riskLevel: 2, lockIn: 2, hausse: 4.5, alternatives: [{ name: "Plane", maturity: 3 }, { name: "Taiga", maturity: 4 }] },
    { name: "Trello (Atlassian)", riskLevel: 1, lockIn: 2, hausse: 3.0, alternatives: [{ name: "Kanboard", maturity: 4 }, { name: "WeKan", maturity: 4 }] },
    { name: "Canva (design)", riskLevel: 1, lockIn: 1, hausse: 4.0, alternatives: [{ name: "Penpot", maturity: 4 }] },
    { name: "SharePoint (intranet)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Nextcloud + Collabora", maturity: 4 }, { name: "XWiki", maturity: 4 }] },
  ],
  email: [
    { name: "Microsoft Exchange / Outlook", riskLevel: 4, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Zimbra", maturity: 4 }, { name: "SOGo + Dovecot + Postfix", maturity: 4 }] },
    { name: "Microsoft Teams", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Mattermost", maturity: 5 }, { name: "Element (Matrix)", maturity: 4 }] },
    { name: "Gmail (Google)", riskLevel: 3, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Zimbra", maturity: 4 }, { name: "Mailu", maturity: 3 }] },
    { name: "Slack", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Mattermost", maturity: 5 }, { name: "Rocket.Chat", maturity: 4 }, { name: "Element (Matrix)", maturity: 4 }] },
    { name: "Zoom (visio)", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "Jitsi Meet", maturity: 5 }, { name: "BigBlueButton", maturity: 4 }] },
    { name: "Webex (Cisco)", riskLevel: 3, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Jitsi Meet", maturity: 5 }] },
    { name: "Google Meet", riskLevel: 2, lockIn: 2, hausse: 3.0, alternatives: [{ name: "Jitsi Meet", maturity: 5 }] },
    { name: "Proofpoint (email security)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Rspamd + ClamAV", maturity: 4 }] },
    { name: "Mimecast (email security)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Rspamd + SpamAssassin", maturity: 4 }] },
  ],
  cloud: [
    { name: "AWS (Amazon Web Services)", riskLevel: 4, lockIn: 4, hausse: 5.0, alternatives: [{ name: "OpenStack", maturity: 4 }, { name: "Scaleway / OVHcloud (EU)", maturity: 4 }] },
    { name: "Microsoft Azure", riskLevel: 4, lockIn: 4, hausse: 5.5, alternatives: [{ name: "OpenStack", maturity: 4 }, { name: "OVHcloud (EU)", maturity: 4 }] },
    { name: "Google Cloud Platform", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "OpenStack", maturity: 4 }, { name: "Scaleway (EU)", maturity: 4 }] },
    { name: "Oracle Cloud (OCI)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "OpenStack + Ceph", maturity: 4 }] },
    { name: "IBM Cloud", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "OpenStack", maturity: 4 }] },
    { name: "Alibaba Cloud", riskLevel: 4, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Scaleway / OVH (EU)", maturity: 4 }] },
    { name: "Vercel (PaaS frontend)", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Coolify (self-hosted)", maturity: 3 }, { name: "Netlify OSS", maturity: 3 }] },
    { name: "Heroku (Salesforce)", riskLevel: 2, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Dokku", maturity: 4 }, { name: "CapRover", maturity: 4 }] },
    { name: "Cloudflare (CDN/Workers)", riskLevel: 2, lockIn: 2, hausse: 3.0, alternatives: [{ name: "Traefik + Caddy", maturity: 4 }] },
    { name: "Akamai (CDN)", riskLevel: 2, lockIn: 2, hausse: 3.5, alternatives: [{ name: "Varnish + Caddy", maturity: 4 }] },
    { name: "OVHcloud (IaaS EU)", riskLevel: 2, lockIn: 2, hausse: 3.5, alternatives: [{ name: "Hetzner (EU)", maturity: 4 }, { name: "OpenStack on-prem", maturity: 4 }] },
    { name: "Scaleway (IaaS EU)", riskLevel: 2, lockIn: 2, hausse: 3.5, alternatives: [{ name: "Hetzner (EU)", maturity: 4 }] },
    { name: "NumSpot (cloud souverain FR)", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "OpenStack on-prem", maturity: 4 }] },
    { name: "Clever Cloud (PaaS EU)", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "Dokku / Coolify", maturity: 4 }] },
    { name: "CloudHealth (FinOps VMware)", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "OpenCost", maturity: 3 }, { name: "Kubecost", maturity: 4 }] },
    { name: "Spot.io (FinOps NetApp)", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Kubecost", maturity: 4 }] },
  ],
  db: [
    { name: "Oracle Database", riskLevel: 5, lockIn: 5, hausse: 8.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "MariaDB", maturity: 5 }] },
    { name: "Microsoft SQL Server", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "MariaDB", maturity: 5 }] },
    { name: "ADABAS (Software AG)", riskLevel: 5, lockIn: 5, hausse: 4.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "IDMS (Broadcom/CA)", riskLevel: 5, lockIn: 5, hausse: 5.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "Datacom (Broadcom/CA)", riskLevel: 5, lockIn: 5, hausse: 5.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "IBM VSAM (mainframe)", riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "MongoDB Atlas (cloud managed)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "MongoDB CE self-hosted", maturity: 5 }, { name: "FerretDB (PostgreSQL-compatible)", maturity: 3 }] },
    { name: "Amazon DynamoDB", riskLevel: 3, lockIn: 5, hausse: 4.0, alternatives: [{ name: "ScyllaDB", maturity: 4 }, { name: "Apache Cassandra", maturity: 4 }] },
    { name: "Amazon Aurora", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "PostgreSQL HA (Patroni)", maturity: 5 }] },
    { name: "Azure Cosmos DB", riskLevel: 3, lockIn: 5, hausse: 5.0, alternatives: [{ name: "ScyllaDB / Cassandra", maturity: 4 }] },
    { name: "Google BigQuery", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "ClickHouse", maturity: 5 }, { name: "Apache Druid", maturity: 4 }] },
    { name: "Teradata", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "ClickHouse", maturity: 5 }, { name: "Apache Druid", maturity: 4 }] },
    { name: "Redis Enterprise", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Valkey", maturity: 4 }, { name: "KeyDB", maturity: 4 }, { name: "DragonflyDB", maturity: 3 }] },
    { name: "Elasticsearch (Elastic Cloud)", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "OpenSearch", maturity: 5 }, { name: "Meilisearch", maturity: 4 }] },
  ],
  dev: [
    { name: "GitHub Enterprise", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "GitLab CE", maturity: 5 }, { name: "Gitea / Forgejo", maturity: 4 }] },
    { name: "GitLab Ultimate (SaaS)", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "GitLab CE self-hosted", maturity: 5 }] },
    { name: "Bitbucket (Atlassian)", riskLevel: 2, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Gitea / Forgejo", maturity: 4 }] },
    { name: "Azure DevOps", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "GitLab CE + Tekton", maturity: 4 }] },
    { name: "Jira (Atlassian)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Plane", maturity: 4 }, { name: "Taiga", maturity: 4 }, { name: "OpenProject", maturity: 4 }] },
    { name: "JetBrains IDE", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "VS Code (open source)", maturity: 5 }, { name: "Neovim", maturity: 4 }] },
    { name: "CircleCI", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "Woodpecker CI", maturity: 4 }, { name: "Drone CI", maturity: 4 }] },
    { name: "Terraform Cloud (HashiCorp)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "OpenTofu", maturity: 4 }, { name: "Pulumi (open core)", maturity: 4 }] },
    { name: "HashiCorp Vault (SaaS)", riskLevel: 2, lockIn: 3, hausse: 4.5, alternatives: [{ name: "OpenBao (fork OSS)", maturity: 3 }, { name: "Infisical", maturity: 3 }] },
    { name: "JFrog Artifactory", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Sonatype Nexus OSS", maturity: 5 }] },
    { name: "SonarQube (SaaS)", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "SonarQube CE", maturity: 5 }] },
    { name: "Snyk (SAST/SCA)", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "Trivy", maturity: 5 }, { name: "Grype + Syft (SBOM)", maturity: 4 }] },
    { name: "PagerDuty", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "Grafana OnCall", maturity: 4 }, { name: "Keep", maturity: 3 }] },
    { name: "LaunchDarkly (feature flags)", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "Unleash", maturity: 4 }, { name: "Flagsmith", maturity: 4 }] },
  ],
  security: [
    { name: "CrowdStrike Falcon (EDR)", riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "Wazuh", maturity: 4 }] },
    { name: "SentinelOne (EDR)", riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "Wazuh", maturity: 4 }] },
    { name: "Symantec / Norton", riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "ClamAV", maturity: 3 }, { name: "ESET (EU)", maturity: 4 }] },
    { name: "Microsoft Defender for Endpoint", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Wazuh", maturity: 4 }, { name: "ClamAV", maturity: 3 }] },
    { name: "Palo Alto (firewall)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "pfSense / OPNsense", maturity: 5 }] },
    { name: "Check Point (firewall)", riskLevel: 3, lockIn: 3, hausse: 4.5, alternatives: [{ name: "OPNsense", maturity: 5 }] },
    { name: "Splunk (SIEM)", riskLevel: 3, lockIn: 4, hausse: 8.0, alternatives: [{ name: "ELK Stack (Elastic)", maturity: 5 }, { name: "Graylog", maturity: 4 }] },
    { name: "QRadar (IBM SIEM)", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "Wazuh SIEM", maturity: 4 }, { name: "ELK Stack", maturity: 5 }] },
    { name: "Microsoft Sentinel (SIEM)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Wazuh SIEM", maturity: 4 }] },
    { name: "CyberArk (PAM)", riskLevel: 3, lockIn: 4, hausse: 5.5, alternatives: [{ name: "Teleport", maturity: 4 }, { name: "HashiCorp Boundary", maturity: 3 }] },
    { name: "Okta (IAM)", riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "Keycloak", maturity: 5 }, { name: "Authentik", maturity: 4 }] },
    { name: "Microsoft Entra ID (ex-Azure AD)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Keycloak", maturity: 5 }, { name: "FreeIPA", maturity: 4 }] },
    { name: "Thales HSM / CipherTrust", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "SoftHSM", maturity: 3 }, { name: "HashiCorp Vault", maturity: 4 }] },
    { name: "Qualys (scanner vulnérabilités)", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "OpenVAS (Greenbone)", maturity: 4 }] },
    { name: "Tenable Nessus (scanner)", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "OpenVAS (Greenbone)", maturity: 4 }] },
    { name: "Varonis (Data Security)", riskLevel: 3, lockIn: 3, hausse: 5.5, alternatives: [{ name: "Apache Ranger + Atlas", maturity: 3 }] },
    { name: "Cortex XSOAR (SOAR)", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "Shuffle SOAR", maturity: 3 }, { name: "TheHive + Cortex", maturity: 4 }] },
    { name: "Swimlane (SOAR)", riskLevel: 2, lockIn: 3, hausse: 5.5, alternatives: [{ name: "Shuffle SOAR", maturity: 3 }, { name: "TheHive", maturity: 4 }] },
  ],
  ai: [
    { name: "Microsoft 365 Copilot", riskLevel: 4, lockIn: 5, hausse: 6.0, alternatives: [{ name: "Continue.dev + Ollama/Mistral", maturity: 3 }, { name: "Open WebUI + Mistral", maturity: 3 }] },
    { name: "ChatGPT Enterprise (OpenAI)", riskLevel: 3, lockIn: 4, hausse: 7.0, alternatives: [{ name: "Mistral Le Chat (FR)", maturity: 4 }, { name: "Open WebUI + Llama/Mistral", maturity: 3 }] },
    { name: "ChatGPT Plus/Team (OpenAI)", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Mistral Le Chat", maturity: 4 }, { name: "Open WebUI + Ollama", maturity: 4 }] },
    { name: "GitHub Copilot", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Continue.dev + Ollama", maturity: 4 }, { name: "Tabby (self-hosted)", maturity: 3 }] },
    { name: "Google Gemini / Vertex AI", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Mistral AI (FR/EU)", maturity: 4 }, { name: "Hugging Face (open)", maturity: 5 }] },
    { name: "Anthropic Claude (API)", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "Mistral API (EU)", maturity: 4 }, { name: "Ollama local", maturity: 4 }] },
    { name: "Mistral AI (FR/EU)", riskLevel: 1, lockIn: 1, hausse: 3.5, alternatives: [{ name: "Mistral self-hosted (open-weights)", maturity: 5 }, { name: "vLLM + Mistral on-prem", maturity: 4 }] },
    { name: "DeepSeek (Chine)", riskLevel: 4, lockIn: 2, hausse: 4.0, alternatives: [{ name: "Mistral (EU)", maturity: 4 }, { name: "Ollama + DeepSeek local", maturity: 4 }] },
    { name: "AWS Bedrock (AI managé)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "vLLM self-hosted", maturity: 3 }, { name: "Ollama", maturity: 3 }] },
    { name: "Azure OpenAI Service", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "vLLM + Mistral on-prem", maturity: 3 }] },
    { name: "Dataiku (MLOps/AutoML)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "MLflow + Jupyter", maturity: 4 }, { name: "Apache Airflow + MLflow", maturity: 4 }] },
    { name: "H2O.ai (AutoML)", riskLevel: 2, lockIn: 2, hausse: 4.5, alternatives: [{ name: "H2O.ai OSS", maturity: 5 }, { name: "Auto-sklearn", maturity: 3 }] },
    { name: "Weights & Biases (MLOps)", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "MLflow", maturity: 5 }, { name: "ClearML", maturity: 4 }] },
    { name: "Scale AI (labeling)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Label Studio", maturity: 5 }, { name: "CVAT", maturity: 4 }] },
  ],
  rh: [
    { name: "Workday HCM", riskLevel: 4, lockIn: 5, hausse: 6.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }, { name: "Odoo RH", maturity: 4 }] },
    { name: "ADP (paie/RH)", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Odoo Paie", maturity: 4 }] },
    { name: "PayFit (paie FR)", riskLevel: 2, lockIn: 2, hausse: 5.0, alternatives: [{ name: "Odoo Paie", maturity: 4 }] },
    { name: "Silae (paie FR)", riskLevel: 2, lockIn: 3, hausse: 4.5, alternatives: [{ name: "Odoo Paie", maturity: 4 }] },
    { name: "Lucca (SIRH/congés)", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }] },
    { name: "Cornerstone OnDemand (LMS)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Moodle (LMS)", maturity: 5 }, { name: "ILIAS", maturity: 4 }] },
    { name: "Ceridian Dayforce", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "OrangeHRM + Odoo", maturity: 3 }] },
    { name: "SAP SuccessFactors (HCM)", riskLevel: 4, lockIn: 4, hausse: 5.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }, { name: "Odoo RH", maturity: 4 }] },
  ],
  virtualisation: [
    { name: "VMware vSphere / ESXi", riskLevel: 4, lockIn: 5, hausse: 8.0, alternatives: [{ name: "Proxmox VE", maturity: 5 }, { name: "oVirt / RHEV", maturity: 4 }] },
    { name: "VMware vSAN", riskLevel: 4, lockIn: 5, hausse: 8.0, alternatives: [{ name: "Ceph", maturity: 5 }, { name: "Proxmox + Ceph", maturity: 4 }] },
    { name: "VMware NSX", riskLevel: 4, lockIn: 5, hausse: 7.0, alternatives: [{ name: "Open vSwitch + Cilium", maturity: 4 }] },
    { name: "VMware Horizon (VDI)", riskLevel: 3, lockIn: 4, hausse: 7.0, alternatives: [{ name: "Apache Guacamole", maturity: 4 }] },
    { name: "Citrix Virtual Apps & Desktops", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "Apache Guacamole", maturity: 4 }, { name: "FreeRDP", maturity: 3 }] },
    { name: "Nutanix (HCI)", riskLevel: 3, lockIn: 4, hausse: 5.5, alternatives: [{ name: "Proxmox + Ceph", maturity: 4 }] },
    { name: "Microsoft Hyper-V", riskLevel: 3, lockIn: 3, hausse: 3.0, alternatives: [{ name: "Proxmox VE", maturity: 5 }, { name: "KVM/QEMU", maturity: 5 }] },
    { name: "Red Hat OpenShift", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Kubernetes (kubeadm)", maturity: 5 }, { name: "K3s", maturity: 4 }] },
    { name: "Docker Desktop (licence payante)", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "Podman", maturity: 5 }, { name: "Rancher Desktop", maturity: 4 }] },
  ],
  network: [
    { name: "Cisco IOS / Catalyst", riskLevel: 4, lockIn: 5, hausse: 5.0, alternatives: [{ name: "Open Networking (Cumulus/SONiC)", maturity: 3 }] },
    { name: "Cisco Meraki (SD-WAN/WiFi)", riskLevel: 3, lockIn: 4, hausse: 5.5, alternatives: [{ name: "OpenWrt + WireGuard", maturity: 3 }] },
    { name: "Cisco ISE (NAC)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "PacketFence", maturity: 4 }] },
    { name: "F5 (ADC/Load Balancer)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "HAProxy", maturity: 5 }, { name: "Envoy Proxy", maturity: 5 }] },
    { name: "Fortinet FortiGate (firewall)", riskLevel: 3, lockIn: 3, hausse: 4.0, alternatives: [{ name: "OPNsense", maturity: 5 }, { name: "pfSense", maturity: 5 }] },
    { name: "Zscaler (Zero Trust cloud)", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "WireGuard + Headscale", maturity: 3 }] },
    { name: "Palo Alto Prisma (SASE)", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "WireGuard + Headscale", maturity: 3 }] },
    { name: "SolarWinds (monitoring réseau)", riskLevel: 3, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Zabbix", maturity: 5 }, { name: "LibreNMS", maturity: 4 }] },
    { name: "Datadog (APM/monitoring)", riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "Prometheus + Grafana", maturity: 5 }, { name: "SigNoz", maturity: 4 }] },
    { name: "Dynatrace (APM)", riskLevel: 3, lockIn: 3, hausse: 5.5, alternatives: [{ name: "Grafana + Tempo + Loki", maturity: 4 }] },
  ],
  grc: [
    { name: "ServiceNow GRC", riskLevel: 4, lockIn: 5, hausse: 6.0, alternatives: [{ name: "CISO Assistant (open source)", maturity: 3 }, { name: "Eramba", maturity: 4 }] },
    { name: "OneTrust (Privacy/GRC)", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "Eramba", maturity: 4 }, { name: "CISO Assistant", maturity: 3 }] },
    { name: "RSA Archer (GRC)", riskLevel: 4, lockIn: 5, hausse: 5.0, alternatives: [{ name: "Eramba", maturity: 4 }, { name: "OpenRMF", maturity: 3 }] },
    { name: "MetricStream (GRC)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Eramba", maturity: 4 }] },
    { name: "LogicGate (Risk Cloud)", riskLevel: 3, lockIn: 3, hausse: 5.5, alternatives: [{ name: "CISO Assistant", maturity: 3 }, { name: "Eramba", maturity: 4 }] },
    { name: "AuditBoard", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "CISO Assistant", maturity: 3 }, { name: "Eramba", maturity: 4 }] },
    { name: "Vanta (compliance automation)", riskLevel: 2, lockIn: 3, hausse: 6.0, alternatives: [{ name: "CISO Assistant", maturity: 3 }] },
    { name: "Drata (compliance)", riskLevel: 2, lockIn: 3, hausse: 5.5, alternatives: [{ name: "CISO Assistant", maturity: 3 }] },
    { name: "TeamMate (Wolters Kluwer)", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "CISO Assistant", maturity: 3 }] },
    { name: "Diligent (Board/GRC)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Eramba", maturity: 4 }] },
  ],
  data: [
    { name: "Tableau (Salesforce)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Apache Superset", maturity: 5 }, { name: "Metabase", maturity: 4 }] },
    { name: "Power BI (Microsoft)", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Apache Superset", maturity: 5 }, { name: "Redash", maturity: 4 }] },
    { name: "Qlik Sense", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Apache Superset", maturity: 5 }] },
    { name: "Looker (Google)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Metabase", maturity: 4 }, { name: "Lightdash", maturity: 3 }] },
    { name: "Databricks", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "Apache Spark + Jupyter", maturity: 5 }, { name: "dbt + DuckDB", maturity: 4 }] },
    { name: "Palantir Foundry", riskLevel: 4, lockIn: 5, hausse: 6.0, alternatives: [{ name: "Apache Spark + Superset", maturity: 4 }] },
    { name: "Alteryx (data prep)", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "KNIME", maturity: 4 }, { name: "dbt", maturity: 5 }] },
    { name: "Collibra (data catalog)", riskLevel: 3, lockIn: 4, hausse: 5.5, alternatives: [{ name: "Apache Atlas", maturity: 3 }, { name: "DataHub (LinkedIn OSS)", maturity: 4 }] },
    { name: "Informatica IDMC (data quality)", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "Great Expectations", maturity: 4 }, { name: "Soda Core", maturity: 3 }] },
    { name: "Fivetran (ELT managed)", riskLevel: 2, lockIn: 3, hausse: 5.5, alternatives: [{ name: "Airbyte", maturity: 4 }, { name: "Meltano", maturity: 3 }] },
    { name: "MicroStrategy", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "Apache Superset", maturity: 5 }] },
    { name: "Snowflake", riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "ClickHouse", maturity: 5 }, { name: "DuckDB", maturity: 4 }] },
  ],
  backup: [
    { name: "Veeam Backup & Replication", riskLevel: 3, lockIn: 3, hausse: 5.0, alternatives: [{ name: "BorgBackup + Borgmatic", maturity: 5 }, { name: "Restic", maturity: 4 }] },
    { name: "Commvault", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Bareos", maturity: 4 }, { name: "BorgBackup", maturity: 5 }] },
    { name: "Veritas NetBackup", riskLevel: 4, lockIn: 4, hausse: 4.0, alternatives: [{ name: "Bareos", maturity: 4 }, { name: "Amanda", maturity: 3 }] },
    { name: "Rubrik (cloud backup)", riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "Restic + MinIO", maturity: 4 }] },
    { name: "Cohesity DataProtect", riskLevel: 3, lockIn: 3, hausse: 5.5, alternatives: [{ name: "BorgBackup + MinIO", maturity: 4 }] },
    { name: "Zerto (DR/réplication)", riskLevel: 3, lockIn: 4, hausse: 5.5, alternatives: [{ name: "DRBD + Proxmox replication", maturity: 3 }] },
    { name: "Acronis Cyber Protect", riskLevel: 2, lockIn: 2, hausse: 4.0, alternatives: [{ name: "Restic + Rclone", maturity: 4 }] },
    { name: "Dell PowerProtect / Avamar", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Bareos", maturity: 4 }] },
    { name: "IBM Spectrum Protect (TSM)", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Bareos", maturity: 4 }, { name: "BorgBackup", maturity: 5 }] },
  ],
  iot: [
    { name: "Siemens MindSphere (IoT)", riskLevel: 4, lockIn: 5, hausse: 5.0, alternatives: [{ name: "Eclipse Kura", maturity: 3 }, { name: "ThingsBoard", maturity: 4 }] },
    { name: "Siemens WinCC (SCADA)", riskLevel: 5, lockIn: 5, hausse: 4.0, alternatives: [{ name: "FUXA (SCADA open source)", maturity: 3 }, { name: "ScadaBR", maturity: 3 }] },
    { name: "Schneider EcoStruxure", riskLevel: 4, lockIn: 5, hausse: 5.0, alternatives: [{ name: "Node-RED + MQTT", maturity: 4 }] },
    { name: "Honeywell Forge (IoT)", riskLevel: 4, lockIn: 4, hausse: 5.0, alternatives: [{ name: "ThingsBoard", maturity: 4 }] },
    { name: "PTC ThingWorx (IoT)", riskLevel: 3, lockIn: 4, hausse: 5.5, alternatives: [{ name: "Eclipse Kura + Kapua", maturity: 3 }] },
    { name: "Rockwell FactoryTalk", riskLevel: 4, lockIn: 5, hausse: 4.5, alternatives: [{ name: "OpenPLC + ScadaBR", maturity: 3 }] },
    { name: "GE Digital (Predix / Proficy)", riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Apache PLC4X + Grafana", maturity: 3 }] },
    { name: "AVEVA (ex-Wonderware)", riskLevel: 4, lockIn: 5, hausse: 5.0, alternatives: [{ name: "FUXA + Grafana", maturity: 3 }] },
    { name: "AWS IoT Core", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Eclipse Hono + Mosquitto", maturity: 4 }] },
    { name: "Azure IoT Hub", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Eclipse Hono", maturity: 4 }] },
  ],
  apimgmt: [
    { name: "Apigee (Google)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Kong OSS", maturity: 5 }, { name: "Tyk", maturity: 4 }] },
    { name: "Kong Enterprise", riskLevel: 2, lockIn: 3, hausse: 5.0, alternatives: [{ name: "Kong OSS", maturity: 5 }, { name: "APISIX", maturity: 4 }] },
    { name: "MuleSoft Anypoint (API mgmt)", riskLevel: 3, lockIn: 4, hausse: 6.0, alternatives: [{ name: "Kong OSS", maturity: 5 }, { name: "Gravitee", maturity: 4 }] },
    { name: "AWS API Gateway", riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Kong OSS", maturity: 5 }, { name: "KrakenD", maturity: 4 }] },
    { name: "Azure API Management", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Kong OSS", maturity: 5 }, { name: "Tyk", maturity: 4 }] },
    { name: "IBM API Connect", riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "Kong OSS", maturity: 5 }, { name: "WSO2 API Manager", maturity: 4 }] },
    { name: "Axway Amplify", riskLevel: 3, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Gravitee (EU)", maturity: 4 }, { name: "Tyk", maturity: 4 }] },
    { name: "Boomi (API/iPaaS)", riskLevel: 3, lockIn: 4, hausse: 5.0, alternatives: [{ name: "Apache Camel + Kong", maturity: 4 }] },
  ],
};

// ═══════ ARTICLES DE MIGRATION (liens réels) ═══════
const MIGRATION_ARTICLES: Record<string, { title: string; url: string }[]> = {
  legacy: [
    { title: "AWS Mainframe Modernization — Success Stories 2025", url: "https://aws.amazon.com/blogs/migration-and-modernization/aws-for-mainframe-modernization-reinvent-2025-refresher/" },
    { title: "Mainframe Tech Trends 2024 : Linux, Open Source, DevOps", url: "https://www.precisely.com/blog/mainframe/mainframe-technology-trends-for-2024" },
  ],
  cobol: [
    { title: "Mainframe Modernization, Migrations — Planet Mainframe", url: "https://planetmainframe.com/2024/02/mainframe-modernization-migrations-and-more/" },
    { title: "Texas A&M : modernisation mainframe réussie (Astadia)", url: "https://www.globenewswire.com/en/search/tag/mainframe%20modernization/load/more" },
  ],
  erp: [
    { title: "SAP to Odoo Migration — 65% d'économies (case study)", url: "https://bytesfuel.com/case-studies/logistics-sap-to-odoo" },
    { title: "Guide complet SAP vers Odoo — ECOSIRE 2026", url: "https://ecosire.com/blog/sap-to-odoo-migration-complete-guide" },
    { title: "SAP to ERPNext Migration Guide", url: "https://www.sigzen.com/blog/sap-to-erpnext-migration-guide/" },
  ],
  office: [
    { title: "Schleswig-Holstein : 30 000 PC de MS Office vers LibreOffice", url: "https://goodtech.info/allemagne-schleswig-holstein-libreoffice-linux-economies-microsoft/" },
    { title: "Danemark : migration MS Office → LibreOffice (souveraineté)", url: "https://www.linuxjournal.com/content/denmarks-strategic-leap-replacing-microsoft-office-365-libreoffice-digital-independence" },
    { title: "Armée autrichienne : 16 000 postes vers LibreOffice", url: "https://office-watch.com/2025/austria-military-libreoffice-migration/" },
  ],
  email: [
    { title: "Schleswig-Holstein : Exchange → Open-Xchange + Thunderbird", url: "https://web.developpez.com/actu/376716/Un-Etat-allemand-abandonne-Microsoft-Exchange-et-Outlook-au-nom-de-la-souverainete-numerique/" },
    { title: "EU : mouvement vers l'open source dans les administrations", url: "https://www.2-data.com/knowledge-hub/a-search-for-digital-sovereignty-eu-governments-shift-from-microsoft-to-linux-libreoffice" },
  ],
  virtualisation: [
    { title: "Migrer VMware → Proxmox : guide pratique post-Broadcom", url: "https://datacampus.fr/blog/migrer-vmware-vers-proxmox" },
    { title: "Migration VMware → Proxmox 9 : guide complet 2025 (PCI)", url: "https://www.performance-conseil-informatique.net/2025/09/03/migration-vmware-vers-proxmox-9/" },
    { title: "Proxmox en 2025 : du labo au standard entreprise", url: "https://actualitecloud.com/la-fuite-de-vmware-suscite-linteret-pour-proxmox-ve-la-nouvelle-reference-en-virtualisation-dentreprise/" },
    { title: "Guide CIO : réussir la migration vers Proxmox", url: "https://www.cio-online.com/actualites/publi-info/guide-pratique-reussir-la-migration-vers-proxmox-de-son-si-et-de-ses-infrastructures-it-1103.html" },
  ],
  db: [
    { title: "Apollo Hospitals : 25 ans d'Oracle vers PostgreSQL en 18 mois", url: "https://itnext.io/how-apollo-hospitals-migrated-25-years-of-oracle-to-postgresql-on-azure-in-18-months-224a314f8eba" },
    { title: "Migration 10 TB Oracle → PostgreSQL : 80% d'économies", url: "https://www.optisolbusiness.com/insight/how-we-migrated-10tb-from-oracle-to-postgresql-without-breaking-the-business" },
    { title: "Oracle → PostgreSQL : 75% de réduction TCO (case study)", url: "https://www.datapatroltech.com/blog/oracle-postgresql-migration-cost-savings" },
    { title: "Case study : Oracle 19c vers PostgreSQL 16 avec Ora2Pg", url: "https://medium.com/@datapatrolt/case-study-migrating-from-oracle-19c-to-postgresql-16-using-ora2pg-a0ef2dde81cc" },
  ],
  os: [
    { title: "Schleswig-Holstein : Windows → Linux sur 30 000 PC", url: "https://eagleeyet.net/blog/it-news/german-state-schleswig-holstein-ditches-microsoft-for-open-source-software-in-2025/" },
    { title: "Comment un Land allemand est passé de Microsoft à l'open source", url: "https://licenseware.io/from-microsoft-to-open-source-how-one-german-state-is-rewriting-the-rules-of-public-sector-it/" },
  ],
  cloud: [
    { title: "FinOps open source : OpenCost vs outils propriétaires", url: "https://www.finops.org/" },
  ],
  security: [
    { title: "Wazuh : alternative SIEM/XDR open source pour entreprises", url: "https://wazuh.com/platform/overview/" },
  ],
  ai: [
    { title: "Ollama : déployer des LLM en local (alternative cloud AI)", url: "https://ollama.com/" },
    { title: "MLflow : plateforme MLOps open source (alternative Dataiku)", url: "https://mlflow.org/" },
  ],
};

const riskColor = (l: number) => l <= 2 ? "#2d6a4f" : l <= 3 ? "#b8860b" : "#c1121f";
const lockColor = (l: number) => l <= 2 ? "#2d6a4f" : l <= 3 ? "#b8860b" : l <= 4 ? "#e07b00" : "#c1121f";

export default function LibreAudit() {
  const [page, setPage] = useState<"landing" | "setup" | "audit" | "results">("landing");
  const [orgName, setOrgName] = useState("");
  const [userCount, setUserCount] = useState(100);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [satComment, setSatComment] = useState("");
  const [satSent, setSatSent] = useState(false);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);

  const toggle = useCallback((name: string) => {
    setSelected(prev => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const selectedProducts = Object.entries(selected).filter(([, v]) => v).map(([k]) => {
    for (const cat of Object.values(PROPRIETARY_DB)) {
      const found = cat.find((p: any) => p.name === k);
      if (found) return found;
    }
    return null;
  }).filter(Boolean);

  const avgRisk = selectedProducts.length ? selectedProducts.reduce((s: number, p: any) => s + p.riskLevel, 0) / selectedProducts.length : 0;
  const avgLock = selectedProducts.length ? selectedProducts.reduce((s: number, p: any) => s + p.lockIn, 0) / selectedProducts.length : 0;
  const score = Math.round(Math.min(100, (avgRisk * 10 + avgLock * 10)));
  const avgHausse = selectedProducts.length ? Math.round(selectedProducts.reduce((s: number, p: any) => s + (p.hausse || 3), 0) / selectedProducts.length * 10) / 10 : 0;

  const vendorDep: Record<string, { count: number; risk: number; hausse: number }> = {};
  selectedProducts.forEach((p: any) => {
    const vendor = p.name.split("(")[0].split("/")[0].trim();
    if (!vendorDep[vendor]) vendorDep[vendor] = { count: 0, risk: 0, hausse: 0 };
    vendorDep[vendor].count++;
    vendorDep[vendor].risk = Math.max(vendorDep[vendor].risk, p.riskLevel);
    vendorDep[vendor].hausse = Math.max(vendorDep[vendor].hausse, p.hausse || 3);
  });

  // ─── LANDING PAGE ───
  if (page === "landing") return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'DM Sans', sans-serif", color: "#1a2744" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap');`}</style>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: "1px solid #e8e0d4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "#1a2744", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>LA</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20 }}>LibreAudit</span>
        </div>
      </header>
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, lineHeight: 1.2, marginBottom: 24 }}>
          Mesurez votre dépendance aux <em>logiciels propriétaires</em>
        </h1>
        <p style={{ fontSize: 18, color: "#5a6b80", maxWidth: 600, margin: "0 auto 40px", lineHeight: 1.6 }}>
          Diagnostic gratuit en 5 minutes. Identifiez les risques de lock-in, estimez les coûts cachés et découvrez les alternatives open source pour votre organisation.
        </p>
        <button onClick={() => setPage("setup")} style={{ background: "#4361ee", color: "#fff", border: "none", padding: "16px 48px", borderRadius: 8, fontSize: 18, fontWeight: 600, cursor: "pointer" }}>
          Lancer l'audit →
        </button>
        <div style={{ marginTop: 60, display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          {[["300+", "produits analysés"], ["23", "catégories"], ["600+", "alternatives OSS"], ["5 min", "pour un diagnostic"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#4361ee" }}>{n}</div>
              <div style={{ fontSize: 13, color: "#5a6b80", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  // ─── SETUP PAGE ───
  if (page === "setup") return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'DM Sans', sans-serif", color: "#1a2744" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap');`}</style>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "80px 20px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, marginBottom: 32, textAlign: "center" }}>Paramètres de l'audit</h2>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Nom de l'organisation</label>
        <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="ex : Mutuelle du Soleil" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #d4cec4", fontSize: 16, marginBottom: 24, background: "#fff", boxSizing: "border-box" }} />
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Nombre d'utilisateurs IT</label>
        <input type="number" value={userCount} onChange={e => setUserCount(Number(e.target.value))} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #d4cec4", fontSize: 16, marginBottom: 32, background: "#fff", boxSizing: "border-box" }} />
        <button onClick={() => setPage("audit")} style={{ width: "100%", background: "#4361ee", color: "#fff", border: "none", padding: "14px", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
          Commencer le diagnostic →
        </button>
      </div>
    </div>
  );

  // ─── AUDIT PAGE ───
  if (page === "audit") return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'DM Sans', sans-serif", color: "#1a2744" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap');`}</style>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, margin: 0 }}>Sélectionnez vos logiciels</h2>
          <button onClick={() => setPage("results")} disabled={selectedProducts.length === 0} style={{ background: selectedProducts.length ? "#4361ee" : "#ccc", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: selectedProducts.length ? "pointer" : "default" }}>
            Voir les résultats ({selectedProducts.length}) →
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ padding: "8px 14px", borderRadius: 20, border: activeCat === cat.id ? "2px solid #4361ee" : "1px solid #d4cec4", background: activeCat === cat.id ? "#eef0ff" : "#fff", fontSize: 13, cursor: "pointer", fontWeight: activeCat === cat.id ? 600 : 400, color: "#1a2744" }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {(PROPRIETARY_DB[activeCat] || []).map((p: any) => (
            <div key={p.name} onClick={() => toggle(p.name)} style={{ padding: 16, borderRadius: 10, border: selected[p.name] ? "2px solid #4361ee" : "1px solid #e8e0d4", background: selected[p.name] ? "#f0f2ff" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{p.name}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                <span>Risque: <b style={{ color: riskColor(p.riskLevel) }}>{p.riskLevel}/5</b></span>
                <span>Lock-in: <b style={{ color: lockColor(p.lockIn) }}>{p.lockIn}/5</b></span>
                {p.hausse && <span style={{ color: "#c1121f", fontWeight: 600 }}>+{p.hausse}%/an</span>}
              </div>
              {p.alternatives && <div style={{ marginTop: 8, fontSize: 11, color: "#2d6a4f" }}>{p.alternatives.map((a: any) => a.name).join(" · ")}</div>}
            </div>
          ))}
        </div>

        {/* Articles de migration pour la catégorie active */}
        {MIGRATION_ARTICLES[activeCat] && (
          <div style={{ marginTop: 24, padding: 16, background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a2744", marginBottom: 10 }}>📰 Retours d'expérience & guides de migration</div>
            {MIGRATION_ARTICLES[activeCat].map((article) => (
              <a key={article.url} href={article.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "8px 0", fontSize: 13, color: "#4361ee", textDecoration: "none", borderBottom: "1px solid #f0ebe3" }}>
                → {article.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ─── RESULTS PAGE ───
  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'DM Sans', sans-serif", color: "#1a2744" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display:ital,wght@0,400;1,400&display=swap');`}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, textAlign: "center", marginBottom: 8 }}>
          Résultats de l'audit{orgName ? ` — ${orgName}` : ""}
        </h2>
        <p style={{ textAlign: "center", color: "#5a6b80", marginBottom: 32 }}>{selectedProducts.length} produits analysés · {userCount} utilisateurs</p>

        {/* Score global */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Score de dépendance", value: `${score}/100`, color: riskColor(score > 60 ? 5 : score > 30 ? 3 : 1) },
            { label: "Hausse tarifaire moy.", value: `+${avgHausse}%/an`, color: "#c1121f" },
            { label: "Risque moyen", value: `${avgRisk.toFixed(1)}/5`, color: riskColor(Math.round(avgRisk)) },
            { label: "Lock-in moyen", value: `${avgLock.toFixed(1)}/5`, color: lockColor(Math.round(avgLock)) },
          ].map(kpi => (
            <div key={kpi.label} style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10, padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#5a6b80", marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Dépendance éditeur */}
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 12 }}>Dépendance par éditeur</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 32 }}>
          {Object.entries(vendorDep).sort((a, b) => b[1].risk - a[1].risk).map(([vendor, data]) => (
            <div key={vendor} style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{vendor}</div>
              <div style={{ fontSize: 12, color: "#5a6b80" }}>{data.count} produit{data.count > 1 ? "s" : ""}</div>
              <div style={{ fontSize: 12, color: riskColor(data.risk), fontWeight: 500 }}>Risque max: {data.risk}/5</div>
              <div style={{ fontSize: 12, color: "#c1121f", fontWeight: 500 }}>Hausse max: +{data.hausse}%/an</div>
            </div>
          ))}
        </div>

        {/* Évolution tarifaire */}
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 12 }}>Évolution tarifaire par produit</h3>
        <div style={{ overflowX: "auto", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#fff", borderRadius: 8 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e8e0d4" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Produit</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Hausse/an</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Risque</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Lock-in</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Impact 5 ans</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.sort((a: any, b: any) => (b.hausse || 0) - (a.hausse || 0)).map((p: any) => {
                const impact5y = Math.round((Math.pow(1 + (p.hausse || 3) / 100, 5) - 1) * 100);
                return (
                  <tr key={p.name} style={{ borderBottom: "1px solid #f0ebe3" }}>
                    <td style={{ padding: "8px 12px", maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</td>
                    <td style={{ padding: "8px", textAlign: "center", color: "#c1121f", fontWeight: 600 }}>+{p.hausse || 3}%</td>
                    <td style={{ padding: "8px", textAlign: "center", color: riskColor(p.riskLevel) }}>{p.riskLevel}/5</td>
                    <td style={{ padding: "8px", textAlign: "center", color: lockColor(p.lockIn) }}>{p.lockIn}/5</td>
                    <td style={{ padding: "8px", textAlign: "center", color: "#c1121f", fontWeight: 600 }}>+{impact5y}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Alternatives */}
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 12 }}>Alternatives open source identifiées</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10, marginBottom: 32 }}>
          {selectedProducts.map((p: any) => (
            <div key={p.name} style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: "#c1121f" }}>{p.name}</div>
              {(p.alternatives || []).map((a: any) => (
                <div key={a.name} style={{ fontSize: 12, color: "#2d6a4f", marginBottom: 2 }}>
                  ✓ {a.name} <span style={{ color: "#5a6b80" }}>(maturité {a.maturity}/5)</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Ressources de migration */}
        {(() => {
          const allArticles: { title: string; url: string; cat: string }[] = [];
          const seenCats = new Set<string>();
          selectedProducts.forEach((p: any) => {
            for (const [catId, prods] of Object.entries(PROPRIETARY_DB)) {
              if ((prods as any[]).some((pp: any) => pp.name === p.name) && !seenCats.has(catId) && MIGRATION_ARTICLES[catId]) {
                seenCats.add(catId);
                MIGRATION_ARTICLES[catId].forEach((a) => allArticles.push({ ...a, cat: catId }));
              }
            }
          });
          if (allArticles.length === 0) return null;
          return (
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 12 }}>📰 Ressources de migration</h3>
              <div style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10, padding: 16 }}>
                <p style={{ fontSize: 13, color: "#5a6b80", marginBottom: 12 }}>Articles, guides et retours d'expérience pour les catégories de votre audit :</p>
                {allArticles.map((a) => (
                  <a key={a.url} href={a.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "8px 0", fontSize: 13, color: "#4361ee", textDecoration: "none", borderBottom: "1px solid #f0ebe3" }}>
                    → {a.title}
                  </a>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Email optionnel */}
        {!emailSent ? (
          <div style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 14, color: "#5a6b80", marginBottom: 12 }}>Recevez le rapport PDF complet par email (optionnel)</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: "1px solid #d4cec4", fontSize: 14, minWidth: 250 }} />
              <button onClick={() => { if (email) { console.log("[LEAD]", { email, orgName, score, products: selectedProducts.length }); setEmailSent(true); } }} style={{ background: "#4361ee", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Envoyer
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: "#eef7f0", border: "1px solid #b7dfbf", borderRadius: 10, padding: 20, textAlign: "center", marginBottom: 24, color: "#2d6a4f" }}>
            ✅ Merci ! Vous recevrez votre rapport à {email}
          </div>
        )}

        {/* Satisfaction */}
        {!satSent ? (
          <div style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: 10, padding: 24, textAlign: "center", marginBottom: 24 }}>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Votre satisfaction</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12 }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setSatisfaction(n)} style={{ width: 36, height: 36, borderRadius: 8, border: satisfaction === n ? "2px solid #4361ee" : "1px solid #d4cec4", background: satisfaction === n ? "#4361ee" : "#fff", color: satisfaction === n ? "#fff" : "#1a2744", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#5a6b80", maxWidth: 380, margin: "0 auto 12px" }}>
              <span>Pas satisfait</span><span>Très satisfait</span>
            </div>
            {satisfaction && (
              <>
                <textarea value={satComment} onChange={e => setSatComment(e.target.value)} placeholder="Un commentaire, une suggestion ? (optionnel)" style={{ width: "100%", maxWidth: 400, padding: 10, borderRadius: 8, border: "1px solid #d4cec4", fontSize: 13, minHeight: 60, resize: "vertical", boxSizing: "border-box" }} />
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => { console.log("[SATISFACTION]", { score: satisfaction, comment: satComment, auditScore: score, org: orgName }); setSatSent(true); }} style={{ background: "#4361ee", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                    Envoyer mon avis
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ background: "#eef7f0", border: "1px solid #b7dfbf", borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 24, color: "#2d6a4f" }}>
            🙏 Merci pour votre retour !
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <button onClick={() => { setPage("audit"); }} style={{ background: "transparent", border: "1px solid #d4cec4", padding: "10px 24px", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#5a6b80" }}>
            ← Modifier la sélection
          </button>
          <button onClick={() => { setPage("landing"); setSelected({}); setEmailSent(false); setSatSent(false); setSatisfaction(null); setSatComment(""); }} style={{ background: "transparent", border: "1px solid #d4cec4", padding: "10px 24px", borderRadius: 8, fontSize: 14, cursor: "pointer", color: "#5a6b80", marginLeft: 8 }}>
            Relancer un audit
          </button>
        </div>
      </div>
    </div>
  );
}
