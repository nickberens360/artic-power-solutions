import { FEATURE_FLAGS } from '../consts';

/**
 * Check if a feature flag is enabled
 * @param flag - The name of the feature flag to check
 * @returns boolean - Whether the feature is enabled
 */
export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}

/**
 * Get all feature flags
 * @returns object - All feature flags
 */
export function getAllFeatureFlags() {
  return { ...FEATURE_FLAGS };
}