import { useState, useEffect } from 'react';

const SettingsPage = () => {
  const [scriptId, setScriptId] = useState('');

  useEffect(() => {
    const storedScriptId = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
    if (storedScriptId) {
      setScriptId(storedScriptId);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('VITE_GOOGLE_SCRIPT_ID', scriptId);
    alert('Google Script ID saved!');
  };

  return (
    <div>
      <h2>Settings</h2>
      <div>
        <label htmlFor="scriptId">Google Script ID:</label>
        <input
          type="text"
          id="scriptId"
          value={scriptId}
          onChange={(e) => setScriptId(e.target.value)}
          style={{ width: '400px', marginLeft: '10px' }}
        />
      </div>
      <button onClick={handleSave} style={{ marginTop: '10px' }}>
        Save
      </button>
    </div>
  );
};

export default SettingsPage;