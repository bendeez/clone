import {createContext,useState,useEffect} from "react"
import {useNavigate} from "react-router-dom"

export const Context = createContext()

export default function ContextProvider(props){
      const navigate = useNavigate()
      const [recentPost,setRecentPost] = useState()
      const [profilePosts,setProfilePosts] = useState()
      const [firstName,setFirstName] = useState("")
      const [lastName,setLastName] = useState("")
      const [cover,setCover] = useState("")
      const [profile,setProfile] = useState("")
      const [notifications,setNotifications] = useState()
      const [friendRequests,setFriendRequests] = useState()
      const [friends,setFriends] = useState()
      const [token,setToken] = useState(localStorage.getItem("token"))
      async function fetchUser(){
         const urls = ["http://127.0.0.1:8000","http://127.0.0.1:8000/recentpost","http://127.0.0.1:8000/profileposts","http://127.0.0.1:8000/notification","http://127.0.0.1:8000/friendrequests","http://127.0.0.1:8000/friends"]
          const requestOptions = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json','Authorization': 'Bearer ' + token }

        };

        const responses = await Promise.all(
        urls.map(url => fetch(url,requestOptions))
        )
        if(responses.some(response => response.status === 401)){
            navigate("/login")
        }else{
            const data = await Promise.all(
                responses.map(response => response.json())

            )
            setFirstName(data[0].first_name)
            setLastName(data[0].last_name)
            setCover(data[0].cover)
            setProfile(data[0].profile)
            setRecentPost(data[1])
            setProfilePosts(data[2])
            setNotifications(data[3])
            setFriendRequests(data[4])
            setFriends(data[5])












        }



    }



    return <Context.Provider value={{friends,token,fetchUser,firstName,lastName,profile,cover,recentPost,profilePosts,notifications,friendRequests}}>
    {props.children}
    </Context.Provider>




}