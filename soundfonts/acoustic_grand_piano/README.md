# SoundFont Setup

This directory would contain the converted soundfont samples.

## Current Implementation

The experiment uses the `soundfont-player` library with CDN-hosted soundfonts.
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
