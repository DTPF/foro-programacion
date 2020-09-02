### Descripcion

Este foro de programación es una práctica de un curso de Udemy, Master en webs Full Stack: Angular, Node, Laravel, Symfony +. El back-end está relizado con NodeJs, base de datos no-sql MongoDb, y front-end en AngularJs.

### Instrucciones de ejecución en desarrollo

#### Versiones aconsejadas

- NodeJs ~14.7.0
- Npm ~6.14.7
- Mongo ~3.6.3
- Angular ~9.1.12

#### Paso a paso

Previamente instalado MongoDb, NodeJs y Npm con las versiones indicadas.

- Clonamos el repositorio de github
`$ git clone https://github.com/DTPF/foroprogramacion.dev.git`

- Configuramos si es preciso la base de datos en /api-rest-node/index.js. Por defecto creará una base de datos llamada 'api_rest_node'.

- En la raíz de la carpeta foro-angular ejecutamos
`$ npm install`

- Sin cambiar de directorio levantamos el servidor de desarrollo de angular
`$ ng serve`

- En la carpeta api-rest-node ejecutamos
`$ npm install`

- Sin cambiar de directorio levantamos el servidor de node
`$ npm start`

- Ya esta corriendo la aplicación en http://localhost:4200.


