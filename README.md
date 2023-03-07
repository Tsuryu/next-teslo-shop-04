# Next.js Teslo App

* Docker
```
docker-compose up -d
```

* MongoDB url
```
mongodb://localhost:27017/teslodb
```

## Configurar variables de entorno en __.env.template__
Cambiar nombre de __.env.template__ a __.env__ y agregarle la configuracion de las variables de entorno

## Endpoint para llenar la base de datos con informacion de prueba
```
curl --location --request GET 'http://localhost:3000/api/seed'
```
