# Variables
DOCKER_BUILDKIT=1
COMPOSE=docker compose
CONTAINERS=postgres auth-42 auth-local apache-web prometheus grafana
VOLUMES=postgres_data grafana_data prometheus_data apache_logs
IMAGES=ft_trascendence-frontend ft_trascendence-auth-42 ft_trascendence-auth-local ft_trascendence-prometheus ft_trascendence-grafana ft_trascendence-db

# Colores para los mensajes
BLUE=\033[1;34m
GREEN=\033[1;32m
RED=\033[1;31m
YELLOW=\033[1;33m
RESET=\033[0m

# -------------------------------
# Targets principales
# -------------------------------

## Iniciar los contenedores en segundo plano
all:
	@echo "$(BLUE)Iniciando contenedores...$(RESET)"
	DOCKER_BUILDKIT=$(DOCKER_BUILDKIT) $(COMPOSE) up -d
	@echo "$(GREEN)Contenedores iniciados correctamente.$(RESET)"

## Ver el estado de los contenedores, imágenes y volúmenes
status:
	@echo "$(BLUE)Listado de Contenedores:$(RESET)"
	@docker ps --format "table {{.Names}}\t{{.State}}\t{{.Ports}}"
	@echo "$(GREEN)Listado de Imágenes:$(RESET)"
	@docker images --format "table {{.Repository}}\t{{.Tag}}" | grep -E "$(shell echo $(IMAGES) | sed 's/ /|/g')"
	@echo "$(YELLOW)Listado de Volúmenes:$(RESET)"
	@docker volume ls --format "table {{.Name}}" --filter "name=$(shell echo $(VOLUMES) | sed 's/ / --filter name=/g')"

## Mostrar logs en tiempo real
logs:
	@echo "$(GREEN)Mostrando logs en tiempo real...$(RESET)"
	@$(COMPOSE) logs -f --tail=20

# -------------------------------
# Gestión de contenedores
# -------------------------------

## Detener los contenedores
stop:
	@echo "$(RED)Deteniendo contenedores...$(RESET)"
	@$(COMPOSE) stop
	@echo "$(GREEN)Contenedores detenidos.$(RESET)"

## Detener y eliminar contenedores
stop-rm: stop
	@echo "$(RED)Eliminando contenedores...$(RESET)"
	@$(COMPOSE) rm -f
	@echo "$(GREEN)Contenedores eliminados.$(RESET)"

## Reiniciar todos los contenedores
restart: stop all
	@echo "$(GREEN)Contenedores reiniciados correctamente.$(RESET)"

## Reiniciar un solo servicio
restart-service:
	@echo "$(YELLOW)Uso: make restart-service SERVICE=<nombre_del_servicio>$(RESET)"
	@[ -n "$(SERVICE)" ] || (echo "$(RED)ERROR: Debes especificar un servicio. Ejemplo: make restart-service SERVICE=auth-42$(RESET)"; exit 1)
	@echo "$(BLUE)Reiniciando servicio $(SERVICE)...$(RESET)"
	@$(COMPOSE) restart $(SERVICE)
	@echo "$(GREEN)Servicio $(SERVICE) reiniciado.$(RESET)"

# -------------------------------
# Gestión de imágenes
# -------------------------------

## Construir todas las imágenes sin caché
build:
	@echo "$(BLUE)Construyendo imágenes con BuildKit...$(RESET)"
	@DOCKER_BUILDKIT=$(DOCKER_BUILDKIT) $(COMPOSE) build --no-cache
	@echo "$(GREEN)Imágenes construidas correctamente.$(RESET)"

## Descargar las imágenes base más recientes antes de construir
pull:
	@echo "$(BLUE)Descargando imágenes base...$(RESET)"
	@$(COMPOSE) pull
	@echo "$(GREEN)Imágenes base actualizadas.$(RESET)"

## Eliminar imágenes especificadas
rmi:
	@echo "$(YELLOW)Eliminando imágenes...$(RESET)"
	@docker rmi -f $(IMAGES) || true
	@echo "$(GREEN)Imágenes eliminadas.$(RESET)"

# -------------------------------
# Gestión de volúmenes
# -------------------------------

## Eliminar volúmenes
volume-rm:
	@echo "$(YELLOW)Eliminando volúmenes...$(RESET)"
	@docker volume rm $(VOLUMES) || true
	@echo "$(GREEN)Volúmenes eliminados.$(RESET)"

# -------------------------------
# Limpieza general
# -------------------------------

## Limpiar contenedores, imágenes y volúmenes específicos
clean: stop-rm rmi volume-rm
	@echo "$(GREEN)Limpieza específica completada.$(RESET)"

## Limpiar todo (contenedores, imágenes y volúmenes no utilizados)
fclean: clean
	@echo "$(RED)Eliminando todos los datos innecesarios...$(RESET)"
	DOCKER_BUILDKIT=$(DOCKER_BUILDKIT) docker system prune -a -f
	$(COMPOSE) down -v
	@echo "$(GREEN)Limpieza total completada.$(RESET)"

## Reconstruir desde cero
re: fclean pull all
