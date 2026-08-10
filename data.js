const EXERCISES = [
  {
    id: "squat",
    name: "Barbell Back Squat",
    difficulty: "Intermediate",
    equipment: "Barbell & Squat Rack",
    musclesWorked: ["Quadriceps", "Gluteus Maximus", "Hamstrings", "Core"],
    instructions: [
      "Set the barbell at shoulder-height on the rack. Step under, resting the bar across your upper back/traps.",
      "Unrack the bar and take two steps backward. Set your feet slightly wider than shoulder-width apart, toes pointing 15 degrees out.",
      "Inhale, brace your core, and initiate the movement by pushing your hips back and bending your knees.",
      "Lower yourself under control until your thighs are at least parallel to the floor (hip crease below knee joint).",
      "Drive aggressively through your mid-foot to stand back up, exhaling at the top of the movement."
    ],
    mistakes: [
      "Letting your knees cave inward (valgus collapse). Always force your knees outward to track with your toes.",
      "Lifting your heels off the ground, which shifts undue stress to your knee joints.",
      "Butt wink: rounding your lower back at the bottom of the squat, risking lumbar spine compression."
    ],
    benefits: [
      "The undisputed king of lower-body development.",
      "Triggers massive systemic anabolic hormone release (testosterone and growth hormone).",
      "Improves functional mobility, core stability, and athletic vertical power."
    ],
    sets: 4,
    reps: 10,
    restTimeSec: 90,
    caloriesBurned: 110,
    alternative: "Goblet Squat or Leg Press",
    videoPlaceholder: "Deep squat stance, knees aligned over toes, barbell loaded perfectly across traps."
  },
  {
    id: "pushup",
    name: "Military Pushup",
    difficulty: "Beginner",
    equipment: "Bodyweight",
    musclesWorked: ["Pectoralis Major", "Triceps Brachii", "Anterior Deltoid", "Core"],
    instructions: [
      "Place your hands on the floor slightly wider than shoulder-width, fingers spread flat.",
      "Extend your legs straight behind you, feet together, creating a straight line from head to heels.",
      "Brace your abs and glutes to lock your spine and prevent your hips from sagging.",
      "Lower your body under control, keeping your elbows tucked at a 45-degree angle to your torso.",
      "Once your chest is an inch from the floor, press through your palms to return to the starting plank position."
    ],
    mistakes: [
      "Flaring elbows out to 90 degrees, which places extreme impingement pressure on the rotator cuff.",
      "Letting the lower back sag, which disengages the core and puts strain on the lumbar vertebrae.",
      "Short-changing the range of motion (doing half-reps). Push from full chest extension to complete lockout."
    ],
    benefits: [
      "Superb indicator of functional upper-body pressing strength.",
      "Requires zero equipment and can be performed anywhere.",
      "Highly adaptable with progressions (weighted, incline, plyometric)."
    ],
    sets: 3,
    reps: 15,
    restTimeSec: 60,
    caloriesBurned: 45,
    alternative: "Incline Pushups or Dumbbell Chest Press",
    videoPlaceholder: "Plank posture, chest lowered precisely to the floor, head in neutral alignment."
  },
  {
    id: "deadlift",
    name: "Conventional Barbell Deadlift",
    difficulty: "Advanced",
    equipment: "Barbell & Bumper Plates",
    musclesWorked: ["Hamstrings", "Erector Spinae (Lower Back)", "Gluteus Maximus", "Latissimus Dorsi", "Trapezius"],
    instructions: [
      "Stand with your feet hip-width apart under the barbell. The bar should bisect your mid-foot (1 inch from shins).",
      "Hinge at your hips and bend your knees slightly to grab the bar with a shoulder-width double-overhand grip.",
      "Flatten your back, drop your hips, pull your chest up, and pull the slack out of the barbell.",
      "Drive your feet into the floor, pulling the bar vertically while keeping it touching your shins.",
      "Lock out at the top by fully extending your hips and knees, standing tall without hyperextending your spine."
    ],
    mistakes: [
      "Rounding the spine (cat-back) under load, which exposes the lumbar disks to catastrophic herniation.",
      "Starting with the hips too low (squatting the weight up) or too high, which destroys mechanical advantage.",
      "Shrugging or bending your arms at lockout. Keep your arms straight; they act strictly as cables."
    ],
    benefits: [
      "The ultimate builder of posterior chain power and grip strength.",
      "Directly strengthens the back and core muscles, protecting against desk-sitting posture degeneration.",
      "High metabolic cost accelerates caloric expenditure and fat oxidation."
    ],
    sets: 4,
    reps: 5,
    restTimeSec: 120,
    caloriesBurned: 130,
    alternative: "Trap Bar Deadlift or Romanian Deadlift",
    videoPlaceholder: "Explosive pull, neutral spine, hips and shoulders rising at identical speed."
  },
  {
    id: "pullup",
    name: "Wide-Grip Pullup",
    difficulty: "Intermediate",
    equipment: "Pullup Bar",
    musclesWorked: ["Latissimus Dorsi (Lats)", "Biceps Brachii", "Rhomboids", "Lower Trapezius"],
    instructions: [
      "Hang from the pullup bar with an overhand grip (palms facing away), hands wider than shoulder-width.",
      "Start from a dead hang with arms fully extended and shoulders packed (pulled down into their sockets).",
      "Squeeze your shoulder blades together and pull your body up by driving your elbows down toward your ribs.",
      "Continue pulling until your chin completely clears the horizontal plane of the bar.",
      "Lower yourself slowly under complete control back to the dead hang position."
    ],
    mistakes: [
      "Using momentum (kipping or swinging) to cheat the rep. Keep the lower body quiet.",
      "Failing to go all the way down, leaving the lats in a shortened state and losing eccentric benefits.",
      "Allowing the shoulders to round forward at the top of the movement, which pinches shoulder structures."
    ],
    benefits: [
      "Develops the coveted wide 'V-Taper' aesthetic.",
      "Exceptional test of relative bodyweight strength and robust scapular health.",
      "Improves overall grip endurance and forearm hypertrophy."
    ],
    sets: 4,
    reps: 8,
    restTimeSec: 90,
    caloriesBurned: 70,
    alternative: "Lat Pulldown or Band-Assisted Pullups",
    videoPlaceholder: "Wide overhand grip pull, chest pulling up towards the metal bar, core braced."
  }
];

const PROGRAMS = [
  {
    id: "fat-loss",
    name: "Beast Shred: AI Fat Loss Program",
    slug: "fat-loss",
    description: "A fast-paced, high-intensity hybrid training course leveraging metabolic conditioning and strength retention to maximize subcutaneous fat oxidation under 8 weeks.",
    durationWeeks: 8,
    difficulty: "Intermediate",
    equipmentRequired: "Dumbbells, Kettlebells, Rowing Machine",
    caloriesPerSession: 550,
    weeklyPlan: [
      { day: "Monday", workout: "Metabolic Resistance Training (Upper Focus)", duration: "45 Mins" },
      { day: "Tuesday", workout: "HIIT Sprint Intervals + LISS Cardio", duration: "40 Mins" },
      { day: "Wednesday", workout: "Lower Body Hypertrophy Endurance", duration: "50 Mins" },
      { day: "Thursday", workout: "Active Recovery: Mobility & Flow", duration: "30 Mins" },
      { day: "Friday", workout: "Metabolic Resistance Training (Lower Focus)", duration: "45 Mins" },
      { day: "Saturday", workout: "Full Body Functional Conditioning Sweat", duration: "55 Mins" },
      { day: "Sunday", workout: "Complete Rest & Muscle Rejuvenation", duration: "Rest" }
    ],
    trainerName: "Coach Shweta & AI Kabir",
    nutritionTip: "Maintain a 400-calorie deficit. Keep protein at 2.0g per kg of bodyweight to preserve lean contractile muscle mass."
  },
  {
    id: "muscle-building",
    name: "Beast Bulk: Hypertrophy Masterclass",
    slug: "muscle-building",
    description: "Scientific mechanical tension and progressive overload protocol targeting deep muscular hypertrophy, sarcoplasmic volume expansions, and density.",
    durationWeeks: 12,
    difficulty: "Intermediate",
    equipmentRequired: "Full Gym Barbell & Machine Access",
    caloriesPerSession: 400,
    weeklyPlan: [
      { day: "Monday", workout: "Push Day A (Chest, Shoulders, Triceps Focus)", duration: "60 Mins" },
      { day: "Tuesday", workout: "Pull Day A (Lats, Upper Back, Biceps Focus)", duration: "60 Mins" },
      { day: "Wednesday", workout: "Legs Day A (Quads & Calves Dominant)", duration: "65 Mins" },
      { day: "Thursday", workout: "Active Rest or Core & Forearm Accessories", duration: "30 Mins" },
      { day: "Friday", workout: "Push Day B (Incline Press & Overhead Focus)", duration: "60 Mins" },
      { day: "Saturday", workout: "Legs & Pull Day B (Hamstrings & Back Thickness)", duration: "65 Mins" },
      { day: "Sunday", workout: "Complete Rest Day for Protein Synthesis", duration: "Rest" }
    ],
    trainerName: "Trainer Rohit",
    nutritionTip: "Aim for a 300-calorie surplus. Consume at least 4g of carbohydrates per kg of body weight to fuel heavy mechanical training."
  },
  {
    id: "calisthenics",
    name: "AeroBeast: Progressive Calisthenics",
    slug: "calisthenics",
    description: "Unlock complete spatial awareness and supreme relative strength. Master the handstand, muscle-up, human flag, and front lever using only bodyweight leverage.",
    durationWeeks: 10,
    difficulty: "Advanced",
    equipmentRequired: "Pull-up Bar, Gymnastic Rings, Parallel Bars",
    caloriesPerSession: 450,
    weeklyPlan: [
      { day: "Monday", workout: "Straight-Arm Scapular Push/Pull Strength", duration: "50 Mins" },
      { day: "Tuesday", workout: "Bent-Arm Muscle-Up Progressions", duration: "50 Mins" },
      { day: "Wednesday", workout: "Handstand Balance & Shoulder Endurance", duration: "45 Mins" },
      { day: "Thursday", workout: "Core Levers & Compression Exercises", duration: "40 Mins" },
      { day: "Friday", workout: "Rings Weighted Dips & Pull-ups", duration: "55 Mins" },
      { day: "Saturday", workout: "Calisthenics Lower Body Explosiveness (Pistols)", duration: "50 Mins" },
      { day: "Sunday", workout: "Total System Rest & Joint Re-oiling", duration: "Rest" }
    ],
    trainerName: "Coach Shweta",
    nutritionTip: "Stay lean. A lower body fat percentage drastically improves your power-to-weight ratio, facilitating body leverage mechanics."
  },
  {
    id: "crossfit",
    name: "Beast WOD: Elite CrossFit Conditioning",
    slug: "crossfit",
    description: "Constantly varied, functional movements executed at high intensity. Combine Olympic lifting, plyometrics, and row sprints to forge unstoppable cardio lungs.",
    durationWeeks: 6,
    difficulty: "Advanced",
    equipmentRequired: "Bumper Plates, Rowing Machine, Plyo Box, Rings",
    caloriesPerSession: 680,
    weeklyPlan: [
      { day: "Monday", workout: "Olympic Snatch Tech + WOD 'Helen'", duration: "55 Mins" },
      { day: "Tuesday", workout: "Clean & Jerk + Rowing Row intervals", duration: "60 Mins" },
      { day: "Wednesday", workout: "WOD 'Cindy' (Gymnastics endurance)", duration: "45 Mins" },
      { day: "Thursday", workout: "LISS Cardiovascular Aerobic Threshold Builder", duration: "50 Mins" },
      { day: "Friday", workout: "Heavy Front Squat + WOD 'Fran'", duration: "50 Mins" },
      { day: "Saturday", workout: "Partner Hero WOD (Full Body Grit)", duration: "70 Mins" },
      { day: "Sunday", workout: "Deep Foam Rolling, Stretching & Rest", duration: "Rest" }
    ],
    trainerName: "Trainer Rohit & Coach Kabir",
    nutritionTip: "Supercharge glycogen. CrossFit drains muscles rapidly; consume high-molecular-weight carbs immediately before and during workouts."
  }
];

const TRAINERS = [
  {
    id: "kabir-ai",
    name: "Coach Kabir (AI Virtual Avatar)",
    specialization: "AI-Interactive Real-time Coaching, Form Corrections & Biometrics",
    experienceYears: 10,
    certifications: [
      "Certified Strength & Conditioning Specialist (CSCS - simulated)",
      "Olympic Lift Biomechanics Analyst",
      "Dynamic AI Form Verification Patent Lead"
    ],
    languages: ["English", "Hindi", "Hinglish"],
    rating: 4.9,
    reviewsCount: 1420,
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    availability: ["Monday to Sunday, 24/7 Unlimited Access"],
    introVideoText: "Hey! Coach Kabir here. I'm your interactive AI video personal coach. Start our stream anytime, turn on your webcam, or describe your exercise, and let's count reps and correct your form instantly!"
  },
  {
    id: "rohit",
    name: "Trainer Rohit",
    specialization: "Heavy Powerlifting, Powerbuilding & Core Strength",
    experienceYears: 8,
    certifications: [
      "IPF Certified Powerlifting Coach",
      "National Deadlift Champion (Mumbai Zone)",
      "K1 Gym Instructor Gold Level"
    ],
    languages: ["English", "Hindi", "Marathi"],
    rating: 4.85,
    reviewsCount: 380,
    imageUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=600&auto=format&fit=crop",
    availability: ["Mon, Wed, Fri: 7 AM - 12 PM", "Tue, Thu: 4 PM - 9 PM"],
    introVideoText: "What is up Beests! I don't believe in excuses, only heavy bars. Let's stack the iron and break personal records safely."
  },
  {
    id: "shweta",
    name: "Coach Shweta",
    specialization: "Acrobatic Calisthenics, Mobility Flows, and Women's Conditioning",
    experienceYears: 6,
    certifications: [
      "WCO (World Calisthenics Org) Elite Coach",
      "RYS-200 Registered Ashtanga Yoga Teacher",
      "Functional Movement Screen (FMS) Specialist"
    ],
    languages: ["English", "Hindi"],
    rating: 4.92,
    reviewsCount: 290,
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    availability: ["Mon to Sat: 6 AM - 10 AM", "Mon to Fri: 5 PM - 8 PM"],
    introVideoText: "True power is moving your own body with absolute freedom, control, and zero friction. Let's unlock your kinetic potential."
  }
];

const MEMBERSHIPS = [
  {
    id: "lite",
    name: "Be Beast Lite",
    priceInr: 1999,
    period: "Monthly",
    features: [
      "Full access to the strength gym floor & cardio theater",
      "Complimentary high-speed WiFi and luxury showers",
      "Standard keycard entry",
      "Basic lockers access"
    ],
    popular: false
  },
  {
    id: "pro",
    name: "Be Beast Pro",
    priceInr: 3999,
    period: "Monthly",
    features: [
      "All Lite Tier Access",
      "Unrestricted entry to CrossFit and Calisthenics playgrounds",
      "Unlimited group classes (HIIT, Spin, Zumba, Yoga)",
      "Complimentary steam bath, sauna, and organic juice bar locker access",
      "Monthly human trainer evaluation and customized biweekly charts"
    ],
    popular: true
  },
  {
    id: "elite-ai",
    name: "Be Beast Elite AI Access",
    priceInr: 5999,
    period: "Monthly",
    features: [
      "All Pro Tier Access",
      "Unlimited 24/7 Real-Time AI Virtual Coach (Kabir) video consults",
      "Dynamic AI Form Correction with webcam processing",
      "Automated Daily AI Meal Planner & instant micro/macro adjusters",
      "Complimentary pre-workout and protein shake daily at Health Lounge",
      "Lifetime VIP bookings for celebrity trainer workshops"
    ],
    popular: false
  }
];

const TRANSFORMATION_STORIES = [
  {
    name: "Rahul Deshmukh",
    age: 28,
    profession: "Software Engineer",
    beforeWeight: 96,
    afterWeight: 74,
    timeframe: "6 Months",
    stat: "-22kg Fat Melted",
    story: "Sitting 10 hours a day ruined my spine and inflated my weight. Be Beast Gym's AI Tracker predicted my weight loss trajectory down to the week! Coach Kabir's squat correction stopped my back pain completely. Truly revolutionized my health.",
    imageUrlBefore: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    imageUrlAfter: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
  },
  {
    name: "Ananya Sharma",
    age: 31,
    profession: "Corporate Attorney",
    beforeWeight: 54,
    afterWeight: 58,
    timeframe: "4 Months",
    stat: "+4kg Pure Lean Muscle",
    story: "I wanted functional calisthenics control. Under Coach Shweta and the AI meal metrics, I can now perform strict pull-ups and handstands! I have never felt more energetic, athletic, or mentally sharp.",
    imageUrlBefore: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    imageUrlAfter: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
  }
];

const MOCK_USERS = [
  { name: "Anant Badoliya", mobile: "+91 9999999999", email: "anantbadoliya@gmail.com", membershipTier: "Elite AI Access", weight: 78, height: 175, age: 26, goal: "Strength", experience: "Intermediate", medical: "None", dietPreference: "Veg", proteinPref: "Whey", region: "Mumbai", budget: "Premium", isLoggedIn: true, id: "1", role: "user", enrolledProgram: "Beast Shred: AI Fat Loss Program" },
  { name: "Rohit Sharma", mobile: "+91 8888888888", email: "rohit@gmail.com", membershipTier: "Beast Pro", weight: 85, height: 180, age: 29, goal: "Power", experience: "Advanced", medical: "None", dietPreference: "Non-Veg", proteinPref: "Chicken", region: "Mumbai", budget: "Moderate", isLoggedIn: true, id: "2", role: "user", enrolledProgram: "Beast Bulk: Hypertrophy Masterclass" },
  { name: "Pooja Hegde", mobile: "+91 7777777777", email: "pooja@gmail.com", membershipTier: "Beast Lite", weight: 58, height: 168, age: 24, goal: "Mobility", experience: "Beginner", medical: "None", dietPreference: "Veg", proteinPref: "Paneer", region: "Mumbai", budget: "Basic", isLoggedIn: true, id: "3", role: "user", enrolledProgram: "AeroBeast: Progressive Calisthenics" }
];
