# ✅ Build stage with no vulnerabilities
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY backend /app
RUN mvn clean package -DskipTests

# ✅ Runtime stage with no vulnerabilities
FROM eclipse-temurin:17-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "backend.jar"]