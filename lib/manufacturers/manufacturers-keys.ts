export const MANUFACTURERS_KEYS={
    all:['manufacturers'] as const,
    specific:(id:number)=>['manufacturers',id] as const,
} as const;