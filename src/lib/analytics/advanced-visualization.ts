import { ChartConfiguration } from 'chart.js';
import * as d3 from 'd3';

export class AdvancedVisualization {
  static generateSegmentationSunburst(segments: any[]): ChartConfiguration {
    return {
      type: 'sunburst',
      data: this.transformSegmentData(segments),
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: (ctx: any) => `${ctx.raw.value} users`
            }
          }
        }
      }
    };
  }

  static generatePredictionGraph(predictions: any[]): ChartConfiguration {
    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Engagement Predictions',
          data: predictions.map(p => ({
            x: p.timestamp,
            y: p.score,
            r: p.confidence * 10
          })),
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Engagement Score' }
          }
        }
      }
    };
  }

  static generateNetworkGraph(data: any) {
    const width = 928;
    const height = 600;
    
    const links = data.links.map(d => Object.create(d));
    const nodes = data.nodes.map(d => Object.create(d));
    
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    return { simulation, nodes, links };
  }
} 