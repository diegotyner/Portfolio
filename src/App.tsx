import { BrowserRouter, Routes, Route } from 'react-router';
import PetriDish from './routes/PetriDish';
import SingleCellCulture from './routes/SingleCellCulture';
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={
          <div className='w-full p-4 flex flex-col'>
            <h1>Check out my neuron simulations that I'll be using for my portfolio site:</h1>
            <a className='text-blue-600 underline underline-offset-4 hover:text-blue-800' href='/petri-dish'>Petri Dish</a>
            <a className='text-blue-600 underline underline-offset-4 hover:text-blue-800' href='/single-cell-culture'>Single Cell Culture</a>
          </div>
        } />
        <Route path="/petri-dish" element={<PetriDish />} />
        <Route path="/single-cell-culture" element={<SingleCellCulture />} />
      </Routes>
    </BrowserRouter>
  );
}
