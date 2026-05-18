# LibreAudit — Taux de Hausse Annuelle par Éditeur + IA Enterprise (Données Marché 2022-2026)

> Ces taux sont utilisés par le moteur LibreAudit pour la projection sur 5 ans.
> Sources : Redress Compliance, Forrester, SAMexpert, Gartner, OpenAI, Microsoft, Google, Anthropic, presse spécialisée.

---

## TAUX DE HAUSSE ANNUELLE PAR ÉDITEUR CLASSIQUE

| Éditeur | Produits | Taux annuel | Source / Détail |
|---|---|---|---|
| **Oracle** (DB, Middleware) | Oracle Database, WebLogic, support on-prem | **8%** (était 3-4% avant 2022) | Redress Compliance 2026. 1M€ → 1.47M€ en 5 ans |
| **Oracle** (Java) | Java SE Universal Subscription | **Choc modèle 2023 : +200 à 700%** | Passage per-employee. Non linéaire. |
| **SAP** | ERP ECC, S/4HANA, support | **3.3-5%** support, **5-7%** cloud renewal | Forrester 2024 : +5%. Extended maintenance +2%. |
| **Microsoft** (M365) | M365 E3/E5, Office 365 | **8-10%** (effectif **15-23%** grands comptes) | SAMexpert mai 2026 : suppression EA volumes + hausse = ~20% effectif |
| **Microsoft** (Dynamics) | Dynamics 365 | **10-20%** (one-shot oct 2024) | D365 Sales : $95→$105 (+11%) |
| **IBM** (Mainframe) | z/OS, CICS, DB2, MIPS | **5-8%** | Tailored Fit Pricing masque la hausse |
| **Broadcom** (ex-VMware, CA) | VMware, CA mainframe | **×2 à ×12** (one-shot post-rachat) | 2024-2025 constaté |
| **ServiceNow** | ITSM, ITOM | **7-10%** | Pas de tarifs publics |
| **Salesforce** | CRM, Platform | **7-9%** | Par cycle de renewal |
| **Atlassian** | Jira, Confluence | **5-7%** (+ fin Server) | Data Center +15%. Cloud +5-7%/an. |
| **Adobe** | Creative Cloud | **5-8%** | ~6% en 2023 et 2024 |
| **Cisco** | Réseau, sécurité | **5-8%** | Transition abonnements |
| **Symantec/Broadcom** | Endpoint, DLP | **10-15%** | Post-rachat Broadcom |

---

## IA GÉNÉRATIVE & ASSISTANTS IA ENTERPRISE — PANORAMA PRIX 2026

### Grille tarifaire comparée (mai 2026)

| Solution | Plan Individual | Plan Team/Business | Plan Enterprise | Coût réel/user/mois* | Modèle de pricing |
|---|---|---|---|---|---|
| **ChatGPT (OpenAI)** | Free: 0€ / Go: 8$ / Plus: 20$ / Pro: 100-200$ | Business: 20$/user/mois | Enterprise: ~60$/user/mois (négocié, min 150 seats) | 20-60$ | Per-seat + API au token |
| **Microsoft 365 Copilot** | Copilot Pro: 20$/mois | Business: 18-21$/seat/mois (add-on) | Enterprise: 30$/seat/mois (add-on) | **42-87$** (M365 E3/E5 requis + Copilot) | Per-seat add-on (M365 obligatoire) |
| **Google Gemini** | Gemini Advanced: 20$/mois | Gemini Business: 21-24$/user/mois | Gemini Enterprise: 30-36$/user/mois | 21-36$ | Per-seat add-on (Workspace) |
| **Claude (Anthropic)** | Free / Pro: 20$/mois | Team: 25-30$/user/mois | Enterprise: sur devis | 20-30$+ | Per-seat + API au token |
| **GitHub Copilot** | Free (limité) / Pro: 10$/mois | Business: 19$/user/mois | Enterprise: sur devis | 10-39$ (Pro+ à 39$) | Per-seat |
| **Perplexity AI** | Free / Pro: 20$/mois | Business: 40$/user/mois | Enterprise: sur devis | 20-40$ | Per-seat |

*\*Le "coût réel" inclut les prérequis (ex: M365 Copilot nécessite une licence M365 E3 à 36$/user AVANT d'ajouter les 30$ Copilot)*

### Évolution des prix API (OpenAI — escalade documentée)

| Date | Modèle | Coût Input/MTok | Coût Output/MTok | Tendance |
|---|---|---|---|---|
| Août 2025 | GPT-5 | 1.25$ | 10.00$ | Baseline |
| Mars 2026 | GPT-5.4 | 2.50$ | 15.00$ | **×2 en 7 mois** |
| Avril 2026 | GPT-5.5 | 5.00$ | 30.00$ | **×2 en 7 semaines** |

→ **×4 en 8 mois** sur le modèle flagship. OpenAI argue une meilleure efficacité par token, mais la tendance est à la hausse rapide des coûts d'inférence sur les modèles de pointe.

### Pratiques tarifaires — Alertes pour le prospect

| Pratique | Détail | Impact |
|---|---|---|
| **Double facturation Microsoft Copilot** | M365 E3 (36$/user) + Copilot (30$/user) = 66$/user/mois minimum. E5 + Copilot = 87$/user/mois. | Coût caché : le Copilot n'est PAS un produit standalone. Budget réel = ×2 à ×3 du prix affiché. |
| **Copilot ROI discutable** | Gartner nov 2024 : seulement 4% des clients Copilot M365 rapportent un déploiement large avec valeur significative | ROI non démontré pour la majorité. Risque de sur-investissement. |
| **Ads dans ChatGPT Free** | Depuis fév 2026, publicités contextuelles aux US sur les plans Free et Go | Modèle de monétisation qui évolue. Données d'usage exploitées. |
| **Escalade pricing API** | ×4 en 8 mois sur le modèle flagship OpenAI | Budget API imprévisible. Nécessite monitoring actif. |
| **Lock-in écosystème** | Copilot → M365 → Azure. Gemini → Workspace → GCP. ChatGPT → OpenAI API. | Chaque assistant IA renforce le lock-in sur l'écosystème de l'éditeur. |
| **Souveraineté des données** | ChatGPT Enterprise : données non utilisées pour training (opt-out). Claude Enterprise : stockage AWS région choisie. Copilot : boundary M365. | Vérifier les clauses de traitement des données. Cloud Act US pour OpenAI, Microsoft, Google. |
| **Plans "illimités" menacés** | Nick Turley (OpenAI) : plans illimités comparés à "unlimited electricity" — potentiel de suppression | Risque de passage à la consommation pure. |

### Alternatives open source / souveraines à l'IA propriétaire

| IA Propriétaire | Alternative Open Source / Souveraine | Maturité | Notes |
|---|---|---|---|
| ChatGPT / GPT-5 | **Llama 3.1** (Meta), **Mistral Large** (FR), **DeepSeek** | 4/5 | Mistral = français, souverain UE. Llama = licence permissive. |
| Microsoft Copilot | **Continue.dev** + LLM local (Ollama) | 3/5 | IDE assistant open source. Fonctionne avec tout LLM. |
| GitHub Copilot | **Cody (Sourcegraph)**, **TabbyML**, **Continue.dev** | 3/5 | TabbyML = auto-hébergé. Continue = multi-LLM. |
| Google Gemini | **Mistral** (API ou auto-hébergé), **Llama** via vLLM | 4/5 | vLLM = serving open source haute performance. |
| Perplexity | **SearXNG** + LLM local | 3/5 | Moteur de recherche meta + LLM = Perplexity-like souverain. |

### Taux de hausse estimé pour l'IA enterprise

| Solution IA | Taux annuel estimé | Justification |
|---|---|---|
| **Microsoft 365 Copilot** | **10-15%** | Suit la trajectoire M365 (+8-10%) + pricing power IA. Marché immature = prix instables. |
| **ChatGPT Enterprise** | **5-10%** | Pas d'historique long. OpenAI a baissé certains prix API mais augmenté sur les modèles flagship. |
| **Google Gemini Enterprise** | **5-8%** | Suit le pricing Workspace. Google historiquement plus stable. |
| **Claude Enterprise** | **5-10%** | Marché en construction. Anthropic positionné légèrement sous OpenAI. |
| **GitHub Copilot** | **10-15%** | Pro+ lancé à 39$ (vs 10$ pour Pro). Tendance à la segmentation par tiers. |
| **Perplexity Business** | **8-12%** | Pricing agressif pour prise de marché, puis hausse probable. |
| **API inference (tous)** | **Très variable** | ×4 en 8 mois sur GPT flagship. Budget imprévisible. Monitoring obligatoire. |

---

## TAUX CONSOLIDÉS PAR CATÉGORIE (moteur LibreAudit)

```json
{
  "legacy_mainframe": 0.08,
  "cobol_legacy": 0.05,
  "middleware": 0.07,
  "erp_sap": 0.05,
  "erp_oracle": 0.08,
  "erp_other": 0.05,
  "finance_trading": 0.06,
  "finance_compta": 0.05,
  "editique_ged": 0.06,
  "os_windows": 0.08,
  "os_unix_proprietary": 0.05,
  "office_microsoft": 0.09,
  "office_google": 0.05,
  "office_adobe": 0.06,
  "email_exchange": 0.09,
  "email_slack_teams": 0.07,
  "cloud_aws": 0.05,
  "cloud_azure": 0.08,
  "cloud_gcp": 0.04,
  "db_oracle": 0.08,
  "db_sqlserver": 0.06,
  "db_mainframe": 0.08,
  "dev_atlassian": 0.06,
  "dev_github": 0.04,
  "dev_jetbrains": 0.05,
  "security_broadcom": 0.12,
  "security_cisco": 0.07,
  "itsm_servicenow": 0.08,
  "itsm_other": 0.06,
  "virtualisation_vmware": 0.15,
  "virtualisation_other": 0.05,
  "ai_microsoft_copilot": 0.12,
  "ai_chatgpt_enterprise": 0.08,
  "ai_google_gemini": 0.06,
  "ai_claude_enterprise": 0.07,
  "ai_github_copilot": 0.12,
  "ai_perplexity": 0.10,
  "ai_api_inference": 0.20
}
```

---

## FORMULE DE PROJECTION 5 ANS

```
Pour chaque produit P avec redevance annuelle R et taux T :

  Année N : R × (1 + T)^N
  Total 5 ans = Σ R × (1 + T)^n pour n = 1 à 5

  Exemple Oracle DB à 100K€/an (T=8%) :
    An 1: 108K€ | An 2: 116.6K€ | An 3: 126K€ | An 4: 136K€ | An 5: 146.9K€
    Total 5 ans : 633.6K€ (vs 500K€ sans hausse = +27%)

  Exemple M365 Copilot à 500 users × 66$/user/mois = 396K$/an (T=12%) :
    An 1: 443.5K$ | An 2: 496.7K$ | An 3: 556.3K$ | An 4: 623.1K$ | An 5: 697.8K$
    Total 5 ans : 2 817.4K$ (vs 1 980K$ sans hausse = +42%)
```

---

## ÉVÉNEMENTS DE PRIX EXCEPTIONNELS

| Événement | Produits | Alerte |
|---|---|---|
| Rachat Broadcom | VMware, CA/Symantec | ⚠️ Hausse ×2 à ×12 constatée |
| Fin de support | Exchange 2019 (oct 2025), ECC (2027) | ⚠️ Migration requise |
| Changement modèle Oracle Java | Per-employee 2023 | ⚠️ +200 à 700% |
| Suppression remises MS EA | Nov 2025 | ⚠️ +15-23% effectif |
| Migration cloud forcée | SAP S/4HANA, Atlassian | ⚠️ Migration imposée |
| Pénurie COBOL | Développeurs mainframe | ⚠️ 92% retraite d'ici 2030 |
| **Copilot ROI non prouvé** | Microsoft 365 Copilot | ⚠️ 4% de déploiements à valeur significative (Gartner) |
| **Escalade pricing API IA** | OpenAI GPT-5→5.5 | ⚠️ ×4 en 8 mois sur le flagship |
| **Pub dans ChatGPT** | Plans Free/Go | ⚠️ Exploitation données d'usage |
| **Plans illimités menacés** | ChatGPT Plus/Enterprise | ⚠️ OpenAI envisage facturation à la consommation |

---

*Document mis à jour le 16 mai 2026 — Sources vérifiées via recherche web.*
*À placer dans : `C:\Users\Milan\libreaudit\data\libreaudit-taux-hausse-editeurs.md`*
