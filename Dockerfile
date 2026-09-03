# ==============================================================================
# Production Dockerfile for Google Cloud Run
# Multi-stage build for optimized image size, security, and performance
# ==============================================================================

# Stage 1: Build & Bundle
FROM node:22-slim AS builder

WORKDIR /app

# Install dependencies using package-lock.json for reproducible builds
COPY package*.json ./
RUN npm ci

# Copy application source code and configuration files
COPY . .

# Build Vite client assets and bundle Express backend into dist/server.cjs
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime
# ==============================================================================
FROM node:22-slim AS runner

WORKDIR /app

# Cloud Run defaults and Node production environment
ENV NODE_ENV=production
ENV PORT=8080

# Create an unprivileged non-root user and group for container security
RUN groupadd -r aurafit && useradd -r -g aurafit -m aurafit

# Copy package manifests and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy pre-compiled production bundle (client assets + bundled server.cjs)
COPY --from=builder /app/dist ./dist

# Set file ownership to non-root user
RUN chown -R aurafit:aurafit /app

# Switch to non-root user
USER aurafit

# Document the default port exposed by the Cloud Run service container
EXPOSE 8080

# Health check to ensure the service is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 8080) + '/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));"

# Launch the production CommonJS bundled server
CMD ["node", "dist/server.cjs"]
