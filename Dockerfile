
# Stage 1: Build Tailwind CSS
FROM node:22-alpine AS frontend

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY src/Forma.Web/Pages/ ./src/Forma.Web/Pages/
COPY src/Forma.Web/wwwroot/css/ ./src/Forma.Web/wwwroot/css/

RUN npm run css:build


# Stage 2: Publish the ASP.NET Core app
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /source

COPY . .

COPY --from=frontend \
  /workspace/src/Forma.Web/wwwroot/css/site.css \
  ./src/Forma.Web/wwwroot/css/site.css

RUN dotnet restore src/Forma.Web/Forma.Web.csproj

RUN dotnet publish src/Forma.Web/Forma.Web.csproj \
  -c Release \
  --no-restore \
  -o /app/publish


# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

COPY --from=build /app/publish ./

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

ENTRYPOINT ["dotnet", "Forma.Web.dll"]
