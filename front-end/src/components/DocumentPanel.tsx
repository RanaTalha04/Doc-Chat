import { useEffect, useRef, useState } from 'react';
import { BarChart3, FileText, RefreshCw, Table2 } from 'lucide-react';
import type { DocumentPage, LayerType, Region, Session } from '@/types';

interface DocumentPanelProps {
  session: Session;
  onSwapDocument: () => void;
  /** region id to scroll to and highlight, or null */
  highlightRegionId: string | null;
  onHighlightConsumed: () => void;
}

const LAYER_META: Record<
  LayerType,
  { label: string; icon: typeof BarChart3; colorVar: string; chipVar: string }
> = {
  text: {
    label: 'text',
    icon: FileText,
    colorVar: 'var(--layer-text-bg)',
    chipVar: 'var(--chip-text-bg)',
  },
  chart: {
    label: 'charts',
    icon: BarChart3,
    colorVar: 'var(--layer-chart-bg)',
    chipVar: 'var(--chip-chart-bg)',
  },
  table: {
    label: 'tables',
    icon: Table2,
    colorVar: 'var(--layer-table-bg)',
    chipVar: 'var(--chip-table-bg)',
  },
};

export function DocumentPanel({
  session,
  onSwapDocument,
  highlightRegionId,
  onHighlightConsumed,
}: DocumentPanelProps) {
  const [visibleLayers, setVisibleLayers] = useState<Set<LayerType>>(
    new Set(['text', 'chart', 'table']),
  );
  const [currentPage, setCurrentPage] = useState(1);
  const regionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleLayer = (layer: LayerType) => {
    setVisibleLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  // Scroll to and pulse the highlighted region
  useEffect(() => {
    if (!highlightRegionId) return;
    const el = regionRefs.current.get(highlightRegionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.remove('region-pulse');
      // force reflow so animation restarts
      void el.offsetWidth;
      el.classList.add('region-pulse');
      // move to the page containing this region
      const region = session.pages
        .flatMap((p) => p.regions)
        .find((r) => r.id === highlightRegionId);
      if (region) setCurrentPage(region.page);
    }
    const timer = setTimeout(onHighlightConsumed, 1600);
    return () => clearTimeout(timer);
  }, [highlightRegionId, onHighlightConsumed, session.pages]);

  const page: DocumentPage | undefined = session.pages.find(
    (p) => p.pageNumber === currentPage,
  );

  return (
    <div className="flex h-full flex-col bg-app">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-app">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-primary truncate">{session.filename}</h2>
          <p className="font-mono text-[11px] text-tertiary mt-0.5">
            {session.pageCount} pages · page {currentPage} of {session.pageCount}
          </p>
        </div>
        <button
          onClick={onSwapDocument}
          className="shrink-0 rounded-lg p-2 text-secondary hover:bg-hover hover:text-primary transition-colors"
          title="Swap document"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Layer legend toggle chips */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-app bg-sunken">
        {(Object.keys(LAYER_META) as LayerType[]).map((layer) => {
          const meta = LAYER_META[layer];
          const Icon = meta.icon;
          const active = visibleLayers.has(layer);
          return (
            <button
              key={layer}
              onClick={() => toggleLayer(layer)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium font-mono transition-all ${
                active ? 'opacity-100' : 'opacity-40'
              }`}
              style={{
                backgroundColor: active ? meta.chipVar : 'transparent',
                border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
              }}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* Page navigation */}
      {session.pageCount > 1 && (
        <div className="flex items-center justify-center gap-3 py-2 border-b border-app">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="rounded-md px-2 py-1 text-xs font-mono text-secondary hover:bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← prev
          </button>
          <span className="font-mono text-[11px] text-tertiary">
            {currentPage} / {session.pageCount}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(session.pageCount, p + 1))}
            disabled={currentPage >= session.pageCount}
            className="rounded-md px-2 py-1 text-xs font-mono text-secondary hover:bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            next →
          </button>
        </div>
      )}

      {/* Document content */}
      <div className="flex-1 overflow-y-auto scroll-thin px-5 py-6">
        <div className="mx-auto max-w-2xl space-y-5">
          {page?.regions.map((region) => (
            <RegionView
              key={region.id}
              region={region}
              visible={visibleLayers.has(region.layer)}
              refCallback={(el) => {
                if (el) regionRefs.current.set(region.id, el);
                else regionRefs.current.delete(region.id);
              }}
            />
          ))}
          {!page && (
            <p className="text-sm text-tertiary">No content on this page.</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface RegionViewProps {
  region: Region;
  visible: boolean;
  refCallback: (el: HTMLDivElement | null) => void;
}

function RegionView({ region, visible, refCallback }: RegionViewProps) {
  const meta = LAYER_META[region.layer];
  const Icon = meta.icon;
  const isStructured = region.layer === 'chart' || region.layer === 'table';

  if (!visible) {
    return (
      <div
        className="rounded-lg border border-dashed border-app px-4 py-3 text-xs font-mono text-tertiary italic"
        style={{ opacity: 0.5 }}
      >
        {meta.label} layer hidden
      </div>
    );
  }

  return (
    <div
      ref={refCallback}
      className={`rounded-lg p-4 transition-all ${isStructured ? 'border' : ''}`}
      style={{
        backgroundColor: isStructured ? meta.colorVar : 'transparent',
        borderColor: isStructured ? meta.colorVar : 'transparent',
        // CSS var for pulse animation color
        ['--pulse-color' as string]:
          region.layer === 'chart'
            ? 'rgba(37, 99, 235, 0.35)'
            : region.layer === 'table'
              ? 'rgba(124, 58, 237, 0.35)'
              : 'rgba(107, 114, 128, 0.3)',
      }}
    >
      {isStructured && (
        <div className="flex items-center gap-2 mb-2">
          <Icon
            className="h-4 w-4"
            strokeWidth={2}
            style={{
              color:
                region.layer === 'chart'
                  ? 'var(--chip-chart-text)'
                  : 'var(--chip-table-text)',
            }}
          />
          <span
            className="text-sm font-semibold"
            style={{
              color:
                region.layer === 'chart'
                  ? 'var(--chip-chart-text)'
                  : 'var(--chip-table-text)',
            }}
          >
            {region.label}
          </span>
        </div>
      )}

      {region.layer === 'chart' && region.caption && (
        <p className="text-xs font-mono text-secondary italic mb-2">{region.caption}</p>
      )}

      {region.layer === 'table' ? (
        <pre className="font-mono text-xs text-primary whitespace-pre-wrap leading-relaxed">
          {region.text}
        </pre>
      ) : (
        <p
          className={`text-sm leading-relaxed text-primary ${
            isStructured ? 'mt-1' : ''
          }`}
        >
          {region.text}
        </p>
      )}
    </div>
  );
}
