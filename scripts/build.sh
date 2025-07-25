#!/bin/bash

# FoodShorts Build Script
echo "🏗️  Construindo FoodShorts para produção..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "Execute este script na raiz do projeto FoodShorts"
    exit 1
fi

# Clean previous builds
log_info "Limpando builds anteriores..."
npm run clean
log_success "Builds anteriores removidos"

# Install dependencies
log_info "Instalando dependências..."
npm ci
if [ $? -ne 0 ]; then
    log_error "Falha ao instalar dependências"
    exit 1
fi
log_success "Dependências instaladas"

# Build packages first
log_info "Construindo packages compartilhados..."
npm run build --workspace=@foodshorts/config
if [ $? -ne 0 ]; then
    log_error "Falha ao construir @foodshorts/config"
    exit 1
fi

npm run build --workspace=@foodshorts/ui
if [ $? -ne 0 ]; then
    log_error "Falha ao construir @foodshorts/ui"
    exit 1
fi
log_success "Packages compartilhados construídos"

# Build server
log_info "Construindo servidor backend..."
cd apps/server
npm run build
if [ $? -ne 0 ]; then
    log_error "Falha ao construir servidor"
    cd ../..
    exit 1
fi
cd ../..
log_success "Servidor construído"

# Build web admin
log_info "Construindo painel admin web..."
cd apps/web
npm run build
if [ $? -ne 0 ]; then
    log_error "Falha ao construir painel web"
    cd ../..
    exit 1
fi
cd ../..
log_success "Painel web construído"

# Run database migrations (if needed)
if [ -f "apps/server/.env" ]; then
    log_info "Executando migrações do banco..."
    cd apps/server
    npm run db:migrate 2>/dev/null || log_warning "Migrações falharam ou não há migrações pendentes"
    cd ../..
fi

# Create build info
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
BUILD_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_VERSION=$(node -p "require('./package.json').version")

cat > build-info.json << EOF
{
  "version": "$BUILD_VERSION",
  "buildDate": "$BUILD_DATE",
  "commitHash": "$BUILD_HASH",
  "environment": "production"
}
EOF

log_success "Build info criado: build-info.json"

# Check build sizes
log_info "Verificando tamanhos dos builds..."

SERVER_SIZE=$(du -sh apps/server/dist 2>/dev/null | cut -f1 || echo "N/A")
WEB_SIZE=$(du -sh apps/web/.next 2>/dev/null | cut -f1 || echo "N/A")

echo ""
echo "📊 Tamanhos dos builds:"
echo "   • Servidor: $SERVER_SIZE"
echo "   • Web Admin: $WEB_SIZE"
echo ""

log_success "Build concluído com sucesso! 🎉"
echo ""
echo "📦 Arquivos prontos para deploy:"
echo "   • apps/server/dist/ (Backend)"
echo "   • apps/web/.next/ (Admin Web)"
echo "   • build-info.json (Informações de build)"
echo ""
echo "🚀 Para deploy:"
echo "   • Servidor: npm start em apps/server/"
echo "   • Web: npm start em apps/web/"
echo ""