import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';

interface ChartProps {
  data: any[];
  type: 'network' | 'timeline' | 'heatmap' | 'force';
  width: number;
  height: number;
  options?: ChartOptions;
  onNodeClick?: (node: any) => void;
}

export const InteractiveChart: React.FC<ChartProps> = ({
  data,
  type,
  width,
  height,
  options,
  onNodeClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    switch (type) {
      case 'network':
        renderNetworkGraph(svg, data, width, height, options);
        break;
      case 'timeline':
        renderTimeline(svg, data, width, height, options);
        break;
      case 'heatmap':
        renderHeatmap(svg, data, width, height, options);
        break;
      case 'force':
        renderForceDirected(svg, data, width, height, options);
        break;
    }
  }, [data, type, width, height, options]);

  const renderNetworkGraph = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, data: any, width: number, height: number, options?: ChartOptions) => {
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6);

    const node = svg.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d: any) => d.color || '#69b3a2')
      .call(drag(simulation));

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });
  };

  // Additional rendering functions for other chart types...

  return (
    <div className="relative">
      <motion.svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
      <AnimatePresence>
        {tooltipContent && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bg-white p-2 rounded shadow-lg"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y
            }}
          >
            {tooltipContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 