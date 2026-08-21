export type LayerType = 'text' | 'chart' | 'table';

export type VerificationStatus = 'verified' | 'low_confidence';

export interface Region {
  id: string;
  layer: LayerType;
  /** For chart/table regions: a bold label like "Fig. 3 — Revenue by region". */
  label?: string;
  /** For chart regions: a one-line AI interpretation starting with "read as:". */
  caption?: string;
  /** The plain-text body of the region. */
  text: string;
  page: number;
}

export interface DocumentPage {
  pageNumber: number;
  regions: Region[];
}

export interface Citation {
  /** id of the region this citation points to. */
  regionId: string;
  layer: LayerType;
  /** short label shown on the chip, e.g. "Fig. 3" or "p. 2". */
  label: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  verification?: VerificationStatus;
  createdAt: number;
}

export interface Session {
  id: string;
  filename: string;
  pageCount: number;
  createdAt: number;
  pages: DocumentPage[];
  messages: ChatMessage[];
}
