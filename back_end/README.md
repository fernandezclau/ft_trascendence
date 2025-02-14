
# Crear proyecto Django
1. Crear entorno virtual
2. pip install django djangorestframework
3. django-admin startproject backend .
# Crear app
1. python manage.py startapp pong

# Versión de Python

Este proyecto utiliza Python 3.12. Asegúrate de tener esta versión instalada.

---

# Instalación de Dependencias

Instala las dependencias necesarias utilizando el archivo `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

# Ejecutar el Servidor de Desarrollo

Inicia el servidor de desarrollo de Django:

```bash
python3 manage.py runserver
```

---

# Crear un Superusuario

Crea un superusuario para acceder al panel de administración de Django:

```bash
python manage.py createsuperuser
```

---

# Conexión a la Base de Datos PostgreSQL

A continuación una guía paso a paso para configurar y conectar una base de datos PostgreSQL:

## 1. Instalación de PostgreSQL

Para instalar PostgreSQL en tu sistema, ejecuta el siguiente comando:

```bash
sudo apt install postgresql
```

Verifica la instalación comprobando la versión de PostgreSQL:

```bash
psql --version
```

---

## 2. Conexión a PostgreSQL

Conéctate a PostgreSQL utilizando el siguiente comando:

```bash
psql -U postgres -W
```

### Solución de Errores de Conexión

Si encuentras errores al conectarte, sigue estos pasos:

1. Conéctate como superusuario:

    ```bash
    sudo -u postgres psql
    ```

2. Cambia la contraseña del usuario `postgres`:

    ```sql
    ALTER USER postgres PASSWORD 'tu_nueva_contraseña';
    ```

3. Si el problema persiste, edita el archivo de configuración de PostgreSQL:

    ```bash
    sudo nano /etc/postgresql/*/main/pg_hba.conf
    ```

    Busca la siguiente línea:

    ```plaintext
    local   all             postgres                                peer
    ```

    Y cámbiala por:

    ```plaintext
    local   all             postgres                                md5
    ```

4. Reinicia el servicio de PostgreSQL:

    ```bash
    sudo systemctl restart postgresql
    ```

---

## 3. Creación de la Base de Datos y Usuario

Una vez conectado a PostgreSQL, sigue estos pasos para crear la base de datos y un usuario:

1. Crea la base de datos:

    ```sql
    CREATE DATABASE trascendence;
    ```

2. Crea un usuario y asígnale una contraseña:

    ```sql
    CREATE USER dev WITH PASSWORD 'dev';
    ```

3. Configura el usuario:

    ```sql
    ALTER ROLE dev SET client_encoding TO 'utf8';
    ALTER ROLE dev SET default_transaction_isolation TO 'read committed';
    ALTER ROLE dev SET timezone TO 'UTC';
    ALTER USER dev CREATEDB;
    ```

4. Otorga privilegios al usuario sobre la base de datos:

    ```sql
    GRANT ALL PRIVILEGES ON DATABASE trascendence TO dev;
    ```

### Comandos Útiles

- Listar bases de datos:

    ```bash
    \l
    ```

- Conéctate a la base de datos `trascendence`:

    ```bash
    \c trascendence;
    ```

- Listar las tablas existentes:

    ```bash
    \dt
    ```
---

## 4. Configuración de Django

### Creación de Tablas

1. Define los modelos en `models.py`.
2. Genera las migraciones:

    ```bash
    python manage.py makemigrations
    ```

3. Aplica las migraciones para crear las tablas en la base de datos:

    ```bash
    python manage.py migrate
    ```
# Ejecución de pruebas
   
   ```bash
   python manage.py test pong
   ```