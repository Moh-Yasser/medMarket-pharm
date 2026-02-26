export const CATEGORIES_KEYS={
     all:['categories'] as const,
     specific:(id:number)=>['categories',id] as const,
} as const;
