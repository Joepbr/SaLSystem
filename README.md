# SaLSystem
Sistema de Gerenciamento da escola Stop and Learn

# Projeto de front-end criado via comando:
npx create-react-app salsys

# Instalação de bibliotecas adicionais no projeto de front-end
npm install react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @fontsource/roboto
npm install @mui/icons-material

    ->instalar react-icons
npm install react-icons --save

# Estilos no front-end
Modificação dos estilos para se adequar às telas projetadas em figma

# Projeto de back-end criado via comando:
npx @aka-demy/create-express-app
nome: back-end
linguagem: Javascript
pacote: npm

# Instalação do Prisma no projeto back end via comando:
npm install prisma --save-dev

# Inicialização do Prisma via comando:
npx prisma init --datasource-provider postgresql

# Executar migração
npx prisma migrate dev --name create-*nome*

# Primeiros passos do back-end
Criar a tabela de cursos e desenvolver as operações de CRUD

Criar as tabelas de modulos, users, professores, alunos e responsáveis e desenvolver seus respectivos CRUDs
Criar as tabelas de aulas, matrículas, presenças e avaliações e desenvolver os CRUDs

# Implementar autenticação do usuário
Instalar os pacotes:

npm install jsonwebtoken
npm install dotenv

Criar método controller.login
Criar senha TOKEN_SECRET no arquivo .env e passar em controller.login