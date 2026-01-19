# build stage
FROM node:22-alpine AS build

WORKDIR /app

# Add these for env vars (before build)
ARG VITE_API_BASE
ARG VITE_STRIPE_PUBLIC_KEY
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built application from build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]