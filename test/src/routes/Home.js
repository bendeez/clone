import "./Home.css"
import Navbar from "./Navbar.js"
import {FaUserFriends} from "react-icons/fa"
import {IoStorefrontSharp} from "react-icons/io5"
import {MdGroups2,MdAmpStories} from "react-icons/md"
import {HiComputerDesktop} from "react-icons/hi2"
import {BsFillCameraReelsFill} from "react-icons/bs"
import {useState,useEffect,useContext} from "react"
import {AiOutlineClose} from "react-icons/ai"
import {useNavigate} from "react-router-dom"
import {Context} from "../Context.js"
import Post from "./Posts.js"
export default function Home(){
    const [highlight,setHighlight] = useState(0)
    const [modal,setModal] = useState(false)
    const [post,setPost] = useState({text:"",file:null})
    const navigate = useNavigate()
    const {token,fetchUser,firstName,lastName,profile,cover,recentPost,notifications,friends} = useContext(Context)
    const [photoAdded,setPhotoAdded] = useState(false)

    useEffect(() => {

    fetchUser()

    },[])
    async function togglePostSubmit(event){
        event.preventDefault()
        const formData = new FormData()

        if(post.file !== null){
            formData.append("file",post.file)
        }

        formData.append("text",post.text)

        const url = "http://127.0.0.1:8000/post"
        const requestOptions = {
          method: 'POST',
          headers:{'Authorization': 'Bearer ' + token },
          body: formData
        };
        const response = await fetch(url,requestOptions)
        setPost({text:"",file:null})
        setModal(false)
        setPhotoAdded(false)
        fetchUser()

    }
    function togglePostChange(event){
        const {files,value,name,type} = event.target
        if(files){
            setPost(Post => (
               {...Post,[name]:files[0]}
            ))
            setPhotoAdded(true)
        }else{
            setPost(Post => (
                {...Post,[name]:value}
            ))


        }



    }

    return(
    <div >

        <div className={modal && "blur"}>
        <Navbar firstName={firstName} lastName={lastName} profile={profile} cover={cover} notifications={notifications}/>
        <div className="home">

            {/*sidebar*/}
            <div className="sidebar">
                <div className="link" onClick={() => navigate("/profile")}>
                 <img src={profile}/>
                  <p>{`${firstName} ${lastName}`}</p>
                  </div>
                  <div className="link">
                    <FaUserFriends className="icon1"/>
                    <p>Find friends</p>
                  </div>
                  <div className="link">
                    <IoStorefrontSharp className="icon1"/>
                    <p>Marketplace</p>
                  </div>
                  <div className="link">
                    <MdGroups2 className="icon1"/>
                    <p>Groups</p>
                  </div>
                  <div className="link">
                  <HiComputerDesktop className="icon1"/>
                  <p>Watch</p>

                  </div>

            </div>


            {/*posts*/}
            <div className="home-middle">
            <div className="stories">
                <div className="stories-top">

                <div className={highlight === 0 ? "topic highlight" : "topic"} onClick={() => setHighlight(0)}>
                    <MdAmpStories className="icon1"/>
                    <p>Stories</p>
                </div>
                <div className={highlight === 1 ? "topic highlight" : "topic"} onClick={() => setHighlight(1)}>
                    <BsFillCameraReelsFill className="icon1"/>
                    <p>Reels</p>
                    </div>
                </div>
                <div className="create">
                    <div className="create-story">
                        <div className="create-story-container">
                        <div className="story-image-container">
                        <img src={profile}/>
                        </div>
                        <p>Create story</p>
                        </div>
                    </div>
                    <div className="words">
                        <p>Share everyday moments with friends and family.</p>
                        <p>Stories disappear after 24 hours.</p>
                        <p>Replies and reactions are private.</p>
                    </div>
                </div>
            </div>

            <div className="post">

                    <img src={profile} />
                    <div className="post-message" onClick={() => setModal(true)}>
                        <p>{`What is on your mind, ${firstName}?`}</p>


                    </div>

            </div>

                   {recentPost && (
                        <Post profile={recentPost.profile} user={recentPost.user} date={recentPost.created} text={recentPost.text} photo={recentPost.photo} id={recentPost.id}/>



                   )}

        </div>


        {/*contacts*/}
        <div className="contacts">
            <span>Contacts</span>
            {friends && (
            friends.map(friend => (
                <div className="friends" onClick={() => navigate("/user/"+friend.id)}>
                    <img src={friend.profile} />
                    <p>{friend.user}</p>
                </div>


            ))

            )}
        </div>



        </div>





    </div>


    {/*modal*/}
     {modal && (
          <div className="create-post">
               <div className="post-header">
             <span>Create Post</span>
             <div onClick={() => setModal(false)}>
             <AiOutlineClose className="post-close"/>
             </div>
             </div>

             <div className="create-post-profile">
                 <img src={profile} />
                 <p>{`${firstName} ${lastName}`}</p>

             </div>
             <form onSubmit={togglePostSubmit}>
             <textarea placeholder={`What is on your mind, ${firstName}?`} required value={post.text} onChange={togglePostChange} name="text"></textarea>
             <label for="addPhoto" className="add-photo">{photoAdded ? "Photo Added" : "Add Photo"}</label>
             <input type="file" name="file" id="addPhoto" onChange={togglePostChange}/>
             <button>Post</button>
             </form>
        </div>


        )}

    </div>

    )


}