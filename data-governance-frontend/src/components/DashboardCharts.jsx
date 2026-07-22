import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function DashboardCharts({ summary }) {

    if (!summary) return null;

    const scoreData = {
        labels: ["Quality", "Trust", "Value"],
        datasets: [
            {
                label: "Average Score (%)",
                data: [
                    summary.averageQuality || 0,
                    summary.averageTrust || 0,
                    summary.averageValue || 0
                ],
                backgroundColor: [
                    "#36A2EB",
                    "#4BC0C0",
                    "#FFCE56"
                ]
            }
        ]
    };

    const datasetData = {
        labels: ["Rows", "Columns"],
        datasets: [
            {
                data: [
                    summary.totalRows || 0,
                    summary.totalColumns || 0
                ],
                backgroundColor: [
                    "#36A2EB",
                    "#FF6384"
                ]
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Average Dataset Scores"
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Rows vs Columns"
            }
        }
    };

    return (

        <div className="row mt-4">

            <div className="col-lg-6 mb-4">

                <div className="card shadow">

                    <div className="card-body">

                        <Bar
                            data={scoreData}
                            options={barOptions}
                        />

                    </div>

                </div>

            </div>

            <div className="col-lg-6 mb-4">

                <div className="card shadow">

                    <div className="card-body">

                        <Pie
                            data={datasetData}
                            options={pieOptions}
                        />

                    </div>

                </div>

            </div>

        </div>

    );
}

export default DashboardCharts;