export const fonts = {
  everett: {
    light: 'System', // Fallback temporário
    regular: 'System', 
    medium: 'System',
    bold: 'System',
  },
  aeonik: {
    regular: 'Courier', // Fallback temporário para números
    bold: 'Courier',
  },
}

// Font utility functions
export const getFontFamily = (family: 'everett' | 'aeonik', weight: 'light' | 'regular' | 'medium' | 'bold' = 'regular') => {
  if (family === 'everett') {
    return fonts.everett[weight as keyof typeof fonts.everett] || fonts.everett.regular
  }
  if (family === 'aeonik') {
    return fonts.aeonik[weight as keyof typeof fonts.aeonik] || fonts.aeonik.regular
  }
  return fonts.everett.regular
}

// Predefined styles for common use cases
export const fontStyles = {
  // Text content uses Everett
  header: {
    fontFamily: fonts.everett.bold,
  },
  title: {
    fontFamily: fonts.everett.bold,
  },
  body: {
    fontFamily: fonts.everett.regular,
  },
  bodyMedium: {
    fontFamily: fonts.everett.medium,
  },
  caption: {
    fontFamily: fonts.everett.light,
  },
  
  // Numbers and prices use Aeonik
  price: {
    fontFamily: fonts.aeonik.bold,
  },
  number: {
    fontFamily: fonts.aeonik.regular,
  },
  rating: {
    fontFamily: fonts.aeonik.regular,
  },
  time: {
    fontFamily: fonts.aeonik.regular,
  },
}