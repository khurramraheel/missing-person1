import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import M from 'materialize-css';
import './login.css';
import { connect } from 'react-redux';
import myStore from '../../store/store';
import { toast } from 'react-toastify';

function Login() {
    function clear() {
        document.getElementById('loginForm').reset();
    }

    let [reSettingPassword, setReSettingPassword] = useState(false);
    let [enterPinMode, setEnterPinMode] = useState(false);

    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = async (data) => {
        let resp = await axios.post(window.ip + '/login', data);
        var loginModal = M.Modal.init(document.getElementById('modal1'), {});
        loginModal.close();
        clear();


        if (resp.data.msg == 'User Found') {
            localStorage.setItem('token', resp.data.token);
            localStorage.setItem('userId', resp.data._id);
            myStore.dispatch({
                type: "LOGIN_OK",
                payload: resp.data
            });
        } else if (resp.data.msg == 'User Not Found') {
            alert('Please Type valid User Name OR Password...!');
        }
    };

    return <div id="modal1" class="modal">
        <div className="modal-content">
            <center>
                <div className="container-login">
                    <div className="z-depth-1 grey lighten-4 row" style={{ display: 'inline-block', padding: '32px 48px 0px 48px', border: '1px solid #EEE' }}>

                        <form id='loginForm' onSubmit={handleSubmit(onSubmit)} className="col s12" method="post">
                            <div className='row'>
                                <div className='col s12'>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input className='validate' type='email' name='email' id='email'  {...register('email')} />
                                    <label for='email'>Enter your email</label>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input className='validate' type='password' name='password' id='password' {...register('password')} />
                                    <label for='password'>Enter your password</label>
                                </div>

                            </div>

                            <br />
                            <center>
                                <div className='row'>
                                    <button type='submit' name='btn_login' className='col s12 btn btn-large waves-effect indigo'>Login</button>
                                </div>
                            </center>
                            <div>
                                <a href="#" onClick={() => {

                                    setReSettingPassword(true);

                                }}>Forget Password</a>
                            </div>
                        </form>
                        {
                            reSettingPassword && <div>
                                <div className='row'>
                                    <form onSubmit={(evt) => {

                                        evt.preventDefault();

                                        let emailEntered = document.getElementById('resetEmail').value;

                                        if (emailEntered) {

                                            axios.post("/send_reset_email?email=" + emailEntered).then((resp) => {

                                                if (resp.data.success) {
                                                    toast.success("Please check your email");
                                                    setEnterPinMode(true);
                                                    setReSettingPassword(false);
                                                }

                                            }).catch((resp) => {

                                                // console.log(resp);
                                                toast.error(resp.response.data);

                                                

                                            });


                                        } else {
                                            toast.error("Please enter an email");
                                        }

                                    }}>
                                        <div className='input-field col s12'>
                                            <input placeholder="Enter email" className='validate' type='email' name='resetEmail' id='resetEmail' />
                                        </div>
                                        <button type="submit" className="btn">Send Email</button>
                                    </form>

                                </div>
                            </div>
                        }
                        {
                            enterPinMode && <div>
                                <div className='row'>
                                    <form onSubmit={(evt) => {

                                        evt.preventDefault();

                                        let pinCodeBox = document.getElementById('pinCodeBox').value;
                                        let pinPassword = document.getElementById('userPasswordBox').value;

                                        if (pinPassword.length < 6) {
                                            return toast.error("Password must be atleast  characters long");
                                        }

                                        if (pinCodeBox) {

                                            axios.post("/update-password", {
                                                coupon: pinCodeBox,
                                                password: pinPassword
                                            }).then((resp) => {

                                                if (resp.data.success) {
                                                    toast.success("Password updated");
                                                    setEnterPinMode(false);
                                                }

                                            });

                                        } else {
                                            toast.error("Oops, password could not be updated");
                                        }

                                    }}>
                                        <div className='input-field col s12'>
                                            <input placeholder="Enter New Password" className='validate' type='password' name='userPasswordBox' id='userPasswordBox' />
                                        </div>
                                        <div className='input-field col s12'>
                                            <input placeholder="Enter Pin Code" className='validate' type='text' name='pinCodeBox' id='pinCodeBox' />
                                        </div>
                                        <button type="submit" className="btn">Update Password</button>
                                    </form>

                                </div>
                            </div>
                        }

                    </div>
                </div>

            </center>
        </div>

    </div>
}
export default connect((myStore) => {
    return myStore;
})(Login);
