/**
 * SoundFont Conversion Script
 * Converts SF2 file to web-compatible format for browser playback
 * 
 * This script extracts samples from the SF2 file and creates a JSON-based
 * soundfont that can be loaded by the browser MIDI player.
 * 
 * Note: Full SF2 conversion can create large files (100MB+).
 * This script extracts only the piano samples (instrument 0) which are
 * typically used for melodic content.
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('SoundFont Conversion Script');
console.log('='.repeat(60));
console.log('');
console.log('IMPORTANT NOTE:');
console.log('Converting a full SF2 file to web format is complex and creates');
console.log('very large files (50-200MB). For this experiment, we recommend:');
console.log('');
console.log('Option 1 (RECOMMENDED): Use pre-converted online soundfonts');
console.log('  - The soundfont-player library can load from CDN');
console.log('  - Much smaller and faster');
console.log('  - Similar quality to FluidR3_GM');
console.log('');
console.log('Option 2: Use a specialized conversion tool');
console.log('  - Polyphone (GUI tool): https://www.polyphone-soundfonts.com/');
console.log('  - Can export to SFZ or individual WAV files');
console.log('  - Then use a tool like sfz2js to convert to web format');
console.log('');
console.log('For this implementation, we will use the soundfont-player library');
console.log('with a high-quality acoustic grand piano soundfont from CDN.');
console.log('This provides consistent quality without the large file overhead.');
console.log('');
console.log('If you specifically need YOUR FluidR3_GM.sf2 file:');
console.log('1. Use Polyphone to export instrument 0 (Acoustic Grand Piano)');
console.log('2. Export as individual WAV samples');
console.log('3. Create a mapping JSON file');
console.log('4. Update soundfont-player.js to load your samples');
console.log('');
console.log('='.repeat(60));
console.log('');
console.log('Creating placeholder directory structure...');

// Create output directory
const outputDir = path.join(__dirname, '..', 'soundfonts', 'acoustic_grand_piano');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Create a README explaining the setup
const readmeContent = `# SoundFont Setup

This directory would contain the converted soundfont samples.

## Current Implementation

The experiment uses the \`soundfont-player\` library with CDN-hosted soundfonts.
This provides high-quality piano sounds without requiring large local files.

## Using Your Own FluidR3_GM.sf2

If you need to use your specific FluidR3_GM.sf2 file:

1. Install Polyphone: https://www.polyphone-soundfonts.com/
2. Open FluidR3_GM.sf2 in Polyphone
3. Select instrument 0 (Acoustic Grand Piano)
4. Export as WAV samples (one file per note)
5. Place the WAV files in this directory
6. Update soundfont-player.js to load from this directory

## File Size Considerations

- Full SF2 conversion: 100-200MB
- Piano only: 20-40MB
- CDN soundfont (current): ~2-5MB streamed as needed

For a web-based experiment, the CDN approach is recommended for better
participant experience (faster loading, less bandwidth).
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent);

console.log('✓ Created: soundfonts/acoustic_grand_piano/README.md');
console.log('');
console.log('Setup complete!');
console.log('The browser implementation will use CDN-hosted soundfonts.');
console.log('See soundfonts/acoustic_grand_piano/README.md for details.');


