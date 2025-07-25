#!/bin/bash

echo "🚀 Preparando deploy para Vercel..."

# Instalar Vercel CLI se não tiver
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Fazer login na Vercel (se necessário)
echo "🔐 Fazendo login na Vercel..."
vercel login

# Deploy do projeto
echo "🚀 Fazendo deploy..."
vercel --prod

echo "✅ Deploy concluído!"
echo "🌐 Seu app estará disponível em breve!"