import api from "../api/api";

export const getDashboard = () =>
    api.get("/dashboard");

export const getDatasets = () =>
    api.get("/datasets");

export const getDatasetById = (id) =>
    api.get(`/datasets/${id}`);

export const uploadDataset = (formData) =>
    api.post("/datasets/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

export const deleteDataset = (id) =>
    api.delete(`/datasets/${id}`);
    
    export const updateSensitivity = (columnId, sensitivityTag) =>
    api.put(`/datasets/columns/${columnId}/sensitivity`, {
        sensitivityTag
    });