import React from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import M from 'materialize-css';
import './signup.css';
export default function SignUp() {
  function clear(){
    document.getElementById('reg-form').reset()
  }
  const { register, handleSubmit} = useForm();
  const onSubmit = async (data) =>{ 
    console.log(data)
    let resp = await axios.post(window.ip+'/signup',data);
    var signupModal=M.Modal.init(document.getElementById('modal2'),{});
    signupModal.close();
    clear();
  };
  return<div className="container-signup modal" id="modal2" >
    <div className="row">
        <form onSubmit={handleSubmit(onSubmit)} className="col s12" id="reg-form">
          <div className="row">
            <div className="input-field col s12">
              <input id="name" type="text" className="validate" required {...register('name')} />
              <label for="name">Name</label>
            </div>
          </div> 

          <div className="row">
            <div className="input-field col s12">
              <input id="email" type="email" className="validate" required {...register('email')} />
              <label for="email">Email</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input id="password" type="password" className="validate" minlength="6" required  {...register('password')}/>
              <label for="password">Password</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col s12">
              <input id="contact" type="tel" name="contact" placeholder="03127654321" pattern="[0-9]{11}" className="validate" required  {...register('contact')}/>
              <label for="contact">Contact No.</label>
            </div>
          </div>
          
          <div className="row">
            <div className="input-field col ">
              <button className="btn btn-large btn-register waves-effect waves-light" type='submit'>Sign Up</button>
            </div>
          </div>
        </form>
      </div>
    </div>   
}