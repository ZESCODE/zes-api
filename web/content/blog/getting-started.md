---
title: "Getting Started with the ZES AI Gateway"
excerpt: "Learn how to deploy and configure the ZES AI API gateway, connect upstream providers, and start routing requests in minutes."
category: "Getting Started"
publishedAt: "2026-10-15"
coverImage: "/placeholder.svg"
readTime: "6 min read"
featured: true
author:
  name: "ZES Team"
  role: "Engineering"
  avatar: "/placeholder-logo.svg"
---

# Getting Started with the ZES AI Gateway

The ZES AI gateway aggregates 40+ upstream AI providers — OpenAI, Claude, Gemini, Azure, AWS Bedrock, and more — behind a single unified API. With user management, billing, rate limiting, and an admin dashboard, it's designed to be the control plane for your AI infrastructure.

## Prerequisites

Before you begin, make sure you have:

- **Node.js / Bun** installed
- A running instance of the ZES gateway (Docker is the fastest way)
- API keys for at least one upstream provider

## 1. Run the gateway

The quickest way to get started is with Docker Compose:

```bash
git clone https://github.com/zesai/zes-api.git
cd zes-api
cp .env.example .env
# Edit .env with your provider API keys
docker compose up -d
```

## 2. Configure providers

Providers are configured through the admin dashboard at `/system-settings/providers`. Add your API keys, set routing rules, and enable the models you want to expose.

## 3. Make your first request

Once the gateway is running, you can call it like any OpenAI-compatible endpoint:

```bash
curl http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello, ZES!"}]
  }'
```

## What's next

From here you can set up billing, create API keys for your team, enable rate limiting, and explore the full relay capabilities. See the [system settings](/dashboard/system-settings) guide for more.
