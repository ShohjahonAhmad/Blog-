import Post from "./Post"
import React, {useState, useEffect} from "react"
import { FaUserCircle } from "react-icons/fa";
import "./styles/MainPage.css"

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function MainPage (){
    const [posts, setPosts] = useState([])
    const [post, setPost] = useState("")

    useEffect(() => {
        fetch("http://localhost:8080/posts").then((data) => data.json()).then(data => setPosts(data))
    }, [])

    function handlePostChange(event){
        setPost(event.target.value)
    }

    function createPost(){
        if(post === "" || post.length < 4) return
        let month = months[new Date().getMonth()].toString()
        let day = new Date().getDate().toString()
        let year = new Date().getFullYear().toString()
        let data = {
            id: posts.length.toString(),
            text: post,
            liked: false,
            date: `${month} ${day} ${year}`,  
        }
        setPosts(p => [...p, data])
        setPost("")
        createPostToAPI(data.id, data.text, data.liked, data.date)
    }

    function handlePostLike(likedValue, index) {
        const updatedPosts = posts.map((post, idx) => {
            if (idx === index) {
                likePostToAPI(post.id, likedValue)
                return { ...post, liked: likedValue };
            }
            return post;
        });
        setPosts(updatedPosts);
    }
    return (
        <>
        <div className="main-content-container">
            <div className="post-container">
                        <div className="profile-pic">
                            <FaUserCircle />
                        </div>
                        <div className="content">
                            <textarea placeholder="add your text" maxLength={280} value={post} onChange={handlePostChange}></textarea>
                        </div>   
            </div>
            <div className="button-container">
                <button className="post-button" onClick={createPost}>Post</button>
            </div>
            {posts.map((post, idx) => <Post username="PEACEFUL" date={post.date} key={idx} text={post.text}
                                        onLike={handlePostLike}
                                        initialLiked={post.liked}
                                        idx={idx}/>)}
        </div>
        </>

    )
} 
export default MainPage

async function createPostToAPI(id, text, liked, date){
    const data = {
        id,
        text,
        liked,
        date,
    }
    const result = await fetch("http://localhost:8080/posts", {
        method: "POST",
        header: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    }).then((data) => data.json()).then(data => data)
    console.log(result)
}
async function likePostToAPI(id, likedValue){
    const result = await fetch(`http://localhost:8080/liked/${id}?likedValue=${likedValue}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json", // Important for PATCH requests
        },
    }).then((data) => data.json()).then(data => data)
    console.log(result)
}