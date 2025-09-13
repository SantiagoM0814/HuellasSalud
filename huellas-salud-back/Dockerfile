# Imagen base con Java 21
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copia archivos de Maven
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Copia código fuente
COPY src src

# Da permisos a mvnw
RUN chmod +x mvnw

# Construye la app
RUN ./mvnw clean package -DskipTests

# Expone el puerto que Render asignará
ENV PORT=8080
EXPOSE 8080

# Start command
CMD ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "target/quarkus-app/quarkus-run.jar"]