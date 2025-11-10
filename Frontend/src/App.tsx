import { useState } from 'react';
import Landing from './Pages/Landing';
import Generator from './Pages/Generator';

type Page = 'landing' | 'generator';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [userPrompt, setUserPrompt] = useState('');

  const handleGenerate = (prompt: string) => {
    setUserPrompt(prompt);
    setCurrentPage('generator');
  };

  const handleBack = () => {
    setCurrentPage('landing');
  };

  return (
    <>
      {currentPage === 'landing' && <Landing onGenerate={handleGenerate} />}
      {currentPage === 'generator' && <Generator prompt={userPrompt} onBack={handleBack} />}
    </>
  );
}

export default App;
