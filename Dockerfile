# Multi-stage build for Spring Boot
FROM maven:3.9-eclipse-temurin-25-ea AS build

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:25-ea-jre-jammy

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Railway will inject PORT env var)
EXPOSE 8080

# Run the application
CMD ["java", "-Xmx512m", "-jar", "app.jar"]
