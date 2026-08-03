# ============================================
# Stage 1: Dependencies Installation Stage
# ============================================

ARG NODE_VERSION=26-trixie-slim@sha256:715e55e4b84e4bb0ff48e49b398a848f08e55daed8eb6a0ea1839ae53bc57583

FROM node:${NODE_VERSION} AS dependencies

# Set working directory
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./

# Install project dependencies with frozen lockfile for reproducible builds
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
  npm install -g pnpm@11 && pnpm install --frozen-lockfile

# ============================================
# Stage 2: Build Next.js application in standalone mode
# ============================================

FROM node:${NODE_VERSION} AS builder

# Set working directory
WORKDIR /app

# Copy project dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/package.json ./package.json

# Copy application source code
COPY . .

# Ensure public directory exists in builder stage
RUN mkdir -p public

ENV NODE_ENV=production
ENV CI=true
ENV SKIP_ENV_VALIDATION=true

# Disable Next.js's anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm install -g pnpm@11 && pnpm build

# Ensure asset directories exist after build so COPY in runner stage never fails
RUN mkdir -p public .next/static .next/server/chunks node_modules/@img node_modules/sharp

# ============================================
# Stage 3: Run Next.js application
# ============================================

FROM node:${NODE_VERSION} AS runner

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=4000
ENV HOSTNAME="0.0.0.0"

# Disable Next.js's anonymous telemetry data about general usage
ENV NEXT_TELEMETRY_DISABLED=1

# Copy static public assets
COPY --from=builder --chown=node:node /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/.next/server/chunks ./.next/server/chunks

# Copy native modules and complete hoisted node_modules
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Set correct permissions for runtime write operations (prerender cache, etc.)
RUN chown -R node:node /app

# Switch to non-root user for security best practices
USER node

# Expose port 4000 to allow HTTP traffic
EXPOSE 4000

# Start Next.js standalone server
CMD ["node", "server.js"]
