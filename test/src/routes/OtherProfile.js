import {useState,useEffect,useContext} from "react"
import {useParams} from "react-router-dom"
import {Context} from "../Context.js"
import Navbar from "./Navbar.js"
import Post from "./Posts.js"
export default function OtherProfile(){
    const {id} = useParams()
    const [user,setUser] = useState()
    const [posts,setPosts] = useState()
    const {token,firstName,lastName,profile,fetchUser,notifications} = useContext(Context)
    const [highlight,setHighlight] = useState(0)
    useEffect(() => {
      async function fetchProfile(){
           const url = "http://127.0.0.1:8000/user/" + id
           const requestOptions = {
           method: 'GET',
           headers: { 'Content-Type': 'application/json','Authorization': 'Bearer ' + token }

        };
        const response = await fetch(url,requestOptions)
        const data = await response.json()
        if(data){
        setUser(data.user)
        setPosts(data.posts)
        }








      }


      fetchUser()
      fetchProfile()


    },[])
    async function sendRequest(){
           const url = "http://127.0.0.1:8000/request/" + id
           const requestOptions = {
           method: 'POST',
           headers: { 'Content-Type': 'application/json','Authorization': 'Bearer ' + token }

        };
        const response = await fetch(url,requestOptions)

    }
    return(
    <div>
    {user && posts && (
         <div>

            <Navbar firstName={firstName} lastName={lastName} profile={`/${profile}`} notifications={notifications}/>
            {user.cover === "none" ? (
               <div className="cover">

                </div>


            ):(
               <img src={`/${user.cover}`} className="profile-image-cover"/>


            )}
            <div className="otherprofile">
            <img src={`/${user.profile}`} className="cover-profile" onClick={() => console.log(user.profile)}/>

            <div className="cover-items">
            <p>{user.user}</p>



            </div>
            <button onClick={sendRequest}>Add Friend</button>
            </div>





            {/*navbar*/}
            <div className="profile-navbar">
                <p className={highlight === 0 && "highlight"} onClick={() => setHighlight(0)}>Posts</p>
                <p className={highlight === 1 && "highlight"} onClick={() => setHighlight(1)}>About</p>
                <p className={highlight === 2 && "highlight"} onClick={() => setHighlight(2)}>Friends</p>
                <p className={highlight === 3 && "highlight"} onClick={() => setHighlight(3)}>Photos</p>
                <p className={highlight === 4 && "highlight"} onClick={() => setHighlight(4)}>Videos</p>
            </div>

             {/*posts*/}
       <div className="profile-posts-container">
       <div>
       </div>

       {posts.length > 0 && (
          <div className="profile-posts">
                {posts.map(post => (
                 <Post profile={`/${user.profile}`} user={user.user} date={post.date} text={post.text} photo={post.photo} id={post.id}/>


                ))}
          </div>



       )}
       </div>
       </div>







    )
    }
    </div>

    )


}