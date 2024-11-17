'use client';

import { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useTheme } from 'next-themes';

interface DependencyNode {
  id: string;
  name: string;
  level: number;
}

interface DependencyLink {
  source: string;
  target: string;
}

interface DependencyGraphProps {
  dependencies: {
    nodes: DependencyNode[];
    links: DependencyLink[];
  };
}

export function DependencyGraph({ dependencies }: DependencyGraphProps) {
  const graphRef = useRef<any>();
  const { theme } = useTheme();

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-100);
      graphRef.current.d3Force('link').distance(70);
    }
  }, []);

  return (
    <div className="h-[600px] border rounded-xl overflow-hidden">
      <ForceGraph2D
        ref={graphRef}
        graphData={dependencies}
        nodeColor={(node: any) => {
          const colors = ['#3b82f6', '#10b981', '#f59e0b'];
          return colors[node.level % colors.length];
        }}
        nodeLabel={(node: any) => node.name}
        linkColor={() => theme === 'dark' ? '#4b5563' : '#d1d5db'}
        backgroundColor={theme === 'dark' ? '#1f2937' : '#ffffff'}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = theme === 'dark' ? '#fff' : '#000';
          ctx.fillText(label, node.x, node.y);
        }}
        nodeCanvasObjectMode={() => 'replace'}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.001}
      />
    </div>
  );
} 