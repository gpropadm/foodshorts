#!/bin/bash

# FoodShorts Setup Script
echo "🚀 Configurando FoodShorts..."

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

log_info "Bem-vindo ao setup do FoodShorts! 🍕"
echo ""

# Check Node.js
log_info "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado!"
    echo "Instale Node.js 18+ de: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    echo "Atualize em: https://nodejs.org/"
    exit 1
fi

log_success "Node.js $(node -v) ✅"

# Check npm
if ! command -v npm &> /dev/null; then
    log_error "npm não encontrado!"
    exit 1
fi

log_success "npm $(npm -v) ✅"

# Check/Install Expo CLI
log_info "Verificando Expo CLI..."
if ! command -v expo &> /dev/null; then
    log_info "Instalando Expo CLI..."
    npm install -g @expo/cli
    if [ $? -eq 0 ]; then
        log_success "Expo CLI instalado ✅"
    else
        log_warning "Falha ao instalar Expo CLI"
    fi
else
    log_success "Expo CLI $(expo --version) ✅"
fi

# Install dependencies
log_info "Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    log_error "Falha ao instalar dependências"
    exit 1
fi
log_success "Dependências instaladas ✅"

# Setup environment files
log_info "Configurando arquivos de ambiente..."

# Server .env
if [ ! -f "apps/server/.env" ]; then
    cp apps/server/.env.example apps/server/.env
    log_success "Criado apps/server/.env"
else
    log_info "apps/server/.env já existe"
fi

# Web .env
if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.local.example apps/web/.env.local
    log_success "Criado apps/web/.env.local"
else
    log_info "apps/web/.env.local já existe"
fi

# Check PostgreSQL
log_info "Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    log_success "PostgreSQL encontrado ✅"
    
    # Try to connect to default database
    if psql -h localhost -p 5432 -U postgres -c "SELECT 1;" &> /dev/null; then
        log_success "Conexão com PostgreSQL OK ✅"
        
        # Create database if it doesn't exist
        log_info "Criando database foodshorts..."
        psql -h localhost -p 5432 -U postgres -c "CREATE DATABASE foodshorts;" 2>/dev/null || log_info "Database já existe"
        
    else
        log_warning "Não foi possível conectar ao PostgreSQL"
        echo "Certifique-se de que o PostgreSQL está rodando na porta 5432"
        echo "Usuário: postgres (sem senha)"
    fi
else
    log_warning "PostgreSQL não encontrado"
    echo "Instale PostgreSQL 15+ de: https://www.postgresql.org/download/"
fi

# Setup database
log_info "Configurando banco de dados..."
cd apps/server

# Generate Prisma client
npm run db:generate
if [ $? -eq 0 ]; then
    log_success "Prisma client gerado ✅"
else
    log_warning "Falha ao gerar Prisma client (verifique configuração do DB)"
fi

# Run migrations
npm run db:migrate 2>/dev/null
if [ $? -eq 0 ]; then
    log_success "Migrações executadas ✅"
else
    log_warning "Falha nas migrações (verifique configuração do DB)"
fi

cd ../..

# Build packages
log_info "Construindo packages compartilhados..."
npm run build --workspace=@foodshorts/config --if-present
npm run build --workspace=@foodshorts/ui --if-present
log_success "Packages construídos ✅"

# Make scripts executable
chmod +x scripts/*.sh
log_success "Scripts tornados executáveis ✅"

# Setup complete
echo ""
log_success "🎉 Setup concluído com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Configure as variáveis de ambiente:"
echo "   • apps/server/.env (DATABASE_URL, JWT_SECRET, etc.)"
echo "   • apps/web/.env.local (CLERK_SECRET_KEY, etc.)"
echo ""
echo "2. Inicie o ambiente de desenvolvimento:"
echo "   • ./scripts/dev.sh"
echo ""
echo "3. Acesse os serviços:"
echo "   • API: http://localhost:3001/health"
echo "   • Admin: http://localhost:3002"
echo "   • Mobile: Expo DevTools"
echo ""
echo "📚 Documentação:"
echo "   • README.md - Informações gerais"
echo "   • FoodShorts_spec_v1.3.md - Especificação completa"
echo ""
echo "🆘 Suporte:"
echo "   • GitHub Issues"
echo "   • suporte@foodshorts.com"
echo ""

# Check for common issues
echo "🔍 Verificando configuração..."

# Check if ports are available
if nc -z localhost 3001 2>/dev/null; then
    log_warning "Porta 3001 está em uso (pode conflitar com o backend)"
fi

if nc -z localhost 3002 2>/dev/null; then
    log_warning "Porta 3002 está em uso (pode conflitar com admin web)"
fi

# Check disk space
DISK_USAGE=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    log_warning "Pouco espaço em disco disponível ($DISK_USAGE% usado)"
fi

log_success "Verificação concluída ✅"
echo ""
echo "🍕 FoodShorts está pronto para desenvolvimento!"