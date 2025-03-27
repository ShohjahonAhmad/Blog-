package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	_ "github.com/lib/pq"

	//"errors"

	"github.com/gin-gonic/gin"
)

type Post struct {
	ID    string `json:"id"`
	Text  string `json:"text"`
	Liked bool   `json:"liked"`
	Date  string `json:"date"`
}

func getPostsHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var result []Post

		rows, err := db.Query("SELECT id, text, liked, date FROM posts")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		for rows.Next() {
			var post Post
			if err := rows.Scan(&post.ID, &post.Text, &post.Liked, &post.Date); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
			result = append(result, post)
		}

		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.IndentedJSON(http.StatusOK, result)
	}
}

func getPostById(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var post Post
		query := "SELECT id, text, liked, date from posts Where id = $1"
		err := db.QueryRow(query, id).Scan(&post.ID, &post.Text, &post.Liked, &post.Date)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"message": "Post not found."})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to retrieve post"})
			return
		}
		c.IndentedJSON(http.StatusOK, post)
	}

}

func likePostHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		liked, ok := c.GetQuery("likedValue")
		if !ok {
			c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Missing likedValue query parameter"})
		}
		var likedBool bool
		if liked == "true" {
			likedBool = true
		} else if liked == "false" {
			likedBool = false
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid likedValue parameter. Use 'true' or 'false'."})
			return
		}
		query := `UPDATE posts SET liked=$1 WHERE id=$2`
		result, err := db.Exec(query, likedBool, id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update post"})
			return
		}
		rowsAffected, err := result.RowsAffected()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check rows affected"})
			return
		}
		if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "Post not found."})
			return
		}

		// Fetch the updated post
		var updatedPost Post
		query = `SELECT id, text, liked, date FROM posts WHERE id = $1`
		err = db.QueryRow(query, id).Scan(&updatedPost.ID, &updatedPost.Text, &updatedPost.Liked, &updatedPost.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated post"})
			return
		}

		c.IndentedJSON(http.StatusOK, updatedPost)
	}
}

func createPostHandler(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var newPost Post
		if err := c.BindJSON(&newPost); err != nil {
			return
		}
		query := `INSERT INTO posts (id, text, liked, date)
				VALUES($1, $2, $3, $4)`
		_, err := db.Exec(query, newPost.ID, newPost.Text, newPost.Liked, newPost.Date)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create post"})
			return
		}
		c.IndentedJSON(http.StatusCreated, newPost)
	}
}

func main() {
	connStr := "postgres://postgres:secret@localhost:5432/gopgtest?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	createTable(db)

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"PUT", "PATCH", "POST", "DELETE", "GET"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))
	router.GET("/posts", getPostsHandler(db))
	router.GET("/posts/:id", getPostById(db))
	router.POST("/posts", createPostHandler(db))
	router.PATCH("/liked/:id", likePostHandler(db))
	router.Run("localhost:8080")

}
func createTable(db *sql.DB) {
	query := `
			CREATE TABLE IF NOT EXISTS posts (
					id VARCHAR(255) PRIMARY KEY,
					text TEXT,
					liked BOOLEAN,
					date VARCHAR(255)
			);
	`
	_, err := db.Exec(query)
	if err != nil {
		log.Fatal(err)
	}
}
