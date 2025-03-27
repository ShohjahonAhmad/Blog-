import { FaUserCircle } from "react-icons/fa";
import React, {useState} from "react";
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io";

import "./styles/Post.css"
function Post(props){
    const [liked, setLiked] = useState(props.initialLiked || false); // Use initialLiked prop
    const handleLike = () => {
        const newLiked = !liked;
        setLiked(newLiked);
        props.onLike(newLiked, props.idx)
    };
    return (<>
        <div className="post-container">
            <div className="profile-pic">
                <FaUserCircle />
            </div>
            <div className="content">
                <h3 className="username">{props.username} <span className="date">{props.date}</span></h3>
                <p className='text'>{props.text}</p>
                {liked ? (
                        <IoIosHeart className="like" onClick={handleLike} />
                    ) : (
                        <IoIosHeartEmpty className="like" onClick={handleLike} />
                    )}
            </div>
        </div>
    </>);
}
export default Post