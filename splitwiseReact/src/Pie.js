import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';
import {Pie} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({data, month}) {
    // console.log(data);
    const chartData = {
        labels: Object.keys(data),
        datasets: [
            {
                data: Object.values(data),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8E44AD', '#2ECC71'], // add more colors as needed
            },
        ],
    };

    return (
        <div>
            {/*<h2>{JSON.stringify(data)}</h2>*/}

            <Pie data={chartData} height="400px" width="400px" options={{
                title: "Expenses",
                maintainAspectRatio: false,
                legend: {
                    display: true,
                },
            }}/>
        </div>
    );
}

export default PieChart;