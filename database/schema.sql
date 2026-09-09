CREATE DATABASE IF NOT EXISTS athenas_sys;
USE athenas_sys;

-- 1. RESTAURANTES

CREATE TABLE restaurantes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL, 
    cnpj VARCHAR(18) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo BOOLEAN,
    
    CONSTRAINT uk_restaurantes_email
        UNIQUE (email),
        
    CONSTRAINT uk_restaurantes_cnpj
        UNIQUE (cnpj)
);


-- 2. MESAS

CREATE TABLE mesas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurante_id BIGINT NOT NULL,
    numero INT NOT NULL,
    capacidade INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    ativo BOOLEAN,

    CONSTRAINT fk_mesas_restaurante
        FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id),

    CONSTRAINT uk_mesas_restaurante_numero
        UNIQUE (restaurante_id, numero)
);


-- 3. FUNCIONARIOS

CREATE TABLE funcionarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurante_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    cargo VARCHAR(20) NOT NULL,
    ativo BOOLEAN,

    CONSTRAINT fk_funcionarios_restaurante
        FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id),

    CONSTRAINT uk_funcionarios_restaurante_codigo
        UNIQUE (restaurante_id, codigo)
);


-- 4. CATEGORIAS

CREATE TABLE categorias (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurante_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN,

    CONSTRAINT fk_categorias_restaurante
        FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id),

    CONSTRAINT uk_categorias_restaurante_nome
        UNIQUE (restaurante_id, nome)
);


-- 5. PRODUTOS

CREATE TABLE produtos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurante_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    ativo BOOLEAN,

    CONSTRAINT fk_produtos_restaurante
        FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id),

    CONSTRAINT fk_produtos_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id),

    CONSTRAINT uk_produtos_restaurante_nome
        UNIQUE (restaurante_id, nome)
);




-- 6. RESERVAS

CREATE TABLE reservas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurante_id BIGINT NOT NULL,
    mesa_id BIGINT NOT NULL,
    num_pessoas INT NOT NULL,
    nome_cliente VARCHAR(100) NOT NULL,
    telefone VARCHAR(255),
    data_hora DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_reservas_restaurante
        FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id),

    CONSTRAINT fk_reservas_mesa
        FOREIGN KEY (mesa_id)
        REFERENCES mesas(id)
);


-- 7. PEDIDOS

CREATE TABLE pedidos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurante_id BIGINT NOT NULL,
    mesa_id BIGINT NOT NULL,
    funcionario_id BIGINT NOT NULL,
    data_hora DATETIME NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL, 
    observacao VARCHAR(255),

    CONSTRAINT fk_pedidos_restaurante
        FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id),

    CONSTRAINT fk_pedidos_mesa
        FOREIGN KEY (mesa_id)
        REFERENCES mesas(id),

    CONSTRAINT fk_pedidos_funcionario
        FOREIGN KEY (funcionario_id)
        REFERENCES funcionarios(id)
);



-- 8. ITENS_PEDIDO

CREATE TABLE itens_pedido (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    restaurante_id BIGINT NOT NULL,
    pedido_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    observacao VARCHAR(255),
    valor_unitario DECIMAL(10,2) NOT NULL, 
    status VARCHAR(20) NOT NULL,

    CONSTRAINT fk_itens_pedido_restaurante
        FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id),

    CONSTRAINT fk_itens_pedido_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id),

    CONSTRAINT fk_itens_pedido_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
);



