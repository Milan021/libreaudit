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
];

const PROPRIETARY_DB: Record<string, any[]> = {
  legacy: [
    { name: "IBM z/OS (Mainframe)", costPerYear: 250000, riskLevel: 5, lockIn: 5, hausse: 4.5, alternatives: [{ name: "Linux on Z / KVM", maturity: 4 }, { name: "Cloud Foundry", maturity: 3 }] },
    { name: "IBM CICS", costPerYear: 120000, riskLevel: 5, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Jakarta EE / WildFly", maturity: 4 }, { name: "Spring Boot", maturity: 5 }] },
    { name: "IBM IMS (DB/TM)", costPerYear: 100000, riskLevel: 5, lockIn: 5, hausse: 3.5, alternatives: [{ name: "PostgreSQL + Message Broker", maturity: 4 }] },
    { name: "IBM DB2 for z/OS", costPerYear: 150000, riskLevel: 4, lockIn: 5, hausse: 4.2, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "CockroachDB", maturity: 4 }] },
    { name: "Rocket Software (UniVerse/UniData/D3)", costPerYear: 80000, riskLevel: 5, lockIn: 5, hausse: 5.0, alternatives: [{ name: "PostgreSQL + jBASE (open)", maturity: 3 }, { name: "MongoDB", maturity: 4 }] },
    { name: "Unisys ClearPath", costPerYear: 200000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Linux clusters", maturity: 4 }] },
    { name: "Bull/Atos GCOS", costPerYear: 150000, riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Linux + containers", maturity: 4 }] },
    { name: "HP NonStop (Tandem)", costPerYear: 180000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Linux HA clusters", maturity: 4 }] },
    { name: "OpenVMS (DEC/HP)", costPerYear: 50000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Linux + VMS Software Inc.", maturity: 3 }] },
  ],
  cobol: [
    { name: "COBOL (programmes métier)", costPerYear: 60000, riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Java / Spring Boot", maturity: 5 }, { name: "Python / FastAPI", maturity: 5 }] },
    { name: "Natural + ADABAS (Software AG)", costPerYear: 80000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "PostgreSQL + Java", maturity: 5 }] },
    { name: "MUMPS / Caché (InterSystems)", costPerYear: 70000, riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "PostgreSQL + Python", maturity: 4 }, { name: "YottaDB (open MUMPS)", maturity: 3 }] },
  ],
  middleware: [
    { name: "IBM WebSphere Application Server", costPerYear: 50000, riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "WildFly / JBoss", maturity: 5 }, { name: "Apache Tomcat", maturity: 5 }] },
    { name: "Oracle WebLogic", costPerYear: 60000, riskLevel: 4, lockIn: 4, hausse: 4.0, alternatives: [{ name: "WildFly", maturity: 5 }, { name: "Quarkus", maturity: 4 }] },
    { name: "IBM MQ (WebSphere MQ)", costPerYear: 40000, riskLevel: 3, lockIn: 4, hausse: 3.0, alternatives: [{ name: "RabbitMQ", maturity: 5 }, { name: "Apache Kafka", maturity: 5 }] },
    { name: "TIBCO (EMS, BW, Rendezvous)", costPerYear: 80000, riskLevel: 4, lockIn: 4, hausse: 3.5, alternatives: [{ name: "Apache Kafka", maturity: 5 }, { name: "Apache Camel", maturity: 4 }] },
    { name: "Informatica PowerCenter (ETL)", costPerYear: 70000, riskLevel: 4, lockIn: 4, hausse: 3.5, alternatives: [{ name: "Apache Airflow + dbt", maturity: 5 }, { name: "Talend Open Studio", maturity: 4 }] },
    { name: "MicroFocus Enterprise Server", costPerYear: 60000, riskLevel: 4, lockIn: 4, hausse: 3.5, alternatives: [{ name: "GnuCOBOL + Linux", maturity: 3 }] },
    { name: "Tuxedo (Oracle)", costPerYear: 50000, riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "gRPC + Kubernetes", maturity: 4 }] },
  ],
  erp: [
    { name: "SAP ERP / S/4HANA", costPerYear: 200000, riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Odoo Community", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Oracle E-Business Suite", costPerYear: 150000, riskLevel: 5, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Odoo", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Oracle JD Edwards", costPerYear: 100000, riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "ERPNext", maturity: 4 }] },
    { name: "Oracle PeopleSoft", costPerYear: 120000, riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Odoo RH", maturity: 4 }] },
    { name: "Oracle Siebel (CRM)", costPerYear: 100000, riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Odoo CRM", maturity: 4 }] },
    { name: "Salesforce (CRM)", costPerYear: 60000, riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Odoo CRM", maturity: 4 }] },
    { name: "ServiceNow", costPerYear: 80000, riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "GLPI", maturity: 4 }, { name: "Zammad", maturity: 3 }] },
    { name: "Microsoft Dynamics 365", costPerYear: 50000, riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Odoo Community", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Sage X3 / Sage 100", costPerYear: 15000, riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "Odoo Community", maturity: 4 }] },
    { name: "Sage Ligne 100 / 1000 (ancien)", costPerYear: 5000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "Odoo Community", maturity: 4 }] },
    { name: "Cegid (ERP / RH / Retail)", costPerYear: 15000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Odoo Community", maturity: 4 }, { name: "ERPNext", maturity: 4 }] },
    { name: "Efficy CRM", costPerYear: 10000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Odoo CRM", maturity: 4 }] },
    { name: "Temenos (banque)", costPerYear: 120000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Apache Fineract", maturity: 3 }, { name: "Mambu", maturity: 3 }] },
    { name: "Finastra (banque)", costPerYear: 90000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Apache Fineract", maturity: 3 }, { name: "Mambu (SaaS)", maturity: 3 }] },
  ],
  insurance: [
    { name: "Guidewire InsuranceSuite", costPerYear: 150000, riskLevel: 5, lockIn: 5, hausse: 3.5, alternatives: [{ name: "Socotra (cloud-native)", maturity: 3 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Duck Creek Technologies", costPerYear: 120000, riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Instanda (low-code)", maturity: 3 }] },
    { name: "Sapiens IDITSuite / CoreSuite", costPerYear: 130000, riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "EIS Group", maturity: 3 }, { name: "Socotra", maturity: 3 }] },
    { name: "Majesco (Policy, Billing, Claims)", costPerYear: 100000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "BriteCore", maturity: 3 }, { name: "Instanda", maturity: 3 }] },
    { name: "EIS Group (OneSuite)", costPerYear: 110000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Développement microservices", maturity: 5 }] },
    { name: "Prima Solutions (IARD / Santé / Prévoyance)", costPerYear: 80000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Développement sur mesure", maturity: 5 }, { name: "Odoo + modules custom", maturity: 2 }] },
    { name: "ALFA System (assurance vie / finance)", costPerYear: 80000, riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Apache Fineract + actuariel", maturity: 2 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "RGI (core insurance Europe)", costPerYear: 90000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Prima Solutions", maturity: 4 }, { name: "Socotra", maturity: 3 }] },
    { name: "Insurity (CloudChoice)", costPerYear: 95000, riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "BriteCore", maturity: 3 }, { name: "Socotra", maturity: 3 }] },
    { name: "OneShield (Policy, Claims, Billing)", costPerYear: 85000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Instanda", maturity: 3 }, { name: "BriteCore", maturity: 3 }] },
    { name: "Shift Technology (IA fraude / sinistres)", costPerYear: 60000, riskLevel: 3, lockIn: 3, hausse: 3.0, alternatives: [{ name: "FRISS (anti-fraude)", maturity: 4 }, { name: "ML interne (scikit-learn)", maturity: 4 }] },
    { name: "Acturis (courtage / distribution)", costPerYear: 40000, riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Applied Systems (Epic)", maturity: 4 }, { name: "CRM + sur mesure", maturity: 4 }] },
    { name: "Sofraco / DXC Insurance (legacy France)", costPerYear: 70000, riskLevel: 5, lockIn: 5, hausse: 2.0, alternatives: [{ name: "Prima Solutions", maturity: 4 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Instanda (low-code insurance)", costPerYear: 50000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "BriteCore", maturity: 3 }] },
    { name: "Cleva Insurance Solution (Nexpublica)", costPerYear: 90000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Wynsure (Wyde / CGI)", costPerYear: 100000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "Instanda", maturity: 3 }] },
    { name: "Orisha Insurance / Protect (ex-Cunae)", costPerYear: 60000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Socotra", maturity: 3 }, { name: "BriteCore", maturity: 3 }] },
    { name: "DXC Graphtalk AIA (ex-CSC)", costPerYear: 80000, riskLevel: 5, lockIn: 5, hausse: 2.0, alternatives: [{ name: "Cleva Insurance", maturity: 4 }, { name: "Wynsure", maturity: 4 }] },
    { name: "SOLIFE (VERMEG / ex-BSB)", costPerYear: 70000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "KELIA (KAPIA-RGI)", maturity: 4 }, { name: "Développement Java", maturity: 5 }] },
    { name: "KELIA (KAPIA-RGI)", costPerYear: 75000, riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "SOLIFE", maturity: 4 }, { name: "Développement sur mesure", maturity: 5 }] },
    { name: "Cegedim Assurances (BEYOND / Activ'Infinite)", costPerYear: 120000, riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "ASSIA plateforme santé", maturity: 3 }, { name: "Développement + tiers payant", maturity: 4 }] },
    { name: "ASSIA (plateforme santé assurance)", costPerYear: 50000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Cegedim BEYOND", maturity: 4 }, { name: "Développement sur mesure", maturity: 5 }] },
  ],
  finance: [
    { name: "Sage Comptabilité", costPerYear: 3000, riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr (compta)", maturity: 4 }, { name: "GnuCash", maturity: 3 }, { name: "Odoo Comptabilité", maturity: 4 }] },
    { name: "SAP Financial (FI/CO)", costPerYear: 40000, riskLevel: 5, lockIn: 5, hausse: 2.5, alternatives: [{ name: "Odoo Comptabilité", maturity: 4 }, { name: "ERPNext Finance", maturity: 4 }] },
    { name: "Oracle Financials Cloud", costPerYear: 30000, riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "Odoo Comptabilité", maturity: 4 }] },
    { name: "Cegid Finance", costPerYear: 10000, riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "Odoo", maturity: 4 }] },
    { name: "Quadratus (compta)", costPerYear: 5000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Dolibarr", maturity: 4 }] },
    { name: "Sopra Banking (finance)", costPerYear: 100000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Apache Fineract", maturity: 3 }] },
    { name: "Murex (trading / risques)", costPerYear: 200000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "QuantLib + Python", maturity: 3 }] },
    { name: "Calypso (post-trade)", costPerYear: 150000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "OpenGamma", maturity: 3 }] },
    { name: "SAS (analytics financier)", costPerYear: 50000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "R + Python (pandas/scikit)", maturity: 5 }, { name: "Apache Spark", maturity: 5 }] },
  ],
  editique: [
    { name: "SEFAS (éditique)", costPerYear: 40000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Apache FOP", maturity: 3 }, { name: "Docmosis", maturity: 3 }] },
    { name: "OpenText Exstream", costPerYear: 60000, riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Apache FOP + XSL-FO", maturity: 3 }] },
    { name: "Quadient / GMC Inspire", costPerYear: 50000, riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Apache FOP", maturity: 3 }, { name: "LibreOffice scripting", maturity: 3 }] },
    { name: "Compart DocBridge", costPerYear: 40000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Apache PDFBox + FOP", maturity: 4 }] },
    { name: "ISIS Papyrus", costPerYear: 50000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Alfresco + Apache FOP", maturity: 3 }] },
    { name: "OpenText Content Suite (GED)", costPerYear: 60000, riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "Hyland OnBase (GED)", costPerYear: 50000, riskLevel: 4, lockIn: 4, hausse: 3.0, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "DocuSign", costPerYear: 15000, riskLevel: 2, lockIn: 2, hausse: 3.0, alternatives: [{ name: "Yousign (FR)", maturity: 4 }, { name: "Open-source: LibreSign", maturity: 2 }] },
    { name: "M-Files", costPerYear: 20000, riskLevel: 3, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "BDOC Suite (Nexpublica / ex-Inetum)", costPerYear: 35000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Apache FOP + XSL-FO", maturity: 4 }, { name: "Docmosis", maturity: 3 }] },
    { name: "BDU — Business Document Unity (Nexpublica)", costPerYear: 45000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Alfresco (GED open source)", maturity: 4 }, { name: "Nuxeo (GED/ECM)", maturity: 4 }] },
  ],
  os: [
    { name: "Microsoft Windows (postes)", costPerYear: 15000, riskLevel: 2, lockIn: 3, hausse: 4.0, alternatives: [{ name: "Ubuntu Desktop", maturity: 5 }, { name: "Fedora", maturity: 4 }] },
    { name: "Windows Server", costPerYear: 25000, riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "Ubuntu Server / RHEL", maturity: 5 }, { name: "Debian", maturity: 5 }] },
    { name: "IBM i (AS/400)", costPerYear: 80000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Linux + PostgreSQL", maturity: 4 }] },
    { name: "IBM AIX (Unix IBM)", costPerYear: 60000, riskLevel: 4, lockIn: 5, hausse: 3.0, alternatives: [{ name: "Linux (RHEL / Ubuntu)", maturity: 5 }] },
    { name: "HP-UX", costPerYear: 40000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Linux", maturity: 5 }] },
    { name: "Oracle Solaris", costPerYear: 30000, riskLevel: 4, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Linux / illumos", maturity: 5 }] },
  ],
  office: [
    { name: "Microsoft 365", costPerYear: 20000, riskLevel: 2, lockIn: 3, hausse: 4.5, alternatives: [{ name: "LibreOffice", maturity: 5 }, { name: "Collabora Online", maturity: 4 }] },
    { name: "Adobe Creative Suite", costPerYear: 15000, riskLevel: 2, lockIn: 3, hausse: 3.0, alternatives: [{ name: "GIMP / Inkscape / Kdenlive", maturity: 4 }] },
  ],
  email: [
    { name: "Microsoft Exchange", costPerYear: 15000, riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Zimbra", maturity: 4 }, { name: "Postfix + Dovecot", maturity: 5 }] },
    { name: "Microsoft Teams", costPerYear: 10000, riskLevel: 2, lockIn: 3, hausse: 4.5, alternatives: [{ name: "Mattermost", maturity: 4 }, { name: "Rocket.Chat", maturity: 4 }] },
    { name: "Google Workspace", costPerYear: 12000, riskLevel: 2, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Nextcloud + Collabora", maturity: 4 }] },
    { name: "Slack", costPerYear: 8000, riskLevel: 2, lockIn: 2, hausse: 2.5, alternatives: [{ name: "Mattermost", maturity: 4 }, { name: "Rocket.Chat", maturity: 4 }] },
  ],
  cloud: [
    { name: "AWS", costPerYear: 100000, riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "OpenStack", maturity: 4 }, { name: "Scaleway / OVH", maturity: 4 }] },
    { name: "Microsoft Azure", costPerYear: 80000, riskLevel: 3, lockIn: 4, hausse: 4.0, alternatives: [{ name: "OpenStack", maturity: 4 }, { name: "Scaleway / OVH", maturity: 4 }] },
    { name: "Google Cloud", costPerYear: 60000, riskLevel: 3, lockIn: 3, hausse: 2.0, alternatives: [{ name: "OpenStack", maturity: 4 }, { name: "Scaleway / OVH", maturity: 4 }] },
  ],
  db: [
    { name: "Oracle Database", costPerYear: 100000, riskLevel: 4, lockIn: 5, hausse: 4.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "MariaDB", maturity: 5 }] },
    { name: "Microsoft SQL Server", costPerYear: 30000, riskLevel: 3, lockIn: 4, hausse: 3.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "MariaDB", maturity: 5 }] },
    { name: "ADABAS (Software AG)", costPerYear: 80000, riskLevel: 5, lockIn: 5, hausse: 3.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "IDMS (Broadcom/CA)", costPerYear: 60000, riskLevel: 5, lockIn: 5, hausse: 5.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "Datacom (Broadcom/CA)", costPerYear: 50000, riskLevel: 5, lockIn: 5, hausse: 5.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
  ],
  dev: [
    { name: "Jira (Atlassian)", costPerYear: 10000, riskLevel: 2, lockIn: 3, hausse: 3.0, alternatives: [{ name: "GitLab Issues", maturity: 5 }, { name: "Plane.so", maturity: 3 }] },
    { name: "GitHub (Microsoft)", costPerYear: 5000, riskLevel: 2, lockIn: 2, hausse: 2.0, alternatives: [{ name: "GitLab CE", maturity: 5 }, { name: "Gitea", maturity: 4 }] },
    { name: "JetBrains IDE", costPerYear: 3000, riskLevel: 2, lockIn: 2, hausse: 2.5, alternatives: [{ name: "VS Code (open-source build)", maturity: 5 }, { name: "Neovim", maturity: 4 }] },
  ],
  security: [
    { name: "Symantec / Norton", costPerYear: 10000, riskLevel: 3, lockIn: 3, hausse: 6.0, alternatives: [{ name: "ClamAV", maturity: 3 }, { name: "ESET (EU)", maturity: 4 }] },
    { name: "Cisco / Palo Alto (firewall)", costPerYear: 30000, riskLevel: 3, lockIn: 3, hausse: 3.5, alternatives: [{ name: "pfSense / OPNsense", maturity: 4 }, { name: "Suricata (IDS)", maturity: 4 }] },
  ],
  ai: [
    { name: "OpenAI (ChatGPT / GPT-4)", costPerYear: 24000, riskLevel: 3, lockIn: 3, hausse: 3.0, alternatives: [{ name: "Mistral AI (FR/EU)", maturity: 4 }, { name: "LLaMA (Meta, self-hosted)", maturity: 4 }] },
    { name: "Google Gemini / Vertex AI", costPerYear: 20000, riskLevel: 3, lockIn: 4, hausse: 2.5, alternatives: [{ name: "Mistral AI (FR/EU)", maturity: 4 }, { name: "Hugging Face (open)", maturity: 5 }] },
    { name: "Microsoft Copilot (365 / Azure)", costPerYear: 30000, riskLevel: 3, lockIn: 4, hausse: 4.5, alternatives: [{ name: "Mistral AI (FR/EU)", maturity: 4 }, { name: "Ollama (local)", maturity: 3 }] },
    { name: "Anthropic Claude", costPerYear: 20000, riskLevel: 3, lockIn: 2, hausse: 2.5, alternatives: [{ name: "Mistral AI (FR/EU)", maturity: 4 }, { name: "LLaMA self-hosted", maturity: 4 }] },
    { name: "Kimi (Moonshot AI — Chine)", costPerYear: 12000, riskLevel: 4, lockIn: 3, hausse: 2.5, alternatives: [{ name: "Mistral AI (FR/EU)", maturity: 4 }, { name: "Qwen open (Alibaba)", maturity: 4 }] },
    { name: "Mistral AI (FR/EU)", costPerYear: 15000, riskLevel: 2, lockIn: 2, hausse: 2.0, alternatives: [{ name: "LLaMA self-hosted", maturity: 4 }, { name: "Hugging Face (open)", maturity: 5 }] },
  ],
};

const VENDOR_RATES: Record<string, number> = {
  "IBM z/OS (Mainframe)": 0.08, "IBM CICS": 0.08, "IBM IMS (DB/TM)": 0.08, "IBM DB2 for z/OS": 0.08,
  "Rocket Software (UniVerse/UniData/D3)": 0.10, "Unisys ClearPath": 0.06, "Bull/Atos GCOS": 0.05,
  "HP NonStop (Tandem)": 0.06, "OpenVMS (DEC/HP)": 0.05,
  "COBOL (programmes métier)": 0.05, "Natural + ADABAS (Software AG)": 0.06, "MUMPS / Caché (InterSystems)": 0.06,
  "IBM WebSphere Application Server": 0.06, "Oracle WebLogic": 0.08, "IBM MQ (WebSphere MQ)": 0.06,
  "TIBCO (EMS, BW, Rendezvous)": 0.07, "Informatica PowerCenter (ETL)": 0.07,
  "MicroFocus Enterprise Server": 0.07, "Tuxedo (Oracle)": 0.08,
  "SAP ERP / S/4HANA": 0.05, "Oracle E-Business Suite": 0.08, "Oracle JD Edwards": 0.08,
  "Oracle PeopleSoft": 0.08, "Oracle Siebel (CRM)": 0.08, "Salesforce (CRM)": 0.08,
  "ServiceNow": 0.08, "Microsoft Dynamics 365": 0.09, "Sage X3 / Sage 100": 0.05,
  "Sage Ligne 100 / 1000 (ancien)": 0.05, "Cegid (ERP / RH / Retail)": 0.05, "Efficy CRM": 0.05,
  "Temenos (banque)": 0.06, "Finastra (banque)": 0.06,
  "Guidewire InsuranceSuite": 0.07, "Duck Creek Technologies": 0.06, "Sapiens IDITSuite / CoreSuite": 0.06,
  "Majesco (Policy, Billing, Claims)": 0.05, "EIS Group (OneSuite)": 0.05,
  "Prima Solutions (IARD / Santé / Prévoyance)": 0.05, "ALFA System (assurance vie / finance)": 0.05,
  "RGI (core insurance Europe)": 0.05, "Insurity (CloudChoice)": 0.06,
  "OneShield (Policy, Claims, Billing)": 0.05, "Shift Technology (IA fraude / sinistres)": 0.06,
  "Acturis (courtage / distribution)": 0.05, "Sofraco / DXC Insurance (legacy France)": 0.04,
  "Instanda (low-code insurance)": 0.05, "Cleva Insurance Solution (Nexpublica)": 0.05,
  "Wynsure (Wyde / CGI)": 0.05, "Orisha Insurance / Protect (ex-Cunae)": 0.05,
  "DXC Graphtalk AIA (ex-CSC)": 0.04, "SOLIFE (VERMEG / ex-BSB)": 0.05,
  "KELIA (KAPIA-RGI)": 0.05, "Cegedim Assurances (BEYOND / Activ'Infinite)": 0.06,
  "ASSIA (plateforme santé assurance)": 0.05,
  "Sage Comptabilité": 0.05, "SAP Financial (FI/CO)": 0.05, "Oracle Financials Cloud": 0.08,
  "Cegid Finance": 0.05, "Quadratus (compta)": 0.05, "Sopra Banking (finance)": 0.06,
  "Murex (trading / risques)": 0.06, "Calypso (post-trade)": 0.06, "SAS (analytics financier)": 0.05,
  "SEFAS (éditique)": 0.05, "OpenText Exstream": 0.06, "Quadient / GMC Inspire": 0.06,
  "Compart DocBridge": 0.05, "ISIS Papyrus": 0.05, "OpenText Content Suite (GED)": 0.06,
  "Hyland OnBase (GED)": 0.06, "DocuSign": 0.05, "M-Files": 0.05,
  "BDOC Suite (Nexpublica / ex-Inetum)": 0.05, "BDU — Business Document Unity (Nexpublica)": 0.05,
  "Microsoft Windows (postes)": 0.08, "Windows Server": 0.08, "IBM i (AS/400)": 0.06,
  "IBM AIX (Unix IBM)": 0.06, "HP-UX": 0.05, "Oracle Solaris": 0.05,
  "Microsoft 365": 0.09, "Adobe Creative Suite": 0.06,
  "Microsoft Exchange": 0.09, "Microsoft Teams": 0.09, "Google Workspace": 0.05, "Slack": 0.05,
  "AWS": 0.05, "Microsoft Azure": 0.08, "Google Cloud": 0.04,
  "Oracle Database": 0.08, "Microsoft SQL Server": 0.06, "ADABAS (Software AG)": 0.06,
  "IDMS (Broadcom/CA)": 0.10, "Datacom (Broadcom/CA)": 0.10,
  "Jira (Atlassian)": 0.06, "GitHub (Microsoft)": 0.04, "JetBrains IDE": 0.05,
  "Symantec / Norton": 0.12, "Cisco / Palo Alto (firewall)": 0.07,
  "OpenAI (ChatGPT / GPT-4)": 0.05, "Google Gemini / Vertex AI": 0.05,
  "Microsoft Copilot (365 / Azure)": 0.08, "Anthropic Claude": 0.04,
  "Kimi (Moonshot AI — Chine)": 0.05, "Mistral AI (FR/EU)": 0.03,
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

  const totalCost = selectedProducts.reduce((s: number, p: any) => s + (p.costPerYear || 0), 0);
  const avgRisk = selectedProducts.length ? selectedProducts.reduce((s: number, p: any) => s + p.riskLevel, 0) / selectedProducts.length : 0;
  const avgLock = selectedProducts.length ? selectedProducts.reduce((s: number, p: any) => s + p.lockIn, 0) / selectedProducts.length : 0;
  const score = Math.round(Math.min(100, (avgRisk * 10 + avgLock * 10)));

  const projection5y = selectedProducts.map((p: any) => {
    const rate = VENDOR_RATES[p.name] || 0.05;
    const costs = [p.costPerYear || 0];
    for (let i = 1; i <= 5; i++) costs.push(Math.round(costs[i - 1] * (1 + rate)));
    return { name: p.name, costs, rate };
  });
  const total5y = projection5y.reduce((s, p) => s + p.costs.reduce((a: number, b: number) => a + b, 0), 0);

  const vendorDep: Record<string, { count: number; cost: number; risk: number }> = {};
  selectedProducts.forEach((p: any) => {
    const vendor = p.name.split("(")[0].split("/")[0].trim();
    if (!vendorDep[vendor]) vendorDep[vendor] = { count: 0, cost: 0, risk: 0 };
    vendorDep[vendor].count++;
    vendorDep[vendor].cost += p.costPerYear || 0;
    vendorDep[vendor].risk = Math.max(vendorDep[vendor].risk, p.riskLevel);
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
          {[["100+", "produits analysés"], ["15", "catégories"], ["22", "ERP Assurance"], ["5 min", "pour un diagnostic"]].map(([n, l]) => (
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
                {p.costPerYear && <span style={{ color: "#5a6b80" }}>{(p.costPerYear / 1000).toFixed(0)}k€/an</span>}
              </div>
              {p.alternatives && <div style={{ marginTop: 8, fontSize: 11, color: "#2d6a4f" }}>{p.alternatives.map((a: any) => a.name).join(" · ")}</div>}
            </div>
          ))}
        </div>
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
            { label: "Coût annuel estimé", value: `${(totalCost / 1000).toFixed(0)}k €`, color: "#4361ee" },
            { label: "Coût cumulé 5 ans", value: `${(total5y / 1000).toFixed(0)}k €`, color: "#c1121f" },
            { label: "Risque moyen", value: `${avgRisk.toFixed(1)}/5`, color: riskColor(Math.round(avgRisk)) },
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
          {Object.entries(vendorDep).sort((a, b) => b[1].cost - a[1].cost).map(([vendor, data]) => (
            <div key={vendor} style={{ background: "#fff", border: "1px solid #e8e0d4", borderRadius: 8, padding: 14 }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{vendor}</div>
              <div style={{ fontSize: 12, color: "#5a6b80" }}>{data.count} produit{data.count > 1 ? "s" : ""} · {(data.cost / 1000).toFixed(0)}k€/an</div>
              <div style={{ fontSize: 12, color: riskColor(data.risk), fontWeight: 500 }}>Risque max: {data.risk}/5</div>
            </div>
          ))}
        </div>

        {/* Projection 5 ans */}
        <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, marginBottom: 12 }}>Projection des coûts sur 5 ans</h3>
        <div style={{ overflowX: "auto", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, background: "#fff", borderRadius: 8 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e8e0d4" }}>
                <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600 }}>Produit</th>
                <th style={{ padding: "10px 8px", fontWeight: 600 }}>Hausse/an</th>
                {[0, 1, 2, 3, 4, 5].map(y => <th key={y} style={{ padding: "10px 8px", fontWeight: 600 }}>A{y}</th>)}
              </tr>
            </thead>
            <tbody>
              {projection5y.map(p => (
                <tr key={p.name} style={{ borderBottom: "1px solid #f0ebe3" }}>
                  <td style={{ padding: "8px 12px", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</td>
                  <td style={{ padding: "8px", textAlign: "center", color: "#c1121f" }}>+{(p.rate * 100).toFixed(0)}%</td>
                  {p.costs.map((c: number, i: number) => <td key={i} style={{ padding: "8px", textAlign: "center" }}>{(c / 1000).toFixed(0)}k</td>)}
                </tr>
              ))}
              <tr style={{ fontWeight: 700, borderTop: "2px solid #1a2744" }}>
                <td style={{ padding: "10px 12px" }}>TOTAL</td>
                <td></td>
                {[0, 1, 2, 3, 4, 5].map(y => {
                  const t = projection5y.reduce((s, p) => s + p.costs[y], 0);
                  return <td key={y} style={{ padding: "10px 8px", textAlign: "center" }}>{(t / 1000).toFixed(0)}k</td>;
                })}
              </tr>
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
