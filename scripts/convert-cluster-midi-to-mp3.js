/**
 * Convert 16bar cluster MIDI files to MP3 files
 * 
 * This script:
 * 1. Converts cluster_1.mid, cluster_2.mid, cluster_3.mid for each story
 * 2. Saves them as cluster_1.mp3, cluster_2.mp3, cluster_3.mp3
 * 3. cluster_4.mp3 already exists and doesn't need conversion
 * 
 * Requirements:
 * - FluidSynth installed and available in PATH
 * - ffmpeg installed and available in PATH
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
 * Convert MIDI to MP3 using FluidSynth and ffmpeg
 */
function convertMidiToMp3(midiPath, mp3Path) {
    const tempWavPath = path.join(TEMP_DIR, `temp_${Date.now()}.wav`);
    
    try {
        console.log(`  Converting to WAV...`);
        // Convert MIDI to WAV using FluidSynth
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
            { stdio: 'inherit' }
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
 * Process cluster MIDI files for a single story
 */
function processStoryClusterFiles(story) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing cluster files for: ${story.id}`);
    console.log('='.repeat(60));
    
    // Create output directory for this story
    const storyOutputDir = path.join(OUTPUT_DIR, story.id);
    if (!fs.existsSync(storyOutputDir)) {
        fs.mkdirSync(storyOutputDir, { recursive: true });
    }
    
    // Convert cluster_1.mid, cluster_2.mid, cluster_3.mid
    // cluster_4.mid is already converted in the main conversion script
    for (let clusterNum = 1; clusterNum <= 3; clusterNum++) {
        const clusterMidiPath = path.join('piano_melodies', story.midiDirName, '16bar', `cluster_${clusterNum}.mid`);
        
        if (!fs.existsSync(clusterMidiPath)) {
            console.error(`  ✗ Cluster MIDI not found: ${clusterMidiPath}`);
            continue;
        }
        
        console.log(`\n  Converting cluster_${clusterNum}.mid...`);
        const mp3Path = path.join(storyOutputDir, `cluster_${clusterNum}.mp3`);
        
        // Skip if already exists
        if (fs.existsSync(mp3Path)) {
            console.log(`  ⊙ Already exists, skipping: ${mp3Path}`);
            continue;
        }
        
        convertMidiToMp3(clusterMidiPath, mp3Path);
    }
}

/**
 * Main execution
 */
console.log('='.repeat(60));
console.log('Cluster MIDI to MP3 Conversion Script');
console.log('='.repeat(60));
console.log('');
console.log('This script will:');
console.log('1. Convert cluster_1.mid, cluster_2.mid, cluster_3.mid to MP3');
console.log('2. For all 4 stories');
console.log('3. Save to audio/{story}/ directory');
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
        processStoryClusterFiles(story);
    } catch (error) {
        console.error(`Failed to process cluster files for ${story.id}:`, error.message);
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


