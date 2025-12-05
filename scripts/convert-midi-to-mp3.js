/**
 * Convert MIDI partitions to MP3 files
 * 
 * This script:
 * 1. Reads all MIDI mapping JSONs for the 4 stories
 * 2. For each partition, concatenates the MIDI files listed
 * 3. Converts concatenated MIDI to MP3 using FluidSynth + ffmpeg
 * 4. Also converts cluster_4.mid for trailing partitions
 * 
 * Requirements:
 * - FluidSynth installed and available in PATH
 * - ffmpeg installed and available in PATH
 * - Node.js packages: @tonejs/midi, fs, path, child_process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Midi } = require('@tonejs/midi');

// Configuration
const STORIES = [
    { id: 'carnival', midiDirName: 'carnival' },
    { id: 'lantern', midiDirName: 'lantern' },
    { id: 'starling_five', midiDirName: 'starling_five' },
    { id: 'window_blue_curtain', midiDirName: 'window_blue_curtain' }
];

const SOUNDFONT_PATH = 'FluidR3_GM/FluidR3_GM.sf2';
const OUTPUT_DIR = 'audio';
const TEMP_DIR = 'temp_audio';

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Load and parse a MIDI file from disk
 */
function loadMidiFile(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const midi = new Midi(buffer);
        return midi;
    } catch (error) {
        console.error(`Error loading MIDI file ${filePath}:`, error.message);
        throw error;
    }
}

/**
 * Concatenate multiple MIDI files into one
 * Based on midi-utils.js concatenateMidi but for multiple files
 */
function concatenateMultipleMidi(midiFiles) {
    if (midiFiles.length === 0) {
        throw new Error('No MIDI files to concatenate');
    }
    
    if (midiFiles.length === 1) {
        return midiFiles[0];
    }
    
    // Start with the first MIDI file's structure
    const combinedNotes = [];
    let currentDuration = 0;
    
    // Process each MIDI file
    midiFiles.forEach((midi, index) => {
        // Add all notes from this MIDI, shifted by current duration
        midi.tracks.forEach(track => {
            track.notes.forEach(note => {
                combinedNotes.push({
                    time: note.time + currentDuration,
                    duration: note.duration,
                    midi: note.midi,
                    name: note.name,
                    velocity: note.velocity
                });
            });
        });
        
        currentDuration += midi.duration;
    });
    
    // Sort by time
    combinedNotes.sort((a, b) => a.time - b.time);
    
    return {
        notes: combinedNotes,
        duration: currentDuration,
        header: midiFiles[0].header
    };
}

/**
 * Convert combined MIDI notes back to binary MIDI format
 */
function notesToMidiFile(combinedMidi) {
    const midi = new Midi();
    const track = midi.addTrack();
    
    // Set tempo from original
    if (combinedMidi.header && combinedMidi.header.tempos && combinedMidi.header.tempos.length > 0) {
        midi.header.setTempo(combinedMidi.header.tempos[0].bpm);
    } else {
        midi.header.setTempo(120); // Default
    }
    
    // Add all notes
    combinedMidi.notes.forEach(note => {
        track.addNote({
            midi: note.midi,
            time: note.time,
            duration: note.duration,
            velocity: note.velocity
        });
    });
    
    return midi.toArray();
}

/**
 * Convert MIDI to MP3 using FluidSynth and ffmpeg
 */
function convertMidiToMp3(midiPath, mp3Path) {
    const tempWavPath = path.join(TEMP_DIR, `temp_${Date.now()}.wav`);
    
    try {
        console.log(`  Converting to WAV...`);
        // Convert MIDI to WAV using FluidSynth
        // Use path.resolve to get absolute paths for Windows compatibility
        const absoluteSoundfontPath = path.resolve(SOUNDFONT_PATH);
        const absoluteMidiPath = path.resolve(midiPath);
        const absoluteWavPath = path.resolve(tempWavPath);
        const absoluteMp3Path = path.resolve(mp3Path);

        execSync(
            `fluidsynth -F "${absoluteWavPath}" -r 44100 -ni "${absoluteSoundfontPath}" "${absoluteMidiPath}"`,
            { stdio: 'inherit' }
        );
        
        console.log(`  Converting to MP3...`);
        // Convert WAV to MP3 using ffmpeg
        execSync(
            `ffmpeg -i "${absoluteWavPath}" -codec:a libmp3lame -qscale:a 2 "${absoluteMp3Path}" -y`,
            { stdio: 'inherit' }  // Changed from 'pipe' to 'inherit' to see errors
        );
                
        // Clean up temp WAV file
        fs.unlinkSync(tempWavPath);
        
        console.log(`  ✓ Created: ${mp3Path}`);
    } catch (error) {
        console.error(`  ✗ Error converting ${midiPath}:`, error.message);
        // Clean up temp file if it exists
        if (fs.existsSync(tempWavPath)) {
            fs.unlinkSync(tempWavPath);
        }
        throw error;
    }
}

/**
 * Process a single story
 */
function processStory(story) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing story: ${story.id}`);
    console.log('='.repeat(60));
    
    // Create output directory for this story
    const storyOutputDir = path.join(OUTPUT_DIR, story.id);
    if (!fs.existsSync(storyOutputDir)) {
        fs.mkdirSync(storyOutputDir, { recursive: true });
    }
    
    // Load MIDI mapping JSON
    const mappingPath = path.join('sentence_to_midi', story.id, `${story.id}_midi_mapping.json`);
    if (!fs.existsSync(mappingPath)) {
        console.error(`  ✗ Mapping file not found: ${mappingPath}`);
        return;
    }
    
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    
    // Process each cluster (1to2, 2to3, 3to4)
    Object.keys(mapping).forEach(clusterKey => {
        console.log(`\n  Cluster: ${clusterKey}`);
        const partitions = mapping[clusterKey];
        
        partitions.forEach((partition, partitionIndex) => {
            console.log(`    Partition ${partitionIndex + 1}: sentences ${partition.sentence_ids}`);
            
            // Build paths to MIDI files
            const midiDir = path.join('piano_melodies', story.midiDirName, '2bar', 'interpolations', clusterKey);
            const midiPaths = partition.midi_files.map(file => path.join(midiDir, file));
            
            // Check if all MIDI files exist
            const missingFiles = midiPaths.filter(p => !fs.existsSync(p));
            if (missingFiles.length > 0) {
                console.error(`      ✗ Missing MIDI files:`, missingFiles);
                return;
            }
            
            // Load and concatenate MIDI files
            console.log(`      Loading ${midiPaths.length} MIDI files...`);
            const midiFiles = midiPaths.map(p => loadMidiFile(p));
            const combined = concatenateMultipleMidi(midiFiles);
            
            // Write temporary concatenated MIDI file
            const tempMidiPath = path.join(TEMP_DIR, `temp_${story.id}_${clusterKey}_${partitionIndex + 1}.mid`);
            const midiBytes = notesToMidiFile(combined);
            fs.writeFileSync(tempMidiPath, Buffer.from(midiBytes));
            
            // Convert to MP3
            const mp3Filename = `${clusterKey}_partition${partitionIndex + 1}.mp3`;
            const mp3Path = path.join(storyOutputDir, mp3Filename);
            
            convertMidiToMp3(tempMidiPath, mp3Path);
            
            // Clean up temp MIDI file
            fs.unlinkSync(tempMidiPath);
        });
    });
    
    // Also convert cluster_4.mid for trailing partitions
    console.log(`\n  Converting cluster_4.mid...`);
    const cluster4Path = path.join('piano_melodies', story.midiDirName, '16bar', 'cluster_4.mid');
    
    if (fs.existsSync(cluster4Path)) {
        const mp3Path = path.join(storyOutputDir, 'cluster_4.mp3');
        convertMidiToMp3(cluster4Path, mp3Path);
    } else {
        console.error(`    ✗ cluster_4.mid not found: ${cluster4Path}`);
    }
}

/**
 * Process average cluster MIDI files for all stories
 */
function processAverageCluster(story) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing average cluster for: ${story.id}`);
    console.log('='.repeat(60));
    
    // Create output directory for this story
    const storyOutputDir = path.join(OUTPUT_DIR, story.id);
    if (!fs.existsSync(storyOutputDir)) {
        fs.mkdirSync(storyOutputDir, { recursive: true });
    }
    
    // Convert cluster_avg.mid from average_16bar folder
    console.log(`\n  Converting cluster_avg.mid...`);
    const clusterAvgPath = path.join('piano_melodies', story.midiDirName, 'average_16bar', 'cluster_avg.mid');
    
    if (fs.existsSync(clusterAvgPath)) {
        const mp3Path = path.join(storyOutputDir, 'cluster_avg.mp3');
        convertMidiToMp3(clusterAvgPath, mp3Path);
    } else {
        console.error(`    ✗ cluster_avg.mid not found: ${clusterAvgPath}`);
    }
}

/**
 * Main execution
 */
console.log('='.repeat(60));
console.log('MIDI to MP3 Conversion Script');
console.log('='.repeat(60));
console.log('');
console.log('This script will:');
console.log('1. Read MIDI mapping JSONs for all stories');
console.log('2. Concatenate MIDI files for each partition');
console.log('3. Convert to MP3 using FluidSynth + ffmpeg');
console.log('');
console.log('Requirements:');
console.log('  - FluidSynth in PATH');
console.log('  - ffmpeg in PATH');
console.log(`  - SoundFont: ${SOUNDFONT_PATH}`);
console.log('');

// Check if FluidSynth is available
try {
    execSync('fluidsynth --version', { stdio: 'pipe' });
    console.log('✓ FluidSynth found');
} catch (error) {
    console.error('✗ FluidSynth not found. Please install FluidSynth and add it to PATH.');
    process.exit(1);
}

// Check if ffmpeg is available
try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
    console.log('✓ ffmpeg found');
} catch (error) {
    console.error('✗ ffmpeg not found. Please install ffmpeg and add it to PATH.');
    process.exit(1);
}

// Check if soundfont exists
if (!fs.existsSync(SOUNDFONT_PATH)) {
    console.error(`✗ SoundFont not found: ${SOUNDFONT_PATH}`);
    process.exit(1);
}
console.log(`✓ SoundFont found: ${SOUNDFONT_PATH}`);

console.log('');
console.log('Starting conversion...');

// Process each story
STORIES.forEach(story => {
    try {
        processStory(story);
    } catch (error) {
        console.error(`Failed to process story ${story.id}:`, error.message);
    }
});

// Process average cluster files
console.log(`\n${'='.repeat(60)}`);
console.log('Processing average cluster files...');
console.log('='.repeat(60));
STORIES.forEach(story => {
    try {
        processAverageCluster(story);
    } catch (error) {
        console.error(`Failed to process average cluster for ${story.id}:`, error.message);
    }
});

// Clean up temp directory
console.log(`\n${'='.repeat(60)}`);
console.log('Cleaning up...');
if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true });
    console.log('✓ Temp directory removed');
}

console.log('');
console.log('='.repeat(60));
console.log('Conversion complete!');
console.log(`Output directory: ${OUTPUT_DIR}`);
console.log('='.repeat(60));

