 
# Utilisez une image de base .NET 8
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Étape de build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["StudentPortal.csproj", "./"]
RUN dotnet restore "StudentPortal.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "StudentPortal.csproj" -c Release -o /app/build

# Étape de publication
FROM build AS publish
RUN dotnet publish "StudentPortal.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Étape finale
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "StudentPortal.dll"]