#!/bin/bash

# Script para verificar estrutura no servidor

echo "=========================================="
echo "VERIFICAÇÃO DE ESTRUTURA NO SERVIDOR"
echo "=========================================="
echo ""

echo "1. Verificar se login.html existe:"
echo "   ls -la ~/public_html/gestao/login.html"
echo ""

echo "2. Verificar conteúdo do .htaccess:"
echo "   cat ~/public_html/.htaccess"
echo ""

echo "3. Verificar se há outros .htaccess:"
echo "   find ~/public_html -name '.htaccess' -type f"
echo ""

echo "4. Verificar estrutura da pasta gestao:"
echo "   ls -la ~/public_html/gestao/"
echo ""

echo "5. Testar se arquivo existe:"
echo "   test -f ~/public_html/gestao/login.html && echo 'EXISTE' || echo 'NÃO EXISTE'"
echo ""

echo "6. Verificar permissões:"
echo "   ls -la ~/public_html/.htaccess"
echo "   ls -la ~/public_html/gestao/login.html"
echo ""

echo "=========================================="
echo "EXECUTE OS COMANDOS ACIMA NO SERVIDOR"
echo "=========================================="

