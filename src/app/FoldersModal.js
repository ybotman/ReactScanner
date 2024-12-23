import React, { useState } from 'react';

function FoldersModal({ folders, setFolders, setActiveFolder }) {
  const [newFolderPath, setNewFolderPath] = useState('');

  async function addFolder() {
    if (!newFolderPath) return;
    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ path: newFolderPath })
    });
    const data = await res.json();
    setFolders(data.folders);
    setNewFolderPath('');
  }

  async function makeActive(folderPath) {
    const res = await fetch('/api/folders/active', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ path: folderPath })
    });
    const data = await res.json();
    setFolders(data.folders);
    const active = data.folders.find(f => f.active);
    setActiveFolder(active ? active.path : null);
  }

  async function scanActiveFolder() {
    if (!folders.some(f => f.active)) {
      alert('No active folder selected!');
      return;
    }
    const res = await fetch('/api/scan', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      alert('Scan completed and JSON file created.');
    } else {
      alert('Scan failed: ' + data.error);
    }
  }

  return (
    <div style={{marginTop:'20px'}}>
      <h2>Folder Management</h2>
      <div>
        <input 
          type="text" 
          value={newFolderPath} 
          onChange={e => setNewFolderPath(e.target.value)} 
          placeholder="Enter full folder path" 
        />
        <button onClick={addFolder}>Add Folder</button>
      </div>
      <ul>
        {folders.map((folder, idx) => (
          <li key={idx}>
            {folder.path} 
            {folder.active ? ' (active)' : (
              <button onClick={() => makeActive(folder.path)}>Make Active</button>
            )}
          </li>
        ))}
      </ul>
      <div>
        <button onClick={scanActiveFolder}>Scan Active Folder for JS/CSS</button>
      </div>
    </div>
  );
}

export default FoldersModal;
