const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let mysqlCon = mysql.createConnection({
  host: "localhost",
  user: "<USERNAME>",
  password: "<PASSWORD>",
  database: "streame",
  multipleStatements: true,
});

mysqlCon.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected.");
});

app.get("/top_songs", (_req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    `SELECT songs.id, songs.title, artists.artist_name, albums.cover_img, songs.youtube_id
    FROM songs
    INNER JOIN albums ON songs.album_id = albums.id
    INNER JOIN artists ON songs.artist_id = artists.id
    ORDER BY songs.likes DESC LIMIT 20;`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.get("/top_artists", (_req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    `SELECT * FROM artists ORDER BY likes DESC LIMIT 20;`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.get("/top_albums", (_req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    `SELECT albums.id, albums.title, artists.artist_name, albums.cover_img
    FROM albums
    INNER JOIN artists ON albums.artist_id = artists.id
    ORDER BY albums.likes DESC LIMIT 20;`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.get("/top_playlists", (_req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    "SELECT * FROM playlists ORDER BY likes DESC LIMIT 20;",
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.get("/song/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    `SELECT songs.id, songs.title, albums.title AS "album_title", artists.artist_name, songs.track_num, albums.cover_img, songs.youtube_id, songs.length, songs.lyrics, songs.created_in, songs.uploaded_at, songs.likes
    FROM songs
    INNER JOIN artists ON songs.artist_id = artists.id
    INNER JOIN albums ON songs.album_id = albums.id
    WHERE songs.id =  ${req.params.id};`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      let song = results[0];
      res.send(song);
    }
  );
});

app.get("/artist/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    `SELECT * FROM artists WHERE id = ${req.params.id};`,
    (error, artistRes) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      let artist = artistRes[0];
      mysqlCon.query(
        `SELECT songs.id, songs.title, artists.artist_name, songs.youtube_id, songs.lyrics, songs.created_in, songs.uploaded_at, songs.likes
        FROM songs 
        INNER JOIN artists_songs ON artists_songs.song_id = songs.id
        INNER JOIN artists ON artists.id = songs.artist_id
	      WHERE songs.id = artists_songs.song_id AND artists_songs.artist_id = ${req.params.id};`,
        (error, songsRes) => {
          if (error) {
            res.send(error.message);
            throw error;
          }
          artist.songs = songsRes;
        }
      );
      mysqlCon.query(
        `SELECT albums.id, albums.title, albums.cover_img, albums.created_in, albums.uploaded_at, albums.likes
          FROM albums 
          JOIN artists_albums 
	        WHERE albums.id = artists_albums.album_id AND artists_albums.artist_id = ${req.params.id};`,
        (error, albumsRes) => {
          if (error) {
            res.send(error.message);
            throw error;
          }
          artist.albums = albumsRes;
          res.send(artist);
        }
      );
    }
  );
});

app.get("/album/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    `SELECT albums.id, albums.title, artists.artist_name, artists.id AS artist_id, albums.cover_img, albums.created_in, albums.uploaded_at, albums.likes
    FROM albums
    JOIN artists ON albums.artist_id = artists.id
    WHERE albums.id = ${req.params.id};`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      let album = results[0];
      mysqlCon.query(
        `SELECT songs.id, songs.title, songs.track_num, songs.youtube_id, songs.lyrics, songs.created_in, songs.uploaded_at, songs.likes
        FROM songs 
        JOIN albums_songs 
        WHERE songs.id = albums_songs.song_id AND albums_songs.album_id = ${req.params.id}
        ORDER BY songs.track_num ASC;`,
        (error, songsRes) => {
          if (error) {
            res.send(error.message);
            throw error;
          }
          album.songs = songsRes;
          res.send(album);
        }
      );
    }
  );
});

app.get("/playlist/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  mysqlCon.query(
    `SELECT playlists.id, playlists.title, playlists.cover_img, users.user_name AS created_by, playlists.created_at, playlists.likes
    FROM playlists
    JOIN users ON playlists.created_by = users.id
    WHERE playlists.id = ${req.params.id};`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      let playlist = results[0];
      mysqlCon.query(
        `SELECT songs.id, songs.title, artists.artist_name, songs.youtube_id, songs.lyrics, songs.created_in, songs.uploaded_at, songs.likes
        FROM songs 
        INNER JOIN playlists_songs ON songs.id = playlists_songs.song_id
        INNER JOIN artists ON songs.artist_id = artists.id
        WHERE songs.id = playlists_songs.song_id AND playlists_songs.playlist_id = ${req.params.id};`,
        (error, songsRes) => {
          if (error) {
            res.send(error.message);
            throw error;
          }
          playlist.songs = songsRes;
          res.send(playlist);
        }
      );
    }
  );
});

app.post("/song", (req, res) => {
  let songData = req.body;
  let songValues = `'${songData.title}', ${songData.artist_id}, ${
    songData.album_id
  }, ${songData.track_num}, '${songData.youtube_link}', '${
    songData.lyrics
  }', '${songData.created_in}', '${formattedDatetime()}'`;
  mysqlCon.query(
    `INSERT INTO songs VALUES (NULL, ${songValues}, 0);`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.post("/album", (req, res) => {
  let albumData = req.body;
  let albumValues = `'${albumData.title}', ${albumData.artist_id}, '${
    albumData.cover_img
  }', '${albumData.created_in}', '${formattedDatetime()}'`;
  mysqlCon.query(
    `INSERT INTO albums VALUES (NULL, ${albumValues}, 0);`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.post("/playlist", (req, res) => {
  let plData = req.body;
  let playlistValues = `'${plData.title}', '${plData.cover_img}', '${
    plData.created_by
  }', '${formattedDatetime()}'`;
  mysqlCon.query(
    `INSERT INTO playlists VALUES (NULL, ${playlistValues}, 0);`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.post("/artist", (req, res) => {
  let artistData = req.body;
  let artistValues = `'${artistData.artist_name}', '${artistData.cover_img}', ${
    artistData.founded_in
  }, '${formattedDatetime()}'`;
  mysqlCon.query(
    `INSERT INTO artists VALUES (NULL, ${artistValues}, 0);`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.put("/song/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(
    `UPDATE songs SET title = ?, artist_id = ?, album_id = ?, track_num = ?, youtube_link = ?, lyrics = ?, created_in = ? WHERE id = ?;`,
    [
      req.body.title,
      req.body.artist_id,
      req.body.album_id,
      req.body.track_num,
      req.body.youtube_link,
      req.body.lyrics,
      req.body.created_in,
      id,
    ],
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.put("/album/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(
    `UPDATE albums SET title = ?, artist_id = ?, cover_img = ?, created_in = ? WHERE id = ?;`,
    [
      req.body.title,
      req.body.artist_id,
      req.body.cover_img,
      req.body.created_in,
      id,
    ],
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.put("/playlist/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(
    `UPDATE playlists SET title = ?, cover_img = ?, created_by = ? WHERE id = ?;`,
    [req.body.title, req.body.cover_img, req.body.created_by, id],
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.put("/artist/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(
    `UPDATE artists SET artist_name = ?, cover_img = ?, founded_in = ? WHERE id = ?;`,
    [req.body.artist_name, req.body.cover_img, req.body.founded_in, id],
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.delete("/song/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(`DELETE FROM artists WHERE id = ${id};`, (error, results) => {
    if (error) {
      res.send(error.message);
      throw error;
    }
    res.send(results);
  });
});

app.delete("/artist/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(`DELETE FROM artists WHERE id = ${id};`, (error, results) => {
    if (error) {
      res.send(error.message);
      throw error;
    }
    res.send(results);
  });
});

app.delete("/album/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(`DELETE FROM albums WHERE id = ${id};`, (error, results) => {
    if (error) {
      res.send(error.message);
      throw error;
    }
    res.send(results);
  });
});

app.delete("/playlist/:id", (req, res) => {
  let id = req.params.id;
  mysqlCon.query(
    `DELETE FROM playlists WHERE id = ${id};`,
    (error, results) => {
      if (error) {
        res.send(error.message);
        throw error;
      }
      res.send(results);
    }
  );
});

app.listen(3001);

formattedDatetime = () => {
  let now = new Date();
  let month = addZero(now.getMonth() + 1);
  let day = addZero(now.getDate());
  let hours = addZero(now.getHours());
  let minutes = addZero(now.getMinutes());
  let seconds = addZero(now.getSeconds());
  let datetimeStr = `${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return datetimeStr;
};

addZero = (n) => {
  return ("0" + n).slice(-2);
};
