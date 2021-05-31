import React, { useEffect, useState } from 'react';
import './updateAd.css';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UpdateAd(props) {
   let id=window.location.href.split('/')[4]
   console.log(props);
   let navigate = useNavigate();
   let [updatevalues,setUpdateValues]= useState({});
   useEffect(async()=>{
      let resp = await axios.post(window.ip+'/updatevalues', {id});
      console.log(resp);
      setUpdateValues(resp.data)
   },[]);

console.log(updatevalues);
   const { register, handleSubmit, watch, errors } = useForm();
   const onSubmit = async (data) => {
      let cData = {...updatevalues, ...data}
      if(cData.missingPic && cData.missingPic.length!=0){
         cData.missingPic = cData.missingPic[0];
      }
      
      let fm = new FormData();
      for (let item in cData) {
         fm.append(item, cData[item])
         console.log(item, data[item])
      }
      let resp = await axios.post(window.ip+'/updatead', fm);
      navigate('/')
   };
   return <> 
      { localStorage.getItem('token') ? <div className='full'>
         <div className='container'>
            <div>
               <center>
                  <h3>Update Ad</h3>
               </center>
            </div>
            <h6 style={{ display: 'none' }} ><input  value={id} {...register('id')}/></h6>
            <div class="div">
               <div class="row">
                  <form onSubmit={handleSubmit(onSubmit)} class="col s12">
                     <div class="row">
                        <div class="input-field col s12">
                           <input id="name" type="text"  defaultValue={updatevalues.mPersonName}  
                           onChange={(evt)=>{
                              setUpdateValues({
                                 ...updatevalues,
                                 [evt.target.name]: evt.target.value,
                              })
                              }}
                              {...register('missingName')}
                              />
                        </div>
                     </div>
                     <div class="row">
                        <div class="input-field col s12">
                           <input id="age" type="number" min="1"  defaultValue={updatevalues.mPersonAge}  
                           onChange={(evt)=>{
                              setUpdateValues({
                                 ...updatevalues,
                                 [evt.target.name]: evt.target.value,
                              })
                              
                              }}
                              {...register('missingAge')}
                           />
                           
                        </div>
                     </div>
                     <div class="row">
                        <div class="col s12">
                           <div class="row">
                              <div class="input-field col s12">
                                 <textarea id="description" class="materialize-textarea"   defaultValue={updatevalues.mPersonDescription}  
                                 onChange={(evt)=>{
                              setUpdateValues({
                                 ...updatevalues,
                                 [evt.target.name]: evt.target.value,
                              })
                              
                              }}
                              {...register('missingDescription')}
                              ></textarea>
                                 
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="row">
                        <div class="file-field input-field">

                           <div class="file-path-wrapper">
                              <input class="file-path validate" type="text" defaultValue={updatevalues.mPersonPic}   />
                              <div class="btn">
                                 <span>Browse</span>
                                 <input type="file"  defaultValue={updatevalues.mPersonPic} 
                                 onChange={(evt)=>{
                              setUpdateValues({
                                 ...updatevalues,
                                 [evt.target.name]: evt.target.value,
                              })
                              
                              }}
                              {...register('missingPic')} 
                              />
                              </div>
                           </div>

                        </div>
                     </div>
                     <center>
                        <button class="btn waves-effect waves-light" type="submit" >Update
                        <i class="material-icons autorenew">autorenew</i>
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
   })(UpdateAd);