import { BrowserRouter, Routes, Route } from 'react-router';
import PetriDish from './routes/PetriDish';
import SingleCellCulture from './routes/SingleCellCulture';
import Homepage from './routes/Homepage';
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={
          <>
            <Homepage />
            <div className="fixed top-0 left-0 w-full p-4 flex flex-col gap-1 bg-[#050507]/70 backdrop-blur-sm border-b border-[#1a1a22] z-10">
              <h1 className="text-[#d8f5e3] text-sm font-mono opacity-80">
                Check out my neuron simulations that I'll be using for my portfolio site:
              </h1>
              <div className="flex gap-4">
                <a
                  className="text-[#01E005] underline underline-offset-4 hover:text-[#5dffab] font-mono text-sm"
                  href="/petri-dish"
                >
                  Petri Dish
                </a>
                <a
                  className="text-[#01E005] underline underline-offset-4 hover:text-[#5dffab] font-mono text-sm"
                  href="/single-cell-culture"
                >
                  Single Cell Culture
                </a>
              </div>
            </div>
          </>
        } />
        <Route path="/petri-dish" element={<PetriDish />} />
        <Route path="/single-cell-culture" element={<SingleCellCulture />} />
      </Routes>
    </BrowserRouter>
  );
}
