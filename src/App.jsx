import React, { useState, useEffect } from 'react';

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live search effect: Triggers fetch 500ms after the user stops typing
  useEffect(() => {
    if (!searchTerm.trim()) {
      setWordData(null);
      setError('');
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchWordDefinition(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchWordDefinition = async (word) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error('Word not found in database.');
      }
      
      const data = await response.json();
      setWordData(data[0]); // Take the first matched entry object
    } catch (err) {
      setWordData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    // Find the first available phonetic audio track
    const audioUrl = wordData?.phonetics?.find(p => p.audio)?.audio;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      alert('Audio pronunciation unavailable for this word.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Dictionary App</h1>
      
      <input
        type="text"
        placeholder="Type a word to search instantly..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />

      {loading && <p style={styles.infoText}>Searching definitions...</p>}
      
      {error && <p style={styles.errorText}>{error}</p>}

      {wordData && !loading && (
        <div style={styles.resultBox}>
          <div style={styles.headerRow}>
            <div>
              <h2 style={styles.word}>{wordData.word}</h2>
              <p style={styles.phonetic}>{wordData.phonetic || wordData.phonetics?.[0]?.text}</p>
            </div>
            {wordData.phonetics?.some(p => p.audio) && (
              <button onClick={playAudio} style={styles.audioBtn}>🔊 Play Audio</button>
            )}
          </div>

          {wordData.meanings?.map((meaning, index) => (
            <div key={index} style={styles.meaningSection}>
              <h3 style={styles.partOfSpeech}>{meaning.partOfSpeech}</h3>
              <ul style={styles.definitionList}>
                {meaning.definitions.slice(0, 3).map((def, i) => (
                  <li key={i} style={styles.definitionItem}>
                    <strong>Definition:</strong> {def.definition}
                    {def.example && (
                      <p style={styles.exampleText}><em>Example: "{def.example}"</em></p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple embedded JavaScript styles for plug-and-play usage
const styles = {
  container: { maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { textAlign: 'center', color: '#333' },
  input: { width: '100%', padding: '12px 20px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', marginBottom: '20px' },
  infoText: { textAlign: 'center', color: '#666', fontStyle: 'italic' },
  errorText: { textAlign: 'center', color: '#ff4d4d', fontWeight: 'bold' },
  resultBox: { padding: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#fafafa', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eaeaea', paddingBottom: '10px' },
  word: { margin: 0, fontSize: '28px', textTransform: 'capitalize', color: '#1a1a1a' },
  phonetic: { margin: '5px 0 0 0', color: '#777', fontSize: '16px' },
  audioBtn: { padding: '8px 14px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  meaningSection: { marginTop: '20px' },
  partOfSpeech: { fontStyle: 'italic', color: '#0070f3', borderBottom: '1px solid #ddd', paddingBottom: '4px' },
  definitionList: { paddingLeft: '20px' },
  definitionItem: { marginBottom: '12px', color: '#333', lineHeight: '1.5' },
  exampleText: { margin: '4px 0 0 0', color: '#666', fontSize: '14px' }
};

export default Dictionary