import type { Session } from '@/types';

const now = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const SAMPLE_SESSIONS: Session[] = [
  {
    id: 'sess-q3-report',
    filename: 'Acme_Q3_Financial_Report.pdf',
    pageCount: 4,
    createdAt: now - 2 * DAY - 3 * HOUR,
    pages: [
      {
        pageNumber: 1,
        regions: [
          {
            id: 'r-p1-1',
            layer: 'text',
            text: 'Acme Corporation — Q3 2024 Financial Report. This document summarizes consolidated performance for the quarter ending September 30, 2024. All figures are reported in USD millions unless otherwise noted.',
            page: 1,
          },
          {
            id: 'r-p1-2',
            layer: 'text',
            text: 'Executive Summary. Q3 revenue reached $48.2M, up 18% year-over-year, driven primarily by expansion in the EMEA region and strong renewals across the enterprise segment. Gross margin improved to 71% from 68% in the prior quarter.',
            page: 1,
          },
          {
            id: 'r-p1-3',
            layer: 'chart',
            label: 'Fig. 1 — Quarterly revenue trend',
            caption:
              'read as: bar chart showing revenue rising from $32M (Q1) to $40.8M (Q2) to $48.2M (Q3), with each quarter labeled on the x-axis and dollar amount on the y-axis.',
            text: 'Quarterly revenue trend across Q1–Q3 2024.',
            page: 1,
          },
        ],
      },
      {
        pageNumber: 2,
        regions: [
          {
            id: 'r-p2-1',
            layer: 'text',
            text: 'Regional breakdown. EMEA led growth this quarter, contributing $21.3M of total revenue. North America accounted for $18.7M, while APAC contributed $8.2M. The EMEA surge was attributed to three large enterprise deals closed in July and August.',
            page: 2,
          },
          {
            id: 'r-p2-2',
            layer: 'chart',
            label: 'Fig. 2 — Revenue by region',
            caption:
              'read as: horizontal bar chart with three bars — EMEA $21.3M (longest), North America $18.7M, APAC $8.2M (shortest). Values labeled at the end of each bar.',
            text: 'Revenue distribution across EMEA, North America, and APAC.',
            page: 2,
          },
          {
            id: 'r-p2-3',
            layer: 'table',
            label: 'Table 1 — Regional revenue detail',
            text: 'Region | Q3 Revenue | YoY Growth | Deal Count\nEMEA | $21.3M | +27% | 14\nNorth America | $18.7M | +11% | 22\nAPAC | $8.2M | +9% | 9',
            page: 2,
          },
        ],
      },
      {
        pageNumber: 3,
        regions: [
          {
            id: 'r-p3-1',
            layer: 'text',
            text: 'Operating expenses. Total operating expenses for Q3 were $29.4M, representing 61% of revenue. Sales and marketing accounted for $12.1M, R&D for $9.8M, and general & administrative for $7.5M.',
            page: 3,
          },
          {
            id: 'r-p3-2',
            layer: 'chart',
            label: 'Fig. 3 — Operating expense breakdown',
            caption:
              'read as: donut chart split into three slices — Sales & Marketing 41% (largest, blue), R&D 33%, G&A 26% (smallest). Percentages labeled inside each slice.',
            text: 'Operating expense breakdown by category.',
            page: 3,
          },
          {
            id: 'r-p3-3',
            layer: 'table',
            label: 'Table 2 — Expense summary',
            text: 'Category | Q3 Spend | % of Revenue | QoQ Change\nSales & Marketing | $12.1M | 25% | +$1.2M\nR&D | $9.8M | 20% | +$0.6M\nG&A | $7.5M | 16% | -$0.3M',
            page: 3,
          },
        ],
      },
      {
        pageNumber: 4,
        regions: [
          {
            id: 'r-p4-1',
            layer: 'text',
            text: 'Outlook. Based on the current pipeline and renewal forecast, management projects Q4 revenue in the range of $52M–$55M, representing continued sequential growth. Full-year guidance remains unchanged at $185M–$190M.',
            page: 4,
          },
          {
            id: 'r-p4-2',
            layer: 'text',
            text: 'Risk factors. Macroeconomic headwinds in EMEA, potential FX volatility, and competitive pressure in the APAC mid-market segment could impact forward projections. See appendix for detailed sensitivity analysis.',
            page: 4,
          },
        ],
      },
    ],
    messages: [
      {
        id: 'm1',
        role: 'user',
        text: 'What was the total Q3 revenue and how does it compare to last year?',
        createdAt: now - 2 * DAY - 2 * HOUR,
      },
      {
        id: 'm2',
        role: 'assistant',
        text: 'Q3 revenue reached $48.2M, up 18% year-over-year. The growth was driven primarily by EMEA expansion and strong enterprise renewals.',
        citations: [
          { regionId: 'r-p1-2', layer: 'text', label: 'p. 1' },
          { regionId: 'r-p1-3', layer: 'chart', label: 'Fig. 1' },
        ],
        verification: 'verified',
        createdAt: now - 2 * DAY - 2 * HOUR + 5000,
      },
      {
        id: 'm3',
        role: 'user',
        text: 'Which region contributed the most revenue?',
        createdAt: now - 2 * DAY - 1 * HOUR,
      },
      {
        id: 'm4',
        role: 'assistant',
        text: 'EMEA led with $21.3M of total revenue, followed by North America at $18.7M and APAC at $8.2M. The EMEA surge came from three large enterprise deals closed in July and August.',
        citations: [
          { regionId: 'r-p2-1', layer: 'text', label: 'p. 2' },
          { regionId: 'r-p2-2', layer: 'chart', label: 'Fig. 2' },
          { regionId: 'r-p2-3', layer: 'table', label: 'Table 1' },
        ],
        verification: 'verified',
        createdAt: now - 2 * DAY - 1 * HOUR + 6000,
      },
    ],
  },
  {
    id: 'sess-climate-study',
    filename: 'Global_Climate_Indicators_2024.pdf',
    pageCount: 3,
    createdAt: now - 5 * HOUR,
    pages: [
      {
        pageNumber: 1,
        regions: [
          {
            id: 'c-p1-1',
            layer: 'text',
            text: 'Global Climate Indicators — 2024 Synthesis. This report aggregates temperature, sea-level, and emissions data from 140 monitoring stations worldwide. All anomalies are relative to the 1951–1980 baseline.',
            page: 1,
          },
          {
            id: 'c-p1-2',
            layer: 'chart',
            label: 'Fig. 1 — Global temperature anomaly',
            caption:
              'read as: line chart trending upward from +0.3°C (2014) to +1.17°C (2024), with a sharp rise after 2020. Y-axis shows temperature anomaly in degrees Celsius.',
            text: 'Global mean temperature anomaly over the last decade.',
            page: 1,
          },
        ],
      },
      {
        pageNumber: 2,
        regions: [
          {
            id: 'c-p2-1',
            layer: 'text',
            text: 'Sea level rise. Global mean sea level rose by 8.4 mm in 2024, continuing an accelerating trend. Thermal expansion contributed 42% of the increase, with ice-sheet loss accounting for the remainder.',
            page: 2,
          },
          {
            id: 'c-p2-2',
            layer: 'chart',
            label: 'Fig. 2 — Sea level rise components',
            caption:
              'read as: stacked area chart showing two layers — thermal expansion (lower, lighter) and ice-sheet loss (upper). Total rises from 2 mm/yr to 8.4 mm/yr over the decade.',
            text: 'Annual sea level rise split by contributing component.',
            page: 2,
          },
          {
            id: 'c-p2-3',
            layer: 'table',
            label: 'Table 1 — Key climate metrics',
            text: 'Metric | 2024 Value | Change vs 2023 | Trend\nGlobal temp anomaly | +1.17°C | +0.06°C | Rising\nSea level rise | 8.4 mm | +0.9 mm | Rising\nArctic sea ice | 4.28 Mkm² | -0.12 Mkm² | Falling',
            page: 2,
          },
        ],
      },
      {
        pageNumber: 3,
        regions: [
          {
            id: 'c-p3-1',
            layer: 'text',
            text: 'Carbon emissions. Global CO₂ emissions from fossil fuels reached 37.4 Gt in 2024, a 0.8% increase over 2023. However, renewable energy deployment grew by 13%, suggesting a possible emissions plateau within the next two years.',
            page: 3,
          },
          {
            id: 'c-p3-2',
            layer: 'chart',
            label: 'Fig. 3 — CO₂ emissions vs renewable growth',
            caption:
              'read as: dual-axis chart — bars showing CO₂ emissions (left axis, rising slightly) and a line showing renewable energy growth (right axis, rising steeply at 13%).',
            text: 'Comparison of fossil CO₂ emissions and renewable energy growth.',
            page: 3,
          },
        ],
      },
    ],
    messages: [
      {
        id: 'cm1',
        role: 'user',
        text: 'How much did global temperature rise in 2024?',
        createdAt: now - 4 * HOUR,
      },
      {
        id: 'cm2',
        role: 'assistant',
        text: 'The global mean temperature anomaly reached +1.17°C in 2024, an increase of 0.06°C over 2023. The trend shows a sharp acceleration after 2020.',
        citations: [
          { regionId: 'c-p1-2', layer: 'chart', label: 'Fig. 1' },
          { regionId: 'c-p2-3', layer: 'table', label: 'Table 1' },
        ],
        verification: 'verified',
        createdAt: now - 4 * HOUR + 5000,
      },
      {
        id: 'cm3',
        role: 'user',
        text: 'Will emissions keep rising?',
        createdAt: now - 3 * HOUR,
      },
      {
        id: 'cm4',
        role: 'assistant',
        text: 'Fossil CO₂ emissions rose 0.8% to 37.4 Gt in 2024, but renewable energy deployment grew 13%. The report suggests a possible emissions plateau within the next two years, though this depends on continued renewable acceleration.',
        citations: [{ regionId: 'c-p3-1', layer: 'text', label: 'p. 3' }],
        verification: 'low_confidence',
        createdAt: now - 3 * HOUR + 5500,
      },
    ],
  },
  {
    id: 'sess-research-paper',
    filename: 'Transformer_Architecture_Survey.pdf',
    pageCount: 2,
    createdAt: now - 20 * MIN,
    pages: [
      {
        pageNumber: 1,
        regions: [
          {
            id: 't-p1-1',
            layer: 'text',
            text: 'A Survey of Transformer Architectures (2024). This paper reviews 47 transformer variants published between 2017 and 2024, categorizing them by attention mechanism, positional encoding, and scaling strategy.',
            page: 1,
          },
          {
            id: 't-p1-2',
            layer: 'chart',
            label: 'Fig. 1 — Model parameter counts',
            caption:
              'read as: scatter plot showing parameter count (x-axis, log scale) vs benchmark score (y-axis). Each point is a model; larger models cluster in the upper right.',
            text: 'Parameter count versus benchmark performance across surveyed models.',
            page: 1,
          },
          {
            id: 't-p1-3',
            layer: 'table',
            label: 'Table 1 — Architecture comparison',
            text: 'Variant | Attention | Pos. Encoding | Params | Year\nVanilla | Full | Sinusoidal | 340M | 2017\nLongformer | Sparse | Rotary | 1.2B | 2020\nFlash-2 | Flash | RoPE | 7B | 2023',
            page: 1,
          },
        ],
      },
      {
        pageNumber: 2,
        regions: [
          {
            id: 't-p2-1',
            layer: 'text',
            text: 'Findings. Sparse attention mechanisms reduce computational complexity from O(n²) to O(n log n) with minimal quality loss. Rotary positional encoding (RoPE) has become the dominant choice, appearing in 68% of models published after 2022.',
            page: 2,
          },
          {
            id: 't-p2-2',
            layer: 'chart',
            label: 'Fig. 2 — Adoption of RoPE over time',
            caption:
              'read as: bar chart showing RoPE adoption rising from 5% (2019) to 68% (2024), with a steep climb between 2021 and 2023.',
            text: 'Yearly adoption rate of rotary positional encoding.',
            page: 2,
          },
        ],
      },
    ],
    messages: [
      {
        id: 'tm1',
        role: 'user',
        text: 'What is the most common positional encoding in recent models?',
        createdAt: now - 18 * MIN,
      },
      {
        id: 'tm2',
        role: 'assistant',
        text: 'Rotary positional encoding (RoPE) is the dominant choice, appearing in 68% of models published after 2022. Its adoption rose steeply between 2021 and 2023.',
        citations: [
          { regionId: 't-p2-1', layer: 'text', label: 'p. 2' },
          { regionId: 't-p2-2', layer: 'chart', label: 'Fig. 2' },
        ],
        verification: 'verified',
        createdAt: now - 18 * MIN + 4000,
      },
    ],
  },
];
