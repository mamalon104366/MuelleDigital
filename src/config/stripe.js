import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const key = process.env.STRIPE_SECRET_KEY;

// Si no hay clave, la app sigue funcionando (los pagos Stripe quedan deshabilitados).
export const stripe = key ? new Stripe(key) : null;
export const stripeEnabled = Boolean(stripe);

if (!stripeEnabled) {
  console.warn('⚠️  STRIPE_SECRET_KEY no definida: los pagos con tarjeta estarán deshabilitados.');
}

export const MONEDA = (process.env.MONEDA || 'cop').toLowerCase();
export const COMISION_PORCENTAJE = Number(process.env.COMISION_PORCENTAJE || 0);

// Stripe usa la unidad mínima de la moneda (x100 para COP/USD).
export const aUnidadMinima = (valor) => Math.round(Number(valor) * 100);

// Comisión de la plataforma (modelo marketplace).
export const comisionDe = (valor) => +(((Number(valor) * COMISION_PORCENTAJE) / 100)).toFixed(2);

// Crea Producto + Precio en Stripe para una experiencia. Best-effort:
// si falla, devuelve nulls y la experiencia se guarda igual (se puede reintentar).
export const crearProductoYPrecio = async ({ nombre, descripcion, precio }) => {
  if (!stripe) return { stripe_product_id: null, stripe_price_id: null };
  const product = await stripe.products.create({
    name: nombre,
    description: descripcion ? descripcion.slice(0, 500) : undefined,
  });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: aUnidadMinima(precio),
    currency: MONEDA,
  });
  return { stripe_product_id: product.id, stripe_price_id: price.id };
};
