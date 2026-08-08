import { BrowserRouter, Routes, Route } from 'react-router';
import PetriDish from './routes/PetriDish';
import SingleCellCulture from './routes/SingleCellCulture';
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/petri-dish" element={<PetriDish />} />
        <Route path="/single-cell-culture" element={<SingleCellCulture />} />
        {/* "/" reserved for the real home route, built later */}
      </Routes>
    </BrowserRouter>
  );
}
