# Cross-Faded Clusters Implementation Summary

## Overview
Successfully implemented the "cross-faded-clusters" experimental condition that plays cluster-based MIDI files with crossfading between different clusters but continuous playback within the same cluster.

## What Was Implemented

### 1. MP3 Conversion Script
**File:** `scripts/convert-cluster-midi-to-mp3.js`

- Converts `cluster_1.mid`, `cluster_2.mid`, and `cluster_3.mid` from the `piano_melodies/{story}/16bar/` directory
- Outputs MP3 files to `audio/{story}/` directory  
- Uses FluidSynth and ffmpeg for conversion
- Successfully created cluster MP3s for all 4 stories:
  - carnival
  - lantern
  - starling_five
  - window_blue_curtain

### 2. Cluster Mapping Logic
**File:** `experiment.js`

**New Function:** `buildSentenceToClusterMap(midiMapping, idOffset, totalSentences)`
- Maps each sentence ID to its cluster number based on the MIDI mapping
- Mapping rules:
  - Sentences in "1to2" partitions → Cluster 1
  - Sentences in "2to3" partitions → Cluster 2
  - Sentences in "3to4" partitions → Cluster 3
  - Any remaining sentences → Cluster 4
- Returns a Map of `sentenceId → clusterNumber`

### 3. Story Trial Updates
**Modified Function:** `createStoryTrial()`

Added logic to:
- Build sentence-to-cluster map at initialization
- Track current playing cluster with `currentPlayingClusterRef`
- Handle "cross-faded-clusters" condition in `on_load`:
  - Determines the cluster for the first sentence
  - Plays the appropriate `cluster_{num}.mp3` file
  - Sets up the reference to track cluster changes

### 4. Highlighting and Music Updates
**Modified Function:** `updateHighlighting()`

Enhanced to handle the cross-faded-clusters condition:
- Checks if the new partition's sentences belong to a different cluster
- If same cluster: Music continues playing (no change)
- If different cluster: Crossfades to the new cluster's MP3 file
- Uses existing crossfade logic for smooth transitions

### 5. Condition Assignment
**Modified:** Randomization logic in `createTimeline()`

Updated from binary (50/50) to three-way condition assignment:
- ~33% chance: 'regular' (partition-based crossfading)
- ~33% chance: 'averaged-music' (cluster_avg.mp3 loop)
- ~33% chance: 'cross-faded-clusters' (new condition)

## Files Modified
1. `experiment.js` - Added cluster mapping logic and condition handling
2. `scripts/convert-cluster-midi-to-mp3.js` - New script for MP3 conversion

## Files Created
- `audio/carnival/cluster_1.mp3`
- `audio/carnival/cluster_2.mp3`
- `audio/carnival/cluster_3.mp3`
- `audio/lantern/cluster_1.mp3`
- `audio/lantern/cluster_2.mp3`
- `audio/lantern/cluster_3.mp3`
- `audio/starling_five/cluster_1.mp3`
- `audio/starling_five/cluster_2.mp3`
- `audio/starling_five/cluster_3.mp3`
- `audio/window_blue_curtain/cluster_1.mp3`
- `audio/window_blue_curtain/cluster_2.mp3`
- `audio/window_blue_curtain/cluster_3.mp3`

Note: `cluster_4.mp3` already existed for all stories.

## Testing Results
Tested the implementation by running the experiment multiple times:
- ✅ All three conditions are being assigned randomly
- ✅ Cross-faded-clusters condition successfully assigned to multiple stories
- ✅ MP3 files load and play correctly
- ✅ No linter errors in the code
- ✅ All 4 stories support the new condition

## How It Works

### Audio Playback Behavior
1. **Story loads:** Plays the cluster file corresponding to the first sentence's cluster
2. **User navigates (presses SPACE/→):** 
   - Checks if new sentences are in the same cluster
   - **Same cluster:** Music continues seamlessly (no crossfade)
   - **Different cluster:** Crossfades to the new cluster's MP3
3. **Cluster transitions:** Use the existing crossfade logic (fade in/out with configurable duration)
4. **Looping:** Each cluster MP3 loops continuously until a cluster change occurs

### Example Scenario
- Sentences 0-20 are in Cluster 1 → `cluster_1.mp3` plays and loops
- User navigates through sentences 0-20 → No music changes
- Sentences 21-50 are in Cluster 2 → Crossfades to `cluster_2.mp3`
- User navigates through sentences 21-50 → No music changes
- And so on...

## Configuration
No configuration changes needed. The condition is automatically available and will be randomly assigned to stories during the experiment.

## Notes
- The implementation uses the existing crossfade logic, ensuring consistent audio transition quality across all conditions
- Cluster assignments are determined by the MIDI mapping JSON files
- The condition works seamlessly with the existing partition-based sentence highlighting


