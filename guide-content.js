/* ============================================================================
   CRC MOH OS — GUIDE CONTENT  (guide-content.js)

   The guide used to be pure bullet points, which read like a checklist rather
   than a manual. Each chapter now has an `overview` paragraph and sections
   with real explanatory prose, with bullets used only where a list genuinely
   is the clearest form (times, item lists, sequences).

   SOURCES
   - Usher chapters: taken from the "Usher Guide" (Stages 1-6). Authoritative.
   - Hostess chapters: taken from the "MOH Potch Hostess Guide" (Stages 1-6).
     Authoritative.
   ==========================================================================*/

const GUIDE_USHER = [
  {
    title: "Attire & Presentation",
    category: "Standards",
    tags: ["attire", "uniform", "presentation"],
    overview:
      "How you present yourself is the first thing a visitor notices, often before you say a word. The usher standard is deliberately plain: all black with a white formal shirt. The point is not fashion but uniformity \u2014 when the whole team looks the same, a newcomer can spot who to ask for help from across a full auditorium. Anything that draws attention to one usher works against that.",
    sections: [
      {
        heading: "The uniform",
        prose:
          "Black formal pants with a white formal shirt. Footwear is black formal shoes or fully black tekkies \u2014 either is acceptable, but open-toed shoes are not, at any time. You will be on your feet for hours, moving between parking and auditorium, and open shoes are both a presentation and a safety problem. Jackets must be black unless it is an official MOH jacket, which may be worn as issued.",
      },
      {
        heading: "Hair and jewellery",
        prose:
          "Hair must be kept out of your face, whether that means tied down, tied up or cut. This matters practically as much as visually: you spend the service scanning a congregation, and hair across your eyes means you miss things. Bright colours \u2014 green, blue, purple, white \u2014 are not permitted. Earrings should be small and not brightly coloured.",
      },
      {
        heading: "Why the red stands out",
        prose:
          "Ministry of Helps red is highly visible by design. That visibility cuts both ways: it means people can always find you, and it means every posture you hold and every conversation you have is on display. Be conscious of the message you are sending, especially during sensitive moments in the service.",
      },
    ],
  },

  {
    title: "Groups & Serving Times",
    category: "Standards",
    tags: ["groups", "times", "arrival", "pre-prayer"],
    overview:
      "The serving day runs on a fixed timeline and every step exists so the next one is possible. You are assigned to a group either on arrival or the week before, and your group leader is your first point of instruction \u2014 they tell you whether you are inside or outside for that service, and what needs doing.",
    sections: [
      {
        heading: "The AM timeline",
        prose:
          "Arrival is 06:00. That gives an hour to prepare and begin set-up before MOH pre-prayer at 07:00. After pre-prayer you finish your remaining set-up duties, because everything must be complete before the church's own pre-prayer at 07:45. Service starts at 08:30 in Summer and 09:00 in Winter.",
        points: [
          "06:00 \u2014 arrival, begin preparation and set-up",
          "07:00 \u2014 MOH pre-prayer",
          "07:45 \u2014 church pre-prayer (all set-up complete)",
          "08:30 Summer / 09:00 Winter \u2014 service begins",
        ],
      },
      {
        heading: "The PM timeline",
        prose:
          "The same shape, shifted later. Arrival 15:30, MOH pre-prayer 16:00, church pre-prayer 17:30, service 18:00. Set down follows immediately after each service.",
        points: [
          "15:30 \u2014 arrival",
          "16:00 \u2014 MOH pre-prayer",
          "17:30 \u2014 church pre-prayer",
          "18:00 \u2014 service begins",
        ],
      },
      {
        heading: "Being in position",
        prose:
          "All inside ushers must be inside five to ten minutes before the church's pre-prayer. Not at the time \u2014 before it. People begin arriving during pre-prayer, and an usher walking to their post while visitors are already seating themselves has effectively missed the start.",
      },
    ],
  },

  {
    title: "Storeroom & Equipment",
    category: "Equipment",
    tags: ["storeroom", "cleaning", "mops", "brooms", "equipment"],
    overview:
      "Equipment is how the team cares for the building, and it is shared. The rule underneath every specific instruction is simple: handle it with care, and return it to exactly where you found it. An usher who cannot find a mop head because the last person left it in a bucket has lost ten minutes of a tight morning.",
    sections: [
      {
        heading: "Cleaning products",
        prose:
          "Three products live in the main storeroom, all in labelled spray bottles. Windowlen is the blue liquid, used on glass and mirrors. Surface cleaner is a green liquid, used on counters, handrails, toilets and anything that is neither glass nor floor. Floor cleaner is also green \u2014 which is exactly why you read the label rather than trusting the colour. Floor cleaner is never sprayed directly onto a surface; a few sprays go into a bucket of water and it is applied with the mops.",
      },
      {
        heading: "Cloths and mops",
        prose:
          "Red lappies are stored under the shelf holding the three products, and are used for everything except floors \u2014 surfaces, windows and bathroom mirrors. For glass, use a clean lappie, not one already used on a counter. There are two mop heads and they work as a pair: the white stringy noodle head mops, and the blue rectangular flat head dries behind it. Mop, then dry. The stems hang on the walls, and any usher can show you how the heads attach. Big yellow and small black buckets are used for both.",
      },
      {
        heading: "Scoppies and brooms",
        prose:
          "Scoppies are in a clear box underneath the counter. Brooms are strictly separated by bristle: soft-bristle inside brooms live on the right back wall of the storeroom and are used only inside; hard-bristle outside brooms are kept behind the downstairs bathrooms and are used only outside. Keeping them apart keeps grit from the parking area out of the auditorium. For a large mess, a broom is more effective than a scoppie \u2014 use one on the auditorium stairs and in the foyer.",
      },
      {
        heading: "Bathroom storerooms",
        prose:
          "There are two, one upstairs and one downstairs, each beside its bathrooms. Bathrooms are cleaned only with the products and equipment kept in those storerooms \u2014 this is a hygiene separation, not a convenience one. Buckets still come from the main storeroom. Each of the male and female bathrooms has its own carrier holding Windowlen for the mirrors, surface cleaner, floor cleaner, plastic bags, the toilet paper holder key and gloves.",
      },
      {
        heading: "Putting equipment away",
        prose:
          "Return everything to the storeroom unless your leader says otherwise. Both mop heads must be washed thoroughly after use and hung up behind the downstairs bathrooms to dry. A mop head left damp in a bucket is unusable by the next service.",
      },
    ],
  },

  {
    title: "Set Up & Leadership Structure",
    category: "Operations",
    tags: ["set-up", "leadership", "duties"],
    overview:
      "Set-up is the work that makes the service possible, and all of it must be finished before the church's pre-prayer. Check the duties list for your area; you will be guided through it rather than left to guess.",
    sections: [
      {
        heading: "Working through set-up",
        prose:
          "Match the product to the surface: lappie and Windowlen for glass, lappie and surface cleaner for counters, handrails and toilets, floor cleaner diluted in water for floors. Always place a wet floor sign while mopping \u2014 the foyer fills with people who are looking at each other rather than at the ground.",
      },
      {
        heading: "Who your leaders are",
        prose:
          "Your group leader is your main leader and your first point of instruction. Above them sit the area leaders, then the service leader, then the ministry leaders, then Pastor Pieter. Check the leadership structure so you know exactly who yours are.",
      },
      {
        heading: "Leaders across services",
        prose:
          "AM and PM have different leaders, but a leader from the other service is still a leader. If someone from the PM team gives you an instruction on an AM Sunday, respect it. The structure is one ministry, not two.",
      },
    ],
  },

  {
    title: "Outside \u2014 Parking, Weather & Comms",
    category: "Operations",
    tags: ["parking", "walkie-talkie", "weather", "umbrellas"],
    overview:
      "Parking is the first contact most people have with the church on a Sunday, and it is a large team effort rather than a set of individual posts. You guide people into their allotted spaces, and you do it with a smile \u2014 someone visiting for the first time reads your face before they read any signage. Your leader briefs you on how the rest of the area fills, and there is a map to work from.",
    sections: [
      {
        heading: "Bays that need attention",
        prose:
          "There is dedicated, signposted parking for the elderly, for parents with children and for disabled visitors, directly behind the church near the entrance doors. These are the bays where ushers add the most value: help a parent get a pram out, give an elderly person an arm across the tarmac. There is also a pastors' parking area so pastors and their staff can reach their offices easily, and a Bolt and Uber drop-off zone where arriving visitors should be assisted in. The bus arrives too; its drivers already know where to park.",
      },
      {
        heading: "Walkie-talkies",
        prose:
          "Walkie-talkies exist because the property is larger than a shout. Use them to pass on that an elderly visitor, a student or a group is heading in a particular direction, so the next usher is ready rather than surprised. Two habits matter at the end: turn the unit off, and return it to charge. A flat radio next week is a radio nobody can use.",
      },
      {
        heading: "Outside equipment",
        prose:
          "Outside brooms hang on the wall of the amphi stairs by the basement outside, and only outside equipment is used outside. Mops kept there are used for the outside areas.",
      },
      {
        heading: "Rain",
        prose:
          "When it rains, take umbrellas from the storeroom and walk people in rather than letting them run. Keep track of every umbrella you take out and every one you hand over. Umbrellas disappear easily, and the team needs them again the following week.",
      },
    ],
  },

  {
    title: "Inside \u2014 Doors, Catching & Offering",
    category: "Operations",
    tags: ["doors", "catching", "offering", "altar-call", "communion"],
    overview:
      "Inside the auditorium, almost every rule traces back to one idea: remove obstacles without becoming one yourself. Light, noise and movement all pull attention away from what is happening on the stage, and the usher's job is to manage them so that nobody notices they were managed.",
    sections: [
      {
        heading: "How the doors work",
        prose:
          "Doors are mainly handled by the hostesses, but you must know the pattern. Before the service and immediately after pre-prayer, both double doors either side of the middle door are opened. Be gentle with them \u2014 they open one way, and holding one open lets the other hold itself open. During pre-prayer and the service they stay closed and are opened only as somebody passes through.",
      },
      {
        heading: "One door at a time",
        prose:
          "This is the part that takes practice. Work with the usher on the inside door so only one door is open at any moment. If the outside door is open, close the inside door until the person is through, then close the outside door and open the inside one for them. The reason is glare: an open pair of doors throws daylight straight into the faces of the people on stage and the pastor while he preaches. The middle door is not opened during the service for any reason unless a leader states an exception.",
      },
      {
        heading: "After the service, and at Praise Party",
        prose:
          "Once the service ends, open the doors wide including the middle door, because the traffic is heavy and a bottleneck at the exit is its own problem. Praise Party, usually the PM service, is the exception: doors are not opened fully and the middle door stays closed even with a large crowd leaving. Operate them as you would during a service.",
      },
      {
        heading: "How to catch someone",
        prose:
          "This is important enough to ask a leader for a visual demonstration rather than learn from text. Stand behind the person. Ball up your fists but keep your arms open. As they fall back, catch them and lower them gently to the floor. Lay women on their side, in case they are pregnant. The reason for the balled fists is specific: open hands risk accidental contact with the chest area, particularly with women, and the closed fist removes that risk entirely.",
      },
      {
        heading: "Posture during prayer and worship",
        prose:
          "When the congregation prays, your eyes stay open and on the people \u2014 that is the job. We are the Ministry of Helps, and you cannot help what you cannot see. At the same time we stand in agreement with what is being said: ushers and hostesses stand and clap when the pastor speaks, and we do not stand still through praise and worship. Be mindful during prayer. During worship keep the aisles clear, because a blocked aisle stops both the media team and us from moving.",
      },
      {
        heading: "Pre-prayer and people on the floor",
        prose:
          "During pre-prayer it is fine for people to pace, but keep watch over them. If someone is on the floor and at risk of being stepped on, stand above them with them between your legs \u2014 you become the barrier. A red lappie laid nearby makes them visible to people who are not looking down. Keep an eye out for glasses. You may pray during pre-prayer, but do not get caught in the spirit: you will most likely still be seating people. Throughout, be careful not to take someone out of the move of the Holy Spirit.",
      },
      {
        heading: "Altar call",
        prose:
          "Keep your head down and wait for the pastor's countdown, then stand and track who raises their hand. Once people begin going forward, give those who stayed a few seconds, then approach gently and ask whether they would like to go to the front. This is a highly sensitive moment for the person in front of you. Be kind; do not press.",
      },
      {
        heading: "Tithe, offering and communion",
        prose:
          "Tithe and offering usually follows the altar call, and the pastor cues the start. As a white shirt in training you sit and observe. Otherwise, go to the back, collect a basket and work with your fellow ushers: one basket per row, handed in at one end and collected at the other to pass to the next row, starting from the back of the auditorium and working down to the second row from the front. Nobody outside the MOH and security may handle a basket. You are handling what people are sowing into the kingdom, so do not allow anyone to take one \u2014 doors are sometimes locked during this time purely to make theft harder. Holy communion is distributed the same way, back to front, row by row.",
      },
    ],
  },

  {
    title: "Set Down, Discernment & Ministry Protocol",
    category: "Operations",
    tags: ["set-down", "protocol", "ministry", "discernment"],
    overview:
      "The service does not end when the preaching does. Set down is never neglected, and the way you carry yourself during ministry time matters as much as anything you did during set-up.",
    sections: [
      {
        heading: "Getting people out",
        prose:
          "Help the hostesses reduce congestion by guiding people through the doors. Besides the three main doors there are two more on the far right and far left; if you are posted near them, lead people that way rather than letting everyone funnel through the middle.",
      },
      {
        heading: "Set down",
        prose:
          "AM set down prepares the building for the PM service. PM set down cleans the church for the week. Both include returning all equipment to its correct place and taking out the bins, and your leader may add duties after the service. You do not need to clean as deeply as during set-up \u2014 this is a reset, not a second deep clean. If you have to leave during set down, tell your leader rather than slipping away.",
      },
      {
        heading: "Discernment",
        prose:
          "Things will not always go to plan, and the response is to stay in alignment with the Holy Spirit rather than to improvise anxiously. The MOH pre-prayer exists precisely so that you get to worship, pray and have your own encounter with God before you spend the service serving other people. There will be moments where you need to be on high alert. All of it is for His glory.",
      },
      {
        heading: "During ministry time",
        prose:
          "When hands are being laid on people, remember that we serve the people and not ourselves. If you get caught in the spirit, tell another usher or your leader so your area is covered \u2014 never leave a post unattended. Catch according to protocol. While people are being ministered to at the altar, keep watching the congregation, because they may be feeling the same move. Be sensitive to what is happening around you and work with the ushers and hostesses next to you.",
      },
      {
        heading: "When you get it wrong",
        prose:
          "You will make mistakes. Do not get worked up over one \u2014 carry on according to protocol, and it gets easier the more you do it. Remove any obstacle to the Holy Spirit working, but do not disrupt or draw attention to yourself or anyone else. We are a team, and relying on the person next to you is not a weakness.",
      },
    ],
  },
];

const GUIDE_HOSTESS = [
  {
    title: "Attire & Presentation",
    category: "Standards",
    tags: ["attire", "uniform", "hair", "earrings"],
    overview:
      "Hostess attire is all black, with the shirt marking where you are in your journey: black while in training, red once you have earned it. The red is what makes you findable in a full room, so it needs to be clean \u2014 no stains, no burn marks.",
    sections: [
      {
        heading: "Hostesses in training",
        prose:
          "Black formal pants, a black shirt and black formal shoes. No crop tops and no open-shoulder shirts, and no open-toed shoes at any time.",
      },
      {
        heading: "Hostesses with their red shirts",
        prose:
          "Black formal pants, the red shirt and black formal shoes. Check the shirt before you leave home: stains and burn marks are visible from across the auditorium and undo the point of a uniform.",
      },
      {
        heading: "Hair and earrings",
        prose:
          "Hair should not be a bright colour \u2014 no green, blue, purple or white \u2014 and should be kept out of your face, tied down or up. Earrings must be small, not brightly coloured, and never dangling.",
      },
    ],
  },
  {
    title: "Groups & Serving Times",
    category: "Standards",
    tags: ["groups", "times", "arrival", "pre-prayer"],
    overview:
      "We serve in excellency, and that now includes showing up on time. You are assigned to a group either on arrival or the week before, and your group leader guides you through the day and tells you whether you are inside or outside.",
    sections: [
      {
        heading: "The AM timeline",
        prose:
          "Arrival is 06:00, MOH pre-prayer 07:00, the church's pre-prayer 07:45, and the service begins 08:30 in Summer or 09:00 in Winter. After arriving you prepare and set up, then pre-pray, then finish set-ups before the church's pre-prayer.",
        points: [
          "06:00 \u2014 arrival, prepare and set up",
          "07:00 \u2014 MOH pre-prayer",
          "07:45 \u2014 church pre-prayer",
          "08:30 Summer / 09:00 Winter \u2014 service begins",
        ],
      },
      {
        heading: "The PM timeline",
        prose:
          "Arrival 15:30, MOH pre-prayer 16:00, church pre-prayer 17:30, service 18:00. Set down follows the end of each service.",
        points: [
          "15:30 \u2014 arrival",
          "16:00 \u2014 MOH pre-prayer",
          "17:30 \u2014 church pre-prayer",
          "18:00 \u2014 service begins",
        ],
      },
      {
        heading: "Being in position",
        prose:
          "All inside hostesses should be inside five to ten minutes before the church's pre-prayer \u2014 before it, not at it.",
      },
    ],
  },
  {
    title: "Storeroom & Equipment",
    category: "Equipment",
    tags: ["storeroom", "cleaning", "mops", "brooms"],
    overview:
      "Equipment is handled with care and respect \u2014 it is what we use to prepare the table for the services. Return everything where you found it, and look after it while it is in your hands.",
    sections: [
      {
        heading: "Cleaning products",
        prose:
          "Three labelled spray bottles live in the main storeroom. Windowlene is the blue liquid. Surface cleaner is green. Floor cleaner is also green \u2014 which is why you read the label rather than trusting the colour.",
      },
      {
        heading: "Lappies and mops",
        prose:
          "Red lappies sit under the shelf holding those three products, and are used on surfaces, windows and bathroom mirrors. The white stringy noodle mop head and the blue rectangular flat head work as a pair: noodle to mop, flat to dry. Stems hang on the walls and another hostess can show you how to attach the heads. Big yellow and small black buckets are used for mopping.",
      },
      {
        heading: "Scoppies and brooms",
        prose:
          "Scoppies are in a clear box under the counter. Inside brooms have soft bristles, live on the right back wall as you enter the storeroom, and are used only inside. Outside brooms have hard bristles, live behind the downstairs bathrooms, and are used only outside.",
      },
      {
        heading: "Bathroom storerooms",
        prose:
          "There are two, upstairs and downstairs, each beside its bathrooms. Bathrooms are cleaned only with the products and equipment kept there, though buckets still come from the main storeroom. The male and female bathrooms each have their own carrier: Windowlene for the mirrors, surface cleaner, floor cleaner, plastic bags, the toilet paper holder key and gloves.",
      },
    ],
  },
  {
    title: "Set Up & Leadership",
    category: "Operations",
    tags: ["set-up", "leadership", "duties"],
    overview:
      "All set-up duties are completed before the church's pre-prayer. Check the duties list for your area \u2014 you will be guided through it.",
    sections: [
      {
        heading: "Matching product to surface",
        prose:
          "Red lappies wipe everything except floors. Windows take a clean lappie with Windowlene. Counters, handrails, toilets and any non-glass, non-floor surface take a red lappie with surface cleaner. Floors take a few sprays of floor cleaner mixed into water, applied with the mops \u2014 and a wet floor sign every time.",
      },
      {
        heading: "Brooms over scoppies",
        prose:
          "For the auditorium stairs and the foyer, a broom is more effective than a scoppie on a big mess.",
      },
      {
        heading: "Putting equipment away",
        prose:
          "Everything returns to the storeroom unless your leader says otherwise. Wash both mop heads thoroughly after use and hang them behind the downstairs bathrooms.",
      },
      {
        heading: "Your leaders",
        prose:
          "Your group leader is your main leader. Above them are the area leaders, then the service leader, then the ministry leaders, then Pastor Pieter. AM and PM have different leaders, but a leader from the other service is still a leader and is respected as one.",
      },
    ],
  },
  {
    title: "Parents & Baby Room",
    category: "Operations",
    tags: ["baby-room", "parents", "children", "temperature"],
    overview:
      "This is the area that needs the most attentiveness. The parents in these rooms are raising their children in the church and are also trying to spend time in God's presence \u2014 both things at once. Your job is to make the second one possible.",
    sections: [
      {
        heading: "Safety first",
        prose:
          "Be wary of the cleaning products kept in the room: make sure children cannot reach them and are not playing with them. Do not let parents leave children alone in the room \u2014 tell them the child must go with them. And do not be on your phone in the mother's room.",
      },
      {
        heading: "At the door",
        prose:
          "As the service starts, be by the door to help parents coming in with their children. They will most likely need help with both the door and the pram.",
      },
      {
        heading: "Keeping the room right",
        prose:
          "Wipe down the changing station after every parent uses it. Remind parents that poo nappies cannot be changed in these rooms \u2014 they need the family rooms next to the upstairs bathrooms. Step out every thirty minutes or so and walk back in to check how the room smells; if it needs it, one or two sprays of air freshener is enough. Clean up spills and dragged mess as quickly as you can, using a scoppie where needed.",
      },
      {
        heading: "Lights and temperature",
        prose:
          "The controls sit outside the doors of the rooms. Dim the lights during pre-prayer and again a few minutes before the service, during the countdown \u2014 long press the light switch down to dim. If you are not sure, ask another hostess rather than guessing. The mother's room is kept at 22\u201323 degrees.",
      },
    ],
  },
  {
    title: "Outside \u2014 The Doors",
    category: "Operations",
    tags: ["doors", "glare", "praise-party"],
    overview:
      "Being outside means standing by the doors and holding them for people coming in and out. Almost every rule here traces back to one thing: light. An open door throws glare into the faces of the people on stage and the pastor while he preaches.",
    sections: [
      {
        heading: "Before the service and after pre-prayer",
        prose:
          "Both double doors either side of the middle door are opened \u2014 both doors of each pair. Be gentle: they open one way, and holding one open lets the other hold itself open.",
      },
      {
        heading: "During pre-prayer and the service",
        prose:
          "Doors stay closed and are opened only as somebody walks through. There will usually be another hostess on the inside door \u2014 work with her so that only one door is ever open. If the outside door is open, close the inside door after the person walks in, then close the outside door and open the inside one for them.",
      },
      {
        heading: "The middle door",
        prose:
          "It is opened only after the service, to let people out. It is not opened during the service for any reason unless a leader states otherwise.",
      },
      {
        heading: "After the service, and Praise Party",
        prose:
          "As soon as the service ends, open the doors wide including the middle door \u2014 the traffic is heavy. Praise Party, usually the PM service, is the exception: do not open the doors fully and keep the middle door closed even with a large crowd leaving. Work them as you would during the service.",
      },
    ],
  },
  {
    title: "Inside \u2014 Seating",
    category: "Operations",
    tags: ["seating", "blocks", "communication"],
    overview:
      "Seating has a specific order, and the order exists for reasons that only become obvious later in the service. The goal is to seat people next to each other without leaving big gaps.",
    sections: [
      {
        heading: "The fill order",
        prose:
          "Fill the middle block first, up to the camera box. Then the right and left blocks, until they are level with the middle. Then continue filling up to the second media box. Within each row, send people from the middle seats outward to the edges.",
      },
      {
        heading: "Why it is done this way",
        prose:
          "Two reasons. It makes tithe and offering go more smoothly for the ushers, who pass one basket per row. And it stops people from having to pass in front of others to reach their seats during praise and worship, which disturbs everyone in that row.",
      },
      {
        heading: "How to hold the line",
        prose:
          "Be stern and firm, but be kind. Some people will ignore you or walk off. Do not take it to heart \u2014 smile and keep it moving.",
      },
      {
        heading: "Talk to each other",
        prose:
          "This is the part people underestimate. Communicate constantly with the other hostesses: how many seats are left in a row, when to stop sending people in a given direction. Seating falls apart when two hostesses are each filling the same block.",
      },
    ],
  },
  {
    title: "Pre-prayer, Worship & Altar Call",
    category: "Operations",
    tags: ["pre-prayer", "lappies", "tissues", "altar-call"],
    overview:
      "When we pray, our eyes stay open and on the congregation. We are the Ministry of Helps, and we help the people in any way we can. We also keep the fire alive and stand in agreement with what is being said \u2014 ushers and hostesses stand and clap when the pastor speaks, and we do not stand still during praise and worship. The red we wear makes us stand out, so be conscious of the message you are sending.",
    sections: [
      {
        heading: "Pre-prayer",
        prose:
          "It is fine for people to pace up and down, but keep watch over them. Cover those who are exposed with lappies, and give those who are crying tissues \u2014 carefully. If someone is crying and you cannot hand them a tissue, place it near them so they find it when they are ready. Ask another hostess to show you how to throw a lappie over someone so that it does not fall off.",
      },
      {
        heading: "People on the floor",
        prose:
          "Cover anyone who has fallen. The red lappie does two jobs: it covers them, and it makes them visible so they are not stepped on. Stand by them if you can so they do not hurt themselves, and keep an eye out for people wearing glasses. You may pray during pre-prayer, but do not get caught in the spirit \u2014 you will most likely still be seating people.",
      },
      {
        heading: "Praise and worship",
        prose:
          "Make sure nobody is standing in the aisles; it makes movement harder for the media team and for us. The tissue and lappie procedure is the same as pre-prayer. In the area you were placed, keep your eyes on the congregation.",
      },
      {
        heading: "Altar call",
        prose:
          "Keep your head down and wait for the pastor's countdown, then stand and track who raises their hand. Once people have gone forward, give those who stayed a few seconds, then approach and ask whether they would like to go to the front. This is a highly sensitive moment. Be kind.",
      },
    ],
  },
  {
    title: "Set Down, Discernment & Protocol",
    category: "Operations",
    tags: ["set-down", "protocol", "ministry"],
    overview:
      "Set down should not be neglected. AM set down helps prepare for the PM service; PM set down cleans the church for the week.",
    sections: [
      {
        heading: "Getting people out",
        prose:
          "As people exit, work with the other hostesses to reduce congestion by guiding them through the doors. Besides the three main doors there are two more on the far right and far left \u2014 if you are near them, lead people that way.",
      },
      {
        heading: "What set down includes",
        prose:
          "Scooping the church, taking out the bins, packing the toys away in the mother's room, and whatever else your leader adds after the service. If you need to leave during set down, tell your leader.",
      },
      {
        heading: "Discernment",
        prose:
          "There will be times during the service when things do not go as planned, and the response is to stay in alignment with the Holy Spirit. The pre-prayer exists so that we also get to worship, pray and have our own encounter with God before the service. All of it is for His glory.",
      },
      {
        heading: "Ministry protocol",
        prose:
          "During ministry time, such as the laying on of hands, remember that we serve the people and not ourselves. If you get caught in the spirit, tell another hostess or your leader so someone covers your area \u2014 never leave it unattended. While people are being ministered to at the altar, keep watching the congregation; they may feel the same move. Be sensitive to your surroundings and always keep tissues and lappies on you.",
      },
      {
        heading: "When it goes wrong",
        prose:
          "Work with your fellow ushers and hostesses. It gets easier the more you do it, so do not get worked up over a single mistake \u2014 carry on. Remove any obstacle to the Holy Spirit working, but do not disrupt or draw attention to yourself or others. We are a team, and asking for help is not a weakness.",
      },
    ],
  },
  {
    title: "Hostess Service Structure",
    category: "Hostess Ops",
    tags: ["groups", "areas", "service"],
    overview:
      "Groups are split by service, and areas describe where a group works rather than who they permanently belong to. A group can be assigned to any area for a single service without anyone's home group changing.",
    sections: [
      {
        heading: "Groups",
        prose:
          "AM runs five hostess groups, AMH1 through AMH5. PM currently runs two, PMH1 and PMH2.",
      },
      {
        heading: "Areas",
        prose:
          "Six areas: Inside Group 1, 2 and 3, and Outside Group 1, 2 and 3. The AM White Tent connects to Outside Group 2, and the PM White Tent connects to Outside Group 3.",
      },
    ],
  },
];


/* ============================================================================
   USING THE APP — for anyone who is not sure how something works.
   Written for a volunteer, not a developer.
   ==========================================================================*/
const GUIDE_APP = [
  {
    title: "Signing in & passwords",
    category: "Account",
    tags: ["password", "login", "sign in", "reset", "forgot"],
    overview:
      "You sign in with your phone number and a password you chose when you registered \u2014 not with an email address.",
    sections: [
      {
        heading: "Signing in",
        prose:
          "Enter your phone number exactly as digits, and your password. If it says the details are wrong, check that you are using the same number you registered with.",
      },
      {
        heading: "I forgot my password",
        prose:
          "There is no automatic reset email, because the app signs you in by phone number rather than email. Message your group leader or a service leader and ask them to reset it. They can do it in a minute, and you will be given a temporary password to change once you are back in.",
      },
      {
        heading: "Changing your password",
        prose:
          "Open Profile from the menu or by tapping your picture, then Change Password. You will be asked for your current password first \u2014 that is deliberate, so nobody can change it on a phone you left unlocked.",
      },
      {
        heading: "Staying signed in",
        prose:
          "You stay signed in on your own phone until you sign out. Use Log out at the bottom of the menu if you are on a shared device.",
      },
    ],
  },
  {
    title: "Your profile",
    category: "Account",
    tags: ["profile", "photo", "group", "details", "edit"],
    overview:
      "Your profile holds who you are and where you serve. Keeping it right matters, because your leader's team list and the serving stats are built from it.",
    sections: [
      {
        heading: "Editing your details",
        prose:
          "Profile \u2192 Edit Profile. You can change your name, phone number, birthday, division, service and group. Changing your phone number also changes what you sign in with, so remember the new one.",
      },
      {
        heading: "Adding a photo",
        prose:
          "In Edit Profile, tap Choose photo. Square pictures work best and it must be under 2MB. Your photo shows on your leader's team list, which helps them recognise who is who.",
      },
      {
        heading: "Careful with division",
        prose:
          "Changing your division switches your Academy track, because ushers and hostesses train differently. Your progress on the old track is cleared, so only change it if you really have moved.",
      },
    ],
  },
  {
    title: "Answering the serving poll",
    category: "Serving",
    tags: ["poll", "serving", "availability", "sunday", "respond"],
    overview:
      "Every week you are asked whether you are serving. This is the single most important thing you do in the app \u2014 your leader plans the whole Sunday from these answers.",
    sections: [
      {
        heading: "How to answer",
        prose:
          "The poll appears on your Dashboard. Choose AM, PM, Both or Not Serving. If you choose Not Serving you can add a reason, which goes to your group leader.",
      },
      {
        heading: "Changing your mind",
        prose:
          "Answer again and your latest answer replaces the old one. Do it as early as you can \u2014 duties are assigned from these numbers.",
      },
      {
        heading: "If you have no signal",
        prose:
          "Your answer is saved on your phone and the app tells you it has not reached the server. Open it again when you have signal so it can sync, otherwise your leader will still see you as not having replied.",
      },
    ],
  },
  {
    title: "Duties, alerts and polls",
    category: "Serving",
    tags: ["duty", "alerts", "notifications", "announcement"],
    overview:
      "Your leaders use the app to tell you what is happening and to ask questions.",
    sections: [
      {
        heading: "Your duty",
        prose:
          "Once a leader assigns you a duty it shows on your Dashboard, with the area, the task and your arrival time. They can attach a message to it too, so read the whole thing.",
      },
      {
        heading: "The bell",
        prose:
          "The bell next to your picture takes you to Alerts. A red number means something is waiting \u2014 usually a poll nobody has answered yet.",
      },
      {
        heading: "Announcements and polls",
        prose:
          "An announcement is your leader telling you something. A poll asks you to pick an answer, for example whether you can serve at a midweek event. Tap your answer and it is recorded; tap change if you need to.",
      },
      {
        heading: "Phone notifications",
        prose:
          "On the Alerts page there is an Enable Notifications button. Turning it on lets the app alert you when a new poll or announcement arrives while the app is open. If you have closed the app completely you will only see it when you open it again.",
      },
    ],
  },
  {
    title: "The Academy",
    category: "Training",
    tags: ["academy", "quiz", "certificate", "training", "exam"],
    overview:
      "The Academy is your training track: six modules, each with a quiz, then a final exam and a certificate.",
    sections: [
      {
        heading: "How it works",
        prose:
          "Open a module, read through the sections, then take its quiz. You need 80% to pass and unlock the next module. You can retake a quiz as many times as you need \u2014 your best score is kept.",
      },
      {
        heading: "The final exam",
        prose:
          "Once all six modules are passed, the final exam unlocks. It is 30 questions drawn at random from the whole syllabus, so no two attempts are the same. Pass at 80% and your certificate is issued.",
      },
      {
        heading: "Your certificate",
        prose:
          "It lives in the Academy under Final Clearance. Download or Print produces a clean copy without the app around it.",
      },
      {
        heading: "Wrong track?",
        prose:
          "The Academy follows your division \u2014 ushers get the usher syllabus, hostesses the hostess one. If it looks wrong, check the division on your profile.",
      },
    ],
  },
  {
    title: "Reporting a problem",
    category: "Serving",
    tags: ["feedback", "report", "broken", "issue"],
    overview:
      "Feedback is how you tell leadership something is broken, missing or worth changing. It goes to your leaders, not into a void.",
    sections: [
      {
        heading: "Sending a report",
        prose:
          "Feedback \u2192 the + button. Give it a short title, pick a category and urgency, say where it is, and describe what needs doing. Be specific about location \u2014 'downstairs bathroom, second cubicle' is far more useful than 'bathroom'.",
      },
      {
        heading: "Following it up",
        prose:
          "Your reports stay in the list and show as Resolved once a leader marks them done. Use the filters at the top to see only what is still open.",
      },
    ],
  },
  {
    title: "Installing the app on your phone",
    category: "App",
    tags: ["install", "home screen", "pwa", "offline"],
    overview:
      "The app can sit on your home screen like any other app, which makes it faster to open and lets notifications work properly.",
    sections: [
      {
        heading: "iPhone",
        prose:
          "Open the site in Safari, tap the Share button, then Add to Home Screen. It must be Safari \u2014 Chrome on iPhone cannot install it.",
      },
      {
        heading: "Android",
        prose:
          "Open the site in Chrome, tap the three dots, then Install app or Add to Home screen.",
      },
      {
        heading: "Working without signal",
        prose:
          "Pages you have already opened still work offline, and anything you do is saved on your phone. It syncs when you are back online. Anything that needs the server will tell you it could not reach it rather than failing quietly.",
      },
      {
        heading: "Something looks out of date",
        prose:
          "Pull down to refresh, or close the app fully and reopen it. If it is still stuck, sign out and back in.",
      },
    ],
  },
  {
    title: "For leaders",
    category: "Leadership",
    tags: ["leader", "team", "assign", "stats", "notice"],
    overview:
      "If you lead a group, an area, a service or the ministry, extra sections appear in your menu. What you see is always limited to the people you actually lead.",
    sections: [
      {
        heading: "Team",
        prose:
          "Everyone in your scope with their serving answer for the coming Sunday. Filter by serving, not serving, or no reply yet, and search by name or group.",
      },
      {
        heading: "Assign Duties",
        prose:
          "Give people their duty for the Sunday. If a service leader has set your group's area, only that area's duties are offered. You can attach a message to any duty.",
      },
      {
        heading: "Ministry Stats",
        prose:
          "The health picture: how many are serving, the change on last week, the last four Sundays, how many trainees are serving, academy progress and birthdays this month.",
      },
      {
        heading: "Send Notice",
        prose:
          "Send an announcement or a poll. The list of who you can send to is built from what you lead, so you cannot accidentally message the whole ministry.",
      },
      {
        heading: "Areas & Placements, Trainees",
        prose:
          "For service and area leaders. Set which area each group serves, place cross-service volunteers into a group for the day, and track which areas each trainee has already covered.",
      },
    ],
  },
];

if (typeof window !== "undefined") {
  window.GUIDE_CONTENT = { usher: GUIDE_USHER, hostess: GUIDE_HOSTESS, app: GUIDE_APP };
}
