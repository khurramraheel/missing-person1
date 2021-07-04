import React from 'react';
import './postad.css';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

function PostAd(props) {
   let navigate = useNavigate();
   const { register, handleSubmit, watch, errors } = useForm();
   const onSubmit = async (data) => {

      data.id = props.SiteUserReducer.siteUser._id;

      data.missingPic = data.missingPic[0]
      let fm = new FormData();
      for (let item in data) {
         fm.append(item, data[item])
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {

         var crd = pos.coords;

         fm.append('latitude', crd.latitude);
         fm.append('longitude', crd.longitude);

         let resp = await axios.post(window.ip + '/postad', fm);
         navigate('/');

      }, (error) => {

         toast.error("Please allow location to proceed!");

      });

   };
   return <>
      {localStorage.getItem('token') ? <div className='full'>
         <div className='container'>
            <div>
               <center>
                  <h3>Post Ad</h3>
               </center>
            </div>
            <h6 style={{ display: 'none' }} ><input {...register('id')} value={props.SiteUserReducer.siteUser._id} /></h6>

            <div class="div">
               <div class="row">
                  <form onSubmit={handleSubmit(onSubmit)} class="col s12">
                     <div class="row">
                        <div class="input-field col s12">
                           <input id="name" type="text" {...register('missingName')} />
                           <label for="name">Name</label>
                        </div>
                     </div>
                     <div class="row">
                        <div class="input-field col s12">
                           <input id="age" type="number" min="1" {...register('missingAge')} />
                           <label for="age">Age</label>
                        </div>
                     </div>
                     <div class="row">
                        <div class="col s12">
                           <div class="row">
                              <div class="input-field col s12">
                                 <textarea id="description" class="materialize-textarea" {...register('missingDescription')}></textarea>
                                 <label for="description">Description</label>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="row">
                        <div class="file-field input-field">

                           <div class="file-path-wrapper">
                              <input class="file-path validate" type="text" placeholder="Upload Picture" />
                              <div class="btn">
                                 <span>Browse</span>
                                 <input type="file" required {...register('missingPic')} />
                              </div>
                           </div>

                        </div>
                     </div>
                     <center>
                        <button class="btn waves-effect waves-light" type="submit" >Post
                           <i class="material-icons right">send</i>
                        </button>
                     </center>
                  </form>
               </div>
            </div>
         </div>
      </div> :
         navigate('/')

      }
   </>
}
export default connect((myStore) => {
   return myStore;
})(PostAd);