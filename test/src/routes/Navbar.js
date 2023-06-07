import "./Navbar.css"
import {AiOutlineHome} from "react-icons/ai"
import {FaUserFriends} from "react-icons/fa"
import {HiComputerDesktop} from "react-icons/hi2"
import {MdGroups2} from "react-icons/md"
import {SiYoutubegaming} from "react-icons/si"
import {FiMenu} from "react-icons/fi"
import {TbMessage2} from "react-icons/tb"
import {IoNotifications} from "react-icons/io5"
import {useState,useContext} from "react"
import {IoSettingsSharp} from "react-icons/io5"
import {GiHelp} from "react-icons/gi"
import {BsFillMoonFill} from "react-icons/bs"
import {RiFeedbackFill} from "react-icons/ri"
import {GrLogout} from "react-icons/gr"
import {useNavigate,Link} from "react-router-dom"
import {Context} from "../Context.js"
export default function Navbar({firstName,lastName,profile,notifications}){
    const [highlight,setHighlight] = useState(0)
    const [account,setAccount] = useState(false)
    const [search,setSearch] = useState("")
    const [results,setResults] = useState()
    const [showNotifications,setShowNotifications] = useState(false)
    const [showRequests,setShowRequests] = useState(0)
     const {token,friendRequests,fetchUser} = useContext(Context)
    const navigate = useNavigate()
    function toggleChange(index){
        setHighlight(index)
        

    }
    function logout(){
        localStorage.removeItem("token")
        navigate("/login")


    }
    async function searchChange(event){
        setSearch(event.target.value)
        const url = "http://127.0.0.1:8000/search/" + event.target.value
         const requestOptions = {
          method: 'GET',
          headers:{'Content-Type': 'application/json','Authorization': 'Bearer ' + token }

        };


        const response = await fetch(url,requestOptions)
        const data = await response.json()
        setResults(data)


    }
    async function accept(id){
        const url = "http://127.0.0.1:8000/acceptfriendrequest/" + id
         const requestOptions = {
          method: 'POST',
          headers:{'Content-Type': 'application/json','Authorization': 'Bearer ' + token }

        };


        const response = await fetch(url,requestOptions)
        fetchUser()
    }
      async function decline(id){
        const url = "http://127.0.0.1:8000/acceptfriendrequest/" + id
         const requestOptions = {
          method: 'DELETE',
          headers:{'Content-Type': 'application/json','Authorization': 'Bearer ' + token }

        };


        const response = await fetch(url,requestOptions)
        fetchUser()
    }

    return(
        <div className="navbar">
            <div className="navbar-left">
            <img src="https://1000logos.net/wp-content/uploads/2021/04/Facebook-logo-768x480.png" onClick={() => navigate("/")}/>
            <input placeholder="Search Facebook" onChange={searchChange} value={search}/>
            </div>
            <div className="icons">
                <div className={highlight === 0 ? "icon highlight" : "icon"} onClick={() => toggleChange(0)}>
                <AiOutlineHome />
                </div>
                <div className={highlight === 1 ? "icon highlight" : "icon"} onClick={() => toggleChange(1)}>
                <FaUserFriends/>
                </div>
                <div className={highlight === 2 ? "icon highlight" : "icon"} onClick={() => toggleChange(2)}>
                <HiComputerDesktop />
                </div>
                <div className={highlight === 3 ? "icon highlight" : "icon"} onClick={() => toggleChange(3)}>
                <MdGroups2 />
                </div>
                <div className={highlight === 4 ? "icon highlight" : "icon"} onClick={() => toggleChange(4)}>
                <SiYoutubegaming />
                </div>

            </div>
            <div className="buttons">
                <div className="button">

                <FiMenu />
                </div>
                <div className="button">
                <TbMessage2 />
                </div>
                <div className="button">
                <IoNotifications onClick={() => setShowNotifications(ShowNotifications => !ShowNotifications)}/>
                {notifications && (
                    <div className="notification-length">
                    {notifications.length + friendRequests.length}
                    </div>
                )}
                </div>
                <div className="button">
                <img src={profile} onClick={() => setAccount(Account => !Account)}/>
                </div>
            </div>

            {account && (
                <div className="profile">
                   <div className="profile-top">
                   <div className="profile-picture" onClick={() => navigate("/profile")}>
                    <img src={profile}/>
                    <p>{`${firstName} ${lastName}`}</p>
                     </div>
                     <p className="blue">See all profiles</p>
                   </div>
                   <div className="settings">
                   <p><IoSettingsSharp/> Settings & privacy</p>
                   <p><GiHelp/> Help & support</p>
                   <p><BsFillMoonFill/> Display and accessibility</p>
                   <p><RiFeedbackFill/> Give feedback</p>
                   <p onClick={logout}><GrLogout/> Logout</p>
                   </div>




                </div>


            )}

            {/*searchmodal*/}
            {search && results && results.length > 0 && (
                    <div className="search">
                    { results.map(result => (
                        <p onClick={() => navigate("/user/" + result.id)}>{result.user}</p>


                    ))}
                    </div>


            )}
            {showNotifications && (
                <div className="notifications">

                    <span className="notification-title">Notifications</span>
                    <div className="notifications-header">
                    <p onClick={() => setShowRequests(0)} className={showRequests === 0 ? "highlight" : ""}>Comments</p>
                    <p onClick={() => setShowRequests(1)} className={showRequests === 1 ? "highlight" : ""}>Friend Requests</p>
                </div>
                    <div className="notification-container">
                        {showRequests === 0  && (notifications ? (
                            notifications.map(notification => (
                                <div className="notification">
                                    <img src={`/${notification.profile}`} />
                                    <div>
                                    <span className="notification-user">{notification.user}</span> commented {notification.text}
                                    <p className="notification-date">{notification.date}</p>
                                    </div>
                                </div>


                            ))

                        ):<p>No notifications are found</p>)}

                        {showRequests === 1 &&
                           (friendRequests ? (
                            friendRequests.map(request => (
                                <div className="notification">
                                <img src={`/${request.profile}`} />

                                <p><span className="notification-user">{request.user}</span> has sent you a friend request</p>
                                <button className="accept" onClick={() => accept(request.id)}>Accept</button>
                                <button className="decline" onClick={() => decline(request.id)}>Decline</button>
                                </div>

                            ))


                        ) : (<p>No notifications are found</p> ))}
                    </div>
                </div>

            )}
        </div>

    )


}