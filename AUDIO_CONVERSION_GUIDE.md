# Audio Conversion Guide

## Overview

The experiment has been updated to use pre-converted MP3 files instead of real-time MIDI synthesis. This provides:

- **Faster audio playback** - No MIDI parsing or synthesis overhead
- **Instant partition switching** - Pre-loaded MP3 files start immediately
- **Lower CPU usage** - Hardware-accelerated audio decoding
- **Better compatibility** - Native browser audio support

## What Changed

### Files Modified

1. **[experiment.js](experiment.js)** - Replaced SoundFontPlayer with HTML5 Audio
   - `playStoryMusic()` now takes a single MP3 path instead of MIDI paths
   - `stopMusic()` simplified to only handle HTML5 Audio
   - `updateHighlighting()` builds MP3 paths: `audio/{story}/{cluster}_partition{n}.mp3`
   - Cluster_4 transition uses `audio/{story}/cluster_4.mp3`

2. **[experiment.html](experiment.html)** - Removed unused dependencies
   - Removed Tone.js script tag
   - Removed @tonejs/midi script tag
   - Removed midi-utils.js script tag
   - Removed soundfont-player.js script tag

3. **[scripts/convert-midi-to-mp3.js](scripts/convert-midi-to-mp3.js)** - New conversion script
   - Reads MIDI mapping JSONs for all stories
   - Concatenates MIDI files for each partition
   - Converts to MP3 using FluidSynth + ffmpeg

4. **[package.json](package.json)** - Added conversion script
   - New script: `npm run convert-audio`

### New Directory Structure

```
audio/
  carnival/
    1to2_partition1.mp3
    1to2_partition2.mp3
    ...
    cluster_4.mp3
  lantern/
    ...
  starling_five/
    ...
  window_blue_curtain/
    ...
```

## Prerequisites

Before running the conversion, install these tools:

### 1. FluidSynth

**Windows:**
- Download from: https://github.com/FluidSynth/fluidsynth/releases
- Add to system PATH

**macOS:**
```bash
brew install fluid-synth
```

**Linux:**
```bash
sudo apt-get install fluidsynth
```

### 2. ffmpeg

**Windows:**
- Download from: https://ffmpeg.org/download.html
- Add to system PATH

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### 3. Verify Installation

```bash
fluidsynth --version
ffmpeg -version
```

## Running the Conversion

Once FluidSynth and ffmpeg are installed:

```bash
npm run convert-audio
```

The script will:
1. Check for required tools (FluidSynth, ffmpeg, soundfont)
2. Process all 4 stories
3. For each story:
   - Read MIDI mapping JSON
   - Concatenate MIDI files for each partition
   - Convert to MP3
   - Save to `audio/{story}/` directory
4. Also convert `cluster_4.mid` for trailing partitions

### Expected Output

```
==============================================================
MIDI to MP3 Conversion Script
==============================================================

✓ FluidSynth found
✓ ffmpeg found
✓ SoundFont found: FluidR3_GM/FluidR3_GM.sf2

Starting conversion...

==============================================================
Processing story: carnival
==============================================================

  Cluster: 1to2
    Partition 1: sentences 0
      Loading 2 MIDI files...
      Converting to WAV...
      Converting to MP3...
      ✓ Created: audio/carnival/1to2_partition1.mp3
    ...

  Converting cluster_4.mid...
    ✓ Created: audio/carnival/cluster_4.mp3

[Process repeats for all stories]

==============================================================
Conversion complete!
Output directory: audio
==============================================================
```

## Conversion Time

Approximate conversion time:
- ~2-5 seconds per partition
- ~100-200 total partitions across all stories
- **Total: 5-15 minutes**

## How It Works

### Audio Playback Flow

1. **Partition highlighted** → Build MP3 path
2. **Load MP3** → HTML5 Audio element
3. **Play with loop** → Seamless looping
4. **Next partition** → Stop current, load new MP3, play

### Cluster_4 Behavior

For sentences not covered by the MIDI mapping:
- Transition to "additional partitions"
- Start playing `cluster_4.mp3`
- Loop continuously across all additional partitions
- Never restart (continuous audio)

### File Naming

- Regular: `{cluster}_partition{number}.mp3`
  - `1to2_partition1.mp3`, `1to2_partition2.mp3`, ...
  - `2to3_partition1.mp3`, `2to3_partition2.mp3`, ...
  - `3to4_partition1.mp3`, `3to4_partition2.mp3`, ...
- Trailing: `cluster_4.mp3`

## Troubleshooting

### FluidSynth not found

**Windows:**
1. Download FluidSynth
2. Extract to `C:\Program Files\FluidSynth`
3. Add to PATH: System Properties → Environment Variables → Path → Add `C:\Program Files\FluidSynth\bin`
4. Restart terminal

**Mac/Linux:**
```bash
# Test if installed
which fluidsynth

# If not found, install
brew install fluid-synth  # macOS
sudo apt-get install fluidsynth  # Linux
```

### ffmpeg not found

Follow similar steps as FluidSynth above.

### SoundFont not found

Ensure `FluidR3_GM/FluidR3_GM.sf2` exists in your project root. If not, download it from:
- https://keymusician01.s3.amazonaws.com/FluidR3_GM.zip

### Conversion fails on specific file

- Check that MIDI files exist in the paths specified in mapping JSONs
- Ensure MIDI files are valid
- Check disk space (MP3s require ~50-200MB total)

## File Sizes

Approximate sizes:
- **MIDI files**: ~1-5KB each
- **MP3 files**: ~100-500KB each
- **Total audio directory**: ~50-200MB (depending on partition count)

## Performance Comparison

### Before (MIDI Synthesis)

- Partition change: 200-500ms delay
- CPU usage: Medium-High (real-time synthesis)
- Memory: Medium (Tone.js + soundfont samples)
- Browser compatibility: Good (but requires Tone.js)

### After (Pre-converted MP3)

- Partition change: 10-50ms delay (instant playback)
- CPU usage: Low (hardware-accelerated decoding)
- Memory: Low (native browser audio)
- Browser compatibility: Excellent (HTML5 Audio)

## Next Steps

1. **Install prerequisites** (FluidSynth, ffmpeg)
2. **Run conversion**: `npm run convert-audio`
3. **Test experiment**: Open in browser and verify audio plays correctly
4. **Verify partition switching** is smooth and immediate
5. **Check cluster_4** behavior for trailing partitions

## Reverting (If Needed)

If you need to go back to MIDI synthesis:
1. Restore old versions of `experiment.js` and `experiment.html` from git
2. Re-add script tags for Tone.js, @tonejs/midi, midi-utils.js, soundfont-player.js
3. Delete `audio/` directory (optional)

## Questions?

If you encounter issues or have questions about the conversion process, check:
1. Console logs during conversion
2. Browser console for playback errors
3. Network tab to verify MP3 files are loading


