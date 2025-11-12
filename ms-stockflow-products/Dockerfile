## Multi-stage Dockerfile for Spring Boot Products microservice
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/*.jar /app/app.jar

EXPOSE 8080

# Default DB connection (can be overridden by Compose envs)
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/stockflow_db \
    SPRING_DATASOURCE_USERNAME=postgres \
    SPRING_DATASOURCE_PASSWORD=6150

CMD ["java", "-jar", "/app/app.jar"]