/**
 * Convert Presentation Demo MIDI files to MP3
 * 
 * This script:
 * 1. Reads MIDI files from pres_demo_midi folder
 * 2. Converts each to MP3 using FluidSynth + ffmpeg
 * 3. Renames according to mapping rules
 * 4. Outputs to audio/presentation_demo
 * 
 * Requirements:
 * - FluidSynth installed and available in PATH
 * - ffmpeg installed and available in PATH
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const INPUT_DIR = 'pres_demo_midi';
const OUTPUT_DIR = path.join('audio', 'presentation_demo');
const TEMP_DIR = 'temp_audio';
const SOUNDFONT_PATH = 'FluidR3_GM/FluidR3_GM.sf2';

// File mapping - substring match to output filename
const FILE_MAPPING = [
    { match: 'The Legend of Zelda', output: 'piece1.mp3' },
    { match: 'Cool Cool', output: 'piece2.mp3' },
    { match: 'Trail of Blood', output: 'piece3.mp3' },
    { match: 'Other', output: 'piece4.mp3' }
];

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
 * Get output filename for a MIDI file based on mapping rules
 */
function getOutputFilename(midiFilename) {
    for (const mapping of FILE_MAPPING) {
        if (midiFilename.includes(mapping.match)) {
            return mapping.output;
        }
    }
    // Default fallback (shouldn't happen)
    return midiFilename.replace('.mid', '.mp3');
}

/**
 * Main execution
 */
console.log('='.repeat(60));
console.log('Presentation Demo MIDI to MP3 Conversion');
console.log('='.repeat(60));
console.log('');
console.log('This script will:');
console.log('1. Read MIDI files from pres_demo_midi/');
console.log('2. Convert to MP3 using FluidSynth + ffmpeg');
console.log('3. Rename according to mapping rules');
console.log('4. Output to audio/presentation_demo/');
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

// Get all MIDI files from input directory
const midiFiles = fs.readdirSync(INPUT_DIR).filter(file => file.endsWith('.mid'));

if (midiFiles.length === 0) {
    console.error(`✗ No MIDI files found in ${INPUT_DIR}`);
    process.exit(1);
}

console.log(`\n✓ Found ${midiFiles.length} MIDI file(s)`);
console.log('');
console.log('Starting conversion...');

// Process each MIDI file
midiFiles.forEach((midiFile, index) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`File ${index + 1}/${midiFiles.length}: ${midiFile}`);
    console.log('='.repeat(60));
    
    const inputPath = path.join(INPUT_DIR, midiFile);
    const outputFilename = getOutputFilename(midiFile);
    const outputPath = path.join(OUTPUT_DIR, outputFilename);
    
    console.log(`  Input:  ${inputPath}`);
    console.log(`  Output: ${outputPath}`);
    
    try {
        convertMidiToMp3(inputPath, outputPath);
    } catch (error) {
        console.error(`Failed to convert ${midiFile}:`, error.message);
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

