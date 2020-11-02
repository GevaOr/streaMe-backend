-- Creating the database
DROP DATABASE IF EXISTS streame;
CREATE DATABASE streame;
USE streame;

-- Creating the tables
DROP TABLE IF EXISTS artist;
CREATE TABLE artists(
id INT AUTO_INCREMENT NOT NULL,
artist_name VARCHAR(100),
cover_img VARCHAR(255),
founded_in YEAR,
uploaded_at DATETIME NOT NULL,
likes INT DEFAULT 0 NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO streame.artists VALUES (NULL, 'Heilung', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Roskilde_Festival_Heilung-4.jpg/1280px-Roskilde_Festival_Heilung-4.jpg', '2014', '2020-10-07 12:30:00', 100);
INSERT INTO streame.artists VALUES (NULL, 'Bell Witch', 'https://www.revolvermag.com/sites/default/files/styles/image_750_x_420/public/media/images/article/bell-witch-band_2_0.jpg?itok=pX01hGUG&timestamp=1544482114', '2010', '2020-10-07 12:31:00', 55);

DROP TABLE IF EXISTS albums;
CREATE TABLE albums(
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(100) NOT NULL,
artist_id INT NOT NULL,
cover_img VARCHAR(255),
created_in YEAR,
uploaded_at DATETIME NOT NULL,
likes INT DEFAULT 0 NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (artist_id) REFERENCES artists(id)
);

INSERT INTO streame.albums VALUES (NULL, 'Mirror Reaper', 2, 'https://upload.wikimedia.org/wikipedia/en/d/d7/Mirror_Reaper_%282017%29_cover.jpg', '2017', '2020-10-07 12:31:45', 0);
INSERT INTO streame.albums VALUES (NULL, 'Futha', 1, 'https://t2.genius.com/unsafe/818x0/https%3A%2F%2Fimages.genius.com%2F797100e51bce7d157618f2fb8420388b.1000x1000x1.jpg', '2019', '2020-10-07 12:30:45', 25);

DROP TABLE IF EXISTS songs;
CREATE TABLE songs(
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(255),
artist_id INT NOT NULL,
album_id INT NOT NULL,
track_num INT NOT NULL DEFAULT 1,
youtube_id VARCHAR(100),
length VARCHAR(100),
lyrics VARCHAR(512),
created_in YEAR NOT NULL,
uploaded_at DATETIME NOT NULL,
likes INT DEFAULT 0 NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (artist_id) REFERENCES artists(id),
FOREIGN KEY (album_id) REFERENCES albums(id)
);

INSERT INTO streame.songs VALUES (NULL, 'Galgaldr', 1, 2, 1, 'm62iekbg9eo', "10:22", 'Brœðr munu berjask ok at bönum verðask, munu systrungar sifjum spilla', '2019','2020-10-07 12:30:45', 20);
INSERT INTO streame.songs VALUES (NULL, 'Narupo', 1, 2, 2, '64CACoHNBEI', "6:36", 'Fé vældr frænda róge føðesk ulfr í skóge Úr er af illu jarne opt løypr ræinn á hjarne', '2019','2020-10-07 12:30:46', 255);
INSERT INTO streame.songs VALUES (NULL, 'Othan', 1, 2, 3, 'zzteYM2Xv0M', "10:19", 'Hariuha laþu laukar gakar alu ole lule laukar', '2019','2020-10-07 12:30:47', 88);
INSERT INTO streame.songs VALUES (NULL, 'Mirror Reaper', 2, 1, 1, '4DKUgXlotbI', "1:23:16", 'Drying the water Anchor me in ice Mirror of the reaper The arrow of my eyes', '2017','2020-10-07 12:35:00', 97);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
id INT AUTO_INCREMENT NOT NULL,
user_name VARCHAR(255),
email VARCHAR(255),
created_at DATETIME NOT NULL,
user_password VARCHAR(128),
is_admin BOOLEAN DEFAULT FALSE,
preferences JSON,
remember_token VARCHAR(128),
PRIMARY KEY (id)
);

INSERT INTO streame.users VALUES (NULL,'newUser', 'user@example.com', '2020-10-06 12:30:00', 'myPassword', FALSE, NULL, NULL);
INSERT INTO streame.users VALUES (NULL,'newerUser', 'falseUser@example.com', '2020-10-06 12:35:00', 'newPassword', TRUE, NULL, NULL);

DROP TABLE IF EXISTS playlists;
CREATE TABLE playlists(
id INT AUTO_INCREMENT NOT NULL,
title VARCHAR(255),
cover_img VARCHAR(255),
created_by INT,
created_at DATE NOT NULL,
likes INT DEFAULT 0 NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (created_by) REFERENCES users(id)
);

INSERT INTO streame.playlists VALUES (NULL, 'Very Good Playlist', "https://images.unsplash.com/photo-1559799536-95e03ae1db1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60", 2, '2020-10-07 20:30:00', 2);

DROP TABLE IF EXISTS artists_albums;
CREATE TABLE artists_albums(
id INT AUTO_INCREMENT NOT NULL,
artist_id INT,
album_id INT,
PRIMARY KEY (id),
FOREIGN KEY (artist_id) REFERENCES artists(id),
FOREIGN KEY (album_id) REFERENCES albums(id)
);

INSERT INTO streame.artists_albums VALUES (NULL, 1, 2);
INSERT INTO streame.artists_albums VALUES (NULL, 2, 1);

DROP TABLE IF EXISTS artists_songs;
CREATE TABLE artists_songs(
id INT AUTO_INCREMENT NOT NULL,
artist_id INT,
song_id INT,
PRIMARY KEY (id),
FOREIGN KEY (artist_id) REFERENCES artists(id),
FOREIGN KEY (song_id) REFERENCES songs(id)
);

INSERT INTO streame.artists_songs VALUES (NULL, 1, 1);
INSERT INTO streame.artists_songs VALUES (NULL, 1, 2);
INSERT INTO streame.artists_songs VALUES (NULL, 1, 3);
INSERT INTO streame.artists_songs VALUES (NULL, 2, 4);

DROP TABLE IF EXISTS user_playlists;
CREATE TABLE user_playlists(
id INT AUTO_INCREMENT NOT NULL,
user_id INT,
playlist_id INT,
PRIMARY KEY (id),
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);

INSERT INTO streame.user_playlists VALUES (NULL, 2, 1);

DROP TABLE IF EXISTS playlists_songs;
CREATE TABLE playlists_songs(
id INT AUTO_INCREMENT NOT NULL,
playlist_id INT,
song_id INT,
PRIMARY KEY (id),
FOREIGN KEY (playlist_id) REFERENCES playlists(id),
FOREIGN KEY (song_id) REFERENCES songs(id)
);

INSERT INTO streame.playlists_songs VALUES (NULL, 1, 2);
INSERT INTO streame.playlists_songs VALUES (NULL, 1, 4);

DROP TABLE IF EXISTS albums_songs;
CREATE TABLE albums_songs(
id INT AUTO_INCREMENT NOT NULL,
album_id INT,
song_id INT,
PRIMARY KEY (id),
FOREIGN KEY (album_id) REFERENCES albums(id),
FOREIGN KEY (song_id) REFERENCES songs(id)
);

INSERT INTO streame.albums_songs VALUES (NULL, 1, 4);
INSERT INTO streame.albums_songs VALUES (NULL, 2, 1);
INSERT INTO streame.albums_songs VALUES (NULL, 2, 2);
INSERT INTO streame.albums_songs VALUES (NULL, 2, 3);