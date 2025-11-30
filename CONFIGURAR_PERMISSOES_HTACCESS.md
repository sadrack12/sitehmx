# 🔐 Configurar Permissões do .htaccess no cPanel

## ✅ Permissões Corretas

O arquivo `.htaccess` deve ter as seguintes permissões:

```
644  (rw-r--r--)
```

Isso significa:
- **Proprietário (você):** Leitura + Escrita
- **Grupo:** Apenas Leitura
- **Outros:** Apenas Leitura

---

## 🛠️ Como Configurar no cPanel

### Método 1: Via File Manager (Mais Fácil)

1. **Acesse o File Manager no cPanel**

2. **Navegue até `public_html/`**

3. **Encontre o arquivo `.htaccess`**
   - Se não aparecer, ative "Show Hidden Files" nas configurações do File Manager

4. **Clique com botão direito no arquivo `.htaccess`**

5. **Selecione "Change Permissions" ou "Permissões"**

6. **Configure as permissões:**
   - Marque estas caixas:
     ```
     ☑ Read  ☑ Write  ☑ Execute  (Proprietário)
     ☑ Read              ☑ Execute  (Grupo)
     ☑ Read              ☑ Execute  (Outros)
     ```
   - Ou digite diretamente: `644`

7. **Clique em "Change Permissions" ou "Alterar"**

---

### Método 2: Via SSH/Terminal

Se você tiver acesso SSH:

```bash
cd ~/public_html
chmod 644 .htaccess
```

Verificar permissões:
```bash
ls -la .htaccess
```

Deve mostrar algo como:
```
-rw-r--r-- 1 usuario usuario 1189 .htaccess
```

---

## ⚠️ Problemas Comuns

### 1. Arquivo .htaccess não aparece no File Manager

**Solução:**
- No File Manager, clique em "Settings" ou "Configurações"
- Marque "Show Hidden Files" (Mostrar arquivos ocultos)
- Salve e recarregue

### 2. Permissões muito restritivas (400, 600)

Se as permissões forem muito restritivas, o Apache pode não conseguir ler o arquivo.

**Solução:**
```bash
chmod 644 .htaccess
```

### 3. Permissões muito abertas (777)

**NÃO use 777!** Isso é um risco de segurança.

**Solução:**
```bash
chmod 644 .htaccess
```

### 4. Arquivo .htaccess não funciona

Verifique:
- [ ] Permissões estão corretas (644)
- [ ] Arquivo começa com ponto (`.htaccess`)
- [ ] Está na pasta raiz (`public_html/`)
- [ ] Módulo `mod_rewrite` está habilitado no servidor

---

## 🔍 Verificar se está Funcionando

### Teste 1: Acessar a página
```
https://clamatec.com/gestao/login
```

### Teste 2: Verificar logs de erro
No cPanel, vá em "Errors" ou "Error Log" e veja se há erros relacionados ao `.htaccess`.

### Teste 3: Verificar no navegador
1. Abra o DevTools (F12)
2. Vá na aba "Network"
3. Acesse uma página
4. Veja se há erros 403 ou 500

---

## 📋 Permissões Recomendadas para Outros Arquivos

### Arquivos HTML, CSS, JS, Imagens:
```
644  (rw-r--r--)
```

### Pastas/Diretórios:
```
755  (rwxr-xr-x)
```

### Scripts PHP:
```
644  (rw-r--r--)
```

---

## ✅ Checklist Final

- [ ] Arquivo `.htaccess` criado em `public_html/`
- [ ] Permissões configuradas para `644`
- [ ] Arquivo visível no File Manager (Show Hidden Files ativado)
- [ ] Testou acessar uma rota (ex: `/gestao/login`)
- [ ] Verificou logs de erro (se necessário)

---

## 🎯 Comando Rápido (SSH)

Se tiver acesso SSH, execute:

```bash
cd ~/public_html
chmod 644 .htaccess
ls -la .htaccess
```

Deve mostrar:
```
-rw-r--r-- 1 seuusuario seuusuario 1189 .htaccess
```

---

## 💡 Dica

Se o `.htaccess` ainda não funcionar após configurar as permissões, pode ser necessário verificar se o módulo `mod_rewrite` está habilitado no servidor. Geralmente está habilitado por padrão no cPanel, mas em caso de dúvida, entre em contato com o suporte do hosting.

