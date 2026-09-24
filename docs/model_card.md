# FORTIVEXA Model Card: Hybrid XGBoost-GNN Predictive Cashout Forecaster

- **Model Name:** FORTIVEXA-NeuroSpatial-v2.5
- **Problem Statement:** SIH26184 (Ministry of Home Affairs / I4C)
- **Team ID / Name:** 25 / FORTIVEXA
- **TRL Stage:** TRL 5 – Technology Validated in Relevant Environment
- **Architecture:** Hybrid Graph Neural Network (Topology & Centrality) + XGBoost Multi-factor Ranker + Neuro-Symbolic Domain Heuristics

---

## 1. Intended Use
- **Primary Objective:** Forecast candidate cash withdrawal locations (ATM kiosks, branch cash counters, and e-lobbies) within a 2-to-4-hour advance window following reported citizen cyber complaints.
- **Intended Users:** Law Enforcement Agencies (LEAs), Indian Cybercrime Coordination Centre (I4C), and Nodal Bank Fraud Monitoring Units.
- **Out of Scope:** Automatic legal accusation, extra-judicial actions, or unverified asset seizure. All recommendations produce "P1/P2 Advisory Warnings" requiring human investigator validation.

## 2. Training & Validation Data
- **Dataset:** 50,000 synthetic transactions structured after NCRP and CFCFRMS schema.
- **Mule Chains:** Multi-hop paths (2 to 5 layers) with realistic rapid pass-through velocity (< 20 mins between hops), fan-in/fan-out splitting, and night-time cashout clustering.
- **Noise:** 8.5% benign lookalike noise (e-commerce merchants, salary distribution, intra-family transfers).

## 3. Evaluated Performance Metrics (Held-out Synthetic Set)
- **Accuracy:** 84.6%
- **Recall (Catching High-Risk Cashout Zones):** 89.2%
- **Precision:** 78.4%
- **F1-Score:** 83.5%
- **ROC-AUC:** 0.912
- **Top-3 Location Hit Rate:** 93.4% (vs. 38.5% historical baseline)
- **Inference Latency:** P50 = 180 ms | P95 = 320 ms (Target SLA < 450 ms)

## 4. Explainability & Neuro-Symbolic Rules
Every candidate location forecast provides SHAP-style attribution scores and plain-language investigative reasoning:
1. **Mule Chain Affinity:** Past cash-out frequency associated with the identified mule syndicate.
2. **Geospatial Proximity:** Distance between the last mule KYC account branch and target ATM.
3. **Temporal Match:** Time elapsed since victim debited funds vs. known cash-out window (18:00–22:00).
4. **Symbolic Rules:**
   - Layering velocity > ₹50,000 in < 30 mins escalates threat to CRITICAL.
   - Bipartite link across 3+ state FIRs flags an organized syndicate hub.

## 5. Ethical Considerations & Safeguards
- All entity identifiers (`ACC-DEMO-xxx`, `CMP-xxxx`) and bank credentials are synthetic.
- Compliant with Indian Digital Personal Data Protection (DPDP) Act principles.
- Tamper-evident SHA-256 blockchain audit trail ensures chain of custody for evidentiary preservation.
