
### Turnos deploy FrontEnd
En tu maquina ejecutar:
grunt build

#POR VERIFICAR
cd /turnos-infra/src/turnos-backoffice-fe/
git pull --force 

### Turnos deploy Backend
password: HuesApi2016!

# Update Code
sudo su -
cd /turnos-infra/src/turnos-backoffice-be
git pull --force


# Redeployar todo el BE
cd /turnos-infra
source setenv.sh  #Levantar las variables de entorno
./start_docker.sh  #Levantar docker compose
docker ps # Verificar estan levantados los 3 docker


# Para aplicar las migraciones a la base de datos
docker exec -ti turnosbackoffice_beturnos_1 /bin/bash
python manage.py migrate


docker logs --tail 100 turnosbackoffice_beturnos_1

#setenv.sh
export DBUSER=turnosuser
export DBPASSWORD=turnos1234
export DBNAME=turnosdb
export SERVERNAME=turnos
export APPUSER=turnos