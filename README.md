<h1 align="center">Cine Drive-in Front-End (Web)</h1>

## Descrição do Projeto
<p>O front-end web, criado para o do Cine Drive-in de Brasília, permite que os usuários visualizem o cardápio disponível e façam pedidos de forma prática e intuitiva. Através dessa aplicação, os clientes podem navegar pelos itens oferecidos, adicionar produtos ao carrinho e finalizar seu pedido. Essa aplicação é focada em uma navegação Mobile.</p>

<h4 align="center"> 
	🚧  Cine drive-in Web 🚀 Em construção...  🚧
</h4>

<p align="center">
 <a href="#features">Features</a> •
 <a href="#demonstracao-da-aplicacao">Demonstração da Aplicação</a> • 
 <a href="#pre-requisitos">Pré-requisitos</a> • 
 <a href="#rodando-a-aplicacao">Rodando a aplicação</a> • 
 <a href="#metodologia">Metodologia</a> • 
 <a href="#tecnologias">Tecnologias</a>
</p>

<h2 align="center" id="features">Features</h2>

- [x] Visualização do Cardápio
- [x] Navegação por Categorias
- [x] Adição ao Carrinho
- [x] Atualização de Quantidades
- [x] Remoção de Itens
- [x] Resumo do Pedido
- [x] Confirmação de Pedido
- [x] Responsividade
- [x] Feedback Visual
- [x] Visualização de Pedidos Recentes

<h2 align="center" id="demonstracao-da-aplicacao">Demonstração da Aplicação</h2>

<div align="center">
<img src="https://github.com/leoFagundes/cine-drivein-web/blob/main/public/assets/github/home_template.jpg" height="400px" />‎ ‎  ‎ 
<img src="https://github.com/leoFagundes/cine-drivein-web/blob/main/public/assets/github/close_template.jpg" height="400px" />‎ ‎  ‎ 
<img src="https://github.com/leoFagundes/cine-drivein-web/blob/main/public/assets/github/menu_template.jpg" height="400px" />‎ ‎  ‎ 
</div>
<div align="center">
<img src="https://github.com/leoFagundes/cine-drivein-web/blob/main/public/assets/github/finish_order.jpg" height="400px" />‎ ‎  ‎ 
<img src="https://github.com/leoFagundes/cine-drivein-web/blob/main/public/assets/github/item_template.jpg" height="400px" />‎ ‎  ‎ 
<img src="https://github.com/leoFagundes/cine-drivein-web/blob/main/public/assets/github/feedback_template.jpg" height="400px" /> ‎  ‎ 	
</div>

<h2 align="center" id="pre-requisitos">Pré-requisitos</h2>

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e um editor de código como [VSCode](https://code.visualstudio.com/)

Além disto é necessário ter o back-end rodando: [Link Back-end](https://github.com/leoFagundes/cine-drivein-backend) e alterar o link de requisição da api no caminho `src/services/api.ts`

<h2 align="center" id="rodando-a-aplicacao">🚀 Rodando a aplicação</h2>

```bash
# Clone este repositório
$ git clone https://github.com/leoFagundes/cine-drivein-web.git

# Acesse a pasta do projeto no terminal/cmd
$ cd cine-drivein-web

# Esse projeto utiliza a versão 18.18.0 do Node.js. Garanta que você tenha o NVM instalado e utilize o comando abaixo para usar a versão correta:
$ nvm install 18.18.0
$ nvm use 18.18.0

# Instale as dependências
$ npm install

# Execute a aplicação
$ npm start

# O servidor inciará na porta:3000 - acesse <http://localhost:3000>
```

<h2 align="center" id="metodologia">Metodologia</h2>

Este projeto utiliza a metodologia Atomic Design para organizar e estruturar os componentes da interface. O Atomic Design é uma metodologia que divide os componentes em cinco níveis distintos, que são átomos, moléculas, organismos, templates e páginas. Cada nível representa uma abstração diferente e ajuda na construção de componentes reutilizáveis e escaláveis.

- **Átomos**: São os elementos de interface mais básicos, como botões, inputs e ícones.
- **Moléculas**: São combinações de átomos que formam componentes mais complexos, como um campo de formulário.
- **Organismos**: São componentes compostos por moléculas e/ou átomos e representam partes de uma interface mais completa, como um formulário completo.
- **Templates**: São estruturas que organizam os organismos em uma página, definindo a disposição e o layout.
- **Páginas**: São instâncias específicas de templates, onde são definidos os dados e conteúdos específicos.

O uso do Atomic Design neste projeto proporciona uma melhor organização e manutenção do código, facilitando a criação de novos componentes e a reutilização de código já existente.

[Mais sobre atomic design](https://medium.com/pretux/atomic-design-o-que-%C3%A9-como-surgiu-e-sua-import%C3%A2ncia-para-a-cria%C3%A7%C3%A3o-do-design-system-e3ac7b5aca2c)


<h2 align="center" id="tecnologias">🛠 Tecnologias</h2>

As seguintes ferramentas foram usadas na construção do projeto:

- [React](https://pt-br.reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [Sass](https://sass-lang.com/)
- [SCSS Modules](https://github.com/css-modules/css-modules)
- [React Router](https://reactrouter.com/)
- [Prettier](https://prettier.io/)
<!-- - [Jest](https://jestjs.io/) -->

Além das tecnologias mencionadas anteriormente, este projeto também fez uso das seguintes ferramentas:

- [Figma](https://www.figma.com/)
- [Trello](https://trello.com/) 

---

 <img style="border-radius: 50%;" src="https://github.com/leoFagundes.png" width="100px;" alt="profile-img"/>
 <h3><b>Leonardo Fagundes</b></h3>

[![Linkedin Badge](https://img.shields.io/badge/-Leonardo%20Fagundes-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/leonardo-fagundes-5a348a248/)](https://www.linkedin.com/in/leonardo-fagundes-5a348a248/) 
[![Gmail Badge](https://img.shields.io/badge/-leofagundes2015@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:leofagundes2015@gmail.com)](mailto:leofagundes2015@gmail.com)
[![Instagram Badge](https://img.shields.io/badge/-@leo.fagundes.50-E4405F?style=flat-square&labelColor=E4405F&logo=instagram&logoColor=white&link=https://www.instagram.com/leo.fagundes.50/)](https://www.instagram.com/leo.fagundes.50/) 

<!-- - licença (https://blog.rocketseat.com.br/como-fazer-um-bom-readme) -->
