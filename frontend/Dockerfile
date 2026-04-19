FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci


FROM node:20-alpine AS test
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run test


FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build


FROM nginx:alpine AS runner

# Install curl for healthcheck
RUN apk add --no-cache curl

# Clean default nginx files
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN addgroup -S appuser && adduser -S appuser -G appuser
RUN touch /var/run/nginx.pid && \
    chown -R appuser:appuser /var/run/nginx.pid /var/cache/nginx /var/log/nginx /usr/share/nginx/html
USER appuser
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]










