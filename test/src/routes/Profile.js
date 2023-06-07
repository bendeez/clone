import "./Profile.css"
import Navbar from "./Navbar.js"
import {useEffect,useState,useContext} from "react"
import {Context} from "../Context.js"
import {AiOutlineClose} from "react-icons/ai"
import Post from "./Posts.js"


export default function Profile(){
    const {token,fetchUser,firstName,lastName,profile,cover,profilePosts,notifications} = useContext(Context)
    const [editModal,setEditModal] = useState(false)
    const [profileImage,setProfileImage] = useState("")
    const [coverImage,setCoverImage] = useState("")
    const [highlight,setHighlight] = useState(0)


    useEffect(() => {

    fetchUser()


    },[])
    async function changeProfile(event){



         const formData = new FormData()
         formData.append("file",event.target.files[0])
         const url = "http://127.0.0.1:8000/profile"
         const requestOptions = {
          method: 'PUT',
          headers:{'Authorization': 'Bearer ' + token },
          body:formData
        };


        const response = await fetch(url,requestOptions)
        await fetchUser()






    }
    async function changeCover(event){


         const formData = new FormData()
         formData.append("file",event.target.files[0])
         const url = "http://127.0.0.1:8000/cover"
         const requestOptions = {
          method: 'PUT',
          headers:{'Authorization': 'Bearer ' + token },

          body:formData
        };
        const response = await fetch(url,requestOptions)
        await fetchUser()






    }
    return(
        <div>
            <div className={editModal ? "blur" : ""}>
            <Navbar firstName={firstName} lastName={lastName} profile={profile} cover={cover} notifications={notifications}/>
            {cover === "none" ? (
               <div className="cover">

                </div>


            ):(
               <img src={cover} className="profile-image-cover"/>


            )}

            <img src={profile} className="cover-profile"/>

            <div className="cover-items">
            <p>{`${firstName} ${lastName}`}</p>
            <div className="cover-buttons">
            <button>Add to story</button>
            <button onClick={() => setEditModal(true)}>Edit Profile</button>
            </div>
            </div>
            </div>


            {/*modal*/}
            {editModal && (
                <div className="edit-modal">
                    <div className="edit-modal-header">
                    <p className="edit-title">Edit Profile</p>

                    <AiOutlineClose className="icon1 cursor" onClick={() => setEditModal(false)}/>
                    </div>
                    <div className="edit-profile-picture">
                        <div className="profile-header">
                        <p>Profile Picture</p>
                        <label for="edit-button1" className="edit-button">Edit</label>
                        <input type="file" name="profileImage" id="edit-button1" onChange={changeProfile}/>
                        </div>
                        <img src={profile}/>
                    </div>
                    <div className="edit-cover">
                        <div className="cover-header">
                        <p>Cover Photo</p>
                        <label for="edit-button2" className="edit-button">Add</label>
                        <input type="file" name="coverImage" id="edit-button2" onChange={changeCover}/>

                        </div>
                        {cover === "none" ? (
                        <div className="blank-cover">
                        </div>

                        ):(
                        <img src={cover} className="cover-image"/>

                        )}

                    </div>
            </div>


            )}

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

       {profilePosts && (
          <div className="profile-posts">
                {profilePosts.map(post => (
                 <Post profile={post.profile} user={post.user} date={post.date} text={post.text} photo={post.photo} id={post.id}/>


                ))}
          </div>



       )}
       </div>

        </div>




    )


}