import React, {useState, useEffect, useRef} from "react";


export default function Post(props){
    //later aPost would be props.post
    //post type are: open discussion/blog post/testimonies
    //extra issermon/church jotter
    //another is short punchy qouataions, downloadable as img with pdf, editable/customizable img backgrounds
   
   //consider options of adding sub notes, e.g sub-heads, sub-notes
    const aPost = {
        uniqueID: '008890', //use date strings
        title: 'Making the most of my Youth',
        type: 'disscussion', category: "", // e.g faith, sacrifice, God's Love, etc....
        content: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go ~~Joshua 1:9",
        poster: 'OluwaBlessing',
        timeStamp: {date: '', time: ''},
        reactions: {likeIDs: [], dislikes: [], reshared: []}, //userid are passed in
        comments: [] //{userID, comments,}
    }

    const [showPost, setPost] = useState(aPost)

    //return full post details
    return(<>
    <div className="postView">
        <h4>{showPost.title}</h4>
        <strong>@ {showPost.poster}</strong>
        <div>{showPost.content}</div>
    </div>
    </>)
}