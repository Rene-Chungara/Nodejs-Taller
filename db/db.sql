USE taller_mecanico;

CREATE TABLE users(
    id bigint primary key auto_increment, 
    email varchar(180) not null unique,
    nombre varchar(90) not null,
    lastname varchar(90) not null,
    phone varchar(90) not null unique,
    images varchar(255) null,
    contra varchar(90) not null,
    created_at timestamp(0) not null,
    updated_at timestamp(0) not null
);

CREATE TABLE roles(
	id bigint primary key auto_increment,
    name varchar(50) not null unique,
    image varchar(255) null,
    route varchar(180) not null,
    created_at timestamp(0) not null,
	updated_at timestamp(0) not null
);

INSERT INTO roles( name, route, created_at, updated_at)
	values	('TALLER', '/taller/orders/list', '2023-11-23', '2023-11-23'),
			('TECNICO', '/tecnico/orders/list', '2023-11-23', '2023-11-23'),
            ('CLIENTE', '/cliente/products/list', '2023-11-23', '2023-11-23');

CREATE TABLE user_has_roles(
	id_user bigint not null,
    id_rol bigint not null,
    created_at timestamp(0) not null,
	updated_at timestamp(0) not null,
    foreign key (id_user) references users(id)
		on update cascade
        on delete cascade,
	foreign key (id_rol) references roles(id)
		on update cascade
        on delete cascade,
	primary key(id_user, id_rol)
);

CREATE TABLE categories(
	id bigint primary key auto_increment,
    name varchar(180) not null,
    description text null,
    created_at timestamp(0) not null,
	updated_at timestamp(0) not null
);

CREATE TABLE products(
	id bigint primary key auto_increment,
    name varchar(180) not null unique,
    description text null,
    price decimal not null,
    image1 varchar(255) null,
    image2 varchar(255) null,
    image3 varchar(255) null,
    id_category bigint not null,
    created_at timestamp(0) not null,
	updated_at timestamp(0) not null,
    foreign key (id_category) references categories(id)
		on update cascade
        on delete cascade
);

CREATE TABLE address(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(180) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    id_user BIGINT NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE orders(
	id BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_client BIGINT NOT NULL,
    id_delivery BIGINT NULL,
    id_address BIGINT NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    status VARCHAR(90) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
); 

CREATE TABLE order_has_products(
	id_order BIGINT NOT NULL,
    id_product BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    PRIMARY KEY(id_order, id_product),
    FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);