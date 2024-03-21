import Chart from "react-apexcharts";

export const ApC = ({data, month}) => {
    const options = {

        series: [{
            name: 'Expenses',
            data: Object.values(data)
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return "$" + val.toFixed(2);
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },

            xaxis: {
                categories: Object.keys(data),
                position: 'top',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            yaxis: {
                axisBorder: {
                    show: true
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: true,
                    formatter: function (val) {
                        return "$" + val.toFixed(2);
                    }
                }

            },
            title: {
                text: 'Expense for Month, ' + month,
                floating: false,
                offsetY: 330,
                align: 'center',
                style: {
                    color: '#444'
                }
            }
        },
    };

    return <Chart options={options.options} series={options.series} type="bar" height={350}/>
}

export default ApC;