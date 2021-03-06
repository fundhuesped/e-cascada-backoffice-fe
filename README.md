# Turnos Backoffice Front End

Proyecto que contiene la UI para el sistema de turnos

## Tecnologías y frameworks

El sistema se encuentra construido utilizando principalmente :

* Angular 1
* Bootstrap 3
* Angular Resource

## Requisitos
* NodeJs
* Grunt
* Bower

## Instalación
1. Clonar el repositorio
2. Ejecutar la instalacion de paquetes NodeJs 
```bash
	npm install
```
2. Ejecutar la instalacion de paquetes Fronend (Bower) 
```bash
	bower install
```

## Variables de entorno

* `API_BASE`: Esta variable debe existir en el ambiente y apuntar a la URL donde se encuentra la API del sistema. 

## Ejecucion de la aplicación de forma manual
Ejecutar el siguiente comando deja corriendo el sistema en el puerto 9000

```bash
	grunt server --force
```

## Buenas practicas para extender el sistema
El sistema se encuetra desarrollado bajo las buenas practicas descriptas por [Jhon Papa](https://github.com/johnpapa/angular-styleguide).
Se recomendienda seguir las mismas para extender este trabajo.


## Estructura de carpetas

* `resources`
	: Módulo que contiene todas las entidades manejadas por el sistema.

* `scripts`
	: Scripts aplicados a nivel global

* `services`
	: Módulo de servicios del sistema. Principalmente se utilizan para mantener el estado de entidades o recursos y compartirlo entre diferentes controladores.

* `styles`
	: Contiene las hojas de estilo del sistema

* `views`
Dentro de esta carpeta se situan los distintos modulos conteniendo tanto los controladores como sos vistas (HTML)
	: 
	* `agendas`
		: Módulo que contiene las vistas referentes a las agendas de los profesionales
	* `especialidades`
		: Módulo que contiene las vistas referentes al ABM de las especialidades de los profesionales
	* `login`
		: Módulo que contiene la vistas de login
	* `navbar`
		: Módulo que contiene la vistas de la navbar cross a todo el sistema
	* `pacientes`
		: Módulo que contiene las vistas referentes al ABM de pacientes
	* `prestaciones`
		: Módulo que contiene las vistas referentes al ABM de las prestaciones de las especialidades
	* `profesionales`
		: Módulo que contiene las vistas referentes a los profesionales
	* `turnos`
		: Módulo que contiene las vistas referentes a la gestion de turnos


## Despliegues e Instalación en ambientes
Siendo root en el servidor a elección con el codigo del repositorio clonado debes apuntar tu nginx para que sirva el sitio apuntando dentro de la carpeta `app`

