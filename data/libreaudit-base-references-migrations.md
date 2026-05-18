# LibreAudit — Base de Références Migrations & Alternatives Open Source

> Ce document constitue la base de données de référence pour le moteur de recommandation de LibreAudit.  
> Pour chaque solution propriétaire : alternative open source, cas réels de migration, économies documentées, points de vigilance.  
> Inclut les champs de saisie prospect pour le questionnaire (redevance annuelle, MIPS, etc.)

---

## CHAMPS DE SAISIE PROSPECT (QUESTIONNAIRE)

Pour chaque logiciel/système déclaré par le prospect, le questionnaire doit capturer :

### Champs communs à toutes les catégories
| Champ | Type | Description | Exemple |
|---|---|---|---|
| `nom_solution` | Select / Texte libre | Nom du logiciel propriétaire utilisé | "SAP ECC", "Oracle 19c" |
| `editeur` | Auto (déduit) | Éditeur / Vendor | "IBM", "Microsoft", "Oracle" |
| `categorie` | Auto (déduit) | Catégorie fonctionnelle | "ERP", "Base de données" |
| `redevance_annuelle` | Nombre (€) | Coût total annuel (licences + maintenance + support) | 150 000 € |
| `nb_utilisateurs` | Nombre | Nombre d'utilisateurs / postes concernés | 500 |
| `cout_par_utilisateur` | Auto (calculé) | redevance_annuelle / nb_utilisateurs | 300 €/user/an |
| `contrat_fin` | Date | Date de fin du contrat en cours | 2027-06-30 |
| `criticite` | Select (1-5) | Criticité métier (1=faible, 5=vital) | 5 |
| `satisfaction` | Select (1-5) | Satisfaction actuelle (1=mauvaise, 5=excellente) | 3 |
| `personnalisations` | Select | Niveau de personnalisation (Standard / Modéré / Fortement customisé) | "Fortement customisé" |
| `integrations` | Texte libre | Systèmes intégrés avec cette solution | "SAP, AD, Oracle DB" |

### Champs spécifiques MAINFRAME
| Champ | Type | Description | Exemple |
|---|---|---|---|
| `mips_total` | Nombre | Nombre total de MIPS consommés | 5 000 |
| `cout_par_mips` | Nombre (€) | Coût annuel par MIPS | 1 600 € |
| `modele_tarification` | Select | R4HA / Tailored Fit Pricing / Full Capacity | "R4HA" |
| `nb_lpar` | Nombre | Nombre de partitions logiques (LPAR) | 12 |
| `langages_legacy` | Multi-select | COBOL, PL/I, Assembler, Pacbase, RPG | ["COBOL", "PL/I"] |
| `lignes_code` | Nombre | Volume estimé de code legacy (en milliers de lignes) | 2 000 KLOC |
| `modele_machine` | Select | IBM z15, z16, AS/400, etc. | "IBM z16" |
| `workloads` | Multi-select | Batch, OLTP, CICS, IMS, DB2 | ["Batch", "CICS", "DB2"] |

### Champs spécifiques ITSM
| Champ | Type | Description | Exemple |
|---|---|---|---|
| `modules_itsm` | Multi-select | Incident, Problem, Change, CMDB, Asset, Request, Knowledge | ["Incident", "Change", "CMDB"] |
| `nb_tickets_mois` | Nombre | Volume mensuel de tickets | 3 000 |
| `nb_agents` | Nombre | Nombre d'agents / techniciens | 25 |
| `sla_critique` | Oui/Non | SLAs contractuels avec pénalités ? | Oui |
| `integrations_itsm` | Multi-select | AD, SCCM, monitoring, email, Slack/Teams | ["AD", "SCCM", "Nagios"] |

### Champs spécifiques BASE DE DONNÉES
| Champ | Type | Description | Exemple |
|---|---|---|---|
| `volume_donnees` | Nombre (TB) | Volume total des données | 15 TB |
| `nb_bases` | Nombre | Nombre d'instances / bases | 45 |
| `plsql_volume` | Nombre (KLOC) | Volume de code PL/SQL ou T-SQL | 250 KLOC |
| `haute_dispo` | Select | RAC, Always On, Data Guard, Patroni, aucun | "Oracle RAC" |

---

## 1. BUREAUTIQUE

### Microsoft Office → LibreOffice

**Alternative** : LibreOffice (Writer, Calc, Impress, Draw, Base)

**Cas de migration documentés :**

| Organisation | Échelle | Résultats | Source |
|---|---|---|---|
| Land Schleswig-Holstein (Allemagne) | 25 000+ postes | 80% migrés, >15M€ économies licences, propriétaire <10% | pupuweb.com (déc. 2025) |
| Gendarmerie Nationale (France) | 70 000+ postes | Migration complète vers GendBuntu + LibreOffice, ~2M€/an économies | interoperable-europe.ec.europa.eu |
| Assemblée Nationale (France) | 1 145 postes | Migration 2007 vers Ubuntu + LibreOffice | edri.org |
| Ministère de la Justice (Finlande) | Ministère complet | Migration documentée vers OpenOffice.org dès 2007 | Université de Tampere |

**Économies typiques** : 50-200€/poste/an en licences. TCO réduit de 30-40% sur 5 ans.

**Points de vigilance** :
- Macros Excel/VBA : nécessitent réécriture ou désactivation sécurité macro
- LibreOffice Impress : moins mature que PowerPoint pour présentations complexes
- Configurer les formats MS Office par défaut pendant la transition
- Formation : 1-2 jours suffisent pour la majorité des utilisateurs

---

## 2. SYSTÈME D'EXPLOITATION

### Windows → Linux (Ubuntu / Debian / Red Hat)

**Alternatives** : Ubuntu, Debian, RHEL, Rocky Linux

**Cas de migration documentés :**

| Organisation | Échelle | Résultats | Source |
|---|---|---|---|
| Gendarmerie Nationale (France) | 90 000+ postes | GendBuntu depuis 2008, 17+ ans continu, 2M€/an, TCO -40% | techhq.com |
| DINUM / État Français | 2,5M postes (objectif) | Directive avril 2026, plans automne 2026, >40M€ économies projetées | techhq.com |
| Ville de Munich (LiMux) | 15 000 postes | Migration puis retour — erreurs à éviter | Presse tech |
| Assemblée Nationale (France) | 1 145 postes | Migration Ubuntu 2007 | edri.org |

**Stratégie clé** : Migrer applications AVANT l'OS (Firefox, LibreOffice sur Windows d'abord). Méthode Gendarmerie, citée comme modèle par la DINUM.

**Économies typiques** : 100-300€/poste/an. Jusqu'à 40% réduction TCO global.

---

## 3. MESSAGERIE / GROUPWARE

### Microsoft Exchange / Outlook → Zimbra / BlueMind

**Alternatives** : Zimbra, BlueMind, SOGo, Open-Xchange

**Cas de migration documentés :**

| Organisation | Échelle | Résultats | Source |
|---|---|---|---|
| Schleswig-Holstein | 44 000 comptes | Migration vers Open-Xchange réussie | pupuweb.com |
| Université de Lorraine (France) | 110 000 boîtes | Zimbra, productivité et administration améliorées | zimbra.com |
| Kyoto University of Education | 2 000 comptes | Migration 5 mois, 2FA intégrée | zimbra.com |
| IHR LABOR (Autriche, santé) | 300 employés | Exchange → Zimbra, TCO < M365, souveraineté données | zimbra.com |

**Contexte** : Fin de support Exchange 2019 le 14 octobre 2025.

**Économies typiques** : 30-60% de réduction vs Exchange/M365.

---

## 4. ERP / CRM

### SAP → ERPNext / Odoo

**Alternatives** : ERPNext (GPL v3, 0€ licence), Odoo Community

**Cas de migration documentés :**

| Organisation | Échelle | Résultats | Source |
|---|---|---|---|
| Uratom Solar | PME industrielle | SAP → ERPNext réussi | sigzen.com |
| Fournisseur auto (anonymisé) | Entreprise industrielle | SAP R/3 → Linux, dispo 99,81%, temps réponse 1000→594ms | coforgetech.com |
| Client DataPatrol (manufacturing) | PME | Réduction TCO 75%, économies 3,8M$ | datapatroltech.com |

**Économies typiques** : ERPNext = 0€ licence. Réduction TCO 60-80% pour PME/ETI.

---

## 5. BASE DE DONNÉES

### Oracle Database → PostgreSQL

**Alternatives** : PostgreSQL, MariaDB, CockroachDB

**Cas de migration documentés :**

| Organisation | Échelle | Résultats | Source |
|---|---|---|---|
| Apollo Hospitals (Inde) | 25 ans de données | Oracle → PostgreSQL Azure, 18 mois, agents IA | itnext.io (avril 2026) |
| LATAM Airlines | 17 TB | Oracle → PostgreSQL, 98% automatisation | newtglobal.com (avril 2026) |
| Multinationale UK (biens conso) | 70+ bases Oracle | Cloud SQL-PostgreSQL via HCLTech | hcltech.com |
| OptiSol (cas client) | 10 TB | Oracle → PostgreSQL, -80% coûts | optisolbusiness.com |

**Outils** : Ora2PG (open source), AWS SCT, Azure DMA

**Économies typiques** : 70-80% réduction coûts licence. PostgreSQL = 0€.

**Coûts Oracle typiques** : 5-8% augmentation annuelle, ~50K$/cœur processeur.

---

## 6. MAINFRAME / LEGACY

### IBM z/OS, AS/400, COBOL → Cloud / Open Source

**Alternatives** : Migration vers Linux (cloud ou on-prem), GnuCOBOL, microservices Java/Python

**Données de coût MIPS :**

| Tranche MIPS | Coût annuel par MIPS | Coût total annuel estimé |
|---|---|---|
| < 1 000 MIPS | 2 000 - 4 500 €/MIPS | 2M - 4,5M € |
| 1 000 - 5 000 MIPS | 1 600 - 2 000 €/MIPS | 1,6M - 10M € |
| 5 000 - 11 000 MIPS | 1 000 - 1 600 €/MIPS | 5M - 17,6M € |
| > 11 000 MIPS | 1 000 - 1 600 €/MIPS | 11M - 25M+ € |

**Répartition des coûts mainframe** : ~20% hardware, ~40% software (licences IBM/Broadcom/BMC), ~40% personnel et opérations.

**Cas de migration documentés :**

| Organisation | Échelle | Résultats | Source |
|---|---|---|---|
| Agence gouvernementale US | 24 000 MIPS | z/OS → Linux, élimination ~25M$/an coûts mainframe | mlogica.com |
| Banque Tier-1 US | Non communiqué | -28% MIPS facturés, 12M$/an redirigés vers IA fraude | royalcyber.com (2025) |
| Assureur européen (Deloitte) | Non communiqué | Refactoring automatisé, -80% coûts opérationnels | Deloitte |

**Coûts de migration typiques :**

| Approche | Coût | Durée | Économies |
|---|---|---|---|
| Rehosting (émulateur) | ~600K$ | 6-12 mois | 40-60% infra |
| Refactoring automatisé | ~2,2M$ | 12-24 mois | 50-80% |
| Rearchitecting complet | ~4M$ | 24-48 mois | 70-90% |

**Chiffres clés 2026** :
- 92% des développeurs COBOL partent en retraite d'ici 2030
- Automatisation COBOL→Java : 70-85% (était 40% en 2020)
- AWS Blu Age : 0,10$/ligne après 120K lignes gratuites
- IDC 2025 : +40% productivité dev, -25% coûts opérationnels post-modernisation
- Surcoût compliance (banque, santé, gouvernement) : +20-40%

**Points de vigilance** :
- VSAM → PostgreSQL : partie la plus complexe
- Calculs financiers : COMP-3 → BigDecimal obligatoire en Java
- Tests UAT : allouer 40% du budget
- Run parallèle 6+ mois avant décommissionnement
- Talent COBOL : 150K+$/an, délais recrutement >12 mois

---

## 7. ITSM (IT Service Management)

### ServiceNow / BMC Remedy → GLPI / iTop / Zammad

**Alternatives :**

| Solution Open Source | Forces | Licence |
|---|---|---|
| **GLPI** | ITSM complet (Incident, Change, Problem, CMDB, Asset), leader OS | GPL v2 |
| **iTop** | CMDB puissant, conformité ITIL, interface web moderne | AGPL v3 |
| **Zammad** | Helpdesk moderne, UX excellente, multicanal | AGPL v3 |
| **OTRS (Community)** | ITSM classique, très répandu en Allemagne | GPL v3 |
| **FreeScout** | Helpdesk léger, alternative Zendesk | AGPL v3 |

**Cas de migration documentés :**

| Organisation | Migration | Résultats | Source |
|---|---|---|---|
| Multiples entreprises (Altnix) | ServiceNow → GLPI | Migrations réussies, milliers d'assets et utilisateurs | altnix.com |
| PME/ETI Microsoft-centric | ServiceNow → alternatives | -50-60% TCO, déploiement 6-12 semaines vs 6-12 mois | i3solutions.com |

**Coûts ServiceNow vs Open Source :**

| Critère | ServiceNow | GLPI / iTop (auto-hébergé) |
|---|---|---|
| Licence par agent/an | 100-200€+ (sur devis) | 0€ |
| Modules IA (Now Assist) | Add-on premium | N/A |
| Délai implémentation | 6-12 mois | 4-12 semaines |
| Coût migration | N/A | 150K-500K$ selon complexité |
| Break-even | N/A | 18-24 mois |

**Modules GLPI** : Incidents, Problèmes, Changements, CMDB, Asset Management (ITAM), Catalogue de services, Base de connaissances, Contrats/Fournisseurs, Parc informatique.

**Points de vigilance** :
- Workflows complexes : ServiceNow très avancé, GLPI nécessite plugins
- CMDB Discovery : ServiceNow natif puissant vs GLPI Agent/FusionInventory
- IA/ML : ServiceNow en avance, alternatives OS en retard
- Self-service portal : vérifier parité UX
- Intégrations : mapper chaque workflow actif

---

## 8. ANNUAIRE / IDENTITÉ

### Active Directory → FreeIPA / OpenLDAP

**Alternatives** : FreeIPA (Red Hat IdM), OpenLDAP, Samba AD, Zentyal

| Organisation | Contexte | Résultats | Source |
|---|---|---|---|
| Projet GNOME | Communauté OSS | OpenLDAP → FreeIPA | freeipa.org |
| Universités multiples | Linux | LDAP → FreeIPA via ipa migrate-ds | Red Hat docs |
| Gendarmerie Nationale | 70 000+ postes | Hors AD | OSOR / UE |

**Économies** : Windows Server CAL + AD = 30-50€/user/an. FreeIPA = 0€.

---

## 9. CLOUD / COLLABORATION

### Microsoft 365 / Google Workspace → Nextcloud / OnlyOffice

**Alternatives** : Nextcloud, OnlyOffice, Collabora Online

| Organisation | Contexte | Résultats | Source |
|---|---|---|---|
| État Français (DINUM) | Administration | Tchap, France Transfert, Visio | techhq.com |
| Schleswig-Holstein | 25 000+ postes | Remplacement complet M365 | pupuweb.com |

**Économies** : M365 E3 = ~30€/user/mois. Nextcloud = coût infra uniquement.

---

## 10. SÉCURITÉ

| Propriétaire | Alternative OS | Domaine |
|---|---|---|
| CrowdStrike / Symantec | ClamAV, Wazuh | Antivirus / EDR / XDR |
| Splunk | Elastic Stack (ELK), Graylog | SIEM |
| Fortinet / Palo Alto | pfSense, OPNsense | Pare-feu |
| CyberArk | HashiCorp Vault | PAM |
| Nessus | OpenVAS (Greenbone) | Scanner vulnérabilités |

---

## 11. OUTILS DE DÉVELOPPEMENT

| Propriétaire | Alternative OS | Cas d'usage |
|---|---|---|
| GitHub Enterprise | GitLab CE, Gitea, Forgejo | Code |
| Jira | Taiga, OpenProject, Plane | Projet |
| Confluence | BookStack, Wiki.js, Outline | Documentation |

---

## 12. VIRTUALISATION / CONTENEURS

| Propriétaire | Alternative OS | Cas d'usage |
|---|---|---|
| VMware vSphere | Proxmox VE, oVirt | Hyperviseur |
| Docker Desktop (payant) | Podman, containerd | Conteneurs |
| K8s managé (EKS/AKS) | K3s, MicroK8s | Orchestration |

**Contexte** : Rachat VMware par Broadcom → explosion tarifs → exode vers Proxmox.

---

## 13. ÉDITIQUE / GED

| Propriétaire | Alternative OS | Cas d'usage |
|---|---|---|
| SharePoint | Alfresco CE, Nuxeo | GED / ECM |
| Adobe Acrobat Pro | PDFsam, LibreOffice Draw | PDF |
| OpenText | LogicalDOC, Mayan EDMS | Gestion doc |

---

## 14. VISIOCONFÉRENCE / MESSAGERIE

| Propriétaire | Alternative OS | Cas d'usage |
|---|---|---|
| Teams | Element (Matrix), Rocket.Chat, Mattermost | Messagerie + visio |
| Zoom | Jitsi Meet, BigBlueButton | Visio |
| Cisco Webex | Jitsi Meet | Visio |

**France** : État utilise Tchap (Matrix) et Visio DINUM.

---

## 15. MONITORING / SUPERVISION

| Propriétaire | Alternative OS | Cas d'usage |
|---|---|---|
| Datadog | Prometheus + Grafana | Monitoring |
| New Relic | Jaeger, SigNoz | APM |
| PagerDuty | Alertmanager | Alerting |
| Nagios XI | Checkmk, Zabbix | Supervision |

---

## SYNTHÈSE — SCORING LIBREAUDIT

| Catégorie | Économie typique | Complexité (1-5) | Maturité alt. (1-5) |
|---|---|---|---|
| Bureautique | 50-200€/poste/an | 2 | 5 |
| OS Desktop | 100-300€/poste/an | 4 | 4 |
| Messagerie | 30-60% vs Exchange | 3 | 4 |
| ERP | 60-80% TCO | 5 | 3 |
| Base de données | 70-80% licences | 4 | 5 |
| **Mainframe** | **1 000-4 500€/MIPS/an** | **5** | **3** |
| **ITSM** | **50-60% vs ServiceNow** | **3** | **4** |
| Annuaire/Identité | 30-50€/user/an | 3 | 3 |
| Cloud/Collab | ~30€/user/mois | 3 | 4 |
| Sécurité | Variable | 3 | 4 |
| Dev Tools | Variable | 2 | 5 |
| Virtualisation | Jusqu'à 90% post-Broadcom | 3 | 4 |
| Éditique/GED | Variable | 2 | 3 |
| Visioconférence | 10-30€/user/mois | 2 | 4 |
| Monitoring | 50-80% vs SaaS | 2 | 5 |

---

## FORMULES DE CALCUL POUR LE RAPPORT

### Score de dépendance global
```
score_dependance = Σ (criticite × poids_categorie × (1 - maturite_alternative/5))
```

### Estimation économies annuelles
```
economie_estimee = Σ (redevance_annuelle × taux_economie_categorie)
```

### Coût estimé mainframe
```
cout_mainframe_annuel = mips_total × cout_par_mips
economie_potentielle_cloud = cout_mainframe_annuel × 0.5 à 0.9
investissement_migration = lignes_code × cout_par_kloc × facteur_complexite
roi_mois = investissement_migration / (economie_potentielle_cloud / 12)
```

### Coût ITSM estimé
```
cout_itsm_actuel = nb_agents × cout_licence_par_agent_an
economie_itsm = cout_itsm_actuel × 0.5 à 0.6
```

---

*Document mis à jour le 15 mai 2026 — Sources vérifiées via recherche web.*  
*À intégrer dans le moteur LibreAudit : questionnaire, scoring, rapport PDF.*
