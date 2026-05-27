import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sprout, CloudRain, TrendingUp, Bug, 
  Menu, X, MessageSquare, Plus, Image as ImageIcon,
  Mic, Volume2, LogOut, Landmark, Globe, Heart, HelpCircle, MapPin, Camera, User, XCircle
} from 'lucide-react';
import './App.css';

// Types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

// Translations Dictionary
const translations = {
  en: {
    home: "Home",
    about: "About",
    help: "Help",
    welcome: "Welcome to AgriBot 🌱",
    heroDesc: "Get real-time help on crops, weather, pest control, market prices, and government schemes using simple text or voice.",
    getStarted: "Get Started",
    loginRegister: "Login / Register",
    featuresTitle: "Everything you need",
    cropAdvisory: "Crop Advisory",
    cropDesc: "Expert guidance on planting and harvesting.",
    pestDisease: "Pest & Disease",
    pestDesc: "Instantly identify plant sickness and treatments.",
    weather: "Weather Updates",
    weatherDesc: "Hyper-local forecasts to plan your irrigation.",
    market: "Market Prices",
    marketDesc: "Live mandi rates to get the best price.",
    schemes: "Govt Schemes",
    schemesDesc: "Discover subsidies and loans you are eligible for.",
    voice: "Voice Assistance",
    voiceDesc: "Speak naturally in your local language.",
    tryTitle: "Try it out!",
    tryDesc: "Ask a question to see how AgriBot can help you.",
    placeholder: "Ask your farming question...",
    exampleQueries: "Example Queries:",
    faqTitle: "Frequently Asked Questions",
    faqDesc: "Learn more about how AgriBot can assist your farming journey.",
    q1: "What is AgriBot?",
    a1: "AgriBot is an AI-powered smart farming assistant designed to provide real-time guidance on crop health, weather updates, market prices, and government schemes, all through an easy-to-use chat interface.",
    q2: "How do I use the Voice Feature?",
    a2: "Simply click the microphone (🎤) icon in the chat input area, and speak your query in your natural regional language. AgriBot will convert your speech to text and respond automatically.",
    q3: "How can I diagnose a crop disease?",
    a3: "You can either describe the symptoms to the bot (e.g., \"My wheat leaves have brown spots\") or use the Image Upload button (🖼️) to send a photo of the affected plant for instant AI diagnosis.",
    q4: "Is AgriBot free to use?",
    a4: "Yes! AgriBot is completely free for farmers. Our goal is to make critical agricultural data and expert advice accessible to everyone.",
    loginTitle: "AgriBot System",
    loginToAccount: "Login to your account.",
    createAccount: "Create your AgriBot Account.",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    stateLabel: "State",
    statePlaceholder: "Enter your state",
    districtLabel: "District",
    districtPlaceholder: "Enter your district",
    villageLabel: "Village / City",
    villagePlaceholder: "Enter your village or city",
    landSizeLabel: "Land Size (in acres)",
    landSizePlaceholder: "e.g., 5",
    primaryCropLabel: "Primary Crop",
    primaryCropPlaceholder: "e.g., Wheat, Rice",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "Enter 10-digit number",
    sendOtp: "Send OTP",
    newUser: "New user?",
    registerHere: "Register here",
    otpLabel: "Enter OTP",
    otpPlaceholder: "Enter 4-digit OTP",
    verifyLogin: "Verify & Login",
    changeNumber: "Change Mobile Number",
    tagline: "Smart Farming Assistant",
    chatWelcome: "Welcome to AgriBot",
    chatSubtitle: "Your AI-powered agricultural assistant",
    askViaText: "Ask via Text or Voice...",
    newChat: "New Chat",
    recentChats: "Recent Chats",
    endSession: "Log Out",
    endChat: "End Chat",
    farmerPrefix: "Farmer",
    aboutTitle: "About AgriBot",
    aboutDesc: "AgriBot is an intelligent farming assistant dedicated to empowering farmers with data-driven insights on weather, market prices, and crop health.",
    contactTitle: "Contact Support",
    contactEmail: "Email: support@agribot.in",
    contactPhone: "Toll-Free: 1800-123-4567",
    contactHours: "Mon - Sat, 9 AM to 6 PM",
    privacyTitle: "Privacy Policy",
    privacyDesc: "Your privacy is our priority. Any data you share is strictly used to improve agricultural recommendations and is never sold to third parties.",
    copyright: `© ${new Date().getFullYear()} AgriBot. All rights reserved.`,
    builtWith: "Built for farmers with"
  },
  hi: {
    home: "मुख्य पृष्ठ",
    about: "हमारे बारे में",
    help: "मदद",
    welcome: "AgriBot में आपका स्वागत है 🌱",
    heroDesc: "सरल पाठ या आवाज़ का उपयोग करके फसलों, मौसम, कीट नियंत्रण, बाजार मूल्यों और सरकारी योजनाओं पर रीयल-टाइम मदद प्राप्त करें।",
    getStarted: "शुरू करें",
    loginRegister: "लॉगिन / रजिस्टर",
    featuresTitle: "आपकी सभी ज़रूरतें",
    cropAdvisory: "फसल सलाह",
    cropDesc: "रोपण और कटाई पर विशेषज्ञ मार्गदर्शन।",
    pestDisease: "कीट और रोग",
    pestDesc: "पौधों की बीमारी और उपचार की तुरंत पहचान करें।",
    weather: "मौसम अपडेट",
    weatherDesc: "अपनी सिंचाई की योजना बनाने के लिए अति-स्थानीय पूर्वानुमान।",
    market: "बाजार भाव",
    marketDesc: "सर्वोत्तम मूल्य प्राप्त करने के लिए लाइव मंडी दरें।",
    schemes: "सरकारी योजनाएं",
    schemesDesc: "सब्सिडी और ऋण खोजें जिनके आप पात्र हैं।",
    voice: "आवाज सहायता",
    voiceDesc: "अपनी स्थानीय भाषा में स्वाभाविक रूप से बोलें।",
    tryTitle: "इसे आज़माएं!",
    tryDesc: "यह देखने के लिए एक प्रश्न पूछें कि AgriBot आपकी कैसे मदद कर सकता है।",
    placeholder: "अपना खेती का सवाल पूछें...",
    exampleQueries: "उदाहरण प्रश्न:",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqDesc: "जानें कि एग्रीबॉट आपकी खेती की यात्रा में कैसे सहायता कर सकता है।",
    q1: "एग्रीबॉट क्या है?",
    a1: "एग्रीबॉट एक एआई-संचालित स्मार्ट खेती सहायक है जो आसान चैट इंटरफ़ेस के माध्यम से फसल स्वास्थ्य, मौसम अपडेट, बाजार मूल्य और सरकारी योजनाओं पर रीयल-टाइम मार्गदर्शन प्रदान करने के लिए डिज़ाइन किया गया है।",
    q2: "मैं वॉयस फीचर का उपयोग कैसे करूं?",
    a2: "बस चैट इनपुट क्षेत्र में माइक्रोफ़ोन (🎤) आइकन पर क्लिक करें, और अपनी प्राकृतिक क्षेत्रीय भाषा में अपनी क्वेरी बोलें। एग्रीबॉट आपके भाषण को टेक्स्ट में बदल देगा और स्वचालित रूप से प्रतिक्रिया देगा।",
    q3: "मैं फसल की बीमारी का निदान कैसे कर सकता हूं?",
    a3: "आप या तो बॉट को लक्षणों का वर्णन कर सकते हैं (जैसे, 'मेरे गेहूं के पत्तों पर भूरे धब्बे हैं') या तत्काल एआई निदान के लिए प्रभावित पौधे की तस्वीर भेजने के लिए छवि अपलोड बटन (🖼️) का उपयोग कर सकते हैं।",
    q4: "क्या एग्रीबॉट उपयोग करने के लिए स्वतंत्र है?",
    a4: "हां! एग्रीबॉट किसानों के लिए पूरी तरह से मुफ्त है। हमारा लक्ष्य महत्वपूर्ण कृषि डेटा और विशेषज्ञ सलाह को सभी के लिए सुलभ बनाना है।",
    loginTitle: "एग्रीबॉट सिस्टम",
    loginToAccount: "अपने खाते में प्रवेश करें।",
    createAccount: "अपना एग्रीबॉट खाता बनाएं।",
    fullNameLabel: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
    stateLabel: "राज्य",
    statePlaceholder: "अपना राज्य दर्ज करें",
    districtLabel: "जिला",
    districtPlaceholder: "अपना जिला दर्ज करें",
    villageLabel: "गाँव / शहर",
    villagePlaceholder: "अपना गाँव या शहर दर्ज करें",
    landSizeLabel: "भूमि का आकार (एकड़ में)",
    landSizePlaceholder: "उदा. 5",
    primaryCropLabel: "मुख्य फसल",
    primaryCropPlaceholder: "उदा. गेहूं, चावल",
    alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
    loginHere: "यहां लॉगिन करें",
    mobileLabel: "मोबाइल नंबर",
    mobilePlaceholder: "10 अंकों का नंबर दर्ज करें",
    sendOtp: "ओटीपी भेजें",
    newUser: "नया उपयोगकर्ता?",
    registerHere: "यहां रजिस्टर करें",
    otpLabel: "ओटीपी दर्ज करें",
    otpPlaceholder: "4-अंकीय ओटीपी दर्ज करें",
    verifyLogin: "सत्यापित करें और लॉगिन करें",
    changeNumber: "मोबाइल नंबर बदलें",
    tagline: "स्मार्ट खेती सहायक",
    chatWelcome: "AgriBot में आपका स्वागत है",
    chatSubtitle: "आपका एआई-संचालित कृषि सहायक",
    askViaText: "टेक्स्ट या आवाज़ के माध्यम से पूछें...",
    newChat: "नई चैट",
    recentChats: "हाल की चैट",
    endSession: "लॉग आउट",
    endChat: "चैट समाप्त करें",
    farmerPrefix: "किसान",
    aboutTitle: "एग्रीबॉट के बारे में",
    aboutDesc: "एग्रीबॉट एक बुद्धिमान खेती सहायक है जो किसानों को मौसम, बाजार मूल्यों और फसल स्वास्थ्य पर डेटा-संचालित अंतर्दृष्टि के साथ सशक्त बनाने के लिए समर्पित है।",
    contactTitle: "संपर्क सहायता",
    contactEmail: "ईमेल: support@agribot.in",
    contactPhone: "टोल-फ्री: 1800-123-4567",
    contactHours: "सोम - शनि, सुबह 9 बजे से शाम 6 बजे तक",
    privacyTitle: "गोपनीयता नीति",
    privacyDesc: "आपकी गोपनीयता हमारी प्राथमिकता है। आपके द्वारा साझा किया गया कोई भी डेटा केवल कृषि संबंधी सिफारिशों को बेहतर बनाने के लिए उपयोग किया जाता है और कभी भी तीसरे पक्ष को नहीं बेचा जाता है।",
    copyright: `© ${new Date().getFullYear()} एग्रीबॉट। सर्वाधिकार सुरक्षित।`,
    builtWith: "किसानों के लिए बनाया गया"
  }
};

// Mock AI Logic
const mockAIResponse = (input: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('disease') || lowerInput.includes('bug') || lowerInput.includes('sick')) {
        resolve("I can help with crop diseases. Please describe the symptoms (e.g., spots on leaves, wilting) or upload a photo of the affected plant.");
      } else if (lowerInput.includes('weather') || lowerInput.includes('rain') || lowerInput.includes('मौसम')) {
        resolve("Based on your general region, expect light showers over the next 48 hours. It might be a good time to delay pesticide application.");
      } else if (lowerInput.includes('price') || lowerInput.includes('market') || lowerInput.includes('wheat')) {
        resolve("Currently, wheat is trading at a slightly higher margin than last month. I recommend checking the local mandi rates for exact figures in your district.");
      } else if (lowerInput.includes('scheme') || lowerInput.includes('government') || lowerInput.includes('subsidy')) {
        resolve("There are several new subsidies for PM-KISAN beneficiaries this season. Would you like me to check your eligibility based on your registered details?");
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        resolve("Hello! I'm AgriBot, your personal farming assistant. How can I help you improve your yield today?");
      } else {
        resolve("That's an interesting question. While I'm still learning, I recommend consulting your local agricultural extension office for highly specific local guidance. Is there anything else you'd like to ask about crops, weather, or market rates?");
      }
    }, 1500); // 1.5s typing delay
  });
};

function App() {
  // Navigation & Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [landSize, setLandSize] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Location State
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Translation State
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const t = translations[lang];

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>(Date.now().toString());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isListening, setIsListening] = useState(false);
  
  // Try it Mock State
  const [mockInput, setMockInput] = useState('');
  const [isMockListening, setIsMockListening] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Update chat history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setChatHistory(prev => {
        const existingSessionIndex = prev.findIndex(session => session.id === currentChatId);
        const title = messages[0].text.substring(0, 30) + (messages[0].text.length > 30 ? '...' : '');
        
        if (existingSessionIndex >= 0) {
          const updated = [...prev];
          updated[existingSessionIndex] = {
            ...updated[existingSessionIndex],
            title: title,
            messages: messages
          };
          return updated;
        } else {
          return [{ id: currentChatId, title, messages }, ...prev];
        }
      });
    }
  }, [messages, currentChatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const requestSystemPermissions = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => console.error("Media permission denied:", err));
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => console.log("Location granted:", pos),
          (err) => console.error("Location error:", err)
        );
      }
    } catch (err) {
      console.error("Permission request error:", err);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert(lang === 'hi' ? "आपका ब्राउज़र स्थान का समर्थन नहीं करता है।" : "Your browser does not support location services.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setLatitude(lat);
        setLongitude(lon);
        
        try {
          // Reverse geocoding using OpenStreetMap Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          if (data && data.address) {
            if (data.address.state) setStateName(data.address.state);
            if (data.address.state_district || data.address.county || data.address.city) {
              setDistrict(data.address.state_district || data.address.county || data.address.city);
            }
            if (data.address.village || data.address.town || data.address.suburb) {
              setVillage(data.address.village || data.address.town || data.address.suburb);
            }
          }
        } catch (error) {
          console.error("Geocoding failed:", error);
        }
        setIsLocating(false);
      },
      (err) => {
        console.error("Location error:", err);
        alert(lang === 'hi' ? "स्थान प्राप्त करने में विफल।" : "Failed to get location.");
        setIsLocating(false);
      }
    );
  };

  // Auth Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10 && password.length >= 4) {
      setIsLoading(true);

      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('agribot_users') || '{}');
        const cleanMobile = mobileNumber.trim();

        if (authMode === 'register') {
          if (users[cleanMobile]) {
            alert(lang === 'hi' ? "यह मोबाइल नंबर पहले से पंजीकृत है।" : "This mobile number is already registered.");
            setIsLoading(false);
            return;
          }
          // Save new user
          users[cleanMobile] = { password, fullName, stateName, district, village, landSize, primaryCrop, latitude, longitude };
          localStorage.setItem('agribot_users', JSON.stringify(users));
          
          setIsAuthenticated(true);
          setShowAuthScreen(false);
          requestSystemPermissions();
        } else {
          // Login
          const user = users[cleanMobile];
          if (user && user.password === password) {
            setIsAuthenticated(true);
            setShowAuthScreen(false);
            // Load user data into state
            setFullName(user.fullName || '');
            setStateName(user.stateName || '');
            setDistrict(user.district || '');
            setVillage(user.village || '');
            setLandSize(user.landSize || '');
            setPrimaryCrop(user.primaryCrop || '');
            setLatitude(user.latitude || null);
            setLongitude(user.longitude || null);
            requestSystemPermissions();
          } else {
            alert(lang === 'hi' ? "अमान्य मोबाइल नंबर या पासवर्ड।" : "Invalid mobile number or password.");
          }
        }
        setIsLoading(false);
      }, 1000); // Simulate network delay
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowAuthScreen(false);
    setMobileNumber('');
    setFullName('');
    setStateName('');
    setDistrict('');
    setVillage('');
    setLandSize('');
    setPrimaryCrop('');
    setPassword('');
    setLatitude(null);
    setLongitude(null);
    setMessages([]);
    setAuthMode('login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.trim();
    if (!cleanMobile) return;
    
    const users = JSON.parse(localStorage.getItem('agribot_users') || '{}');
    if (users[cleanMobile]) {
      users[cleanMobile] = {
        ...users[cleanMobile],
        fullName, stateName, district, village, landSize, primaryCrop
      };
      localStorage.setItem('agribot_users', JSON.stringify(users));
      alert(lang === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!' : 'Profile updated successfully!');
      setShowProfileModal(false);
    }
  };

  // Chat Handlers
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const responseText = await mockAIResponse(userMsg.text);
    
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleQuickAction = (actionText: string) => {
    setInput(actionText);
  };

  const handleReadAloud = (text: string) => {
    if (!window.speechSynthesis) {
      alert(lang === 'hi' ? "आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता है।" : "Your browser does not support text-to-speech.");
      return;
    }
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const toggleRealVoiceInput = (isMockArea: boolean) => {
    const isCurrentlyListening = isMockArea ? isMockListening : isListening;
    const setInputFn = isMockArea ? setMockInput : setInput;
    const setListeningFn = isMockArea ? setIsMockListening : setIsListening;

    if (isCurrentlyListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'hi' ? "आपका ब्राउज़र वॉयस रिकग्निशन को सपोर्ट नहीं करता है। कृपया Chrome का उपयोग करें।" : "Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    const existingText = isMockArea ? mockInput : input;

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setListeningFn(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        const newText = existingText 
          ? (existingText.endsWith(' ') ? existingText + transcript : existingText + ' ' + transcript)
          : transcript;
        setInputFn(newText);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          alert(lang === 'hi' ? "माइक्रोफ़ोन एक्सेस अस्वीकृत कर दिया गया है। कृपया अनुमति दें।" : "Microphone access denied. Please allow permissions in your browser.");
        } else if (event.error !== 'no-speech') {
          alert(`Microphone Error: ${event.error}. Please ensure your mic is plugged in and working.`);
        }
        setListeningFn(false);
      };

      recognition.onend = () => {
        setListeningFn(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Speech recognition setup error:", e);
      setListeningFn(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsAuthenticated(false);
    setShowAuthScreen(false);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Scroll Animation Observer
  useEffect(() => {
    if (isAuthenticated || showAuthScreen) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.fade-in-section');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, [isAuthenticated, showAuthScreen]);

  // Landing Page View
  if (!isAuthenticated && !showAuthScreen) {
    return (
      <div className="landing-container">
        {/* Header */}
        <header className="landing-header">
          <a href="#" className="landing-logo">
            <Sprout size={36} />
            <div className="landing-logo-text">
              <h2>AgriBot</h2>
              <span className="tagline hidden-mobile">{t.tagline}</span>
            </div>
          </a>
          <nav className="landing-nav">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>{t.home}</a>
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>{t.about}</a>
            <a href="#help" onClick={(e) => handleNavClick(e, 'help')}>{t.help}</a>
          </nav>
          <div className="language-selector hidden-mobile">
            <Globe size={18} color="var(--text-secondary)" />
            <select aria-label="Language Selector" value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'hi')}>
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </header>

        {/* Hero Section */}
        <section id="home" className="hero-section">
          <h1 className="fade-in-section">{t.welcome}</h1>
          <p className="hero-desc fade-in-section delay-100">{t.heroDesc}</p>
          <div className="hero-buttons fade-in-section delay-200">
            <a href="#try" className="btn-primary">{t.getStarted}</a>
            <button onClick={() => setShowAuthScreen(true)} className="btn-secondary">{t.loginRegister}</button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <h2 className="section-title fade-in-section">{t.featuresTitle}</h2>
          <div className="features-grid">
            <div className="feature-card fade-in-section">
              <div className="feature-icon-wrapper"><Sprout size={32} /></div>
              <h3 className="feature-title">{t.cropAdvisory}</h3>
              <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{t.cropDesc}</p>
            </div>
            <div className="feature-card fade-in-section delay-100">
              <div className="feature-icon-wrapper"><Bug size={32} /></div>
              <h3 className="feature-title">{t.pestDisease}</h3>
              <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{t.pestDesc}</p>
            </div>
            <div className="feature-card fade-in-section delay-200">
              <div className="feature-icon-wrapper"><CloudRain size={32} /></div>
              <h3 className="feature-title">{t.weather}</h3>
              <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{t.weatherDesc}</p>
            </div>
            <div className="feature-card fade-in-section">
              <div className="feature-icon-wrapper"><TrendingUp size={32} /></div>
              <h3 className="feature-title">{t.market}</h3>
              <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{t.marketDesc}</p>
            </div>
            <div className="feature-card fade-in-section delay-100">
              <div className="feature-icon-wrapper"><Landmark size={32} /></div>
              <h3 className="feature-title">{t.schemes}</h3>
              <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{t.schemesDesc}</p>
            </div>
            <div className="feature-card fade-in-section delay-200">
              <div className="feature-icon-wrapper"><Mic size={32} /></div>
              <h3 className="feature-title">{t.voice}</h3>
              <p style={{color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{t.voiceDesc}</p>
            </div>
          </div>
        </section>

        {/* Interaction Section */}
        <section id="try" className="interaction-section">
          <h2 className="section-title fade-in-section" style={{marginBottom: '1rem'}}>{t.tryTitle}</h2>
          <p className="fade-in-section delay-100" style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>{t.tryDesc}</p>
          <div className="mock-chat-container fade-in-section delay-200">
            <div className="mock-input-wrapper">
              <input 
                type="text" 
                className="mock-input" 
                placeholder={t.placeholder}
                value={mockInput}
                onChange={(e) => setMockInput(e.target.value)}
                disabled={isMockListening}
              />
              <button 
                className="mock-btn" 
                title="Voice Input"
                onClick={() => toggleRealVoiceInput(true)}
                style={{ color: isMockListening ? '#ef4444' : 'inherit' }}
              >
                <Mic size={24} />
              </button>
              <button className="mock-btn send" onClick={() => setShowAuthScreen(true)} disabled={isMockListening}><Send size={20} /></button>
            </div>
            <div className="example-queries">
              <span>{t.exampleQueries}</span>
              <div className="example-chips">
                <div className="example-chip" onClick={() => setMockInput("Which crop is best for this season?")}>"Which crop is best for this season?"</div>
                <div className="example-chip" onClick={() => setMockInput("आज का मौसम कैसा रहेगा?")}>"आज का मौसम कैसा रहेगा?"</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / Help Section */}
        <section id="help" className="faq-section">
          <h2 className="section-title fade-in-section" style={{marginBottom: '1rem'}}>{t.faqTitle}</h2>
          <p className="fade-in-section delay-100" style={{color: 'var(--text-secondary)', marginBottom: '3rem'}}>{t.faqDesc}</p>
          
          <div className="faq-container fade-in-section delay-200">
            <div className="faq-item">
              <h3 className="faq-question">
                <HelpCircle size={20} color="var(--accent-primary)" /> 
                {t.q1}
              </h3>
              <p className="faq-answer">{t.a1}</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">
                <HelpCircle size={20} color="var(--accent-primary)" /> 
                {t.q2}
              </h3>
              <p className="faq-answer">{t.a2}</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">
                <HelpCircle size={20} color="var(--accent-primary)" /> 
                {t.q3}
              </h3>
              <p className="faq-answer">{t.a3}</p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">
                <HelpCircle size={20} color="var(--accent-primary)" /> 
                {t.q4}
              </h3>
              <p className="faq-answer">{t.a4}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>{t.aboutTitle}</h4>
              <p>{t.aboutDesc}</p>
            </div>
            <div className="footer-section">
              <h4>{t.contactTitle}</h4>
              <p>{t.contactEmail}</p>
              <p>{t.contactPhone}</p>
              <p>{t.contactHours}</p>
            </div>
            <div className="footer-section">
              <h4>{t.privacyTitle}</h4>
              <p>{t.privacyDesc}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>{t.copyright}</p>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              {t.builtWith} <Heart size={16} fill="#ef4444" color="#ef4444" />
            </span>
          </div>
        </footer>
      </div>
    );
  }

  // Auth Modal View
  if (!isAuthenticated && showAuthScreen) {
    return (
      <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Unified Header for Auth */}
        <header className="landing-header">
          <a href="#" className="landing-logo" onClick={() => setShowAuthScreen(false)}>
            <Sprout size={36} />
            <div className="landing-logo-text">
              <h2>AgriBot</h2>
            </div>
          </a>
          <nav className="landing-nav">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>{t.home}</a>
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>{t.about}</a>
            <a href="#help" onClick={(e) => handleNavClick(e, 'help')}>{t.help}</a>
          </nav>
          <div className="language-selector hidden-mobile">
            <Globe size={18} color="var(--text-secondary)" />
            <select aria-label="Language Selector" value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'hi')}>
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
        </header>

        <div className="auth-section" style={{ flex: 1 }}>
          <div className="auth-card" style={{position: 'relative'}}>
            <button 
              onClick={() => setShowAuthScreen(false)} 
              style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}
            >
              ← Back
            </button>
          <div className="feature-icon-wrapper" style={{ margin: '0 auto 1.5rem' }}>
            <Sprout size={36} />
          </div>
          <h3>{t.loginTitle}</h3>
          <p>{authMode === 'login' ? t.loginToAccount : t.createAccount}</p>
          
          <form onSubmit={handleAuth}>
            {authMode === 'register' && (
              <>
                  <div className="auth-input-group">
                    <label className="auth-label">{t.fullNameLabel}</label>
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder={t.fullNamePlaceholder}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                      border: '1px solid var(--primary-color)',
                      borderRadius: '0.5rem',
                      cursor: isLocating ? 'wait' : 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MapPin size={18} />
                    {isLocating ? (lang === 'hi' ? "स्थान प्राप्त कर रहा है..." : "Detecting Location...") : (lang === 'hi' ? "मेरा वर्तमान स्थान उपयोग करें" : "Use My Current Location")}
                  </button>

                  <div className="auth-input-group" style={{display: 'flex', gap: '1rem'}}>
                    <div style={{flex: 1}}>
                      <label className="auth-label">{t.stateLabel}</label>
                      <input 
                        type="text" 
                        className="auth-input" 
                        placeholder={t.statePlaceholder}
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{flex: 1}}>
                      <label className="auth-label">{t.districtLabel}</label>
                      <input 
                        type="text" 
                        className="auth-input" 
                        placeholder={t.districtPlaceholder}
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="auth-input-group">
                    <label className="auth-label">{t.villageLabel}</label>
                    <input 
                      type="text" 
                      className="auth-input" 
                      placeholder={t.villagePlaceholder}
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="auth-input-group" style={{display: 'flex', gap: '1rem'}}>
                    <div style={{flex: 1}}>
                      <label className="auth-label">{t.landSizeLabel}</label>
                      <input 
                        type="number" 
                        className="auth-input" 
                        placeholder={t.landSizePlaceholder}
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div style={{flex: 1}}>
                      <label className="auth-label">{t.primaryCropLabel}</label>
                      <input 
                        type="text" 
                        className="auth-input" 
                        placeholder={t.primaryCropPlaceholder}
                        value={primaryCrop}
                        onChange={(e) => setPrimaryCrop(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            <div className="auth-input-group">
              <label className="auth-label">{t.mobileLabel}</label>
              <input 
                type="tel" 
                className="auth-input" 
                placeholder={t.mobilePlaceholder}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">{lang === 'hi' ? 'पासवर्ड' : 'Password'}</label>
              <input 
                type="password" 
                className="auth-input" 
                placeholder={lang === 'hi' ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="auth-btn-submit" disabled={isLoading}>
              {isLoading ? (lang === 'hi' ? "प्रतीक्षा करें..." : "Please wait...") : (authMode === 'login' ? t.verifyLogin : t.createAccount)}
            </button>
            
            {authMode === 'login' ? (
              <p className="register-prompt">
                {t.newUser} <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('register'); }}>{t.registerHere}</a>
              </p>
            ) : (
              <p className="register-prompt">
                {t.alreadyHaveAccount} <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('login'); }}>{t.loginHere}</a>
              </p>
            )}
          </form>
        </div>
      </div>
      </div>
    );
  }

  // Authenticated Chat View
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="landing-logo" style={{margin: 0}}>
            <Sprout size={28} />
            <h1 style={{fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0}}>AgriBot</h1>
          </div>
          <button className="mobile-menu-btn" onClick={toggleSidebar} style={{marginLeft: 'auto'}}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-content">
          <button className="btn-primary" style={{width: '100%', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', padding: '0.75rem'}} onClick={() => {
            if (messages.length > 0) {
              setMessages([]);
              setCurrentChatId(Date.now().toString());
            }
          }}>
            <Plus size={20} /> {t.newChat}
          </button>

          <h2 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem'}}>{t.recentChats}</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {chatHistory.length === 0 ? (
              <span style={{fontSize: '0.875rem', color: 'var(--text-secondary)', padding: '0.5rem'}}>{lang === 'hi' ? 'कोई हाल की चैट नहीं' : 'No recent chats'}</span>
            ) : (
              chatHistory.map(session => (
                <div 
                  key={session.id}
                  onClick={() => {
                    setCurrentChatId(session.id);
                    setMessages(session.messages);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', 
                    borderRadius: '0.5rem', cursor: 'pointer', 
                    color: currentChatId === session.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    backgroundColor: currentChatId === session.id ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                    border: currentChatId === session.id ? '1px solid var(--accent-primary)' : '1px solid transparent'
                  }}
                >
                  <MessageSquare size={16} />
                  <span style={{fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{session.title}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer'}} onClick={() => {
            if (messages.length > 0) {
              setMessages([]);
              setCurrentChatId(Date.now().toString());
            }
          }}>
            <XCircle size={18} />
            <span>{t.endChat}</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>

          {/* Unified Navigation inside Chat */}
          <nav className="landing-nav hidden-mobile" style={{ marginLeft: '2rem' }}>
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>{t.home}</a>
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>{t.about}</a>
            <a href="#help" onClick={(e) => handleNavClick(e, 'help')}>{t.help}</a>
          </nav>

          <div style={{ flex: 1 }}></div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span className="hidden-mobile" style={{fontWeight: 500}}>{t.farmerPrefix}: {fullName || mobileNumber || 'User'}</span>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
                borderRadius: '50%', width: '40px', height: '40px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                color: 'var(--accent-primary)', transition: 'all 0.2s'
              }}
            >
              <User size={20} />
            </button>

            {showProfileMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                borderRadius: '0.75rem', padding: '0.5rem', width: '200px',
                boxShadow: 'var(--shadow-lg)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.25rem'
              }}>
                <button 
                  onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}
                  style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'var(--text-primary)', fontWeight: 500}}
                >
                  <User size={18} /> {lang === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
                </button>
                <div style={{height: '1px', background: 'var(--border-color)', width: '100%'}}></div>
                <button 
                  onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                  style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', width: '100%', color: '#ef4444', fontWeight: 500}}
                >
                  <LogOut size={18} /> {t.endSession}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center'}}>
              <h2 style={{fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)'}}>{t.chatWelcome}</h2>
              <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>{t.chatSubtitle}</p>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%', maxWidth: '600px'}}>
                <div style={{padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '1rem', background: 'var(--bg-secondary)', cursor: 'pointer', textAlign: 'left'}} onClick={() => handleQuickAction("Diagnose crop disease")}>
                  <Bug size={24} color="var(--accent-primary)" style={{marginBottom: '0.5rem'}} />
                  <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{t.pestDisease}</div>
                </div>
                <div style={{padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '1rem', background: 'var(--bg-secondary)', cursor: 'pointer', textAlign: 'left'}} onClick={() => handleQuickAction("What is the weather forecast for farming?")}>
                  <CloudRain size={24} color="var(--accent-primary)" style={{marginBottom: '0.5rem'}} />
                  <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{t.weather}</div>
                </div>
                <div style={{padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '1rem', background: 'var(--bg-secondary)', cursor: 'pointer', textAlign: 'left'}} onClick={() => handleQuickAction("Current wheat market prices")}>
                  <TrendingUp size={24} color="var(--accent-primary)" style={{marginBottom: '0.5rem'}} />
                  <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{t.market}</div>
                </div>
                <div style={{padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '1rem', background: 'var(--bg-secondary)', cursor: 'pointer', textAlign: 'left'}} onClick={() => handleQuickAction("Check eligibility for government farming schemes")}>
                  <Landmark size={24} color="var(--accent-primary)" style={{marginBottom: '0.5rem'}} />
                  <div style={{fontWeight: 600, color: 'var(--text-primary)'}}>{t.schemes}</div>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                <div className={`message ${msg.sender}`}>
                  <div className={`avatar ${msg.sender}`}>
                    {msg.sender === 'bot' ? <Sprout size={20} /> : <span style={{fontWeight: 600}}>F</span>}
                  </div>
                  <div className="message-content">
                    {msg.text}
                    {msg.sender === 'bot' && (
                      <button 
                        style={{background: 'none', border: 'none', color: 'var(--accent-primary)', marginLeft: '0.5rem', cursor: 'pointer'}} 
                        title="Read Aloud"
                        onClick={() => handleReadAloud(msg.text)}
                      >
                        <Volume2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="message-wrapper bot">
              <div className="message bot">
                <div className="avatar bot"><Sprout size={20} /></div>
                <div className="message-content" style={{display: 'flex', alignItems: 'center', gap: '0.25rem'}}>
                  <div style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)'}}></div>
                  <div style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)'}}></div>
                  <div style={{width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <form className="input-form" onSubmit={handleSend} style={{position: 'relative'}}>
            {showImageMenu && (
              <div style={{
                position: 'absolute', bottom: 'calc(100% + 0.5rem)', left: '0',
                background: 'var(--bg-secondary)', borderRadius: '0.75rem', padding: '0.5rem',
                boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 50,
                minWidth: '150px'
              }}>
                <button type="button" onClick={() => { setShowImageMenu(false); cameraInputRef.current?.click(); }} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: '0.5rem', width: '100%', textAlign: 'left', fontWeight: 500}}>
                  <Camera size={18} /> {lang === 'hi' ? 'कैमरा' : 'Camera'}
                </button>
                <div style={{height: '1px', background: 'var(--border-color)', width: '100%'}}></div>
                <button type="button" onClick={() => { setShowImageMenu(false); galleryInputRef.current?.click(); }} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', borderRadius: '0.5rem', width: '100%', textAlign: 'left', fontWeight: 500}}>
                  <ImageIcon size={18} /> {lang === 'hi' ? 'गैलरी' : 'Gallery'}
                </button>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} style={{display: 'none'}} onChange={(e) => { if (e.target.files?.length) { setInput('[Image Attached: ' + e.target.files[0].name + '] '); } }} />
            <input type="file" accept="image/*" ref={galleryInputRef} style={{display: 'none'}} onChange={(e) => { if (e.target.files?.length) { setInput('[Image Attached: ' + e.target.files[0].name + '] '); } }} />

            <button type="button" className="input-btn" title="Upload Image" onClick={() => setShowImageMenu(!showImageMenu)}>
              <ImageIcon size={20} style={{color: showImageMenu ? 'var(--accent-primary)' : 'inherit'}} />
            </button>
            <textarea 
              className="input-textarea"
              placeholder={t.askViaText}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              disabled={false}
            />
            <button 
              type="button" 
              className="input-btn" 
              onClick={() => toggleRealVoiceInput(false)}
              style={{ color: isListening ? '#ef4444' : 'var(--text-secondary)' }}
            >
              <Mic size={20} />
            </button>
            <button 
              type="submit" 
              className="input-btn send-btn"
              disabled={!input.trim() || isTyping || isListening}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '1rem'}}>
          <div style={{background: 'var(--bg-secondary)', borderRadius: '1rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)'}}>
              <h2 style={{margin: 0, color: 'var(--text-primary)'}}>{lang === 'hi' ? 'मेरी प्रोफ़ाइल संपादित करें' : 'Edit My Profile'}</h2>
              <button onClick={() => setShowProfileModal(false)} style={{background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProfile} style={{padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label className="form-label">{t.fullNameLabel}</label>
                <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              
              <div>
                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" value={mobileNumber} disabled style={{opacity: 0.7, cursor: 'not-allowed'}} />
                <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'block'}}>Mobile number cannot be changed.</span>
              </div>

              <div>
                <label className="form-label">{t.stateLabel}</label>
                <input type="text" className="form-input" value={stateName} onChange={(e) => setStateName(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">{t.districtLabel}</label>
                <input type="text" className="form-input" value={district} onChange={(e) => setDistrict(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">{t.villageLabel}</label>
                <input type="text" className="form-input" value={village} onChange={(e) => setVillage(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">{t.landSizeLabel}</label>
                <input type="text" className="form-input" value={landSize} onChange={(e) => setLandSize(e.target.value)} required />
              </div>

              <div>
                <label className="form-label">{t.primaryCropLabel}</label>
                <input type="text" className="form-input" value={primaryCrop} onChange={(e) => setPrimaryCrop(e.target.value)} required />
              </div>

              <div style={{marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
                <button type="button" className="btn-secondary" onClick={() => setShowProfileModal(false)}>
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button type="submit" className="btn-primary">
                  {lang === 'hi' ? 'सेव करें' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
