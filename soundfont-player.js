/**
 * SoundFont Player Module
 * Handles MIDI playback using Tone.js with SoundFont samples
 */

const SoundFontPlayer = {
    
    // Current state
    sampler: null,
    isLoaded: false,
    isPlaying: false,
    currentPart: null,
    currentLoop: null,
    
    // Configuration
    config: {
        instrument: 'acoustic_grand_piano', // Default instrument
        baseUrl: 'https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/',
        volume: -10, // dB (Tone.js uses decibels)
    },
    
    /**
     * Initialize the SoundFont player
     * Loads the instrument samples and prepares for playback
     * @param {Object} options - Configuration options
     * @returns {Promise} - Resolves when ready to play
     */
    init: async function(options = {}) {
        console.log('Initializing SoundFont Player...');
        
        // Merge options
        this.config = { ...this.config, ...options };
        
        try {
            // Start Tone.js audio context
            await Tone.start();
            console.log('Tone.js audio context started');
            
            // Load the soundfont using Tone.js Sampler
            await this.loadSoundFont();
            
            this.isLoaded = true;
            console.log('SoundFont Player initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Error initializing SoundFont Player:', error);
            throw error;
        }
    },
    
    /**
     * Load SoundFont samples into Tone.js Sampler
     * Uses pre-converted soundfonts from Benjamin Gleitzman's library
     */
    loadSoundFont: async function() {
        return new Promise((resolve, reject) => {
            console.log(`Loading soundfont: ${this.config.instrument}...`);
            
            // Notes to load - we'll load specific notes that exist in the soundfont
            // Using only natural notes (C, D, E, F, G, A, B) which are guaranteed to exist
            const notesToLoad = {};
            const naturalNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            
            // Load natural notes from octaves 1-7
            for (let octave = 1; octave <= 7; octave++) {
                for (const note of naturalNotes) {
                    const noteName = `${note}${octave}`;
                    notesToLoad[noteName] = `${this.config.baseUrl}${this.config.instrument}-mp3/${noteName}.mp3`;
                }
            }
            
            // Add some key notes from octave 0 and 8
            notesToLoad['A0'] = `${this.config.baseUrl}${this.config.instrument}-mp3/A0.mp3`;
            notesToLoad['C8'] = `${this.config.baseUrl}${this.config.instrument}-mp3/C8.mp3`;
            
            console.log(`Loading ${Object.keys(notesToLoad).length} note samples...`);
            
            // Create Sampler with the note URLs
            this.sampler = new Tone.Sampler({
                urls: notesToLoad,
                release: 1,
                baseUrl: "",
                onload: () => {
                    console.log('SoundFont loaded successfully!');
                    
                    // Connect to output with volume control
                    const volume = new Tone.Volume(this.config.volume).toDestination();
                    this.sampler.connect(volume);
                    
                    resolve();
                },
                onerror: (error) => {
                    console.error('Error loading soundfont:', error);
                    reject(error);
                }
            });
        });
    },
    
    /**
     * Play MIDI data using the loaded SoundFont
     * @param {Object} midiData - Combined MIDI data from MidiUtils.concatenateMidi()
     * @param {boolean} loop - Whether to loop the playback
     * @returns {Promise} - Resolves when playback starts
     */
    playMidi: async function(midiData, loop = true) {
        if (!this.isLoaded) {
            throw new Error('SoundFont Player not initialized. Call init() first.');
        }
        
        // Stop any current playback
        this.stop();
        
        console.log(`Playing MIDI: ${midiData.notes.length} notes, duration: ${midiData.duration.toFixed(2)}s, loop: ${loop}`);
        
        try {
            // Create a Tone.Part to schedule all the notes
            const part = new Tone.Part((time, note) => {
                // Convert MIDI note number to note name
                const noteName = Tone.Frequency(note.midi, "midi").toNote();
                // Trigger the note with the sampler
                this.sampler.triggerAttackRelease(
                    noteName,
                    note.duration,
                    time,
                    note.velocity
                );
            }, midiData.notes.map(note => [note.time, note]));
            
            // Set loop if requested
            if (loop) {
                part.loop = true;
                part.loopEnd = midiData.duration;
            }
            
            // Start the part
            part.start(0);
            
            // Start Tone.js Transport
            Tone.Transport.start();
            
            this.currentPart = part;
            this.isPlaying = true;
            
            console.log('Playback started');
            
        } catch (error) {
            console.error('Error during playback:', error);
            throw error;
        }
    },
    
    /**
     * Play MIDI from URLs (loads and concatenates multiple MIDI files)
     * @param {string[]} midiUrls - Array of MIDI file URLs (1 or more)
     * @param {boolean} loop - Whether to loop the playback
     * @returns {Promise} - Resolves when playback starts
     */
    playMidiFromUrls: async function(midiUrls, loop = true) {
        if (!this.isLoaded) {
            await this.init();
        }
        
        console.log(`Loading MIDI files: ${midiUrls.join(', ')}`);
        
        try {
            let midiData;
            
            if (midiUrls.length === 0) {
                throw new Error('No MIDI files provided');
            } else if (midiUrls.length === 1) {
                // Single MIDI file
                const midi = await MidiUtils.loadMidiFile(midiUrls[0]);
                midiData = this.convertSingleMidi(midi);
            } else {
                // Multiple MIDI files - concatenate them all
                const midiFiles = await MidiUtils.loadMultipleMidiFiles(midiUrls);
                
                // Start with the first file
                midiData = this.convertSingleMidi(midiFiles[0]);
                
                // Concatenate each subsequent file
                for (let i = 1; i < midiFiles.length; i++) {
                    const nextMidiData = this.convertSingleMidi(midiFiles[i]);
                    midiData = this.concatenateMidiData(midiData, nextMidiData);
                }
            }
            
            await this.playMidi(midiData, loop);
            
        } catch (error) {
            console.error('Error playing MIDI from URLs:', error);
            throw error;
        }
    },
    
    /**
     * Concatenate two MIDI data objects
     * @param {Object} midiData1 - First MIDI data
     * @param {Object} midiData2 - Second MIDI data
     * @returns {Object} - Combined MIDI data
     */
    concatenateMidiData: function(midiData1, midiData2) {
        const duration1 = midiData1.duration;
        const combinedNotes = [...midiData1.notes];
        
        // Add notes from second MIDI, shifted by duration of first
        midiData2.notes.forEach(note => {
            combinedNotes.push({
                ...note,
                time: note.time + duration1
            });
        });
        
        return {
            notes: combinedNotes,
            duration: duration1 + midiData2.duration,
            bpm: midiData1.bpm
        };
    },
    
    /**
     * Convert a single Midi object to the format expected by playMidi
     * @param {Midi} midi - Parsed MIDI object from @tonejs/midi
     * @returns {Object} - MIDI data in the concatenated format
     */
    convertSingleMidi: function(midi) {
        const notes = [];
        
        midi.tracks.forEach(track => {
            track.notes.forEach(note => {
                notes.push({
                    time: note.time,
                    duration: note.duration,
                    midi: note.midi,
                    name: note.name,
                    velocity: note.velocity
                });
            });
        });
        
        notes.sort((a, b) => a.time - b.time);
        
        return {
            notes: notes,
            duration: midi.duration,
            bpm: midi.header.tempos[0]?.bpm || 120
        };
    },
    
    /**
     * Stop currently playing music
     */
    stop: function() {
        if (this.currentPart) {
            this.currentPart.stop();
            this.currentPart.dispose();
            this.currentPart = null;
        }
        
        if (this.isPlaying) {
            Tone.Transport.stop();
            Tone.Transport.cancel(); // Clear all scheduled events
            this.isPlaying = false;
            console.log('Playback stopped');
        }
    },
    
    /**
     * Pause playback
     */
    pause: function() {
        if (this.isPlaying) {
            Tone.Transport.pause();
            this.isPlaying = false;
            console.log('Playback paused');
        }
    },
    
    /**
     * Resume playback
     */
    resume: function() {
        if (!this.isPlaying && this.currentPart) {
            Tone.Transport.start();
            this.isPlaying = true;
            console.log('Playback resumed');
        }
    },
    
    /**
     * Set volume
     * @param {number} volume - Volume in decibels (e.g., -10 to 0)
     */
    setVolume: function(volume) {
        this.config.volume = volume;
        if (this.sampler && this.sampler.volume) {
            this.sampler.volume.value = volume;
        }
    },
    
    /**
     * Set volume from 0-1 range (more intuitive)
     * @param {number} volume - Volume from 0.0 to 1.0
     */
    setVolumeLinear: function(volume) {
        // Convert linear 0-1 to decibels (approximately)
        // 0.0 -> -60dB (very quiet)
        // 1.0 -> 0dB (full volume)
        const db = volume <= 0 ? -60 : (volume * 30) - 30;
        this.setVolume(db);
    },
    
    /**
     * Check if player is initialized and ready
     * @returns {boolean}
     */
    isReady: function() {
        return this.isLoaded && this.sampler !== null;
    },
    
    /**
     * Get current playback state
     * @returns {Object}
     */
    getState: function() {
        return {
            isLoaded: this.isLoaded,
            isPlaying: this.isPlaying,
            transportState: Tone.Transport.state,
            transportTime: Tone.Transport.seconds
        };
    }
};

