# Deploy no Render - Guia Completo

## 📋 Pré-requisitos
- Conta no [Render](https://render.com) (gratuita)
- Código no GitHub, GitLab ou Bitbucket
- Git instalado localmente

## 🚀 Passo a Passo para Deploy

### 1. Preparar o Repositório Git

```bash
# Se ainda não inicializou o git
git init
git add .
git commit -m "Preparado para deploy no Render"

# Criar repositório no GitHub e fazer push
git remote add origin <URL_DO_SEU_REPOSITORIO>
git branch -M main
git push -u origin main
```

### 2. Criar Banco de Dados PostgreSQL

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em **"New +"** → **"PostgreSQL"**
3. Preencha:
   - **Name**: `fcs-db`
   - **Database**: `fcs_database`
   - **User**: `fcs_user`
   - **Region**: Escolha a mais próxima (ex: Oregon - US West)
   - **Plan**: **Free**
4. Clique em **"Create Database"**
5. **Aguarde 2-3 minutos** até o banco estar disponível
6. Anote as credenciais (você pode acessá-las depois)

### 3. Criar Web Service

1. No Dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub/GitLab
3. Configure:
   - **Name**: `fcs-app` (ou o nome que preferir)
   - **Region**: Mesma do banco de dados
   - **Branch**: `main`
   - **Root Directory**: (deixe vazio)
   - **Environment**: **Docker**
   - O Render detectará automaticamente o `Dockerfile` na raiz do projeto
   - **Build Command**: (deixe vazio - Docker usa o Dockerfile)
   - **Start Command**: (deixe vazio - Docker usa o CMD do Dockerfile)

### 4. Configurar Variáveis de Ambiente

Na seção **Environment Variables** do seu Web Service, adicione:

**IMPORTANTE**: Você precisa copiar as informações do painel do banco de dados.

1. Abra o banco de dados `fcs-db` em outra aba
2. Na seção **"Connections"**, clique no ícone de "olho" 👁️ para revelar os valores ocultos
3. No seu Web Service, adicione estas 3 variáveis:

**Variável 1:**
```
Key: JDBC_DATABASE_URL
Value: copie "Internal Database URL" e adicione jdbc: no início
```
Exemplo: Se aparecer `postgresql://fcs_user:senha@dpg-xxxxx-a/fcs`  
Cole como: `jdbc:postgresql://fcs_user:senha@dpg-xxxxx-a/fcs`

**Variável 2:**
```
Key: PGUSER
Value: fcs_user
```
(copie do campo "Username" do banco)

**Variável 3:**
```
Key: PGPASSWORD
Value: <copie do campo "Password" do banco>
```
(clique no 👁️ para revelar a senha)

### 5. Deploy

1. Clique em **"Create Web Service"**
2. O Render iniciará o build automaticamente
3. Acompanhe os logs em tempo real
4. Aguarde 5-10 minutos para o primeiro deploy

### 6. Acessar a Aplicação

Após o deploy bem-sucedido:
- URL da aplicação: `https://fcs-app.onrender.com` (ou o nome que você escolheu)
- Acesse `/api/health` para verificar se está funcionando

## 🔧 Desenvolvimento Local

Para testar localmente com PostgreSQL:

```bash
# Iniciar banco PostgreSQL com Docker
docker-compose up postgres -d

# Rodar a aplicação
./mvnw spring-boot:run

# Ou com Docker completo
docker-compose up --build
```

## 📝 Notas Importantes

### Limitações do Plano Free do Render:
- ⚠️ **Web Service hiberna após 15 minutos de inatividade**
  - Primeiro acesso após hibernação pode demorar 30-60 segundos
- **750 horas/mês** de uso gratuito
- **512MB RAM** para web service
- **1GB armazenamento** para PostgreSQL
- Banco de dados expira após **90 dias** (mas pode ser renovado)

### Dicas:
1. **Health Check**: O endpoint `/api/health` deve retornar status 200
2. **Logs**: Acesse logs em tempo real no dashboard do Render
3. **Auto-deploy**: Por padrão, cada push na branch `main` faz deploy automático
4. **Domínio customizado**: Pode adicionar domínio próprio (planos pagos)

### Troubleshooting:

**Erro de conexão com banco:**
- Verifique se `DATABASE_URL` está configurada
- Confirme que o banco está "Available" no dashboard

**Build falha:**
- Verifique se `pom.xml` está correto
- Confirme que Java 21 está especificado

**Aplicação não inicia:**
- Verifique logs no Render Dashboard
- Confirme que a porta está usando `$PORT`

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
git add .
git commit -m "Descrição das alterações"
git push origin main
```

O Render fará deploy automático!

## 🆘 Suporte

- [Render Docs](https://render.com/docs)
- [Render Community](https://community.render.com)

---

**Alternativa usando arquivo `render.yaml`:**

O arquivo `render.yaml` na raiz do projeto permite configurar tudo via código. 
Para usar, basta conectar o repositório e o Render detectará automaticamente!
