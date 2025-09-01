/**
 * Converts a camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Converts a snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Converts an object with camelCase keys to snake_case keys
 */
export function objectCamelToSnake<T extends Record<string, any>>(obj: T, fieldMappings: Record<string, string> = {}): Record<string, any> {
  if (!obj || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  const result: Record<string, any> = {};
  
  Object.keys(obj).forEach(key => {
    // Use mapping if available, otherwise convert camelCase to snake_case
    const newKey = fieldMappings[key] || camelToSnake(key);
    
    // Handle nested objects and arrays
    if (obj[key] !== null && typeof obj[key] === 'object') {
      if (obj[key] instanceof Date) {
        result[newKey] = obj[key];
      } else if (Array.isArray(obj[key])) {
        result[newKey] = obj[key].map((item: any) => 
          typeof item === 'object' && item !== null
            ? objectCamelToSnake(item, fieldMappings)
            : item
        );
      } else {
        result[newKey] = objectCamelToSnake(obj[key], fieldMappings);
      }
    } else {
      result[newKey] = obj[key];
    }
  });

  return result;
}

/**
 * Converts an object with snake_case keys to camelCase keys
 */
export function objectSnakeToCamel<T extends Record<string, any>>(obj: T, fieldMappings: Record<string, string> = {}): Record<string, any> {
  if (!obj || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  const result: Record<string, any> = {};
  const reverseMapping: Record<string, string> = {};
  
  // Create reverse mapping
  Object.keys(fieldMappings).forEach(camelKey => {
    const snakeKey = fieldMappings[camelKey];
    reverseMapping[snakeKey] = camelKey;
  });
  
  Object.keys(obj).forEach(key => {
    // Use reverse mapping if available, otherwise convert snake_case to camelCase
    const newKey = reverseMapping[key] || snakeToCamel(key);
    
    // Handle nested objects and arrays
    if (obj[key] !== null && typeof obj[key] === 'object') {
      if (obj[key] instanceof Date) {
        result[newKey] = obj[key];
      } else if (Array.isArray(obj[key])) {
        result[newKey] = obj[key].map((item: any) => 
          typeof item === 'object' && item !== null
            ? objectSnakeToCamel(item, fieldMappings)
            : item
        );
      } else {
        result[newKey] = objectSnakeToCamel(obj[key], fieldMappings);
      }
    } else {
      result[newKey] = obj[key];
    }
  });

  return result;
}
