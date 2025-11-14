import { useState, useEffect } from 'react';
import { ChevronRight, FileCode, Folder, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import axios from "axios";
import { BACKEND_URL } from '../config';
import { useAppSelector } from '../hooks/hooks';
import { parseXml } from '../utils/step';
import { type Step,type FileItem,StepType } from '../types/index';
import {}


interface GeneratorProps {
  prompt: string;
  onBack: () => void;
}

export default function Generator({ prompt }: GeneratorProps) {
  const [steps, setSteps] = useState<Step[]>([]);

  const userPrompt=useAppSelector(state=>state.prompt.value)

  const [files, setFiles] = useState<FileItem[]>([]);


  // updating the file list 
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        const finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            const file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            const folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // useEffect(() => {
  //   if (steps.length === 0) return;  // nothing to animate

  //   let currentStep = 0;
  //   const interval = setInterval(() => {
  //     setSteps(prev => {
  //       return prev.map((step, idx) => {
  //         if (idx === currentStep) return { ...step, status: "completed" };
  //         if (idx === currentStep + 1) return { ...step, status: "in-progress" };
  //         return step;
  //       });
  //     });

  //     currentStep++;

  //     if (currentStep >= steps.length) {
  //       clearInterval(interval);
  //     }
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, [steps]);   // run once when steps are first set


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

  const renderFileTree = (nodes: FileItem[]) => {
    return nodes.map((node) => {
      const currentPath = node.path;
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
            <div className="ml-4">{renderFileTree(node.children)}</div>
          )}
        </div>
      );
    });
  };

  const getStepIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const chatCall=async ()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/template/checkAppType`,{
        prompt:userPrompt.trim()
      });
      
      const {prompts,uiPrompts}=response.data;
      const parsedXml=await parseXml(uiPrompts[0]);
      console.log(parsedXml);
      setSteps(parsedXml);
      console.log(parsedXml);

    // const stepsResponse=await axios.post(`${BACKEND_URL}/api/v1/chat/chatRoutes`,{
    //     messages:[...prompts,userPrompt].map(text =>({
    //       role:"user",
    //       parts:[{text}]
    //     }))
    //   });
  }

  // api call 
  useEffect(()=>{
    if(!userPrompt?.trim())return;

    const callingBackend = async () => {
      try{
        await chatCall();
      }catch(err){
        console.log("Error in Generator useEffect:",err);
      }
    }

    callingBackend();
  }, [userPrompt]);

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
                    {step.status === 'in-progress' && 'In progress...'}
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
