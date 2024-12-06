import './App.css';
import {Routes, Route} from 'react-router-dom'
import Page1 from './components/page1';
import Page2 from './components/page2';
import Page3 from './components/page3';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Page1/>}/>
        <Route path="/2" element={<Page2/>}/>
        <Route path="/3" element={<Page3/>}/>
      </Routes>
    </div>
  );
}

export default App;
