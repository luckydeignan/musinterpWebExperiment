/**
 * Configuration file for the reading experiment
 * Maps each story to its data files and music
 */

const CONFIG = {
    stories: [
        {
            id: 'carnival_packed_away',
            title: 'The Carnival Packed Away',
            csvPath: 'formatted_stories/carnival_packed_away_formatted.csv',
            questionsPath: 'story_questions/carnival.json',
            midiMappingPath: 'sentence_to_midi/carnival/carnival_midi_mapping.json',
            midiDirName: 'carnival', // Directory name for MIDI files in piano_melodies/
            // Default to cluster_1.mid from 16bar folder
            // You can change this to any MIDI file path
            musicPath: 'piano_melodies/carnival/16bar/cluster_1.mid',
            // Alternative options:
            // musicPath: 'piano_melodies/carnival/2bar/cluster_1.mid',
            // musicPath: 'piano_melodies/carnival/16bar/cluster_2.mid',
            // Or use an MP3/WAV file if you convert the MIDI:
            // musicPath: 'audio/carnival_music.mp3',
        },
        {
            id: 'lantern',
            title: 'The Lantern in the Window',
            csvPath: 'formatted_stories/lantern_formatted.csv',
            questionsPath: 'story_questions/lantern.json',
            midiMappingPath: 'sentence_to_midi/lantern/lantern_midi_mapping.json',
            midiDirName: 'lantern',
            musicPath: 'piano_melodies/lantern/16bar/cluster_1.mid',
        },
        {
            id: 'starling_five',
            title: 'Starling Five',
            csvPath: 'formatted_stories/starling_five_formatted.csv',
            questionsPath: 'story_questions/starling_five.json',
            midiMappingPath: 'sentence_to_midi/starling_five/starling_five_midi_mapping.json',
            midiDirName: 'starling_five',
            musicPath: 'piano_melodies/starling_five/16bar/cluster_1.mid',
        },
        {
            id: 'window_blue_curtain',
            title: 'Window Blue Curtain',
            csvPath: 'formatted_stories/window_blue_curtain_formatted.csv',
            questionsPath: 'story_questions/window_blue_curtain.json',
            midiMappingPath: 'sentence_to_midi/window_blue_curtain/window_blue_curtain_midi_mapping.json',
            midiDirName: 'window_blue_curtain',
            musicPath: 'piano_melodies/window_blue_curtain/16bar/cluster_1.mid',
        }
    ],
    
    // Music playback settings
    music: {
        loop: true,              // Should music loop during reading?
        volume: 0.3,             // Volume (0.0 to 1.0)
        fadeInDuration: 1000,    // Fade in duration in ms
        fadeOutDuration: 1000,   // Fade out duration in ms
    },
    
    // Experiment settings
    experiment: {
        showProgressIndicator: true,
        showMusicIndicator: true,
        collectDemographics: false,  // Set to true if you want to add a demographics survey
        demo: true  // Set to true for demo mode (3 stories with fixed conditions)
    }
};

