/**
 * MIDI Utilities Module
 * Handles loading, parsing, and concatenating MIDI files using @tonejs/midi
 */

const MidiUtils = {
    
    /**
     * Load and parse a MIDI file from a URL
     * @param {string} url - Path to the MIDI file
     * @returns {Promise<Midi>} - Parsed MIDI object from @tonejs/midi
     */
    loadMidiFile: async function(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load MIDI file: ${url}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const midi = new Midi(arrayBuffer);
            
            console.log(`Loaded MIDI: ${url}`);
            console.log(`  Duration: ${midi.duration.toFixed(2)}s`);
            console.log(`  Tracks: ${midi.tracks.length}`);
            
            return midi;
        } catch (error) {
            console.error(`Error loading MIDI file ${url}:`, error);
            throw error;
        }
    },
    
    /**
     * Load multiple MIDI files in parallel
     * @param {string[]} urls - Array of MIDI file paths
     * @returns {Promise<Midi[]>} - Array of parsed MIDI objects
     */
    loadMultipleMidiFiles: async function(urls) {
        const promises = urls.map(url => this.loadMidiFile(url));
        return Promise.all(promises);
    },
    
    /**
     * Concatenate two MIDI files by combining their note sequences
     * The second MIDI file is shifted in time to start after the first one ends
     * @param {Midi} midi1 - First MIDI file
     * @param {Midi} midi2 - Second MIDI file
     * @returns {Object} - Combined MIDI data ready for playback
     */
    concatenateMidi: function(midi1, midi2) {
        const duration1 = midi1.duration;
        
        // Create a combined structure with notes from both MIDI files
        const combinedNotes = [];
        
        // Add notes from first MIDI file
        midi1.tracks.forEach(track => {
            track.notes.forEach(note => {
                combinedNotes.push({
                    time: note.time,
                    duration: note.duration,
                    midi: note.midi,
                    name: note.name,
                    velocity: note.velocity
                });
            });
        });
        
        // Add notes from second MIDI file, shifted by duration of first
        midi2.tracks.forEach(track => {
            track.notes.forEach(note => {
                combinedNotes.push({
                    time: note.time + duration1,
                    duration: note.duration,
                    midi: note.midi,
                    name: note.name,
                    velocity: note.velocity
                });
            });
        });
        
        // Sort by time
        combinedNotes.sort((a, b) => a.time - b.time);
        
        const totalDuration = duration1 + midi2.duration;
        
        console.log(`Concatenated MIDI files:`);
        console.log(`  File 1 duration: ${duration1.toFixed(2)}s`);
        console.log(`  File 2 duration: ${midi2.duration.toFixed(2)}s`);
        console.log(`  Total duration: ${totalDuration.toFixed(2)}s`);
        console.log(`  Total notes: ${combinedNotes.length}`);
        
        return {
            notes: combinedNotes,
            duration: totalDuration,
            bpm: midi1.header.tempos[0]?.bpm || 120
        };
    },
    
    /**
     * Convert MIDI note number to frequency in Hz
     * @param {number} midiNote - MIDI note number (0-127)
     * @returns {number} - Frequency in Hz
     */
    midiToFrequency: function(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    },
    
    /**
     * Convert MIDI note to note name (e.g., 60 -> "C4")
     * @param {number} midiNote - MIDI note number (0-127)
     * @returns {string} - Note name with octave
     */
    midiToNoteName: function(midiNote) {
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const octave = Math.floor(midiNote / 12) - 1;
        const noteName = noteNames[midiNote % 12];
        return `${noteName}${octave}`;
    },
    
    /**
     * Get statistics about a MIDI file
     * @param {Midi} midi - Parsed MIDI object
     * @returns {Object} - Statistics including note count, duration, range, etc.
     */
    getMidiStats: function(midi) {
        let totalNotes = 0;
        let minNote = 127;
        let maxNote = 0;
        
        midi.tracks.forEach(track => {
            totalNotes += track.notes.length;
            track.notes.forEach(note => {
                minNote = Math.min(minNote, note.midi);
                maxNote = Math.max(maxNote, note.midi);
            });
        });
        
        return {
            duration: midi.duration,
            tracks: midi.tracks.length,
            totalNotes: totalNotes,
            noteRange: {
                min: minNote,
                max: maxNote,
                minName: this.midiToNoteName(minNote),
                maxName: this.midiToNoteName(maxNote)
            },
            bpm: midi.header.tempos[0]?.bpm || 120,
            timeSignature: midi.header.timeSignatures[0] || { timeSignature: [4, 4] }
        };
    },
    
    /**
     * Convert concatenated MIDI data to a simple event format
     * Useful for custom playback scheduling
     * @param {Object} concatenatedMidi - Result from concatenateMidi()
     * @returns {Array} - Array of {time, note, duration, velocity} objects
     */
    toEventList: function(concatenatedMidi) {
        return concatenatedMidi.notes.map(note => ({
            time: note.time,
            note: note.name,
            midi: note.midi,
            duration: note.duration,
            velocity: note.velocity
        }));
    }
};


