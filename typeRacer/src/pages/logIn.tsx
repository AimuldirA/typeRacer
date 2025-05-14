import React, { useState } from 'react';
import { login } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/alertMessage';
import { useAuthStatus } from '../hooks/checkAuts';


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage]=useState<string>('');
    const navigate = useNavigate();
    const { refreshAuth } = useAuthStatus();

    const handleSubmit = async (event:React.FormEvent) =>{
        event.preventDefault();

    if(!username || !password){
        setError("Insert all fields!");
        return;
    }
    try {
        setError('');  // Алдааг цэвэрлэх
        await login({data: {username: username, password: password}})
        setSuccessMessage('Амжилттай нэвтэрлээ!');
        await refreshAuth();
        navigate('/');
    } catch (error: any) {
        setError(error.message);
         }

    setError('');
    }

    return (
        <div className='h-screen flex items-center'>
            <div className="h-1/2 w-1/2 bg-secondary mx-auto p-4">
                <img src="/images/login.png" className="mx-auto"/>
                {/* Sign Up Form */}
                <form onSubmit={handleSubmit}>
                    <div className='space-y-4  mb-4'>
                        <div className='flex space-x-2 justify-center'>
                                <img src="/images/Customer.png" width={48} />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e)=> setUsername(e.target.value)}
                                className="input p-3 border-0 border-b-4 border-primary focus:outline-none w-1/3"/>
                        </div>
                        <div className='flex space-x-2 justify-center'>
                                <img src="/images/password.png" width={42}/>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                className="input p-3 border-0 border-b-4 border-primary focus:outline-none w-1/3"/>
                        </div>

                         {/* Alert Messages */}
                         {error && <AlertMessage message={error} type="error" />}
                        {successMessage && <AlertMessage message={successMessage} type="success" />}
                        <div className='flex justify-center mt-6'>
                            <button className='bg-primary rounded-2xl px-4 py-2 hover:brightness-90'>
                               LOG IN
                            </button>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
      ) 
}

export default Login;

