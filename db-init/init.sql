-- -- Crear la base de datos si no existe
-- DO $$ 
-- BEGIN
--    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'postgres_42') THEN
--       CREATE DATABASE postgres_42;
--    END IF;
-- END $$;

-- -- Conectar a la base de datos
-- \c postgres_42;

-- -- Crear esquemas específicos para cada backend
-- CREATE SCHEMA IF NOT EXISTS backend42;
-- CREATE SCHEMA IF NOT EXISTS backend2;

-- -- Asegurar que Django pueda ver estos esquemas
-- ALTER ROLE postgres SET search_path TO backend42, backend2, public;

-- -- Crear la tabla de migraciones dentro de cada esquema
-- CREATE TABLE IF NOT EXISTS backend42.django_migrations (
--     id SERIAL PRIMARY KEY,
--     app VARCHAR(255) NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     applied TIMESTAMP NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS backend2.django_migrations (
--     id SERIAL PRIMARY KEY,
--     app VARCHAR(255) NOT NULL,
--     name VARCHAR(255) NOT NULL,
--     applied TIMESTAMP NOT NULL
-- );

-- COMMIT;


DROP DATABASE IF EXISTS postgres_42;
CREATE DATABASE postgres_42;

\c postgres_42

DROP SCHEMA IF EXISTS backend42 CASCADE;
CREATE SCHEMA backend42;

DROP SCHEMA IF EXISTS backend2 CASCADE;
CREATE SCHEMA backend2;
