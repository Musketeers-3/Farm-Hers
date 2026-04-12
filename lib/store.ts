import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "hi" | "pa";
export type UserRole = "farmer" | "buyer";
export type OrderStatus =
  | "pending"
  | "in-transit"
  | "quality-verified"
  | "payment-released";

export type Screen =
  | "home"
  | "sell"
  | "auction"
  | "tracking"
  | "market"
  | "profile"
  | "notifications"
  | "earnings";

export interface Crop {
  id: string;
  name: string;
  nameHi: string;
  namePa: string;
  image: string;
  currentPrice: number;
  unit: string;
}

export interface Pool {
  id: string;
  cropId: string;
  totalQuantity: number;
  contributors: number;
  bonusPerQuintal: number;
  status: "open" | "closed" | "sold";
  targetQuantity: number;
}

export interface Auction {
  id: string;
  cropId: string;
  farmerId: string;
  quantity: number;
  startingPrice: number;
  currentBid: number;
  highestBidderId: string | null;
  endTime: string;
  status: "live" | "ended" | "cancelled";
}

export interface Order {
  id: string;
  cropId: string;
  quantity: number;
  pricePerQuintal: number;
  totalAmount: number;
  status: OrderStatus;
  buyerId: string;
  farmerId: string;
  createdAt: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: "sunny" | "cloudy" | "rainy" | "partly-cloudy";
  isGoodForHarvest: boolean;
}

export interface MarketInsight {
  cropId: string;
  mandiName: string;
  price: number;
  trend: "up" | "down" | "stable";
  percentChange: number;
}

interface AppState {
  hasOnboarded: boolean;
  setHasOnboarded: (v: boolean) => void;

  // Auth — NEW
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // User
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  userName: string;
  setUserName: (name: string) => void;
  userLocation: string;
  setUserLocation: (location: string) => void;

  // Crops
  crops: Crop[];
  selectedCrop: Crop | null;
  setSelectedCrop: (crop: Crop | null) => void;

  // Pools
  pools: Pool[];
  addPool: (pool: Pool) => void;
  joinPool: (poolId: string, quantity: number) => void;

  // Auctions
  auctions: Auction[];
  addAuction: (auction: Auction) => void;
  placeBid: (auctionId: string, amount: number, bidderId: string) => void;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Weather
  weather: WeatherData | null;
  setWeather: (weather: WeatherData) => void;

  // Market
  marketInsights: MarketInsight[];
  setMarketInsights: (insights: MarketInsight[]) => void;

  // UI State
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  isBoloListening: boolean;
  setBoloListening: (listening: boolean) => void;

  // Sell Flow
  sellQuantity: number;
  setSellQuantity: (qty: number) => void;
  sellPrice: number;
  setSellPrice: (price: number) => void;
}

const sampleCrops: Crop[] = [
  {
    id: "wheat",
    name: "Wheat",
    nameHi: "गेहूं",
    namePa: "ਕਣਕ",
    image: "/crops/wheat.jpg",
    currentPrice: 2275,
    unit: "quintal",
  },
  {
    id: "rice",
    name: "Rice",
    nameHi: "चावल",
    namePa: "ਚੌਲ",
    image: "/crops/rice.jpg",
    currentPrice: 2150,
    unit: "quintal",
  },
  {
    id: "corn",
    name: "Corn",
    nameHi: "मक्का",
    namePa: "ਮੱਕੀ",
    image: "/crops/corn.jpg",
    currentPrice: 1850,
    unit: "quintal",
  },
  {
    id: "mustard",
    name: "Mustard",
    nameHi: "सरसों",
    namePa: "ਸਰ੍ਹੋਂ",
    image: "/crops/mustard.jpg",
    currentPrice: 5200,
    unit: "quintal",
  },
  {
    id: "potato",
    name: "Potato",
    nameHi: "आलू",
    namePa: "ਆਲੂ",
    image: "/crops/potato.jpg",
    currentPrice: 1200,
    unit: "quintal",
  },
  {
    id: "onion",
    name: "Onion",
    nameHi: "प्याज",
    namePa: "ਪਿਆਜ਼",
    image: "/crops/onion.jpg",
    currentPrice: 1800,
    unit: "quintal",
  },
];

const samplePools: Pool[] = [
  {
    id: "pool-1",
    cropId: "wheat",
    totalQuantity: 350,
    contributors: 8,
    bonusPerQuintal: 150,
    status: "open",
    targetQuantity: 500,
  },
  {
    id: "pool-2",
    cropId: "mustard",
    totalQuantity: 200,
    contributors: 5,
    bonusPerQuintal: 200,
    status: "open",
    targetQuantity: 300,
  },
];

const sampleAuctions: Auction[] = [
  {
    id: "auction-1",
    cropId: "wheat",
    farmerId: "farmer-1",
    quantity: 100,
    startingPrice: 2300,
    currentBid: 2450,
    highestBidderId: "buyer-2",
    endTime: new Date(Date.now() + 3600000).toISOString(),
    status: "live",
  },
];

const sampleMarketInsights: MarketInsight[] = [
  {
    cropId: "wheat",
    mandiName: "Ludhiana Mandi",
    price: 2350,
    trend: "up",
    percentChange: 3.5,
  },
  {
    cropId: "rice",
    mandiName: "Amritsar Mandi",
    price: 2180,
    trend: "stable",
    percentChange: 0.2,
  },
  {
    cropId: "mustard",
    mandiName: "Jaipur Mandi",
    price: 5350,
    trend: "up",
    percentChange: 5.2,
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      setHasOnboarded: (v) => set({ hasOnboarded: v }),

      // Auth
      isLoggedIn: false,
      setIsLoggedIn: (v) => set({ isLoggedIn: v }),
      userEmail: "",
      setUserEmail: (email) => set({ userEmail: email }),

      // Language
      language: "en",
      setLanguage: (lang) => set({ language: lang }),

      // User
      userRole: "farmer",
      setUserRole: (role) => set({ userRole: role }),
      userName: "",
      setUserName: (name) => set({ userName: name }),
      userLocation: "",
      setUserLocation: (location) => set({ userLocation: location }),

      // Crops
      crops: sampleCrops,
      selectedCrop: null,
      setSelectedCrop: (crop) => set({ selectedCrop: crop }),

      // Pools
      pools: samplePools,
      addPool: (pool) => set((state) => ({ pools: [...state.pools, pool] })),
      joinPool: (poolId, quantity) =>
        set((state) => ({
          pools: state.pools.map((p) =>
            p.id === poolId
              ? {
                  ...p,
                  totalQuantity: p.totalQuantity + quantity,
                  contributors: p.contributors + 1,
                }
              : p,
          ),
        })),

      // Auctions
      auctions: sampleAuctions,
      addAuction: (auction) =>
        set((state) => ({ auctions: [...state.auctions, auction] })),
      placeBid: (auctionId, amount, bidderId) =>
        set((state) => ({
          auctions: state.auctions.map((a) =>
            a.id === auctionId && amount > a.currentBid
              ? { ...a, currentBid: amount, highestBidderId: bidderId }
              : a,
          ),
        })),

      // Orders
      orders: [],
      addOrder: (order) =>
        set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o,
          ),
        })),

      // Weather
      weather: {
        temperature: 32,
        humidity: 45,
        windSpeed: 12,
        condition: "sunny",
        isGoodForHarvest: true,
      },
      setWeather: (weather) => set({ weather }),

      // Market
      marketInsights: sampleMarketInsights,
      setMarketInsights: (insights) => set({ marketInsights: insights }),

      // UI State
      activeScreen: "home",
      setActiveScreen: (screen) => set({ activeScreen: screen }),
      isBoloListening: false,
      setBoloListening: (listening) => set({ isBoloListening: listening }),

      // Sell Flow
      sellQuantity: 0,
      setSellQuantity: (qty) => set({ sellQuantity: qty }),
      sellPrice: 0,
      setSellPrice: (price) => set({ sellPrice: price }),
    }),
    {
      name: "agrilink-storage",
      version: 1, // bump from 0 to 1
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Fresh migration — keep existing fields, default isLoggedIn to false
          return { ...persistedState, isLoggedIn: false };
        }
        return persistedState;
      },
      partialize: (state) => ({
        language: state.language,
        userRole: state.userRole,
        userName: state.userName,
        userEmail: state.userEmail,
        userLocation: state.userLocation,
        hasOnboarded: state.hasOnboarded,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);

export const translations = {
  en: {
    welcome: "Welcome to AgriLink",
    hello: "Hello",
    getStarted: "Get Started",
    sell: "Sell",
    buy: "Buy",
    market: "Market",
    weather: "Weather",
    myFields: "My Fields",
    commodities: "Commodities & Food",
    marketInsight: "Market Insight",
    topPrice: "Top Price",
    goodDayToHarvest: "Good Day to Harvest",
    notIdealForHarvest: "Not Ideal for Harvest",
    farmersNearby: "farmers nearby are selling today",
    joinPool: "Join Pool",
    startAuction: "Start Auction",
    currentBid: "Current Bid",
    timeLeft: "Time Left",
    placeBid: "Place Bid",
    quantity: "Quantity",
    quintals: "quintals",
    totalValue: "Total Value",
    soilTemp: "Soil Temp",
    humidity: "Humidity",
    wind: "Wind",
    precipitation: "Precipitation",
    bolo: "Bolo",
    speakNow: "Speak now...",
    listening: "Listening...",
    tracking: "Tracking",
    inTransit: "In Transit",
    qualityVerified: "Quality Verified",
    paymentReleased: "Payment Released",
  },
  hi: {
    welcome: "एग्रीलिंक में आपका स्वागत है",
    hello: "नमस्ते",
    getStarted: "शुरू करें",
    sell: "बेचें",
    buy: "खरीदें",
    market: "मंडी",
    weather: "मौसम",
    myFields: "मेरे खेत",
    commodities: "कमोडिटीज और खाद्य",
    marketInsight: "बाजार अंतर्दृष्टि",
    topPrice: "शीर्ष मूल्य",
    goodDayToHarvest: "कटाई के लिए अच्छा दिन",
    notIdealForHarvest: "कटाई के लिए आदर्श नहीं",
    farmersNearby: "आस-पास के किसान आज बेच रहे हैं",
    joinPool: "पूल में शामिल हों",
    startAuction: "नीलामी शुरू करें",
    currentBid: "वर्तमान बोली",
    timeLeft: "शेष समय",
    placeBid: "बोली लगाएं",
    quantity: "मात्रा",
    quintals: "क्विंटल",
    totalValue: "कुल मूल्य",
    soilTemp: "मिट्टी का तापमान",
    humidity: "नमी",
    wind: "हवा",
    precipitation: "वर्षा",
    bolo: "बोलो",
    speakNow: "अब बोलिए...",
    listening: "सुन रहा हूं...",
    tracking: "ट्रैकिंग",
    inTransit: "रास्ते में",
    qualityVerified: "गुणवत्ता सत्यापित",
    paymentReleased: "भुगतान जारी",
  },
  pa: {
    welcome: "ਐਗਰੀਲਿੰਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
    hello: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
    sell: "ਵੇਚੋ",
    buy: "ਖਰੀਦੋ",
    market: "ਮੰਡੀ",
    weather: "ਮੌਸਮ",
    myFields: "ਮੇਰੇ ਖੇਤ",
    commodities: "ਵਸਤੂਆਂ ਅਤੇ ਭੋਜਨ",
    marketInsight: "ਬਾਜ਼ਾਰ ਸੂਝ",
    topPrice: "ਉੱਚ ਮੁੱਲ",
    goodDayToHarvest: "ਵਾਢੀ ਲਈ ਚੰਗਾ ਦਿਨ",
    notIdealForHarvest: "ਵਾਢੀ ਲਈ ਆਦਰਸ਼ ਨਹੀਂ",
    farmersNearby: "ਨੇੜੇ ਦੇ ਕਿਸਾਨ ਅੱਜ ਵੇਚ ਰਹੇ ਹਨ",
    joinPool: "ਪੂਲ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ",
    startAuction: "ਨਿਲਾਮੀ ਸ਼ੁਰੂ ਕਰੋ",
    currentBid: "ਮੌਜੂਦਾ ਬੋਲੀ",
    timeLeft: "ਬਾਕੀ ਸਮਾਂ",
    placeBid: "ਬੋਲੀ ਲਗਾਓ",
    quantity: "ਮਾਤਰਾ",
    quintals: "ਕੁਇੰਟਲ",
    totalValue: "ਕੁੱਲ ਮੁੱਲ",
    soilTemp: "ਮਿੱਟੀ ਦਾ ਤਾਪਮਾਨ",
    humidity: "ਨਮੀ",
    wind: "ਹਵਾ",
    precipitation: "ਬਾਰਿਸ਼",
    bolo: "ਬੋਲੋ",
    speakNow: "ਹੁਣ ਬੋਲੋ...",
    listening: "ਸੁਣ ਰਿਹਾ ਹਾਂ...",
    tracking: "ਟਰੈਕਿੰਗ",
    inTransit: "ਰਸਤੇ ਵਿੱਚ",
    qualityVerified: "ਗੁਣਵੱਤਾ ਪ੍ਰਮਾਣਿਤ",
    paymentReleased: "ਭੁਗਤਾਨ ਜਾਰੀ",
  },
};

export const useTranslation = () => {
  const language = useAppStore((state) => state.language);
  return translations[language];
};

export const useHydrated = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Check first — if already hydrated, set immediately and don't bother with listener
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    // Not yet hydrated — listen for when it finishes
    const unsub = useAppStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return unsub;
  }, []);
  return hydrated;
};
export const useAgriStore = useAppStore;
