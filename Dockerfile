FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
RUN addgroup -S spring && adduser -S spring -G spring
COPY --from=build --chown=spring:spring /app/target/bank-soap-service-1.0-SNAPSHOT.jar app.jar
USER spring
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
