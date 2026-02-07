CREATE TABLE Users (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        username VARCHAR UNIQUE,
        hashPass VARCHAR
);
CREATE TABLE Friends (
        user1 INT,
        user2 INT,
        FOREIGN KEY (user1) REFERENCES Users(id),
        FOREIGN KEY (user2) REFERENCES Users(id)
);
CREATE TABLE RapidGames (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        moves TEXT,
        whiteId INT,
        blackId INT,
        winnerId INT,
        gameLink VARCHAR,
        time TIMESTAMP,
        FOREIGN KEY (whiteId) REFERENCES Users(id),
        FOREIGN KEY (blackId) REFERENCES Users(id),
        FOREIGN KEY (winnerId) REFERENCES Users(id)
);
CREATE TABLE BulletGames (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        moves TEXT,
        whiteId INT,
        blackId INT,
        winnerId INT,
        gameLink VARCHAR,
        time TIMESTAMP,
        FOREIGN KEY (whiteId) REFERENCES Users(id),
        FOREIGN KEY (blackId) REFERENCES Users(id),
        FOREIGN KEY (winnerId) REFERENCES Users(id)
);
CREATE TABLE BlitzGames (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        moves TEXT,
        whiteId INT,
        blackId INT,
        winnerId INT,
        gameLink VARCHAR,
        time TIMESTAMP,
        FOREIGN KEY (whiteId) REFERENCES Users(id),
        FOREIGN KEY (blackId) REFERENCES Users(id),
        FOREIGN KEY (winnerId) REFERENCES Users(id)
);
CREATE TABLE RapidRatings(
        whiteRating INT,
        blackRating INT,
        gameId  INT,
        whiteId INT,
        blackId INT,
        FOREIGN KEY (whiteId) REFERENCES Users(id),
        FOREIGN KEY (blackId) REFERENCES Users(id),
        FOREIGN KEY (gameId) REFERENCES RapidGames(id)
);
CREATE TABLE BulletRatings(
        whiteRating INT,
        blackRating INT,
        gameId  INT,
        whiteId INT,
        blackId INT,
        FOREIGN KEY (whiteId) REFERENCES Users(id),
        FOREIGN KEY (blackId) REFERENCES Users(id),
        FOREIGN KEY (gameId) REFERENCES BulletGames(id)
);
CREATE TABLE BlitzRatings(
        whiteRating INT,
        blackRating INT,
        gameId  INT,
        whiteId INT,
        blackId INT,
        FOREIGN KEY (whiteId) REFERENCES Users(id),
        FOREIGN KEY (blackId) REFERENCES Users(id),
        FOREIGN KEY (gameId) REFERENCES BlitzGames(id)
);
