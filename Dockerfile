# Build stage - Build Hugo site
FROM alpine:latest AS builder

# Install Hugo
RUN apk add --no-cache \
    hugo \
    git

# Set working directory
WORKDIR /site

# Copy the entire site
COPY . .

# Build the Hugo site
RUN hugo --minify --gc

# Production stage - Serve with nginx
FROM nginx:alpine

# Copy built site from builder stage
COPY --from=builder /site/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80