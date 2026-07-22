import { useEffect, useState } from "react";
import {
    getDashboard,
    getDatasets,
    deleteDataset
} from "../services/datasetService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import DashboardCharts from "../components/DashboardCharts";
import LoadingSpinner from "../components/LoadingSpinner";
import "bootstrap-icons/font/bootstrap-icons.css";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});
    const [datasets, setDatasets] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            setLoading(true);

            const [dashboardResponse, datasetResponse] =
                await Promise.all([
                    getDashboard(),
                    getDatasets()
                ]);

            setDashboard(dashboardResponse.data);
            setDatasets(datasetResponse.data);

        } catch (error) {

            console.error(error);
            toast.error("Unable to load dashboard.");

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this dataset?")) return;

        try {

            await deleteDataset(id);
            toast.success("Dataset deleted successfully");
            loadData();

        } catch (error) {

            console.error(error);
            toast.error("Unable to delete dataset.");

        }

    };

    const getBadge = (score) => {

        if (score >= 80)
            return "badge rounded-pill bg-success";

        if (score >= 60)
            return "badge rounded-pill bg-warning text-dark";

        return "badge rounded-pill bg-danger";

    };

    const filteredDatasets = datasets.filter((dataset) =>
        dataset.fileName
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {

        return <LoadingSpinner />;

    }

    return (

        <div className="container py-4">

            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}

           <div className="row align-items-center mb-4">

    {/* Left Empty Space */}
    <div className="col-md-3"></div>

    {/* Center Heading */}
    <div className="col-md-6 text-center">

        <h1 className="fw-bold text-primary mb-2">
            <i className="bi bi-bar-chart-fill me-2"></i>
            Data Governance Dashboard
        </h1>

        <p className="text-muted mb-0">
            Monitor dataset quality, trust score and business value.
        </p>

    </div>

    {/* Right Button */}
    <div className="col-md-3 text-end">

        <button
            className="btn btn-primary px-4 py-2 shadow"
            onClick={() => navigate("/upload")}
        >
            <i className="bi bi-upload me-2"></i>
            Upload Dataset
        </button>

    </div>

</div>
            {/* Summary Cards */}

            <div className="row g-4">

                <div className="col-md-4">

                    <div className="card border-0 shadow-lg rounded-4 bg-primary text-white h-100">

                        <div className="card-body text-center">

                            <i className="bi bi-database-fill display-5"></i>

                            <h6 className="mt-3">
                                Total Datasets
                            </h6>

                            <h1 className="fw-bold">
                                {dashboard.totalDatasets ?? 0}
                            </h1>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card border-0 shadow-lg rounded-4 bg-success text-white h-100">

                        <div className="card-body text-center">

                            <i className="bi bi-table display-5"></i>

                            <h6 className="mt-3">
                                Total Rows
                            </h6>

                            <h1 className="fw-bold">
                                {dashboard.totalRows ?? 0}
                            </h1>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card border-0 shadow-lg rounded-4 bg-warning text-dark h-100">

                        <div className="card-body text-center">

                            <i className="bi bi-columns-gap display-5"></i>

                            <h6 className="mt-3">
                                Total Columns
                            </h6>

                            <h1 className="fw-bold">
                                {dashboard.totalColumns ?? 0}
                            </h1>

                        </div>

                    </div>

                </div>

            </div>

            {/* KPI Cards */}

            <div className="row g-4 mt-2">

                <div className="col-md-4">

                    <div className="card border-0 shadow rounded-4">

                        <div className="card-body text-center">

                            <h6 className="text-muted">
                                Average Quality
                            </h6>

                            <h2 className="text-success fw-bold">
                                {dashboard.averageQuality?.toFixed(2) ?? 0}%
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card border-0 shadow rounded-4">

                        <div className="card-body text-center">

                            <h6 className="text-muted">
                                Average Trust
                            </h6>

                            <h2 className="text-primary fw-bold">
                                {dashboard.averageTrust?.toFixed(2) ?? 0}%
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card border-0 shadow rounded-4">

                        <div className="card-body text-center">

                            <h6 className="text-muted">
                                Average Value
                            </h6>

                            <h2 className="text-danger fw-bold">
                                {dashboard.averageValue?.toFixed(2) ?? 0}%
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* Charts */}

            <div className="card shadow-lg rounded-4 border-0 mt-4">

                <div className="card-body">

                    <DashboardCharts summary={dashboard} />

                </div>

            </div>

            {/* Dataset Table */}

            <div className="card shadow-lg rounded-4 border-0 mt-4">

                <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">

                    <h4 className="fw-bold mb-0">

                        <i className="bi bi-folder2-open me-2"></i>

                        Uploaded Datasets

                    </h4>

                    <div
                        className="input-group"
                        style={{ width: "320px" }}
                    >

                        <span className="input-group-text">

                            <i className="bi bi-search"></i>

                        </span>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search datasets..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle">

                            <thead className="table-primary">

                                <tr>

                                    <th>ID</th>
                                    <th>Dataset</th>
                                    <th>Rows</th>
                                    <th>Columns</th>
                                    <th>Quality</th>
                                    <th>Trust</th>
                                    <th>Value</th>
                                    <th>Views</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    filteredDatasets.length > 0 ? (

                                        filteredDatasets.map((dataset) => (

                                            <tr key={dataset.id}>

                                                <td>
                                                    <span className="fw-semibold">
                                                        #{dataset.id}
                                                    </span>
                                                </td>

                                                <td>
                                                    <i className="bi bi-file-earmark-text text-primary me-2"></i>
                                                    <span className="fw-medium">
                                                        {dataset.fileName}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="badge bg-info text-dark rounded-pill px-3 py-2">
                                                        {dataset.rowCount}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="badge bg-secondary rounded-pill px-3 py-2">
                                                        {dataset.columnCount}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className={getBadge(dataset.qualityScore)}>
                                                        {dataset.qualityScore.toFixed(2)}%
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className={getBadge(dataset.trustScore)}>
                                                        {dataset.trustScore.toFixed(2)}%
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className={getBadge(dataset.valueScore)}>
                                                        {dataset.valueScore.toFixed(2)}%
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="badge bg-primary rounded-pill px-3 py-2">
                                                        <i className="bi bi-eye-fill me-1"></i>
                                                        {dataset.viewCount}
                                                    </span>
                                                </td>

                                                <td>

                                                    <button
                                                        className="btn btn-outline-primary btn-sm me-2"
                                                        onClick={() =>
                                                            navigate(`/dataset/${dataset.id}`)
                                                        }
                                                    >
                                                        <i className="bi bi-eye me-1"></i>
                                                        View
                                                    </button>

                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() =>
                                                            handleDelete(dataset.id)
                                                        }
                                                    >
                                                        <i className="bi bi-trash me-1"></i>
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                className="text-center py-5"
                                            >

                                                <i className="bi bi-folder-x display-3 text-muted"></i>

                                                <h5 className="mt-3 text-muted">
                                                    No datasets found
                                                </h5>

                                                <p className="text-secondary mb-0">
                                                    Upload a dataset to begin your analysis.
                                                </p>

                                            </td>

                                        </tr>

                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;

