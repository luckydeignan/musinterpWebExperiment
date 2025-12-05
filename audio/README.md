# Audio Files Directory

This directory contains pre-converted MP3 files for the experiment.

## Structure

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

## Generating MP3 Files

To generate the MP3 files from MIDI, run:

```bash
npm run convert-audio
```

This requires:
- FluidSynth (in system PATH)
- ffmpeg (in system PATH)
- FluidR3_GM.sf2 soundfont file

## File Naming Convention

- Regular partitions: `{cluster}_{partition}.mp3`
  - Example: `1to2_partition1.mp3`, `2to3_partition5.mp3`
- Trailing partitions: `cluster_4.mp3` (plays for all additional partitions)

## Usage

The experiment loads these MP3 files using HTML5 Audio for immediate playback when partition highlighting changes.


