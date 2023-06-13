FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3200

ENV MONGO_HOST mongodb
ENV MONGO_PORT 27017
ENV MONGO_DB restaurant_booking

# Start the server
CMD ["npm", "start"]
