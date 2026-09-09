# Guia de Desenvolvimento - Git e GitHub

## Objetivo
Este documento define o fluxo de trabalho utilizado no desenvolvimento do Athenas Sys.

O objetivo é manter o projeto organizado, evitar conflitos entre os integrantes e garantir que a branch principal esteja sempre estável.

#### Observação:
O documento não contém instruções sobre ``merge``, pois a equipe é iniciante com Git e GitHub, por isso a melhor decisão foi a de os integrantes avisarem o responsável pelo backend para realizar os merges.

---
## Estrutura do Repositório
O projeto está organizado da seguinte forma:
```
Athenas Sys
│
├── backend
│   └── API Spring Boot
│
└── database
│   └── Querys e scripts em MySQL 
│
└── frontend
│   └── Angular
│
└── docs
│   └── Documentos do projeto
│
└── gitignore
```

---
## Branches do Projeto
Branch é um conceito de ramificações, onde você tem algo parecido com uma árvore que se ramifica para vários galhos.

A raíz da árvore necessita ser sólida e firme, para que o resto não desmorone, é a parte principal da árvore.

O tronco é uma continuidade da raíz, é onde os galhos se encontram para só depois chegarem até a raíz, já unificados em um só.

Os galhos são o que fazem a árvore, são os responsáveis por fornecer nutrientes e captar luz solar, são o que mantém ela viva, sem eles, a árvore é somente um toco de madeira.

**Utilizamos três tipos de branch:**
- main
- develop
- feature

### main
É a versão estável do projeto, a versão visível e principal.

Na analogia da árvore, a raíz.

#### regras
- _Nunca_ desenvolver diretamente nela.
- _Nunca_ fazer commits diretamente nela.
- Apenas código testado deve chegar à main.
- Para entrar na main, deve passar pela _develop_ e por verificação humana

### develop
É a branch do desenvolvimento, a etapa de verificação.
Todas as funcionalidades serão unificadas aqui antes de irem para a main.

Na analogia da árvore, o tronco.

### feature
Cada funcionalidade deve possuir a sua própria branch.
Uma feature possuí somente uma responsabilidade.
É aqui onde você trabalha, aonde irá codar, para somente quando finalizar, dar merge com a develop. É onde o projeto realmente é feito.

Na analogia da árvore, os galhos.

---
## Commit
Um commit é uma maneira de registrar as alterações realizadas, um checkpoint, extremamente importante para o versionamento de projetos, pois cria um histórico de alterações que pode ser consultado a qualquer momento, ajudando com novos erros e comparações frequentes.

Faça os commits sempre que concluir uma parte lógica do desenvolvimento.
Comumente, nós utilizamos o padrão **Conventional Commits**:
### Principais Tipos de commits:
#### 1. feat:
Convencionalmente usado para identificar uma nova feature (funcionalidade) ao projeto. Exemplos:
- ``git commit -m "feat: implementa cadastro de mesas"``
- ``git commit -m "feat: adiciona autenticação JWT"``

#### 2. fix:
Convencionalmente usado para representar correções de erros. Exemplos:
- ``git commit -m "fix: corrige validação do CNPJ"``
- ``git commit -m "fix: corrige relacionamento entre Pedido e Produto"``

#### 3. refactor:
Convencionalmente usado para representar mudanças que não alteram o comportamento da aplicação. Exemplos:
- ``git commit -m "refactor: reorganiza camada de serviços"``
- ``git commit -m "refactor: remove código duplicado"``

#### 4. docs:
Convencionalmente usado para mostrar alterações na documentação. Exemplos:
- ``git commit -m "docs: adiciona documentação da API"``
- ``git commit -m "docs: atualiza README"``

#### 5. chore:
Convencionalmente usado para identificar alterações de configuração. Exemplos:
- ``git commit -m "chore: atualiza dependências"``
- ``git commit -m "chore: configura Flyway"``

---
## Fluxo de Trabalho
Se ainda não tiver clonado o repositório (Realize uma única vez):
1. Abra o terminal CMD do Windows na pasta que deseja armazenar o projeto. Exemplo de pasta:
    - ``C:\Users\usuario\Desktop\Projetos``
2. Digite:
    - ``git clone https://github.com/ZK-Tshz/Athenas-Sys.git``
3. Aperte "enter" no teclado e abra a pasta "Athenas-Sys" (criada dentro da pasta escolhida) na sua IDE de preferência

### 1. Atualizar a develop
Sempre antes de começar a mexer no projeto, antes de qualquer outra coisa, assim que abrir a IDE:
- Abra o terminal no CMD (na própria IDE)
- Troque para a branch develop:
    - ``git checkout develop``
- Sincronize seu projeto local com o repositório do GitHub:
    - ``git pull origin develop``

### 2. Criar uma nova branch de feature
Depois de sincronizar os repositórios, poderá começar a desenvolver, tendo cada funcionalidade em uma branch específica.
- Verifique em qual branch você está:
  - ```git branch```

- Crie a branch de feature:
  - ``git checkout -b feature/"nome-da-funcionalidade"``

Sempre nomeie a branch de acordo com a funcionalidade que está desenvolvendo, por exemplo:
- ``feature/restaurante``
- ``feature/mesas``
- ``feature/pedidos``
- ``feature/cozinha``

Lembre-se que, sempre para criar uma nova branch, deve se estar na branch **develop**
- Então rode:
  - ``git checkout develop``
- Depois o comando para criar a branch de feature:
  - ``git checkout -b feature/"nome-da-funcionalidade"``
- Caso queira somente mudar de branch:
  - ``git checkout nome-da-branch``

### 2.1 Programar na branch já criada
Caso tenha desenvolvido uma funcionalidade e não tenha terminado, quando for continuar, para evitar problemas, siga os seguintes passos:
- Verifique a branch em que está:
  - ``git branch``
- Troque para a branch develop:
  - ``git checkout develop``
- Sincronize seu projeto local com o repositório do GitHub:
  - ``git pull origin develop``
- Troque para a branch que estava antes:
  - ``git checkout feature/"nome-da-funcionalidade"``
- Sincronize a branch atual com o GitHub
  - ``git pull origin feature/"nome-da-funcionalidade"``

### 3. Adicionar arquivos ao Git
Sempre que concluir uma parte da feature, ou uma parte importante dessa funcionalidade, registre a alteração.
Para isso, será necessário um commit, mas antes do commit, é necessário adicionar os arquivos modificados ao Git.
- Veja quais arquivos foram modificados, adicionados ou removidos:
  - ``git status``

- Adicione os arquivos no Git:
    - ``git add .``

Rode esse comando para adicionar os arquivos modificados no Git para poder realizar um commit

### 4. Commit
Depois de adicionar os arquivos ao Git, registre as mudanças de uma feature, de uma parte lógica do desenvolvimento ou de uma parte importante, com commits.
- Para dar o commit, execute:
    - ``git commit -m "texto do commit"``
- Exemplos:
    - ``git commit -m "feat: cria entidade Restaurante"``
    - ``git commit -m "docs: atualiza README com novas pendências"``
    - ``git commit -m "feat: adiciona autenticação JWT"``

### 5. Push
Depois de realizar o commit, é hora de subir isso para o repositório do GitHub.
- Na primeira vez que for realizar o push de uma branch, rode:
    - ``git push -u origin feature/restaurante``
- Depois disso, será necessário rodar somente:
    - ``git push``

---
## Fluxograma

Abrir terminal na IDE

↓

``git checkout develop``

↓

``git pull origin develop``

↓

``git checkout -b feature/"nome-da-funcionalidade"``

↓

Desenvolver

↓

``git status``

↓

``git add .``

↓

``git commit``

↓

``git push``

↓

Parou no meio do desenvolvimento? 

* Se sim, faça:

``git branch`` (Aqui mostrará o nome da branch, se não for develop, guarde o nome)

↓

``git checkout develop``

↓

``git pull origin develop``

↓

``git checkout "nome-da-branch"`` (coloque o nome que apareceu no primeiro comando, a menos que seja "develop")

↓

``git pull origin "nome-da-branch"``

↓

Desenvolver

↓

``git status``

↓

``git add .``

↓

``git commit``

↓

``git push``

* Se não, siga o começo do fluxo.

---
## Comandos Úteis
| Comando             | Função               |
| ------------------- |----------------------|
| `git status`        | Ver alterações       |
| `git branch`        | Ver branches         |
| `git checkout`      | Trocar de branch     |
| `git checkout -b`   | Criar branch         |
| `git add .`         | Adicionar alterações |
| `git commit`        | Criar commit         |
| `git push`          | Enviar commit        |
| `git pull`          | Atualizar branch     |

