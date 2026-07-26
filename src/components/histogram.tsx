import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

export function Histogram({ data }: { data: { x: number; y: number }[] }) {
  const series = [{ name: 'Amount', data }];

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      zoom: {
        enabled: false,
        allowMouseWheelZoom: false
      },
      background: '#2a2226',
      toolbar: {
        show: false,
        tools: {
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false
        }
      },
    },
    xaxis: {
      type: "numeric",
      title: {
        text: "Frametimes (ms)",
        style: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      },
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 0.5)'
        }
      },
      min: 0,
      max: 25,
      tickAmount: 5
    },
    yaxis: {
      title: {
        text: "Count",
        style: {
          color: 'rgba(255, 255, 255, 0.5)'
        }
      },
      labels: {
        style: {
          colors: 'rgba(255, 255, 255, 0.5)'
        }
      }
    },
    theme: {
      mode: 'dark'
    },
    plotOptions: {
      bar: {
        columnWidth: '100%'
      }
    },
    grid: {
      row: {
        opacity: 0.5
      }
    },
    annotations: {
      xaxis: [
        {
          x: 16.6,
          borderColor: "red",
          strokeDashArray: 5
        },
      ],
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: 'Frametimes'
    }
  };

  return (
    <ReactApexChart options={options} series={series} type="bar" height={500} width="100%" />
  );
}