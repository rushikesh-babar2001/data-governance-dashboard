import { useRef, useState } from "react";
import { uploadDataset } from "../services/datasetService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./UploadPage.css";
function UploadPage() {

    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {

        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        if (!selectedFile.name.toLowerCase().endsWith(".csv")) {

            toast.error("Only CSV files are allowed.");
            e.target.value = "";
            return;

        }

        if (selectedFile.size === 0) {

            toast.error("Selected file is empty.");
            e.target.value = "";
            return;

        }

        setFile(selectedFile);

    };

    const handleUpload = async () => {

        if (!file) {

            toast.error("Please select a CSV file.");
            return;

        }

        const formData = new FormData();

        formData.append("file", file);

        try {

            setLoading(true);

            await uploadDataset(formData);

            toast.success("Dataset uploaded successfully!");

            setFile(null);

            if (fileInputRef.current) {

                fileInputRef.current.value = "";

            }

            setTimeout(() => {

                navigate("/");

            }, 1500);

        } catch (error) {

            console.error(error);

            toast.error("Upload failed. Please try again.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container py-5">

            <ToastContainer position="top-right" autoClose={3000} />

            <div className="row justify-content-center">

                <div className="col-lg-7">

                    <div className="card border-0 shadow-lg rounded-4">

                        <div className="card-header bg-primary text-white rounded-top-4 py-3">

                            <h3 className="mb-0 text-center">

                                <i className="bi bi-cloud-upload-fill me-2"></i>

                                Upload Dataset

                            </h3>

                        </div>

                        <div className="card-body p-4">

                            <div className="text-center mb-4">

                                <i
                                    className="bi bi-file-earmark-arrow-up text-primary"
                                    style={{ fontSize: "70px" }}
                                ></i>

                                <h5 className="mt-3">

                                    Upload your CSV Dataset

                                </h5>

                                <p className="text-muted">

                                    Only CSV files are supported.

                                </p>

                            </div>

                            <div className="mb-4">

                                <label className="form-label fw-semibold">

                                    <i className="bi bi-filetype-csv me-2"></i>

                                    Choose CSV File

                                </label>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="form-control form-control-lg"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />

                            </div>

                            {file && (

                                <div className="alert alert-info rounded-3">

                                    <h6 className="fw-bold">

                                        <i className="bi bi-file-earmark-text me-2"></i>

                                        Selected File

                                    </h6>

                                    <hr />

                                    <p className="mb-2">

                                        <strong>Name :</strong> {file.name}

                                    </p>

                                    <p className="mb-0">

                                        <strong>Size :</strong>{" "}

                                        {(file.size / 1024).toFixed(2)} KB

                                    </p>

                                </div>

                            )}

                            <div className="d-flex justify-content-center gap-3 mt-4">

                                <button
                                    className="btn btn-success px-4"
                                    onClick={handleUpload}
                                    disabled={loading}
                                >

                                    <i className="bi bi-upload me-2"></i>

                                    {loading ? "Uploading..." : "Upload Dataset"}

                                </button>

                                <button
                                    className="btn btn-outline-secondary px-4"
                                    onClick={() => navigate("/")}
                                    disabled={loading}
                                >

                                    <i className="bi bi-arrow-left me-2"></i>

                                    Back

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default UploadPage;