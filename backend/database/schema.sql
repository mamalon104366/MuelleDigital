-- ============================================================
--  MUELLE DIGITAL — ESQUEMA DE BASE DE DATOS
--  Motor: PostgreSQL (NeonDB)
--  Uso:   pega y ejecuta este archivo en el SQL Editor de Neon
--         (o:  psql "$DATABASE_URL" -f schema.sql)
-- ============================================================

-- Limpieza opcional (descomentar para reinstalar desde cero)
-- DROP TABLE IF EXISTS pagos, ratings, reservas, experiencias, usuarios CASCADE;

-- ------------------------------------------------------------
-- USUARIOS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id            SERIAL PRIMARY KEY,
    nombre        VARCHAR(120)  NOT NULL,
    email         VARCHAR(160)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    rol           VARCHAR(20)   NOT NULL DEFAULT 'turista'
                  CHECK (rol IN ('turista', 'guia', 'admin')),
    telefono      VARCHAR(30),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- EXPERIENCIAS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experiencias (
    id          SERIAL PRIMARY KEY,
    titulo      VARCHAR(160)  NOT NULL,
    descripcion TEXT          NOT NULL,
    precio      NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    ubicacion   VARCHAR(160)  NOT NULL,
    temporada   VARCHAR(80),
    categoria   VARCHAR(80),
    guia_id     INTEGER       NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    cupos       INTEGER       NOT NULL DEFAULT 0 CHECK (cupos >= 0),
    imagen      VARCHAR(500),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Punto de encuentro (mapa). ALTER idempotente para bases ya existentes.
ALTER TABLE experiencias ADD COLUMN IF NOT EXISTS lat              NUMERIC(9,6);
ALTER TABLE experiencias ADD COLUMN IF NOT EXISTS lng              NUMERIC(9,6);
ALTER TABLE experiencias ADD COLUMN IF NOT EXISTS punto_encuentro  VARCHAR(200);

-- Stripe: producto y precio creados automáticamente al publicar la experiencia.
ALTER TABLE experiencias ADD COLUMN IF NOT EXISTS stripe_product_id VARCHAR(80);
ALTER TABLE experiencias ADD COLUMN IF NOT EXISTS stripe_price_id   VARCHAR(80);

-- ------------------------------------------------------------
-- RESERVAS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservas (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    experiencia_id INTEGER     NOT NULL REFERENCES experiencias(id) ON DELETE CASCADE,
    fecha          DATE        NOT NULL,
    personas       INTEGER     NOT NULL DEFAULT 1 CHECK (personas > 0),
    estado         VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                   CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------
-- RATINGS (reseñas) — un usuario solo puede calificar una vez por experiencia
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ratings (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    experiencia_id INTEGER     NOT NULL REFERENCES experiencias(id) ON DELETE CASCADE,
    puntuacion     INTEGER     NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario     TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (usuario_id, experiencia_id)
);

-- ------------------------------------------------------------
-- PAGOS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pagos (
    id          SERIAL PRIMARY KEY,
    reserva_id  INTEGER       NOT NULL REFERENCES reservas(id) ON DELETE CASCADE,
    metodo_pago VARCHAR(20)   NOT NULL CHECK (metodo_pago IN ('nequi', 'daviplata')),
    estado      VARCHAR(20)   NOT NULL DEFAULT 'pendiente'
                CHECK (estado IN ('pendiente', 'completado', 'fallido')),
    valor       NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
    referencia  VARCHAR(60),
    fecha       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Stripe en pagos: ampliamos métodos y agregamos columnas de seguimiento.
ALTER TABLE pagos DROP CONSTRAINT IF EXISTS pagos_metodo_pago_check;
ALTER TABLE pagos ADD CONSTRAINT pagos_metodo_pago_check
    CHECK (metodo_pago IN ('nequi', 'daviplata', 'stripe'));
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS stripe_session_id     VARCHAR(120);
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS stripe_payment_intent VARCHAR(120);
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS comision              NUMERIC(10,2);

-- ------------------------------------------------------------
-- SOLICITUDES DE GUÍA (filtro de seguridad: el admin aprueba quién puede publicar)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitudes_guia (
    id                SERIAL PRIMARY KEY,
    usuario_id        INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_completo   VARCHAR(160) NOT NULL,
    documento         VARCHAR(40)  NOT NULL,
    telefono          VARCHAR(30)  NOT NULL,
    zona              VARCHAR(160) NOT NULL,
    experiencia_previa TEXT,
    descripcion       TEXT         NOT NULL,
    estado            VARCHAR(20)  NOT NULL DEFAULT 'pendiente'
                      CHECK (estado IN ('pendiente', 'aprobada', 'rechazada')),
    motivo_rechazo    TEXT,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    resuelta_at       TIMESTAMPTZ
);

-- ------------------------------------------------------------
-- ÍNDICES (rendimiento de búsquedas y joins)
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_experiencias_guia      ON experiencias(guia_id);
CREATE INDEX IF NOT EXISTS idx_experiencias_categoria ON experiencias(categoria);
CREATE INDEX IF NOT EXISTS idx_reservas_usuario       ON reservas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_reservas_experiencia   ON reservas(experiencia_id);
CREATE INDEX IF NOT EXISTS idx_ratings_experiencia    ON ratings(experiencia_id);
CREATE INDEX IF NOT EXISTS idx_pagos_reserva          ON pagos(reserva_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_usuario    ON solicitudes_guia(usuario_id);
CREATE INDEX IF NOT EXISTS idx_solicitudes_estado     ON solicitudes_guia(estado);
