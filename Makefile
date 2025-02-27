# Variables
CONTAINERS_NAMES=apache-web django-api postgres-db django-auth-42-api django-auth-db-api
IMAGES_NAMES=ft_trascendence-frontend ft_trascendence-backend postgres:15 ft_trascendence-auth-42-api ft_trascendence-auth-db-api
VOLUME_NAME=pong_postgres_data ft_trascendence_postgres_data

# Levantar contenedores
all:
	@echo "\033[1;34mStarting containers...\033[0m"
	docker compose up -d
	@echo "\033[1;32mContainers started successfully.\033[0m"

# Listar contenedores, volúmenes e imágenes
status:
	@echo "\033[1;34mListing Containers:\033[0m"
	@docker ps -a $(foreach name,$(CONTAINERS_NAMES),--filter name=$(name))
	@echo "\033[1;32mListing Images:\033[0m"
	@docker images $(foreach image,$(IMAGES_NAMES),--filter=reference=$(image))
	@echo "\033[1;33mListing Volumes:\033[0m"
	@docker volume ls $(foreach volume,$(VOLUME_NAMES),--filter name=$(volume))

# Detener contenedores
stop:
	@echo "\033[1;31mStopping containers...\033[0m"
	docker stop $(CONTAINERS_NAMES)
	@echo "\033[1;32mContainers stopped successfully.\033[0m"

# Detener y eliminar contenedores
stop-rm:
	@echo "\033[1;31mStopping and removing containers...\033[0m"
	docker stop $(CONTAINERS_NAMES)
	docker rm $(CONTAINERS_NAMES)
	@echo "\033[1;32mContainers stopped and removed successfully.\033[0m"

# Eliminar imágenes
rmi:
	@echo "\033[1;33mRemoving images...\033[0m"
	docker rmi $(IMAGES_NAMES)
	@echo "\033[1;32mImages removed successfully.\033[0m"

# Eliminar volúmenes
volume-rm:
	@echo "\033[1;33mRemoving volumes...\033[0m"
	docker volume rm $(VOLUME_NAME)
	@echo "\033[1;32mVolumes removed successfully.\033[0m"

# Limpiar contenedores, imágenes y volúmenes específicos
clean:
	@echo "\033[1;31mStopping and cleaning up containers, images, and volumes...\033[0m"
	@docker stop $(CONTAINERS_NAMES) || true
	@docker rm $(CONTAINERS_NAMES) || true
	@for image in $(IMAGES_NAMES); do \
		docker rmi $$image || true; \
	done
	@docker volume rm $(VOLUME_NAME) || true
	@echo "\033[1;32mCleanup completed.\033[0m"

# Limpiar todo (todos los contenedores, imágenes y volúmenes no utilizados)
fclean:
	@echo "\033[1;35mPruning unused containers, images, and volumes...\033[0m"
	docker system prune -a -f
	@echo "\033[1;32mSystem cleaned up successfully.\033[0m"

re: clean all