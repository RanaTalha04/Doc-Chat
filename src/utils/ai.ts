import type { Citation, ChatMessage, Region, Session, VerificationStatus } from '@/types';

interface AnswerTemplate {
  keywords: string[];
  build: (session: Session, regions: Region[]) => {
    text: string;
    citations: Citation[];
    verification: VerificationStatus;
  };
}

const TEMPLATES: AnswerTemplate[] = [
  {
    keywords: ['revenue', 'revenue'],
    build: (session, regions) => {
      const textRegion = regions.find((r) => r.layer === 'text' && /revenue/i.test(r.text));
      const chartRegion = regions.find((r) => r.layer === 'chart');
      const citations: Citation[] = [];
      if (textRegion) citations.push({ regionId: textRegion.id, layer: 'text', label: `p. ${textRegion.page}` });
      if (chartRegion) citations.push({ regionId: chartRegion.id, layer: 'chart', label: chartRegion.label?.split('—')[0].trim() || 'Fig.' });
      return {
        text: textRegion
          ? `Based on the document, ${textRegion.text.toLowerCase().includes('revenue') ? textRegion.text.split('.')[0] + '.' : 'revenue figures are discussed in the report.'} The chart visualizes the trend across the reporting period.`
          : 'I found revenue-related content in this document.',
        citations,
        verification: 'verified',
      };
    },
  },
  {
    keywords: ['region', 'regional', 'breakdown', 'which region', 'which area'],
    build: (session, regions) => {
      const textRegion = regions.find((r) => r.layer === 'text' && /region|emea|apac|north america/i.test(r.text));
      const chartRegion = regions.find((r) => r.layer === 'chart' && /region/i.test(r.label || ''));
      const tableRegion = regions.find((r) => r.layer === 'table');
      const citations: Citation[] = [];
      if (textRegion) citations.push({ regionId: textRegion.id, layer: 'text', label: `p. ${textRegion.page}` });
      if (chartRegion) citations.push({ regionId: chartRegion.id, layer: 'chart', label: chartRegion.label?.split('—')[0].trim() || 'Fig.' });
      if (tableRegion) citations.push({ regionId: tableRegion.id, layer: 'table', label: tableRegion.label?.split('—')[0].trim() || 'Table' });
      return {
        text: textRegion
          ? textRegion.text.split('.').slice(0, 2).join('.') + '.'
          : 'The document contains a regional breakdown with supporting charts and tables.',
        citations,
        verification: 'verified',
      };
    },
  },
  {
    keywords: ['temperature', 'climate', 'emissions', 'sea level', 'co2'],
    build: (session, regions) => {
      const textRegion = regions.find((r) => r.layer === 'text' && /temperature|climate|emission|sea level|co₂|co2/i.test(r.text));
      const chartRegion = regions.find((r) => r.layer === 'chart');
      const tableRegion = regions.find((r) => r.layer === 'table' && /climate|metric|temp|sea/i.test(r.label || ''));
      const citations: Citation[] = [];
      if (textRegion) citations.push({ regionId: textRegion.id, layer: 'text', label: `p. ${textRegion.page}` });
      if (chartRegion) citations.push({ regionId: chartRegion.id, layer: 'chart', label: chartRegion.label?.split('—')[0].trim() || 'Fig.' });
      if (tableRegion) citations.push({ regionId: tableRegion.id, layer: 'table', label: tableRegion.label?.split('—')[0].trim() || 'Table' });
      return {
        text: textRegion
          ? textRegion.text.split('.').slice(0, 2).join('.') + '.'
          : 'The report discusses climate indicators with supporting data visualizations.',
        citations,
        verification: tableRegion ? 'verified' : 'low_confidence',
      };
    },
  },
  {
    keywords: ['table', 'expense', 'spend', 'cost', 'budget'],
    build: (session, regions) => {
      const tableRegion = regions.find((r) => r.layer === 'table');
      const textRegion = regions.find((r) => r.layer === 'text' && /expense|spend|cost|budget|operating/i.test(r.text));
      const citations: Citation[] = [];
      if (textRegion) citations.push({ regionId: textRegion.id, layer: 'text', label: `p. ${textRegion.page}` });
      if (tableRegion) citations.push({ regionId: tableRegion.id, layer: 'table', label: tableRegion.label?.split('—')[0].trim() || 'Table' });
      return {
        text: tableRegion
          ? `The document includes a table summarizing this data: "${tableRegion.label}". ${textRegion ? textRegion.text.split('.')[0] + '.' : ''}`
          : 'I found expense-related content in the document.',
        citations,
        verification: 'verified',
      };
    },
  },
  {
    keywords: ['attention', 'transformer', 'model', 'rope', 'positional', 'encoding', 'architecture'],
    build: (session, regions) => {
      const textRegion = regions.find((r) => r.layer === 'text' && /attention|transformer|positional|encoding|rope|model/i.test(r.text));
      const chartRegion = regions.find((r) => r.layer === 'chart');
      const tableRegion = regions.find((r) => r.layer === 'table');
      const citations: Citation[] = [];
      if (textRegion) citations.push({ regionId: textRegion.id, layer: 'text', label: `p. ${textRegion.page}` });
      if (chartRegion) citations.push({ regionId: chartRegion.id, layer: 'chart', label: chartRegion.label?.split('—')[0].trim() || 'Fig.' });
      if (tableRegion) citations.push({ regionId: tableRegion.id, layer: 'table', label: tableRegion.label?.split('—')[0].trim() || 'Table' });
      return {
        text: textRegion
          ? textRegion.text.split('.').slice(0, 2).join('.') + '.'
          : 'The paper discusses transformer architecture details.',
        citations,
        verification: 'verified',
      };
    },
  },
  {
    keywords: ['outlook', 'forecast', 'projection', 'future', 'next', 'guidance', 'predict'],
    build: (session, regions) => {
      const textRegion = regions.find((r) => r.layer === 'text' && /outlook|forecast|projection|guidance|future|next|predict|risk/i.test(r.text));
      const citations: Citation[] = [];
      if (textRegion) citations.push({ regionId: textRegion.id, layer: 'text', label: `p. ${textRegion.page}` });
      return {
        text: textRegion
          ? textRegion.text.split('.').slice(0, 2).join('.') + '.'
          : 'The document contains forward-looking statements, but I cannot verify specific projections with high confidence.',
        citations,
        verification: 'low_confidence',
      };
    },
  },
];

const FALLBACK: AnswerTemplate = {
  keywords: [],
  build: (session, regions) => {
    const textRegion = regions.find((r) => r.layer === 'text');
    const chartRegion = regions.find((r) => r.layer === 'chart');
    const citations: Citation[] = [];
    if (textRegion) citations.push({ regionId: textRegion.id, layer: 'text', label: `p. ${textRegion.page}` });
    if (chartRegion) citations.push({ regionId: chartRegion.id, layer: 'chart', label: chartRegion.label?.split('—')[0].trim() || 'Fig.' });
    return {
      text: textRegion
        ? `Here's what I found in the document: ${textRegion.text.split('.')[0]}.`
        : 'I reviewed the document but could not find a direct answer to your question. Try asking about specific figures, charts, or tables.',
      citations,
      verification: textRegion ? 'low_confidence' : 'low_confidence',
    };
  },
};

export function generateAnswer(session: Session, question: string): Omit<ChatMessage, 'id' | 'role' | 'createdAt'> {
  const allRegions = session.pages.flatMap((p) => p.regions);
  const lowerQ = question.toLowerCase();

  for (const template of TEMPLATES) {
    if (template.keywords.some((k) => lowerQ.includes(k))) {
      return template.build(session, allRegions);
    }
  }
  return FALLBACK.build(session, allRegions);
}
