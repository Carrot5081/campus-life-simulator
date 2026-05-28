# Campus Life Simulator

> A database-driven browser card game — navigate a full college semester by making decisions that balance 4 attributes.

**Live Demo → [http://106.53.44.216](http://106.53.44.216)**

![QR Code](assets/qrcode.png)

---

## Gameplay

Inspired by [Reigns](https://www.devolverdigital.com/games/reigns) (Devolver Digital, 2016).

Play as a college student navigating a full academic semester. Each round, an event card appears — choose Option A or B. Every choice shifts your 4 attributes:

| Attribute | Meaning |
|-----------|---------|
| 📘 Academic | Study performance & GPA |
| 💰 Money | Financial status & spending |
| 👥 Social | Social life & relationships |
| 💚 Health | Physical & mental wellbeing |

**Game Over** when any attribute hits **0** or **100**.

---

## Screenshots

| Login & Character Select | Game Screen | Leaderboard |
|--------------------------|-------------|-------------|
| Choose from 6 unique characters | Event cards + live status bars | Global top-20 rankings |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MySQL 8.0.45 · InnoDB · utf8mb4 · 11 tables · 3NF/BCNF |
| Backend | Python 3.10 · Flask 3.0 · Gunicorn 26.0 · REST API |
| Frontend | React 18 · Vite · CSS3 (responsive) |
| Deployment | Tencent Cloud CVM · Nginx 1.18 · systemd · Ubuntu 22.04 |

---

## Database Design Highlights

- **11-table normalized schema** — 3NF/BCNF, referential integrity via InnoDB foreign keys
- **ISA Inheritance** — `Event` → `FixedEvent` / `RandomEvent` (avoids NULL-heavy merged tables)
- **Weak Entity** — `Attribute` (session_id, round_num) depends on `GameSession`
- **M:N Bridge** — `PlayerAchievement` resolves Player ↔ Achievement many-to-many
- **31 events** — 15 fixed narrative + 5 conditional special + 11 weighted random
- **Three-tier event selection** — fixed sequence → attribute-threshold triggers → weighted random pool

See [`database/schema.sql`](database/schema.sql) for the full DDL.

---

## Frontend Architecture

```
frontend/src/
├── pages/          # Login · Game · GameOver · Leaderboard
├── components/     # StatusBar · EventCard · Character · ChoiceButton · ...
├── context/        # GameContext (session state) · LanguageContext (ZH/EN)
└── i18n/           # Bilingual string tables (Chinese / English)
```

**Key features:**
- 6 playable SVG characters × 7 facial expressions (derived from attribute values)
- Real-time Chinese / English toggle — no page reload
- Status bar hover preview — shows attribute delta before committing a choice
- Mobile responsive — CSS media queries, 100dvh, iOS safe-area insets

---

## Repository Structure

```
campus-life-simulator/
├── frontend/           # React 18 + Vite source (full UI)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── i18n/
│   └── package.json
├── database/
│   └── schema.sql      # Full DDL — 11 tables, constraints, indexes
└── assets/
    └── qrcode.png      # Scan to play
```

> Backend (Flask routes, game logic) is kept private as part of the course submission.

---

## Running the Frontend Locally

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173  (connects to live API at 106.53.44.216)
```

---

## Course Info

**Database Systems Course · Group 19 · May 2026**

Built as the final project for a university Database Systems course, demonstrating:
real-world schema design, normalization analysis, complex multi-table queries,
ACID transactions, and full-stack deployment.
