import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Order from "./Pages/Order";

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Order />} />
        </Routes>
    </BrowserRouter>
);

export default Router;
