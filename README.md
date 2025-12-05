# Reading Experiment with Background Music

A jsPsych-based experiment where participants read 4 narrative stories in randomized order with background music, followed by comprehension questions.

## Quick Start

### Option 1: Using Node.js (Recommended)

1. Open a terminal/command prompt in this directory
2. Run one of these commands:

```bash
# Using npx (easiest):
npx http-server -p 8000 --cors

# OR using Node's built-in server:
node -e "require('http').createServer((req,res)=>{require('fs').readFile('.'+req.url,(_,d)=>res.end(d))}).listen(8000);console.log('Server at http://localhost:8000')"
```

3. Open your browser to: `http://localhost:8000/experiment.html`

### Option 2: Using Python

```bash
# Python 3:
python -m http.server 8000

# Python 2:
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000/experiment.html`

### Option 3: Use the Batch File (Windows)

Double-click `start-server.bat` and it will open the experiment in your default browser.

## Binary Files Not Included

This repository does not include large binary files (audio files, MIDI files, and SoundFont files) to keep the repository size manageable. You will need to obtain and place these files in the appropriate directories:

### Required Binary Files

1. **Audio Files (MP3)** - Place in `audio/` directory:
   - `audio/carnival/` - Audio files for "The Carnival Packed Away" story
   - `audio/lantern/` - Audio files for "The Lantern in the Window" story
   - `audio/starling_five/` - Audio files for "Starling Five" story
   - `audio/window_blue_curtain/` - Audio files for "Window Blue Curtain" story
   - `audio/presentation_demo/` - Demo audio files

2. **MIDI Files** - Place in these directories:
   - `piano_melodies/` - Piano melody MIDI files for each story
   - `pres_demo_midi/` - Presentation demo MIDI files

3. **SoundFont File** - Place in `FluidR3_GM/` directory:
   - `FluidR3_GM/FluidR3_GM.sf2` - FluidR3 General MIDI SoundFont (approximately 141 MB)

**Note:** Exact dataset sources and download links will be provided in future repository updates. The directory structure shown above indicates where each file type should be placed.

## Files Overview

- **experiment.html** - Main experiment page
- **experiment.js** - jsPsych timeline and logic
- **data-loader.js** - Loads stories (CSV) and questions (JSON)
- **config.js** - Configuration for story-to-music mappings
- **styles.css** - Custom styling for readability

## Configuration

### Music Settings

Edit `config.js` to change which MIDI files play for each story:

```javascript
musicPath: 'piano_melodies/carnival/16bar/cluster_1.mid'
```

**Important Note:** MIDI files cannot be played directly in web browsers. You have two options:

1. **Convert MIDI to MP3/WAV** (recommended):
   - Use a tool like FluidSynth, TiMidity++, or an online converter
   - Update the `musicPath` in `config.js` to point to the converted files
   
2. **Use a MIDI.js library**:
   - Add a library like [MIDI.js](https://github.com/mudcube/MIDI.js/) or [Tone.js](https://tonejs.github.io/)
   - Modify the `playStoryMusic()` function in `experiment.js`

### Story Order

Story order is randomized automatically for each participant using `jsPsych.randomization.shuffle()`.

### Experiment Settings

In `config.js`, you can adjust:

```javascript
music: {
    loop: true,              // Loop music during reading
    volume: 0.3,             // Volume (0.0 to 1.0)
    fadeInDuration: 1000,    // Fade in duration in ms
    fadeOutDuration: 1000,   // Fade out duration in ms
}
```

## Data Collection

After completing the experiment, participants can download their data in:

- **CSV format** - Compatible with Excel, R, Python pandas
- **JSON format** - Raw jsPsych data structure

The data includes:
- Story presentation order
- Reading times for each story
- Question responses
- Accuracy scores

## Story Files

Stories are loaded from:
- `formatted_stories/*.csv` - Story text (sentence by sentence)
- `story_questions/*.json` - Comprehension questions (5 per story)

### Available Stories

1. **The Carnival Packed Away** - A story about joy and grief
2. **The Lantern in the Window** - A story about healing and community
3. **Starling Five** - A space exploration story
4. **Window Blue Curtain** - A story about isolation and connection

## Troubleshooting

### Data won't load

- Make sure you're running a local server (not opening the HTML file directly)
- Check the browser console (F12) for errors
- Verify all CSV and JSON files are in their correct folders

### Music won't play

- MIDI files need to be converted to MP3/WAV for browser playback
- Check the browser console for audio playback errors
- Make sure the `musicPath` in `config.js` points to valid audio files

### CORS errors

- Make sure your server has CORS enabled (the `--cors` flag with http-server)
- Some browsers block local file access - use a server instead

## Browser Support

The experiment works best in:
- Chrome/Edge (recommended)
- Firefox
- Safari

Make sure JavaScript is enabled and pop-ups are not blocked.

## Customization

### Adding More Stories

1. Add the story CSV to `formatted_stories/`
2. Add questions JSON to `story_questions/`
3. Update `config.js` to include the new story
4. Add corresponding music file

### Changing Questions

Edit the JSON files in `story_questions/` following this format:

```json
{
  "id": 1,
  "question": "Your question here?",
  "options": {
    "A": "First option",
    "B": "Second option",
    "C": "Third option",
    "D": "Fourth option"
  },
  "correct_answer": "B"
}
```

## Credits

Built with [jsPsych 7.3.4](https://www.jspsych.org/) - A JavaScript library for running behavioral experiments in a web browser.

