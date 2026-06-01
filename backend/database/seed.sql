-- ============================================================
--  MUELLE DIGITAL — DATOS DE EJEMPLO (SEED)
--  Ejecutar DESPUÉS de schema.sql
--  Contraseña de todos los usuarios demo: demo1234
-- ============================================================

-- ------------------------------------------------------------
-- USUARIOS  (hash bcrypt de "demo1234")
-- ------------------------------------------------------------
INSERT INTO usuarios (nombre, email, password_hash, rol, telefono) VALUES
  ('Administrador Muelle', 'admin@muelle.co',   '$2a$10$VWPIbjCYIuUuYkH56RaEmum/4Ozcv6.l/akKoWqf/1WUtVRuqTTiG', 'admin',   '3000000000'),
  ('Don Pedro Pescador',   'guia@muelle.co',    '$2a$10$VWPIbjCYIuUuYkH56RaEmum/4Ozcv6.l/akKoWqf/1WUtVRuqTTiG', 'guia',    '3101111111'),
  ('Laura Turista',        'turista@muelle.co', '$2a$10$VWPIbjCYIuUuYkH56RaEmum/4Ozcv6.l/akKoWqf/1WUtVRuqTTiG', 'turista', '3202222222')
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------
-- EXPERIENCIAS  (asociadas al guía Don Pedro)
-- ------------------------------------------------------------
INSERT INTO experiencias (titulo, descripcion, precio, ubicacion, temporada, categoria, guia_id, cupos, imagen)
SELECT * FROM (VALUES
  ('Avistamiento de manatíes en El Llanito',
   'Recorrido en lancha por la ciénaga de El Llanito para observar manatíes en su hábitat natural, acompañado de un guía experto de la comunidad. Incluye chaleco salvavidas y refrigerio.',
   85000, 'Ciénaga El Llanito, Barrancabermeja', 'seca (dic-mar)', 'avistamiento de fauna',
   (SELECT id FROM usuarios WHERE email='guia@muelle.co'), 8,
   'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'),

  ('Pesca artesanal en el río Magdalena',
   'Vive un día como pescador del Magdalena: aprende técnicas tradicionales de atarraya, recorre el río al amanecer y comparte un sancocho de pescado preparado a la orilla.',
   120000, 'Río Magdalena, Barrancabermeja', 'todo el año', 'pesca artesanal',
   (SELECT id FROM usuarios WHERE email='guia@muelle.co'), 6,
   'https://images.unsplash.com/photo-1455218873509-8097305ee378?w=800'),

  ('Atardecer en canoa por los caños',
   'Paseo tranquilo en canoa por los caños y humedales al atardecer. Avistamiento de aves, garzas y babillas. Ideal para fotografía de naturaleza.',
   60000, 'Caños de Barrancabermeja', 'lluvias (abr-nov)', 'paseo fluvial',
   (SELECT id FROM usuarios WHERE email='guia@muelle.co'), 10,
   'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=800'),

  ('Tour de aves en la Ciénaga Miramar',
   'Salida de observación de aves migratorias y nativas con binoculares incluidos. Más de 40 especies registradas. Guía ornitólogo local.',
   95000, 'Ciénaga Miramar, Barrancabermeja', 'migración (oct-feb)', 'avistamiento de fauna',
   (SELECT id FROM usuarios WHERE email='guia@muelle.co'), 5,
   'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800')
) AS v
WHERE NOT EXISTS (SELECT 1 FROM experiencias LIMIT 1);

-- ------------------------------------------------------------
-- RESERVA y RATING de ejemplo (de la turista Laura)
-- ------------------------------------------------------------
INSERT INTO reservas (usuario_id, experiencia_id, fecha, personas, estado)
SELECT
  (SELECT id FROM usuarios WHERE email='turista@muelle.co'),
  (SELECT id FROM experiencias WHERE titulo LIKE 'Avistamiento de manatíes%' LIMIT 1),
  CURRENT_DATE + INTERVAL '7 days', 2, 'confirmada'
WHERE EXISTS (SELECT 1 FROM experiencias)
  AND NOT EXISTS (SELECT 1 FROM reservas LIMIT 1);

INSERT INTO ratings (usuario_id, experiencia_id, puntuacion, comentario)
SELECT
  (SELECT id FROM usuarios WHERE email='turista@muelle.co'),
  (SELECT id FROM experiencias WHERE titulo LIKE 'Avistamiento de manatíes%' LIMIT 1),
  5, '¡Experiencia increíble! Vimos tres manatíes y el guía sabía muchísimo.'
ON CONFLICT (usuario_id, experiencia_id) DO NOTHING;

-- ------------------------------------------------------------
-- PUNTOS DE ENCUENTRO (mapa) — idempotente; solo asigna si faltan
-- Coordenadas aproximadas en Barrancabermeja / El Llanito
-- ------------------------------------------------------------
UPDATE experiencias SET lat=7.182500, lng=-73.833300, punto_encuentro='Muelle de El Llanito'
  WHERE titulo LIKE 'Avistamiento de manatíes%' AND lat IS NULL;
UPDATE experiencias SET lat=7.065300, lng=-73.854700, punto_encuentro='Puerto de Barrancabermeja'
  WHERE titulo LIKE 'Pesca artesanal%' AND lat IS NULL;
UPDATE experiencias SET lat=7.092000, lng=-73.865000, punto_encuentro='Caño Cardales'
  WHERE titulo LIKE 'Atardecer en canoa%' AND lat IS NULL;
UPDATE experiencias SET lat=7.048000, lng=-73.862000, punto_encuentro='Ciénaga Miramar'
  WHERE titulo LIKE 'Tour de aves%' AND lat IS NULL;
