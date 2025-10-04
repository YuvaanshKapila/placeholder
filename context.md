Neurodivergent Navigation & Support Web App - Complete Specification
Project Overview
A Next.js web application that uses phone cameras and OpenCV to help neurodivergent people navigate public environments more comfortably. The app focuses on three core functionalities: predicting crowd levels at destinations, real-time crowd detection with rerouting, and environmental sound monitoring. The UI must be visually appealing with depth and good colors to overcome the cost-benefit analysis of using such an app in public.
Core Technology Stack
Frontend Framework: Next.js with React
Camera Integration: OpenCV.js for crowd detection
AI Integration: Google Gemini API for intelligent analysis and recommendations
Voice Generation: Eleven Labs API for voice announcements
Authentication: Auth0
Maps: Google Maps API and Geolocation API
Deployment: Vercel
Domain: GoDaddy
UI Components: Tailwind CSS with Toast notifications for mobile
Database: Mock database with realistic Yelp review data and crowd patterns
Core Feature #1: Peak Hours Detection & Crowd Prediction
Web Scraping System for Crowd Analysis
The app will scrape and analyze data from multiple sources to determine peak hours:
Data Collection
Yelp Reviews Database:


Create mock database with 10,000+ realistic review entries
Extract timestamps from reviews
Parse review text for crowd-related keywords: "busy", "packed", "empty", "wait time", "crowded", "quiet"
Analyze review patterns by day of week and time
Include special events mentions (concerts, games, holidays)
Google Popular Times Integration:


Real-time occupancy data when available
Historical patterns for each hour of each day
Live busy-ness indicators
Additional Data Sources:


Google Reviews scraping for crowd mentions
TripAdvisor reviews for tourist locations
Social media check-ins and location tags
Gemini-Powered Analysis
// Use Gemini to analyze scraped data and predict crowd levels
const analyzeCrowdPatterns = async (reviews, location) => {
  const prompt = `
    Analyze these reviews and timestamps to determine:
    1. Peak hours for each day of the week
    2. Least crowded times
    3. Average wait times
    4. Special events that cause crowds
    Reviews: ${reviews}
    Location type: ${location.type}
  `;
  
  const geminiResponse = await gemini.generateContent(prompt);
  return geminiResponse.crowdPrediction;
};

UI Display for Crowd Predictions
Visual Heat Map: Color-coded calendar showing crowd levels
Deep red: Extremely crowded (avoid)
Orange: Moderately crowded
Yellow: Some people
Green: Quiet/empty
Best Times Suggestion: AI-generated recommendations
Confidence Score: Based on data availability
Alternative Times: If desired time is crowded
Core Feature #2: Real-Time Camera-Based Crowd Detection & Navigation
OpenCV Crowd Detection System
Camera Integration
// Initialize camera and OpenCV for crowd detection
const initializeCrowdDetection = async () => {
  const video = document.getElementById('camera-feed');
  const stream = await navigator.mediaDevices.getUserMedia({ 
    video: { 
      facingMode: 'environment',
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    } 
  });
  
  // OpenCV processing for person detection
  const detectPeople = () => {
    // Use OpenCV.js cascade classifiers or YOLO
    // Calculate distance using object size estimation
    // Return array of detected people with distances
  };
};

Distance Calculation
Person Detection: Identify all people in camera view
Distance Estimation:
Use average human height as reference
Calculate distance based on pixel height
Create distance vector for each person
Crowd Density Calculation: People per square meter
Danger Zone Identification: Areas with high density
Intelligent Rerouting System
Outdoor Street Navigation
When crowds are detected ahead:
const calculateAlternativeRoute = async (currentLocation, destination, crowdedArea) => {
  // Use Google Maps API with Gemini for intelligent routing
  const prompt = `
    Current location: ${currentLocation}
    Destination: ${destination}
    Crowded area to avoid: ${crowdedArea}
    Find alternative walking route that avoids the crowd
  `;
  
  const geminiRoute = await gemini.generateContent(prompt);
  const googleMapsRoute = await googleMaps.directions({
    origin: currentLocation,
    destination: destination,
    mode: 'walking',
    avoid: crowdedArea
  });
  
  return combineRoutes(geminiRoute, googleMapsRoute);
};

Vector Plotting: Show crowd as obstacle on map
Multiple Route Options:
Fastest route avoiding crowd
Quietest route (through parks/side streets)
Minimal crowd exposure route
Turn-by-Turn Navigation: Voice and visual directions
Indoor Building Navigation
When in buildings without mapped streets:
const indoorCrowdAvoidance = (crowdDirection) => {
  const directions = {
    front: ["Turn left to avoid crowd", "Turn right to avoid crowd", "Step back and wait"],
    left: ["Continue straight", "Turn right", "Step back"],
    right: ["Continue straight", "Turn left", "Step back"],
    surrounding: ["Find quiet space", "Wait for crowd to disperse", "Return to previous location"]
  };
  
  return directions[crowdDirection];
};

Simple Directional Commands: Left, right, back, wait
Visual Arrows: Large, clear directional indicators
Quiet Space Finder: Locate nearest low-traffic area
Emergency Exit Detection: Always show nearest exit
Voice Announcement System with Eleven Labs
const announceDirections = async (instruction, userSettings) => {
  const voice = await elevenLabs.generate({
    text: instruction,
    voice: userSettings.preferredVoice || 'calm-female',
    speed: userSettings.speechRate || 1.0,
    emotion: 'calm-supportive'
  });
  
  voice.play();
};

Customizable Voices: 20+ voice options
Adjustable Speed: 0.5x to 2.0x
Emotion Settings: Calm, encouraging, neutral
Volume Adaptation: Based on ambient noise
Core Feature #3: Sound Level Monitoring & Warnings
Decibel Detection System
const monitorSoundLevels = async () => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(microphone);
  
  source.connect(analyser);
  
  const getDecibels = () => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    // Calculate decibel level
    return calculateDB(dataArray);
  };
};

Sound-Based Warnings
Real-Time Decibel Meter: Visual and numeric display
Sound Pattern Recognition:
Sudden loud noises
Continuous background noise
Music/announcement detection
Predictive Sound Warnings:
Based on venue type (bars are loud Friday nights)
Event calendars (concerts, sports)
Historical sound data
Crowd-Sound Correlation
if (crowdDensity > threshold.high || soundLevel > threshold.loud) {
  // Generate comprehensive warning
  const warning = {
    crowdLevel: crowdDensity,
    soundLevel: soundLevel,
    combinedRisk: calculateSensoryLoad(crowdDensity, soundLevel),
    recommendations: [
      "High sensory environment detected",
      "Consider visiting at quieter time",
      "Noise-cancelling headphones recommended"
    ],
    alternativeTimes: getQuieterTimes(location)
  };
  
  displayWarning(warning);
  suggestReroute(currentLocation, destination);
}

Condition-Specific Features & Settings
AUTISM SPECTRUM FEATURES
Comprehensive Sensory Management
Sensory Profile Configuration:
const autismSettings = {
  sensoryThresholds: {
    crowdTolerance: 'low|medium|high',
    soundSensitivity: 1-10,
    lightSensitivity: 1-10,
    touchAvoidance: true|false,
    smellSensitivity: 1-10
  },
  triggers: [
    'sudden_noises',
    'fluorescent_lights',
    'strong_smells',
    'unexpected_touch',
    'crowded_spaces',
    'loud_music'
  ],
  copingStrategies: [
    'deep_pressure',
    'quiet_space',
    'headphones',
    'fidget_tools',
    'breathing_exercises'
  ]
};

Real-Time Sensory Load Tracking:
Cumulative Sensory Meter: Tracks total sensory input over time
Overload Prediction: Gemini analyzes patterns to predict meltdowns
Break Reminders: "You've been in high-sensory environment for 20 minutes"
Recovery Time Suggestions: Based on individual patterns
Routine & Predictability Support:
Visual Schedule Integration:
 const visualSchedule = {  currentTask: { image: 'grocery_store.png', time: '10:00 AM' },  nextTask: { image: 'home.png', time: '11:00 AM' },  transitionWarning: 5, // minutes before transition  changeAlert: 'Schedule change: Store closes early today'};


Familiar Route Preference: Always suggests known paths when possible
Preparation Tools: "What to expect" cards for new places
Transition Warnings: Gradual alerts before changes
Communication Support:
Emergency Cards: Digital cards explaining autism and needs
Quick Phrases: Pre-set requests like "I need space" or "Too loud"
Non-Verbal Mode: Complete navigation without requiring speech
Environmental Adjustments:
Lighting Warnings: Detects and warns about fluorescent lights
Texture Alerts: Warns about wet floors, gravel, etc.
Pattern Detection: Identifies visually overwhelming patterns
Safe Space Mapping: Marks quiet rooms, sensory rooms
ADHD SUPPORT FEATURES
Focus Management & Task Completion
Intelligent Nudging System:
const adhdNudges = {
  locationBased: {
    trigger: 'near_pharmacy',
    message: 'You\'re near CVS - you needed to pick up medication',
    priority: 'high'
  },
  timeAwareness: {
    trigger: 'in_store_20min',
    message: 'You\'ve been browsing for 20 minutes - time to move on?',
    priority: 'medium'
  },
  taskReminders: {
    trigger: 'leaving_area',
    message: 'Did you get everything on your list?',
    priority: 'high'
  }
};

Distraction Prevention:
Interest Alerts: "GameStop ahead - stay focused on grocery shopping"
Route Lock Mode: Prevents impulsive detours
Time Blindness Support: Regular time check-ins
Hyperfocus Detection: Alerts when stuck in one place too long
Executive Function Support:
Smart Shopping Lists:
 const smartList = {  items: ['milk', 'bread', 'eggs'],  storeLayout: generateOptimalPath(items, storeMap),  crossedOff: [],  autoReminder: 'Check list before leaving store'};


Decision Simplification: "Just pick one" mode for overwhelming choices
Task Chunking: Breaks large tasks into smaller steps
Priority Sorting: AI helps prioritize based on urgency
Motivation & Engagement:
Gamification Elements:
XP points for completed tasks
Achievement badges
Streak counters for routines
Progress bars for shopping trips
Dopamine Scheduling: Variable rewards for task completion
Energy Tracking: Adjusts task difficulty based on energy levels
Celebration Mode: Positive reinforcement for achievements
ADHD-Specific Navigation:
Shortest Path Options: For low-patience moments
Interesting Route: Engaging path when needing stimulation
Body Doubling Feature: Virtual companion for tasks
Movement Breaks: Suggests walking breaks during waits
LEARNING DISABILITIES SUPPORT
DYSLEXIA FEATURES
Comprehensive Text-to-Speech System:
const dyslexiaTextSupport = {
  tts: {
    enabled: true,
    voice: 'clear-british-accent',
    speed: 0.8, // Slower default
    highlighting: true, // Highlight word being read
    syllableBreaks: true // Show syl-la-bles
  },
  textDisplay: {
    font: 'OpenDyslexic',
    size: '18px',
    spacing: '1.5em',
    lineHeight: '2em',
    backgroundColor: '#fff5dc', // Cream background
    textColor: '#000080' // Dark blue text
  }
};

Reading Assistance Tools:
Automatic Reading: All text read aloud automatically
Word Highlighting: Synchronized with speech
Phonetic Spelling: Shows pronunciation for difficult words
Picture Support: Icons and images replace text where possible
Reading Ruler: Digital ruler to track lines
Navigation Adaptations:
Landmark-Based Directions: "Turn at the red building" not street names
Photo Navigation: Shows pictures of each turn
Color-Coded Routes: Different colors for different directions
Audio-First Interface: Voice commands and responses
Symbol Maps: Icons instead of text labels
Additional Dyslexia Support:
const dyslexiaHelpers = {
  colorOverlays: ['blue', 'yellow', 'green', 'pink'], // Irlen syndrome
  contrastModes: ['high', 'inverted', 'dark'],
  readingGuides: ['ruler', 'window', 'highlight'],
  simplifiedText: true, // Converts complex text to simple
  spellChecker: 'advanced' // Context-aware spell check
};

DYSGRAPHIA FEATURES
Comprehensive Writing Assistance:
const dysgraphiaSupport = {
  inputMethods: {
    voiceToText: {
      enabled: true,
      autoCorrect: true,
      punctuationCommands: true
    },
    wordPrediction: {
      enabled: true,
      contextAware: true,
      frequentPhrases: ['I need', 'Where is', 'Thank you']
    },
    templates: {
      messages: ['Running late', 'On my way', 'Need help'],
      reviews: ['Great service', 'Too crowded', 'Quiet place'],
      notes: ['Remember to', 'Don\'t forget', 'Important']
    }
  }
};

Alternative Input Methods:
Voice Notes: Record audio instead of writing
Photo Annotations: Take pictures with voice labels
Drawing Pad: Sketch instead of write
Symbol Keyboard: Common symbols and emojis
Gesture Writing: Swipe patterns for common words
Writing Support Tools:
Sentence Starters: Pre-written beginnings
Auto-Complete: Intelligent phrase completion
Grammar Assistance: Real-time correction
Format Templates: Pre-structured documents
Copy-Paste Library: Frequently used text blocks
Form Filling Assistance:
const formHelper = {
  autoFill: {
    name: 'stored_securely',
    address: 'stored_securely',
    phone: 'stored_securely'
  },
  stepByStep: true, // One field at a time
  voiceInput: true, // Speak instead of type
  validation: 'gentle' // Non-frustrating error messages
};

DYSCALCULIA FEATURES
Visual Mathematics Support:
const dyscalculiaTools = {
  calculator: {
    type: 'visual', // Shows quantities as images
    display: 'large_buttons',
    history: true, // Shows all steps
    voiceInput: true, // Say numbers instead of type
    errorCorrection: 'gentle'
  },
  moneyManagement: {
    priceDisplay: 'visual_coins', // Shows money as images
    budgetTracker: 'color_coded', // Red when over budget
    tipCalculator: 'preset_options', // 15%, 18%, 20% buttons
    changeCalculator: 'automatic'
  }
};

Practical Math Applications:
Shopping Assistant:

 const shoppingMath = {
  runningTotal: 'visual_display', // Shows cart filling up
  budgetBar: 'color_gradient', // Green to red
  saleCalculator: 'simple_percentage', // "20% off = pay $8 not $10"
  quantityHelper: 'visual_groups' // Shows 5 items as hand image
};


Time Management:

 const timeSupport = {
  display: 'analog_and_digital',
  duration: 'visual_timeline', // Shows time as bar filling
  alarms: 'progressive', // Multiple warnings
  estimation: 'landmark_based' // "One TV episode" not "30 minutes"
};


Distance & Navigation:

 const distanceHelp = {
  display: 'landmarks', // "3 blocks" or "2 stores away"
  walking_time: 'visual_steps', // Footstep icons
  comparison: 'relative', // "Same as walk to park"
  progress: 'percentage_bar' // Not numbers
};


Number Simplification:
Rounding Options: Always round to nearest 5 or 10
Estimation Mode: "About" instead of exact
Visual Quantities: Dots, bars, or pictures
Pattern Recognition: Groups numbers visually
No Mental Math Mode: Always shows calculator
Daily Life Math Support:
Bill Splitting: Visual division with fair share highlighting
Recipe Scaling: Visual measuring cups/spoons
Temperature Conversion: Color-coded comfort zones
Unit Conversion: Automatic with visual comparison
Calendar Math: Visual day counting
User Interface Design
Mobile-First Responsive Design
PWA Installation: Installable as app on phones
Touch Optimized: Minimum 48px touch targets
Gesture Support: Swipe navigation
One-Handed Mode: Bottom navigation bar
Landscape Support: Full rotation support
Visual Design System
const uiDesign = {
  depth: {
    shadows: 'subtle_elevation', // Material Design inspired
    gradients: 'soft_transitions',
    glassmorphism: 'optional', // Modern frosted glass effect
    animations: 'smooth_60fps'
  },
  colors: {
    schemes: ['calming_blues', 'nature_greens', 'warm_sunset', 'high_contrast'],
    customizable: true,
    darkMode: true,
    colorBlindModes: ['protanopia', 'deuteranopia', 'tritanopia']
  },
  layout: {
    complexity: 'adaptive', // Simplifies under stress
    whitespace: 'generous',
    consistency: 'strict',
    predictability: 'high'
  }
};

Accessibility Features
Screen Reader Support: Full ARIA labels
Keyboard Navigation: Complete keyboard access
Voice Control: Hands-free operation
Adjustable Everything: Text size, colors, sounds, speed
Reduce Motion: Respects system preferences
Mock Database Structure
Realistic Data Generation
const mockDatabase = {
  yelpReviews: {
    count: 10000,
    venues: 500,
    timespan: '2 years',
    fields: {
      reviewText: 'realistic crowd mentions',
      timestamp: 'distributed realistically',
      rating: 1-5,
      waitTime: 'extracted from text',
      crowdKeywords: ['packed', 'empty', 'busy', 'quiet', 'moderate']
    }
  },
  
  venues: {
    restaurants: 200,
    retail: 150,
    services: 100,
    entertainment: 50,
    each_includes: {
      peakHours: 'by day of week',
      averageDecibels: 'by time',
      accessibility: 'detailed features',
      quietSpaces: 'mapped areas'
    }
  },
  
  crowdPatterns: {
    seasonal: 'summer vs winter',
    events: 'concerts, sports, holidays',
    weather: 'rain vs sunny',
    dayOfWeek: 'monday-sunday patterns'
  }
};

Deployment Configuration
Vercel Deployment
// vercel.json
{
  "framework": "nextjs",
  "functions": {
    "api/crowd/*": {
      "maxDuration": 30
    },
    "api/gemini/*": {
      "maxDuration": 60
    }
  },
  "env": {
    "ELEVEN_LABS_API_KEY": "@eleven_labs_key",
    "GEMINI_API_KEY": "@gemini_key",
    "AUTH0_SECRET": "@auth0_secret",
    "GOOGLE_MAPS_API_KEY": "@google_maps_key"
  }
}

Progressive Web App Configuration
// next.config.js
module.exports = {
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10
        }
      }
    ]
  }
};

Integration Details
Gemini API Integration
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeEnvironment = async (data) => {
  const model = gemini.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
    Analyze this environment for neurodivergent accessibility:
    Crowd level: ${data.crowdCount}
    Sound level: ${data.decibels}
    User conditions: ${data.userProfile}
    Provide specific recommendations.
  `;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

Eleven Labs Voice Integration
const elevenLabs = new ElevenLabsAPI(process.env.ELEVEN_LABS_KEY);

const generateVoiceGuidance = async (text, userPreferences) => {
  const audio = await elevenLabs.textToSpeech({
    text: text,
    voice_id: userPreferences.voiceId || 'default_calm',
    model_id: 'eleven_monolingual_v1',
    voice_settings: {
      stability: 0.75,
      similarity_boost: 0.75,
      style: 0.5,
      speaking_rate: userPreferences.speed || 1.0
    }
  });
  
  return audio;
};

Auth0 Authentication
// [...nextauth].js
import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      authorizationParams: {
        audience: process.env.AUTH0_AUDIENCE,
        scope: 'openid profile email'
      }
    });
  }
});


ELEVEN LABS -  sk_f1b771c8ee6e1b8fadc5dc0c487165113cef5142be0df69e
gemini api key: AIzaSyDXZ4vrMcqKBTpFILxmY8f4Ulkh1D5bJmw

Next.js
Next.js

By Rita Zerrizuela
This guide demonstrates how to integrate Auth0 with any new or existing Next.js application using the Auth0 Next.js SDK.
I want to integrate with my app
15 minutes
Configure Auth0
Install the Auth0 Next.js SDK
Add Login to Your Application
Add Logout to Your Application
Show User Profile Information
What's next?
Or
I want to explore a sample app
2 minutes
Get a sample configured with your account settings or check it out on Github.
System requirements: Next.js 15.2.4+
New to Auth? Learn How Auth0 works, how it integrates with Regular Web Applications and which protocol it uses.
Configure Auth0
Get Your Application Keys
When you signed up for Auth0, a new application was created for you, or you could have created a new one. You will need some details about that application to communicate with Auth0. You can get these details from the Application Settings section in the Auth0 dashboard.

You need the following information:
Domain
Client ID
Client Secret
If you download the sample from the top of this page, these details are filled out for you.
Configure Callback URLs
A callback URL is a URL in your application where Auth0 redirects the user after they have authenticated. The callback URL for your app must be added to the Allowed Callback URLs field in your Application Settings. If this field is not set, users will be unable to log in to the application and will get an error.
If you are following along with the sample project you downloaded from the top of this page, the callback URL you need to add to the Allowed Callback URLs field is http://localhost:3000/auth/callback.
Configure Logout URLs
A logout URL is a URL in your application that Auth0 can return to after the user has been logged out of the authorization server. This is specified in the returnTo query parameter. The logout URL for your app must be added to the Allowed Logout URLs field in your Application Settings. If this field is not set, users will be unable to log out from the application and will get an error.
If you are following along with the sample project you downloaded from the top of this page, the logout URL you need to add to the Allowed Logout URLs field is http://localhost:3000.
Install the Auth0 Next.js SDK
Run the following command within your project directory to install the Auth0 Next.js SDK:
npm install @auth0/nextjs-auth0
Was this helpful?
/
The SDK exposes methods and variables that help you integrate Auth0 with your Next.js application using Route Handlers on the backend and React Context with React Hooks on the frontend.
Configure the SDK
In the root directory of your project, create the file .env.local with the following environment variables:
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value' APP_BASE_URL='http://localhost:3000' AUTH0_DOMAIN='https://dev-vgjy68m0jgy4n1t0.us.auth0.com' AUTH0_CLIENT_ID='JEFhvAvmZUGiLypIffrquYnWVZs4aOO4' AUTH0_CLIENT_SECRET='1ibR5M5O8pcsk-lMZ2SNhAbhQ7EGyyBUVuDoLlUjAb7XHrGGD5A6oS9RvOUljZQ_' # 'If your application is API authorized add the variables AUTH0_AUDIENCE and AUTH0_SCOPE' AUTH0_AUDIENCE='your_auth_api_identifier' AUTH0_SCOPE='openid profile email read:shows'
Was this helpful?
/
AUTH0_SECRET: A long secret value used to encrypt the session cookie. You can generate a suitable string using openssl rand -hex 32 on the command line.
APP_BASE_URL: The base URL of your application
AUTH0_DOMAIN: The URL of your Auth0 tenant domain
AUTH0_CLIENT_ID: Your Auth0 application's Client ID
AUTH0_CLIENT_SECRET: Your Auth0 application's Client Secret
The SDK will read these values from the Node.js process environment and configure itself automatically.
Manually add the values for AUTH0_AUDIENCE and AUTH_SCOPE to the file lib/auth0.js. These values are not configured automatically. If you are using a Custom Domain with Auth0, set AUTH0_DOMAIN to the value of your Custom Domain instead of the value reflected in the application "Settings" tab.
Create the Auth0 SDK Client
Create a file at lib/auth0.js to add an instance of the Auth0 client. This instance provides methods for handling authentication, sesssions and user data.
// lib/auth0.js import { Auth0Client } from "@auth0/nextjs-auth0/server"; // Initialize the Auth0 client export const auth0 = new Auth0Client({ // Options are loaded from environment variables by default // Ensure necessary environment variables are properly set // domain: process.env.AUTH0_DOMAIN, // clientId: process.env.AUTH0_CLIENT_ID, // clientSecret: process.env.AUTH0_CLIENT_SECRET, // appBaseUrl: process.env.APP_BASE_URL, // secret: process.env.AUTH0_SECRET, authorizationParameters: { // In v4, the AUTH0_SCOPE and AUTH0_AUDIENCE environment variables for API authorized applications are no longer automatically picked up by the SDK. // Instead, we need to provide the values explicitly. scope: process.env.AUTH0_SCOPE, audience: process.env.AUTH0_AUDIENCE, } });
Was this helpful?
/
Add the Authentication Middleware
The Next.js Middleware allows you to run code before a request is completed. Create a middleware.ts file. This file is used to enforce authentication on specific routes.
import type { NextRequest } from "next/server"; import { auth0 } from "./lib/auth0"; export async function middleware(request: NextRequest) { return await auth0.middleware(request); } export const config = { matcher: [ /* * Match all request paths except for the ones starting with: * - _next/static (static files) * - _next/image (image optimization files) * - favicon.ico, sitemap.xml, robots.txt (metadata files) */ "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)", ], };
Was this helpful?
/
The middleware function intercepts incoming requests and applies Auth0's authentication logic. The matcher configuration ensures that the middleware runs on all routes except for static files and metadata.
Auto-configured routes
Using the SDK's middleware auto-configures the following routes:
/auth/login: The route to perform login with Auth0
/auth/logout: The route to log the user out
/auth/callback: The route Auth0 will redirect the user to after a successful login
/auth/profile: The route to fetch the user profile
/auth/access-token: The route to verify the user's session and return an access token (which automatically refreshes if a refresh token is available)
/auth/backchannel-logout: The route to receive a logout_token when a configured Back-Channel Logout initiator occurs
The /auth/access-token route is enabled by default, but is only neccessary when the access token is needed on the client-side. If this isn't something you need, you can disable this endpoint by setting enableAccessTokenEndpoint to false.
Add Login to Your Application
Users can now log in to your application at /auth/login route provided by the SDK. Use an anchor tag to add a link to the login route to redirect your users to the Auth0 Universal Login Page, where Auth0 can authenticate them. Upon successful authentication, Auth0 redirects your users back to your application.
<a href="/auth/login">Login</a>
Was this helpful?
/
Next.js suggests using Link components instead of anchor tags, but since these are API routes and not pages, anchor tags are needed.
Checkpoint
Add the login link to your application. Select it and verify that your Next.js application redirects you to the Auth0 Universal Login page and that you can now log in or sign up using a username and password or a social provider.
Once that's complete, verify that Auth0 redirects back to your application.
If you are following along with the sample app project from the top of this page, run the command:
npm i && npm run dev
Was this helpful?
/
and visit http://localhost:3000 in your browser.

Auth0 enables the Google social provider by default on new tenants and offers you developer keys to test logging in with social identity providers. However, these developer keys have some limitations that may cause your application to behave differently. For more details on what this behavior may look like and how to fix it, consult the Test Social Connections with Auth0 Developer Keys document.
Add Logout to Your Application
Now that you can log in to your Next.js application, you need a way to log out. Add a link that points to the /auth/logout API route. To learn more, read Log Users out of Auth0 with OIDC Endpoint.
<a href="/auth/logout">Logout</a>
Was this helpful?
/
Checkpoint
Add the logout link to your application. When you select it, verify that your Next.js application redirects you to the address you specified as one of the "Allowed Logout URLs" in the application "Settings".
Show User Profile Information
The Auth0 Next.js SDK helps you retrieve the profile information associated with the logged-in user, such as their name or profile picture, to personalize the user interface.
From a Client Component
The profile information is available through the user property exposed by the useUser() hook. Take this Client Component as an example of how to use it:
'use client'; import { useUser } from "@auth0/nextjs-auth0" export default function Profile() { const { user, isLoading } = useUser(); return ( <> {isLoading && <p>Loading...</p>} {user && ( <div style={{ textAlign: "center" }}> <img src={user.picture} alt="Profile" style={{ borderRadius: "50%", width: "80px", height: "80px" }} /> <h2>{user.name}</h2> <p>{user.email}</p> <pre>{JSON.stringify(user, null, 2)}</pre> </div> )} </> ); }
Was this helpful?
/
The user property contains sensitive information and artifacts related to the user's identity. As such, its availability depends on the user's authentication status. To prevent any render errors:
Ensure that the SDK has completed loading before accessing the user property by checking that isLoading is false.
Ensure that the SDK has loaded successfully by checking that no error was produced.
Check the user property to ensure that Auth0 has authenticated the user before React renders any component that consumes it.
From a Server Component
The profile information is available through the user property exposed by the getSession function. Take this Server Component as an example of how to use it:
import { auth0 } from "@/lib/auth0"; export default async function ProfileServer() { const { user } = await auth0.getSession(); return ( user && ( <div> <img src={user.picture} alt={user.name}/> <h2>{user.name}</h2> <p>{user.email}</p> </div> ) ); }
Was this helpful?
/
Checkpoint
Verify that you can display the user.name or any other user property within a component correctly after you have logged in.
What's next?



Auth0 Management API
API Identifier: https://dev-vgjy68m0jgy4n1t0.us.auth0.com/api/v2/


Auth0 Management API
API Identifier: https://dev-vgjy68m0jgy4n1t0.us.auth0.com/api/v2/


---
title: Developer quickstart
subtitle: Learn how to make your first ElevenLabs API request.
---

The ElevenLabs API provides a simple interface to state-of-the-art audio [models](/docs/models) and [features](/docs/api-reference/introduction). Follow this guide to learn how to create lifelike speech with our Text to Speech API. See the [developer guides](/docs/quickstart#explore-our-developer-guides) for more examples with our other products.

## Using the Text to Speech API

<Steps>
    <Step title="Create an API key">
      [Create an API key in the dashboard here](https://elevenlabs.io/app/settings/api-keys), which you’ll use to securely [access the API](/docs/api-reference/authentication).
      
      Store the key as a managed secret and pass it to the SDKs either as a environment variable via an `.env` file, or directly in your app’s configuration depending on your preference.
      
      ```js title=".env"
      ELEVENLABS_API_KEY=<your_api_key_here>
      ```
      
    </Step>
    <Step title="Install the SDK">
      We'll also use the `dotenv` library to load our API key from an environment variable.
      
      <CodeBlocks>
          ```python
          pip install elevenlabs
          pip install python-dotenv
          ```
      
          ```typescript
          npm install @elevenlabs/elevenlabs-js
          npm install dotenv
          ```
      
      </CodeBlocks>
      

      <Note>
        To play the audio through your speakers, you may be prompted to install [MPV](https://mpv.io/)
      and/or [ffmpeg](https://ffmpeg.org/).
      </Note>
    </Step>
    <Step title="Make your first request">
      Create a new file named `example.py` or `example.mts`, depending on your language of choice and add the following code:
       {/* This snippet was auto-generated */}
       <CodeBlocks>
       ```python
       from dotenv import load_dotenv
       from elevenlabs.client import ElevenLabs
       from elevenlabs.play import play
       import os
       
       load_dotenv()
       
       elevenlabs = ElevenLabs(
         api_key=os.getenv("ELEVENLABS_API_KEY"),
       )
       
       audio = elevenlabs.text_to_speech.convert(
           text="The first move is what sets everything in motion.",
           voice_id="JBFqnCBsd6RMkjVDRZzb",
           model_id="eleven_multilingual_v2",
           output_format="mp3_44100_128",
       )
       
       play(audio)
       
       ```
       
       ```typescript
       import { ElevenLabsClient, play } from '@elevenlabs/elevenlabs-js';
       import 'dotenv/config';
       
       const elevenlabs = new ElevenLabsClient();
       const audio = await elevenlabs.textToSpeech.convert('JBFqnCBsd6RMkjVDRZzb', {
         text: 'The first move is what sets everything in motion.',
         modelId: 'eleven_multilingual_v2',
         outputFormat: 'mp3_44100_128',
       });
       
       await play(audio);
       
       ```
       
       </CodeBlocks>
    </Step>
    <Step title="Run the code">
        <CodeBlocks>
            ```python
            python example.py
            ```

            ```typescript
            npx tsx example.mts
            ```
        </CodeBlocks>

        You should hear the audio play through your speakers.
    </Step>

</Steps>

## Explore our developer guides

Now that you've made your first ElevenLabs API request, you can explore the other products that ElevenLabs offers.

<CardGroup cols={2}>
  <Card
    title="Speech to Text"
    icon="duotone pen-clip"
    href="/docs/cookbooks/speech-to-text/quickstart"
  >
    Convert spoken audio into text
  </Card>
  <Card title="ElevenLabs Agents" icon="duotone comments" href="/docs/agents-platform/quickstart">
    Deploy conversational voice agents
  </Card>
  <Card title="Music" icon="duotone music" href="/docs/cookbooks/music/quickstart">
    Generate studio-quality music
  </Card>
  <Card
    title="Voice Cloning"
    icon="duotone clone"
    href="/docs/cookbooks/voices/instant-voice-cloning"
  >
    Clone a voice
  </Card>
  <Card title="Voice Remixing" icon="duotone shuffle" href="/docs/cookbooks/voices/remix-a-voice">
    Remix a voice
  </Card>
  <Card title="Sound Effects" icon="duotone explosion" href="/docs/cookbooks/sound-effects">
    Generate sound effects from text
  </Card>
  <Card title="Voice Changer" icon="duotone message-pen" href="/docs/cookbooks/voice-changer">
    Transform the voice of an audio file
  </Card>
  <Card title="Voice Isolator" icon="duotone ear" href="/docs/cookbooks/voice-isolator">
    Isolate background noise from audio
  </Card>
  <Card title="Voice Design" icon="duotone paint-brush" href="/docs/cookbooks/voices/voice-design">
    Generate voices from a single text prompt
  </Card>
  <Card title="Dubbing" icon="duotone language" href="/docs/cookbooks/dubbing">
    Dub audio/video from one language to another
  </Card>
  <Card
    title="Forced Alignment"
    icon="duotone objects-align-left"
    href="/docs/cookbooks/forced-alignment"
  >
    Generate time-aligned transcripts for audio
  </Card>
</CardGroup>





---
title: Speech to Text quickstart
subtitle: Learn how to convert spoken audio into text.
---

This guide will show you how to convert spoken audio into text using the Speech to Text API.

## Using the Speech to Text API

<Steps>
    <Step title="Create an API key">
        [Create an API key in the dashboard here](https://elevenlabs.io/app/settings/api-keys), which you’ll use to securely [access the API](/docs/api-reference/authentication).
        
        Store the key as a managed secret and pass it to the SDKs either as a environment variable via an `.env` file, or directly in your app’s configuration depending on your preference.
        
        ```js title=".env"
        ELEVENLABS_API_KEY=<your_api_key_here>
        ```
        
    </Step>
    <Step title="Install the SDK">
        We'll also use the `dotenv` library to load our API key from an environment variable.
        
        <CodeBlocks>
            ```python
            pip install elevenlabs
            pip install python-dotenv
            ```
        
            ```typescript
            npm install @elevenlabs/elevenlabs-js
            npm install dotenv
            ```
        
        </CodeBlocks>
        
    </Step>
    <Step title="Make the API request">
        Create a new file named `example.py` or `example.mts`, depending on your language of choice and add the following code:

        <CodeBlocks>
        ```python maxLines=0
        # example.py
        import os
        from dotenv import load_dotenv
        from io import BytesIO
        import requests
        from elevenlabs.client import ElevenLabs

        load_dotenv()

        elevenlabs = ElevenLabs(
          api_key=os.getenv("ELEVENLABS_API_KEY"),
        )

        audio_url = (
            "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
        )
        response = requests.get(audio_url)
        audio_data = BytesIO(response.content)

        transcription = elevenlabs.speech_to_text.convert(
            file=audio_data,
            model_id="scribe_v1", # Model to use, for now only "scribe_v1" is supported
            tag_audio_events=True, # Tag audio events like laughter, applause, etc.
            language_code="eng", # Language of the audio file. If set to None, the model will detect the language automatically.
            diarize=True, # Whether to annotate who is speaking
        )

        print(transcription)
        ```

        ```typescript maxLines=0
        // example.mts
        import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
        import "dotenv/config";

        const elevenlabs = new ElevenLabsClient();

        const response = await fetch(
          "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3"
        );
        const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

        const transcription = await elevenlabs.speechToText.convert({
          file: audioBlob,
          modelId: "scribe_v1", // Model to use, for now only "scribe_v1" is supported.
          tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
          languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
          diarize: true, // Whether to annotate who is speaking
        });

        console.log(transcription);
        ```
        </CodeBlocks>
    </Step>
    <Step title="Execute the code">
        <CodeBlocks>
            ```python
            python example.py
            ```

            ```typescript
            npx tsx example.mts
            ```
        </CodeBlocks>

        You should see the transcription of the audio file printed to the console.
    </Step>

</Steps>

## Next steps

Explore the [API reference](/docs/api-reference/speech-to-text/convert) for more information on the Speech to Text API and its options.


// NeuroNav Quick Start Template - React Native
// Install: npm install @mappedin/react-native-sdk @tensorflow/tfjs

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { MapView } from '@mappedin/react-native-sdk';
import * as tf from '@tensorflow/tfjs';

// =============================================================================
// CONFIGURATION
// =============================================================================

const MAPPEDIN_CONFIG = {
  clientId: 'YOUR_CLIENT_ID_HERE',        // Get from developer.mappedin.com
  clientSecret: 'YOUR_CLIENT_SECRET_HERE',
  venueSlug: 'mappedin-demo-mall'         // Use demo or your venue
};

// =============================================================================
// USER SENSORY PROFILE
// =============================================================================

const defaultSensoryProfile = {
  noiseSensitivity: 0.8,      // 0 (not sensitive) to 1 (very sensitive)
  crowdSensitivity: 0.9,
  lightSensitivity: 0.6,
  preferElevators: true,
  avoidFluorescentLighting: true,
  maxWalkingDistance: 500,
  needsFrequentBreaks: true,
  safeSpaces: ['library', 'quiet room', 'outdoor area']
};

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

const NeuroNavApp = () => {
  const [venue, setVenue] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [comfortMetrics, setComfortMetrics] = useState({});
  const [userProfile] = useState(defaultSensoryProfile);

  // Initialize Mappedin
  useEffect(() => {
    initializeMappedin();
  }, []);

  const initializeMappedin = async () => {
    try {
      const venueData = await MapView.getVenue(MAPPEDIN_CONFIG);
      setVenue(venueData);
      console.log('Venue loaded:', venueData.name);
    } catch (error) {
      console.error('Failed to load venue:', error);
    }
  };

  // Handle map load
  const onMapLoaded = (mapView) => {
    console.log('Map loaded successfully');
    
    // Enable blue dot positioning
    mapView.BlueDot.enable({
      showBlueDot: true,
      smoothing: true,
      followMe: true
    });

    // Listen for position updates
    mapView.BlueDot.on('position-updated', (position) => {
      setCurrentPosition(position);
      analyzeComfort(position);
    });
  };

  // Calculate route with sensory awareness
  const calculateNeuroNavRoute = async (destination) => {
    if (!venue || !currentPosition) {
      alert('Please wait for map to load and position to be determined');
      return;
    }

    // Get base routes from Mappedin
    const baseRoutes = await venue.getDirections({
      from: currentPosition.location,
      to: destination,
      accessible: true
    });

    // Score routes by comfort
    const scoredRoutes = baseRoutes.map(route => {
      const comfortScore = calculateRouteComfort(route, userProfile);
      const distanceScore = 1 - (route.distance / 1000); // Normalize to 0-1
      
      return {
        ...route,
        comfortScore,
        balancedScore: (comfortScore * 0.7) + (distanceScore * 0.3),
        warnings: identifyWarnings(route, userProfile)
      };
    });

    // Sort by balanced score
    scoredRoutes.sort((a, b) => b.balancedScore - a.balancedScore);
    setSelectedRoute(scoredRoutes[0]);
    
    return scoredRoutes;
  };

  // Simplified comfort calculation (enhance with real data)
  const calculateRouteComfort = (route, profile) => {
    let comfort = 1.0;

    route.instructions.forEach(instruction => {
      // Simulate environmental data (replace with real sensor data)
      const location = instruction.location;
      const envData = getSimulatedEnvironmentData(location);

      // Apply penalties based on sensitivities
      if (envData.soundLevel > 70 && profile.noiseSensitivity > 0.7) {
        comfort *= 0.6;
      }
      
      if (envData.crowdDensity > 0.8 && profile.crowdSensitivity > 0.7) {
        comfort *= 0.5;
      }

      if (envData.lighting === 'fluorescent' && profile.avoidFluorescentLighting) {
        comfort *= 0.7;
      }

      // Reward safe spaces
      if (profile.safeSpaces.some(space => 
          location.name.toLowerCase().includes(space.toLowerCase()))) {
        comfort *= 1.3;
      }
    });

    return Math.max(0, Math.min(1, comfort));
  };

  // Identify route warnings
  const identifyWarnings = (route, profile) => {
    const warnings = [];

    route.instructions.forEach(instruction => {
      const envData = getSimulatedEnvironmentData(instruction.location);

      if (envData.soundLevel > 75 && profile.noiseSensitivity > 0.6) {
        warnings.push({
          type: 'noise',
          message: 'Loud area ahead',
          icon: '🔊'
        });
      }

      if (envData.crowdDensity > 0.7 && profile.crowdSensitivity > 0.6) {
        warnings.push({
          type: 'crowd',
          message: 'Crowded area',
          icon: '👥'
        });
      }
    });

    return warnings;
  };

  // Analyze current location comfort
  const analyzeComfort = async (position) => {
    if (!position || !position.location) return;

    // Simulate environmental data collection
    const envData = getSimulatedEnvironmentData(position.location);
    
    // Calculate overall comfort
    const overallComfort = calculateLocationComfort(envData, userProfile);

    setComfortMetrics({
      ...envData,
      overallComfort,
      timestamp: Date.now()
    });
  };

  const calculateLocationComfort = (envData, profile) => {
    let comfort = 1.0;

    if (envData.soundLevel > 60) {
      comfort -= (envData.soundLevel - 60) / 100 * profile.noiseSensitivity;
    }

    if (envData.crowdDensity > 0.5) {
      comfort -= (envData.crowdDensity - 0.5) * profile.crowdSensitivity;
    }

    return Math.max(0, Math.min(1, comfort));
  };

  // Simulate environmental data (replace with real sensors in production)
  const getSimulatedEnvironmentData = (location) => {
    const hour = new Date().getHours();
    const isBusyTime = hour >= 12 && hour <= 14;

    // Simulate based on location type
    const locationName = location.name.toLowerCase();
    
    if (locationName.includes('cafeteria') || locationName.includes('food')) {
      return {
        soundLevel: isBusyTime ? 75 : 60,
        crowdDensity: isBusyTime ? 0.9 : 0.5,
        lighting: 'fluorescent',
        temperature: 23
      };
    }

    if (locationName.includes('library') || locationName.includes('study')) {
      return {
        soundLevel: 40,
        crowdDensity: 0.3,
        lighting: 'warm LED',
        temperature: 22
      };
    }

    if (locationName.includes('entrance') || locationName.includes('lobby')) {
      return {
        soundLevel: 65,
        crowdDensity: 0.7,
        lighting: 'bright LED',
        temperature: 21
      };
    }

    // Default for other locations
    return {
      soundLevel: 55,
      crowdDensity: 0.4,
      lighting: 'natural',
      temperature: 22
    };
  };

  // Get color based on comfort level
  const getComfortColor = (comfort) => {
    if (comfort > 0.75) return '#4CAF50'; // Green
    if (comfort > 0.5) return '#FFC107';  // Yellow
    if (comfort > 0.25) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {venue ? (
          <MapView
            venue={venue}
            style={styles.map}
            onFirstMapLoaded={onMapLoaded}
          />
        ) : (
          <Text style={styles.loadingText}>Loading map...</Text>
        )}
      </View>

      {/* Comfort Dashboard */}
      {comfortMetrics.overallComfort !== undefined && (
        <View style={styles.dashboard}>
          <Text style={styles.dashboardTitle}>Current Comfort</Text>
          <View style={styles.comfortIndicator}>
            <View 
              style={[
                styles.comfortBar, 
                { 
                  width: `${comfortMetrics.overallComfort * 100}%`,
                  backgroundColor: getComfortColor(comfortMetrics.overallComfort)
                }
              ]} 
            />
          </View>
          <Text style={styles.comfortText}>
            {(comfortMetrics.overallComfort * 100).toFixed(0)}% Comfortable
          </Text>

          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricIcon}>🔊</Text>
              <Text style={styles.metricLabel}>Sound</Text>
              <Text style={styles.metricValue}>{comfortMetrics.soundLevel} dB</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricIcon}>👥</Text>
              <Text style={styles.metricLabel}>Crowd</Text>
              <Text style={styles.metricValue}>
                {(comfortMetrics.crowdDensity * 100).toFixed(0)}%
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricIcon}>💡</Text>
              <Text style={styles.metricLabel}>Lighting</Text>
              <Text style={styles.metricValue}>{comfortMetrics.lighting}</Text>
            </View>
          </View>

          {comfortMetrics.overallComfort < 0.5 && (
            <View style={styles.alert}>
              <Text style={styles.alertText}>
                ⚠️ Uncomfortable area detected
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Route Info */}
      {selectedRoute && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeTitle}>🌟 Optimal Route</Text>
          <Text style={styles.routeDetail}>
            Comfort: {(selectedRoute.comfortScore * 100).toFixed(0)}% | 
            Distance: {selectedRoute.distance.toFixed(0)}m
          </Text>
          {selectedRoute.warnings.length > 0 && (
            <View style={styles.warnings}>
              {selectedRoute.warnings.map((warning, idx) => (
                <Text key={idx} style={styles.warning}>
                  {warning.icon} {warning.message}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Demo Controls */}
      <View style={styles.controls}>
        <Button 
          title="Find Comfortable Route to Library"
          onPress={() => {
            // You'll need to get the actual library location from venue
            // This is just a demo trigger
            const libraryLocation = venue?.locations.find(loc => 
              loc.name.toLowerCase().includes('library')
            );
            if (libraryLocation) {
              calculateNeuroNavRoute(libraryLocation);
            } else {
              alert('Library location not found. Using demo data.');
            }
          }}
        />
      </View>
    </View>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0'
  },
  map: {
    flex: 1
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#666'
  },
  dashboard: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  comfortIndicator: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8
  },
  comfortBar: {
    height: '100%',
    borderRadius: 4
  },
  comfortText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center'
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  metric: {
    alignItems: 'center'
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600'
  },
  alert: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginTop: 12
  },
  alertText: {
    color: '#856404',
    textAlign: 'center',
    fontWeight: '600'
  },
  routeInfo: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },
  routeDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8
  },
  warnings: {
    marginTop: 8
  },
  warning: {
    fontSize: 13,
    color: '#d32f2f',
    marginTop: 4
  },
  controls: {
    padding: 16
  }
});

export default NeuroNavApp;

// =============================================================================
// NEXT STEPS FOR HACKATHON
// =============================================================================

/*
1. GET MAPPEDIN CREDENTIALS (30 minutes)
   - Visit https://developer.mappedin.com/
   - Sign up for free account
   - Get Client ID and Client Secret
   - Replace MAPPEDIN_CONFIG values above

2. TEST WITH DEMO VENUE (1 hour)
   - Use 'mappedin-demo-mall' venue slug
   - Run app and verify map loads
   - Test blue dot positioning
   - Trigger route calculation

3. ADD REAL SENSOR DATA (2-3 hours)
   - Replace getSimulatedEnvironmentData() with:
     * expo-audio for sound level measurement
     * expo-camera for light intensity
     * expo-bluetooth for crowd estimation
   - Collect real environmental data

4. ENHANCE RL AGENT (2-3 hours)
   - Implement Q-learning class from setup guide
   - Add feedback collection prompts
   - Store user preferences and route history
   - Update route suggestions based on learning

5. BUILD ON-DEVICE ML (3-4 hours)
   - Train TensorFlow.js model on user comfort data
   - Predict comfort for new routes
   - Store model locally for privacy

6. POLISH UI/UX (2-3 hours)
   - Add route comparison view (3 options side-by-side)
   - Implement safe space markers
   - Add color-coded route segments
   - Create onboarding for sensory profile setup

7. PREPARE DEMO (2 hours)
   - Create test scenarios (library, cafeteria, etc.)
   - Practice demo script
   - Add mock data for consistent demo
   - Prepare slide deck

TOTAL TIME: 15-20 hours for complete hackathon project
*/


const MAPPEDIN_CONFIG = {
  // FREE DEMO CREDENTIALS - NO SIGNUP NEEDED
  clientId: 'mik_yeBk0Vf0nNJtpesfu560e07e5',
  clientSecret: 'mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022',

  // Choose your demo venue (pick the best one for NeuroNav):
  venueId: '660c0bb9ae0596d87766f2d9'  // Community Centre Demo
  // OR
  // venueId: '64ef49e662fd90fe020bee61'  // Office Demo
  // OR
  // venueId: '65c12d9b30b94e3fabd5bb91'  // School Demo
  // OR
  // venueId: '682e13a2703478000b567b66'  // University Campus Demo
};

## GOOGLE MAPS API INTEGRATION
Google Maps JavaScript API for outdoor navigation and location services.

### API Setup
```javascript
// Initialize Google Maps
const initializeGoogleMaps = () => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places,geometry`;
  script.async = true;
  document.head.appendChild(script);
};
```

### Maps Implementation
```javascript
// Create map instance
const map = new google.maps.Map(document.getElementById('map'), {
  center: { lat: 0, lng: 0 },
  zoom: 15,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [/* Custom styling for neurodivergent-friendly colors */]
});

// Get user location
navigator.geolocation.getCurrentPosition((position) => {
  const userLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  map.setCenter(userLocation);
});
```

### Places API for Crowd Data
```javascript
// Search nearby places
const searchNearbyPlaces = async (location, type) => {
  const service = new google.maps.places.PlacesService(map);

  return new Promise((resolve, reject) => {
    service.nearbySearch({
      location: location,
      radius: 500,
      type: type
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(results);
      } else {
        reject(status);
      }
    });
  });
};

// Get place details including popular times
const getPlaceDetails = async (placeId) => {
  const service = new google.maps.places.PlacesService(map);

  return new Promise((resolve, reject) => {
    service.getDetails({
      placeId: placeId,
      fields: ['name', 'rating', 'opening_hours', 'formatted_address', 'photos']
    }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        resolve(place);
      } else {
        reject(status);
      }
    });
  });
};
```

### Directions API for Route Calculation
```javascript
// Calculate route with waypoints
const calculateRoute = async (origin, destination, waypoints = []) => {
  const directionsService = new google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route({
      origin: origin,
      destination: destination,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true,
      optimizeWaypoints: true
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        resolve(result);
      } else {
        reject(status);
      }
    });
  });
};

// Display route on map
const displayRoute = (route) => {
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    directions: route,
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: '#4CAF50',
      strokeWeight: 5,
      strokeOpacity: 0.8
    }
  });
};
```

### Geometry Library for Distance Calculations
```javascript
// Calculate distance between two points
const calculateDistance = (point1, point2) => {
  return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(point1.lat, point1.lng),
    new google.maps.LatLng(point2.lat, point2.lng)
  );
};

// Calculate heading/bearing
const calculateHeading = (from, to) => {
  return google.maps.geometry.spherical.computeHeading(
    new google.maps.LatLng(from.lat, from.lng),
    new google.maps.LatLng(to.lat, to.lng)
  );
};
```

### Custom Markers for Crowd Indicators
```javascript
// Add crowd density markers
const addCrowdMarker = (location, crowdLevel) => {
  const colors = {
    low: '#4CAF50',    // Green
    medium: '#FFC107', // Yellow
    high: '#FF9800',   // Orange
    extreme: '#F44336' // Red
  };

  const marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: colors[crowdLevel],
      fillOpacity: 0.7,
      strokeColor: '#fff',
      strokeWeight: 2
    },
    title: `Crowd Level: ${crowdLevel}`
  });

  return marker;
};
```

### Heatmap Layer for Crowd Visualization
```javascript
// Create heatmap of crowd density
const createCrowdHeatmap = (crowdData) => {
  const heatmapData = crowdData.map(point => ({
    location: new google.maps.LatLng(point.lat, point.lng),
    weight: point.density
  }));

  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatmapData,
    map: map,
    radius: 50,
    gradient: [
      'rgba(0, 255, 0, 0)',
      'rgba(0, 255, 0, 1)',
      'rgba(255, 255, 0, 1)',
      'rgba(255, 165, 0, 1)',
      'rgba(255, 0, 0, 1)'
    ]
  });

  return heatmap;
};
```

## OPENCV.JS IMPLEMENTATION
Browser-based computer vision for real-time crowd detection using phone camera.

### OpenCV.js Initialization
```javascript
// Load OpenCV.js
const loadOpenCV = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.async = true;
    script.onload = () => {
      cv['onRuntimeInitialized'] = () => {
        console.log('OpenCV.js loaded successfully');
        resolve();
      };
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
```

### Camera Stream Setup
```javascript
// Initialize camera for crowd detection
const initCamera = async () => {
  const video = document.getElementById('videoInput');

  const constraints = {
    video: {
      facingMode: 'environment', // Use rear camera
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 }
    }
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve(video);
      };
    });
  } catch (error) {
    console.error('Camera access denied:', error);
    throw error;
  }
};
```

### Person Detection with Haar Cascades
```javascript
// Load Haar Cascade classifier for person detection
let classifier;

const loadHaarCascade = async () => {
  const utils = new Utils('errorMessage');

  // Load full body cascade
  classifier = new cv.CascadeClassifier();
  await classifier.load('haarcascade_fullbody.xml');

  console.log('Haar Cascade loaded');
};

// Detect people in frame
const detectPeople = (videoElement) => {
  const src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
  const gray = new cv.Mat();
  const cap = new cv.VideoCapture(videoElement);

  cap.read(src);
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const bodies = new cv.RectVector();
  const msize = new cv.Size(0, 0);

  classifier.detectMultiScale(gray, bodies, 1.1, 3, 0, msize, msize);

  const detectedPeople = [];
  for (let i = 0; i < bodies.size(); ++i) {
    const body = bodies.get(i);
    detectedPeople.push({
      x: body.x,
      y: body.y,
      width: body.width,
      height: body.height,
      distance: estimateDistance(body.height, videoElement.height)
    });
  }

  // Cleanup
  src.delete();
  gray.delete();
  bodies.delete();

  return detectedPeople;
};
```

### Distance Estimation
```javascript
// Estimate distance based on person height in frame
const estimateDistance = (personHeightPixels, frameHeight) => {
  const AVERAGE_PERSON_HEIGHT_CM = 170;
  const CAMERA_FOV_VERTICAL = 60; // degrees
  const SENSOR_HEIGHT_MM = 4.8; // typical phone sensor

  // Calculate distance using similar triangles
  const focalLengthPixels = frameHeight / (2 * Math.tan((CAMERA_FOV_VERTICAL * Math.PI / 180) / 2));
  const distanceMeters = (AVERAGE_PERSON_HEIGHT_CM * focalLengthPixels) / (personHeightPixels * 100);

  return Math.round(distanceMeters * 10) / 10; // Round to 1 decimal
};
```

### Crowd Density Calculation
```javascript
// Calculate crowd density from detected people
const calculateCrowdDensity = (detectedPeople, cameraFOV) => {
  if (detectedPeople.length === 0) return { density: 0, level: 'empty' };

  // Estimate visible area based on average distance
  const avgDistance = detectedPeople.reduce((sum, p) => sum + p.distance, 0) / detectedPeople.length;
  const visibleAreaM2 = Math.PI * Math.pow(avgDistance, 2) * (cameraFOV / 360);

  // People per square meter
  const density = detectedPeople.length / visibleAreaM2;

  // Classify density level
  let level;
  if (density < 0.5) level = 'empty';
  else if (density < 1.5) level = 'low';
  else if (density < 3) level = 'medium';
  else if (density < 5) level = 'high';
  else level = 'extreme';

  return {
    density: Math.round(density * 100) / 100,
    level,
    count: detectedPeople.length,
    area: Math.round(visibleAreaM2),
    averageDistance: avgDistance
  };
};
```

### Optical Flow for Movement Detection
```javascript
// Track movement patterns for dynamic crowd analysis
let previousFrame = null;

const detectMovement = (currentFrame) => {
  if (!previousFrame) {
    previousFrame = currentFrame.clone();
    return { movement: 0, direction: null };
  }

  const flow = new cv.Mat();

  cv.calcOpticalFlowFarneback(
    previousFrame,
    currentFrame,
    flow,
    0.5,  // pyramid scale
    3,    // levels
    15,   // window size
    3,    // iterations
    5,    // poly n
    1.2,  // poly sigma
    0     // flags
  );

  // Calculate average flow magnitude
  let totalMagnitude = 0;
  let count = 0;

  for (let y = 0; y < flow.rows; y += 10) {
    for (let x = 0; x < flow.cols; x += 10) {
      const flowX = flow.floatAt(y, x * 2);
      const flowY = flow.floatAt(y, x * 2 + 1);
      const magnitude = Math.sqrt(flowX * flowX + flowY * flowY);
      totalMagnitude += magnitude;
      count++;
    }
  }

  const avgMovement = totalMagnitude / count;

  previousFrame.delete();
  previousFrame = currentFrame.clone();
  flow.delete();

  return {
    movement: avgMovement,
    isMoving: avgMovement > 2 // threshold for significant movement
  };
};
```

### Real-Time Processing Loop
```javascript
// Main processing loop for continuous crowd monitoring
let isProcessing = false;
let animationFrameId = null;

const startCrowdDetection = async (videoElement, onUpdate) => {
  if (isProcessing) return;

  isProcessing = true;

  const processFrame = () => {
    if (!isProcessing) return;

    try {
      // Detect people
      const people = detectPeople(videoElement);

      // Calculate density
      const crowdData = calculateCrowdDensity(people, 60);

      // Detect movement
      const src = new cv.Mat(videoElement.height, videoElement.width, cv.CV_8UC4);
      const gray = new cv.Mat();
      const cap = new cv.VideoCapture(videoElement);
      cap.read(src);
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const movement = detectMovement(gray);

      // Callback with results
      onUpdate({
        ...crowdData,
        movement: movement,
        timestamp: Date.now()
      });

      src.delete();
      gray.delete();

    } catch (error) {
      console.error('Frame processing error:', error);
    }

    // Schedule next frame (process at 5 fps to save battery)
    animationFrameId = setTimeout(() => requestAnimationFrame(processFrame), 200);
  };

  processFrame();
};

const stopCrowdDetection = () => {
  isProcessing = false;
  if (animationFrameId) {
    clearTimeout(animationFrameId);
    animationFrameId = null;
  }
};
```

### Visualization Overlay
```javascript
// Draw detection boxes on canvas
const drawDetections = (canvas, detections) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  detections.forEach((person, index) => {
    // Draw bounding box
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.strokeRect(person.x, person.y, person.width, person.height);

    // Draw distance label
    ctx.fillStyle = '#4CAF50';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${person.distance}m`, person.x, person.y - 5);
  });

  // Draw crowd level indicator
  const level = calculateCrowdDensity(detections, 60).level;
  const colors = {
    empty: '#4CAF50',
    low: '#8BC34A',
    medium: '#FFC107',
    high: '#FF9800',
    extreme: '#F44336'
  };

  ctx.fillStyle = colors[level];
  ctx.fillRect(10, 10, 200, 50);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`Crowd: ${level.toUpperCase()}`, 20, 40);
};
```

## WEB AUDIO API FOR SOUND MONITORING
Real-time decibel measurement and sound analysis for sensory overload prevention.

### Audio Context Setup
```javascript
// Initialize Web Audio API
let audioContext;
let analyserNode;
let microphoneStream;

const initAudioMonitoring = async () => {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    analyserNode.smoothingTimeConstant = 0.8;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    microphoneStream = audioContext.createMediaStreamSource(stream);
    microphoneStream.connect(analyserNode);

    console.log('Audio monitoring initialized');
    return true;
  } catch (error) {
    console.error('Microphone access denied:', error);
    return false;
  }
};
```

### Decibel Calculation
```javascript
// Calculate decibel level from audio data
const getDecibelLevel = () => {
  const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
  analyserNode.getByteFrequencyData(dataArray);

  // Calculate RMS (Root Mean Square)
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i] * dataArray[i];
  }
  const rms = Math.sqrt(sum / dataArray.length);

  // Convert to decibels (calibrated for typical smartphone microphone)
  const db = 20 * Math.log10(rms / 255) + 94;

  return Math.max(0, Math.round(db));
};
```

### Frequency Analysis
```javascript
// Analyze frequency spectrum for sound type detection
const analyzeFrequencies = () => {
  const bufferLength = analyserNode.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyserNode.getByteFrequencyData(dataArray);

  // Frequency ranges (Hz)
  const ranges = {
    bass: { start: 0, end: 250, label: 'Bass' },
    midrange: { start: 250, end: 2000, label: 'Midrange' },
    treble: { start: 2000, end: 8000, label: 'Treble' },
    high: { start: 8000, end: 20000, label: 'High' }
  };

  const sampleRate = audioContext.sampleRate;
  const binWidth = sampleRate / analyserNode.fftSize;

  const frequencyData = {};

  Object.keys(ranges).forEach(rangeName => {
    const range = ranges[rangeName];
    const startBin = Math.floor(range.start / binWidth);
    const endBin = Math.floor(range.end / binWidth);

    let sum = 0;
    for (let i = startBin; i < endBin && i < bufferLength; i++) {
      sum += dataArray[i];
    }

    frequencyData[rangeName] = sum / (endBin - startBin);
  });

  return frequencyData;
};
```

### Sound Pattern Detection
```javascript
// Detect specific sound patterns
const detectSoundPatterns = (frequencyData, decibelLevel) => {
  const patterns = {
    sudden_noise: false,
    continuous_loud: false,
    music: false,
    speech: false,
    silence: false
  };

  // Sudden noise detection (rapid dB increase)
  if (window.previousDB && decibelLevel - window.previousDB > 15) {
    patterns.sudden_noise = true;
  }
  window.previousDB = decibelLevel;

  // Continuous loud sound
  if (decibelLevel > 75) {
    patterns.continuous_loud = true;
  }

  // Music detection (strong bass and treble)
  if (frequencyData.bass > 100 && frequencyData.treble > 80) {
    patterns.music = true;
  }

  // Speech detection (strong midrange)
  if (frequencyData.midrange > 90 && decibelLevel > 50 && decibelLevel < 75) {
    patterns.speech = true;
  }

  // Silence
  if (decibelLevel < 30) {
    patterns.silence = true;
  }

  return patterns;
};
```

### Real-Time Monitoring Loop
```javascript
// Continuous sound monitoring
let soundMonitoringActive = false;
let soundHistoryBuffer = [];
const HISTORY_SIZE = 50;

const startSoundMonitoring = (onUpdate) => {
  soundMonitoringActive = true;

  const monitorLoop = () => {
    if (!soundMonitoringActive) return;

    const db = getDecibelLevel();
    const frequencies = analyzeFrequencies();
    const patterns = detectSoundPatterns(frequencies, db);

    // Add to history
    soundHistoryBuffer.push({
      db,
      timestamp: Date.now()
    });

    if (soundHistoryBuffer.length > HISTORY_SIZE) {
      soundHistoryBuffer.shift();
    }

    // Calculate average
    const avgDB = soundHistoryBuffer.reduce((sum, s) => sum + s.db, 0) / soundHistoryBuffer.length;

    // Callback with results
    onUpdate({
      current: db,
      average: Math.round(avgDB),
      frequencies,
      patterns,
      level: getSoundLevel(db),
      timestamp: Date.now()
    });

    // Continue monitoring at 10fps
    setTimeout(() => requestAnimationFrame(monitorLoop), 100);
  };

  monitorLoop();
};

const stopSoundMonitoring = () => {
  soundMonitoringActive = false;
};

// Classify sound level
const getSoundLevel = (db) => {
  if (db < 40) return 'quiet';
  if (db < 60) return 'moderate';
  if (db < 75) return 'loud';
  if (db < 90) return 'very_loud';
  return 'extremely_loud';
};
```

### Sound Visualization
```javascript
// Create visual sound meter
const createSoundMeter = (canvas) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  return (soundData) => {
    ctx.clearRect(0, 0, width, height);

    // Draw decibel bar
    const barHeight = (soundData.current / 100) * height;
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, '#4CAF50');
    gradient.addColorStop(0.5, '#FFC107');
    gradient.addColorStop(0.75, '#FF9800');
    gradient.addColorStop(1, '#F44336');

    ctx.fillStyle = gradient;
    ctx.fillRect(20, height - barHeight, 60, barHeight);

    // Draw dB label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`${soundData.current} dB`, 100, height / 2);

    // Draw frequency bars
    const freqNames = Object.keys(soundData.frequencies);
    const barWidth = (width - 100) / freqNames.length;

    freqNames.forEach((freq, index) => {
      const value = soundData.frequencies[freq];
      const x = 100 + index * barWidth;
      const h = (value / 255) * (height - 50);

      ctx.fillStyle = '#2196F3';
      ctx.fillRect(x, height - h - 20, barWidth - 10, h);

      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(freq, x, height - 5);
    });
  };
};
```

## PROGRESSIVE WEB APP (PWA) SETUP
Complete configuration for installable web app with offline capabilities.

### Service Worker Registration
```javascript
// public/sw.js - Service Worker
const CACHE_NAME = 'neuronav-v1.0.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/main.css',
  '/scripts/app.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch event with network-first strategy for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // API calls - network first
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets - cache first
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request))
  );
});
```

### Web App Manifest
```json
// public/manifest.json
{
  "name": "NeuroNav - Neurodivergent Navigation Assistant",
  "short_name": "NeuroNav",
  "description": "AI-powered navigation app for neurodivergent individuals with crowd detection and sensory monitoring",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4CAF50",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "540x720",
      "type": "image/png"
    },
    {
      "src": "/screenshots/navigation.png",
      "sizes": "540x720",
      "type": "image/png"
    }
  ],
  "categories": ["navigation", "accessibility", "health"],
  "shortcuts": [
    {
      "name": "Start Navigation",
      "short_name": "Navigate",
      "description": "Begin crowd-aware navigation",
      "url": "/navigate",
      "icons": [{ "src": "/icons/navigate-96.png", "sizes": "96x96" }]
    },
    {
      "name": "Find Quiet Space",
      "short_name": "Quiet",
      "description": "Locate nearby quiet spaces",
      "url": "/quiet-spaces",
      "icons": [{ "src": "/icons/quiet-96.png", "sizes": "96x96" }]
    }
  ]
}
```

### PWA Installation Prompt
```javascript
// Prompt user to install PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show custom install button
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User ${outcome} the install prompt`);
    deferredPrompt = null;
    installButton.style.display = 'none';
  });
});

// Detect if app is installed
window.addEventListener('appinstalled', () => {
  console.log('NeuroNav installed successfully');
  deferredPrompt = null;
});
```

## ENVIRONMENT VARIABLES CONFIGURATION

### .env.local file structure
```bash
# API Keys
ELEVEN_LABS_API_KEY=sk_f1b771c8ee6e1b8fadc5dc0c487165113cef5142be0df69e
GEMINI_API_KEY=AIzaSyDXZ4vrMcqKBTpFILxmY8f4Ulkh1D5bJmw
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Auth0 Configuration
AUTH0_SECRET=use_openssl_rand_hex_32_to_generate
APP_BASE_URL=http://localhost:3000
AUTH0_DOMAIN=https://dev-vgjy68m0jgy4n1t0.us.auth0.com
AUTH0_CLIENT_ID=JEFhvAvmZUGiLypIffrquYnWVZs4aOO4
AUTH0_CLIENT_SECRET=1ibR5M5O8pcsk-lMZ2SNhAbhQ7EGyyBUVuDoLlUjAb7XHrGGD5A6oS9RvOUljZQ_
AUTH0_AUDIENCE=https://dev-vgjy68m0jgy4n1t0.us.auth0.com/api/v2/
AUTH0_SCOPE=openid profile email read:shows

# Mappedin Configuration
MAPPEDIN_CLIENT_ID=mik_yeBk0Vf0nNJtpesfu560e07e5
MAPPEDIN_CLIENT_SECRET=mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022
MAPPEDIN_VENUE_ID=660c0bb9ae0596d87766f2d9

# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=NeuroNav
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Next.js Environment Access
```javascript
// Access environment variables in Next.js
export const config = {
  elevenLabs: {
    apiKey: process.env.ELEVEN_LABS_API_KEY
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY
  },
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    scope: process.env.AUTH0_SCOPE
  },
  mappedin: {
    clientId: process.env.MAPPEDIN_CLIENT_ID,
    clientSecret: process.env.MAPPEDIN_CLIENT_SECRET,
    venueId: process.env.MAPPEDIN_VENUE_ID
  }
};
```
