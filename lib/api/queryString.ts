
export function createQueryString<T>(filters?: T): string {
    if (!filters) return "";
    
    const params = new URLSearchParams();
    Object.entries(filters)
      .filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== "all")
      .forEach(([key, value]) => params.append(key, String(value)));
    
    return params.toString();
  }