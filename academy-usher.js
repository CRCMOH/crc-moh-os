/* ============================================================================
   CRC MOH OS — USHER ACADEMY CURRICULUM
   Source of truth: "Usher Guide" (Stages 1–6).
   Structure intentionally mirrors the Hostess Academy track:
     6 modules -> each with study sections + a 10-question quiz -> final exam.
   ==========================================================================*/

const USHER_ACADEMY_MODULES = [
  /* ------------------------------ MODULE 1 ------------------------------ */
  {
    title: "Attire, Groups & Serving Times",
    summary:
      "Presentation standards, group assignment, and the AM/PM operational timeline.",
    content: [
      {
        heading: "Usher Attire",
        bullets: [
          "The usher uniform is all black.",
          "Black formal pants and a white formal shirt.",
          "Black formal shoes or fully black tekkies — no open-toed shoes at any time.",
          "Jackets must be black unless it is an official MOH jacket.",
        ],
      },
      {
        heading: "Hair & Earrings",
        bullets: [
          "Hair must not be a bright colour such as green, blue, purple or white.",
          "Hair must be kept out of your face — tied down, tied up, or cut.",
          "Earrings must be small.",
          "Earrings must not be bright colours.",
        ],
      },
      {
        heading: "Groups",
        bullets: [
          "You are assigned to a group either on arrival or the week before.",
          "Every group has a group leader who guides you on what to do for the day.",
          "Your group leader also tells you whether you are serving inside or outside for that service.",
        ],
      },
      {
        heading: "Serving Times — We Serve In Excellence",
        bullets: [
          "AM: arrival 06:00, MOH pre-prayer 07:00, church pre-prayer 07:45.",
          "AM service starts 08:30 in Summer and 09:00 in Winter.",
          "PM: arrival 15:30, MOH pre-prayer 16:00, church pre-prayer 17:30.",
          "PM service starts 18:00. Set down follows immediately after each service.",
          "After arrival you prepare and set up, then have MOH pre-prayer, then finish set-ups before the church's pre-prayer.",
          "All inside ushers must be inside 5–10 minutes before the church's pre-prayer.",
        ],
      },
    ],
    quiz: [
      {
        question: "What is the usher uniform?",
        options: [
          "All black with a white formal shirt.",
          "All red with black pants.",
          "Any smart casual outfit.",
          "White on white.",
        ],
        answer: "All black with a white formal shirt.",
      },
      {
        question: "Which footwear is acceptable for an usher?",
        options: [
          "Black formal shoes or fully black tekkies.",
          "Any closed shoe of any colour.",
          "Black open-toed sandals.",
          "White sneakers.",
        ],
        answer: "Black formal shoes or fully black tekkies.",
      },
      {
        question: "What is the rule on jackets?",
        options: [
          "Stick to black unless it is an MOH jacket.",
          "Any colour is fine.",
          "Jackets are never allowed.",
          "Only white jackets.",
        ],
        answer: "Stick to black unless it is an MOH jacket.",
      },
      {
        question: "Which hair colours are not permitted?",
        options: [
          "Green, blue, purple and white.",
          "Black and dark brown.",
          "All colours are permitted.",
          "Only white is not permitted.",
        ],
        answer: "Green, blue, purple and white.",
      },
      {
        question: "How should earrings be worn on duty?",
        options: [
          "Small and not brightly coloured.",
          "Large and eye-catching.",
          "Any size, any colour.",
          "Only hoops.",
        ],
        answer: "Small and not brightly coloured.",
      },
      {
        question: "When are you assigned to your group?",
        options: [
          "On arrival or the week before.",
          "Only at the end of the service.",
          "Once a year.",
          "You choose your own group each week.",
        ],
        answer: "On arrival or the week before.",
      },
      {
        question: "Who tells you whether you are serving inside or outside?",
        options: [
          "Your group leader.",
          "Any member of the congregation.",
          "The media team.",
          "You decide yourself.",
        ],
        answer: "Your group leader.",
      },
      {
        question: "What time is AM arrival?",
        options: ["06:00", "07:00", "07:45", "08:30"],
        answer: "06:00",
      },
      {
        question: "What time is the PM MOH pre-prayer?",
        options: ["16:00", "15:30", "17:30", "18:00"],
        answer: "16:00",
      },
      {
        question:
          "How early must inside ushers be in position before the church's pre-prayer?",
        options: [
          "5–10 minutes before.",
          "Exactly at the start.",
          "30 minutes after.",
          "Only once worship begins.",
        ],
        answer: "5–10 minutes before.",
      },
    ],
  },

  /* ------------------------------ MODULE 2 ------------------------------ */
  {
    title: "Storeroom & Equipment",
    summary:
      "The main storeroom, cleaning products, mops, brooms, and the bathroom storerooms.",
    content: [
      {
        heading: "Handling Equipment",
        bullets: [
          "All equipment must be handled with care and with respect.",
          "Equipment is what we use to care for and prepare the church for services.",
          "Return every item to exactly where you found it.",
          "Take care of equipment while it is in use, not only when you put it away.",
        ],
      },
      {
        heading: "Cleaning Products (Main Storeroom)",
        bullets: [
          "Windowlen — the blue liquid in a spray bottle.",
          "Surface cleaner — a green liquid in a spray bottle.",
          "Floor cleaner — a green liquid in a spray bottle.",
          "All three products are labelled, so read the label before spraying.",
        ],
      },
      {
        heading: "Cloths, Mops & Buckets",
        bullets: [
          "Red lappies (cloths) are stored under the shelf holding the three cleaning products.",
          "Red lappies are used to wipe surfaces, windows and bathroom mirrors.",
          "Noodle mop heads are white and stringy and are used to mop.",
          "Flat mop heads are blue and rectangular and are used to dry the floor.",
          "The noodle mop and the flat mop are normally used together — mop first, then dry.",
          "Mop stems (sticks) hang on the walls; another usher can show you how to attach the heads.",
          "Big yellow buckets and small black buckets are used for mopping.",
        ],
      },
      {
        heading: "Scoppies & Brooms",
        bullets: [
          "Scoppies are underneath the counter in a clear box.",
          "Inside brooms have soft bristles, are on the right back wall as you enter the storeroom, and are only used inside the church.",
          "Outside brooms have hard bristles, are kept behind the downstairs bathrooms, and are only used outside.",
        ],
      },
      {
        heading: "Bathroom Storerooms",
        bullets: [
          "There are two bathroom storerooms — one upstairs and one downstairs, each next to its bathrooms.",
          "Bathrooms may only be cleaned with the products and equipment kept in those storerooms.",
          "Buckets for the bathrooms still come from the main storeroom.",
          "The male and female bathrooms each have their own carrier holding Windowlen (for mirrors), surface cleaner, floor cleaner, plastic bags, the toilet paper holder key and gloves.",
        ],
      },
    ],
    quiz: [
      {
        question: "Which product is the blue liquid in a spray bottle?",
        options: ["Windowlen", "Surface cleaner", "Floor cleaner", "Bleach"],
        answer: "Windowlen",
      },
      {
        question: "What are the red lappies used for?",
        options: [
          "Surfaces, windows and bathroom mirrors.",
          "Drying the floor.",
          "Wiping shoes only.",
          "Nothing — they are decorative.",
        ],
        answer: "Surfaces, windows and bathroom mirrors.",
      },
      {
        question: "Which mop head is used to mop the floor?",
        options: [
          "The white stringy noodle mop head.",
          "The blue rectangular flat mop head.",
          "A red lappie.",
          "The outside broom.",
        ],
        answer: "The white stringy noodle mop head.",
      },
      {
        question: "What is the blue rectangular flat mop head used for?",
        options: [
          "Drying the floor.",
          "Cleaning mirrors.",
          "Scrubbing toilets.",
          "Sweeping the stairs.",
        ],
        answer: "Drying the floor.",
      },
      {
        question: "Where are the scoppies kept?",
        options: [
          "Underneath the counter in a clear box.",
          "On the wall with the mop stems.",
          "Behind the downstairs bathrooms.",
          "In the auditorium.",
        ],
        answer: "Underneath the counter in a clear box.",
      },
      {
        question: "Which brooms may be used inside the church?",
        options: [
          "The soft-bristle inside brooms.",
          "The hard-bristle outside brooms.",
          "Any broom available.",
          "Only brand-new brooms.",
        ],
        answer: "The soft-bristle inside brooms.",
      },
      {
        question: "Where are the outside brooms stored?",
        options: [
          "Behind the downstairs bathrooms.",
          "On the right back wall of the main storeroom.",
          "In the clear box under the counter.",
          "In the upstairs bathroom storeroom.",
        ],
        answer: "Behind the downstairs bathrooms.",
      },
      {
        question: "How many bathroom storerooms are there?",
        options: ["Two — upstairs and downstairs.", "One.", "Three.", "None."],
        answer: "Two — upstairs and downstairs.",
      },
      {
        question: "Which of these is NOT in a bathroom carrier?",
        options: [
          "The mop stems.",
          "Windowlen for the mirrors.",
          "Plastic bags and gloves.",
          "The key for the toilet paper holders.",
        ],
        answer: "The mop stems.",
      },
      {
        question: "What must you do with equipment after using it?",
        options: [
          "Return it to exactly where you found it.",
          "Leave it wherever you finished.",
          "Give it to a congregation member.",
          "Take it home to wash.",
        ],
        answer: "Return it to exactly where you found it.",
      },
    ],
  },

  /* ------------------------------ MODULE 3 ------------------------------ */
  {
    title: "Set Up & Leadership",
    summary:
      "Correct use of equipment during set up, and the leadership structure you serve under.",
    content: [
      {
        heading: "Set Up Timing",
        bullets: [
          "After being assigned to a group you are tasked with setting up.",
          "All set-up duties must be completed before the church's pre-prayer.",
          "Check the duties list for what needs to be done in each area — you will be guided through it.",
        ],
      },
      {
        heading: "Using The Equipment Correctly",
        bullets: [
          "Red lappies are used to wipe down everything except the floors.",
          "For windows, use a clean lappie together with Windowlen.",
          "For counters, handrails, toilets and any surface that is not glass or floor, use a red lappie with surface cleaner.",
          "Floor cleaner is used as a few sprays mixed into water, then applied with the mops.",
          "Always place a wet floor sign when mopping.",
          "Brooms are more effective than a scoppie for big messes and should be used on the auditorium stairs and in the foyer.",
        ],
      },
      {
        heading: "Packing Down Equipment",
        bullets: [
          "Return all equipment to the storeroom unless your leader tells you otherwise.",
          "Wash both noodle and flat mop heads thoroughly after use.",
          "Hang washed mop heads up behind the downstairs bathrooms.",
        ],
      },
      {
        heading: "Leadership Structure",
        bullets: [
          "Check the leadership structure so you know exactly who your leaders are.",
          "Your group leader is your main leader and your first point of instruction.",
          "Above your group leader are the area leaders, then the service leader, then the ministry leaders, then Pastor Pieter.",
          "AM and PM have different leaders, but a leader from another service is still a leader — respect them regardless of which service they belong to.",
        ],
      },
    ],
    quiz: [
      {
        question: "By when must all set-up duties be finished?",
        options: [
          "Before the church's pre-prayer.",
          "Before the altar call.",
          "By the end of the service.",
          "During worship.",
        ],
        answer: "Before the church's pre-prayer.",
      },
      {
        question: "Red lappies are used to wipe everything except…",
        options: ["The floors.", "The windows.", "The handrails.", "The counters."],
        answer: "The floors.",
      },
      {
        question: "Which combination is correct for cleaning windows?",
        options: [
          "A clean lappie with Windowlen.",
          "A used lappie with floor cleaner.",
          "A noodle mop with surface cleaner.",
          "A dry broom.",
        ],
        answer: "A clean lappie with Windowlen.",
      },
      {
        question: "Which product is used on counters, handrails and toilets?",
        options: ["Surface cleaner.", "Windowlen.", "Floor cleaner.", "Plain water."],
        answer: "Surface cleaner.",
      },
      {
        question: "How is floor cleaner applied?",
        options: [
          "A few sprays mixed into water, then mopped.",
          "Sprayed directly onto glass.",
          "Poured undiluted onto the floor.",
          "Wiped on with a red lappie.",
        ],
        answer: "A few sprays mixed into water, then mopped.",
      },
      {
        question: "What must always be placed when mopping?",
        options: [
          "A wet floor sign.",
          "An offering basket.",
          "A cone from the parking area.",
          "Nothing is required.",
        ],
        answer: "A wet floor sign.",
      },
      {
        question: "For big messes on the auditorium stairs you should use…",
        options: [
          "A broom, as it is more effective than a scoppie.",
          "A scoppie only.",
          "A flat mop head.",
          "A red lappie.",
        ],
        answer: "A broom, as it is more effective than a scoppie.",
      },
      {
        question: "Where are washed mop heads hung to dry?",
        options: [
          "Behind the downstairs bathrooms.",
          "On the auditorium chairs.",
          "In the main storeroom sink.",
          "Over the foyer railing.",
        ],
        answer: "Behind the downstairs bathrooms.",
      },
      {
        question: "Who is your main leader?",
        options: [
          "Your group leader.",
          "Pastor Pieter directly.",
          "The service leader.",
          "Any usher who has served longer than you.",
        ],
        answer: "Your group leader.",
      },
      {
        question: "A leader from the other service is serving alongside you. You should…",
        options: [
          "Respect them — they are still a leader.",
          "Ignore them because they lead a different service.",
          "Ask them to leave your area.",
          "Only listen if your group leader is absent.",
        ],
        answer: "Respect them — they are still a leader.",
      },
    ],
  },

  /* ------------------------------ MODULE 4 ------------------------------ */
  {
    title: "Outside Duties — Parking, Equipment & Weather",
    summary:
      "Parking control, walkie-talkie discipline, special parking zones and extreme weather protocol.",
    content: [
      {
        heading: "Parking Is A Team Effort",
        bullets: [
          "Parking is a large team effort carried out with your fellow ushers.",
          "You guide people into their allotted spaces — and you do it with a smile.",
          "Your leader will brief you on how the rest of the parking area is filled, and there is a map to work from.",
        ],
      },
      {
        heading: "Special Parking Zones",
        bullets: [
          "There is dedicated parking for the elderly, parents with kids and disabled visitors, right behind the church near the entrance doors.",
          "These bays are signposted.",
          "Assist anyone who needs it — helping a parent get a pram out, or giving an elderly person extra support.",
          "There is a pastors' parking area so pastors and their staff can access their offices easily.",
          "There is a Bolt and Uber drop-off zone. Assist those people into church.",
          "The bus also arrives — the drivers already know where to park.",
        ],
      },
      {
        heading: "Walkie-Talkies",
        bullets: [
          "Walkie-talkies are used to communicate across large spaces.",
          "Use them to relay that someone elderly, a student or another visitor is heading in a certain direction.",
          "Turn walkie-talkies off after use.",
          "Return walkie-talkies to charge after use.",
        ],
      },
      {
        heading: "Outside Equipment & Extreme Weather",
        bullets: [
          "Outside brooms are hung on the wall of the amphi stairs by the basement outside, and only they may be used outside.",
          "Use the mops kept there to clean the outside areas.",
          "When it rains, use the umbrellas from the storeroom to help people get into church without getting drenched.",
          "Keep track of every umbrella you use and hand out so none are lost.",
        ],
      },
    ],
    quiz: [
      {
        question: "How should you guide people into parking spaces?",
        options: [
          "As a team effort, with a smile.",
          "Silently and alone.",
          "By pointing and walking away.",
          "Only if a leader is watching.",
        ],
        answer: "As a team effort, with a smile.",
      },
      {
        question: "Where is the parking for the elderly, parents and disabled visitors?",
        options: [
          "Right behind the church near the entrance doors.",
          "In the overflow field.",
          "In the pastors' parking.",
          "At the main gate.",
        ],
        answer: "Right behind the church near the entrance doors.",
      },
      {
        question: "A parent is struggling with a pram. What do you do?",
        options: [
          "Assist them.",
          "Wait until they ask twice.",
          "Call the media team.",
          "Nothing — it is not an usher duty.",
        ],
        answer: "Assist them.",
      },
      {
        question: "Why does the church have a pastors' parking area?",
        options: [
          "So pastors and their staff can easily access their offices.",
          "To keep the area empty.",
          "Because it is closest to the tent.",
          "For overflow on busy Sundays.",
        ],
        answer: "So pastors and their staff can easily access their offices.",
      },
      {
        question: "What are walkie-talkies used for?",
        options: [
          "Communicating over large spaces about people arriving and their direction.",
          "Playing music during set up.",
          "Personal calls between friends.",
          "Announcing the sermon.",
        ],
        answer:
          "Communicating over large spaces about people arriving and their direction.",
      },
      {
        question: "What must you do with a walkie-talkie after use?",
        options: [
          "Turn it off and return it to charge.",
          "Leave it switched on at the gate.",
          "Take it home for next week.",
          "Hand it to a congregation member.",
        ],
        answer: "Turn it off and return it to charge.",
      },
      {
        question: "Where are the outside brooms found?",
        options: [
          "Hanging on the wall of the amphi stairs by the basement outside.",
          "On the right back wall of the main storeroom.",
          "In the upstairs bathroom storeroom.",
          "Under the counter in a clear box.",
        ],
        answer: "Hanging on the wall of the amphi stairs by the basement outside.",
      },
      {
        question: "It starts raining before service. What is the protocol?",
        options: [
          "Use the storeroom umbrellas to help people into church.",
          "Send everyone home.",
          "Move all parking indoors.",
          "Wait inside until it stops.",
        ],
        answer: "Use the storeroom umbrellas to help people into church.",
      },
      {
        question: "What must you do about the umbrellas you hand out?",
        options: [
          "Keep track of every one you use and hand out.",
          "Give them away permanently.",
          "Leave them at the door for anyone.",
          "Store them in your car.",
        ],
        answer: "Keep track of every one you use and hand out.",
      },
      {
        question: "The Bolt and Uber drop-off zone requires ushers to…",
        options: [
          "Assist those who need help getting into church.",
          "Block it off entirely.",
          "Park their own cars there.",
          "Ignore it — drivers handle themselves.",
        ],
        answer: "Assist those who need help getting into church.",
      },
    ],
  },

  /* ------------------------------ MODULE 5 ------------------------------ */
  {
    title: "Inside The Service — Doors, Catching & Offering",
    summary:
      "Door protocol, how to catch someone safely, pre-prayer, praise and worship, altar call, tithe and communion.",
    content: [
      {
        heading: "Door Protocol",
        bullets: [
          "Doors are mainly handled by the hostesses, but you must know how they operate.",
          "Before the service and right after pre-prayer, both the double doors to the left and right of the middle door should be opened.",
          "Be gentle with the doors — they open one way, and holding one open lets the other hold itself open.",
          "During the service and pre-prayer the doors stay closed and are opened only as someone walks in or out.",
          "Work with the usher on the inside door so that only one door is open at a time, to prevent glare.",
          "Example: if the outside door is open, close the inside door until the person is through, then close the outside door and open the inside door for them.",
          "After the service, open the doors wide — including the middle door — because there is heavy traffic.",
          "Closed doors during the service stop light glaring into the faces of the people on stage and the pastor while he preaches.",
          "The middle door must not be opened during the service for any reason unless a leader states an exception.",
          "At Praise Party (usually the PM service) the doors are not opened fully and the middle door stays closed even with a large crowd leaving — operate them as you would during the service.",
        ],
      },
      {
        heading: "How To Catch Someone",
        bullets: [
          "This is very important — ask a leader for a visual demonstration if you need one.",
          "Stand behind the person.",
          "Ball up your fists but keep your arms open.",
          "As they fall back, catch them and gently lower them to the floor.",
          "Lay women on their side, in case they are pregnant.",
          "You ball up your fists to prevent accidental contact with the chest area, particularly with women.",
        ],
      },
      {
        heading: "Posture During The Service",
        bullets: [
          "When we pray, keep your eyes open and on the congregation.",
          "We are the Ministry of Helps — we help the people in any way we can.",
          "We keep the fire alive and stand in agreement with what is being said during the service.",
          "Ushers and hostesses stand and clap when the pastor says something, and we do not stand still during praise and worship.",
          "Be mindful during prayer.",
          "The red we wear makes us stand out — be conscious of the message you are sending during the service.",
        ],
      },
      {
        heading: "Pre-Prayer, Praise & Worship, Altar Call",
        bullets: [
          "During pre-prayer it is okay for people to pace up and down, but keep watch over them.",
          "If someone is on the floor and at risk of being stepped on, stand above them, placing them between your legs.",
          "Be careful not to take someone out of the move of the Holy Spirit.",
          "A red lappie helps people see someone on the floor so they are not stepped on.",
          "Keep watch of people with glasses.",
          "You may pray during pre-prayer, but do not get caught in the spirit — you will most likely still be helping with seating.",
          "During praise and worship, make sure nobody stands in the aisles; it blocks media movement and our own.",
          "Keep your eyes on the congregation in the area you were placed.",
          "At altar call, keep your head down and wait for the pastor to count down, then stand and track who raises their hand.",
          "After people go forward, give the ones who stayed a few seconds, then gently approach and ask if they would like to go to the front.",
          "Altar call is a highly sensitive moment — be kind to the people.",
        ],
      },
      {
        heading: "Tithe, Offering & Holy Communion",
        bullets: [
          "Tithe and offering usually happens after the altar call.",
          "As a white shirt you sit and observe during your training.",
          "The pastor cues the start of it.",
          "Go to the back, collect an offering basket, and work with your fellow ushers.",
          "Pass one basket per row — one usher hands a row a basket, and an usher on the other end collects it to give to the next row.",
          "Start from the back of the auditorium and work down to the second row from the front.",
          "Nobody outside of the MOH and security may handle the baskets.",
          "You are handling what people are sowing into the kingdom — do not allow anyone to steal a basket.",
          "Doors are sometimes locked during this time purely for safety, to make basket theft harder.",
          "Holy communion works the same way — hand out from the back to the front, row by row.",
        ],
      },
    ],
    quiz: [
      {
        question: "During the service, how many doors should be open at a time?",
        options: [
          "One — to prevent glare.",
          "All of them.",
          "Both double doors.",
          "The middle door only.",
        ],
        answer: "One — to prevent glare.",
      },
      {
        question: "Why are the doors kept closed during the service?",
        options: [
          "Light glares into the faces of the people on stage and the pastor.",
          "To keep the building warm.",
          "To stop noise from the parking area.",
          "To lock the congregation in.",
        ],
        answer:
          "Light glares into the faces of the people on stage and the pastor.",
      },
      {
        question: "When may the middle door be opened?",
        options: [
          "After the service, to let people out.",
          "Any time someone asks.",
          "During the altar call.",
          "During pre-prayer.",
        ],
        answer: "After the service, to let people out.",
      },
      {
        question: "At Praise Party, how are the doors handled at the end?",
        options: [
          "Not fully opened, and the middle door stays closed.",
          "All doors opened wide immediately.",
          "All doors locked.",
          "Exactly as at a normal service ending.",
        ],
        answer: "Not fully opened, and the middle door stays closed.",
      },
      {
        question: "When catching someone, what do you do with your hands?",
        options: [
          "Ball up your fists but keep your arms open.",
          "Spread your palms flat across their chest.",
          "Hold their shoulders tightly.",
          "Keep your hands in your pockets.",
        ],
        answer: "Ball up your fists but keep your arms open.",
      },
      {
        question: "How should a woman be laid down after being caught?",
        options: [
          "On her side, in case she is pregnant.",
          "Flat on her stomach.",
          "Seated upright against a chair.",
          "It does not matter.",
        ],
        answer: "On her side, in case she is pregnant.",
      },
      {
        question: "What must your eyes be doing while the congregation prays?",
        options: [
          "Open and on the congregation.",
          "Closed in prayer.",
          "Fixed on the pastor only.",
          "On your phone for the schedule.",
        ],
        answer: "Open and on the congregation.",
      },
      {
        question:
          "Someone is on the floor during pre-prayer and at risk of being stepped on. What do you do?",
        options: [
          "Stand above them, placing them between your legs.",
          "Pull them up immediately.",
          "Move them out of the auditorium.",
          "Leave them and continue seating people.",
        ],
        answer: "Stand above them, placing them between your legs.",
      },
      {
        question: "In which direction are offering baskets passed?",
        options: [
          "From the back of the auditorium down to the second row from the front.",
          "From the front row to the back.",
          "From the middle outward.",
          "Randomly, wherever there is space.",
        ],
        answer:
          "From the back of the auditorium down to the second row from the front.",
      },
      {
        question: "Who may handle the offering baskets?",
        options: [
          "Only MOH and security.",
          "Anyone seated in the front row.",
          "Any adult member.",
          "The media team.",
        ],
        answer: "Only MOH and security.",
      },
    ],
  },

  /* ------------------------------ MODULE 6 ------------------------------ */
  {
    title: "Set Down, Feedback & Ministry Protocol",
    summary:
      "Exit traffic, set down responsibilities, spiritual discernment and serving without disrupting.",
    content: [
      {
        heading: "Exit Traffic",
        bullets: [
          "After the service, help the hostesses reduce traffic by guiding people out of the doors.",
          "Besides the three main doors there are two more doors on the far right and far left.",
          "If you are placed near those doors, lead people to them to reduce congestion.",
        ],
      },
      {
        heading: "Set Down",
        bullets: [
          "Set down must never be neglected.",
          "AM set down prepares the building for the PM service.",
          "PM set down cleans the church for the week.",
          "Set down includes returning all equipment to the right locations and taking out the bins.",
          "Your leader may add other duties after the service.",
          "You do not need to clean as deeply during set down as you do during set up.",
          "If you need to leave during set down, inform your leader of your departure.",
        ],
      },
      {
        heading: "Discernment During The Service",
        bullets: [
          "Things will not always go as planned — stay in alignment with the Holy Spirit.",
          "The MOH pre-prayer exists so that we get to worship, pray and have our own encounter with God before the service.",
          "All of this is for His glory.",
          "There will be moments during the service where you must be on high alert.",
        ],
      },
      {
        heading: "Ministry Protocol",
        bullets: [
          "During ministry time, such as the laying on of hands, remember we serve the people and not ourselves.",
          "If you get caught in the spirit, tell another usher or your leader to cover your area.",
          "Never leave your area unattended.",
          "Catch people according to protocol.",
          "When people are being ministered to at the altar, keep watching the congregation — they may also feel the move of the Holy Spirit.",
          "Be sensitive to your surroundings and work with your fellow ushers and hostesses.",
          "Do not get worked up over a single mistake — carry on according to protocol. It gets easier the more you do it.",
          "Remove any obstacle to the Holy Spirit working, but do not disrupt or draw attention to yourself or others.",
          "We are a team — do not be afraid to rely on others and ask for help.",
        ],
      },
    ],
    quiz: [
      {
        question: "How do ushers help after the service ends?",
        options: [
          "Guiding people out of the doors to reduce traffic.",
          "Leaving immediately.",
          "Locking every door.",
          "Sitting until the building empties.",
        ],
        answer: "Guiding people out of the doors to reduce traffic.",
      },
      {
        question: "Besides the three main doors, what else can be used to reduce traffic?",
        options: [
          "The two doors on the far right and far left.",
          "The stage exit.",
          "The storeroom door.",
          "The office balcony.",
        ],
        answer: "The two doors on the far right and far left.",
      },
      {
        question: "What is the purpose of AM set down?",
        options: [
          "To help prepare for the PM service.",
          "To clean the church for the whole week.",
          "To pack away for the year.",
          "It has no purpose.",
        ],
        answer: "To help prepare for the PM service.",
      },
      {
        question: "What is the purpose of PM set down?",
        options: [
          "To clean up the church for the week.",
          "To prepare for the AM service the same day.",
          "To set up the tent.",
          "To count the offering.",
        ],
        answer: "To clean up the church for the week.",
      },
      {
        question: "Set down includes…",
        options: [
          "Returning equipment to the right locations and taking out the bins.",
          "Deep cleaning every surface again.",
          "Only stacking chairs.",
          "Nothing — it is optional.",
        ],
        answer:
          "Returning equipment to the right locations and taking out the bins.",
      },
      {
        question: "You need to leave during set down. What must you do?",
        options: [
          "Inform your leader of your departure.",
          "Slip out quietly.",
          "Text a friend in another group.",
          "Nothing — set down is voluntary.",
        ],
        answer: "Inform your leader of your departure.",
      },
      {
        question: "Why do we have the MOH pre-prayer?",
        options: [
          "So we can worship, pray and encounter God before the service.",
          "To hand out equipment.",
          "To assign parking bays.",
          "To rehearse the sermon.",
        ],
        answer: "So we can worship, pray and encounter God before the service.",
      },
      {
        question: "You get caught in the spirit while on post. What is the protocol?",
        options: [
          "Inform another usher or your leader so your area is covered.",
          "Leave the area unattended.",
          "Go home for the day.",
          "Keep it to yourself and stop serving.",
        ],
        answer: "Inform another usher or your leader so your area is covered.",
      },
      {
        question: "While people are ministered to at the altar, you should…",
        options: [
          "Keep watching the congregation too.",
          "Watch only the altar.",
          "Close your eyes in prayer.",
          "Move to the foyer.",
        ],
        answer: "Keep watching the congregation too.",
      },
      {
        question: "You make a mistake during the service. What should you do?",
        options: [
          "Carry on according to protocol and do not get worked up.",
          "Leave your post out of embarrassment.",
          "Blame another usher.",
          "Stop serving for the rest of the month.",
        ],
        answer: "Carry on according to protocol and do not get worked up.",
      },
    ],
  },
];

/* ============================ FINAL EXAM POOL =============================
   Drawn from every stage of the Usher Guide. The engine samples 30 at random,
   so the pool is intentionally larger than the exam length.
   ==========================================================================*/
const USHER_FINAL_POOL = [
  {
    question: "What colour shirt forms part of the usher uniform?",
    options: ["White formal shirt", "Red shirt", "Black shirt", "Any light colour"],
    answer: "White formal shirt",
  },
  {
    question: "Which shoes are explicitly forbidden for ushers?",
    options: ["Open-toed shoes", "Black tekkies", "Black formal shoes", "Closed flats"],
    answer: "Open-toed shoes",
  },
  {
    question: "A non-MOH jacket worn on duty must be…",
    options: ["Black", "Red", "White", "Any colour"],
    answer: "Black",
  },
  {
    question: "Hair on duty must be…",
    options: [
      "Out of your face — tied down, tied up or cut",
      "Loose and covering the face",
      "Dyed a bright colour",
      "Left however you like",
    ],
    answer: "Out of your face — tied down, tied up or cut",
  },
  {
    question: "Earrings on duty must be…",
    options: ["Small and not bright", "Large hoops", "Brightly coloured", "Dangling"],
    answer: "Small and not bright",
  },
  {
    question: "What time is AM arrival?",
    options: ["06:00", "06:30", "07:00", "07:45"],
    answer: "06:00",
  },
  {
    question: "What time is the AM MOH pre-prayer?",
    options: ["07:00", "06:00", "07:45", "08:30"],
    answer: "07:00",
  },
  {
    question: "What time is the AM church pre-prayer?",
    options: ["07:45", "07:00", "08:30", "09:00"],
    answer: "07:45",
  },
  {
    question: "What time does the AM service start in Summer?",
    options: ["08:30", "09:00", "07:45", "10:00"],
    answer: "08:30",
  },
  {
    question: "What time does the AM service start in Winter?",
    options: ["09:00", "08:30", "07:45", "09:30"],
    answer: "09:00",
  },
  {
    question: "What time is PM arrival?",
    options: ["15:30", "16:00", "17:30", "18:00"],
    answer: "15:30",
  },
  {
    question: "What time is the PM church pre-prayer?",
    options: ["17:30", "16:00", "15:30", "18:00"],
    answer: "17:30",
  },
  {
    question: "What time does the PM service start?",
    options: ["18:00", "17:30", "16:00", "19:00"],
    answer: "18:00",
  },
  {
    question: "Inside ushers must be in position how long before church pre-prayer?",
    options: ["5–10 minutes", "1 hour", "30 minutes", "At the exact time"],
    answer: "5–10 minutes",
  },
  {
    question: "Who assigns you your position for the day?",
    options: [
      "Your group leader",
      "The media team",
      "Any congregation member",
      "You choose",
    ],
    answer: "Your group leader",
  },
  {
    question: "Windowlen is…",
    options: [
      "The blue liquid in a spray bottle",
      "A green liquid in a spray bottle",
      "A red powder",
      "A dry cloth",
    ],
    answer: "The blue liquid in a spray bottle",
  },
  {
    question: "Surface cleaner and floor cleaner are both…",
    options: [
      "Green liquids in spray bottles",
      "Blue liquids",
      "Sold in the same bottle",
      "Unlabelled",
    ],
    answer: "Green liquids in spray bottles",
  },
  {
    question: "Red lappies are stored…",
    options: [
      "Under the shelf holding the three cleaning products",
      "Behind the downstairs bathrooms",
      "In the auditorium",
      "In the bathroom carriers only",
    ],
    answer: "Under the shelf holding the three cleaning products",
  },
  {
    question: "Noodle mop heads are…",
    options: [
      "White and stringy, used to mop",
      "Blue and rectangular, used to dry",
      "Red and square",
      "Attached to brooms",
    ],
    answer: "White and stringy, used to mop",
  },
  {
    question: "Flat mop heads are…",
    options: [
      "Blue and rectangular, used to dry the floor",
      "White and stringy, used to mop",
      "Only for windows",
      "Only for outside use",
    ],
    answer: "Blue and rectangular, used to dry the floor",
  },
  {
    question: "Which buckets are used for mopping?",
    options: [
      "Big yellow buckets and small black buckets",
      "Only clear plastic boxes",
      "The bathroom carriers",
      "Any bin available",
    ],
    answer: "Big yellow buckets and small black buckets",
  },
  {
    question: "Inside brooms are identified by…",
    options: ["Soft bristles", "Hard bristles", "Blue handles", "Being longer"],
    answer: "Soft bristles",
  },
  {
    question: "Outside brooms are identified by…",
    options: ["Hard bristles", "Soft bristles", "Red handles", "Having no handle"],
    answer: "Hard bristles",
  },
  {
    question: "Bathrooms may only be cleaned with…",
    options: [
      "The products and equipment in the bathroom storerooms",
      "Anything from the main storeroom",
      "Whatever is closest",
      "Plain water",
    ],
    answer: "The products and equipment in the bathroom storerooms",
  },
  {
    question: "The bathroom carrier contains all of the following EXCEPT…",
    options: [
      "Mop stems",
      "Windowlen for the mirrors",
      "The key for the toilet paper holders",
      "Gloves and plastic bags",
    ],
    answer: "Mop stems",
  },
  {
    question: "All set-up duties must be completed before…",
    options: [
      "The church's pre-prayer",
      "The offering",
      "The altar call",
      "Set down",
    ],
    answer: "The church's pre-prayer",
  },
  {
    question: "What must be placed on the floor while mopping?",
    options: ["A wet floor sign", "A cone", "An offering basket", "Nothing"],
    answer: "A wet floor sign",
  },
  {
    question: "After use, mop heads must be…",
    options: [
      "Washed thoroughly and hung behind the downstairs bathrooms",
      "Left in the bucket",
      "Thrown away",
      "Stored damp in the storeroom",
    ],
    answer: "Washed thoroughly and hung behind the downstairs bathrooms",
  },
  {
    question: "Order the leadership chain above your group leader.",
    options: [
      "Area leaders, service leader, ministry leaders, Pastor Pieter",
      "Pastor Pieter, service leader, area leaders",
      "Ministry leaders only",
      "There is no chain above group leaders",
    ],
    answer: "Area leaders, service leader, ministry leaders, Pastor Pieter",
  },
  {
    question: "A leader from the other service instructs you. You should…",
    options: [
      "Respect them — they are still a leader",
      "Refuse, they are not your service",
      "Report them",
      "Only obey if your leader agrees",
    ],
    answer: "Respect them — they are still a leader",
  },
  {
    question: "Parking should be handled…",
    options: [
      "As a large team effort, with a smile",
      "Individually and silently",
      "Only by leaders",
      "Only when it is busy",
    ],
    answer: "As a large team effort, with a smile",
  },
  {
    question: "Where is the elderly, parents and disabled parking?",
    options: [
      "Right behind the church near the entrance doors",
      "At the main gate",
      "In the overflow area",
      "Next to the tent",
    ],
    answer: "Right behind the church near the entrance doors",
  },
  {
    question: "Walkie-talkies must be…",
    options: [
      "Turned off after use and returned to charge",
      "Kept on overnight",
      "Taken home",
      "Left at the gate",
    ],
    answer: "Turned off after use and returned to charge",
  },
  {
    question: "During rain, ushers should…",
    options: [
      "Use storeroom umbrellas and keep track of each one handed out",
      "Stay inside until it clears",
      "Close the parking area",
      "Hand out umbrellas without tracking them",
    ],
    answer: "Use storeroom umbrellas and keep track of each one handed out",
  },
  {
    question: "Before the service and right after pre-prayer, which doors open?",
    options: [
      "Both double doors to the left and right of the middle door",
      "Only the middle door",
      "Only the far-left door",
      "All five doors",
    ],
    answer: "Both double doors to the left and right of the middle door",
  },
  {
    question: "During the service, working with the inside-door usher, you ensure…",
    options: [
      "Only one door is open at a time",
      "Both doors stay open",
      "Both doors stay locked",
      "The middle door is used instead",
    ],
    answer: "Only one door is open at a time",
  },
  {
    question: "The middle door may be opened during the service…",
    options: [
      "Only if a leader states an exception",
      "Whenever it is busy",
      "During the altar call",
      "At any time",
    ],
    answer: "Only if a leader states an exception",
  },
  {
    question: "When catching someone, where do you stand?",
    options: ["Behind them", "In front of them", "Beside them", "Two rows back"],
    answer: "Behind them",
  },
  {
    question: "Why do you ball up your fists when catching someone?",
    options: [
      "To prevent accidental touching of the chest area",
      "To brace your wrists",
      "To look alert",
      "It is only tradition",
    ],
    answer: "To prevent accidental touching of the chest area",
  },
  {
    question: "During prayer, an usher's eyes should be…",
    options: [
      "Open and on the congregation",
      "Closed",
      "On the pastor only",
      "On the floor",
    ],
    answer: "Open and on the congregation",
  },
  {
    question: "What helps people see someone lying on the floor?",
    options: ["A red lappie", "A wet floor sign", "A chair", "An offering basket"],
    answer: "A red lappie",
  },
  {
    question: "During praise and worship, ushers must keep clear…",
    options: ["The aisles", "The stage", "The foyer", "The parking area"],
    answer: "The aisles",
  },
  {
    question: "During the altar call countdown you should…",
    options: [
      "Keep your head down, then stand and track who raises their hand",
      "Walk to the front",
      "Watch the pastor only",
      "Start collecting baskets",
    ],
    answer: "Keep your head down, then stand and track who raises their hand",
  },
  {
    question: "After the altar call, people who did not go forward should be…",
    options: [
      "Given a few seconds, then kindly approached and asked",
      "Pulled to the front",
      "Ignored entirely",
      "Asked to leave",
    ],
    answer: "Given a few seconds, then kindly approached and asked",
  },
  {
    question: "During your training as a white shirt, tithe and offering means you…",
    options: [
      "Sit and observe",
      "Lead the collection",
      "Count the money",
      "Handle the baskets alone",
    ],
    answer: "Sit and observe",
  },
  {
    question: "How many baskets are passed per row?",
    options: ["One", "Two", "One per person", "As many as needed"],
    answer: "One",
  },
  {
    question: "Why are the doors sometimes locked during offering?",
    options: [
      "For safety — to make basket theft harder",
      "To keep the room warm",
      "To stop latecomers",
      "To reduce noise",
    ],
    answer: "For safety — to make basket theft harder",
  },
  {
    question: "Holy communion is distributed…",
    options: [
      "From the back to the front, row by row",
      "From the front to the back",
      "All at once",
      "Only at the altar",
    ],
    answer: "From the back to the front, row by row",
  },
  {
    question: "Set down after the AM service exists to…",
    options: [
      "Prepare for the PM service",
      "Clean for the whole week",
      "Pack the tent away",
      "Close the parking",
    ],
    answer: "Prepare for the PM service",
  },
  {
    question: "If you need to leave during set down you must…",
    options: [
      "Inform your leader",
      "Leave quietly",
      "Message the group chat only",
      "Nothing, it is optional",
    ],
    answer: "Inform your leader",
  },
  {
    question: "If you get caught in the spirit while on post you should…",
    options: [
      "Ask another usher or leader to cover your area",
      "Leave the area unattended",
      "Continue as if nothing happened",
      "Go home",
    ],
    answer: "Ask another usher or leader to cover your area",
  },
  {
    question: "The correct attitude toward obstacles to the Holy Spirit working is to…",
    options: [
      "Remove them without disrupting or drawing attention",
      "Announce them loudly",
      "Wait for a leader every time",
      "Leave them in place",
    ],
    answer: "Remove them without disrupting or drawing attention",
  },
  {
    question: "The overall purpose of everything the MOH does is…",
    options: ["God's glory", "Personal recognition", "Order alone", "Tradition"],
    answer: "God's glory",
  },
];

if (typeof window !== "undefined") {
  window.USHER_ACADEMY_MODULES = USHER_ACADEMY_MODULES;
  window.USHER_FINAL_POOL = USHER_FINAL_POOL;
}
