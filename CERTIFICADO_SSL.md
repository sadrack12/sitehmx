# Como Aceitar o Certificado SSL Auto-Assinado

O sistema está usando HTTPS com um certificado SSL auto-assinado para desenvolvimento. O navegador mostrará um aviso de segurança que precisa ser aceito.

## Como Aceitar o Certificado

### Chrome/Edge (Windows/Mac/Linux)

1. Acesse `https://172.20.10.8`
2. Você verá uma página de aviso: **"Sua conexão não é privada"** ou **"NET::ERR_CERT_AUTHORITY_INVALID"**
3. Clique em **"Avançado"** ou **"Advanced"**
4. Clique em **"Continuar para 172.20.10.8 (não seguro)"** ou **"Proceed to 172.20.10.8 (unsafe)"**
5. O certificado será aceito e você poderá acessar o site normalmente

### Firefox (Windows/Mac/Linux)

1. Acesse `https://172.20.10.8`
2. Você verá uma página de aviso: **"Aviso: Possível Risco de Segurança"**
3. Clique em **"Avançado"** ou **"Advanced"**
4. Clique em **"Aceitar o Risco e Continuar"** ou **"Accept the Risk and Continue"**
5. O certificado será aceito

### Safari (Mac)

1. Acesse `https://172.20.10.8`
2. Você verá uma página de aviso sobre o certificado
3. Clique em **"Mostrar Detalhes"** ou **"Show Details"**
4. Clique em **"Visitar este site"** ou **"Visit this website"**
5. Digite sua senha do Mac se solicitado
6. O certificado será aceito

## Importante

- **Este aviso é normal em desenvolvimento** - certificados auto-assinados não são confiáveis por padrão
- **Você precisa aceitar o certificado uma vez** - depois disso, o navegador lembrará da sua escolha
- **Se mudar o IP do servidor**, você precisará aceitar o certificado novamente
- **Em produção**, use um certificado válido (Let's Encrypt, etc.)

## Solução Permanente (Opcional)

Para evitar o aviso em desenvolvimento, você pode:

1. **Instalar o certificado no sistema operacional** (mais complexo)
2. **Usar um certificado válido** (Let's Encrypt com domínio)
3. **Configurar o navegador para confiar no certificado** (varia por navegador)

## Verificar se o Certificado Foi Aceito

Após aceitar o certificado:
- O ícone de cadeado no navegador mostrará um aviso, mas o site funcionará
- As requisições de API não serão mais bloqueadas
- O WebRTC funcionará corretamente

## Troubleshooting

### Erro persiste após aceitar o certificado

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Feche e reabra o navegador
3. Tente em uma janela anônima/privada
4. Verifique se está acessando via HTTPS (não HTTP)

### Erro em requisições de API

Se as requisições de API ainda falharem após aceitar o certificado:
1. Recarregue a página (F5 ou Ctrl+R)
2. Faça um hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)
3. Verifique o console do navegador para mais detalhes

