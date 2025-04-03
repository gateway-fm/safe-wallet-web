FROM node:20-slim

# Set working directory
WORKDIR /app

# Add build argument for NPM_TOKEN
ARG NPM_TOKEN

# Copy root
COPY . .

# Set working directory to the web app
WORKDIR apps/web

# Set environment variables
ENV NPM_TOKEN=${NPM_TOKEN}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Enable corepack and configure yarn
RUN corepack enable
RUN yarn config set httpTimeout 300000

# Run any custom post-install scripts
RUN yarn install --immutable
RUN yarn after-install

# Expose the port
EXPOSE 3000

# Command to start the application
CMD ["yarn", "static-serve"]