export type LanguageCode = 'en' | 'hi' | 'or' | 'te' | 'ml';

export interface FarmerProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  state: string;
  district: string;
  village: string;
  mainCrop: string;
  otherCrops?: string[];
  farmAreaAcres: number;
  soilType: 'Loamy' | 'Clayey' | 'Sandy' | 'Black' | 'Alluvial' | 'Red';
  irrigationType: 'Borewell' | 'Canal' | 'Drip' | 'Rainfed' | 'Sprinkler';
  farmingType: 'Organic' | 'Conventional' | 'Mixed';
  cropGrowthStage: 'Vegetative' | 'Flowering' | 'Grain Filling' | 'Maturity' | 'Harvesting';
  expectedHarvestDate?: string;
  avatarUrl?: string;
  hasKCCLoan?: boolean;
  kccLimit?: number;
  outstandingLoan?: number;
  bankName?: string;
  loanAccountNumber?: string;
  loanInterestRate?: number;
  loanDueDate?: string;
  loanType?: 'Kisan Credit Card (KCC)' | 'Tractor / Farm Mechanization' | 'PM-KUSUM Solar Pump' | 'Dairy & Animal Husbandry' | 'Agri Infrastructure';
}

export interface WeatherDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: 'sun' | 'cloud-rain' | 'cloud-sun' | 'cloud-lightning' | 'cloud';
  rainProbability: number;
  humidity: number;
  windSpeedKmH: number;
  advisory: string;
}

export interface DistressRiskFactor {
  id: string;
  name: string;
  weight: number;
  currentValue: string;
  status: 'critical' | 'warning' | 'normal';
  impactPercentage: number;
  description: string;
}

export interface DistressRiskData {
  overallRiskPercentage: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  thresholdPercentage: number;
  isAlertTriggered: boolean;
  factors: DistressRiskFactor[];
  officerAlertStatus: {
    sent: boolean;
    timestamp: string;
    officerName: string;
    officerDesignation: string;
    officerContact: string;
    officerBlock: string;
    acknowledgementStatus: 'Dispatched' | 'Acknowledged' | 'Action Scheduled' | 'Resolved';
  };
}

export interface CropConditionData {
  cropName: string;
  healthScore: number;
  statusLabel: 'Good' | 'Needs Attention' | 'Vulnerable' | 'Excellent';
  statusBadges: Array<{
    label: string;
    type: 'water' | 'fertilizer' | 'pest' | 'healthy' | 'harvest';
    status: 'urgent' | 'caution' | 'ok';
  }>;
  primaryRecommendation: string;
  harvestForecast: {
    estimatedPeriod: string;
    recommendedDate: string;
    growthStage: string;
    daysToHarvest: number;
    explanation: string;
  };
  dailyAdvice: Array<{
    id: string;
    title: string;
    description: string;
    category: 'irrigation' | 'pesticide' | 'fertilizer' | 'market';
    urgency: 'high' | 'medium' | 'low';
  }>;
}

export interface MandiPrice {
  id: string;
  mandiName: string;
  distanceKm: number;
  cropName: string;
  variety: string;
  currentPrice: number;
  previousPrice: number;
  priceChangePercent: number;
  isBestPrice: boolean;
  arrivalVolumeQtl: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface PriceGraphDataPoint {
  period: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  projectedHarvestPrice?: number;
}

export interface AgriProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Crop Protection' | 'Tools' | 'Irrigation' | 'Sprayers';
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  description: string;
  imageUrl: string;
  inStock: boolean;
  subsidyAvailable?: boolean;
  badge?: string;
}

export interface CartItem {
  product: AgriProduct;
  quantity: number;
}

export interface FarmingArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTimeMinutes: number;
  author: string;
  publishDate: string;
  imageUrl: string;
  content: string[];
  recommendedFor: {
    regions?: string[];
    soilTypes?: string[];
    crops?: string[];
  };
}

export interface DiseaseDetectionResult {
  cropName: string;
  detectedIssue: string;
  confidencePercent: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  symptoms: string[];
  recommendedActions: string[];
  biologicalTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
  causes: string[];
  disclaimer: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'weather' | 'crop' | 'market' | 'risk' | 'government' | 'officer' | 'loan';
  priority: 'normal' | 'warning' | 'urgent';
  read: boolean;
  actionLink?: string;
  actionLabel?: string;
  amount?: string;
  dueDate?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  audioUrl?: string;
  suggestedPrompts?: string[];
}
