import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import DatasetDetails from "./pages/DatasetDetails";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Dashboard />} />

                <Route path="/upload" element={<UploadPage />} />

                <Route path="/dataset/:id" element={<DatasetDetails />} />

            </Routes>

        </BrowserRouter>

    );

}

export default App;