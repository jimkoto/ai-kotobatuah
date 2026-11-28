const DEFAULT_WA_DIGITS = '6281324412025';

export function formatWhatsAppNumber(rawPhone?: string): string {
  const digits = (rawPhone ?? '').replace(/\D+/g, '');
  if (!digits) return DEFAULT_WA_DIGITS;
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith('8')) {
    return `62${digits}`;
  }
  return digits;
}

export function buildWhatsAppUrl(rawPhone: string | undefined, message: string): string {
  const phone = formatWhatsAppNumber(rawPhone);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
