// src/components/ChartComponent.jsx
import React, { useRef, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2'; // Remove 'defaults' from here
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  defaults // <--- Import 'defaults' from 'chart.js' instead
} from 'chart.js';
import '../styles/charts.css';

// Register Chart.js components (keep this as is)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Set global defaults based on CSS Variables (optional but good for consistency)
// Note: Chart.js might not directly read CSS vars in all cases, so we read them here.
// This might need adjustment based on how theme switching is implemented.
const updateChartDefaults = (isDarkMode) => {
    const style = getComputedStyle(document.body);
    defaults.color = style.getPropertyValue('--text-color'); // Default text color
    defaults.borderColor = style.getPropertyValue('--chart-grid-color'); // Grid line color

    defaults.plugins.tooltip.backgroundColor = style.getPropertyValue('--chart-tooltip-bg');
    defaults.plugins.tooltip.titleColor = style.getPropertyValue('--chart-tooltip-text');
    defaults.plugins.tooltip.bodyColor = style.getPropertyValue('--chart-tooltip-text');
    defaults.plugins.tooltip.padding = 10;
    defaults.plugins.tooltip.cornerRadius = 4;

    defaults.plugins.legend.labels.color = style.getPropertyValue('--subtle-text-color');

    // Potentially update scale defaults too if needed
     defaults.scale.ticks.color = style.getPropertyValue('--subtle-text-color');
}


const ChartComponent = ({ type, data, options, theme }) => {
    const chartRef = useRef(null);

    // Update chart defaults when theme changes
    useEffect(() => {
        updateChartDefaults(theme === 'dark');
        // Force chart redraw if needed after theme change (might not be necessary with react-chartjs-2)
        const chartInstance = chartRef.current;
        if (chartInstance) {
            chartInstance.update();
        }
    }, [theme]);


  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow height control via CSS container
    animation: {
      duration: 500, // Subtle animation
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title', // Default title, override via props
        padding: {
            top: 10,
            bottom: 20
        },
         font: {
            size: 16,
            weight: '600',
        },
        color: 'var(--heading-color)' // Use CSS var
      },
      tooltip: {
        // Uses defaults set above, can be overridden here too
      }
    },
    scales: { // Only applicable for Bar/Line charts
        x: {
            grid: {
                display: false, // Cleaner look
            },
             ticks: {
                 // color: 'var(--subtle-text-color)' // Set in defaults
             }
        },
        y: {
            beginAtZero: true,
            grid: {
                // color: 'var(--chart-grid-color)', // Set in defaults
                drawBorder: false,
            },
             ticks: {
                 // color: 'var(--subtle-text-color)', // Set in defaults
                // Optional: Format ticks as currency
                callback: function(value) {
                     if (Math.abs(value) >= 1000) {
                         return '$' + (value / 1000) + 'k';
                     }
                     return '$' + value;
                }
             }
        }
    }

  };

  const mergedOptions = { ...defaultOptions, ...options };

  // Adjust options specifically for Pie charts
  if (type === 'pie') {
    delete mergedOptions.scales; // Remove scales for pie charts

    // --- START FIX ---
    // Ensure plugins and legend objects exist before modification
    if (!mergedOptions.plugins) {
        mergedOptions.plugins = {}; // Create plugins object if it doesn't exist
    }
    if (!mergedOptions.plugins.legend) {
        mergedOptions.plugins.legend = {}; // Create legend object if it doesn't exist
    }
    // Now it's safe to set the position
    mergedOptions.plugins.legend.position = 'right';
    // --- END FIX ---
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar ref={chartRef} options={mergedOptions} data={data} />;
      case 'pie':
        return <Pie ref={chartRef} options={mergedOptions} data={data} />;
      // Add cases for other chart types (Line, Doughnut) if needed
      default:
        console.error(`Unsupported chart type: ${type}`);
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="chart-container" style={{ height: type === 'pie' ? '350px' : '300px' }}> {/* Adjust height */}
      {renderChart()}
    </div>
  );
};

export default ChartComponent;