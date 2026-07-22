import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getDatasetById,
    updateSensitivity
} from "../services/datasetService";
import LoadingSpinner from "../components/LoadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DatasetDetails.css";

function DatasetDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [dataset, setDataset] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDataset();
    }, []);

    // ---------- Data Loading ----------

    const loadDataset = async () => {

        try {

            const response = await getDatasetById(id);

            setDataset(response.data);

        } catch (error) {

            console.error(error);

            toast.error("Unable to load dataset.");

        } finally {

            setLoading(false);

        }

    };

    // ---------- Sensitivity Handling ----------

    const handleSensitivityChange = (columnId, value) => {

        setDataset((prev) => ({
            ...prev,
            columns: prev.columns.map((column) =>
                column.id === columnId
                    ? { ...column, sensitivityTag: value }
                    : column
            )
        }));

    };

    const saveSensitivity = async (column) => {

        try {

            await updateSensitivity(column.id, column.sensitivityTag);

            toast.success("Sensitivity updated successfully.");

        } catch (error) {

            console.error(error);

            toast.error("Unable to update sensitivity.");

        }

    };

    if (loading) {
        return <LoadingSpinner />;
    }

    // ---------- Derived Metrics ----------

    const averageMissing =
        dataset.columns.length > 0
            ? dataset.columns.reduce(
                  (sum, column) => sum + column.missingPercentage,
                  0
              ) / dataset.columns.length
            : 0;

    const averageInvalid =
        dataset.columns.length > 0
            ? dataset.columns.reduce(
                  (sum, column) => sum + column.invalidPercentage,
                  0
              ) / dataset.columns.length
            : 0;

    // ---------- Badge Helpers ----------

    const getPercentageBadge = (value) => {

        if (value === 0) return "bg-success";
        if (value <= 20) return "bg-warning text-dark";

        return "bg-danger";

    };

    const getScoreBadge = (score) => {

        if (score >= 80) return "bg-success";
        if (score >= 60) return "bg-warning text-dark";

        return "bg-danger";

    };

    // ---------- Render ----------

    return (

        <div className="container mt-4">

            <ToastContainer position="top-right" autoClose={2500} />

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Dataset Details</h2>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                >
                    Back
                </button>

            </div>

            {/* Dataset Information */}

            <div className="card shadow mb-4">

                <div className="card-header">
                    <h4>Dataset Information</h4>
                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6">

                            <p>
                                <strong>File Name:</strong> {dataset.fileName}
                            </p>

                            <p>
                                <strong>Uploaded:</strong>{" "}
                                {new Date(dataset.uploadTime).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>

                            <p>
                                <strong>Rows:</strong> {dataset.rowCount}
                            </p>

                            <p>
                                <strong>Columns:</strong> {dataset.columnCount}
                            </p>

                            <p>
                                <strong>Views:</strong> {dataset.viewCount}
                            </p>

                        </div>

                        <div className="col-md-6">

                            <p>
                                <strong>Quality Score:</strong>{" "}
                                <span className={`badge ${getScoreBadge(dataset.qualityScore)} ms-2`}>
                                    {dataset.qualityScore.toFixed(2)}%
                                </span>
                            </p>

                            <p>
                                <strong>Trust Score:</strong>{" "}
                                <span className={`badge ${getScoreBadge(dataset.trustScore)} ms-2`}>
                                    {dataset.trustScore.toFixed(2)}%
                                </span>
                            </p>

                            <p>
                                <strong>Value Score:</strong>{" "}
                                <span className={`badge ${getScoreBadge(dataset.valueScore)} ms-2`}>
                                    {dataset.valueScore.toFixed(2)}%
                                </span>
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* Dataset Summary */}

            <div className="card shadow mb-4">

                <div className="card-header">
                    <h4>Dataset Summary</h4>
                </div>

                <div className="card-body">

                    <div className="row text-center">

                        <div className="col-md-4">
                            <h5>Average Missing</h5>
                            <span className={`badge ${getPercentageBadge(averageMissing)}`}>
                                {averageMissing.toFixed(2)}%
                            </span>
                        </div>

                        <div className="col-md-4">
                            <h5>Average Invalid</h5>
                            <span className={`badge ${getPercentageBadge(averageInvalid)}`}>
                                {averageInvalid.toFixed(2)}%
                            </span>
                        </div>

                        <div className="col-md-4">
                            <h5>Total Columns Profiled</h5>
                            <span className="badge bg-secondary">
                                {dataset.columns.length}
                            </span>
                        </div>

                    </div>

                </div>

            </div>

            {/* Column Profiling */}

            <div className="card shadow">

                <div className="card-header">
                    <h4>Column Profiling</h4>
                </div>

                <div className="card-body">

                    <table className="table table-bordered table-hover align-middle">

                        <thead className="table-dark">
                            <tr>
                                <th>Column</th>
                                <th>Data Type</th>
                                <th className="text-center">Missing %</th>
                                <th className="text-center">Invalid %</th>
                                <th className="text-center">Sensitivity</th>
                            </tr>
                        </thead>

                        <tbody>

                            {dataset.columns.map((column) => (

                                <tr key={column.id}>

                                    <td>{column.columnName}</td>

                                    <td>{column.dataType}</td>

                                    <td className="text-center">
                                        <span className={`badge ${getPercentageBadge(column.missingPercentage)}`}>
                                            {column.missingPercentage.toFixed(2)}%
                                        </span>
                                    </td>

                                    <td className="text-center">
                                        <span className={`badge ${getPercentageBadge(column.invalidPercentage)}`}>
                                            {column.invalidPercentage.toFixed(2)}%
                                        </span>
                                    </td>

                                    <td>

                                        <div className="d-flex justify-content-center align-items-center">

                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: "170px" }}
                                                value={column.sensitivityTag}
                                                onChange={(e) =>
                                                    handleSensitivityChange(column.id, e.target.value)
                                                }
                                            >
                                                <option value="PUBLIC">PUBLIC</option>
                                                <option value="PERSONAL">PERSONAL</option>
                                                <option value="PII">PII</option>
                                                <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                                            </select>

                                            <button
                                                className="btn btn-primary btn-sm ms-2"
                                                onClick={() => saveSensitivity(column)}
                                            >
                                                Save
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default DatasetDetails;
