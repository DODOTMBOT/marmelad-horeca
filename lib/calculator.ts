import type { ServiceItem as Service } from '@/lib/content-types';

export type PriceResult = number | [number, number] | null;

export function calculatePrice(
  service: Service,
  values: Record<string, number | string>
): PriceResult {
  switch (service.priceType) {
    case 'fixed':
      return service.fixedPrice ?? null;

    case 'per_unit': {
      const param = service.params?.[0];
      if (!param) return null;
      const count = Number(values[param.id] ?? param.defaultValue);
      if (!service.pricePerUnit || count <= 0) return null;
      const raw = service.pricePerUnit * count;
      // enforce minimum
      return raw < 10000 ? 10000 : raw;
    }

    case 'select': {
      const param = service.params?.[0];
      if (!param) return null;
      const selected = Number(values[param.id] ?? param.defaultValue);
      return isNaN(selected) ? null : selected;
    }

    case 'base_plus': {
      const param = service.params?.[0];
      if (!param) return null;
      const count = Number(values[param.id] ?? param.defaultValue);
      if (!service.basePrice || !service.pricePerExtra) return null;
      return service.basePrice + service.pricePerExtra * count;
    }

    case 'range':
      if (service.priceFrom !== undefined && service.priceTo !== undefined) {
        return [service.priceFrom, service.priceTo];
      }
      return null;

    default:
      return null;
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceResult(result: PriceResult): string | null {
  if (result === null) return null;
  if (Array.isArray(result)) {
    return `от ${formatPrice(result[0])} до ${formatPrice(result[1])}`;
  }
  return formatPrice(result);
}
