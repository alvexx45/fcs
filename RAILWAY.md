# Deploy no Railway 🚂

## Passo a Passo

### 1. Acesse o Railway
- Vá em [railway.app](https://railway.app)
- Faça login com GitHub

### 2. Crie um Novo Projeto
- Clique em "New Project"
- Selecione "Deploy from GitHub repo"
- Escolha este repositório (`fcs`)

### 3. Adicione MySQL
- No projeto, clique em "+ New"
- Selecione "Database" → "Add MySQL"
- Railway cria automaticamente as variáveis de ambiente

### 4. Configure as Variáveis de Ambiente
Railway detecta automaticamente o Dockerfile, mas você precisa conectar as variáveis do MySQL:

Na configuração do serviço da aplicação, adicione:
```
MYSQL_URL=${{MySQL.DATABASE_URL}}
MYSQL_USER=${{MySQL.MYSQLUSER}}
MYSQL_PASSWORD=${{MySQL.MYSQLPASSWORD}}
```

### 5. Deploy
- Railway faz deploy automaticamente!
- A URL pública será gerada em "Settings" → "Networking" → "Generate Domain"

## Variáveis que o Railway Injeta Automaticamente
- `PORT` - Porta do servidor (Railway escolhe dinamicamente)
- `DATABASE_URL` - String de conexão do MySQL (se adicionar o serviço)

## Comandos Úteis (Opcional)

### Testar localmente com Docker
```bash
docker build -t fcs .
docker run -p 8080:8080 fcs
```

### Railway CLI (Opcional)
```bash
# Instalar
npm i -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Ver logs
railway logs
```

## Custo
- **Plano Grátis**: $5 de crédito/mês (geralmente suficiente para apps pequenos)
- **Plano Hobby**: $5/mês + uso
- **Plano Pro**: $20/mês + uso

## Notas
- Deploy automático a cada push no GitHub ✅
- HTTPS automático ✅
- Muito mais simples que Azure ✅
