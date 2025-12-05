# Quick Start Guide

## Running the Experiment

Due to a conda configuration issue in your terminal, the easiest way to start the experiment is:

### Method 1: Double-click the Batch File (Easiest!)

1. Double-click `start-server.bat` in Windows Explorer
2. A browser window will open automatically with the experiment
3. The terminal window will stay open - **don't close it** while running the experiment
4. Press `Ctrl+C` in the terminal when done

### Method 2: Command Prompt (Not PowerShell)

1. Open Command Prompt (not PowerShell)
   - Press `Win+R`, type `cmd`, press Enter
2. Navigate to the experiment folder:
   ```
   cd C:\Users\ljdde\interp-music-experiment
   ```
3. Start the server:
   ```
   node server.js
   ```
4. Open your browser to: `http://localhost:8000/experiment.html`

### Method 3: Use Git Bash or Another Terminal

If you have Git Bash or another terminal app:
```bash
cd /c/Users/ljdde/interp-music-experiment
node server.js
```

Then open: `http://localhost:8000/experiment.html`

## What the Experiment Does

1. **Welcome Screen** - Instructions for participants
2. **4 Reading Blocks** (randomized order):
   - The Carnival Packed Away
   - The Lantern in the Window
   - Starling Five
   - Window Blue Curtain
3. Each block contains:
   - Full story text display with background music
   - "Continue" button when ready
   - 5 comprehension questions
4. **Results Screen** - Shows accuracy and allows data download

## Important Notes

### Music Playback

The MIDI files in `piano_melodies/` **cannot play directly in web browsers**. You have two options:

1. **Convert to MP3/WAV** (recommended):
   - Use FluidSynth, online converter, or audio software
   - Update paths in `config.js`:
     ```javascript
     musicPath: 'audio/carnival.mp3'  // instead of .mid file
     ```

2. **Accept no music for now**:
   - The experiment will work without music
   - A warning will appear in the browser console
   - Everything else (stories, questions, data) works perfectly

### Testing vs. Production

For testing yourself:
- Just click through to make sure everything works
- Download the CSV/JSON data to see the format

For actual participants:
- Make sure music files are converted and working
- Test on the actual browser/computer they'll use
- Consider hosting on a web server for remote participants

## File Structure

```
experiment.html         - Main page
experiment.js          - Experiment logic
data-loader.js         - Loads stories & questions
config.js              - Settings (EDIT THIS for music paths!)
styles.css             - Visual styling
server.js              - Simple Node.js server
start-server.bat       - Easy start script for Windows
README.md              - Full documentation
```

## Next Steps

1. **Test the experiment**:
   - Run `start-server.bat`
   - Go through all 4 stories
   - Check if questions display correctly
   - Download the data files

2. **Configure music** (optional):
   - Convert MIDI files to MP3
   - Edit `config.js` with new paths
   - Test audio playback

3. **Customize** (optional):
   - Edit `config.js` for volume, looping, etc.
   - Modify `styles.css` for different fonts/colors
   - Adjust instructions in `experiment.js`

## Troubleshooting

**Server won't start:**
- Make sure no other program is using port 8000
- Try a different port by editing `server.js` (change `PORT = 8000`)

**Stories won't load:**
- Make sure the server is running (don't open HTML file directly)
- Check browser console (F12) for errors

**Questions:**
Feel free to ask for help with customization or any issues!

