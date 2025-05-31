# Lista de Prompts
> Modelo de IA utilizado: Claude 3.7 Sonnet

## Prompt 1: Solicitud de creación de PRD para aplicación de seguimiento de desarrollos

```
Tengo esta necesidad, como desarrollador junior en un entorno de desarrollo de micro servicios me enfrento al desafío de rastrear el estado de múltiples desarrollos (asociados a HUS o Épicas de Jira) a través de diferentes ambientes (Desarrollo, QA, Producción). 

Actualmente, utilizo una hoja de cálculo de Excel para llevar un registro del estado de cada proyecto, los micro servicios que se modificaron con nuevo código, los scripts o procedimientos almacenados creados para diferentes bases de datos, configuraciones de archivos yml para algunos micro servicios.

En el excel todo lo mencionado para cada ambiente con el nombre del desarrollo y la tarea o épica de jira, junto con un resumen de lo que hace el desarrollo y la fecha de despliegue en cada ambiente.

Necesito crear una aplicación web (Full Stack) para automatizar y mejorar este proceso de seguimiento de mis desarrollos.

El objetivo principal es ayudar al desarrollador a realizar seguimiento de sus desarrollos y los componentes tocados (micro servicios o bases de datos) para no olvidar nada en los despliegues de los diferentes ambientes.

El proyecto debe permitir lo siguiente:

 Conectarse con Jira: Para obtener información relevante sobre las tareas de desarrollo (HUS/Épicas).

Registrar Desarrollos: Permitir el registro de un desarrollo específico, asociándolo a uno o varios issues de Jira y a los micro servicios impactados.

Rastrear el Estado: Mantener el estado actual de cada desarrollo en los diferentes ambientes (Desarrollo, QA, Aprobado en QA, Producción, Rechazado).

 Visualizar el Estado: Ofrecer una vista centralizada y organizada del estado de todos los desarrollos.

 Facilitar la Gestión: Simplificar el seguimiento de qué se ha desplegado, dónde y qué scripts son necesarios, evitando la dependencia de una hoja de cálculo manual.

Tecnologías Iniciales Consideradas:
Frontend: Angular.
Backend: NestJS 
Base de Datos: PostgreSQL 
Hosting: railway para backend y frontend

El objetivo es construir una aplicación funcional (MVP) que resuelva esta necesidad de seguimiento de manera eficiente y centralizada, aprovechando servicios gratuitos para el despliegue inicial

Como experto en producto con conocimiento en desarrollo de aplicaciones crea el PRD correspondiente.
```

## Prompt 2: Solicitud de historias de usuario basadas en el PRD

```
Estoy de acuerdo con el PRD que me proporcionas, basado en este PRD y como experto en producto con conocimiento en desarrollo y arquitectura. Genera las historias de usuario correspondientes.
```

## Prompt 3: Solicitud de actualización de la ficha del proyecto

```
basado en el PRD y las HUS creadas, redacta 0. Ficha del proyecto, este es mi repo: @https://github.com/jchara/AI4Devs-final.git 
@readme.md 
```

## Prompt 4: Solicitud de modificación de la descripción breve del proyecto

```
Dame una descripción breve del proyecto, quisiera que fuera un poco mas cercana a la descripción que te pase inicialmente como requerimiento.
```

## Prompt 5: Solicitud de realización de la descripción general del producto

```
Dame una guía de la descripción general del producto
```

## Prompt 6: Solicitud de realización de la arquitectura del sistema

```
Bien, hasta el momento esta alineado, por favor realiza la descripción de la arquitectura del sistema
```

## Prompt 7: Solicitud de descripción de experiencia de usuario

```
Como experto en UX/UI para la aplicación DevTracker describe detalladamente la experiencia de usuario ideal para desarrolladores, describe el Diseño y experiencia de usuario
```

## Prompt 8: Solicitud de instrucciones de instalación

```
Como devOps especializado en aplicaciones teniendo como contexto la aplicación que estamos desarrollando, crea las instrucciones de instalación
```

## Prompt 9: Solicitud de diseño de arquitectura cloud

```
Como arquitecto de sistemas cloud con experiencia diseña la arquitectura de la aplicación que se esta trabajando y crea el diagrama de arquitectura correspondiente
```

## Prompt 10: Solicitud de documentación de infraestructura y despliegue

```
Como especialista en DevOps con experiencia en despliegues de aplicaciones, para la aplicación que estamos desarrollando crea la documentación para Infraestructura y despliegue
```

## Prompt 11: Solicitud de documentación de tests

```
Como ingeniero QA especializados en pruebas detalla la estrategia completa de testing para el proyecto.
```

## Prompt 12: Solicitud de diseño del modelo de datos

```
Como ingeniero de BD especializado en Postgres y modelado de datos, diseña el modelo de datos completo para la aplicación que estamos realizando, ten en cuenta realizar el diagrama del modelo de datos en formato mermaid y utilizar todos los parámetros que permite la sintaxis para dar el máximo detalle, por ejemplo las claves primarias y foráneas.
```

## Prompt 13: Solicitud de especificación de API

```
Como arquitecto de APIs RESTful con experiencia, diseña la especificación completa de la API para el sistema DevTracker que estamos desarrollando. En formato OpenAPI, detalla:

1. Solo los tres endpoints más críticos del sistema
2. Para cada endpoint, especifica: 
   - Método HTTP
   - Parámetros de ruta, query y cuerpo (con tipos, restricciones y ejemplos)
   - Respuestas posibles (con códigos de estado, esquemas y ejemplos)
   - Headers requeridos
   - Mecanismos de autenticación y autorización

La especificación debe seguir las mejores prácticas de diseño RESTful y ser lo suficientemente detallada para que un equipo de desarrollo pueda implementarla sin ambigüedades.
``` 

## Prompt 14: Solicitud de historias de usuario detalladas

```
Como Product Owner con experiencia en desarrollos ágiles y aplicaciones redacta las 3 historias principales detalladas del proyecto DevTracker que estamos creando.
```

## Prompt 15: Solicitud de tickets de trabajo detallados

```
Como tech líder con experiencia en desarrollo full stack, gestión técnica de proyectos documenta 3 de los tickets de trabajo principales del desarrollo, uno de backend, uno de frontend, y uno de bases de datos. Da todo el detalle requerido para desarrollar la tarea de inicio a fin teniendo en cuenta las buenas prácticas al respecto.
```

## Prompt 16: Solicitud de documentación de Pull Requests

```
Como desarrollador senior con experiencia en revision de código de proyectos documenta 3 de los posibles Pull Requests que se realizaran durante la ejecución del proyecto.
```