import { ChartConfiguration } from 'chart.js';

interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

interface InteractionData {
  [key: string]: number;
}

export class AnalyticsVisualization {
  static generateTimeSeriesChart(data: TimeSeriesDataPoint[]): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          label: 'Views',
          data: data.map(d => d.value)
        }]
      },
      options: {
        responsive: true
      }
    };
  }

  static generateHeatmap(data: InteractionData): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Interactions',
          data: Object.values(data)
        }]
      },
      options: {
        responsive: true
      }
    };
  }
} 