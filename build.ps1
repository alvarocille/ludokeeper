# Ruta base del proyecto
$Root = Split-Path -Parent $MyInvocation.MyCommand.Definition

function Show-Section {
    param($Text)
    Write-Host "`n== $Text ==============================" -ForegroundColor Cyan
}

function Test-Command {
    param($cmd)
    $null = & cmd /c "$cmd --version" 2>$null
    return ($LASTEXITCODE -eq 0)
}

function Start-DockerRunning {
    Write-Host "🔍 Verificando Docker Desktop..." -ForegroundColor Cyan
    if (-not (Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue)) {
        Write-Host "🐳 Docker Desktop no está corriendo. Intentando iniciar..." -ForegroundColor Yellow
        Start-Process "Docker Desktop" | Out-Null
        Write-Host "⏳ Esperando a que Docker se inicie..." -ForegroundColor Yellow
        $maxAttempts = 60
        $attempt = 0
        while (-not (& docker info > $null 2>&1) -and ($attempt -lt $maxAttempts)) {
            Start-Sleep -Seconds 2
            $attempt++
        }
        if ($attempt -ge $maxAttempts) {
            Write-Host "❌ Docker no pudo iniciarse tras esperar 2 minutos." -ForegroundColor Red
            exit 1
        }
        Write-Host "✔ Docker Desktop está en ejecución." -ForegroundColor Green
    }
    else {
        Write-Host "✔ Docker Desktop ya está en ejecución." -ForegroundColor Green
    }
}

function Rename-EnvIfNeeded {
    param([string]$Path)
    $envPath = Join-Path $Path ".env"
    $envTestPath = Join-Path $Path ".env.test"

    if (Test-Path $envPath) {
        Write-Host "✔ .env ya existe en $Path" -ForegroundColor Yellow
    }
    elseif (Test-Path $envTestPath) {
        Rename-Item -Path $envTestPath -NewName ".env"
        Write-Host "✔ Renombrado .env.test -> .env en $Path" -ForegroundColor Green
    }
    else {
        Write-Host "✘ No se encontró .env.test en $Path" -ForegroundColor Red
    }
}

function Start-DockerCompose {
    param([string]$Path)
    Push-Location $Path
    Write-Host "🧹 Ejecutando docker-compose down..." -ForegroundColor Magenta
    docker-compose down
    Write-Host "🐳 Ejecutando docker-compose up..." -ForegroundColor Green
    docker-compose up -d --build
    Pop-Location
}

function Test-OrExit {
    param($tool, $message)
    if (-not (Test-Command $tool)) {
        Write-Host "❌ No se encontró '$tool'. $message" -ForegroundColor Red
        exit 1
    }
}

# =========================
# COMPROBACIONES INICIALES
# =========================
Show-Section "Comprobaciones iniciales"
Test-OrExit "docker" "Instala Docker Desktop desde https://www.docker.com/products/docker-desktop/"
Test-OrExit "docker-compose" "Instala docker-compose o Docker Compose V2 integrado."
Test-OrExit "npm" "Instala Node.js desde https://nodejs.org/"
Test-OrExit "npx" "npx es parte de Node.js. Asegúrate de que 'npm' esté correctamente instalado."
Start-DockerRunning

# ====================
# BACKEND: IAM
# ====================
Show-Section "Configurando backend/IAM"
Rename-EnvIfNeeded "$Root\backend\IAM"
Start-DockerCompose "$Root\backend\IAM"

# ====================
# BACKEND: INVENTORY
# ====================
Show-Section "Configurando backend/inventory"
Rename-EnvIfNeeded "$Root\backend\inventory"
Start-DockerCompose "$Root\backend\inventory"

# ====================
# BACKEND: CATALOG
# ====================
Show-Section "Configurando backend/catalog"
Rename-EnvIfNeeded "$Root\backend\catalog"
Start-DockerCompose "$Root\backend\catalog"

# ====================
# BACKEND: MATCH
# ====================
Show-Section "Configurando backend/match"
Rename-EnvIfNeeded "$Root\backend\match"
Start-DockerCompose "$Root\backend\match"

# ====================
# KEYCLOAK
# ====================
Show-Section "Configurando keycloak"
Rename-EnvIfNeeded "$Root\keycloak"
Start-DockerCompose "$Root\keycloak"

# ====================
# FRONTEND EXPO
# ====================
Show-Section "Configurando frontend/ludokeeper"
Rename-EnvIfNeeded "$Root\frontend\ludokeeper"

Push-Location "$Root\frontend\ludokeeper"
Write-Host "📦 Verificando dependencias npm..." -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}
else {
    Write-Host "✔ Dependencias ya instaladas." -ForegroundColor Green
}

Write-Host "🚀 Iniciando cliente Expo..." -ForegroundColor Green
npx expo start
Pop-Location
