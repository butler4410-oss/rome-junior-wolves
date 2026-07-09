/* ==========================================================================
   ROME JUNIOR WOLVES — SITE CONTENT
   --------------------------------------------------------------------------
   This is the ONLY file most updates need. Edit the values below and refresh
   the page. No coding experience required — just keep the quotes and commas.

   Sections you'll edit most often:
     • news      → announcements / updates feed
     • events    → camps, fundraisers, important dates
     • schedule  → games once the season schedule is released
     • teams     → divisions + player rosters
     • coaches   → coaching staff
     • sponsors  → community sponsors

   Anything marked  SAMPLE  is placeholder content to show how the page looks.
   Replace it with your real information.
   ========================================================================== */

window.RJW = {

  /* ----- Organization basics ----------------------------------------- */
  org: {
    name:        "Rome Junior Wolves",
    shortName:   "Junior Wolves",
    tagline:     "Fear the Pack",
    season:      "2026",
    category:    "Youth Football & Cheerleading",
    blurb:       "Rome's youth football and cheerleading program — the proud feeder for the Rome High School and Rome Middle School Wolves. We build tougher, more confident kids on and off the field.",
    email:       "romejuniorwolves@gmail.com",
    phone:       "",  // add a public phone number if you have one
    facebook:    "https://www.facebook.com/romejuniorwolves",
    instagram:   "https://www.instagram.com/romejuniorwolves/",
    // 2026 team rosters are set. "Camps & Training" CTAs open the live sign-up wizard
    //   (register.html), used for camps & offseason training. ?preview=1 = walkthrough that submits nothing.
    ctaLabel:      "Camps & Training",
    registerUrl:   "/register/",
    leagueAppsUrl: "https://cobbfootball.leagueapps.com/clubteams/4572134-2025--rome-junior-wolves-football--cheerleading",
    league:        "Cobb Football League",
    highSchool:  { name: "Rome Wolves Athletics", url: "https://www.romewolvesathletics.com/" },
    feeders:     ["Rome High School", "Rome Middle School"],
    field: {
      name:    "Old Rome Middle School",
      address: "1000 Veterans Memorial Hwy NE, Rome, GA 30161",
      mapUrl:  "https://www.google.com/maps/search/?api=1&query=1000+Veterans+Memorial+Hwy+NE+Rome+GA+30161"
    }
  },

  /* ----- Practice / training info ------------------------------------ */
  practice: {
    headline: "Practice",
    window:   "March – August",
    days:     "Mondays, Tuesdays & Thursdays",
    time:     "6:00 PM – 8:00 PM",
    location: "Old Rome Middle School · 1000 Veterans Memorial Hwy NE, Rome, GA",
    note:     "Offseason training runs through the summer. Regular-season practices ramp up before the fall season — watch the News page and our Facebook for the latest."
  },

  /* ----- Quick stats shown on the home page -------------------------- */
  stats: [
    { value: "Grades 1–5", label: "Football & Cheer" },
    { value: "Mon · Tue · Thu",  label: "Practice Nights" },
    { value: "Rome, GA",   label: "Home of the Pack" },
    { value: "Rome HS",    label: "Official Feeder Program" }
  ],

  /* ----- Divisions by grade level ------------------------------------
     Teams are organized by GRADE for the 2026 season (overlapping pairs
     for now — adjust the list as your teams firm up). The `grades` value
     is what shows on the cards. */
  divisions: [
    { id: "g12",  name: "Junior Wolves",       type: "football", grades: "Grades 1/2", blurb: "1st & 2nd grade — fundamentals, fun, and teamwork." },
    { id: "g23",  name: "Junior Wolves",       type: "football", grades: "Grades 2/3", blurb: "2nd & 3rd grade — building technique and toughness." },
    { id: "g34",  name: "Junior Wolves",       type: "football", grades: "Grades 3/4", blurb: "3rd & 4th grade — real schemes and real competition." },
    { id: "g45",  name: "Junior Wolves",       type: "football", grades: "Grades 4/5", blurb: "4th & 5th grade — sharpening skills and football IQ." },
    { id: "cheer",name: "Junior Wolves Cheer", type: "cheer",    grades: "Grades 1st–5th", blurb: "Sideline & competition cheer for grades 1st–5th." }
  ],

  /* ----- Registration fees (UPDATE with your real pricing) ----------- */
  fees: {
    note: "Final pricing and any early-bird discounts are set in our registration portal. The amounts below are a guide — confirm at sign-up.",
    rows: [
      { item: "Tackle Football (per player)", price: "Confirm at registration" },
      { item: "Cheerleading (per athlete)",   price: "Confirm at registration" },
      { item: "Multi-child discount",         price: "Ask us — families come first" }
    ],
    includes: [
      "Season practices and games",
      "Player/cheer placement on a Junior Wolves team",
      "Coaching from our volunteer staff",
      "Being part of the Rome Wolves football tradition"
    ]
  },

  /* ----- What to bring / how to register ----------------------------- */
  registerSteps: [
    { step: "1", title: "Register online", text: "Complete your athlete's registration right here on our site — it only takes a few minutes." },
    { step: "2", title: "Upload documents", text: "Have your child's birth certificate and any required forms ready to upload." },
    { step: "3", title: "Get fitted & equipped", text: "We'll share equipment hand-out and fitting dates by email and on Facebook." },
    { step: "4", title: "Show up & Fear the Pack", text: "Come to practice ready to work. Cleats, water, and a great attitude required." }
  ],

  /* ----- Registration engine settings -------------------------------- */
  registration: {
    payLater: true,           // we collect info now and arrange payment separately
    sizes: ["Youth S", "Youth M", "Youth L", "Youth XL", "Adult S", "Adult M", "Adult L"],
    grades: ["1st", "2nd", "3rd", "4th", "5th"],
    requireBirthCertificate: false,  // upload is optional; families may bring a copy in person
    confirmMessage: "Your athlete's spot is reserved. A board member will follow up by email with payment details and next steps. Welcome to the Pack!",
    feeNote: "Registration fees are confirmed after sign-up. We'll email payment options — and we never want cost to keep a kid off the field, so just ask about multi-child discounts or assistance."
  },

  /* ----- News & updates ----------------------------------------------
     Newest first. category options: "Practice", "Event", "Fundraiser",
     "Registration", "Announcement". Dates are YYYY-MM-DD. */
  news: [
    {
      date: "2026-07-01",
      category: "Announcement",
      title: "No training this week — Happy 4th of July!",
      body: "Hey Wolfpack! Just a reminder that there's no training this week. Enjoy the break and have a safe, happy 4th of July weekend — we'll see everyone back and ready to work next week!"
    },
    {
      date: "2026-06-25",
      category: "Event",
      image: "/assets/img/cheer-camp-2026.png",
      title: "Cheer Camp — Cheer Loud, Dance Proud!",
      body: "Attention all families in Rome & Floyd County! Our \"Cheer Loud, Dance Proud\" Cheer Camp runs July 13–16, 10 AM–2 PM at Kingdom Church International (5415 Calhoun Rd NE, Adairsville, GA). For grades 1st–5th — high-energy routines, dance, jumps, and stunts (beginner to intermediate), all focused on empowering young girls: building character, confidence, and new friendships. $100 includes daily lunch and an official Cheer Camp t-shirt. To register, email romejuniorwolves@gmail.com or message us on Facebook."
    },
    {
      date: "2026-06-18",
      category: "Practice",
      title: "Training update for the Wolf Pack",
      body: "Training was canceled today — see you all next Tuesday. Offseason training continues Mondays, Tuesdays & Thursdays, 6:00–8:00 PM at Old Rome Middle School. Watch here and Facebook for weather and schedule changes."
    },
    {
      date: "2026-06-02",
      category: "Practice",
      title: "Hey Wolf Pack — back on the field!",
      body: "We're very excited to get back on the field today. Bring water, cleats, and energy. Offseason training runs Mondays, Tuesdays & Thursdays from 6:00–8:00 PM through the summer. Let's get to work."
    },
    {
      date: "2026-05-21",
      category: "Fundraiser",
      title: "Raffle drawing complete — thank you!",
      body: "Our $10 raffle for a PS5, a 75\" Smart TV, and Ring doorbells has been drawn. Huge thanks to everyone who bought tickets and helped fund the 2026 season. The Pack appreciates you!"
    },
    {
      date: "2026-05-18",
      category: "Event",
      title: "Youth Football Camp with the Rome Wolves",
      body: "Our young athletes got to learn from Rome High School Head Coach Bill Stewart and the Rome Wolves football staff. Days like this are exactly why the Junior Wolves exist — building the next generation of Wolves."
    },
    {
      date: "2026-03-10",
      category: "Announcement",
      title: "2026 rosters are set — camps & training continue",
      body: "Our 2026 teams are locked in. Didn't grab a roster spot this year? You can still get in the game: offseason training runs Mondays, Tuesdays & Thursdays, and we host youth camps through the season. Email us or follow on Facebook to join."
    }
  ],

  /* ----- Key dates & events ------------------------------------------
     status is auto-calculated from the date, but you can pin one as
     featured:true to highlight it on the home page. */
  events: [
    {
      date: "2026-07-13",
      title: "Cheer Camp — Cheer Loud, Dance Proud",
      time: "10:00 AM – 2:00 PM · July 13–16",
      location: "Kingdom Church International · 5415 Calhoun Rd NE, Adairsville, GA",
      blurb: "Four days of high-energy cheer for grades 1–5 — routines, dance, jumps & stunts (beginner to intermediate). $100 includes daily lunch and an official Cheer Camp t-shirt. Email romejuniorwolves@gmail.com to register.",
      featured: true
    },
    {
      date: "2026-08-01",
      title: "Fall Season Practice Begins",
      time: "TBA",
      location: "Old Rome Middle School · 1000 Veterans Memorial Hwy NE, Rome, GA",
      blurb: "Regular-season practices ramp up. Exact dates and times announced to registered families.",
      featured: true
    },
    {
      date: "2026-09-05",
      title: "Season Kickoff Weekend (Tentative)",
      time: "TBA",
      location: "TBA",
      blurb: "First games of the fall season. Full schedule released closer to kickoff.",
      featured: true
    },
    {
      date: "2026-05-18",
      title: "Youth Football Camp",
      time: "See flyer",
      location: "Rome, GA",
      blurb: "Camp with Rome High School Head Coach Bill Stewart and the Rome Wolves staff."
    }
  ],

  /* ----- Game schedule -----------------------------------------------
     Add games here once the league releases the schedule. Set
     scheduleReleased to true to switch the page from "coming soon".
     result: leave "" before the game; fill "W 21-14" / "L 6-20" after. */
  scheduleReleased: false,
  schedule: [
    // SAMPLE rows — replace with the real fall schedule:
    { date: "2026-09-05", opponent: "TBD", home: true,  time: "TBA", location: "Home", result: "" },
    { date: "2026-09-12", opponent: "TBD", home: false, time: "TBA", location: "Away", result: "" },
    { date: "2026-09-19", opponent: "TBD", home: true,  time: "TBA", location: "Home", result: "" }
  ],

  /* ----- Teams & rosters ---------------------------------------------
     Each team links to a division above. Add players to the roster.
     The SAMPLE players are placeholders so you can see the layout —
     replace them with your real roster (or clear the array to show
     "roster coming soon"). */
  teams: [
    { divisionId: "g12",  name: "Grades 1/2",       coach: "TBA", roster: [] },
    { divisionId: "g23",  name: "Grades 2/3",       coach: "TBA", roster: [] },
    { divisionId: "g34",  name: "Grades 3/4",       coach: "TBA", roster: [
      { number: "7",  name: "Sample Player", position: "QB / DB", grade: "4th", photo: "", sample: true, bio: "This is sample data so you can see the profile layout — replace with your real roster in assets/js/data.js." },
      { number: "22", name: "Sample Player", position: "RB / LB", grade: "3rd", photo: "", sample: true },
      { number: "55", name: "Sample Player", position: "OL / DL", grade: "4th", photo: "", sample: true },
      { number: "12", name: "Sample Player", position: "WR / CB", grade: "3rd", photo: "", sample: true },
      { number: "80", name: "Sample Player", position: "TE / DE", grade: "4th", photo: "", sample: true },
      { number: "3",  name: "Sample Player", position: "K / WR",  grade: "3rd", photo: "", sample: true }
    ] },
    { divisionId: "g45",  name: "Grades 4/5",       coach: "TBA", roster: [] },
    { divisionId: "cheer",name: "Cheer — Grades 1st–5th", coach: "TBA", roster: [] }
    /* To publish a roster, fill its array, e.g.:
       roster: [ { number: "7", name: "First Last", position: "QB / DB", grade: "4th" } ] */
  ],

  /* ----- Coaching staff (replace placeholders) ----------------------- */
  coaches: [
    { name: "Head Football Coach", role: "Head Coach", team: "Football", photo: "", bio: "Our volunteer football staff is announced before each season. Sample profile — swap in your coach's name, photo, and a short bio.", sample: true },
    { name: "Head Cheer Coach", role: "Head Coach", team: "Cheer", photo: "", bio: "Leads the Junior Wolves cheer program. Sample profile — add your coach's name, photo, and bio.", sample: true },
    { name: "Assistant Coach", role: "Assistant Coach", team: "Program", photo: "", bio: "Assistant coaches run drills and support game days. Want to coach? Email us — we'd love your help.", sample: true }
  ],

  /* ----- Sponsors -----------------------------------------------------
     tier: "champion" | "varsity" | "community". Add a logo file to
     assets/img/sponsors/ and reference it, or leave logo "" for a
     text card. */
  sponsors: [
    { name: "Your Business Here", tier: "varsity", url: "", logo: "", note: "Become a sponsor", placeholder: true },
    { name: "Your Business Here", tier: "community", url: "", logo: "", note: "Become a sponsor", placeholder: true },
    { name: "Your Business Here", tier: "community", url: "", logo: "", note: "Become a sponsor", placeholder: true }
  ],

  /* ----- Photo gallery -----------------------------------------------
     Drop images into assets/img/gallery/ and list them here. */
  gallery: [
    { src: "/assets/img/hero.jpg", caption: "Game day — the Pack takes the field" }
    // Add more: { src: "assets/img/gallery/your-photo.jpg", caption: "Game day" }
  ],

  /* ----- FAQ ---------------------------------------------------------- */
  faqs: [
    { q: "What grades can play?", a: "We field youth football teams by grade level (grades 1st–5th), plus a cheer program for grades 1st–5th. Your athlete's team is set by their grade." },
    { q: "When and where are practices?", a: "Practice is Mondays, Tuesdays & Thursdays, 6:00–8:00 PM at Old Rome Middle School (1000 Veterans Memorial Hwy NE, Rome, GA). Regular-season practice schedules are shared with registered families before the fall season." },
    { q: "When are games played?", a: "Games are played on Saturdays during the fall season. The full game schedule is released closer to kickoff — watch the Schedule page and our Facebook for updates." },
    { q: "How do I register?", a: "Click any \"Register\" button on this site to go to our Cobb Football League portal. You'll need your child's birth certificate and a few minutes to complete the forms." },
    { q: "What equipment do we need?", a: "Football players need cleats and a water bottle to start; the program coordinates helmets and pads. Cheer athletes receive uniform details after signing up. We'll send fitting and hand-out dates by email." },
    { q: "Are you connected to Rome High School?", a: "Yes. The Junior Wolves are the youth feeder program for the Rome High School and Rome Middle School Wolves — same wolf, same red and gold, same tradition." },
    { q: "How can I help or sponsor the team?", a: "We're a community-powered program. Email us about coaching, volunteering, or sponsoring a team — see the Sponsors and Contact pages." }
  ]
};
