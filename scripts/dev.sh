#!/bin/bash

# FoodShorts Development Script
echo "🍕 Iniciando FoodShorts em modo desenvolvimento..."

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

log_success "Node.js $(node -v) encontrado"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log_error "Execute este script na raiz do projeto FoodShorts"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    log_info "Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        log_error "Falha ao instalar dependências"
        exit 1
    fi
    log_success "Dependências instaladas"
fi

# Build packages
log_info "Construindo packages compartilhados..."
npm run build --workspace=@foodshorts/ui --if-present
npm run build --workspace=@foodshorts/config --if-present
log_success "Packages construídos"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    log_warning "PostgreSQL não encontrado. Certifique-se de que está rodando na porta 5432"
else
    log_success "PostgreSQL encontrado"
fi

# Check environment files
if [ ! -f "apps/server/.env" ]; then
    log_warning "Arquivo .env não encontrado em apps/server/"
    log_info "Copiando .env.example para .env..."
    cp apps/server/.env.example apps/server/.env
    log_warning "Configure as variáveis de ambiente em apps/server/.env"
fi

if [ ! -f "apps/web/.env.local" ]; then
    log_warning "Arquivo .env.local não encontrado em apps/web/"
    log_info "Copiando .env.local.example para .env.local..."
    cp apps/web/.env.local.example apps/web/.env.local
    log_warning "Configure as variáveis de ambiente em apps/web/.env.local"
fi

# Start development servers
log_info "Iniciando servidores de desenvolvimento..."

# Start server in background
log_info "Iniciando servidor backend (porta 3001)..."
cd apps/server
npm run dev &
SERVER_PID=$!
cd ../..

# Wait a bit for server to start
sleep 3

# Start web admin in background
log_info "Iniciando painel admin web (porta 3002)..."
cd apps/web
npm run dev &
WEB_PID=$!
cd ../..

# Start mobile app
log_info "Iniciando app mobile (Expo)..."
cd apps/mobile

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    log_info "Instalando Expo CLI..."
    npm install -g @expo/cli
fi

npm start &
MOBILE_PID=$!
cd ../..

# Function to cleanup on exit
cleanup() {
    log_info "Encerrando servidores..."
    kill $SERVER_PID 2>/dev/null
    kill $WEB_PID 2>/dev/null
    kill $MOBILE_PID 2>/dev/null
    log_success "Servidores encerrados"
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM

log_success "FoodShorts iniciado com sucesso! 🚀"
echo ""
echo "📱 Serviços rodando:"
echo "   • Backend API: http://localhost:3001"
echo "   • Admin Web:   http://localhost:3002"
echo "   • Mobile App:  Expo DevTools"
echo ""
echo "🔧 Para parar os serviços, pressione Ctrl+C"
echo ""

# Wait for user to stop
wait