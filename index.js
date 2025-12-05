/**
 * Cognition.run Compatible Experiment
 * Reading with Music Soundtracks Experiment
 * 
 * This file is designed for Cognition.run and contains all experiment logic.
 * jsPsych and plugins are provided by Cognition - no CDN imports needed.
 * 
 * SETUP INSTRUCTIONS FOR COGNITION:
 * 1. Paste this code in the Cognition code editor
 * 2. Add PapaParse as External Library: https://unpkg.com/papaparse@5.4.1/papaparse.min.js
 * 3. Add styles.css as External Library (or use the inline styles below)
 * 4. Upload all audio files as stimuli via GitHub Actions or manual upload
 */

// ============================================================================
// EMBEDDED CONFIGURATION
// ============================================================================

const CONFIG = {
    stories: [
        {
            id: 'carnival_packed_away',
            title: 'The Carnival Packed Away',
            midiDirName: 'carnival'
        },
        {
            id: 'lantern',
            title: 'The Lantern in the Window',
            midiDirName: 'lantern'
        },
        {
            id: 'starling_five',
            title: 'Starling Five',
            midiDirName: 'starling_five'
        },
        {
            id: 'window_blue_curtain',
            title: 'Window Blue Curtain',
            midiDirName: 'window_blue_curtain'
        }
    ],
    music: {
        loop: true,
        volume: 0.3,
        fadeInDuration: 1000,
        fadeOutDuration: 1000
    },
    experiment: {
        showProgressIndicator: true,
        showMusicIndicator: true,
        demo: false
    }
};

// ============================================================================
// EMBEDDED STORY DATA (Sentences)
// ============================================================================

const STORY_SENTENCES = {
    carnival_packed_away: [
        {id: 0, text: "The sun hung low and bright over the coastal town as the summer festival kicked off its first evening."},
        {id: 1, text: "For Lucy, summer didn't truly begin until the carnival lights flickered on, until the smell of kettle corn and sea salt blended together in the warm air."},
        {id: 2, text: "She had waited months for this."},
        {id: 3, text: "It was her favorite week of the year."},
        {id: 4, text: "She rushed through the entrance with a burst of giddy energy, nearly tripping over her own sandals. \"Come on, Theo!\" she called to her younger brother, who jogged behind her, laughing."},
        {id: 5, text: "Music pulsed from the Ferris wheel speakers."},
        {id: 6, text: "Children ran with cotton candy taller than their heads."},
        {id: 7, text: "Performers on stilts waved as they passed."},
        {id: 8, text: "Everything shimmered with color and possibility. \"First ride?\" Theo asked. \"Pirate Ship!\" Lucy said without hesitation."},
        {id: 9, text: "The ship swung high over the festival tents, the ocean coming into view at the peak of each arc."},
        {id: 10, text: "Lucy screamed with delight, her stomach flipping in that uniquely carnival way."},
        {id: 11, text: "Theo shouted something unintelligible, equal parts exhilaration and terror."},
        {id: 12, text: "They spent hours bouncing from ride to ride: bumper cars, the spinning teacups, the ridiculous funhouse mirrors."},
        {id: 13, text: "When they finally sat down to eat, they piled the table with fried dough, cheesy fries, and frozen lemonade."},
        {id: 14, text: "Lucy grinned so hard her cheeks hurt. \"Can this last forever?\" she asked. \"No way,\" Theo said, stuffing a fry into his mouth. \"But it can last all night.\" Lucy liked the idea."},
        {id: 15, text: "She wanted the sparkling lights and wild motion and laughter to stretch into something permanent, a bubble of joy untouched by reality."},
        {id: 16, text: "But even bubbles, she knew, eventually popped."},
        {id: 17, text: "The first crack came when the fireworks started."},
        {id: 18, text: "They burst in spectacular blooms across the sky—reds, greens, dazzling golds."},
        {id: 19, text: "The crowd gasped and applauded."},
        {id: 20, text: "Lucy felt her chest swell with happiness so bright she could hardly contain it."},
        {id: 21, text: "Then her phone buzzed."},
        {id: 22, text: "At first she ignored it."},
        {id: 23, text: "But when it buzzed again, then again, something uneasy stirred in her stomach."},
        {id: 24, text: "She pulled it out: three missed calls from Mom."},
        {id: 25, text: "Her father's name appeared on the fourth call, though he rarely phoned her directly."},
        {id: 26, text: "Lucy answered. \"Dad?"},
        {id: 27, text: "I'm at the carnival—\" His voice was the sound that changed the summer. \"Lucy… your grandmother collapsed."},
        {id: 28, text: "She's at the hospital."},
        {id: 29, text: "It's not good.\" The carnival noises muted around her, as though pushed behind a thick wall of glass."},
        {id: 30, text: "Fireworks still exploded overhead, but they felt wrong now—too loud, too bright, too alive. \"We're coming to get you and Theo,\" her father said. \"Stay where you are.\" Lucy hung up, her hands trembling."},
        {id: 31, text: "Theo looked at her, still grinning from the fireworks. \"What's wrong?\" Lucy didn't know how to say it."},
        {id: 32, text: "So she just took his hand and held it tightly until their parents arrived."},
        {id: 33, text: "The ride to the hospital was quiet except for the hum of tires on asphalt."},
        {id: 34, text: "Theo asked questions their parents didn't answer."},
        {id: 35, text: "Lucy stared out the window at the fading fireworks in the distance."},
        {id: 36, text: "Just an hour earlier, she'd wished the night would last forever."},
        {id: 37, text: "Be careful what you wish for, she thought bitterly."},
        {id: 38, text: "Beautiful things only last because they end."},
        {id: 39, text: "At the hospital, the sterile smell and harsh lighting crushed the last remnants of carnival magic."},
        {id: 40, text: "Lucy's grandmother—Nana Jo—had always been the warmest part of their family, the one who baked cookies on random Tuesdays and told stories with hands that danced like birds."},
        {id: 41, text: "Now she lay still and pale, machines doing the breathing she once did with laughter."},
        {id: 42, text: "Lucy stayed by her bedside long after Theo fell asleep in a waiting-room chair."},
        {id: 43, text: "She whispered memories, hoping Nana Jo could hear them: the summer picnics at the lake, the way she hummed old songs while folding laundry, the time she taught Lucy to sew a crooked little pillow shaped like a star."},
        {id: 44, text: "But the machines kept beeping in steady, indifferent rhythm."},
        {id: 45, text: "Around dawn, a nurse gently squeezed her shoulder. \"She's fading,\" she said softly."},
        {id: 46, text: "Lucy's parents woke Theo."},
        {id: 47, text: "The four of them stood around the bed as the monitors slowed, then stuttered, then softened into a flat silence."},
        {id: 48, text: "The absence of sound was unbearable."},
        {id: 49, text: "When they returned home later, the carnival was gone."},
        {id: 50, text: "Not literally—they could still see its Ferris wheel rising over the boardwalk from their window."},
        {id: 51, text: "But for Lucy, its joy was now unreachable, locked behind grief's heavy curtain."},
        {id: 52, text: "Even the distant laughter drifting from the rides felt intrusive, almost cruel."},
        {id: 53, text: "The following day, her friends begged her to come back to the festival, to \"get her mind off things.\" But Lucy couldn't imagine stepping into that world again."},
        {id: 54, text: "The colors would be too bright, the music too upbeat, the smells too sweet."},
        {id: 55, text: "The carnival would go on, of course."},
        {id: 56, text: "Joy was stubborn that way."},
        {id: 57, text: "But hers was dimmed now."},
        {id: 58, text: "Each night she listened to the echoes of fireworks, remembering how they once made her feel."},
        {id: 59, text: "Remembering how quickly feelings could collapse, like tents being packed away."},
        {id: 60, text: "On the last night of the carnival, she finally forced herself to walk to the boardwalk."},
        {id: 61, text: "Not to ride anything—just to say goodbye to the season she'd started so happily."},
        {id: 62, text: "The Ferris wheel spun slowly against the night sky."},
        {id: 63, text: "Kids laughed."},
        {id: 64, text: "Couples held hands."},
        {id: 65, text: "Someone won a giant stuffed bear and cheered."},
        {id: 66, text: "Lucy stood at the edge, unseen."},
        {id: 67, text: "Unchanged on the outside."},
        {id: 68, text: "Completely changed on the inside."},
        {id: 69, text: "She closed her eyes."},
        {id: 70, text: "For a moment she heard the fireworks again—the first ones, the bright ones, before the phone call."},
        {id: 71, text: "She let herself feel the echo of that joy, then let it slip away."},
        {id: 72, text: "When she opened her eyes, the carnival lights blurred in small shining streaks."},
        {id: 73, text: "She wasn't crying because she missed the carnival."},
        {id: 74, text: "She was crying because she finally realized that happiness, like summer, was something you couldn't hold, no matter how tightly you tried."}
    ],
    starling_five: [
        {id: 0, text: "The Starling Five launched from Orbit Station Helios just after sunrise, though sunrise was more a concept than a view at that altitude."},
        {id: 1, text: "Still, the crew cheered as the engines burned the edge of the world into a band of shimmering gold."},
        {id: 2, text: "Captain Mira Solène floated weightlessly in the command deck, grinning at her four teammates. \"All right, team,\" she said. \"First deep-range survey mission."},
        {id: 3, text: "Let's make history.\" The crew—Samir, Jin, Aleya, and Rowan—shouted back in overlapping excitement."},
        {id: 4, text: "For them, this wasn't just a mission; it was the realization of childhood dreams."},
        {id: 5, text: "They'd trained together for years, bonded through simulations and sleepless nights and shared ambitions."},
        {id: 6, text: "Their ship, The Finch, was small but engineered for elegance."},
        {id: 7, text: "Sleek hull, experimental propulsion, advanced environmental systems."},
        {id: 8, text: "Cutting-edge everything. \"Trajectory locked,\" Jin said. \"Initiating jump sequence on your mark.\" Mira nodded. \"Mark.\" The ship trembled as the jump coils activated."},
        {id: 9, text: "Space folded, bent, shimmered— And then, with a smooth lurch, they emerged in an entirely new star system, bathed in light from a peach-colored sun."},
        {id: 10, text: "Gas giants floated like swirls of ink."},
        {id: 11, text: "A ringed planet glimmered with ice crystals."},
        {id: 12, text: "The crew erupted into cheers. \"This is insane,\" Samir breathed. \"We're actually here,\" Aleya whispered, eyes shining."},
        {id: 13, text: "They spent the first two days charting magnetic fields, capturing images, collecting data."},
        {id: 14, text: "Sleep felt optional; adrenaline kept them awake."},
        {id: 15, text: "They played music over the ship speakers, drifting through the cabin like they were dancing in a dream."},
        {id: 16, text: "They took photos, recorded vlogs, sent messages back to Helios filled with laughter and awe."},
        {id: 17, text: "Nothing felt wrong."},
        {id: 18, text: "Until the third day."},
        {id: 19, text: "Rowan was the first to notice the slight dip in oxygen levels."},
        {id: 20, text: "Not enough to alarm anyone—ships fluctuated all the time—but enough to log it."},
        {id: 21, text: "By day four, the dip had grown more noticeable. \"Sensor malfunction?\" Samir suggested. \"Maybe,\" Jin said."},
        {id: 22, text: "But he didn't sound convinced."},
        {id: 23, text: "They ran diagnostics."},
        {id: 24, text: "Twice."},
        {id: 25, text: "Three times."},
        {id: 26, text: "The readings were all correct."},
        {id: 27, text: "Something was draining oxygen from the environmental system. \"Leak?\" Mira asked. \"No leak,\" Aleya said softly. \"We would have seen pressure changes.\" They checked seals, conduits, tanks, vents."},
        {id: 28, text: "Everything appeared intact."},
        {id: 29, text: "Yet the oxygen kept dropping—in tiny increments at first, then faster."},
        {id: 30, text: "By day five, the alarms began."},
        {id: 31, text: "The crew's excitement dissolved into focused tension."},
        {id: 32, text: "Mira scanned every panel, every chart. \"We need to isolate the cause."},
        {id: 33, text: "We turn back now.\" \"Agreed,\" Rowan said. \"Even with conservation measures, we might not have enough to make it home.\" They initiated the return jump."},
        {id: 34, text: "Nothing happened."},
        {id: 35, text: "Jin slammed the controls again. \"Drive coils aren't engaging.\" \"Diagnostics!\" Mira ordered."},
        {id: 36, text: "As the system analyzed itself, the crew silently gripped their seats."},
        {id: 37, text: "The ship's hum sounded lower now, as though it too were struggling to breathe."},
        {id: 38, text: "The results appeared on the screen: Power reroute failure."},
        {id: 39, text: "Environmental systems drawing excess energy."},
        {id: 40, text: "Cause unknown. \"What does that mean?\" Samir asked, voice cracking. \"It means,\" Jin said, \"something in our life-support system is consuming more power than it should.\" \"And oxygen,\" Rowan added grimly."},
        {id: 41, text: "The crew worked nonstop."},
        {id: 42, text: "Mira assigned shifts, but no one slept."},
        {id: 43, text: "They floated through the ship like ghosts, drifting from panel to conduit to emergency manual."},
        {id: 44, text: "On day six, the music stopped."},
        {id: 45, text: "Not by choice—the internal power-saving protocol cut non-essentials."},
        {id: 46, text: "On day seven, sleep became unavoidable."},
        {id: 47, text: "Their words slurred."},
        {id: 48, text: "Movements slowed."},
        {id: 49, text: "Mira caught Aleya drifting unconscious and shook her awake. \"Sorry,\" Aleya murmured. \"Just tired.\" \"We all are,\" Mira said softly. \"But we keep going.\" They found the problem on day eight."},
        {id: 50, text: "A microfracture—no larger than a fingernail—hidden in a second-layer filtration pipe."},
        {id: 51, text: "Invisible to sensors until the pressure difference grew significant."},
        {id: 52, text: "The crack allowed ambient hydrogen from their propulsion tank to seep into the oxygen filtration system."},
        {id: 53, text: "The reaction consumed oxygen slowly at first, then exponentially as the imbalance grew."},
        {id: 54, text: "It was repairable."},
        {id: 55, text: "In theory. \"But we don't have the materials,\" Jin said quietly."},
        {id: 56, text: "Silence pressed down on them. \"How long do we have?\" Mira asked."},
        {id: 57, text: "Rowan checked the readings."},
        {id: 58, text: "His voice was barely audible. \"Three days.\" Mira steadied herself. \"Then we use them.\" Those final days unfolded with heartbreaking clarity."},
        {id: 59, text: "The crew stopped searching for solutions—they had tried everything."},
        {id: 60, text: "Instead, they recorded final messages to Earth."},
        {id: 61, text: "They wrote notes to family."},
        {id: 62, text: "They shared stories from their childhoods, laughing softly at memories that suddenly felt precious."},
        {id: 63, text: "They floated together in the common cabin, hugging awkwardly in zero gravity."},
        {id: 64, text: "Samir cried quietly."},
        {id: 65, text: "Aleya held his hand."},
        {id: 66, text: "Jin apologized for not finding a miracle."},
        {id: 67, text: "Rowan whispered that he wasn't ready to die in the dark."},
        {id: 68, text: "Mira told them: \"We didn't fail."},
        {id: 69, text: "We reached another star."},
        {id: 70, text: "We did what humans always dreamed of.\" But privately, she grieved harder than she'd ever imagined possible."},
        {id: 71, text: "On the last morning—if it could be called morning—the lights dimmed to emergency red."},
        {id: 72, text: "The ship's hum grew weak."},
        {id: 73, text: "Their breaths came thin and slow."},
        {id: 74, text: "Mira gathered the crew one final time. \"Thank you,\" she said. \"For being my family out here.\" They joined hands."},
        {id: 75, text: "Five explorers in a dying ship, suspended in the quiet between stars."},
        {id: 76, text: "One by one, they drifted into unconsciousness."},
        {id: 77, text: "The Finch continued its silent path through the foreign system, her hull gleaming faintly in the peach-colored light—a tiny vessel carrying the echo of humanity's brightest joy and its deepest sorrow."},
        {id: 78, text: "The mission log would never reach Earth."},
        {id: 79, text: "But the ship kept going, drifting onward, as though searching for a place to lay down its final dream."}
    ],
    window_blue_curtain: [
        {id: 1, text: "When the winter finally broke, Jonas still kept the blue curtain drawn over the single front window of his small apartment."},
        {id: 2, text: "It had been there since Mara left—just four months, though the days felt stretched and brittle, like thin ice over deep water."},
        {id: 3, text: "Every morning he woke to the pale navy light bleeding through the fabric."},
        {id: 4, text: "Every morning he told himself he would take it down."},
        {id: 5, text: "And every morning, he couldn't."},
        {id: 6, text: "The apartment felt silent in a way that suggested sound had once lived there."},
        {id: 7, text: "Two mismatched mugs on the counter, one with a small chip."},
        {id: 8, text: "A pair of slippers, soft and worn, still sitting neatly by the door."},
        {id: 9, text: "Jonas moved through the space with the heavy, automatic motions of someone navigating a museum of their own grief."},
        {id: 10, text: "He worked from home now—less by choice, more because he couldn't stand taking the metro and seeing other people living their regular, busy lives."},
        {id: 11, text: "His job in data analysis asked very little of him emotionally, which was perfect; he felt he had little left to give."},
        {id: 12, text: "On a Thursday morning in early March, a knock interrupted his routine."},
        {id: 13, text: "Three short taps."},
        {id: 14, text: "Jonas rarely received visitors."},
        {id: 15, text: "For a moment he froze—the kind that comes before remembering you're still in a world where doors open."},
        {id: 16, text: "When he answered, an elderly woman stood in the hallway, leaning on a cane shaped like a curlicue of dark wood."},
        {id: 17, text: "She wore a wool coat too warm for the weather and a wool hat too large for her head, giving her a slightly magical appearance, as though she might disappear if he blinked too slowly. \"Are you Jonas Miller?\" she asked. \"Yes.\" \"I'm Mrs."},
        {id: 18, text: "Weller."},
        {id: 19, text: "I live downstairs."},
        {id: 20, text: "There's… an issue with the birds.\" Jonas blinked. \"The birds?\" \"They're building a nest in your air-conditioning unit."},
        {id: 21, text: "They've been dropping twigs on my balcony."},
        {id: 22, text: "I thought you should know.\" It wasn't the kind of emergency most people would panic about, but the woman's expression was earnest."},
        {id: 23, text: "Jonas nodded, grabbed a jacket, and followed her downstairs."},
        {id: 24, text: "Outside her window, small brown sparrows darted in and out of the slats of his A/C unit, each carrying a bit of fluff or twig."},
        {id: 25, text: "Mrs."},
        {id: 26, text: "Weller frowned as though she personally disapproved of their architectural choices. \"They're sweet little things, but I'm afraid something will catch fire come summer,\" she said. \"I'll clear it out,\" Jonas said softly."},
        {id: 27, text: "She watched him for a long moment. \"You've been quiet these months."},
        {id: 28, text: "I worried about you.\" Jonas tensed. \"Just been busy.\" Mrs."},
        {id: 29, text: "Weller nodded, but he could tell she knew better. \"People are like these birds,\" she said. \"We make our messes where we can."},
        {id: 30, text: "But sometimes someone needs to clear away the twigs.\" It was a strange metaphor, yet something in it cracked the shell Jonas had been wearing like a second skin."},
        {id: 31, text: "He spent the next hour gently removing the small nest."},
        {id: 32, text: "The sparrows chirped from a nearby branch, annoyed and curious."},
        {id: 33, text: "One hopped closer, bold and unafraid."},
        {id: 34, text: "Jonas felt a tiny bubble in his chest—something like warmth but unfamiliar, fragile."},
        {id: 35, text: "Mrs."},
        {id: 36, text: "Weller brought him tea afterward, insisting he sit with her on her balcony."},
        {id: 37, text: "She told him stories about the neighborhood: the building super who loved classical music, the teenager across the hall who practiced violin at inconvenient hours, the couple upstairs expecting their first child."},
        {id: 38, text: "Jonas hadn't known any of this."},
        {id: 39, text: "He hadn't wanted to."},
        {id: 40, text: "After he left, the blue curtain in his apartment felt heavier than usual."},
        {id: 41, text: "That evening he stood in front of it, fingers wrapped around the edge of the fabric."},
        {id: 42, text: "The streetlights outside glowed faintly through the weave."},
        {id: 43, text: "It was the glow of a world continuing, indifferent to his grief but not hostile to his return."},
        {id: 44, text: "He pulled the curtain aside."},
        {id: 45, text: "The world outside wasn't extraordinary."},
        {id: 46, text: "A dog walker passing by."},
        {id: 47, text: "A delivery cyclist stopped at a red light."},
        {id: 48, text: "Tree branches still bare from winter."},
        {id: 49, text: "But it was moving."},
        {id: 50, text: "And as Jonas stood there, that fragile warmth in his chest stretched, tentatively unfurling like a leaf testing sunlight."},
        {id: 51, text: "The next morning he opened the window entirely."},
        {id: 52, text: "Fresh air rushed in, cool and alive."},
        {id: 53, text: "He heard the sparrows singing, undeterred by yesterday's inconvenience."},
        {id: 54, text: "He found himself smiling—small at first, then fuller when one bird hopped onto the fire escape railing and cocked its head at him, as if in greeting."},
        {id: 55, text: "He made coffee and sat by the light."},
        {id: 56, text: "He answered emails with more energy than he'd felt in months."},
        {id: 57, text: "He even ventured outside later in the afternoon to buy groceries."},
        {id: 58, text: "The sky was clear, impossibly blue."},
        {id: 59, text: "Spring softened the city over the next weeks."},
        {id: 60, text: "Trees blossomed, and with them, Jonas felt something inside thaw."},
        {id: 61, text: "He started noticing small things: a toddler laughing at soap bubbles, a mural he'd never taken the time to appreciate, the barista at the corner café who always drew a tiny heart in milk foam."},
        {id: 62, text: "He found himself wanting to see Mrs."},
        {id: 63, text: "Weller again, to thank her for nudging him out of the darkness without even meaning to."},
        {id: 64, text: "One day, he brought her a small potted plant."},
        {id: 65, text: "She answered the door with delighted surprise, and they talked on her balcony for hours."},
        {id: 66, text: "By May, Jonas began taking long walks in the park."},
        {id: 67, text: "He sat under budding trees and read books he had abandoned months before."},
        {id: 68, text: "He started painting again—something he hadn't done seriously since college."},
        {id: 69, text: "The colors felt too bright at first, almost foreign, but soon, he craved them."},
        {id: 70, text: "The city became alive with festivals, music, food stalls."},
        {id: 71, text: "One Saturday evening he followed the distant sound of jazz to a riverside gathering."},
        {id: 72, text: "Lanterns flickered along the walkway."},
        {id: 73, text: "People danced with unrestrained joy."},
        {id: 74, text: "Jonas stood at the edge of the crowd, the golden light washing over him."},
        {id: 75, text: "Someone bumped his shoulder gently."},
        {id: 76, text: "A woman with dark curls smiled apologetically. \"Sorry,\" she said. \"Didn't see you there.\" \"It's fine,\" Jonas said, smiling in a way that felt both new and ancient."},
        {id: 77, text: "She nodded toward the music. \"You're welcome to join us.\" And for the first time in a long time—maybe longer than he cared to admit—Jonas nodded, stepped forward, and let the music pull him into the center of a world that had been waiting for him all along."},
        {id: 78, text: "The night was warm, the river shimmering in the glow of lanterns."},
        {id: 79, text: "Jonas laughed, danced, breathed."},
        {id: 80, text: "And when he looked up and saw the sparrows swooping overhead, he thought: Maybe joy isn't something you chase."},
        {id: 81, text: "Maybe it's something you let land."}
    ],
    lantern: [
        {id: 0, text: "The house had grown too quiet."},
        {id: 1, text: "Ever since the accident, the silence pressed against Mara's ears like cold hands."},
        {id: 2, text: "It wasn't the ordinary quiet of an empty home—it was a silence that seemed to swallow every attempt she made to distract herself."},
        {id: 3, text: "The creak of the floorboards sounded hollow."},
        {id: 4, text: "The hum of the heater carried a kind of loneliness."},
        {id: 5, text: "Even the old wooden clock, whose ticking once comforted her, now felt like a countdown to nothing in particular."},
        {id: 6, text: "Her husband, Eli, had loved that clock."},
        {id: 7, text: "He'd bought it at a flea market on their first anniversary, grinning like he had found buried treasure. \"It's got character,\" he had said. \"A voice.\" \"A heartbeat.\" Now its heartbeat felt like one more reminder that his had stopped."},
        {id: 8, text: "It had been three months, and Mara still woke up each morning half-expecting to find him downstairs, stirring eggs with music playing far too loud."},
        {id: 9, text: "But every morning, she walked into the same still kitchen."},
        {id: 10, text: "The house's emptiness echoed back at her, saying what the world kept trying to say: he is gone, and you are alone."},
        {id: 11, text: "Outside, the winter sky was the same dull gray as the day he died."},
        {id: 12, text: "The thing that hurt most wasn't the memory of the accident."},
        {id: 13, text: "It was the life that simply kept going."},
        {id: 14, text: "The mail still came."},
        {id: 15, text: "Trash day still arrived."},
        {id: 16, text: "Neighbors still waved politely, pity softening their eyes."},
        {id: 17, text: "And the seasons—uncaring, unstoppable—shifted onward."},
        {id: 18, text: "One evening, as the daylight thinned into the narrow blue of dusk, Mara found herself standing at the window."},
        {id: 19, text: "It was the same window Eli used to decorate with tiny string lights every December."},
        {id: 20, text: "He'd insisted that lights, however small, made the winter feel less bleak."},
        {id: 21, text: "Her finger traced the sill."},
        {id: 22, text: "She wasn't sure why she did it, but she reached into the cabinet where they kept the holiday decorations."},
        {id: 23, text: "Underneath tangled garlands and dusty ornaments, she found a small brass lantern they'd bought on a whim years ago."},
        {id: 24, text: "Eli had planned to hang it on the back porch, but they'd never gotten around to it."},
        {id: 25, text: "Mara set it on the sill."},
        {id: 26, text: "It was empty, but she struck a match and placed a small tea light inside."},
        {id: 27, text: "Warm amber flickered across the glass panes, catching motes of dust in the air."},
        {id: 28, text: "The glow felt fragile, almost apologetic."},
        {id: 29, text: "Still, it was something."},
        {id: 30, text: "As she watched the lantern burn, her shoulders eased by an inch—just enough for the air to enter her lungs without resisting."},
        {id: 31, text: "That night, she left the lantern glowing until it guttered out on its own."},
        {id: 32, text: "The next day brought a thin layer of snow, the kind that turned the street into something soft and unhurried."},
        {id: 33, text: "For the first time in weeks, Mara noticed the children across the road playing outside, cheeks red, laughter muffled by scarves."},
        {id: 34, text: "She watched them from behind the window, her hand resting on the cool glass."},
        {id: 35, text: "A small boy in a green coat paused and stared at her house."},
        {id: 36, text: "When he spotted the brass lantern, he pointed excitedly before running back to his friends."},
        {id: 37, text: "It startled her—how something so small, so faintly glowing, could draw anyone's attention."},
        {id: 38, text: "That evening, she lit it again."},
        {id: 39, text: "The day after that, she did the same."},
        {id: 40, text: "Soon it became a ritual."},
        {id: 41, text: "At dusk, she would light the lantern, warm her hands near it, then leave it by the window to glow until morning."},
        {id: 42, text: "She still moved through her days slowly, still felt Eli's absence with every breath, but there was a hint—just a hint—of softness around the sharp edges of her grief."},
        {id: 43, text: "One night, there was a knock at the door."},
        {id: 44, text: "Mara stiffened."},
        {id: 45, text: "She wasn't expecting anyone, and most people had stopped dropping by out of respect or discomfort."},
        {id: 46, text: "She opened the door only a crack."},
        {id: 47, text: "A woman about her age stood on the porch, bundled in a burgundy coat."},
        {id: 48, text: "Her eyes were warm but tentative."},
        {id: 49, text: "Mara recognized her vaguely—a neighbor from the next block over. \"Hi,\" the woman said, offering a gentle smile. \"Sorry to bother you."},
        {id: 50, text: "I just wanted to tell you that your lantern is beautiful.\" Mara blinked, unsure what to say. \"I walk my dog every evening,\" the woman continued. \"And I always notice it."},
        {id: 51, text: "It's a really lovely light."},
        {id: 52, text: "It makes the street feel less lonely.\" Something in Mara's chest tightened, but not painfully this time. \"Oh,\" she said softly. \"Thank you.\" The woman hesitated. \"I'm Sara, by the way.\" \"Mara.\" \"Well… Mara, I hope you keep lighting it."},
        {id: 53, text: "It's nice.\" When Sara left, Mara stood in the doorway for a long moment, watching her footprints disappear into the snow."},
        {id: 54, text: "She looked back at the lantern in the window and felt something warm press against her heart—not quite joy, not yet, but something like a beginning."},
        {id: 55, text: "Winter gave way, slowly, reluctantly, to early spring."},
        {id: 56, text: "The sky brightened little by little."},
        {id: 57, text: "A thin line of green returned to the branches near the house."},
        {id: 58, text: "And Mara—quietly, cautiously—began leaving the house again."},
        {id: 59, text: "At first, just short walks around the block."},
        {id: 60, text: "Then longer ones."},
        {id: 61, text: "The neighbors who had once spoken to her with hushed sympathy now greeted her with genuine warmth."},
        {id: 62, text: "Children raced past her on scooters."},
        {id: 63, text: "Dogs tugged at leashes."},
        {id: 64, text: "The world buzzed with the easy chatter of people living ordinary lives."},
        {id: 65, text: "The lantern remained in the window, though she replaced the candle inside with a battery-powered flicker."},
        {id: 66, text: "She switched it on each evening, as predictably as the sun setting."},
        {id: 67, text: "One afternoon, while returning from a walk, she heard footsteps catching up behind her. \"Mara!\" She turned to see Sara jogging toward her with two steaming cups. \"I brought hot chocolate,\" she said, slightly out of breath. \"Thought you might want to share a walk.\" Mara felt the corners of her mouth tug upward—an unfamiliar sensation, rusty but real. \"I'd like that.\" They walked slowly, drinking chocolate so rich it clung to the tongue."},
        {id: 68, text: "Sara told stories about her dog, her job, and her absurdly nosy aunt."},
        {id: 69, text: "Mara listened."},
        {id: 70, text: "She laughed once—truly laughed—and was startled by how good it felt."},
        {id: 71, text: "When they reached Mara's house again, Sara glanced at the lantern glowing faintly behind the window. \"It really suits you,\" she said. \"That light.\" Mara followed her gaze."},
        {id: 72, text: "For months, the lantern had been a symbol of loss, something she lit because she didn't know what else to do."},
        {id: 73, text: "But now, looking at it through fresh spring air, she realized it had changed."},
        {id: 74, text: "Or maybe she had. \"It's not about grief anymore,\" Mara said quietly. \"It's about remembering."},
        {id: 75, text: "And also about moving forward.\" Sara smiled. \"It shows.\" By summer, Mara had filled the once-empty house with plants."},
        {id: 76, text: "She filled it with music again."},
        {id: 77, text: "She filled it with friends—few at first, then more."},
        {id: 78, text: "She enrolled in a pottery class, something Eli had always encouraged but she'd been too shy to try."},
        {id: 79, text: "She wasn't good at it yet, but she liked the way clay felt under her fingers."},
        {id: 80, text: "She liked the way shaping something new steadied her breath."},
        {id: 81, text: "And every sunset, the lantern glowed."},
        {id: 82, text: "On warm evenings, she sat on the porch while Sara's dog sprawled at her feet."},
        {id: 83, text: "She listened to distant laughter."},
        {id: 84, text: "She felt the air hum with life."},
        {id: 85, text: "She still missed Eli."},
        {id: 86, text: "She always would."},
        {id: 87, text: "But the ache had settled into something gentle, something she could hold without breaking."},
        {id: 88, text: "One night, as fireflies blinked lazily over the yard, Sara nudged her shoulder. \"You know,\" she said, \"your lantern started something.\" \"People on the next street have begun putting little lights in their windows too.\" \"It's become kind of a neighborhood thing.\" Mara felt surprise rise into a smile. \"Really?\" \"Really.\" \"One small light, and suddenly the whole place feels warmer.\" Mara looked at the lantern—its soft, steady glow reflecting in the glass."},
        {id: 89, text: "For the first time in a long time, she felt that same glow inside herself."},
        {id: 90, text: "Maybe healing didn't come all at once."},
        {id: 91, text: "Maybe it arrived as a flicker, then a spark, then a warmth that slowly filled the spaces grief had hollowed out."},
        {id: 92, text: "Maybe it began with something as small as a lantern."},
        {id: 93, text: "And maybe—Mara thought as she leaned back, breathing in the sweetness of a summer night—it could grow into something bright enough to light a life again."}
    ]
};

// ============================================================================
// EMBEDDED QUESTIONS DATA
// ============================================================================

const STORY_QUESTIONS = {
    carnival_packed_away: [
        {id: 1, question: "Where is Lucy at the beginning of the story?", options: {A: "At school", B: "At a summer carnival", C: "At the library", D: "At her grandmother's house"}, correct_answer: "B"},
        {id: 2, question: "Who is Lucy with at the carnival?", options: {A: "Her best friend", B: "Her younger brother, Theo", C: "Her entire class", D: "Her grandmother"}, correct_answer: "B"},
        {id: 3, question: "What happens that changes Lucy's mood?", options: {A: "She gets a phone call that her grandmother is sick.", B: "She drops her ice cream.", C: "It starts to rain heavily.", D: "The carnival closes early."}, correct_answer: "A"},
        {id: 4, question: "How does the carnival seem to Lucy after she gets the bad news?", options: {A: "It looks even more beautiful.", B: "It feels too loud, too bright, and wrong.", C: "It becomes very quiet.", D: "She doesn't notice any difference."}, correct_answer: "B"},
        {id: 5, question: "What does Lucy realize when she visits the boardwalk on the last night?", options: {A: "She wants to be a carnival worker.", B: "She hates fireworks.", C: "Happiness is something you can't hold onto forever.", D: "She should have ridden the Ferris wheel one more time."}, correct_answer: "C"}
    ],
    starling_five: [
        {id: 1, question: "What is the main mission of the crew on the ship 'The Finch'?", options: {A: "To fight a space battle against aliens.", B: "To rescue a stranded ship.", C: "To explore a new star system.", D: "To deliver supplies to a space station."}, correct_answer: "C"},
        {id: 2, question: "What problem does the crew discover on the third day?", options: {A: "They ran out of food.", B: "Oxygen levels are slowly dropping.", C: "The navigation computer is broken.", D: "The radio is making strange noises."}, correct_answer: "B"},
        {id: 3, question: "What caused the problem on the ship?", options: {A: "A tiny crack (microfracture) in a pipe.", B: "A mistake made by the pilot.", C: "A meteor hit the ship.", D: "The engine overheated."}, correct_answer: "A"},
        {id: 4, question: "Why can't the crew fly the ship back home?", options: {A: "They don't want to leave yet.", B: "The ship doesn't have enough power to jump back.", C: "They lost the map to Earth.", D: "The captain refuses to turn around."}, correct_answer: "B"},
        {id: 5, question: "How does the story end for the crew?", options: {A: "They fix the ship at the last minute.", B: "They are rescued by another ship.", C: "They drift into unconsciousness together.", D: "They land on a planet and build a house."}, correct_answer: "C"}
    ],
    window_blue_curtain: [
        {id: 1, question: "What has covered Jonas's window for the last four months?", options: {A: "A blue curtain", B: "Heavy wooden shutters", C: "A sheet of plastic", D: "Metal bars"}, correct_answer: "A"},
        {id: 2, question: "Why does Mrs. Weller knock on Jonas's door?", options: {A: "She needs to borrow some sugar.", B: "She wants to complain about noise.", C: "Birds are building a nest in his air conditioner.", D: "She locked herself out of her apartment."}, correct_answer: "C"},
        {id: 3, question: "How does Jonas feel at the beginning of the story?", options: {A: "Excited and energetic.", B: "Sad and isolated.", C: "Angry and loud.", D: "Busy and stressed."}, correct_answer: "B"},
        {id: 4, question: "What does Jonas do after he helps Mrs. Weller with the birds?", options: {A: "He yells at the birds.", B: "He goes back to sleep.", C: "He pulls the curtain aside and eventually opens the window.", D: "He moves to a different apartment."}, correct_answer: "C"},
        {id: 5, question: "Where does Jonas go at the end of the story?", options: {A: "To a riverside gathering with music and lanterns.", B: "To a job interview.", C: "To the hospital.", D: "To the movies."}, correct_answer: "A"}
    ],
    lantern: [
        {id: 1, question: "What object does Mara find in her cabinet and place in the window?", options: {A: "A wooden clock", B: "A brass lantern", C: "A string of holiday lights", D: "A vase of flowers"}, correct_answer: "B"},
        {id: 2, question: "Why is Mara living alone in the house?", options: {A: "Her husband, Eli, passed away.", B: "Her children moved out for college.", C: "She just moved to a new city.", D: "She prefers to live by herself."}, correct_answer: "A"},
        {id: 3, question: "Who knocks on Mara's door to talk to her?", options: {A: "A delivery driver", B: "The mailman", C: "Sara, a neighbor who walks her dog", D: "An old friend of Eli's"}, correct_answer: "C"},
        {id: 4, question: "What does the neighbor say about the lantern?", options: {A: "It is too bright and keeps her awake.", B: "It makes the street feel less lonely.", C: "It looks like it might cause a fire.", D: "It reminds her of her own childhood."}, correct_answer: "B"},
        {id: 5, question: "What happens on the next street by the end of the story?", options: {A: "The streetlights stop working.", B: "People start complaining about the lights.", C: "Other neighbors begin putting small lights in their windows too.", D: "Everyone decides to move away."}, correct_answer: "C"}
    ]
};

// ============================================================================
// EMBEDDED MIDI MAPPINGS
// ============================================================================

const MIDI_MAPPINGS = {
    carnival_packed_away: {"1to2":[{partition:1,sentence_ids:"0"},{partition:2,sentence_ids:"1,2"},{partition:3,sentence_ids:"3,4"},{partition:4,sentence_ids:"5,6,7,8"},{partition:5,sentence_ids:"9,10,11"},{partition:6,sentence_ids:"12,13"},{partition:7,sentence_ids:"14"},{partition:8,sentence_ids:"15,16"},{partition:9,sentence_ids:"17,18,19,20"}],"3to4":[{partition:1,sentence_ids:"21,22,23,24,25"},{partition:2,sentence_ids:"26,27,28,29"},{partition:3,sentence_ids:"30,31"},{partition:4,sentence_ids:"32,33,34,35"},{partition:5,sentence_ids:"36,37,38,39"},{partition:6,sentence_ids:"40,41"},{partition:7,sentence_ids:"42,43"},{partition:8,sentence_ids:"44,45,46"},{partition:9,sentence_ids:"47,48,49,50"},{partition:10,sentence_ids:"51,52,53"},{partition:11,sentence_ids:"54,55,56,57,58"},{partition:12,sentence_ids:"59,60,61,62"}]},
    starling_five: {"1to2":[{partition:1,sentence_ids:"0,1"},{partition:2,sentence_ids:"2,3,4,5"}],"2to3":[{partition:1,sentence_ids:"6,7,8"},{partition:2,sentence_ids:"9,10,11,12"},{partition:3,sentence_ids:"13,14,15,16"}],"3to4":[{partition:1,sentence_ids:"17,18,19,20"},{partition:2,sentence_ids:"21,22,23,24,25,26"},{partition:3,sentence_ids:"27,28,29,30"},{partition:4,sentence_ids:"31,32,33"},{partition:5,sentence_ids:"34,35,36,37"},{partition:6,sentence_ids:"38,39,40"},{partition:7,sentence_ids:"41,42,43,44,45,46"},{partition:8,sentence_ids:"47,48,49,50"},{partition:9,sentence_ids:"51,52,53"}]},
    window_blue_curtain: {"1to2":[{partition:1,sentence_ids:"1,2"},{partition:2,sentence_ids:"3,4"},{partition:3,sentence_ids:"5,6,7,8"},{partition:4,sentence_ids:"9,10"},{partition:5,sentence_ids:"11,12,13"},{partition:6,sentence_ids:"14,15,16"},{partition:7,sentence_ids:"17,18,19"},{partition:8,sentence_ids:"20,21,22"},{partition:9,sentence_ids:"23,24"},{partition:10,sentence_ids:"25,26"},{partition:11,sentence_ids:"27,28,29"},{partition:12,sentence_ids:"30,31"}],"2to3":[{partition:1,sentence_ids:"32,33,34,35,36"},{partition:2,sentence_ids:"37,38,39,40"},{partition:3,sentence_ids:"41,42,43,44,45,46,47,48"}],"3to4":[{partition:1,sentence_ids:"49,50,51,52"},{partition:2,sentence_ids:"53,54,55"},{partition:3,sentence_ids:"56,57,58,59,60"},{partition:4,sentence_ids:"61,62"},{partition:5,sentence_ids:"63,64,65,66"},{partition:6,sentence_ids:"67,68,69,70"},{partition:7,sentence_ids:"71,72,73,74,75"}]},
    lantern: {"1to2":[{partition:1,sentence_ids:"1,2,3"},{partition:2,sentence_ids:"4,5,6"},{partition:3,sentence_ids:"7,8,9,10,11"}],"2to3":[{partition:1,sentence_ids:"12,13"},{partition:2,sentence_ids:"14,15,16"},{partition:3,sentence_ids:"17,18,19,20,21"}],"3to4":[{partition:1,sentence_ids:"22,23,24"},{partition:2,sentence_ids:"25,26,27"},{partition:3,sentence_ids:"28,29"},{partition:4,sentence_ids:"30,31,32"},{partition:5,sentence_ids:"33,34,35"},{partition:6,sentence_ids:"36,37"},{partition:7,sentence_ids:"38,39"},{partition:8,sentence_ids:"40,41,42"},{partition:9,sentence_ids:"43,44,45,46"},{partition:10,sentence_ids:"47,48,49"},{partition:11,sentence_ids:"50,51,52,53"},{partition:12,sentence_ids:"54,55,56,57,58"},{partition:13,sentence_ids:"59,60,61,62,63,64"},{partition:14,sentence_ids:"65,66,67,68,69,70,71"},{partition:15,sentence_ids:"72,73,74"},{partition:16,sentence_ids:"75,76,77,78,79"},{partition:17,sentence_ids:"80,81,82,83,84"},{partition:18,sentence_ids:"85,86,87,88,89"}]}
};

// ============================================================================
// INLINE CSS STYLES (for Cognition compatibility)
// ============================================================================

const INLINE_STYLES = `
<style>
body { background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
.story-container { max-width: 800px; margin: 0 auto; padding: 40px; background-color: black; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); line-height: 1.8; font-size: 18px; text-align: left; }
.story-title { font-size: 28px; font-weight: bold; margin-bottom: 30px; text-align: center; color: white; }
.story-text { color: #444; margin-bottom: 30px; }
.story-text .sentence { transition: color 0.3s ease; }
.story-text .sentence.highlighted { color: white; }
.story-text .sentence.dimmed { color: #131313; }
.progress-text { position: fixed; top: 20px; right: 20px; background-color: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-size: 14px; color: #666; z-index: 1000; }
.music-indicator { position: fixed; bottom: 20px; left: 20px; background-color: rgba(76, 175, 80, 0.9); color: white; padding: 8px 15px; border-radius: 20px; font-size: 13px; display: none; z-index: 1000; }
.music-indicator.playing { display: block; }
.loading-screen { text-align: center; padding: 60px 20px; }
.loading-spinner { border: 4px solid #f3f3f3; border-top: 4px solid #4CAF50; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
`;

// ============================================================================
// GLOBAL VARIABLES
// ============================================================================

let currentAudio = null;
let previousAudio = null;
let fadeIntervals = [];
let allActiveAudio = [];

// Capture Prolific URL parameters
const urlParams = new URLSearchParams(window.location.search);
const prolificPID = urlParams.get('PROLIFIC_PID') || 'test_participant';
const studyID = urlParams.get('STUDY_ID') || 'test_study';
const sessionID = urlParams.get('SESSION_ID') || 'test_session';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function buildSentenceToClusterMap(midiMapping, idOffset, totalSentences) {
    const sentenceToCluster = new Map();
    const clusterKeyToNumber = { '1to2': 1, '2to3': 2, '3to4': 3 };
    
    Object.keys(midiMapping).forEach(clusterKey => {
        const clusterNumber = clusterKeyToNumber[clusterKey];
        const partitions = midiMapping[clusterKey];
        partitions.forEach(partition => {
            const rawIds = partition.sentence_ids.split(',').map(id => parseInt(id.trim()));
            const adjustedIds = rawIds.map(id => id - idOffset);
            adjustedIds.forEach(sentenceId => {
                sentenceToCluster.set(sentenceId, clusterNumber);
            });
        });
    });
    
    for (let i = 0; i < totalSentences; i++) {
        if (!sentenceToCluster.has(i)) {
            sentenceToCluster.set(i, 4);
        }
    }
    return sentenceToCluster;
}

// ============================================================================
// AUDIO FUNCTIONS
// ============================================================================

async function playStoryMusic(mp3Path) {
    try {
        console.log('Playing MP3:', mp3Path);
        
        fadeIntervals.forEach(interval => clearInterval(interval));
        fadeIntervals = [];
        
        allActiveAudio.forEach(audio => {
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                audio.volume = 0;
            }
        });
        allActiveAudio = [];
        
        if (currentAudio && !currentAudio.paused) {
            previousAudio = currentAudio;
        } else {
            previousAudio = null;
        }
        
        const newAudio = new Audio(mp3Path);
        newAudio.loop = true;
        newAudio.volume = 0;
        
        return new Promise((resolve, reject) => {
            newAudio.addEventListener('canplaythrough', () => {
                newAudio.play()
                    .then(() => {
                        currentAudio = newAudio;
                        allActiveAudio.push(newAudio);
                        
                        if (previousAudio) {
                            crossfade(previousAudio, newAudio);
                        } else {
                            fadeIn(newAudio);
                        }
                        
                        const indicator = document.getElementById('music-indicator');
                        if (indicator) indicator.classList.add('playing');
                        resolve();
                    })
                    .catch(reject);
            }, { once: true });
            
            newAudio.addEventListener('error', reject);
            newAudio.load();
        });
    } catch (error) {
        console.error('Error playing music:', error);
    }
}

function crossfade(oldAudio, newAudio) {
    const fadeOutDuration = CONFIG.music.fadeOutDuration || 1000;
    const fadeInDuration = CONFIG.music.fadeInDuration || 1000;
    const targetVolume = CONFIG.music.volume || 0.3;
    const steps = 50;
    
    let fadeOutCount = 0;
    let fadeInCount = 0;
    
    const fadeOutTimer = setInterval(() => {
        fadeOutCount++;
        if (oldAudio && !oldAudio.paused) {
            oldAudio.volume = Math.max(0, oldAudio.volume - (oldAudio.volume / steps));
        }
        if (fadeOutCount >= steps || !oldAudio) {
            clearInterval(fadeOutTimer);
            if (oldAudio) {
                oldAudio.pause();
                oldAudio.currentTime = 0;
            }
            previousAudio = null;
        }
    }, fadeOutDuration / steps);
    
    const fadeInTimer = setInterval(() => {
        fadeInCount++;
        if (newAudio && !newAudio.paused) {
            newAudio.volume = Math.min(targetVolume, newAudio.volume + (targetVolume / steps));
        }
        if (fadeInCount >= steps || !newAudio) {
            clearInterval(fadeInTimer);
            if (newAudio) newAudio.volume = targetVolume;
        }
    }, fadeInDuration / steps);
    
    fadeIntervals.push(fadeOutTimer, fadeInTimer);
}

function fadeIn(audio) {
    const fadeInDuration = CONFIG.music.fadeInDuration || 1000;
    const targetVolume = CONFIG.music.volume || 0.3;
    const steps = 50;
    let fadeInCount = 0;
    
    const fadeInTimer = setInterval(() => {
        fadeInCount++;
        if (audio && !audio.paused) {
            audio.volume = Math.min(targetVolume, audio.volume + (targetVolume / steps));
        }
        if (fadeInCount >= steps || !audio) {
            clearInterval(fadeInTimer);
            if (audio) audio.volume = targetVolume;
        }
    }, fadeInDuration / steps);
    
    fadeIntervals.push(fadeInTimer);
}

function stopMusic() {
    fadeIntervals.forEach(interval => clearInterval(interval));
    fadeIntervals = [];
    
    allActiveAudio.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
        }
    });
    allActiveAudio = [];
    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    
    if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
        previousAudio = null;
    }
    
    const indicator = document.getElementById('music-indicator');
    if (indicator) indicator.classList.remove('playing');
}

// ============================================================================
// TRIAL CREATION FUNCTIONS
// ============================================================================

function createStoryTrial(story, storyNumber, totalStories, jsPsych) {
    const clusterKeys = Object.keys(story.midiMapping);
    const csvStartId = story.sentences[0].id;
    const firstMidiPartition = story.midiMapping[clusterKeys[0]][0];
    const firstMidiId = parseInt(firstMidiPartition.sentence_ids.split(',')[0].trim());
    const idOffset = firstMidiId - csvStartId;
    
    const coveredSentenceIds = new Set();
    clusterKeys.forEach(clusterKey => {
        story.midiMapping[clusterKey].forEach(partition => {
            const ids = partition.sentence_ids.split(',').map(id => parseInt(id.trim()) - idOffset);
            ids.forEach(id => coveredSentenceIds.add(id));
        });
    });
    
    const uncoveredSentences = story.sentences.filter(s => !coveredSentenceIds.has(s.id));
    const additionalPartitions = [];
    for (let i = 0; i < uncoveredSentences.length; i += 2) {
        const group = uncoveredSentences.slice(i, i + (uncoveredSentences.length - i === 3 && i + 2 === uncoveredSentences.length - 1 ? 3 : 2));
        additionalPartitions.push({ sentence_ids: group.map(s => s.id).join(','), is_additional: true });
    }
    
    const sentenceToClusterMap = buildSentenceToClusterMap(story.midiMapping, idOffset, story.sentences.length);
    
    let currentClusterIndex = 0;
    let currentPartitionIndex = 0;
    let isComplete = false;
    let inAdditionalPartitions = false;
    let additionalPartitionIndex = 0;
    let currentPlayingClusterRef = { value: null };
    
    return {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            const progressText = CONFIG.experiment.showProgressIndicator ? 
                `<div class="progress-text">Story ${storyNumber} of ${totalStories}</div>` : '';
            const musicIndicatorHTML = CONFIG.experiment.showMusicIndicator ? 
                `<div class="music-indicator playing" id="music-indicator">♫ Music playing</div>` : '';
            
            const sentencesHTML = story.sentences.map(sentence => 
                `<span class="sentence dimmed" data-sentence-id="${sentence.id}">${sentence.text} </span>`
            ).join('');
            
            return `
                ${INLINE_STYLES}
                ${progressText}
                ${musicIndicatorHTML}
                <div class="story-container">
                    <div class="story-title">${story.title}</div>
                    <div class="story-text" id="story-text">${sentencesHTML}</div>
                    <div id="instruction-text" style="text-align: center; margin-top: 20px; color: #999; font-size: 14px;">
                        Press SPACE or → to continue
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <button id="continue-btn" class="jspsych-btn" style="display: none;">
                            Continue to Questions
                        </button>
                    </div>
                </div>
            `;
        },
        choices: ['ArrowRight', ' '],
        on_load: function() {
            // Start music based on condition
            if (story.musicCondition === 'averaged-music') {
                const clusterAvgPath = `audio/${story.midiDirName}_cluster_avg.mp3`;
                playStoryMusic(clusterAvgPath);
            } else if (story.musicCondition === 'cross-faded-clusters') {
                const firstPartition = story.midiMapping[clusterKeys[0]][0];
                const firstSentenceId = parseInt(firstPartition.sentence_ids.split(',')[0].trim()) - idOffset;
                const firstCluster = sentenceToClusterMap.get(firstSentenceId);
                currentPlayingClusterRef.value = firstCluster;
                const clusterPath = `audio/${story.midiDirName}_cluster_${firstCluster}.mp3`;
                playStoryMusic(clusterPath);
            }
            
            updateHighlighting(story, clusterKeys, currentClusterIndex, currentPartitionIndex, idOffset, false, null, sentenceToClusterMap, currentPlayingClusterRef);
            
            const handleKeyPress = function(e) {
                if ((e.key === 'ArrowRight' || e.key === ' ') && !isComplete) {
                    e.preventDefault();
                    
                    if (!inAdditionalPartitions) {
                        const currentCluster = story.midiMapping[clusterKeys[currentClusterIndex]];
                        currentPartitionIndex++;
                        
                        if (currentPartitionIndex >= currentCluster.length) {
                            currentClusterIndex++;
                            currentPartitionIndex = 0;
                            
                            if (currentClusterIndex >= clusterKeys.length) {
                                if (additionalPartitions.length > 0) {
                                    inAdditionalPartitions = true;
                                    additionalPartitionIndex = 0;
                                    
                                    if (story.musicCondition === 'regular') {
                                        const cluster4Path = `audio/${story.midiDirName}_cluster_4.mp3`;
                                        playStoryMusic(cluster4Path);
                                    }
                                    
                                    updateHighlighting(story, clusterKeys, 0, 0, idOffset, true, additionalPartitions[0], sentenceToClusterMap, currentPlayingClusterRef);
                                    return;
                                } else {
                                    isComplete = true;
                                    document.getElementById('continue-btn').style.display = 'inline-block';
                                    document.getElementById('instruction-text').style.display = 'none';
                                    document.removeEventListener('keydown', handleKeyPress);
                                    return;
                                }
                            }
                        }
                        
                        updateHighlighting(story, clusterKeys, currentClusterIndex, currentPartitionIndex, idOffset, false, null, sentenceToClusterMap, currentPlayingClusterRef);
                    } else {
                        additionalPartitionIndex++;
                        
                        if (additionalPartitionIndex >= additionalPartitions.length) {
                            isComplete = true;
                            document.getElementById('continue-btn').style.display = 'inline-block';
                            document.getElementById('instruction-text').style.display = 'none';
                            document.removeEventListener('keydown', handleKeyPress);
                            return;
                        }
                        
                        updateHighlighting(story, clusterKeys, 0, 0, idOffset, true, additionalPartitions[additionalPartitionIndex], sentenceToClusterMap, currentPlayingClusterRef);
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyPress);
            
            const continueBtn = document.getElementById('continue-btn');
            if (continueBtn) {
                continueBtn.addEventListener('click', function() {
                    stopMusic();
                    document.removeEventListener('keydown', handleKeyPress);
                    jsPsych.finishTrial({
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

function updateHighlighting(story, clusterKeys, clusterIndex, partitionIndex, idOffset, isAdditional, additionalPartition, sentenceToClusterMap, currentPlayingClusterRef) {
    let sentenceIdsToHighlight;
    
    if (isAdditional) {
        sentenceIdsToHighlight = additionalPartition.sentence_ids.split(',').map(id => parseInt(id.trim()));
    } else {
        const clusterKey = clusterKeys[clusterIndex];
        const partition = story.midiMapping[clusterKey][partitionIndex];
        const rawIds = partition.sentence_ids.split(',').map(id => parseInt(id.trim()));
        sentenceIdsToHighlight = rawIds.map(id => id - idOffset);
    }
    
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
    
    // Play music based on condition
    if (story.musicCondition === 'averaged-music') {
        // Keep cluster_avg.mp3 playing
    } else if (story.musicCondition === 'cross-faded-clusters') {
        const newCluster = sentenceToClusterMap.get(sentenceIdsToHighlight[0]);
        if (newCluster !== currentPlayingClusterRef.value) {
            const clusterPath = `audio/${story.midiDirName}_cluster_${newCluster}.mp3`;
            playStoryMusic(clusterPath);
            currentPlayingClusterRef.value = newCluster;
        }
    } else if (!isAdditional) {
        // Regular condition
        const clusterKey = clusterKeys[clusterIndex];
        
        if (story.id === 'starling_five' && clusterKey === '3to4') {
            if (currentPlayingClusterRef.value !== 'starling_cluster3') {
                const clusterPath = `audio/${story.midiDirName}_cluster_3.mp3`;
                playStoryMusic(clusterPath);
                currentPlayingClusterRef.value = 'starling_cluster3';
            }
        } else {
            const mp3Path = `audio/${story.midiDirName}_${clusterKey}_partition${partitionIndex + 1}.mp3`;
            playStoryMusic(mp3Path);
            if (currentPlayingClusterRef.value === 'starling_cluster3') {
                currentPlayingClusterRef.value = null;
            }
        }
    }
}

function createQuestionTrials(story, storyNumber) {
    const questions = story.questions.map((q, idx) => ({
        prompt: `<strong>Question ${idx + 1}:</strong> ${q.question}`,
        name: `q${q.id}`,
        options: Object.values(q.options),
        required: true
    }));
    
    return {
        type: jsPsychSurveyMultiChoice,
        preamble: `
            <div style="max-width: 800px; margin: 0 auto;">
                <h2 style="text-align: center;">Comprehension Questions: ${story.title}</h2>
                <p style="text-align: center; color: #666;">Please answer the following questions about the story you just read.</p>
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
            const responses = data.response;
            let correct = 0;
            story.questions.forEach((q) => {
                const userAnswer = responses[`q${q.id}`];
                const correctOption = Object.entries(q.options).find(([key]) => key === q.correct_answer)[1];
                if (userAnswer === correctOption) correct++;
            });
            data.accuracy = correct / story.questions.length;
            data.num_correct = correct;
            data.num_questions = story.questions.length;
        }
    };
}

function createRatingQuestions(story, storyNumber) {
    const likertQuestions = [
        { prompt: "How well did the music match the text?", name: "music_match", labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Extremely well"], required: true },
        { prompt: "How much did you enjoy reading the text?", name: "text_enjoyment", labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Extremely"], required: true },
        { prompt: "How distracting did you find the music?", name: "music_distraction", labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Extremely"], required: true },
        { prompt: "How engaged were you with the story?", name: "story_engagement", labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very engaged"], required: true }
    ];
    
    return {
        timeline: [
            {
                type: jsPsychSurveyLikert,
                preamble: `<div style="max-width: 800px; margin: 0 auto;"><h2 style="text-align: center;">Experience Questions: ${story.title}</h2><p style="text-align: center; color: #666;">Please rate your experience with this story on a scale from 1 to 7.</p></div>`,
                questions: likertQuestions,
                button_label: 'Continue',
                data: { task: 'rating_questions_likert', story_id: story.id, story_title: story.title, story_number: storyNumber, music_condition: story.musicCondition },
                on_finish: function(data) {
                    Object.keys(data.response).forEach(key => { data.response[key] = data.response[key] + 1; });
                }
            },
            {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div style="max-width: 800px; margin: 0 auto;"><h2 style="text-align: center;">Volume Check: ${story.title}</h2></div>`,
                questions: [{ prompt: "Did you mute your volume during this reading task?", name: "volume_muted", options: ["Yes", "No"], required: true }],
                button_label: 'Continue',
                data: { task: 'rating_questions_volume', story_id: story.id, story_title: story.title, story_number: storyNumber, music_condition: story.musicCondition }
            }
        ]
    };
}

// ============================================================================
// MAIN EXPERIMENT
// ============================================================================

// Initialize jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        jsPsych.data.addProperties({
            prolific_pid: prolificPID,
            study_id: studyID,
            session_id: sessionID
        });
        
        // Display results (Cognition will also save data automatically)
        const data = jsPsych.data.get();
        const questionTrials = data.filter({task: 'comprehension_questions'});
        let totalCorrect = 0, totalQuestions = 0;
        
        questionTrials.values().forEach(trial => {
            totalCorrect += trial.num_correct;
            totalQuestions += trial.num_questions;
        });
        
        const overallAccuracy = totalQuestions > 0 ? ((totalCorrect / totalQuestions) * 100).toFixed(1) : 0;
        
        document.body.innerHTML = `
            <div style="max-width: 800px; margin: 50px auto; padding: 30px; background: white; border-radius: 8px; text-align: center;">
                <h1>Thank You!</h1>
                <h2 style="color: #4CAF50;">Overall Accuracy: ${overallAccuracy}%</h2>
                <p>${totalCorrect} correct out of ${totalQuestions} questions</p>
                <p style="margin-top: 30px;">Your data has been saved. You may now close this window.</p>
                <button onclick="window.location.href='https://app.prolific.com/submissions/complete?cc=C556U7OY'" class="jspsych-btn" style="margin-top: 20px; background-color: #4CAF50;">
                    Complete Study (Return to Prolific)
                </button>
            </div>
        `;
    }
});

// Build story data from embedded data
function loadStoryData() {
    return CONFIG.stories.map(storyConfig => ({
        id: storyConfig.id,
        title: storyConfig.title,
        sentences: STORY_SENTENCES[storyConfig.id],
        questions: STORY_QUESTIONS[storyConfig.id],
        midiMapping: MIDI_MAPPINGS[storyConfig.id],
        midiDirName: storyConfig.midiDirName
    }));
}

// Create timeline
function createTimeline() {
    const timeline = [];
    const storiesData = loadStoryData();
    
    // Welcome screen
    const numStories = 3;
    const estimatedTime = '15-20 minutes';
    
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
                    <li><em>Please do not mute your volume during the experiment</em></li>
                </ul>
            </div>`,
            `<div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <h2>Ready to Begin?</h2>
                <p>Click "Next" to start the experiment.</p>
                <p style="margin-top: 40px; color: #666; font-size: 14px;">The stories will be presented in a random order.</p>
            </div>`
        ],
        show_clickable_nav: true,
        button_label_next: 'Next',
        button_label_previous: 'Back'
    });
    
    // Determine stories and conditions
    let storiesToUse;
    
    if (CONFIG.experiment.demo) {
        const demoStoryIds = ['carnival_packed_away', 'starling_five', 'lantern'];
        const demoConditions = { 'carnival_packed_away': 'regular', 'starling_five': 'cross-faded-clusters', 'lantern': 'averaged-music' };
        storiesToUse = demoStoryIds.map(id => storiesData.find(s => s.id === id)).filter(Boolean);
        storiesToUse.forEach(story => { story.musicCondition = demoConditions[story.id]; });
    } else {
        const normalStoryIds = ['carnival_packed_away', 'starling_five', 'window_blue_curtain'];
        const selectedStories = normalStoryIds.map(id => storiesData.find(s => s.id === id)).filter(Boolean);
        storiesToUse = shuffleArray(selectedStories);
        const conditions = shuffleArray(['regular', 'averaged-music', 'cross-faded-clusters']);
        storiesToUse.forEach((story, index) => { story.musicCondition = conditions[index]; });
    }
    
    // Add story blocks
    storiesToUse.forEach((story, index) => {
        timeline.push(createStoryTrial(story, index + 1, storiesToUse.length, jsPsych));
        timeline.push(createQuestionTrials(story, index + 1));
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

// Run the experiment
jsPsych.run(createTimeline());

