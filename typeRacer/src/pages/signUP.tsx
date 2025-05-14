import React, { useState } from 'react';
import { signup } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import AlertMessage from '../components/alertMessage';

const SignUP = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const navigate = useNavigate(); 

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();  // Формагийн submit үйлдлийг таслан зогсооно

        // Form validation
        if (!username || !password) {
            setError("Insert all fields!");
            return;
        }

        try {
            setError('');  // Алдааг цэвэрлэх
            await signup({data: {username: username, password: password}}); // Асинхрон функц дуудаж байгаа
            setSuccessMessage('Амжилттай бүртгүүллээ! Логин руу шилжиж байна...');
            setTimeout(()=>{
                navigate("/login");
            }, 3000)
        } catch (error: any) {
                setError(error.message);
        }
    }
    return (
        <div className='h-screen flex items-center'>
            <div className="h-1/2 w-1/2 bg-secondary mx-auto p-4">
                <img src="/images/login.png" className="mx-auto" />

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit}>
                    <div className='space-y-4 mb-4'>
                        <div className='flex space-x-2 justify-center'>
                            <img src="/images/Customer.png" width={48} />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                name='username'
                                onChange={(e) => setUsername(e.target.value)}
                                className="input p-3 border-0 border-b-4 border-primary focus:outline-none w-1/3"
                            />
                        </div>
                        <div className='flex space-x-2 justify-center'>
                            <img src="/images/password.png" width={42} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                name='password'
                                onChange={(e) => setPassword(e.target.value)}
                                className="input p-3 border-0 border-b-4 border-primary focus:outline-none w-1/3"
                            />
                        </div>

                         {/* Alert Messages */}
                        {error && <AlertMessage message={error} type="error" />}
                        {successMessage && <AlertMessage message={successMessage} type="success" />}
                        <div className='flex justify-center mt-6'>
                            <button className='bg-primary rounded-2xl px-4 py-2 hover:brightness-90'>
                               SIGN UP
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUP;
