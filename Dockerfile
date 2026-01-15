# Multi-stage build for Spring Boot
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Railway uses dynamic PORT)
EXPOSE 8080

# Run the application with server.port from env
CMD ["sh", "-c", "java -Xmx512m -Dserver.port=${PORT:-8080} -jar app.jar"]
