import { useState, useEffect } from 'react';
import { ChevronRight, FileCode, Folder, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../config';

interface Step {
  id: number;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
}

interface GeneratorProps {
  prompt: string;
  onBack: () => void;
}

export default function Generator({ prompt }: GeneratorProps) {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: 'Analyzing requirements', status: 'in_progress' },
    { id: 2, title: 'Creating project structure', status: 'pending' },
    { id: 3, title: 'Generating components', status: 'pending' },
    { id: 4, title: 'Setting up styles', status: 'pending' },
    { id: 5, title: 'Building application', status: 'pending' },
  ]);

  const [files, setFiles] = useState<FileNode[]>([
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'App.tsx', type: 'file', content: 'Loading...' },
        { name: 'index.css', type: 'file', content: 'Loading...' },
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.tsx', type: 'file' },
            { name: 'Hero.tsx', type: 'file' },
            { name: 'Footer.tsx', type: 'file' },
          ],
        },
      ],
    },
    { name: 'package.json', type: 'file' },
    { name: 'index.html', type: 'file' },
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps((prev) =>
          prev.map((step, idx) => {
            if (idx === currentStep) {
              return { ...step, status: 'completed' };
            } else if (idx === currentStep + 1) {
              return { ...step, status: 'in_progress' };
            }
            return step;
          })
        );
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const renderFileTree = (nodes: FileNode[], path: string = '') => {
    return nodes.map((node) => {
      const currentPath = path ? `${path}/${node.name}` : node.name;
      const isExpanded = expandedFolders.has(currentPath);
      const isSelected = selectedFile === currentPath;

      return (
        <div key={currentPath}>
          <div
            className={`flex items-center gap-2 px-3 py-2 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors ${
              isSelected ? 'bg-slate-700' : ''
            }`}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(currentPath);
              } else {
                setSelectedFile(currentPath);
              }
            }}
          >
            {node.type === 'folder' && (
              <ChevronRight
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            )}
            {node.type === 'folder' ? (
              <Folder className="w-4 h-4 text-blue-400" />
            ) : (
              <FileCode className="w-4 h-4 text-slate-400" />
            )}
            <span className="text-sm text-slate-200">{node.name}</span>
          </div>
          {node.type === 'folder' && isExpanded && node.children && (
            <div className="ml-4">{renderFileTree(node.children, currentPath)}</div>
          )}
        </div>
      );
    });
  };

  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const chatCall=async ()=>{
    const response=await axios.post(`${BACKEND_URL}/template/checkAppType`,{
        prompt:prompt.trim()
      });
      
    const {prompts,uiPrompts}=response.data;

    const stepsResponse=await axios.post(`${BACKEND_URL}/chat/chatRoutes`,{
        messages:[...prompts,prompt].map(text =>({
          role:"user",
          parts:[{text}]
        }))
      });
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Generating Your Website</h1>
            <p className="text-sm text-slate-400 mt-1 line-clamp-1">{prompt}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 bg-slate-800 border-r border-slate-700 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            Generation Steps
          </h2>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50"
              >
                {getStepIcon(step.status)}
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-200">{step.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {step.status === 'completed' && 'Complete'}
                    {step.status === 'in_progress' && 'In progress...'}
                    {step.status === 'pending' && 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1 bg-slate-900 overflow-hidden">
          <div className="h-full flex">
            <div className="w-80 bg-slate-800/50 border-r border-slate-700 p-4 overflow-y-auto">
              <h2 className="text-sm font-semibold text-slate-300 mb-4 px-3">
                Project Files
              </h2>
              <div className="space-y-1">{renderFileTree(files)}</div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {selectedFile ? (
                <div className="bg-slate-800 rounded-lg p-6 h-full">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">{selectedFile}</h3>
                  </div>
                  <pre className="text-sm text-slate-300 font-mono">
                    <code>
                      {`// File content will appear here\n// This is a preview of your generated file\n\nimport React from 'react';\n\nexport default function Component() {\n  return (\n    <div>\n      {/* Your generated content */}\n    </div>\n  );\n}`}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FileCode className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a file to view its contents</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
