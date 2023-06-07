import {useNavigate} from "react-router-dom"
import "./Posts.css"
import {Context} from "../Context.js"
import {useContext,useState} from "react"
import {AiOutlineSend} from "react-icons/ai"
export default function Post({profile,user,date,text,photo,id}){
    const navigate = useNavigate()
    const {token,fetchUser} = useContext(Context)
    const [comment,setComment] = useState("")
    const [viewComments,setViewComments] = useState(false)
    const [allComments,setAllComments] = useState()
    function commentChange(event){
        setComment(event.target.value)

    }
    async function commentSubmit(event){
        event.preventDefault()
        const url = "http://127.0.0.1:8000/comment/" + id
         const requestOptions = {
          method: 'POST',
          headers:{'Content-Type': 'application/json','Authorization': 'Bearer ' + token },
          body:JSON.stringify({"text":comment})
        };


        const response = await fetch(url,requestOptions)
        const data = await response.json()

        setAllComments(data)

        setComment("")
        setViewComments(true)
        fetchUser()

    }

    async function getComments(){

        const url = "http://127.0.0.1:8000/comments/" + id
         const requestOptions = {
          method: 'GET',
          headers:{'Content-Type': 'application/json','Authorization': 'Bearer ' + token }

        };


        const response = await fetch(url,requestOptions)
        const data = await response.json()

        setAllComments(data)


        setViewComments(true)



    }

    return(
         <div className="recentPost">

                        <div className="recentPost-header" onClick={() => navigate("/profile")}>
                        <img src={profile}/>
                        <p>{user}</p>
                        </div>
                        <p className="date">{date}</p>
                        <p className="text">{text}</p>
                        {photo !== "none" && (
                             <img src={`/${photo}`} className="post-photo"/>

                        )}


                            <form onSubmit={commentSubmit} className="comment-container">
                            <textarea type="text" className="comment" name="comment" value={comment} required placeholder="Write a comment..." onChange={commentChange}></textarea>
                            <button><AiOutlineSend/></button>
                            </form>
                            {viewComments ? <p onClick={() => setViewComments(false)} className="view" >Hide Comments</p> : <p className="view" onClick={getComments}>View Comments</p>}
                            {viewComments && (
                                <div className="show-comment-container">
                                {allComments ? allComments.map(comment => (
                                    <div className="show-comment">
                                        <img src={`/${comment.profile}`}/>
                                        <div className="comment-box">
                                            <p>{comment.user}</p>
                                            <p>{comment.text}</p>
                                        </div>

                                    </div>


                                ))  : (<p className="no-comments">No comments found</p>)}
                                </div>

                            )}
                    </div>


    )



}