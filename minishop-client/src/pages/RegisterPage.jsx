import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {registerUser} from "../services/api";

function RegisterPage(){
    const[name,setName] = useState("");
    const[email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const[adminCode, setAdminCode] = useState("");
    const[error,setError] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(event){
        event.preventDefault();
            try{
                await registerUser(
                    name,email,password,adminCode||null
                );
                navigate("/login");
            }catch(err){
                 setError(err.message);
            }
    }
    return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Admin Code (optional)</label>
          <br />
          <input
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;