/**
 * Data loader module
 * Handles loading and parsing of story CSV files and question JSON files
 */

const DataLoader = {
    
    /**
     * Load all stories and questions
     * Returns a promise that resolves with an array of story objects
     */
    loadAllData: async function() {
        const storyPromises = CONFIG.stories.map(storyConfig => 
            this.loadStory(storyConfig)
        );
        
        try {
            const stories = await Promise.all(storyPromises);
            console.log('All stories loaded successfully:', stories.length);
            return stories;
        } catch (error) {
            console.error('Error loading stories:', error);
            throw error;
        }
    },
    
    /**
     * Load a single story (CSV + questions JSON + MIDI mapping)
     */
    loadStory: async function(storyConfig) {
        try {
            const [sentences, questions, midiMapping] = await Promise.all([
                this.loadStoryCSV(storyConfig.csvPath),
                this.loadQuestions(storyConfig.questionsPath),
                this.loadMidiMapping(storyConfig.midiMappingPath)
            ]);
            
            return {
                id: storyConfig.id,
                title: storyConfig.title,
                sentences: sentences,
                questions: questions,
                musicPath: storyConfig.musicPath,
                midiMapping: midiMapping,
                midiDirName: storyConfig.midiDirName || storyConfig.id // Use midiDirName or fallback to id
            };
        } catch (error) {
            console.error(`Error loading story ${storyConfig.id}:`, error);
            throw error;
        }
    },
    
    /**
     * Load and parse story CSV file
     * Returns an array of sentence objects with ID and text
     */
    loadStoryCSV: function(csvPath) {
        return new Promise((resolve, reject) => {
            Papa.parse(csvPath, {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    if (results.errors.length > 0) {
                        console.warn('CSV parsing warnings:', results.errors);
                    }
                    
                    // Create array of sentence objects with ID and text
                    const sentences = results.data
                        .filter(row => row.text && row.text.trim())
                        .map(row => ({
                            id: parseInt(row.ID),
                            text: row.text.trim()
                        }));
                    
                    console.log(`Loaded ${sentences.length} sentences from ${csvPath}`);
                    resolve(sentences);
                },
                error: function(error) {
                    reject(error);
                }
            });
        });
    },
    
    /**
     * Load MIDI mapping JSON file
     */
    loadMidiMapping: function(jsonPath) {
        return fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${jsonPath}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Loaded MIDI mapping from ${jsonPath}`);
                return data;
            })
            .catch(error => {
                console.error(`Error loading MIDI mapping from ${jsonPath}:`, error);
                throw error;
            });
    },
    
    /**
     * Load questions JSON file
     */
    loadQuestions: function(jsonPath) {
        return fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${jsonPath}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Loaded ${data.questions.length} questions from ${jsonPath}`);
                return data.questions;
            })
            .catch(error => {
                console.error(`Error loading questions from ${jsonPath}:`, error);
                throw error;
            });
    }
};

