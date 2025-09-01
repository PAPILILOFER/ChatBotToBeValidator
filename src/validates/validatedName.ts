export function ExtractName(text: string): string {

    const patterns = [
      /me llamo\s+(\w+)/i,
      /mi nombre es\s+(\w+)/i,
      /soy\s+(\w+)/i,
      /i'm\s+(\w+)/i,
      /my name is\s+(\w+)/i,
      /i am\s+(\w+)/i,
      /^(\w+)$/i,
    ];
  
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
      }
    }
  
    // Si no encuentra un patrón, devuelve la primera palabra
    const words = text.trim().split(/\s+/);
    return words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase() : text;
  }
  