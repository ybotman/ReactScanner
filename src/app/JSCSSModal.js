import React, { useState, useEffect } from 'react';

function JSCSSModal({ activeFolder }) {
  const [files, setFiles] = useState([]);
  // files = [{ path: "full/path/to/file.js", wantDoc: false }, ...]

  const [selectedJSON, setSelectedJSON] = useState(''); 
  // In this scenario, if we assume multiple JSON files could exist, 
  // you might allow selecting which JS-CSS.json to load. 
  // Or if we assume just one per active folder, we can auto-load it.

  useEffect(() => {
    async function loadFiles() {
      if (!activeFolder) return;
      const folderName = activeFolder.split('/').pop(); 
      const fileName = folderName + '.JS-CSS.json';
      setSelectedJSON(fileName);
      const res = await fetch('/api/files?folderName=' + encodeURIComponent(folderName));
      const data = await res.json();
      setFiles(data.files);
    }
    loadFiles();
  }, [activeFolder]);

  function toggleWantDoc(idx) {
    const newFiles = [...files];
    newFiles[idx].wantDoc = !newFiles[idx].wantDoc;
    setFiles(newFiles);
  }

  async function documentFiles() {
    // POST the current selection to backend to generate the doc
    const res = await fetch('/api/files/document', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ files: files.filter(f => f.wantDoc) })
    });
    const data = await res.json();
    if (data.success) {
      alert('Document file created successfully at: ' + data.outputPath);
    } else {
      alert('Error creating document: ' + data.error);
    }
  }

  return (
    <div style={{marginTop: '20px'}}>
      <h2>JS/CSS File Selection</h2>
      {!activeFolder && <p>No active folder selected.</p>}
      {activeFolder && (
        <>
          <p>Active Folder: {activeFolder}</p>
          <p>JSON File: {selectedJSON}</p>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>File Path</th>
                <th>Document?</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, i) => (
                <tr key={i}>
                  <td>{f.path}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={f.wantDoc} 
                      onChange={() => toggleWantDoc(i)} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={documentFiles}>Generate Document</button>
        </>
      )}
    </div>
  );
}

export default JSCSSModal;
