import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { DAG } from '@/lib/analysis/causal-inference';

interface CausalGraphProps {
  dag: DAG;
  width: number;
  height: number;
  onNodeClick?: (node: string) => void;
  highlightPaths?: string[];
}

export const CausalGraph: React.FC<CausalGraphProps> = ({
  dag,
  width,
  height,
  onNodeClick,
  highlightPaths
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(dag.nodes)
      .force('link', d3.forceLink(dag.edges).id(d => d.id))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create arrow markers
    svg.append('defs').selectAll('marker')
      .data(['end'])
      .enter().append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#999');

    // Draw edges
    const link = svg.append('g')
      .selectAll('path')
      .data(dag.edges)
      .enter().append('path')
      .attr('class', 'link')
      .attr('marker-end', 'url(#arrow)')
      .attr('stroke', d => highlightPaths?.includes(d.id) ? '#ff6b6b' : '#999')
      .attr('stroke-width', d => highlightPaths?.includes(d.id) ? 2 : 1);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(dag.nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    node.append('circle')
      .attr('r', 8)
      .attr('fill', d => this.getNodeColor(d))
      .on('click', (event, d) => onNodeClick?.(d.id));

    node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text(d => d.label);

    // Update positions
    simulation.on('tick', () => {
      link.attr('d', d => this.generatePath(d));
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [dag, width, height, highlightPaths]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      />
    </motion.div>
  );
} 