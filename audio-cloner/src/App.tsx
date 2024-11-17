import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import VoiceCloneApp from './components/VoiceCloneApp';
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<VoiceCloneApp />} />
      </Routes>
    </Router>
  );
}
