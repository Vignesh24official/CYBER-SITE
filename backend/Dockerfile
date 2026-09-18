# Stage 1: Build Java artifact using Maven
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production jar without tests (tests run in CI phase)
RUN ./mvnw package -DskipTests || mvn package -DskipTests

# Stage 2: Minimal Runtime Environment
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S cybershield && adduser -S cybershield -G cybershield
USER cybershield

# Copy built JAR artifact from builder stage
COPY --from=builder /app/target/cybershield-backend-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
