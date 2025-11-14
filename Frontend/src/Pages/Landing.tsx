import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAppDispatch } from '../hooks/hooks';
import { setPromptAsync } from '../redux/slices/prompt';
import type { RootState } from "../redux/store";

interface LandingProps {
  onGenerate: (prompt: string) => void;
}

export default function Landing({ onGenerate }: LandingProps) {
  const [prompt, setLocalPrompt] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      
      dispatch(setPromptAsync(prompt.trim()));

      onGenerate(prompt);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Website Generator
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Describe your dream website and watch it come to life. Our AI-powered builder transforms your ideas into reality.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              placeholder="Describe the website you want to create... (e.g., 'A modern portfolio website with a hero section, project gallery, and contact form')"
              className="w-full h-40 px-6 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 resize-none transition-all duration-200 backdrop-blur-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
          >
            Generate Website
          </button>
        </form>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div className="bg-slate-800/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-400 mb-2">01</div>
            <div className="text-sm text-slate-300">Describe</div>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-400 mb-2">02</div>
            <div className="text-sm text-slate-300">Generate</div>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl font-bold text-blue-400 mb-2">03</div>
            <div className="text-sm text-slate-300">Deploy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
