# Athenas Sys

Sistema web desenvolvido para auxiliar na organização e administração de pequenos restaurantes, buscando facilitar o gerenciamento das atividades e melhorar a organização dos processos.

## Sobre

O Athenas Sys foi desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso Técnico em Informática para Internet.

O projeto tem como objetivo aplicar, na prática, conhecimentos adquiridos ao longo do curso, envolvendo desenvolvimento de sistemas web, programação, banco de dados e integração entre diferentes tecnologias.

## Tecnologias

- Java 17
- Spring Boot 4.0.7
- Angular 21.2.19
- MySQL
- IntelliJ IDEA
- Visual Studio Code
- MySQL Workbench

## Funcionalidades

- Cadastro de restaurantes, funcionários, mesas, reservas, categorias, produtos, pedidos e itens do pedido;
- Listagem de funcionários, mesas, reservas, categorias, produtos, pedidos e itens do pedido;
- Detalhamento por ID de restaurantes, funcionários, mesas, reservas, categorias, produtos, pedidos e itens do pedido;
- Atualização de restaurantes, funcionários, mesas, reservas, categorias, produtos, pedidos e itens do pedido;
- Desativação (Soft Delete) de restaurantes, funcionários, mesas, categorias e produtos (desativar uma categoria desativa os produtos relacionados a ela);
- Reativação de funcionários, mesas, categorias e produtos;
- Ao cadastrar algo que já existe desativado, o sistema oferece a reativação;
- Listagem de inativos (atualmente somente pela API do backend, sem tela de inativos);
- Autenticação (login) de restaurantes e funcionários com token JWT;
- Criptografia de senhas via hash BCrypt e senha forte (8 a 72 caracteres, maiúscula, minúscula, número e caractere especial);
- Validação de CNPJ por meio de API externa (OpenCNPJ);
- Restrição de acessos conforme o cargo (GERENTE, RECEPCAO, GARCOM e COZINHA) e o tipo de usuário (RESTAURANTE ou FUNCIONARIO);
- Isolamento entre restaurantes com comparação do ID da URL com o ID do token;
- Alteração de senha e de código de funcionário com confirmação de atual;
- Recuperação por e-mail de senhas e códigos de funcionários (o código de autenticação é enviado ao e-mail do restaurante);
- Recuperação de restaurante desativado via e-mail (o código de autenticação é enviado ao e-mail do restaurante);
- Limite de tentativas de login e de recuperação por e-mail;
- Ocupação e liberação de mesas;
- Conclusão e cancelamento de reservas;
- Alteração do status dos itens do pedido (Pendente, Em Preparo, Pronto, Entregue e Cancelado);
- Pedido só é criado se conter ao menos um item;
- Cálculo automático do valor total dos pedidos;
- Cardápio com rota pública para que o cliente do restaurante possa acessar;

## Pré-requisitos
- Java 17
- Node + Angular CLI
- MySQL 8
- Banco de dados local criado com o `database/schema.sql`

## Como executar

Clone o repositório, abra-o no terminal, e siga os passos a seguir conforme o que desejar.

### Banco de Dados

1. Abrir a sua ferramenta de gerenciamento de banco de dados relacionais MySQL (recomendado o MySQL Workbench)
2. Executar o script localizado em `database/schema.sql`

### Backend

1. `cd backend`
2. `mvnw.cmd spring-boot:run` (a API sobe em http://localhost:8080/api)

### Frontend

1. `cd frontend`
2. `npm install`
3. `ng serve` para abrir o sistema (abre em: http://localhost:4200)
4. `ng serve site --port 4300` para abrir o site de divulgação (abre em: http://localhost:4300)

## Variáveis de Ambiente

As variáveis de ambiente são chaves necessárias para o funcionamento correto do sistema.

Para definí-las no IntelliJ, clique em:
1. Botão com 3 barras laterais ("Main Menu") no canto superior esquerdo
2. Botão "Run"
3. Botão "Edit Configurations..."
4. Botão "Modify Options" (ou pressione "alt + E")
5. Adicione as variáveis de ambiente no campo de texto que abrir

| Nome           | Função                                  | Exemplo                        | Obrigatório? |
|----------------|-----------------------------------------|--------------------------------|--------------|
| DB_HOST        | Serviço de hospedagem do banco de dados | localhost                      | Sim          |
| DB_NAME        | Nome do banco de dados                  | athenas_sys                    | Sim          |
| DB_USER        | Usuário de login no banco de dados      | root                           | Sim          |
| DB_PASSWORD    | Senha do banco de dados                 | Senha@123                      | Sim          |
| JWT_SECRET     | Assinatura dos tokens JWT               | (32 caracteres aleatórios)     | Sim          |
| MAIL_HOST      | Domínio de e-mail                       | smtp.gmail.com                 | Sim          |
| MAIL_PORT      | Porta do domínio de e-mail              | 587                            | Sim          |
| MAIL_USER      | Usuário de e-mail para envio            | athenassystem@gmail.com        | Sim          |
| MAIL_PASSWORD  | Senha de aplicativo do e-mail           | xxxx xxxx xxxx xxxx            | Sim          |
| MAIL_FROM      | Remetente para o envio de e-mail        | nao-responda@athenassys.com.br | Não          |
| EMAIL_SIMULADO | Simular e-mail                          | false                          | Sim          |

Deixar `EMAIL_SIMULADO=true` fará o sistema rodar sem servidor de email

## Equipe

- Ana Luiza Maciel da Silva
- Lorena Boechat Silva Marques
- Maria Isabella Souza Santos
- Murilo Baptista de Oliveira


## Status do Projeto

- Em desenvolvimento
