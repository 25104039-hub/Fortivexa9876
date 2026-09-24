# FORTIVEXA: SIH Grand Finale Slide-by-Slide Pitch Notes

*Tailored to match Team 25's presentation slides for Problem Statement SIH26184.*

---

## Slide 1: Title & Team Credentials
- **Event:** SMART INDIA HACKATHON 2026
- **Title:** Development of a Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations in Advance, Enabling Generation of Actionable Intelligence for Timely and Proactive Cybercrime Intervention.
- **Problem Statement ID:** SIH26184
- **Theme:** Blockchain & Cyber Security
- **Category:** Software
- **Team ID:** 25
- **Team Name:** FORTIVEXA
- **Presenter Notes:**
  - Introduce Team 25 and state clearly that this prototype has been developed to **TRL 5 (Technology Validated in a Relevant Environment)**.
  - Highlight alignment with the vision of the Ministry of Home Affairs (MHA) and the Indian Cyber Crime Coordination Centre (I4C).

---

## Slide 2: Proposed Solution
- **Core Problem:**
  - Layered mule accounts moving funds across multi-tier accounts.
  - Cash-out occurs in hours (often before victims realize and report).
  - Lack of early warning capabilities for police beat patrols.
- **Existing Gap:**
  - Only complaint-driven and reactive.
  - Limited predictive capability; by the time FIR is filed, money is withdrawn.
- **Massive Scale:**
  - 2.2 to 2.8 million complaints filed annually on the NCRP portal / 1930 helpline.
  - Crores diverted daily into mule accounts; banks overwhelmed with manual requests.
- **Our Solution:**
  - Full Chain Trace: Multi-hop transaction reconstruction.
  - Hybrid XGBoost + GNN: Catches fully synchronized networks and scores mule centrality.
  - Neuro-Symbolic AI: Merges RBI regulatory rules and velocity heuristics with machine learning.
  - Living Map Powered: Real-time adaptive geospatial risk engine forecasting ATM cashouts.
- **Key Features:**
  - Mule Network Graph, Hotspot Prediction, Real-Time Alerts, Confidence Scoring, Live Risk Heatmap, Scalable Pipeline.

---

## Slide 3: Technical Approach
- **Workflow (5 Stages):**
  1. Complaint Ingestion
  2. Data Cleaning & Graph Building
  3. ML Prediction Engine
  4. Risk Mapping
  5. Actionable Intelligence
- **Tech Stack:**
  - Frontend: React / Leaflet GIS
  - Backend: REST API Architecture
  - Database: Relational Store + In-Memory Graph Linkage
  - AI/Algorithms: XGBoost + GNN (Network Topology) + Neuro-Symbolic AI
- **Connectivity & Security:**
  - REST APIs over HTTPS, GovCloud-ready architecture.
  - AES-256 encryption at rest, TLS 1.3 in transit.
  - Role-based access control (RBAC) for LEAs, I4C officers, and Bank Nodal Officers.
  - Tamper-evident SHA-256 blockchain audit trail ensuring evidentiary admissibility under Section 65B of the Indian Evidence Act.
