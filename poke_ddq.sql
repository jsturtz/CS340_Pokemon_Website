DROP TABLE IF EXISTS Types_Strength;
DROP TABLE IF EXISTS Pokemon_Locations;
DROP TABLE IF EXISTS Pokemon_Moves;
DROP TABLE IF EXISTS Evolutions;
DROP TABLE IF EXISTS Pokemon_Types;
DROP TABLE IF EXISTS Pokemon;
DROP TABLE IF EXISTS Types;
DROP TABLE IF EXISTS Moves;
DROP TABLE IF EXISTS Locations;


CREATE TABLE Pokemon (
        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        attack INT(11) NOT NULL,
        health INT(11) NOT NULL,
        defense INT(11) NOT NULL,
        speed INT(11) NOT NULL,
        description VARCHAR(255) NOT NULL,
);

CREATE TABLE Types (
        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Moves (
        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        status_effect VARCHAR(255)
);

CREATE TABLE Locations (
        id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR(255) NOT NULL
);

CREATE TABLE Pokemon_Types (
        poke_id INT(11) NOT NULL,
        type_id INT(11) NOT NULL,
        FOREIGN KEY(poke_id) REFERENCES Pokemon(id) ON DELETE CASCADE,
	FOREIGN KEY(type_id) REFERENCES Types(id) ON DELETE CASCADE
);

CREATE TABLE Evolutions (
        to_poke INT(11) NOT NULL PRIMARY KEY,
        from_poke INT(11) NOT NULL,
        FOREIGN KEY(to_poke) REFERENCES Pokemon(id) ON DELETE CASCADE,
        FOREIGN KEY(from_poke) REFERENCES Pokemon(id) ON DELETE CASCADE
);

CREATE TABLE Pokemon_Moves (
        poke_id INT(11) NOT NULL,
        move_id INT(11) NOT NULL,
        level INT(11) UNSIGNED,
        FOREIGN KEY(poke_id) REFERENCES Pokemon(id) ON DELETE CASCADE,
        FOREIGN KEY(move_id) REFERENCES Moves(id) ON DELETE CASCADE
);

CREATE TABLE Pokemon_Locations (
        poke_id INT(11) NOT NULL,
        location_id INT(11) NOT NULL,
        FOREIGN KEY(poke_id) REFERENCES Pokemon(id) ON DELETE CASCADE,
        FOREIGN KEY(location_id) REFERENCES Locations(id) ON DELETE CASCADE
);

CREATE TABLE Types_Strength (
	strong_id INT(11) NOT NULL,
	weak_id INT(11) NOT NULL,
	PRIMARY KEY (strong_id, weak_id),
	FOREIGN KEY(strong_id) REFERENCES Types(id) ON DELETE CASCADE,
	FOREIGN KEY(weak_id) REFERENCES Types(id) ON DELETE CASCADE
);

/*
	Sample Data inserted for part b
*/
INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Charmander', 1, 2, 3, 4, 'a red lizard');
INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Squirtle', 5, 6, 7, 8, 'a blue turtle');
INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Bulbasaur', 9, 10, 11, 12, 'a green dinosaur');
INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Pikachu', 13, 14, 15, 16, 'a yellow mouse');

INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Charmeleon', 100, 102, 103, 104, 'a bigger lizard');
INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Wartortle', 105, 106, 107, 108, 'a bigger blue turtle');
INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Ivysaur', 109, 110, 111, 112, 'a bigger green dinosaur');
INSERT INTO Pokemon(name, attack, health, defense, speed, description) values ('Raichu', 113, 114, 115, 116, 'a bigger yellow mouse');

INSERT INTO Types(name) values ('Fire');
INSERT INTO Types(name) values ('Water');
INSERT INTO Types(name) values ('Grass');
INSERT INTO Types(name) values ('Electric');

INSERT INTO Moves(name, status_effect) values ('Ember', 'Burn');
INSERT INTO Moves(name) values ('Water Gun');
INSERT INTO Moves(name) values ('Vine Whip');
INSERT INTO Moves(name, status_effect) values ('ThunderShock', 'Paralyze');

INSERT INTO Locations(name, description) values ('Pewter City', 'A city north of Pallet Town.');
INSERT INTO Locations(name, description) values ('Viridian Forest', 'A forest filled with bugs.');
INSERT INTO Locations(name, description) values ('Cerulean City', 'A city east of Digglett Cave.');
INSERT INTO Locations(name, description) values ('Vermillion City', 'A port city south of Cerulean City.');

INSERT INTO Pokemon_Types(poke_id, type_id) values ((SELECT id FROM Pokemon WHERE name = 'squirtle'), (SELECT id FROM Types WHERE name = 'Water'));
INSERT INTO Pokemon_Types(poke_id, type_id) values ((SELECT id FROM Pokemon WHERE name = 'charmander'), (SELECT id FROM Types WHERE name = 'Fire'));
INSERT INTO Pokemon_Types(poke_id, type_id) values ((SELECT id FROM Pokemon WHERE name = 'pikachu'), (SELECT id FROM Types WHERE name = 'Electric'));
INSERT INTO Pokemon_Types(poke_id, type_id) values ((SELECT id FROM Pokemon WHERE name = 'bulbasaur'), (SELECT id FROM Types WHERE name = 'Grass'));

INSERT INTO Evolutions(to_poke, from_poke) values ((SELECT id FROM Pokemon WHERE name = 'charmander'), (SELECT id FROM Pokemon WHERE name = 'charmeleon'));

INSERT INTO Pokemon_Moves(poke_id, move_id) values ((SELECT id FROM Pokemon WHERE name = 'pikachu'), (SELECT id FROM Moves WHERE name = 'Thundershock'));
INSERT INTO Pokemon_Moves(poke_id, move_id) values ((SELECT id FROM Pokemon WHERE name = 'bulbasaur'), (SELECT id FROM Moves WHERE name = 'Vine Whip'));
INSERT INTO Pokemon_Moves(poke_id, move_id) values ((SELECT id FROM Pokemon WHERE name = 'charmander'), (SELECT id FROM Moves WHERE name = 'Ember'));
INSERT INTO Pokemon_Moves(poke_id, move_id) values ((SELECT id FROM Pokemon WHERE name = 'squirtle'), (SELECT id FROM Moves WHERE name = 'Water Gun'));

INSERT INTO Pokemon_Locations(poke_id, location_id) values ((SELECT id FROM Pokemon WHERE name = 'bulbasaur'), (SELECT id FROM Locations WHERE name = 'Cerulean City'));
INSERT INTO Pokemon_Locations(poke_id, location_id) values ((SELECT id FROM Pokemon WHERE name = 'charmander'), (SELECT id FROM Locations WHERE name = 'Pewter City'));
INSERT INTO Pokemon_Locations(poke_id, location_id) values ((SELECT id FROM Pokemon WHERE name = 'squirtle'), (SELECT id FROM Locations WHERE name = 'Vermillion City'));
INSERT INTO Pokemon_Locations(poke_id, location_id) values ((SELECT id FROM Pokemon WHERE name = 'pikachu'), (SELECT id FROM Locations WHERE name = 'Viridian Forest'));

INSERT INTO Types_Strength(strong_id, weak_id) values ((SELECT id FROM Types WHERE name = 'Fire'), (SELECT id FROM Types WHERE name = 'Grass'));
INSERT INTO Types_Strength(strong_id, weak_id) values ((SELECT id FROM Types WHERE name = 'Grass'), (SELECT id FROM Types WHERE name = 'Water'));
INSERT INTO Types_Strength(strong_id, weak_id) values ((SELECT id FROM Types WHERE name = 'Water'), (SELECT id FROM Types WHERE name = 'Fire'));
INSERT INTO Types_Strength(strong_id, weak_id) values ((SELECT id FROM Types WHERE name = 'Electric'), (SELECT id FROM Types WHERE name = 'Water'));

