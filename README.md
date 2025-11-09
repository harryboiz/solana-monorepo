# Solana Monorepo

This repository contains a simple **Solana data API** built with **NestJS** (backend) and **NextJS** (frontend) in a single **pnpm monorepo**.

---

## **Project Structure**

solana-monorepo/
├─ packages/
│ ├─ backend/ # NestJS API
│ └─ frontend/ # NextJS app
├─ package.json # Root monorepo config
└─ pnpm-workspace.yaml


---

## **Prerequisites**

- Node.js >= 20
- PNPM >= 8
- Git

---

## **Setup**

1. **Clone the repository**

```bash
git clone git@github.com:harryboiz/solana-monorepo.git
cd solana-monorepo
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Running the Backend (NestJS)**

```bash
pnpm api
```

- Default runs on http://localhost:3001
- API endpoint: GET /solana/block-tx-count?block=<BLOCK_NUMBER>
- Returns JSON:
```json
{
  "block": 123456,
  "transactionCount": 10
}
```

4. **Running the Frontend**

```bash
pnpm web
```

- Default runs on http://localhost:3000
- Enter a Solana block number and fetch transaction count from backend.
