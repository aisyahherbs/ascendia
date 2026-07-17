FROM node:22-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN npm --prefix backend ci --omit=dev

COPY backend ./backend
COPY index.html styles.css app.js ./

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "backend/src/server.js"]
