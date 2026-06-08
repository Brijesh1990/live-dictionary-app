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



  <style>
{`
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
}

input:hover,
input:focus {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(255,255,255,0.3);
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,114,255,0.5);
}

button:active {
  transform: scale(0.96);
}
`}
</style>

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
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "30px",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    color: "#fff",
    animation: "fadeIn 0.8s ease"
  },

  title: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "25px",
    fontWeight: "700",
    letterSpacing: "1px",
    textShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },

  input: {
    width: "100%",
    padding: "15px 20px",
    fontSize: "16px",
    borderRadius: "14px",
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)"
  },

  infoText: {
    textAlign: "center",
    color: "#f5f5f5",
    marginTop: "15px",
    animation: "pulse 1.5s infinite"
  },

  errorText: {
    textAlign: "center",
    color: "#ffb3b3",
    fontWeight: "600",
    marginTop: "10px"
  },

  resultBox: {
    marginTop: "25px",
    padding: "25px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    animation: "slideUp 0.5s ease"
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    paddingBottom: "15px"
  },

  word: {
    margin: 0,
    fontSize: "2rem",
    textTransform: "capitalize",
    color: "#fff"
  },

  phonetic: {
    color: "#ddd",
    marginTop: "5px",
    fontSize: "1rem"
  },

  audioBtn: {
    padding: "10px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#00c6ff,#0072ff)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,114,255,0.4)"
  },

  meaningSection: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.08)"
  },

  partOfSpeech: {
    color: "#ffd166",
    marginBottom: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },

  definitionList: {
    paddingLeft: "20px"
  },

  definitionItem: {
    marginBottom: "15px",
    lineHeight: "1.8",
    color: "#f5f5f5"
  },

  exampleText: {
    marginTop: "8px",
    color: "#ddd",
    fontStyle: "italic"
  }
};

export default Dictionary