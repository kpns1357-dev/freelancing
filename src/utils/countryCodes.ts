export interface CountryCodeItem {
  code: string;
  country: string;
  flag: string;
  iso: string;
}

export const COUNTRY_CODES: CountryCodeItem[] = [
  { code: '+91', country: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸', iso: 'US' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', iso: 'SG' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', iso: 'SA' },
  { code: '+33', country: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+86', country: 'China', flag: '🇨🇳', iso: 'CN' },
  { code: '+7', country: 'Russia / Kazakhstan', flag: '🇷🇺', iso: 'RU' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', iso: 'BR' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰', iso: 'PK' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', iso: 'BD' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵', iso: 'NP' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', iso: 'LK' }
];

/**
 * Normalizes phone number into bare digits for comparing duplicates accurately
 */
export const normalizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
};

/**
 * Parses an existing phone string into countryCode and localNumber
 */
export const parsePhoneNumber = (fullPhone: string): { countryCode: string; localNumber: string } => {
  if (!fullPhone) return { countryCode: '+91', localNumber: '' };
  
  const trimmed = fullPhone.trim();
  
  // Match known country codes (longest prefix match)
  const sortedCodes = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  for (const item of sortedCodes) {
    if (trimmed.startsWith(item.code)) {
      return {
        countryCode: item.code,
        localNumber: trimmed.slice(item.code.length).trim()
      };
    }
  }

  // Generic '+' prefix
  if (trimmed.startsWith('+')) {
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex !== -1) {
      return {
        countryCode: trimmed.slice(0, spaceIndex),
        localNumber: trimmed.slice(spaceIndex + 1).trim()
      };
    }
  }

  return {
    countryCode: '+91',
    localNumber: trimmed
  };
};
