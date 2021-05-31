import React ,{useEffect} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import './content.css';
import {Link} from 'react-router-dom';


function Cards(props){
  useEffect(async function(){
    let resp = await axios.post(window.ip+'/cards');
    props.setCards(resp.data);
  },[]);

  return <div class="row" style={{alignItems:'center'}}>
    <div class="s12 m7 adjust">
      {
        props.cards.map((card)=>{
          return<div class="card adjust-flex">
            <div class="card-image">
              <Link to={`/detail/${card._id}`} >
                <img  src={`${card.mPersonPic}`}/>
              </Link>
              <span class="card-title"><span>Name: </span>{card.mPersonName}</span>
            </div>
            <div class="card-content">
              <p><span>Description: </span>{card.mPersonDescription}</p>
            </div>
            <div class="card-action">
              <a><span>Age: </span>{card.mPersonAge}</a>
              <span
               style={props.SiteUserReducer.siteUser._id==card.referenceId? {display:'inline'}:{display:'none'}}
                className="waves-effect waves-light btn-small btn modal-trigger btn-del" onClick={async(evt)=>{

                  if(window.confirm("Are you sure you wish to clear the page?")){
                    let data={
                      delId:card.referenceId,
                      delPersonId: card._id
                    }
                    let resp = await axios.post(window.ip+'/delete',data);
                    props.setCards(resp.data);
                    console.log(resp.data);
                  }
                }}>Delete</span>
                <Link to={'/updatead/'+card._id}>
                  <span
                    style={props.SiteUserReducer.siteUser._id==card.referenceId? {display:'inline'}:{display:'none'}}
                    className="waves-effect waves-light btn-small btn modal-trigger btn-del" onClick={async()=>{
                  }}>Edit</span>
                </Link>
            </div>
          </div>
        })
      }
    </div>
  </div>
}

export default connect((myStore)=>{
  return myStore;
})(Cards);