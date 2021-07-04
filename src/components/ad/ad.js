import React, { useEffect, useState } from 'react';
import axios from "axios";
import { connect } from 'react-redux';
import NavBar from '../header/navbar';
import GoogleMapReact from 'google-map-react';


import './ad.css';
// import { EventBusy } from '@material-ui/icons';

import { Facebook } from 'react-sharingbuttons';
import 'react-sharingbuttons/dist/main.css'

const Marker = ({ text }) => <div>
  <img className="marker" src="/images/marker.png" /></div>;

function Card(props) {
  // console.log(props)
  let [card, setCard] = useState({ location: { latitude: undefined, longitude: undefined } });
  let [contact, setContact] = useState();
  let id = window.location.href.split('/')[4];

  const sharingButtons = () => {
    const url = window.location.protocol + "//" + window.location.host + "/detail/" + id
    // const url = 'https://github.com/caspg/react-sharingbuttons'
    const shareText = 'Check this site!'

    return (
      <div>
        <Facebook className='btncolor' url={url} shareText={shareText} />
      </div>
    )
  }

  useEffect(() => {
    async function test() {
      let resp = await axios.post(window.ip + '/detail/' + id)
      console.log(resp)
      setCard({ ...resp.data, comments: resp.data.comments.reverse() });
      setContact(
        resp.data.referenceId.contact
      )
    }
    test();
  }, [])
  return <div>
    <NavBar />
    <div className="row">
      <div className="col s3">


        <div class="card adjust-flex">
          <div class="card-image">
            <img src={`/${card.mPersonPic}`} />
            <span class="card-title"><span>Name: </span>{card.mPersonName}</span>
          </div>
          <div class="card-content">
            <p><span>Description: </span>{card.mPersonDescription}</p>
            <p><span>Target Contact: </span>{(card.referenceId || {}).contact}</p>
          </div>
          <div class="card-action">
            <a><span>Age: </span>{card.mPersonAge}</a>
            <div class="share-btn btncolor" >
              <div >{sharingButtons()}</div>
            </div>
            {/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && <a href={"tel:" + contact} >
              <img className="phone-icon" src="/phone.png" />
            </a>
            }
          </div>

          {props.SiteUserReducer.siteUser._id ? <div>

            <div className="comment">
              <textarea type="text" placeholder="Enter your comment here..">

              </textarea>
              <div className='text-right'>
                <a href="#" className="post-comment-btn" onClick={async (evt) => {

                  evt.preventDefault();

                  let comment = {
                    id: card._id,
                    from: props.SiteUserReducer.siteUser._id,
                    message: evt.target.parentNode.previousElementSibling.value
                  };

                  let resp = await axios.post('/post_comment', comment);
                  card.comments.unshift(resp.data);
                  evt.target.parentNode.previousElementSibling.value = "";

                  setCard({ ...card });

                }}>Send</a>
              </div>
            </div>

            {(card.comments || []).map((item) => {

              return <div className="comment-row">
                <div className="row">
                  <div className="col s12 m12 c-title">
                    {item.from.name}
                    <span className="f-left">
                      {
                        new Date().toDateString() == new Date(item.date).toDateString() ? new Date(item.date).toLocaleTimeString() : new Date(item.date).toDateString()
                      }
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col s12 m12">
                    {item.message}
                  </div>
                </div>
              </div>

            })}

          </div> : null}



        </div>
      </div>

      <div className="col s8">
        <div style={{ width: '800px', height: '800px' }}>
          {card.location.latitude ? <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyDhElCEQpfCMHGiMqGB7Ys8ynnHO1mldrs' }}
            defaultCenter={{
              lat: +card.location.latitude,
              lng: +card.location.longitude
            }}
            defaultZoom={15}
            yesIWantToUseGoogleMapApiInternals

          >
            <Marker
              lat={card.location.latitude}
              lng={card.location.longitude}
              text="My Marker"
            />

          </GoogleMapReact> : null}
        </div>
      </div>
    </div>
  </div>
}
export default connect((myStore) => {
  return myStore;
})(Card);