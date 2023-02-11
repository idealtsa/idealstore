
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";



const Login = () => {
    const [ loading ,setLoading] = useState(false) 
    const [password, setPassword] = useState(''); //toggle for vission password

    const [email, setEmail] = useState('');


    // Process the form data with next-auth
    const submitHandler = async (data) => {
console.log(email,password)
        //send data to backend
        const result = await signIn('credentials', { // credentials, or google, or facebook etc.
            redirect: false, // redirect to the page where the user was before
            email: email,
            password: password,

        })
console.log(result)
        if (result.error) {
            console.log(result.error);
        } else {
            window.location.href = '/' // redirect to HomePage page after login (suseccfully)
        }

    }
    //================================  User Management  ==================================\\


    return (
        <section className="sectionTwo" id="header">
            <div >
            
             
                <form onSubmit={submitHandler} method={"POST"}>
                    <div>
                        <div >

                            <div >
                                <input
                                 
                                    placeholder=" "
                                    autoComplete="on"
                                    type="email"
                                    name="email"
                                    value={email
                                    }
                                onChange={(e)=>setEmail(e.target.value)}
                                   
                                />
                                <label >Correo electrónico</label>
                                <span ></span>
                                <span >
                                    kkk
                                </span>

                              
                            </div>

                            <div >
                                <input
                                    placeholder=" "
                                    autoComplete="on"
                                    /* value={password}
                                    onChange={(e) => setPassword(e.target.value)} */
                                    onChange={(e)=>setPassword(e.target.value)}
                                    name="password"
                                    value={password}
                                
                                 
                                />
                             
                            
                                
                            </div>

                        </div>
                    </div>
             
                    <div className="d-flex justify-content-center align-items-center">
                        <button
                          
                            type="submit"
                           onClick={()=>submitHandler}
                        >
                           submit
                        </button>
                    </div>

                  
                </form>
           
            </div>
         
        </section>

    );
}

export default Login


