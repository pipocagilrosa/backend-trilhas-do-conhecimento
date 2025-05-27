# Use a imagem oficial do Node.js
FROM node:20.11.1

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências de produção e desenvolvimento (precisa do build)
RUN npm install

# Copia o restante do código
COPY . .

# Compila o código TypeScript
RUN npm run build

# Expõe a porta usada pela aplicação (ajuste se necessário)
EXPOSE 4000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]