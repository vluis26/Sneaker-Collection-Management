DROP TABLE IF EXISTS sneakers;

CREATE TABLE sneakers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    brand VARCHAR(255) NOT NULL,
    colorway VARCHAR(255),
    model VARCHAR(255),
    photo_url VARCHAR(255)
);
