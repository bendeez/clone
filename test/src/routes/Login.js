import "./Login.css"
import {useState} from "react"
import {AiOutlineClose} from "react-icons/ai"
import {useNavigate} from "react-router-dom"

export default function Login(){
    const [modal,setModal] = useState(false)
    const [login,setLogin] = useState({email:"",password:""})
    const [user,setUser] = useState({firstName:"",lastName:"",email:"",password:"",})
    const navigate = useNavigate()
    function toggleModal(){
        setModal(true)

    }
    function closeModal(){
        setModal(false)

    }
    function toggleLogin(event){
        const {name,value} = event.target
        setLogin(Login => (
            {...Login,[name]:value}

        ))



    }
    function toggleUser(event){
        const {name,value} = event.target
        setUser(User => (
            {...User,[name]:value}

        ))



    }
    async function submitLogin(event){
        event.preventDefault()
        const url = "http://127.0.0.1:8000/login"
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({"email":login.email,"password":login.password})
        };
        const response = await fetch(url,requestOptions)
        const data = await response.json()
        localStorage.setItem("token",data.token)
        navigate("/")

    }
    async function submitUser(event){
        event.preventDefault()
        const url = "http://127.0.0.1:8000/user"
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({"email":user.email,"password":user.password,"first_name":user.firstName,"last_name":user.lastName})
        };
        const response = await fetch(url,requestOptions)


        setModal(false)


    }
    return (
        <div>
        <div className={modal ? "container blur" : "container"}>
            <div className="container-left">
                <h1>facebook</h1>
                <p>Connect with friends and the world around you on Facebook.</p>
            </div>
            <div className="container-right">
                <form className="login" onSubmit={submitLogin}>
                    <input type="email" name="email" placeholder="Email or phone number" value={login.email} onChange={toggleLogin}/>
                    <input type="password" name="password" placeholder="Password" value={login.password} onChange={toggleLogin}/>
                    <button>Log In</button>

                </form>
                <button onClick={toggleModal}>Create New Account</button>


            </div>
            </div>


            {/*modal*/}
            {modal &&
             (
                <div className="modal-container">
                <div className="header">
                    <div>
                    <h1>Sign Up</h1>
                    <p>It’s quick and easy.</p>

                    </div>
                    <div className="closeModal" onClick={closeModal}>
                    <AiOutlineClose/>
                    </div>

                    </div>
                 <form className="createUser" onSubmit={submitUser}>

                    <input type="text" name="firstName" placeholder="First name" onChange={toggleUser}/>
                    <input type="text" name="lastName" placeholder="Last name" onChange={toggleUser}/>

                    <input type="email" name="email" placeholder="Mobile number or email" onChange={toggleUser}/>
                    <input type="password" name="password" placeholder="New Password" onChange={toggleUser}/>
                    <button>Sign Up</button>

                 </form>

                </div>


             )

            }



        </div>

    )



}