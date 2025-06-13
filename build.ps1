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
        Wr# Ruta base del proyecto
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

        function Ensure-EnvFile {
            param([string]$Path)
            $envFile = Join-Path $Path ".env"
            $envTestFile = Join-Path $Path ".env.test"

            if (-not (Test-Path $envFile) -and (Test-Path $envTestFile)) {
                Copy-Item $envTestFile -Destination $envFile -Force
                Write-Host "✔ Copiado .env.test -> .env en $Path (sin borrar original)" -ForegroundColor Green
            }
            elseif (Test-Path $envFile) {
                Write-Host "✔ .env ya existe en $Path" -ForegroundColor Yellow
            }
            else {
                Write-Host "✘ No se encontró .env.test en $Path" -ForegroundColor Red
            }
        }

        function Ensure-PublicKey {
            param([string]$Path)
            $keyFile = Join-Path $Path "public_key.pem"
            $keyTestFile = Join-Path $Path "public_key.pem.test"

            if (-not (Test-Path $keyFile) -and (Test-Path $keyTestFile)) {
                Copy-Item $keyTestFile -Destination $keyFile -Force
                Write-Host "✔ Copiado public_key.pem.test -> public_key.pem en $Path (sin borrar original)" -ForegroundColor Green
            }
            elseif (Test-Path $keyFile) {
                Write-Host "✔ public_key.pem ya existe en $Path" -ForegroundColor Yellow
            }
            else {
                Write-Host "✘ No se encontró public_key.pem.test en $Path" -ForegroundColor Red
            }
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

        # ============================
        # PREPARAR .env Y CLAVES JWT
        # ============================
        $services = @(
            "$Root",
            "$Root\backend\IAM",
            "$Root\backend\inventory",
            "$Root\backend\catalog",
            "$Root\backend\matches",
            "$Root\frontend\ludokeeper"
        )

        foreach ($servicePath in $services) {
            if (Test-Path $servicePath) {
                Ensure-EnvFile $servicePath
                Ensure-PublicKey $servicePath
            }
            else {
                Write-Host "⚠ $servicePath no existe. Omitido." -ForegroundColor DarkYellow
            }
        }

        # ====================
        # DOCKER-COMPOSE RAÍZ
        # ====================
        Show-Section "Levantando todos los servicios con docker-compose desde la raíz"
        Push-Location $Root
        Write-Host "🧹 Ejecutando docker compose down..." -ForegroundColor Magenta
        docker compose down
        Write-Host "🐳 Ejecutando docker compose up..." -ForegroundColor Green
        docker compose up -d --build
        Pop-Location

        # ====================
        # FRONTEND EXPO
        # ====================
        Show-Section "Configurando frontend/ludokeeper"
        $frontendPath = "$Root\frontend\ludokeeper"
        Push-Location $frontendPath
        Write-Host "📦 Instalando dependencias npm..." -ForegroundColor Yellow
        npm install
        Write-Host "🚀 Iniciando cliente Expo..." -ForegroundColor Green
        npx expo start
        Pop-Location
        ite-Host "✔ Renombrado .env.test -> .env en $Path" -ForegroundColor Green
    }
    else {
        Write-Host "✘ No se encontró .env.test en $Path" -ForegroundColor Red
    }
}

function Rename-PublicKeyIfNeeded {
    param([string]$Path)
    $keyPath = Join-Path $Path "public_key.pem"
    $keyTestPath = Join-Path $Path "public_key.pem.test"

    if (Test-Path $keyPath) {
        Write-Host "✔ public_key.pem ya existe en $Path" -ForegroundColor Yellow
    }
    elseif (Test-Path $keyTestPath) {
        Rename-Item -Path $keyTestPath -NewName "public_key.pem"
        Write-Host "✔ Renombrado public_key.pem.test -> public_key.pem en $Path" -ForegroundColor Green
    }
    else {
        Write-Host "✘ No se encontró public_key.pem.test en $Path" -ForegroundColor Red
    }
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

# ============================
# PREPARAR .env Y CLAVES JWT
# ============================
$services = @(
    "$Root",
    "$Root\backend\IAM",
    "$Root\backend\inventory",
    "$Root\backend\catalog",
    "$Root\backend\matches",
    "$Root\frontend\ludokeeper"
)

foreach ($servicePath in $services) {
    if (Test-Path $servicePath) {
        Rename-EnvIfNeeded $servicePath
        Rename-PublicKeyIfNeeded $servicePath
    }
    else {
        Write-Host "⚠ $servicePath no existe. Omitido." -ForegroundColor DarkYellow
    }
}

# ====================
# DOCKER-COMPOSE RAÍZ
# ====================
Show-Section "Levantando todos los servicios con docker-compose desde la raíz"
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

function Ensure-EnvFile {
    param([string]$Path)
    $envFile = Join-Path $Path ".env"
    $envTestFile = Join-Path $Path ".env.test"

    if (-not (Test-Path $envFile) -and (Test-Path $envTestFile)) {
        Copy-Item $envTestFile -Destination $envFile -Force
        Write-Host "✔ Copiado .env.test -> .env en $Path" -ForegroundColor Green
    }
    elseif (Test-Path $envFile) {
        Write-Host "✔ .env ya existe en $Path" -ForegroundColor Yellow
    }
    else {
        Write-Host "✘ No se encontró .env.test en $Path" -ForegroundColor Red
    }
}

function Ensure-PublicKey {
    param([string]$Path)
    $keyFile = Join-Path $Path "public_key.pem"
    $keyTestFile = Join-Path $Path "public_key.pem.test"

    if (-not (Test-Path $keyFile) -and (Test-Path $keyTestFile)) {
        Copy-Item $keyTestFile -Destination $keyFile -Force
        Write-Host "✔ Copiado public_key.pem.test -> public_key.pem en $Path" -ForegroundColor Green
    }
    elseif (Test-Path $keyFile) {
        Write-Host "✔ public_key.pem ya existe en $Path" -ForegroundColor Yellow
    }
    else {
        Write-Host "✘ No se encontró public_key.pem.test en $Path" -ForegroundColor Red
    }
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

# ============================
# PREPARAR .env Y CLAVES JWT
# ============================
$services = @(
    "$Root",
    "$Root\backend\iam",
    "$Root\backend\inventory",
    "$Root\backend\catalog",
    "$Root\backend\matches",
    "$Root\frontend\ludokeeper"
)

foreach ($servicePath in $services) {
    if (Test-Path $servicePath) {
        Ensure-EnvFile $servicePath
        Ensure-PublicKey $servicePath
    }
    else {
        Write-Host "⚠ $servicePath no existe. Omitido." -ForegroundColor DarkYellow
    }
}

# ==============================
# DOCKER COMPOSE POR SERVICIO
# ==============================
$dockerComposePaths = @(
    "$Root\backend\iam",
    "$Root\backend\inventory",
    "$Root\backend\catalog",
    "$Root\backend\matches",
    "$Root\keycloak"
)

foreach ($composePath in $dockerComposePaths) {
    if (Test-Path (Join-Path $composePath "docker-compose.yml")) {
        Show-Section "Levantando servicios en $composePath"
        Push-Location $composePath
        docker compose down
        docker compose up -d --build
        Pop-Location
    } else {
        Write-Host "⚠ No se encontró docker-compose.yml en $composePath. Omitido." -ForegroundColor DarkYellow
    }
}

# ====================
# FRONTEND EXPO
# ====================
Show-Section "Configurando frontend/ludokeeper"
$frontendPath = "$Root\frontend\ludokeeper"
Push-Location $frontendPath
Write-Host "📦 Instalando dependencias npm..." -ForegroundColor Yellow
npm install
Write-Host "🚀 Iniciando cliente Expo..." -ForegroundColor Green
npx expo start
Pop-Location
cation $Root
Write-Host "🧹 Ejecutando docker compose down..." -ForegroundColor Magenta
docker compose down
Write-Host "🐳 Ejecutando docker compose up..." -ForegroundColor Green
docker compose up -d --build
Pop-Location

# ====================
# FRONTEND EXPO
# ====================
Show-Section "Configurando frontend/ludokeeper"
$frontendPath = "$Root\frontend\ludokeeper"
Push-Location $frontendPath
Write-Host "📦 Instalando dependencias npm..." -ForegroundColor Yellow
npm install
Write-Host "🚀 Iniciando cliente Expo..." -ForegroundColor Green
npx expo start
Pop-Location