import React, { useState, useEffect } from 'react';
import FoldersModal from './FoldersModal';
import JSCSSModal from './JSCSSModal';

function App() {
  const [activeTab, setActiveTab] = useState('folders'); // 'folders' or 'js-css'
  const [activeFolder, setActiveFolder] = useState(null);
  const [folders, setFolders] = useState([]); 
  // folders = [{path: '/full/path/to/folder', active: true/false}, ...]

  useEffect(() => {
    // Load initial config from backend
    async function loadConfig() {
      const res = await fetch('/api/folders');
      const data = await res.json();
      setFolders(data.folders);
      const active = data.folders.find(f => f.active);
      setActiveFolder(active ? active.path : null);
    }
    loadConfig();
  }, []);

  return (
    <div style={{padding: '20px'}}>
      <h1>Local React JS/CSS Documentation Tool</h1>
      <div>
        <button onClick={() => setActiveTab('folders')}>Folder Management</button>
        <button onClick={() => setActiveTab('js-css')}>JS-CSS Files</button>
      </div>

      {activeTab === 'folders' && 
        <FoldersModal 
          folders={folders} 
          setFolders={setFolders} 
          setActiveFolder={setActiveFolder} 
        />
      }

      {activeTab === 'js-css' &&
        <JSCSSModal 
          activeFolder={activeFolder} 
          // The JS-CSS modal will fetch and show files from the currently active folder
        />
      }
    </div>
  );
}

export default App;
