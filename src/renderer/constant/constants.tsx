// Determine if the environment is production
const isProduction = process.env.NODE_ENV === "production";
// Environment-aware base URIs
const BASE_URIs = {
  production: "https://production.solomon-ai.dev",
  staging: "https://production.solomon-ai.dev",
};

// Environment-aware Stripe links
const STRIPE_LINKS = {
  basePackage: {
    production: "https://buy.stripe.com/7sI5lJ9v13BD1lS6or",
    staging: "https://buy.stripe.com/test_00gcPC0vJ6SFatyaEE",
  },
  bronzePackage: {
    production: "https://buy.stripe.com/9AQdSf6iPdcdggM000",
    staging: "https://buy.stripe.com/test_00gg1O1zNgtffNSeUV",
  },
  silverPackage: {
    production: "https://buy.stripe.com/28oeWjgXtc892pWeUV",
    staging: "https://buy.stripe.com/test_eVaeXK7Ybgtfaty5km",
  },
  goldPackage: {
    production: "https://buy.stripe.com/5kAdSf0Yva01c0w28a",
    staging: "https://buy.stripe.com/test_bIYaHufqD7WJbxCcMP",
  },
};

// Helper function to get environment variables with a default value
const getEnv = (key: string, defaultValue: string | number | boolean) =>
  process.env[key] || defaultValue;

/**
 * An object containing key-value pairs representing constant values used throughout the application.
 */
export const constants = {
  JWT_TOKEN_KEY: getEnv("REACT_APP_JWT_TOKEN_KEY", "jwt") as string,
  DEFAULT_REQUEST_TIMEOUT: Number(
    getEnv("REACT_APP_DEFAULT_REQUEST_TIMEOUT", 50000)
  ),
  DEFAULT_BASE_URI: getEnv(
    "REACT_APP_DEFAULT_BASE_URI",
    BASE_URIs[isProduction ? "production" : "staging"]
  ) as string,
  DEFAULT_REACT_APP_MIXPANEL_TOKEN: getEnv(
    "REACT_APP_MIXPANEL_TOKEN",
    "e78859ce023c2c269ae6a1443986cd7a"
  ) as string,
  USER_ID_KEY: getEnv("REACT_APP_USER_ID_KEY", "userid") as string,
  USER_PROFILE_ID_KEY: getEnv(
    "REACT_APP_USER_PROFILE_ID_KEY",
    "userprofileid"
  ) as string,
  USER_PROFILE_KEY: getEnv(
    "REACT_APP_USER_PROFILE_KEY",
    "userprofile"
  ) as string,
  USER_ACCOUNT_KEY: getEnv(
    "REACT_APP_USER_ACCOUNT_KEY",
    "useraccount"
  ) as string,
  PROFILE_PICTURE: getEnv(
    "REACT_APP_PROFILE_PICTURE",
    "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&s=4b9aee7819582a1d0f9f07cfee0f8e36"
  ) as string,
  REACT_APP_ALGOLIA_APP_ID: getEnv(
    "REACT_APP_ALGOLIA_APP_ID",
    "E38YNAPMTE"
  ) as string,
  REACT_APP_ALGOLIA_API_KEY: getEnv(
    "REACT_APP_ALGOLIA_API_KEY",
    "86732f2b3e736e1999bb9c2928fba919"
  ) as string,
  RECOMMENDED_ENTITIES_LIMIT: Number(
    getEnv("REACT_APP_RECOMMENDED_ENTITIES_LIMIT", 5)
  ),
  USER_FINANCIAL_PROFILE_KEY: getEnv(
    "REACT_APP_USER_FINANCIAL_PROFILE_KEY",
    "userfinancialprofile"
  ) as string,
  USER_FINANCIAL_CONTEXT_KEY: getEnv(
    "REACT_APP_USER_FINANCIAL_CONTEXT_KEY",
    "userfinancialcontext"
  ) as string,
  BASE_PACKAGE_PAYMENT_LINK: getEnv(
    "REACT_APP_BASE_PACKAGE_PAYMENT_LINK",
    STRIPE_LINKS.basePackage[isProduction ? "production" : "staging"]
  ) as string,
  BUSINESS_BRONZE_PACKAGE_FOUNDATIONS_PAYMENT_LINK: getEnv(
    "REACT_APP_BUSINESS_BRONZE_PACKAGE_FOUNDATIONS_PAYMENT_LINK",
    STRIPE_LINKS.bronzePackage[isProduction ? "production" : "staging"]
  ) as string,
  BUSINESS_SILVER_PACKAGE_GROWTH_CATALYST_PAYMENT_LINK: getEnv(
    "REACT_APP_BUSINESS_SILVER_PACKAGE_GROWTH_CATALYST_PAYMENT_LINK",
    STRIPE_LINKS.silverPackage[isProduction ? "production" : "staging"]
  ) as string,
  BUSINESS_GOLD_PACKAGE_INDUSTRY_TITAN_LINK: getEnv(
    "REACT_APP_BUSINESS_GOLD_PACKAGE_INDUSTRY_TITAN_LINK",
    STRIPE_LINKS.goldPackage[isProduction ? "production" : "staging"]
  ) as string,
  PAYMENT_PORTAL_LINK: getEnv(
    "REACT_APP_PAYMENT_PORTAL_LINK",
    "https://billing.stripe.com/p/login/test_3csdSC6UVbWecsUfYY"
  ) as string,
  BETA_MODE: getEnv("REACT_APP_BETA_MODE", false) as string,
};
