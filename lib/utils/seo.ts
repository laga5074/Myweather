import type { Metadata } from 'next';

const BASE_URL = process.env.APP_URL || 'https://myweather.ai.studio';

export function constructMetadata({
  title,
  description,
  canonicalUrl,
  ogImage = '/og-image.png',
}: {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl || BASE_URL,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl || BASE_URL,
      siteName: 'My Weather',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export const SEO_PAGES = {
  home: {
    title: 'My Weather — Free Live Weather Forecast & Radar',
    description: 'Get accurate live weather forecasts, real-time radar maps, air quality index, and UV alerts for any city worldwide. Free, fast, and no signup required.',
  },
  forecast: {
    title: '10-Day Weather Forecast — Hourly & Daily',
    description: 'Plan ahead with our detailed 10-day weather forecast and 48-hour hourly predictions. Temperature, precipitation, wind speed, and humidity for any location.',
  },
  radar: {
    title: 'Live Weather Radar Map — Real-Time Precipitation',
    description: 'Track storms and rain in real-time with our interactive weather radar map. Live precipitation, cloud cover, and severe weather alerts worldwide.',
  },
  airQuality: {
    title: 'Air Quality Index (AQI) — Pollution & Health Alerts',
    description: 'Check real-time air quality index, PM2.5, PM10, ozone levels, and pollen counts. Get health recommendations and pollution alerts for your area.',
  },
  about: {
    title: 'About My Weather — Accurate Free Weather App',
    description: 'Learn how My Weather delivers hyperlocal forecasts using multiple free global data sources. Built for accuracy, speed, and zero cost to users.',
  },
  terms: {
    title: 'Terms of Use — My Weather',
    description: 'Read the terms and conditions for using My Weather. By accessing our free weather forecast platform, you agree to these terms.',
  },
  privacy: {
    title: 'Privacy Policy — My Weather',
    description: 'We respect your privacy. Learn how My Weather collects, uses, and protects your personal data when you use our free weather services.',
  },
  contact: {
    title: 'Contact Us — My Weather Support',
    description: 'Have questions or feedback? Contact the My Weather team. We respond to all inquiries about forecasts, features, and technical support.',
  },
  login: {
    title: 'Log In — My Weather Account',
    description: 'Sign in to your My Weather account to save locations, customize units, and access personalized weather alerts and dashboard features.',
  },
  signup: {
    title: 'Sign Up — Free My Weather Account',
    description: 'Create a free My Weather account. Save favorite cities, set weather alerts, and unlock personalized forecasts and air quality tracking.',
  },
  resetPassword: {
    title: 'Reset Password — My Weather Account',
    description: 'Forgot your password? Reset it securely to regain access to your saved locations, preferences, and personalized weather dashboard.',
  },
  dashboard: {
    title: 'My Weather Dashboard — Saved Locations & Alerts',
    description: 'Manage your saved cities, weather alerts, and account preferences. Your personalized weather command center.',
  },
  settings: {
    title: 'Account Settings — Theme, Units & Notifications',
    description: 'Customize your My Weather experience. Change temperature units, time format, theme, and notification preferences.',
  },
  admin: {
    title: 'Admin Dashboard — My Weather Management',
    description: 'Admin overview: user management, API configuration, feature flags, comment moderation, and platform analytics.',
  },
  adminUsers: {
    title: 'Manage Users — My Weather Admin',
    description: 'View, edit, and manage registered users. Assign roles, monitor activity, and handle account issues from the admin panel.',
  },
  adminApiConfig: {
    title: 'API Configuration — Provider Keys & Load Balancer',
    description: 'Manage multiple weather API providers, monitor usage quotas, add backup keys, and configure load balancing across free-tier sources.',
  },
  adminFeatures: {
    title: 'Feature Flags — Enable/Disable Pro Features',
    description: 'Toggle platform features, manage Pro tier access, control beta rollouts, and configure app-wide settings from the admin panel.',
  },
  adminComments: {
    title: 'Comment Moderation — Review & Approve Ratings',
    description: 'Moderate user comments and ratings. Auto-detected spam, pending approvals, and edit/approve workflow for user-generated content.',
  },
  integrations: {
    title: 'Weather API Integrations — Data Sources',
    description: 'Discover the free and premium weather APIs powering My Weather. View provider details, coverage, and integration status.',
  },
};
