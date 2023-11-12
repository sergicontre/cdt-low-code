# Use la imagen oficial de Node-RED
FROM nodered/node-red:latest

# Cambia al directorio donde Node-RED espera los nodos adicionales
WORKDIR /usr/src/node-red

# Instala los nodos adicionales
RUN npm install node-red-contrib-opcua

# Copia el archivo de flujo personalizado en la imagen
COPY custom-flow.json /data/flows.json
