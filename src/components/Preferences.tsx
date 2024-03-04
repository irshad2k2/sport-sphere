import React, { useState } from 'react';

interface PreferencesProps {
  onClose: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ onClose }) => {
  const [sports, setSports] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);

  const handleSavePreferences = async () => {
    try {
      const response = await fetch('https://wd301-capstone-api.pupilfirst.school/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: { sports, teams }
        }),
      });

      if (!response.ok) {
        throw new Error('Error saving preferences');
      }

      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="preferences-modal">
      <h2>Dashboard Preferences</h2>
      <div>
        <label>Select Sports:</label>
        <select multiple value={sports} onChange={e => setSports(Array.from(e.target.selectedOptions, option => option.value))}>
          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="tennis">Tennis</option>
          {/* Add more sports options */}
        </select>
      </div>
      <div>
        <label>Select Teams:</label>
        <select multiple value={teams} onChange={e => setTeams(Array.from(e.target.selectedOptions, option => option.value))}>
          <option value="team1">Team 1</option>
          <option value="team2">Team 2</option>
          <option value="team3">Team 3</option>
          {/* Add more team options */}
        </select>
      </div>
      <button onClick={handleSavePreferences}>Save Preferences</button>
    </div>
  );
};

export default Preferences;
