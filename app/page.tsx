"use client";
import { useState } from "react";

// ═══════════════════════════════════════════════════════════════
// LibreAudit — Diagnostic de dépendance aux logiciels propriétaires
// Design: Clair & pro — crème/blanc + bleu marine/indigo
// ═══════════════════════════════════════════════════════════════

const CATEGORIES = [
  { id: "legacy", label: "Legacy & Mainframe", icon: "🏛️" },
  { id: "cobol", label: "COBOL & Langages Legacy", icon: "📟" },
  { id: "middleware", label: "Middleware & Intégration", icon: "🔗" },
  { id: "erp", label: "ERP / CRM / Métier", icon: "🏢" },
  { id: "finance", label: "Comptabilité & Finance", icon: "💰" },
  { id: "rh", label: "RH, Paie & Talent", icon: "👥" },
  { id: "editique", label: "Éditique & GED", icon: "🖨️" },
  { id: "os", label: "Systèmes d'exploitation", icon: "🖥️" },
  { id: "virtualisation", label: "Virtualisation & Conteneurs", icon: "📦" },
  { id: "office", label: "Bureautique & Création", icon: "📄" },
  { id: "email", label: "Messagerie & Collaboration", icon: "📧" },
  { id: "cloud", label: "Cloud & Infrastructure", icon: "☁️" },
  { id: "network", label: "Réseau & Télécom", icon: "🌐" },
  { id: "db", label: "Bases de données", icon: "🗄️" },
  { id: "dev", label: "Outils de développement", icon: "⚙️" },
  { id: "security", label: "Sécurité", icon: "🛡️" },
  { id: "ai", label: "IA & Assistants IA", icon: "🤖" },
];

const PROPRIETARY_DB: Record<string, any[]> = {
  legacy: [
    { name: "IBM z/OS (Mainframe)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Linux on Z / KVM", maturity: 4 }, { name: "Cloud Foundry", maturity: 3 }] },
    { name: "IBM CICS", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "CobolCloud (compilateur cloud-native)", maturity: 4 }, { name: "Jakarta EE / WildFly", maturity: 4 }, { name: "Spring Boot", maturity: 5 }] },
    { name: "IBM IMS (DB/TM)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "PostgreSQL + Message Broker", maturity: 4 }] },
    { name: "IBM DB2 for z/OS", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.2, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "CockroachDB", maturity: 4 }] },
    { name: "Rocket Software (UniVerse/UniData/D3)", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "MongoDB", maturity: 4 }] },
    { name: "Unisys ClearPath", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Linux x86 + conteneurs", maturity: 4 }] },
    { name: "Bull GCOS", riskLevel: 5, lockIn: 5, sovereignty: "eu", hausse: 2.5, alternatives: [{ name: "CobolCloud (compilateur COBOL cloud-native)", maturity: 4 }, { name: "Linux + modernisation", maturity: 3 }] },
    { name: "HP NonStop", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "Kubernetes HA", maturity: 4 }] },
    { name: "OpenVMS", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Linux HA cluster", maturity: 5 }] },
    { name: "Fujitsu BS2000", riskLevel: 5, lockIn: 5, sovereignty: "eu", hausse: 2.0, alternatives: [{ name: "Linux x86", maturity: 5 }] },
  ],
  cobol: [
    { name: "COBOL (programmes métier)", riskLevel: 5, lockIn: 5, sovereignty: "mixed", hausse: 6.0, alternatives: [{ name: "CobolCloud (compilateur cloud-native)", maturity: 4 }, { name: "Java/Spring Boot", maturity: 5 }, { name: "GnuCOBOL + Linux", maturity: 4 }] },
    { name: "JCL (Job Control Language)", riskLevel: 4, lockIn: 5, sovereignty: "mixed", hausse: 3.0, alternatives: [{ name: "Apache Airflow", maturity: 5 }, { name: "GitLab CI/CD", maturity: 5 }] },
    { name: "PL/I", riskLevel: 4, lockIn: 4, sovereignty: "mixed", hausse: 3.5, alternatives: [{ name: "Java / C#", maturity: 5 }] },
    { name: "RPG (IBM i / AS400)", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Python + PostgreSQL", maturity: 4 }, { name: "Node.js", maturity: 4 }] },
    { name: "Natural + ADABAS", riskLevel: 5, lockIn: 5, sovereignty: "eu", hausse: 5.5, alternatives: [{ name: "CobolCloud (compilateur cloud-native)", maturity: 4 }, { name: "PostgreSQL + Java", maturity: 4 }] },
    { name: "Assembler mainframe", riskLevel: 5, lockIn: 5, sovereignty: "mixed", hausse: 2.0, alternatives: [{ name: "C / Rust (performance critique)", maturity: 4 }] },
    { name: "MUMPS / Caché (InterSystems)", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "PostgreSQL + Python/Django", maturity: 4 }] },
    { name: "Pacbase (IBM)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 2.0, alternatives: [{ name: "CobolCloud (compilateur cloud-native)", maturity: 4 }, { name: "Java modernisation", maturity: 4 }] },
    { name: "PowerBuilder (Appeon)", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "React + Node.js", maturity: 5 }] },
    { name: "Delphi / RAD Studio", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Lazarus (Free Pascal)", maturity: 3 }, { name: "Electron + React", maturity: 4 }] },
    { name: "Visual Basic 6 / VBA", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 0, alternatives: [{ name: "Python + Flask", maturity: 5 }, { name: "LibreOffice macros", maturity: 3 }] },
    { name: "4GL / Progress OpenEdge", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Node.js + PostgreSQL", maturity: 4 }] },
  ],
  middleware: [
    { name: "IBM WebSphere", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "WildFly / Quarkus", maturity: 5 }, { name: "Spring Boot", maturity: 5 }] },
    { name: "Oracle WebLogic", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "WildFly / Quarkus", maturity: 5 }] },
    { name: "TIBCO BusinessWorks", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Apache Camel", maturity: 5 }, { name: "MuleSoft CE", maturity: 4 }] },
    { name: "TIBCO EMS (messaging)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "RabbitMQ", maturity: 5 }, { name: "Apache Kafka", maturity: 5 }] },
    { name: "IBM MQ (MQSeries)", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "RabbitMQ", maturity: 5 }, { name: "Apache ActiveMQ", maturity: 4 }] },
    { name: "IBM DataPower", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "Kong Gateway", maturity: 5 }, { name: "Apache APISIX", maturity: 4 }] },
    { name: "Informatica PowerCenter", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 5.5, alternatives: [{ name: "Apache NiFi / Airflow", maturity: 4 }, { name: "dbt + Airbyte", maturity: 4 }] },
    { name: "Talend (Qlik)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Apache NiFi", maturity: 4 }, { name: "Airbyte", maturity: 4 }] },
    { name: "MuleSoft Anypoint (Salesforce)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Apache Camel", maturity: 5 }, { name: "WSO2", maturity: 4 }] },
    { name: "Axway API Gateway", riskLevel: 3, lockIn: 3, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "Kong Gateway", maturity: 5 }, { name: "Traefik", maturity: 4 }] },
    { name: "MicroFocus Enterprise Server", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "CobolCloud (compilateur cloud-native)", maturity: 4 }, { name: "GnuCOBOL + Linux", maturity: 3 }] },
    { name: "Oracle Tuxedo", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "gRPC + Kubernetes", maturity: 4 }, { name: "RabbitMQ", maturity: 5 }] },
    { name: "Oracle SOA Suite", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "Apache Camel + Quarkus", maturity: 4 }] },
    { name: "BizTalk Server (Microsoft)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Apache Camel", maturity: 5 }, { name: "n8n", maturity: 3 }] },
    { name: "Apigee (Google)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Kong Gateway", maturity: 5 }, { name: "Gravitee.io (EU)", maturity: 4 }] },
  ],
  erp: [
    { name: "SAP S/4HANA", riskLevel: 4, lockIn: 5, sovereignty: "eu", hausse: 5.0, alternatives: [{ name: "Odoo", maturity: 4 }, { name: "ERPNext", maturity: 3 }] },
    { name: "SAP Business One", riskLevel: 3, lockIn: 4, sovereignty: "eu", hausse: 4.5, alternatives: [{ name: "Odoo", maturity: 4 }, { name: "Dolibarr", maturity: 4 }] },
    { name: "SAP SuccessFactors (HCM)", riskLevel: 3, lockIn: 4, sovereignty: "eu", hausse: 5.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }, { name: "Odoo HR", maturity: 4 }] },
    { name: "SAP Ariba (achats)", riskLevel: 3, lockIn: 4, sovereignty: "eu", hausse: 5.5, alternatives: [{ name: "Odoo Achats", maturity: 3 }] },
    { name: "SAP Concur (notes de frais)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Odoo Expenses", maturity: 3 }, { name: "N2F", maturity: 3 }] },
    { name: "Salesforce Sales Cloud", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Twenty CRM", maturity: 3 }] },
    { name: "Salesforce Service Cloud", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Zammad", maturity: 4 }, { name: "GLPI", maturity: 4 }] },
    { name: "Salesforce Marketing Cloud", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 8.0, alternatives: [{ name: "Mautic", maturity: 4 }, { name: "Brevo (EU)", maturity: 4 }] },
    { name: "Salesforce Platform / Lightning", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Budibase", maturity: 3 }, { name: "Appsmith", maturity: 3 }] },
    { name: "Oracle E-Business Suite", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Odoo", maturity: 4 }] },
    { name: "Oracle Fusion Cloud (ERP)", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Odoo", maturity: 4 }] },
    { name: "Oracle NetSuite", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "ERPNext", maturity: 3 }, { name: "Odoo", maturity: 4 }] },
    { name: "Microsoft Dynamics 365", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Odoo", maturity: 4 }, { name: "ERPNext", maturity: 3 }] },
    { name: "Microsoft Dynamics NAV / BC", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Odoo", maturity: 4 }] },
    { name: "Sage X3", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Odoo", maturity: 4 }] },
    { name: "Sage 100 / Ligne 100", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "Odoo", maturity: 4 }] },
    { name: "Cegid", riskLevel: 3, lockIn: 3, sovereignty: "eu", hausse: 4.5, alternatives: [{ name: "Odoo", maturity: 4 }, { name: "Dolibarr", maturity: 4 }] },
    { name: "Efficy CRM", riskLevel: 2, lockIn: 3, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Twenty CRM", maturity: 3 }] },
    { name: "HubSpot CRM", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Mautic + SuiteCRM", maturity: 3 }, { name: "Twenty CRM", maturity: 3 }] },
    { name: "Zoho CRM / One", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "SuiteCRM", maturity: 4 }, { name: "Odoo", maturity: 4 }] },
    { name: "ServiceNow", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 8.0, alternatives: [{ name: "GLPI", maturity: 4 }, { name: "Zammad", maturity: 4 }] },
    { name: "BMC Helix / Remedy", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "GLPI", maturity: 4 }, { name: "iTop", maturity: 3 }] },
    { name: "ALFA (assurance)", riskLevel: 4, lockIn: 5, sovereignty: "eu", hausse: 3.5, alternatives: [{ name: "OpenL Tablets", maturity: 3 }] },
    { name: "Guidewire (assurance)", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "OpenL Tablets + custom", maturity: 3 }] },
    { name: "Temenos T24 (banque)", riskLevel: 4, lockIn: 5, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "Apache Fineract", maturity: 3 }] },
    { name: "Finastra (banque)", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Apache Fineract", maturity: 3 }] },
    { name: "Verint (centre de contact)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Asterisk + custom", maturity: 3 }] },
    { name: "Genesys Cloud", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Asterisk + VICIdial", maturity: 3 }] },
  ],
  finance: [
    { name: "Sage Comptabilité", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Dolibarr", maturity: 4 }, { name: "GnuCash", maturity: 3 }] },
    { name: "SAP FI/CO", riskLevel: 4, lockIn: 5, sovereignty: "eu", hausse: 5.0, alternatives: [{ name: "Odoo Comptabilité", maturity: 4 }] },
    { name: "Oracle Financials", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Odoo Comptabilité", maturity: 4 }] },
    { name: "Sopra Banking Software", riskLevel: 4, lockIn: 5, sovereignty: "eu", hausse: 3.5, alternatives: [{ name: "Apache Fineract", maturity: 3 }] },
    { name: "Murex (trading)", riskLevel: 5, lockIn: 5, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "OpenGamma + QuantLib", maturity: 3 }] },
    { name: "Calypso (trading)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "OpenGamma + QuantLib", maturity: 3 }] },
    { name: "SAS (analytics)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "R + Python (pandas/scikit)", maturity: 5 }, { name: "Apache Spark", maturity: 5 }] },
    { name: "Bloomberg Terminal", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Open source data feeds + Python", maturity: 2 }] },
    { name: "Refinitiv Eikon (LSEG)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Open BB Terminal", maturity: 2 }] },
    { name: "Kyriba (trésorerie)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Odoo + module trésorerie", maturity: 2 }] },
    { name: "Anaplan (planification)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Apache Superset + Python", maturity: 3 }] },
    { name: "Tableau (Salesforce)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Apache Superset", maturity: 4 }, { name: "Metabase", maturity: 4 }] },
    { name: "Power BI (Microsoft)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Apache Superset", maturity: 4 }, { name: "Metabase", maturity: 4 }] },
    { name: "Qlik Sense", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.5, alternatives: [{ name: "Apache Superset", maturity: 4 }, { name: "Redash", maturity: 3 }] },
  ],
  rh: [
    { name: "SAP SuccessFactors", riskLevel: 3, lockIn: 4, sovereignty: "eu", hausse: 5.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }, { name: "Odoo HR", maturity: 4 }] },
    { name: "Workday HCM", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }, { name: "Odoo HR", maturity: 4 }] },
    { name: "Oracle HCM Cloud", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.5, alternatives: [{ name: "OrangeHRM", maturity: 3 }] },
    { name: "ADP (paie)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Odoo Paie", maturity: 3 }] },
    { name: "Cegid Talentsoft", riskLevel: 3, lockIn: 3, sovereignty: "eu", hausse: 4.5, alternatives: [{ name: "OrangeHRM", maturity: 3 }] },
    { name: "Ceridian Dayforce", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }] },
    { name: "Cornerstone OnDemand (LMS)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.5, alternatives: [{ name: "Moodle", maturity: 5 }, { name: "Open edX", maturity: 4 }] },
    { name: "Silae (paie FR)", riskLevel: 2, lockIn: 3, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "Odoo Paie", maturity: 3 }] },
    { name: "Lucca (SIRH FR)", riskLevel: 2, lockIn: 2, sovereignty: "eu", hausse: 5.0, alternatives: [{ name: "OrangeHRM", maturity: 3 }] },
    { name: "PayFit (paie FR)", riskLevel: 2, lockIn: 2, sovereignty: "eu", hausse: 5.0, alternatives: [{ name: "Odoo Paie", maturity: 3 }] },
  ],
  editique: [
    { name: "SEFAS", riskLevel: 3, lockIn: 4, sovereignty: "eu", hausse: 3.5, alternatives: [{ name: "Apache FOP + BIRT", maturity: 3 }] },
    { name: "OpenText Exstream", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Apache FOP + Jasper", maturity: 3 }] },
    { name: "OpenText Content Suite (ECM)", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "Quadient (ex-GMC Inspire)", riskLevel: 3, lockIn: 4, sovereignty: "eu", hausse: 4.5, alternatives: [{ name: "Apache FOP", maturity: 3 }] },
    { name: "Compart DocBridge", riskLevel: 3, lockIn: 3, sovereignty: "eu", hausse: 3.0, alternatives: [{ name: "LibreOffice + scripts", maturity: 3 }] },
    { name: "ISIS Papyrus", riskLevel: 4, lockIn: 4, sovereignty: "eu", hausse: 3.5, alternatives: [{ name: "Alfresco + Apache FOP", maturity: 3 }] },
    { name: "Hyland OnBase", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "DocuSign", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Open Sign", maturity: 3 }, { name: "Yousign (EU)", maturity: 4 }] },
    { name: "M-Files", riskLevel: 2, lockIn: 3, sovereignty: "eu", hausse: 4.5, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nuxeo", maturity: 4 }] },
    { name: "SharePoint (GED)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Alfresco", maturity: 4 }, { name: "Nextcloud", maturity: 4 }] },
    { name: "Box", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Nextcloud", maturity: 5 }, { name: "Seafile", maturity: 4 }] },
    { name: "Dropbox Business", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Nextcloud", maturity: 5 }, { name: "Syncthing", maturity: 4 }] },
  ],
  os: [
    { name: "Windows 10/11", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Ubuntu", maturity: 5 }, { name: "Fedora", maturity: 4 }] },
    { name: "macOS", riskLevel: 2, lockIn: 4, sovereignty: "us", hausse: 0, alternatives: [{ name: "Linux (usage limité sur Apple)", maturity: 3 }] },
    { name: "Windows Server", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Ubuntu Server / Rocky Linux", maturity: 5 }] },
    { name: "Red Hat Enterprise Linux (RHEL)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Rocky Linux", maturity: 5 }, { name: "AlmaLinux", maturity: 5 }] },
    { name: "SUSE Linux Enterprise", riskLevel: 2, lockIn: 2, sovereignty: "eu", hausse: 3.5, alternatives: [{ name: "openSUSE", maturity: 5 }, { name: "Rocky Linux", maturity: 5 }] },
    { name: "IBM i (AS/400)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "Linux + PostgreSQL", maturity: 4 }] },
    { name: "AIX (IBM)", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Linux on Power / x86", maturity: 5 }] },
    { name: "HP-UX", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 2.5, alternatives: [{ name: "Linux x86", maturity: 5 }] },
    { name: "Solaris (Oracle)", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "illumos / Linux", maturity: 4 }] },
    { name: "ChromeOS / ChromeOS Flex", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Linux Mint", maturity: 5 }] },
    { name: "iOS / iPadOS (flotte mobile)", riskLevel: 2, lockIn: 4, sovereignty: "us", hausse: 0, alternatives: [{ name: "Android AOSP / LineageOS", maturity: 3 }] },
    { name: "Android Enterprise (Google)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 0, alternatives: [{ name: "LineageOS / /e/OS", maturity: 3 }] },
  ],
  virtualisation: [
    { name: "VMware vSphere / ESXi", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 8.0, alternatives: [{ name: "Proxmox VE", maturity: 5 }, { name: "KVM / oVirt", maturity: 4 }] },
    { name: "VMware vSAN", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 8.0, alternatives: [{ name: "Ceph", maturity: 4 }, { name: "Longhorn", maturity: 3 }] },
    { name: "VMware NSX", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Open vSwitch + Cilium", maturity: 4 }] },
    { name: "VMware Horizon (VDI)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Apache Guacamole", maturity: 3 }, { name: "Proxmox VDI", maturity: 3 }] },
    { name: "Microsoft Hyper-V", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Proxmox VE", maturity: 5 }, { name: "KVM", maturity: 5 }] },
    { name: "Citrix Virtual Apps / Desktops", riskLevel: 4, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Apache Guacamole", maturity: 3 }, { name: "X2Go", maturity: 3 }] },
    { name: "Nutanix AHV", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Proxmox VE", maturity: 5 }, { name: "OpenStack", maturity: 4 }] },
    { name: "Red Hat OpenShift", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Kubernetes vanilla", maturity: 5 }, { name: "K3s / RKE2", maturity: 4 }] },
    { name: "Docker Desktop (licence)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Podman", maturity: 5 }, { name: "Rancher Desktop", maturity: 4 }] },
    { name: "Tanzu (VMware/Broadcom)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Kubernetes + Helm", maturity: 5 }] },
  ],
  office: [
    { name: "Microsoft 365 (Office)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "LibreOffice", maturity: 4 }, { name: "OnlyOffice", maturity: 4 }] },
    { name: "Google Workspace", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Nextcloud + Collabora", maturity: 4 }] },
    { name: "Adobe Creative Cloud", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.5, alternatives: [{ name: "GIMP + Inkscape + Kdenlive", maturity: 4 }] },
    { name: "Adobe Acrobat Pro", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "LibreOffice Draw", maturity: 3 }, { name: "PDF Arranger", maturity: 3 }] },
    { name: "Figma (design)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Penpot (EU)", maturity: 3 }] },
    { name: "Notion", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Outline", maturity: 4 }, { name: "AppFlowy", maturity: 3 }] },
    { name: "Confluence (Atlassian)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "BookStack", maturity: 4 }, { name: "Wiki.js", maturity: 4 }] },
    { name: "Miro (tableaux blancs)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Excalidraw", maturity: 4 }] },
    { name: "Monday.com", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Plane", maturity: 3 }, { name: "Focalboard", maturity: 3 }] },
    { name: "Asana", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Plane", maturity: 3 }, { name: "Taiga", maturity: 4 }] },
    { name: "Trello (Atlassian)", riskLevel: 1, lockIn: 2, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "WeKan", maturity: 4 }, { name: "Planka", maturity: 3 }] },
  ],
  email: [
    { name: "Microsoft Exchange / Outlook", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Zimbra", maturity: 4 }, { name: "Bluemind (EU)", maturity: 4 }] },
    { name: "Gmail (Google Workspace)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Zimbra", maturity: 4 }, { name: "Mailu", maturity: 3 }] },
    { name: "Slack", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Mattermost", maturity: 5 }, { name: "Rocket.Chat", maturity: 4 }] },
    { name: "Microsoft Teams", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Element (Matrix)", maturity: 4 }, { name: "Mattermost", maturity: 5 }] },
    { name: "Zoom", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Jitsi Meet", maturity: 4 }, { name: "BigBlueButton", maturity: 4 }] },
    { name: "Webex (Cisco)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Jitsi Meet", maturity: 4 }, { name: "BigBlueButton", maturity: 4 }] },
    { name: "Google Meet", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Jitsi Meet", maturity: 4 }] },
    { name: "Proofpoint (email security)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Rspamd + ClamAV", maturity: 4 }] },
    { name: "Mimecast (email security)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.5, alternatives: [{ name: "Rspamd + ClamAV", maturity: 4 }] },
  ],
  cloud: [
    { name: "AWS", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "Scaleway", maturity: 4 }, { name: "OVHcloud", maturity: 4 }, { name: "OpenStack", maturity: 4 }] },
    { name: "Microsoft Azure", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Scaleway", maturity: 4 }, { name: "OVHcloud", maturity: 4 }] },
    { name: "Google Cloud Platform", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Scaleway", maturity: 4 }, { name: "OVHcloud", maturity: 4 }] },
    { name: "Oracle Cloud (OCI)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "Scaleway", maturity: 4 }] },
    { name: "IBM Cloud", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "OVHcloud", maturity: 4 }] },
    { name: "Alibaba Cloud", riskLevel: 3, lockIn: 3, sovereignty: "cn", hausse: 3.0, alternatives: [{ name: "Scaleway (EU)", maturity: 4 }] },
    { name: "Huawei Cloud", riskLevel: 3, lockIn: 3, sovereignty: "cn", hausse: 3.5, alternatives: [{ name: "OVHcloud (EU)", maturity: 4 }] },
    { name: "Vercel", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Coolify (self-hosted)", maturity: 3 }, { name: "Netlify OSS", maturity: 3 }] },
    { name: "Heroku (Salesforce)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Coolify", maturity: 3 }, { name: "Dokku", maturity: 4 }] },
    { name: "Cloudflare", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "Traefik + HAProxy", maturity: 4 }] },
    { name: "Akamai CDN", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "Varnish + Nginx", maturity: 4 }] },
  ],
  network: [
    { name: "Cisco IOS / NX-OS (switches/routeurs)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Cumulus Linux / SONiC", maturity: 3 }, { name: "VyOS", maturity: 3 }] },
    { name: "Cisco Meraki (SD-WAN/WiFi)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "OpenWrt", maturity: 4 }, { name: "pfSense", maturity: 5 }] },
    { name: "Cisco ISE (NAC)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "PacketFence", maturity: 4 }] },
    { name: "Cisco Umbrella (DNS security)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Pi-hole + Unbound", maturity: 4 }] },
    { name: "Juniper Mist (WiFi/SD-WAN)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "OpenWrt", maturity: 4 }] },
    { name: "Aruba Networks (HPE)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "OpenWrt", maturity: 4 }] },
    { name: "F5 BIG-IP (load balancer)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "HAProxy", maturity: 5 }, { name: "Nginx", maturity: 5 }] },
    { name: "Fortinet FortiGate", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "pfSense / OPNsense", maturity: 5 }] },
    { name: "Zscaler (SASE/Zero Trust)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Cloudflare Access (partiel)", maturity: 3 }, { name: "WireGuard + custom", maturity: 3 }] },
    { name: "Palo Alto Prisma SASE", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "WireGuard + Traefik", maturity: 3 }] },
    { name: "InfoBlox (DDI/IPAM)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "NetBox + PowerDNS", maturity: 4 }] },
    { name: "SolarWinds (monitoring réseau)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Zabbix", maturity: 5 }, { name: "LibreNMS", maturity: 4 }] },
    { name: "Datadog (observabilité)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Prometheus + Grafana", maturity: 5 }, { name: "SigNoz", maturity: 3 }] },
    { name: "New Relic (APM)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Grafana + Tempo + Loki", maturity: 4 }] },
    { name: "Dynatrace (APM)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Prometheus + Jaeger", maturity: 4 }] },
  ],
  db: [
    { name: "Oracle Database", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "PostgreSQL", maturity: 5 }, { name: "MariaDB", maturity: 5 }] },
    { name: "Microsoft SQL Server", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "IBM DB2 (LUW)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "VSAM (mainframe)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "PostgreSQL + fichiers plats", maturity: 4 }] },
    { name: "ADABAS", riskLevel: 5, lockIn: 5, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "IDMS (Broadcom)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "Datacom (Broadcom)", riskLevel: 5, lockIn: 5, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "MongoDB Atlas (cloud)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "MongoDB self-hosted", maturity: 5 }, { name: "FerretDB", maturity: 3 }] },
    { name: "Amazon DynamoDB", riskLevel: 3, lockIn: 5, sovereignty: "us", hausse: 3.0, alternatives: [{ name: "ScyllaDB", maturity: 4 }, { name: "Apache Cassandra", maturity: 4 }] },
    { name: "Amazon Aurora", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "PostgreSQL", maturity: 5 }] },
    { name: "Azure Cosmos DB", riskLevel: 3, lockIn: 5, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "PostgreSQL + extensions", maturity: 4 }] },
    { name: "Google BigQuery", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 3.5, alternatives: [{ name: "ClickHouse", maturity: 4 }, { name: "Apache Druid", maturity: 3 }] },
    { name: "Snowflake", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "ClickHouse", maturity: 4 }, { name: "DuckDB", maturity: 3 }] },
    { name: "Teradata", riskLevel: 4, lockIn: 5, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "ClickHouse", maturity: 4 }, { name: "Apache Spark", maturity: 5 }] },
    { name: "Redis Enterprise", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Valkey", maturity: 4 }, { name: "KeyDB", maturity: 4 }] },
    { name: "Elasticsearch (Elastic NV)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "OpenSearch", maturity: 4 }, { name: "Meilisearch", maturity: 3 }] },
  ],
  dev: [
    { name: "GitHub Enterprise", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "GitLab CE", maturity: 5 }, { name: "Gitea", maturity: 4 }] },
    { name: "GitLab Ultimate (SaaS)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "GitLab CE self-hosted", maturity: 5 }] },
    { name: "Bitbucket (Atlassian)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Gitea", maturity: 4 }, { name: "GitLab CE", maturity: 5 }] },
    { name: "JetBrains (IntelliJ, etc.)", riskLevel: 1, lockIn: 1, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "VS Code / VSCodium", maturity: 5 }, { name: "Eclipse", maturity: 4 }] },
    { name: "Jira", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Plane", maturity: 3 }, { name: "Taiga", maturity: 4 }] },
    { name: "Azure DevOps (CI/CD)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "GitLab CI", maturity: 5 }, { name: "Jenkins", maturity: 5 }] },
    { name: "CircleCI", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "GitLab CI", maturity: 5 }, { name: "Woodpecker CI", maturity: 3 }] },
    { name: "Terraform Cloud (HashiCorp)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "OpenTofu", maturity: 4 }, { name: "Pulumi OSS", maturity: 3 }] },
    { name: "Vault (HashiCorp)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "OpenBao", maturity: 3 }, { name: "SOPS + age", maturity: 4 }] },
    { name: "Artifactory (JFrog)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Nexus OSS", maturity: 4 }, { name: "Harbor (containers)", maturity: 4 }] },
    { name: "SonarQube (licence)", riskLevel: 2, lockIn: 2, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "SonarQube CE", maturity: 5 }] },
    { name: "Snyk (sécurité code)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Trivy", maturity: 4 }, { name: "Grype", maturity: 3 }] },
    { name: "PagerDuty (astreintes)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Grafana OnCall", maturity: 4 }] },
    { name: "LaunchDarkly (feature flags)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Unleash", maturity: 4 }, { name: "Flagsmith", maturity: 3 }] },
  ],
  security: [
    { name: "CrowdStrike Falcon (EDR)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Wazuh", maturity: 4 }, { name: "OSSEC", maturity: 4 }] },
    { name: "SentinelOne (EDR)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Wazuh", maturity: 4 }] },
    { name: "Microsoft Defender for Endpoint", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Wazuh", maturity: 4 }, { name: "ClamAV", maturity: 3 }] },
    { name: "Palo Alto (firewall)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "pfSense / OPNsense", maturity: 5 }] },
    { name: "Check Point (firewall)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 4.5, alternatives: [{ name: "OPNsense", maturity: 5 }] },
    { name: "Splunk (SIEM)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 8.0, alternatives: [{ name: "ELK Stack (Elastic)", maturity: 5 }, { name: "Graylog", maturity: 4 }] },
    { name: "QRadar (IBM SIEM)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Wazuh SIEM", maturity: 4 }, { name: "ELK Stack", maturity: 5 }] },
    { name: "Microsoft Sentinel (SIEM)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Wazuh SIEM", maturity: 4 }] },
    { name: "CyberArk (PAM)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.5, alternatives: [{ name: "Teleport", maturity: 4 }, { name: "HashiCorp Boundary", maturity: 3 }] },
    { name: "BeyondTrust (PAM)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Teleport", maturity: 4 }] },
    { name: "Okta (IAM)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Keycloak", maturity: 5 }, { name: "Authentik", maturity: 4 }] },
    { name: "Microsoft Entra ID (ex-Azure AD)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Keycloak", maturity: 5 }, { name: "FreeIPA", maturity: 4 }] },
    { name: "Ping Identity (IAM)", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Keycloak", maturity: 5 }] },
    { name: "Thales HSM / CipherTrust", riskLevel: 3, lockIn: 4, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "SoftHSM", maturity: 3 }, { name: "HashiCorp Vault", maturity: 4 }] },
    { name: "Qualys (vulnérabilité)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "OpenVAS / Greenbone", maturity: 4 }] },
    { name: "Tenable Nessus", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "OpenVAS / Greenbone", maturity: 4 }] },
    { name: "Symantec Endpoint (Broadcom)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 4.0, alternatives: [{ name: "Wazuh + ClamAV", maturity: 4 }] },
    { name: "Varonis (DLP/data security)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Apache Ranger", maturity: 3 }] },
  ],
  ai: [
    { name: "Microsoft Copilot (M365)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 8.0, alternatives: [{ name: "Ollama + Open WebUI", maturity: 3 }, { name: "Jan.ai", maturity: 2 }] },
    { name: "ChatGPT Enterprise (OpenAI)", riskLevel: 3, lockIn: 3, sovereignty: "us", hausse: 7.0, alternatives: [{ name: "Ollama + Open WebUI", maturity: 3 }, { name: "Mistral self-hosted", maturity: 4 }] },
    { name: "ChatGPT Business (OpenAI)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Ollama + Open WebUI", maturity: 3 }, { name: "Mistral Le Chat", maturity: 4 }] },
    { name: "GitHub Copilot Business", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Tabby (self-hosted)", maturity: 3 }, { name: "Continue.dev + Ollama", maturity: 3 }] },
    { name: "Google Gemini Advanced", riskLevel: 2, lockIn: 3, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "Ollama + Mistral", maturity: 4 }, { name: "Open WebUI", maturity: 3 }] },
    { name: "Claude Pro (Anthropic)", riskLevel: 2, lockIn: 2, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "Ollama + Open WebUI", maturity: 3 }, { name: "Mistral Le Chat", maturity: 4 }] },
    { name: "Mistral AI — Le Chat Pro (FR/EU 🇪🇺)", riskLevel: 1, lockIn: 1, sovereignty: "eu", hausse: 4.0, alternatives: [{ name: "Mistral self-hosted (open-weights)", maturity: 5 }, { name: "Ollama + Mistral local", maturity: 4 }] },
    { name: "Mistral AI — Le Chat Team (FR/EU 🇪🇺)", riskLevel: 1, lockIn: 1, sovereignty: "eu", hausse: 3.5, alternatives: [{ name: "Mistral self-hosted (open-weights)", maturity: 5 }, { name: "vLLM + Mistral on-prem", maturity: 4 }] },
    { name: "Kimi / Moonshot AI (Chine 🇨🇳)", riskLevel: 4, lockIn: 2, sovereignty: "cn", hausse: 5.0, alternatives: [{ name: "Mistral (souveraineté EU)", maturity: 4 }, { name: "Ollama + Qwen local", maturity: 3 }] },
    { name: "DeepSeek (Chine 🇨🇳)", riskLevel: 4, lockIn: 2, sovereignty: "cn", hausse: 4.0, alternatives: [{ name: "Mistral (EU)", maturity: 4 }, { name: "Ollama + DeepSeek local", maturity: 4 }] },
    { name: "AWS Bedrock (AI managé)", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "vLLM self-hosted", maturity: 3 }, { name: "Ollama", maturity: 3 }] },
    { name: "Azure OpenAI Service", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 6.0, alternatives: [{ name: "vLLM + Mistral on-prem", maturity: 3 }] },
    { name: "Google Vertex AI", riskLevel: 3, lockIn: 4, sovereignty: "us", hausse: 5.0, alternatives: [{ name: "MLflow + vLLM", maturity: 3 }] },
  ],
};

const SOV: Record<string, { label: string; flag: string; color: string }> = {
  us: { label: "USA", flag: "🇺🇸", color: "#4361ee" },
  eu: { label: "Europe", flag: "🇪🇺", color: "#2d6a4f" },
  cn: { label: "Chine", flag: "🇨🇳", color: "#c1121f" },
  mixed: { label: "Mixte", flag: "🌐", color: "#9a8c6c" },
};

// ═══════ PALETTE ═══════
const P = {
  bg: "#faf8f5",         // crème très léger
  bgAlt: "#f1ede8",      // crème un peu plus marqué
  surface: "#ffffff",     // cartes blanches
  navy: "#1a2744",        // bleu marine — texte principal
  navyLight: "#2e4068",   // bleu marine clair
  indigo: "#4361ee",      // accent indigo vif
  indigoSoft: "rgba(67,97,238,0.08)", // fond accent
  indigoBorder: "rgba(67,97,238,0.15)",
  text: "#1a2744",
  textMuted: "#6b7a94",
  textLight: "#9aa5b8",
  border: "#e2ddd6",
  borderLight: "#ece8e2",
  green: "#2d6a4f",
  greenSoft: "rgba(45,106,79,0.08)",
  greenBorder: "rgba(45,106,79,0.18)",
  red: "#c1121f",
  redSoft: "rgba(193,18,31,0.06)",
  amber: "#b8860b",
};


// ═══════ SCORING ═══════
function computeScore(products: any[]) {
  if (!products.length) return { score: 0, risk: "N/A", vendorScores: {} as Record<string, { risk: number; lockIn: number; count: number }>, sovereigntyBreakdown: {} as Record<string, number>, avgHausse: 0 };
  let totalRisk = 0, totalLockIn = 0, totalHausse = 0;
  const vendorScores: Record<string, { risk: number; lockIn: number; count: number }> = {};
  const sovereigntyBreakdown: Record<string, number> = {};
  products.forEach((p) => {
    totalRisk += p.riskLevel;
    totalLockIn += p.lockIn;
    totalHausse += (p.hausse || 3.5);
    const vendor = p.name.split("(")[0].split("/")[0].split("—")[0].trim();
    if (!vendorScores[vendor]) vendorScores[vendor] = { risk: 0, lockIn: 0, count: 0 };
    vendorScores[vendor].risk += p.riskLevel;
    vendorScores[vendor].lockIn += p.lockIn;
    vendorScores[vendor].count += 1;
    const sov = p.sovereignty || "us";
    sovereigntyBreakdown[sov] = (sovereigntyBreakdown[sov] || 0) + 1;
  });
  const score = Math.round(((totalRisk / products.length + totalLockIn / products.length) / 10) * 100);
  const risk = score > 70 ? "Critique" : score > 50 ? "Élevé" : score > 30 ? "Modéré" : "Faible";
  return { score, risk, vendorScores, sovereigntyBreakdown, avgHausse: Math.round((totalHausse / products.length) * 10) / 10 };
}

// ═══════ LOGO ═══════
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? 16 : size === "lg" ? 28 : 22;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: s * 1.2, height: s * 1.2, borderRadius: 6, background: P.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: s * 0.55, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>LA</span>
      </div>
      <span style={{ fontSize: s * 0.85, fontWeight: 800, color: P.navy, letterSpacing: -0.3 }}>
        Libre<span style={{ color: P.indigo }}>Audit</span>
      </span>
    </div>
  );
}

// ═══════ MAIN ═══════
export default function Home() {
  const [page, setPage] = useState<"landing" | "audit" | "results">("landing");
  const [step, setStep] = useState(0);
  const [orgName, setOrgName] = useState("");
  const [userCount, setUserCount] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState(CATEGORIES[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailForPdf, setEmailForPdf] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [satisfactionComment, setSatisfactionComment] = useState("");
  const [satisfactionSent, setSatisfactionSent] = useState(false);

  const results = computeScore(selectedProducts);
  const toggleProduct = (p: any) => setSelectedProducts((prev) => prev.find((x) => x.name === p.name) ? prev.filter((x) => x.name !== p.name) : [...prev, p]);
  const notify = async (data: any) => { try { await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); } catch (e) { console.log("[notify error]", e); } };
  const filteredProducts = (PROPRIETARY_DB[activeCat] || []).filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Serif+Display&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${P.bg}; }
    input:focus, select:focus { outline: none; border-color: ${P.indigo} !important; box-shadow: 0 0 0 3px ${P.indigoSoft}; }
    button { transition: all 0.15s; }
    button:hover { transform: translateY(-1px); }
    button:active { transform: translateY(0); }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
    ::selection { background: ${P.indigoSoft}; color: ${P.navy}; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${P.border}; border-radius: 3px; }
  `;

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 16px", borderRadius: 8,
    background: "#fff", border: `1.5px solid ${P.border}`,
    color: P.navy, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const btnPrimary: React.CSSProperties = {
    padding: "13px 28px", borderRadius: 8,
    background: P.indigo, border: "none",
    color: "#fff", fontSize: 14, fontWeight: 600,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 2px 8px rgba(67,97,238,0.2)",
  };

  const btnOutline: React.CSSProperties = {
    padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
    background: "transparent", border: `1.5px solid ${P.border}`,
    color: P.textMuted, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
  };

  const card: React.CSSProperties = {
    padding: 24, borderRadius: 12, background: P.surface,
    border: `1px solid ${P.borderLight}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  };

  const riskDots = (level: number) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", marginRight: 2, background: i < level ? (level >= 4 ? P.red : level >= 3 ? P.amber : P.green) : P.borderLight }} />
  ));


  // ═══════ LANDING ═══════
  if (page === "landing") {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: P.bg, color: P.text, minHeight: "100vh" }}>
        <style>{css}</style>
        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderBottom: `1px solid ${P.borderLight}`, position: "sticky", top: 0, background: "rgba(250,248,245,0.92)", backdropFilter: "blur(12px)", zIndex: 100 }}>
          <Logo />
          <button onClick={() => setPage("audit")} style={btnPrimary}>Lancer l&apos;audit →</button>
        </nav>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "96px 24px 56px", maxWidth: 780, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: P.indigoSoft, border: `1px solid ${P.indigoBorder}`, fontSize: 12, fontWeight: 600, color: P.indigo, marginBottom: 28, letterSpacing: 0.3 }}>Diagnostic gratuit · Sans inscription · 3 min</div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px, 5vw, 54px)", fontWeight: 400, lineHeight: 1.15, marginBottom: 20, color: P.navy }}>
            Mesurez la dépendance de<br />votre SI aux <span style={{ color: P.indigo, fontStyle: "italic" }}>logiciels propriétaires</span>
          </h1>
          <p style={{ fontSize: 17, color: P.textMuted, lineHeight: 1.65, maxWidth: 560, margin: "0 auto 40px" }}>
            Score de verrouillage, risque par éditeur, analyse de souveraineté numérique et alternatives open source.
          </p>
          <button onClick={() => setPage("audit")} style={{ ...btnPrimary, padding: "15px 36px", fontSize: 16 }}>Commencer le diagnostic →</button>
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 16, maxWidth: 880, margin: "0 auto 72px", padding: "0 24px" }}>
          {[
            { icon: "📊", title: "Score 0–100", desc: "Indice de dépendance global pondéré par risque et verrouillage éditeur" },
            { icon: "🌍", title: "Souveraineté", desc: "Cartographie juridictionnelle : EU, US ou Chine — impact RGPD et Cloud Act" },
            { icon: "🔀", title: "Alternatives libres", desc: "Pour chaque produit, des alternatives open source avec indice de maturité" },
            { icon: "📈", title: "Hausse tarifaire", desc: "Tendance de hausse par éditeur pour anticiper l'évolution des coûts" },
          ].map((f, i) => (
            <div key={i} style={{ ...card, animation: `fadeUp 0.5s ${i * 0.08}s both` }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: P.navy }}>{f.title}</div>
              <div style={{ fontSize: 13, color: P.textMuted, lineHeight: 1.55 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div style={{ textAlign: "center", padding: "0 24px 72px" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 20, color: P.navy }}>14 catégories · 80+ produits</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 680, margin: "0 auto" }}>
            {CATEGORIES.map((c) => (
              <span key={c.id} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, background: P.surface, border: `1px solid ${P.borderLight}`, color: P.textMuted }}>{c.icon} {c.label}</span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "20px 24px", borderTop: `1px solid ${P.borderLight}`, fontSize: 12, color: P.textLight }}>LibreAudit · Diagnostic de souveraineté numérique · {new Date().getFullYear()}</div>
      </div>
    );
  }


  // ═══════ RESULTS ═══════
  if (page === "results") {
    const sortedVendors = Object.entries(results.vendorScores).map(([name, v]) => ({ name, avgScore: Math.round(((v.risk + v.lockIn) / (v.count * 2)) / 5 * 100), count: v.count })).sort((a, b) => b.avgScore - a.avgScore);
    const maxVS = sortedVendors.length ? sortedVendors[0].avgScore : 1;
    const riskColor = results.score > 70 ? P.red : results.score > 50 ? P.amber : results.score > 30 ? P.indigo : P.green;
    const sovTotal = Object.values(results.sovereigntyBreakdown).reduce((a, b) => a + b, 0) || 1;

    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: P.bg, color: P.text, minHeight: "100vh" }}>
        <style>{css}</style>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", borderBottom: `1px solid ${P.borderLight}`, background: "rgba(250,248,245,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
          <Logo size="sm" />
          <button onClick={() => { setPage("audit"); setStep(1); }} style={btnOutline}>← Modifier</button>
        </nav>

        <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 24px" }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, fontWeight: 400, marginBottom: 6, color: P.navy }}>Résultats de votre audit</h1>
          {orgName && <p style={{ fontSize: 14, color: P.textMuted, marginBottom: 32 }}>{orgName} · {selectedProducts.length} produits analysés</p>}

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { label: "Score de dépendance", value: `${results.score}/100`, color: riskColor },
              { label: "Niveau de risque", value: results.risk, color: riskColor },
              { label: "Produits analysés", value: `${selectedProducts.length}`, color: P.indigo },
              { label: "Hausse tarifaire moy.", value: `+${results.avgHausse}%/an`, color: P.amber },
            ].map((c, i) => (
              <div key={i} style={{ ...card, animation: `fadeUp 0.4s ${i * 0.06}s both` }}>
                <div style={{ fontSize: 11, color: P.textLight, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>{c.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* Souveraineté */}
          <div style={{ ...card, marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: P.navy }}>🌍 Souveraineté des données</h3>
            <div style={{ display: "flex", gap: 0, marginBottom: 14, height: 10, borderRadius: 5, overflow: "hidden" }}>
              {Object.entries(results.sovereigntyBreakdown).map(([sov, count]) => (
                <div key={sov} style={{ width: `${(count / sovTotal) * 100}%`, background: SOV[sov]?.color || P.textLight, transition: "width 0.5s" }} />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {Object.entries(results.sovereigntyBreakdown).map(([sov, count]) => {
                const info = SOV[sov] || SOV["mixed"];
                return (
                  <div key={sov} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 16 }}>{info.flag}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: P.navy }}>{info.label}</span>
                    <span style={{ fontSize: 12, color: P.textMuted }}>{count} · {Math.round((count / sovTotal) * 100)}%</span>
                  </div>
                );
              })}
            </div>
            {(results.sovereigntyBreakdown["us"] || 0) / sovTotal > 0.7 && (
              <div style={{ marginTop: 14, padding: "11px 16px", borderRadius: 8, background: "rgba(67,97,238,0.05)", border: `1px solid ${P.indigoBorder}`, fontSize: 13, color: P.navyLight, lineHeight: 1.5 }}>
                ⚠️ Plus de 70% de vos logiciels dépendent de la juridiction américaine (Cloud Act, FISA 702). Risque de souveraineté élevé.
              </div>
            )}
            {(results.sovereigntyBreakdown["cn"] || 0) > 0 && (
              <div style={{ marginTop: 8, padding: "11px 16px", borderRadius: 8, background: P.redSoft, border: "1px solid rgba(193,18,31,0.12)", fontSize: 13, color: P.navyLight, lineHeight: 1.5 }}>
                🇨🇳 {results.sovereigntyBreakdown["cn"]} produit(s) sous juridiction chinoise — données potentiellement accessibles par les autorités locales.
              </div>
            )}
          </div>

          {/* Éditeurs */}
          {sortedVendors.length > 0 && (
            <div style={{ ...card, marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: P.navy }}>🏢 Dépendance par éditeur</h3>
              {sortedVendors.slice(0, 10).map((v, i) => (
                <div key={i} style={{ marginBottom: 12, animation: `slideIn 0.3s ${i * 0.04}s both` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: P.navy }}>{v.name} <span style={{ color: P.textLight, fontWeight: 400 }}>({v.count})</span></span>
                    <span style={{ color: v.avgScore > 70 ? P.red : v.avgScore > 50 ? P.amber : P.green, fontWeight: 700 }}>{v.avgScore}/100</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: P.bgAlt }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(v.avgScore / maxVS) * 100}%`, background: v.avgScore > 70 ? P.red : v.avgScore > 50 ? P.amber : P.green, transition: "width 0.5s" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Produits + alternatives */}
          <div style={{ ...card, marginBottom: 28 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: P.navy }}>🔀 Produits analysés & alternatives</h3>
            {selectedProducts.map((p, i) => {
              const si = SOV[p.sovereignty] || SOV["mixed"];
              return (
                <div key={i} style={{ padding: 14, marginBottom: 10, borderRadius: 10, background: P.bg, border: `1px solid ${P.borderLight}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: P.navy }}>{p.name}</span>
                    <span style={{ fontSize: 12, color: P.textMuted }}>{si.flag} {si.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 14, marginBottom: 8, fontSize: 12, color: P.textMuted }}>
                    <span>Risque {riskDots(p.riskLevel)}</span>
                    <span>Lock-in {riskDots(p.lockIn)}</span>
                    {p.hausse > 0 && <span style={{ color: P.amber }}>+{p.hausse}%/an</span>}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(p.alternatives || []).map((a: any, j: number) => (
                      <span key={j} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: P.greenSoft, border: `1px solid ${P.greenBorder}`, color: P.green }}>✓ {a.name} ({a.maturity}/5)</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Email optionnel */}
          <div style={{ ...card, background: P.indigoSoft, border: `1px solid ${P.indigoBorder}`, textAlign: "center", marginBottom: 28 }}>
            {emailSent ? (
              <div><div style={{ fontSize: 28, marginBottom: 6 }}>✓</div><div style={{ fontWeight: 700, fontSize: 15, color: P.navy }}>Merci !</div><div style={{ fontSize: 13, color: P.textMuted, marginTop: 4 }}>Rapport PDF envoyé à {emailForPdf}</div></div>
            ) : (
              <>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: P.navy }}>Recevez votre rapport PDF</div>
                <div style={{ fontSize: 13, color: P.textMuted, marginBottom: 14 }}>Optionnel — un rapport détaillé avec recommandations personnalisées.</div>
                <div style={{ display: "flex", gap: 10, maxWidth: 420, margin: "0 auto" }}>
                  <input type="email" placeholder="votre@email.com" value={emailForPdf} onChange={(e) => setEmailForPdf(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                  <button onClick={() => { if (emailForPdf.includes("@")) { notify({ type: "lead", email: emailForPdf, orgName, products: selectedProducts.map(p => p.name), score: results.score }); setEmailSent(true); } }} style={{ ...btnPrimary, padding: "12px 20px", fontSize: 13 }}>Envoyer</button>
                </div>
              </>
            )}
          </div>

          {/* Questionnaire de satisfaction */}
          <div style={{ ...card, marginBottom: 28 }}>
            {satisfactionSent ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🙏</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: P.navy, marginBottom: 4 }}>Merci pour votre retour !</div>
                <div style={{ fontSize: 13, color: P.textMuted }}>Votre avis nous aide à améliorer LibreAudit.</div>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: P.navy }}>📝 Votre avis compte</h3>
                <p style={{ fontSize: 13, color: P.textMuted, marginBottom: 16 }}>Comment évaluez-vous cette expérience d&apos;audit ?</p>

                {/* Score 1-10 */}
                <div style={{ display: "flex", gap: 6, marginBottom: 16, justifyContent: "center" }}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <button key={n} onClick={() => setSatisfaction(n)} style={{
                      width: 40, height: 40, borderRadius: 8, fontSize: 14, fontWeight: 700,
                      border: satisfaction === n ? `2px solid ${P.indigo}` : `1.5px solid ${P.border}`,
                      background: satisfaction === n ? P.indigo : P.surface,
                      color: satisfaction === n ? "#fff" : satisfaction !== null && n <= satisfaction ? P.indigo : P.textMuted,
                      cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s",
                    }}>{n}</button>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: P.textLight, marginBottom: 16, padding: "0 4px" }}>
                  <span>Pas satisfait</span>
                  <span>Très satisfait</span>
                </div>

                {/* Commentaire optionnel */}
                {satisfaction !== null && (
                  <div style={{ animation: "fadeUp 0.3s" }}>
                    <textarea
                      value={satisfactionComment}
                      onChange={(e) => setSatisfactionComment(e.target.value)}
                      placeholder="Un commentaire, une suggestion ? (optionnel)"
                      rows={3}
                      style={{
                        ...inputStyle, resize: "vertical" as any, marginBottom: 12,
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                      }}
                    />
                    <button
                      onClick={() => {
                        notify({ type: "satisfaction", satisfaction, comment: satisfactionComment, score: results.score, orgName, products: selectedProducts.length });
                        setSatisfactionSent(true);
                      }}
                      style={{ ...btnPrimary, width: "100%", padding: "11px" }}
                    >Envoyer mon avis</button>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => { setPage("landing"); setSelectedProducts([]); setStep(0); setOrgName(""); setUserCount(""); setEmailForPdf(""); setEmailSent(false); setSatisfaction(null); setSatisfactionComment(""); setSatisfactionSent(false); }} style={btnOutline}>↻ Relancer un diagnostic</button>
          </div>
        </div>
      </div>
    );
  }


  // ═══════ AUDIT ═══════
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: P.bg, color: P.text, minHeight: "100vh" }}>
      <style>{css}</style>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", borderBottom: `1px solid ${P.borderLight}`, background: "rgba(250,248,245,0.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <Logo size="sm" />
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: P.textMuted, fontWeight: 500 }}>{selectedProducts.length} produit{selectedProducts.length > 1 ? "s" : ""}</span>
          <button onClick={() => setPage("landing")} style={btnOutline}>← Accueil</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Steps */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
          {["Paramètres", "Sélection des produits"].map((s, i) => (
            <div key={i} onClick={() => { if (i <= step || (i === 1 && orgName)) setStep(i); }} style={{ flex: 1, textAlign: "center", padding: "11px", cursor: "pointer", borderBottom: step === i ? `2.5px solid ${P.indigo}` : `1px solid ${P.borderLight}`, color: step === i ? P.indigo : P.textLight, fontSize: 13, fontWeight: step === i ? 700 : 500, transition: "all 0.2s" }}>{i + 1}. {s}</div>
          ))}
        </div>

        {step === 0 && (
          <div style={{ maxWidth: 480, margin: "0 auto", animation: "fadeUp 0.4s" }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 24, color: P.navy }}>Paramètres de l&apos;audit</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: P.textMuted, display: "block", marginBottom: 6 }}>Nom de l&apos;organisation</label>
              <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Ex: Groupe Banque Populaire" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: P.textMuted, display: "block", marginBottom: 6 }}>Nombre d&apos;utilisateurs IT (optionnel)</label>
              <input value={userCount} onChange={(e) => setUserCount(e.target.value)} placeholder="Ex: 500" type="number" style={inputStyle} />
            </div>
            <button onClick={() => setStep(1)} disabled={!orgName} style={{ ...btnPrimary, width: "100%", opacity: orgName ? 1 : 0.4, cursor: orgName ? "pointer" : "not-allowed" }}>Continuer →</button>
          </div>
        )}

        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "210px 1fr 270px", gap: 20 }}>
            {/* Categories */}
            <div style={{ borderRight: `1px solid ${P.borderLight}`, paddingRight: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: P.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Catégories</div>
              {CATEGORIES.map((c) => {
                const count = selectedProducts.filter((p) => (PROPRIETARY_DB[c.id] || []).some((db: any) => db.name === p.name)).length;
                return (
                  <div key={c.id} onClick={() => { setActiveCat(c.id); setSearchTerm(""); }} style={{ padding: "9px 10px", borderRadius: 8, marginBottom: 3, cursor: "pointer", background: activeCat === c.id ? P.indigoSoft : "transparent", border: activeCat === c.id ? `1px solid ${P.indigoBorder}` : "1px solid transparent", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.12s" }}>
                    <span style={{ fontSize: 12.5, fontWeight: activeCat === c.id ? 700 : 500, color: activeCat === c.id ? P.indigo : P.textMuted }}>{c.icon} {c.label}</span>
                    {count > 0 && <span style={{ fontSize: 10, fontWeight: 700, color: P.indigo, background: P.indigoSoft, padding: "1px 5px", borderRadius: 4 }}>{count}</span>}
                  </div>
                );
              })}
            </div>

            {/* Products */}
            <div>
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher un produit..." style={{ ...inputStyle, marginBottom: 14 }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10 }}>
                {filteredProducts.map((p: any, i: number) => {
                  const selected = selectedProducts.some((x) => x.name === p.name);
                  const si = SOV[p.sovereignty] || SOV["mixed"];
                  return (
                    <div key={i} onClick={() => toggleProduct(p)} style={{ padding: 14, borderRadius: 10, cursor: "pointer", transition: "all 0.12s", background: selected ? P.indigoSoft : P.surface, border: selected ? `1.5px solid ${P.indigoBorder}` : `1px solid ${P.borderLight}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: P.navy }}>{p.name}</span>
                        <span style={{ fontSize: 14, color: selected ? P.indigo : P.borderLight }}>{selected ? "✓" : "○"}</span>
                      </div>
                      <div style={{ fontSize: 11, color: P.textMuted, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span>Risque {p.riskLevel}/5</span><span>·</span><span>Lock-in {p.lockIn}/5</span><span>·</span><span>{si.flag} {si.label}</span>
                      </div>
                      {p.alternatives?.length > 0 && (
                        <div style={{ marginTop: 5, display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {p.alternatives.slice(0, 2).map((a: any, j: number) => (
                            <span key={j} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: P.greenSoft, color: P.green, fontWeight: 500 }}>→ {a.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div style={{ borderLeft: `1px solid ${P.borderLight}`, paddingLeft: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: P.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Sélection ({selectedProducts.length})</div>
              {selectedProducts.length > 0 && (
                <div>
                  <div style={{ ...card, padding: 16, marginBottom: 10, background: P.bg }}>
                    <div style={{ fontSize: 11, color: P.textLight, marginBottom: 4 }}>Score actuel</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: results.score > 70 ? P.red : results.score > 50 ? P.amber : P.green }}>{results.score}/100</div>
                    <div style={{ fontSize: 11, color: P.textMuted, marginTop: 3 }}>{results.risk}</div>
                  </div>
                  {selectedProducts.map((p, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", marginBottom: 3, borderRadius: 6, background: P.bg, fontSize: 12, border: `1px solid ${P.borderLight}` }}>
                      <span style={{ fontWeight: 600, color: P.navy, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as any }}>{p.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); toggleProduct(p); }} style={{ background: "none", border: "none", color: P.textLight, cursor: "pointer", fontSize: 14, padding: "0 4px" }}>×</button>
                    </div>
                  ))}
                  <button onClick={() => { setPage("results"); notify({ type: "audit", orgName, products: selectedProducts.map(p => p.name), score: results.score, risk: results.risk }); }} style={{ ...btnPrimary, width: "100%", marginTop: 14, padding: "11px" }}>Voir les résultats →</button>
                </div>
              )}
              {selectedProducts.length === 0 && (
                <div style={{ textAlign: "center", padding: "36px 10px", color: P.textLight }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Aucun produit sélectionné</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>Cliquez sur les produits à gauche</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
