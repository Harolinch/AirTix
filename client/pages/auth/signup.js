import { useState } from "react";
import useRequest from '../../hooks/use-request';
import Router from 'next/router';


export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password,
        },
        onSuccess: (data) => Router.push('/')
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        doRequest();
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-8">
                    <form onSubmit={handleSubmit} >
                        <h1>Sign up</h1>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input value={email} onChange={e => setEmail(e.target.value)} type="text" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
                        </div>
                        {errors}
                        <button className="btn btn-primary" >Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}