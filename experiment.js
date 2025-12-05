/**
 * Main experiment file
 * Coordinates the jsPsych timeline for the reading experiment
 */

// Global variables
let jsPsychInstance;
let storiesData = [];
let currentAudio = null;
let previousAudio = null;
let fadeIntervals = []; // Track active fade intervals for cleanup
let allActiveAudio = []; // Track all audio elements for complete cleanup
let musicIndicator = null;

// Capture Prolific URL parameters
const urlParams = new URLSearchParams(window.location.search);
const prolificPID = urlParams.get('PROLIFIC_PID') || 'test_participant';
const studyID = urlParams.get('STUDY_ID') || 'test_study';
const sessionID = urlParams.get('SESSION_ID') || 'test_session';

console.log('Prolific Parameters:', { prolificPID, studyID, sessionID });

/**
 * Initialize the experiment
 */
async function initExperiment() {
    try {
        // Show loading message
        document.getElementById('jspsych-target').innerHTML = `
            <div class="loading-screen">
                <h2>Loading experiment...</h2>
                <div class="loading-spinner"></div>
                <p>Please wait while we prepare the stories and questions.</p>
                <p id="loading-status">Loading story data...</p>
            </div>
        `;
        
        // Load all story data
        storiesData = await DataLoader.loadAllData();
        
        // Initialize jsPsych
        jsPsychInstance = initJsPsych({
            display_element: 'jspsych-target',
            on_finish: function() {
                // Save Prolific data
                jsPsychInstance.data.addProperties({
                    prolific_pid: prolificPID,
                    study_id: studyID,
                    session_id: sessionID
                });
                
                displayResults();
            }
        });
        
        // Create and run timeline
        const timeline = createTimeline();
        await jsPsychInstance.run(timeline);
        
    } catch (error) {
        console.error('Error initializing experiment:', error);
        document.getElementById('jspsych-target').innerHTML = `
            <div style="padding: 50px; text-align: center;">
                <h2>Error Loading Experiment</h2>
                <p>There was an error loading the experiment files.</p>
                <p style="color: red;">${error.message}</p>
                <p>Please make sure all story files and questions are in the correct folders.</p>
            </div>
        `;
    }
}

/**
 * Simple array shuffle function (Fisher-Yates algorithm)
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Create the main experiment timeline
 */
function createTimeline() {
    const timeline = [];
    
    // Welcome screen
    const numStories = 3; // Both demo and non-demo use 3 stories
    const estimatedTime = CONFIG.experiment.demo ? '15-20 minutes' : '15-20 minutes';
    
    timeline.push({
        type: jsPsychInstructions,
        pages: [
            `<div style="max-width: 800px; margin: 0 auto; text-align: left;">
                <h1 style="text-align: center;">Welcome to a Reading with Music Soundtracks Experiment!</h1>
                <p>Thank you for participating in this study!</p>
                <p>In this experiment, you will:</p>
                <ul>
                    <li>Read <strong>${numStories} short narrative stories</strong></li>
                    <li>Listen to <strong>background music</strong> while reading each story</li>
                    <li>Answer <strong>5 comprehension questions</strong> after each story</li>
                    <li>Answer <strong>4 subjective rating questions</strong> after each story</li>
                </ul>
                <p><strong>The entire experiment should take approximately ${estimatedTime}.</strong></p>
            </div>`,
            `<div style="max-width: 800px; margin: 0 auto; text-align: left;">
                <h2 style="text-align: center;">Instructions</h2>
                <p><strong>Reading the Stories:</strong></p>
                <ul>
                    <li>Each story will be displayed on screen with background music playing</li>
                    <li>Take your time and read carefully - there are no time limits</li>
                    <li>When you're finished reading, click the "Continue" button</li>
                </ul>
                <p><strong>Answering Questions:</strong></p>
                <ul>
                    <li>After each story, you'll answer 5 multiple-choice comprehension questions</li>
                    <li>You'll also answer 4 subjective rating questions about your experience</li>
                    <li>Select the answer you think is correct</li>
                    <li>Once you submit, you'll move on to the next story</li>
                </ul>
                <p><strong>Music:</strong></p>
                <ul>
                    <li>Background music will play automatically when each story appears</li>
                    <li>You can adjust your device volume if needed</li>
                    <li>The music will stop when you click "Continue"</li>
                    <li><em>Please do not mute your volume during the experiment, as you will be answering questions about the music at the end of each reading</em></li>
                </ul>
            </div>`,
            `<div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <h2>Ready to Begin?</h2>
                <p>Click "Next" to start the experiment.</p>
                <p style="margin-top: 40px; color: #666; font-size: 14px;">
                    The stories will be presented in a random order.
                </p>
            </div>`
        ],
        show_clickable_nav: true,
        button_label_next: 'Next',
        button_label_previous: 'Back'
    });
    
    // Determine which stories to use and their order based on demo mode
    let storiesToUse;
    
    if (CONFIG.experiment.demo) {
        // Demo mode: Use specific 3 stories in fixed order with fixed conditions
        const demoStoryIds = ['carnival_packed_away', 'starling_five', 'lantern'];
        const demoConditions = {
            'carnival_packed_away': 'regular',
            'starling_five': 'cross-faded-clusters',
            'lantern': 'averaged-music'
        };
        
        // Filter and order stories for demo mode
        storiesToUse = demoStoryIds
            .map(id => storiesData.find(story => story.id === id))
            .filter(story => story !== undefined); // Remove any that weren't found
        
        // Assign fixed conditions
        storiesToUse.forEach(story => {
            story.musicCondition = demoConditions[story.id];
            console.log(`Demo mode - Story: ${story.id}, Condition: ${story.musicCondition}`);
        });
    } else {
        // Normal mode: Use specific 3 stories with randomized order and conditions
        const normalStoryIds = ['carnival_packed_away', 'starling_five', 'window_blue_curtain'];
        
        // Filter to only the 3 stories we want
        const selectedStories = normalStoryIds
            .map(id => storiesData.find(story => story.id === id))
            .filter(story => story !== undefined);
        
        // Randomize story order
        storiesToUse = shuffleArray(selectedStories);
        
        // Randomize condition assignment - shuffle conditions and assign one to each story
        const conditions = shuffleArray(['regular', 'averaged-music', 'cross-faded-clusters']);
        storiesToUse.forEach((story, index) => {
            story.musicCondition = conditions[index];
            console.log(`Story: ${story.id}, Condition: ${story.musicCondition}`);
        });
    }
    
    // Add story blocks (reading + questions) for each story
    storiesToUse.forEach((story, index) => {
        // Story reading trial
        timeline.push(createStoryTrial(story, index + 1, storiesToUse.length));
        
        // Question trials
        timeline.push(createQuestionTrials(story, index + 1));
        
        // Rating questions
        timeline.push(createRatingQuestions(story, index + 1));
    });
    
    // Thank you screen
    timeline.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: `
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <h1>Thank You!</h1>
                <p>You have completed the reading experiment.</p>
                <p>Your responses have been recorded.</p>
                <div style="margin-top: 40px;">
                    <p>Click the button below to see your results.</p>
                </div>
            </div>
        `,
        choices: ['View Results']
    });
    
    return timeline;
}

/**
 * Create a story reading trial with progressive highlighting
 */
function createStoryTrial(story, storyNumber, totalStories) {
    // Get all cluster keys from the MIDI mapping
    const clusterKeys = Object.keys(story.midiMapping);
    
    // Calculate offset between MIDI mapping and CSV IDs
    const csvStartId = story.sentences[0].id;
    const firstMidiPartition = story.midiMapping[clusterKeys[0]][0];
    const firstMidiId = parseInt(firstMidiPartition.sentence_ids.split(',')[0].trim());
    const idOffset = firstMidiId - csvStartId;
    
    console.log(`Story: ${story.id}, CSV starts at: ${csvStartId}, MIDI starts at: ${firstMidiId}, Offset: ${idOffset}`);
    
    // Identify sentences covered by MIDI mappings
    const coveredSentenceIds = new Set();
    clusterKeys.forEach(clusterKey => {
        story.midiMapping[clusterKey].forEach(partition => {
            const ids = partition.sentence_ids.split(',').map(id => parseInt(id.trim()) - idOffset);
            ids.forEach(id => coveredSentenceIds.add(id));
        });
    });
    
    // Find uncovered sentences
    const uncoveredSentences = story.sentences.filter(s => !coveredSentenceIds.has(s.id));
    
    // Create additional partitions for uncovered sentences (groups of 2 or 3)
    const additionalPartitions = [];
    for (let i = 0; i < uncoveredSentences.length; i += 2) {
        const group = uncoveredSentences.slice(i, i + (uncoveredSentences.length - i === 3 && i + 2 === uncoveredSentences.length - 1 ? 3 : 2));
        additionalPartitions.push({
            sentence_ids: group.map(s => s.id).join(','),
            is_additional: true
        });
    }
    
    console.log(`Story has ${story.sentences.length} sentences, ${coveredSentenceIds.size} covered, ${uncoveredSentences.length} uncovered`);
    console.log(`Created ${additionalPartitions.length} additional partitions`);
    
    // Build sentence-to-cluster map for cross-faded-clusters condition
    const sentenceToClusterMap = buildSentenceToClusterMap(story.midiMapping, idOffset, story.sentences.length);
    
    // Initialize state for navigation
    let currentClusterIndex = 0;
    let currentPartitionIndex = 0;
    let isComplete = false;
    let inAdditionalPartitions = false;
    let additionalPartitionIndex = 0;
    let cluster4Playing = false;
    let currentPlayingClusterRef = { value: null }; // Track which cluster MP3 is currently playing
    
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            const progressText = CONFIG.experiment.showProgressIndicator ? 
                `<div class="progress-text">Story ${storyNumber} of ${totalStories}</div>` : '';
            
            const musicIndicatorHTML = CONFIG.experiment.showMusicIndicator ? 
                `<div class="music-indicator playing" id="music-indicator">♫ Music playing</div>` : '';
            
            // Build sentence HTML with individual spans
            const sentencesHTML = story.sentences.map(sentence => 
                `<span class="sentence dimmed" data-sentence-id="${sentence.id}">${sentence.text} </span>`
            ).join('');
            
            const continueButton = `
                <div style="text-align: center; margin-top: 30px;">
                    <button id="continue-btn" class="jspsych-btn" style="display: none;">
                        Continue to Questions
                    </button>
                </div>
            `;
            
            return `
                ${progressText}
                ${musicIndicatorHTML}
                <div class="story-container">
                    <div class="story-title">${story.title}</div>
                    <div class="story-text" id="story-text">${sentencesHTML}</div>
                    <div id="instruction-text" style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
                        Press SPACE or → to continue
                    </div>
                    ${continueButton}
                </div>
            `;
        },
        choices: ['ArrowRight', ' '],
        on_load: function() {
            // Check music condition
            if (story.musicCondition === 'averaged-music') {
                // Play cluster_avg.mp3 on loop for the entire story
                const midiDirName = story.midiDirName || story.id;
                const clusterAvgPath = `audio/${midiDirName}/cluster_avg.mp3`;
                playStoryMusic(clusterAvgPath);
                console.log('Averaged-music condition: playing cluster_avg.mp3 on loop');
            } else if (story.musicCondition === 'cross-faded-clusters') {
                // Play the cluster for the first partition
                const firstPartition = story.midiMapping[clusterKeys[0]][0];
                const firstSentenceId = parseInt(firstPartition.sentence_ids.split(',')[0].trim()) - idOffset;
                const firstCluster = sentenceToClusterMap.get(firstSentenceId);
                currentPlayingClusterRef.value = firstCluster;
                
                const midiDirName = story.midiDirName || story.id;
                const clusterPath = `audio/${midiDirName}/cluster_${firstCluster}.mp3`;
                playStoryMusic(clusterPath);
                console.log(`Cross-faded-clusters condition: playing cluster_${firstCluster}.mp3`);
            }
            
            // Highlight initial partition and play its MIDI (or just highlight if averaged-music/cross-faded-clusters)
            updateHighlighting(story, clusterKeys, currentClusterIndex, currentPartitionIndex, idOffset, false, null, sentenceToClusterMap, currentPlayingClusterRef);
            
            // Setup keyboard event handler
            const handleKeyPress = function(e) {
                if ((e.key === 'ArrowRight' || e.key === ' ') && !isComplete) {
                    e.preventDefault();
                    
                    if (!inAdditionalPartitions) {
                        // We're in MIDI mapping partitions
                        const currentCluster = story.midiMapping[clusterKeys[currentClusterIndex]];
                        currentPartitionIndex++;
                        
                        // Check if we need to move to next cluster
                        if (currentPartitionIndex >= currentCluster.length) {
                            currentClusterIndex++;
                            currentPartitionIndex = 0;
                            
                            // Check if all clusters are complete
                            if (currentClusterIndex >= clusterKeys.length) {
                                // Transition to additional partitions if any exist
                                if (additionalPartitions.length > 0) {
                                    console.log('Transitioning to additional partitions');
                                    inAdditionalPartitions = true;
                                    additionalPartitionIndex = 0;
                                    
                                    // Start playing cluster_4.mp3 (only in regular condition)
                                    if (story.musicCondition === 'regular') {
                                        const midiDirName = story.midiDirName || story.id;
                                        const cluster4Path = `audio/${midiDirName}/cluster_4.mp3`;
                                        playStoryMusic(cluster4Path);
                                        cluster4Playing = true;
                                    }
                                    
                                    // Update highlighting for first additional partition
                                    updateHighlighting(story, clusterKeys, 0, 0, idOffset, true, additionalPartitions[0], sentenceToClusterMap, currentPlayingClusterRef);
                                    return;
                                } else {
                                    // No additional partitions, we're done
                                    isComplete = true;
                                    const continueBtn = document.getElementById('continue-btn');
                                    if (continueBtn) {
                                        continueBtn.style.display = 'inline-block';
                                    }
                                    const instructionText = document.getElementById('instruction-text');
                                    if (instructionText) {
                                        instructionText.style.display = 'none';
                                    }
                                    document.removeEventListener('keydown', handleKeyPress);
                                    return;
                                }
                            }
                        }
                        
                        // Update highlighting and play new MIDI
                        updateHighlighting(story, clusterKeys, currentClusterIndex, currentPartitionIndex, idOffset, false, null, sentenceToClusterMap, currentPlayingClusterRef);
                    } else {
                        // We're in additional partitions
                        additionalPartitionIndex++;
                        
                        if (additionalPartitionIndex >= additionalPartitions.length) {
                            // All additional partitions complete
                            isComplete = true;
                            const continueBtn = document.getElementById('continue-btn');
                            if (continueBtn) {
                                continueBtn.style.display = 'inline-block';
                            }
                            const instructionText = document.getElementById('instruction-text');
                            if (instructionText) {
                                instructionText.style.display = 'none';
                            }
                            document.removeEventListener('keydown', handleKeyPress);
                            return;
                        }
                        
                        // Update highlighting for next additional partition (don't change music)
                        updateHighlighting(story, clusterKeys, 0, 0, idOffset, true, additionalPartitions[additionalPartitionIndex], sentenceToClusterMap, currentPlayingClusterRef);
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyPress);
            
            // Add click handler for continue button
            const continueBtn = document.getElementById('continue-btn');
            if (continueBtn) {
                continueBtn.addEventListener('click', function() {
                    // Immediately stop all audio to prevent overlap
                    console.log('Continue button clicked - stopping all audio');
                    stopMusic();
                    
                    document.removeEventListener('keydown', handleKeyPress);
                    jsPsychInstance.finishTrial({
                        total_partitions: currentPartitionIndex,
                        total_clusters: currentClusterIndex,
                        additional_partitions_shown: additionalPartitionIndex
                    });
                });
            }
        },
        on_finish: function() {
            stopMusic();
        },
        trial_duration: null,
        response_ends_trial: false,
        data: {
            task: 'story_reading',
            story_id: story.id,
            story_title: story.title,
            story_number: storyNumber,
            music_condition: story.musicCondition
        }
    };
}

/**
 * Build a map of sentence ID to cluster number
 * @param {object} midiMapping - The MIDI mapping object with cluster keys
 * @param {number} idOffset - The offset between MIDI IDs and CSV IDs
 * @param {number} totalSentences - Total number of sentences in the story
 * @returns {Map} Map of sentenceId -> clusterNumber
 */
function buildSentenceToClusterMap(midiMapping, idOffset, totalSentences) {
    const sentenceToCluster = new Map();
    
    // Map cluster keys to cluster numbers
    const clusterKeyToNumber = {
        '1to2': 1,
        '2to3': 2,
        '3to4': 3
    };
    
    // Process each cluster key
    Object.keys(midiMapping).forEach(clusterKey => {
        const clusterNumber = clusterKeyToNumber[clusterKey];
        const partitions = midiMapping[clusterKey];
        
        // Process each partition in this cluster
        partitions.forEach(partition => {
            const rawIds = partition.sentence_ids.split(',').map(id => parseInt(id.trim()));
            const adjustedIds = rawIds.map(id => id - idOffset);
            
            // Map each sentence ID to this cluster
            adjustedIds.forEach(sentenceId => {
                sentenceToCluster.set(sentenceId, clusterNumber);
            });
        });
    });
    
    // Any remaining sentences belong to cluster 4
    for (let i = 0; i < totalSentences; i++) {
        if (!sentenceToCluster.has(i)) {
            sentenceToCluster.set(i, 4);
        }
    }
    
    return sentenceToCluster;
}

/**
 * Update sentence highlighting based on current partition
 */
function updateHighlighting(story, clusterKeys, clusterIndex, partitionIndex, idOffset, isAdditional = false, additionalPartition = null, sentenceToClusterMap = null, currentPlayingClusterRef = {value: null}) {
    let sentenceIdsToHighlight;
    
    if (isAdditional) {
        // For additional partitions, IDs are already in CSV format
        sentenceIdsToHighlight = additionalPartition.sentence_ids.split(',').map(id => parseInt(id.trim()));
        console.log('Additional partition, highlighting:', sentenceIdsToHighlight);
    } else {
        // For MIDI mapping partitions, apply offset
        const clusterKey = clusterKeys[clusterIndex];
        const partition = story.midiMapping[clusterKey][partitionIndex];
        const rawIds = partition.sentence_ids.split(',').map(id => parseInt(id.trim()));
        sentenceIdsToHighlight = rawIds.map(id => id - idOffset);
        console.log(`MIDI partition ${partitionIndex}, raw IDs: ${rawIds}, adjusted IDs: ${sentenceIdsToHighlight}`);
    }
    
    // Update all sentence elements
    const sentenceElements = document.querySelectorAll('.sentence');
    sentenceElements.forEach(element => {
        const sentenceId = parseInt(element.getAttribute('data-sentence-id'));
        
        if (sentenceIdsToHighlight.includes(sentenceId)) {
            element.classList.remove('dimmed');
            element.classList.add('highlighted');
        } else {
            element.classList.remove('highlighted');
            element.classList.add('dimmed');
        }
    });
    
    // Play the appropriate music based on condition
    if (story.musicCondition === 'averaged-music') {
        // Don't change music in averaged-music condition - cluster_avg.mp3 keeps playing
        console.log('Averaged-music condition: keeping cluster_avg.mp3 playing');
    } else if (story.musicCondition === 'cross-faded-clusters') {
        // Check if we need to change cluster
        const newCluster = sentenceToClusterMap.get(sentenceIdsToHighlight[0]);
        
        if (newCluster !== currentPlayingClusterRef.value) {
            // Crossfade to new cluster
            const midiDirName = story.midiDirName || story.id;
            const clusterPath = `audio/${midiDirName}/cluster_${newCluster}.mp3`;
            playStoryMusic(clusterPath);
            currentPlayingClusterRef.value = newCluster;
            console.log(`Cross-faded-clusters: Crossfading to cluster_${newCluster}.mp3`);
        } else {
            // Same cluster, keep playing
            console.log(`Cross-faded-clusters: Staying in cluster ${currentPlayingClusterRef.value}`);
        }
    } else if (isAdditional) {
        // Don't play - cluster_4.mp3 should already be playing
        console.log('In additional partition, not changing music (cluster_4 continues)');
    } else {
        // Regular condition: Build path to pre-converted MP3 file for this partition
        const clusterKey = clusterKeys[clusterIndex];
        const midiDirName = story.midiDirName || story.id;
        
        // Special handling for starling_five cluster 3: play cluster_3.mp3 on loop
        if (story.id === 'starling_five' && clusterKey === '3to4') {
            // Check if we're already playing cluster_3.mp3
            if (currentPlayingClusterRef.value !== 'starling_cluster3') {
                // Start playing cluster_3.mp3 on loop
                const clusterPath = `audio/${midiDirName}/cluster_3.mp3`;
                playStoryMusic(clusterPath);
                currentPlayingClusterRef.value = 'starling_cluster3';
                console.log('Starling Five cluster 3: Starting cluster_3.mp3 loop');
            } else {
                // Already playing cluster_3.mp3, keep it going
                console.log('Starling Five cluster 3: Keeping cluster_3.mp3 loop playing');
            }
        } else {
            // Normal partition-based music for other stories/clusters
            const mp3Path = `audio/${midiDirName}/${clusterKey}_partition${partitionIndex + 1}.mp3`;
            playStoryMusic(mp3Path);
            // Reset the tracking if we're not in starling cluster 3
            if (currentPlayingClusterRef.value === 'starling_cluster3') {
                currentPlayingClusterRef.value = null;
            }
        }
    }
}

/**
 * Create question trials for a story
 */
function createQuestionTrials(story, storyNumber) {
    const questions = story.questions.map((q, idx) => {
        return {
            prompt: `<strong>Question ${idx + 1}:</strong> ${q.question}`,
            name: `q${q.id}`,
            options: Object.values(q.options),
            required: true
        };
    });
    
    return {
        type: jsPsychSurveyMultiChoice,
        preamble: `
            <div style="max-width: 800px; margin: 0 auto;">
                <h2 style="text-align: center;">Comprehension Questions: ${story.title}</h2>
                <p style="text-align: center; color: #666;">
                    Please answer the following questions about the story you just read.
                </p>
            </div>
        `,
        questions: questions,
        button_label: 'Submit Answers',
        randomize_question_order: false,
        data: {
            task: 'comprehension_questions',
            story_id: story.id,
            story_title: story.title,
            story_number: storyNumber,
            correct_answers: story.questions.map(q => q.correct_answer)
        },
        on_finish: function(data) {
            // Calculate accuracy
            const responses = data.response;
            const correctAnswers = data.correct_answers;
            let correct = 0;
            
            story.questions.forEach((q, idx) => {
                const userAnswer = responses[`q${q.id}`];
                const correctOption = Object.entries(q.options).find(
                    ([key, value]) => key === q.correct_answer
                )[1];
                
                if (userAnswer === correctOption) {
                    correct++;
                }
            });
            
            data.accuracy = correct / story.questions.length;
            data.num_correct = correct;
            data.num_questions = story.questions.length;
        }
    };
}

/**
 * Create rating questions for a story
 */
function createRatingQuestions(story, storyNumber) {
    const likertQuestions = [
        {
            prompt: "How well did the music match the text?",
            name: "music_match",
            labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Extremely well"],
            required: true
        },
        {
            prompt: "How much did you enjoy reading the text?",
            name: "text_enjoyment",
            labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Extremely"],
            required: true
        },
        {
            prompt: "How distracting did you find the music?",
            name: "music_distraction",
            labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Extremely"],
            required: true
        },
        {
            prompt: "How engaged were you with the story?",
            name: "story_engagement",
            labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very engaged"],
            required: true
        }
    ];
    
    const volumeQuestion = [
        {
            prompt: "Did you mute your volume during this reading task?",
            name: "volume_muted",
            options: ["Yes", "No"],
            required: true
        }
    ];
    
    // Return a timeline with both the Likert questions and the volume question
    return {
        timeline: [
            {
                type: jsPsychSurveyLikert,
                preamble: `
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="text-align: center;">Experience Questions: ${story.title}</h2>
                        <p style="text-align: center; color: #666;">
                            Please rate your experience with this story on a scale from 1 to 7.
                        </p>
                    </div>
                `,
                questions: likertQuestions,
                button_label: 'Continue',
                randomize_question_order: false,
                data: {
                    task: 'rating_questions_likert',
                    story_id: story.id,
                    story_title: story.title,
                    story_number: storyNumber,
                    music_condition: story.musicCondition
                },
                on_finish: function(data) {
                    // Convert zero-indexed responses to 1-indexed
                    const response = data.response;
                    Object.keys(response).forEach(key => {
                        data.response[key] = response[key] + 1;
                    });
                }
            },
            {
                type: jsPsychSurveyMultiChoice,
                preamble: `
                    <div style="max-width: 800px; margin: 0 auto;">
                        <h2 style="text-align: center;">Volume Check: ${story.title}</h2>
                    </div>
                `,
                questions: volumeQuestion,
                button_label: 'Continue',
                data: {
                    task: 'rating_questions_volume',
                    story_id: story.id,
                    story_title: story.title,
                    story_number: storyNumber,
                    music_condition: story.musicCondition
                }
            }
        ]
    };
}

/**
 * Update loading status message
 */
function updateLoadingStatus(message) {
    const statusElement = document.getElementById('loading-status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

/**
 * Play background music for a story using pre-converted MP3 files
 * @param {string} mp3Path - Path to the MP3 file to play
 */
async function playStoryMusic(mp3Path) {
    try {
        console.log('Playing MP3:', mp3Path);
        
        // Clear all fade intervals first
        fadeIntervals.forEach(interval => clearInterval(interval));
        fadeIntervals = [];
        
        // Stop and clean up ALL previous audio elements
        allActiveAudio.forEach(audio => {
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 0;
            }
        });
        allActiveAudio = [];
        
        // Save current audio as previous before creating new audio
        if (currentAudio && !currentAudio.paused) {
            previousAudio = currentAudio;
        } else {
            previousAudio = null;
        }
        
        // Create new audio element
        const newAudio = new Audio(mp3Path);
        newAudio.loop = true;
        newAudio.volume = 0; // Start at 0 for fade-in
        
        // Wait for audio to be ready before playing
        return new Promise((resolve, reject) => {
            newAudio.addEventListener('canplaythrough', () => {
                newAudio.play()
                    .then(() => {
                        console.log('Music started playing');
                        
                        // Update current audio reference
                        currentAudio = newAudio;
                        
                        // Add to active audio tracking
                        allActiveAudio.push(newAudio);
                        
                        // Perform crossfade
                        if (previousAudio) {
                            crossfade(previousAudio, newAudio);
                        } else {
                            // No previous audio, just fade in
                            fadeIn(newAudio);
                        }
                        
                        // Show music indicator
                        const indicator = document.getElementById('music-indicator');
                        if (indicator) {
                            indicator.classList.add('playing');
                        }
                        
                        resolve();
                    })
                    .catch(error => {
                        console.error('Error playing audio:', error);
                        reject(error);
                    });
            }, { once: true });
            
            newAudio.addEventListener('error', (error) => {
                console.error('Error loading audio:', error);
                reject(error);
            });
            
            // Start loading the audio
            newAudio.load();
        });
        
    } catch (error) {
        console.error('Error playing music:', error);
    }
}

/**
 * Crossfade between two audio elements
 * @param {HTMLAudioElement} oldAudio - Audio element to fade out
 * @param {HTMLAudioElement} newAudio - Audio element to fade in
 */
function crossfade(oldAudio, newAudio) {
    const fadeOutDuration = CONFIG.music.fadeOutDuration || 1000;
    const fadeInDuration = CONFIG.music.fadeInDuration || 1000;
    const targetVolume = CONFIG.music.volume || 0.3;
    const steps = 50; // Number of steps for smooth fade
    const fadeOutInterval = fadeOutDuration / steps;
    const fadeInInterval = fadeInDuration / steps;
    const fadeOutStep = oldAudio.volume / steps;
    const fadeInStep = targetVolume / steps;
    
    let fadeOutCount = 0;
    let fadeInCount = 0;
    
    // Fade out old audio
    const fadeOutTimer = setInterval(() => {
        fadeOutCount++;
        if (oldAudio && !oldAudio.paused) {
            oldAudio.volume = Math.max(0, oldAudio.volume - fadeOutStep);
        }
        
        if (fadeOutCount >= steps || !oldAudio) {
            clearInterval(fadeOutTimer);
            if (oldAudio) {
                oldAudio.pause();
                oldAudio.currentTime = 0;
                oldAudio.volume = 0;
            }
            previousAudio = null;
        }
    }, fadeOutInterval);
    
    // Fade in new audio
    const fadeInTimer = setInterval(() => {
        fadeInCount++;
        if (newAudio && !newAudio.paused) {
            newAudio.volume = Math.min(targetVolume, newAudio.volume + fadeInStep);
        }
        
        if (fadeInCount >= steps || !newAudio) {
            clearInterval(fadeInTimer);
            if (newAudio) {
                newAudio.volume = targetVolume;
            }
        }
    }, fadeInInterval);
    
    // Store intervals for cleanup
    fadeIntervals.push(fadeOutTimer, fadeInTimer);
}

/**
 * Fade in an audio element
 * @param {HTMLAudioElement} audio - Audio element to fade in
 */
function fadeIn(audio) {
    const fadeInDuration = CONFIG.music.fadeInDuration || 1000;
    const targetVolume = CONFIG.music.volume || 0.3;
    const steps = 50;
    const fadeInInterval = fadeInDuration / steps;
    const fadeInStep = targetVolume / steps;
    
    let fadeInCount = 0;
    
    const fadeInTimer = setInterval(() => {
        fadeInCount++;
        if (audio && !audio.paused) {
            audio.volume = Math.min(targetVolume, audio.volume + fadeInStep);
        }
        
        if (fadeInCount >= steps || !audio) {
            clearInterval(fadeInTimer);
            if (audio) {
                audio.volume = targetVolume;
            }
        }
    }, fadeInInterval);
    
    fadeIntervals.push(fadeInTimer);
}

/**
 * Stop currently playing music with fade out
 */
function stopMusic() {
    // Clear any active fade intervals
    fadeIntervals.forEach(interval => clearInterval(interval));
    fadeIntervals = [];
    
    // Stop and clean up ALL active audio elements immediately
    allActiveAudio.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
        }
    });
    allActiveAudio = [];
    
    // Fade out and stop current audio
    if (currentAudio && !currentAudio.paused) {
        const fadeOutDuration = CONFIG.music.fadeOutDuration || 1000;
        const steps = 50;
        const fadeOutInterval = fadeOutDuration / steps;
        const fadeOutStep = currentAudio.volume / steps;
        let fadeOutCount = 0;
        
        const fadeOutTimer = setInterval(() => {
            fadeOutCount++;
            if (currentAudio) {
                currentAudio.volume = Math.max(0, currentAudio.volume - fadeOutStep);
            }
            
            if (fadeOutCount >= steps || !currentAudio) {
                clearInterval(fadeOutTimer);
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentAudio = null;
                }
            }
        }, fadeOutInterval);
    } else {
        currentAudio = null;
    }
    
    // Clean up previous audio if it exists
    if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
        previousAudio = null;
    }
    
    // Hide music indicator
    const indicator = document.getElementById('music-indicator');
    if (indicator) {
        indicator.classList.remove('playing');
    }
}

/**
 * Display final results
 */
function displayResults() {
    const data = jsPsychInstance.data.get();
    
    // Get question trials only
    const questionTrials = data.filter({task: 'comprehension_questions'});
    
    // Get rating trials
    const ratingTrialsLikert = data.filter({task: 'rating_questions_likert'});
    const ratingTrialsVolume = data.filter({task: 'rating_questions_volume'});
    
    // Calculate overall statistics
    let totalCorrect = 0;
    let totalQuestions = 0;
    
    const storyResults = questionTrials.values().map(trial => {
        totalCorrect += trial.num_correct;
        totalQuestions += trial.num_questions;
        
        return {
            story: trial.story_title,
            correct: trial.num_correct,
            total: trial.num_questions,
            accuracy: (trial.accuracy * 100).toFixed(1)
        };
    });
    
    // Extract rating results by combining Likert and volume responses
    const ratingResults = ratingTrialsLikert.values().map((likertTrial, index) => {
        const volumeTrial = ratingTrialsVolume.values()[index];
        return {
            story: likertTrial.story_title,
            music_condition: likertTrial.music_condition,
            ratings: {
                ...likertTrial.response,
                volume_muted: volumeTrial ? volumeTrial.response.volume_muted : 'N/A'
            }
        };
    });
    
    const overallAccuracy = totalQuestions > 0 ? 
        ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
    
    // Create results HTML
    let resultsHTML = `
        <div style="max-width: 800px; margin: 50px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="text-align: center; color: #333;">Your Results</h1>
            
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
                <h2 style="margin: 0; color: #4CAF50;">Overall Accuracy: ${overallAccuracy}%</h2>
                <p style="margin: 10px 0 0 0; color: #666;">
                    ${totalCorrect} correct out of ${totalQuestions} questions
                </p>
            </div>
            
            <h3>Results by Story:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Story</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Correct</th>
                        <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Accuracy</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    storyResults.forEach(result => {
        resultsHTML += `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${result.story}</td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">
                    ${result.correct}/${result.total}
                </td>
                <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">
                    ${result.accuracy}%
                </td>
            </tr>
        `;
    });
    
    resultsHTML += `
                </tbody>
            </table>
            
            <h3 style="margin-top: 40px;">Your Subjective Ratings:</h3>
            <p style="color: #666; font-size: 14px;">
                Your ratings for each story (scale: 1-7)
            </p>
    `;
    
    // Add rating results for each story
    ratingResults.forEach(result => {
        const ratings = result.ratings;
        resultsHTML += `
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 15px 0;">
                <h4 style="margin: 0 0 15px 0; color: #333;">${result.story}</h4>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; color: #666;">How well did the music match the text?</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">${ratings.music_match}/7</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; color: #666;">How much did you enjoy reading the text?</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">${ratings.text_enjoyment}/7</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; color: #666;">How distracting did you find the music?</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">${ratings.music_distraction}/7</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; color: #666;">How engaged were you with the story?</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">${ratings.story_engagement}/7</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; color: #666;">Did you mute your volume during this reading task?</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold;">${ratings.volume_muted}</td>
                    </tr>
                </table>
            </div>
        `;
    });
    
    resultsHTML += `
            <div style="margin-top: 40px; text-align: center;">
                <button onclick="redirectToProlific()" class="jspsych-btn" style="margin: 10px; background-color: #4CAF50;">
                    Complete Study (Return to Prolific)
                </button>
                <button onclick="downloadData()" class="jspsych-btn" style="margin: 10px;">
                    Download Data (CSV)
                </button>
                <button onclick="downloadDataJSON()" class="jspsych-btn" style="margin: 10px;">
                    Download Data (JSON)
                </button>
            </div>
            
            <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                Thank you for participating!
            </p>
        </div>
    `;
    
    document.getElementById('jspsych-target').innerHTML = resultsHTML;
}

/**
 * Download experiment data as CSV
 */
function downloadData() {
    const csv = jsPsychInstance.data.get().csv();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading_experiment_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Download experiment data as JSON
 */
function downloadDataJSON() {
    const json = jsPsychInstance.data.get().json();
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading_experiment_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

/**
 * Redirect participant back to Prolific with completion code
 */
function redirectToProlific() {
    // Prolific completion code for this study
    const completionCode = 'C556U7OY';
    
    // Prolific redirect URL format
    const redirectURL = `https://app.prolific.com/submissions/complete?cc=${completionCode}`;
    
    // Optional: Save data to server before redirecting
    // You can use cognition.run's data collection API here
    
    window.location.href = redirectURL;
}

// Start the experiment when page loads
window.addEventListener('load', initExperiment);

