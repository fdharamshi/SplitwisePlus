import React from 'react';
import Chart from "react-apexcharts";
import { useTheme } from 'styled-components';

export const ApC = ({ data, month }) => {
    const theme = useTheme();
    
    // Prepare data for the chart
    const categories = Object.keys(data || {});
    const seriesData = Object.values(data || {}).map(Number);
    const hasData = seriesData.length > 0 && seriesData.some(val => val > 0);
    
    // Chart options
    const options = {
        chart: {
            type: 'bar',
            height: 400,
            background: 'transparent',
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                    pan: false,
                    reset: false
                }
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '70%',
                borderRadius: 6,
                distributed: true, // This makes each bar have a different color
            },
        },
        colors: [
            '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', 
            '#3F51B5', '#03A9F4', '#4CAF50', '#F9CE1D', '#FF9800',
            '#33B2DF', '#546E7A', '#D4526E', '#13D8AA', '#A5978B',
            '#4ECDC4', '#C7F464', '#81D4FA', '#FD6A6A', '#546E7A'
        ],
        fill: {
            type: 'solid',
            opacity: 0.9,
        },
        dataLabels: {
            enabled: true,
            formatter: function(val) {
                return `$${val.toFixed(2)}`;
            },
            style: {
                colors: ['#fff'],
                fontSize: '12px',
                fontWeight: 'bold',
            },
            background: {
                enabled: true,
                foreColor: '#000',
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#fff',
                opacity: 0.9,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.45
                }
            },
            dropShadow: {
                enabled: false
            }
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: theme.text.primary,
                },
                rotate: -45,
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.text.primary,
                },
                formatter: (val) => `$${val.toFixed(2)}`
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `$${val.toFixed(2)}`
            }
        },
        title: {
            text: `Expenses for ${month || 'Selected Period'}`,
            align: 'center',
            style: {
                color: theme.text.primary,
            },
        },
        grid: {
            borderColor: theme.ui.border,
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        colors: [
            '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', 
            '#546E7A', '#26a69a', '#D10CE8', '#FFA07A', '#87CEEB'
        ],
    };

    // Create an array of colors for each data point
    const colors = [
        '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', 
        '#3F51B5', '#03A9F4', '#4CAF50', '#F9CE1D', '#FF9800',
        '#33B2DF', '#546E7A', '#D4526E', '#13D8AA', '#A5978B',
        '#4ECDC4', '#C7F464', '#81D4FA', '#FD6A6A', '#546E7A'
    ];

    const series = [{
        name: 'Expenses',
        data: seriesData.map((value, index) => ({
            x: categories[index],
            y: value,
            fillColor: colors[index % colors.length] // Assign color based on index
        }))
    }];

    if (!hasData) {
        return (
            <div style={{ 
                width: '100%', 
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.text.secondary,
                fontStyle: 'italic'
            }}>
                No data available for the selected period
            </div>
        );
    }
    
    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Chart
                options={options}
                series={series}
                type="bar"
                height="100%"
            />
        </div>
    );
};

export default ApC;