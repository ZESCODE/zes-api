---
title: "Model Routing & Provider Selection in the ZES AI Gateway"
excerpt: "How to route requests across OpenAI, Claude, Gemini, Azure, and AWS Bedrock — with cost, latency, and capability-based rules."
category: "Engineering"
publishedAt: "2026-10-17"
coverImage: "/placeholder.svg"
readTime: "7 min read"
featured: false
author:
  name: "ZES Team"
  role: "Engineering"
  avatar: "/placeholder-logo.svg"
---

# Model Routing & Provider Selection in the ZES AI Gateway

The ZES AI gateway aggregates 40+ upstream AI providers — OpenAI, Claude, Gemini, Azure, AWS Bedrock, and more — behind a single OpenAI-compatible API. But not every request should hit your most capable (and most expensive) model. Smart routing is how you control spend and latency without degrading quality.

## Why route by model

Different tasks need different models:

- Classification, extraction, and short summarization → smaller, cheaper models
- Complex reasoning, coding, and creative writing → flagship models
- High-volume, latency-sensitive traffic → fast, inexpensive models

Routing lets you match the model to the task rather than defaulting to your most expensive option for everything.

## Define routing rules

You can define routing rules in the admin dashboard based on:

- Request intent or keywords
- User tier or plan
- Time of day or traffic volume
- Desired cost ceiling or latency budget

```json
{
  "model": "gpt-4o-mini",
  "route": "cost-optimized"
}
```

## Fallback and reliability

The gateway can fall back to a secondary provider if the primary returns an error or hits rate limits. Configure fallback chains per model family so a single provider outage doesn't take down your application.

## Measure, then optimize

Enable usage logging and review the analytics dashboard to see which models and providers drive the most cost and latency. Route based on real data, not assumptions — then revisit your rules as new models and pricing become available.
