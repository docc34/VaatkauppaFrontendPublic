import React, { useEffect, useState, useRef } from 'react';
import './Profiili.css';

import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { Image, Overlay } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import moment from 'moment'
import {AdminStatus} from '../Utils/Functions'
//Renderöidään perus profiili
function Profiili() {

  const [profileData, setProfileData] = useState([]);
  const [profileLocation, setProfileLocation] = useState([]);
  const [profileOrders, setProfileOrders] = useState([]);
  const [message, setMessage] = useState("");
  // const [show, setShow] = useState(false);
  const target = useRef(null);
  const [cookies] = useCookies(['token']);
  const [adminStatus, setAdminStatus] = useState("");
  // get user profile data
  const getProfileData = async () => {
    const options = {
      method: 'GET',
      headers: {"Authorization": `Bearer ${cookies.token}`}
    }
      //TODO Sivu kaatuu töhön uudella käyttäjällä
      try{
        const result = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/user",options)
        //const posts = await getProfilePostsService(cookies?.userId);
        var i = await result.json();
        
        if (i?.status == "Error") {
          setMessage(i.message);
        }
        else{
          setProfileData(i);
          setProfileLocation(i?.location);
          setProfileOrders(i?.orders);
        }
      }
      catch(e){
        console.log(e);
      }
    //let post = posts.data;

    //setProfilePosts(post);

    // if ( datat?.tiedot?.userInfo == "" || datat?.tiedot == undefined || datat?.tiedot?.length == 0) {
    //   setTimeout(function () { //Aloittaa ajastimen
    //     setShow(true) //Renderöi popupin ajan jälkeen
    //   }.bind(show), 3000)
    // }

  }

  // get user list on page load
  useEffect( async () => {
    await getProfileData();
    setAdminStatus(await AdminStatus({token: cookies?.token}));
  }, []);


  const TitlesOrders = [
    { name: 'id', type: 'number', header: 'id', defaultVisible: false },
    { name: 'price', defaultFlex: 1,type: 'number', header: 'Hinta'},
    {
      name: 'orderDate',
      header: 'Päivämäärä',
      defaultWidth: 165,
      // need to specify dateFormat 
      dateFormat: 'YYYY-MM-DD, HH:mm',
      //filterEditor: DateFilter,
      filterEditorProps: (props, { index }) => {
        // for range and notinrange operators, the index is 1 for the after field
        return {
          dateFormat: 'MM-DD-YYYY, HH:mm',
          placeholder: index == 1 ? 'Created date is before...': 'Created date is after...'
        }
      },
      //Momentjs formats the date
      render: ({ value, cellProps: { dateFormat } }) =>
        moment(value).format(dateFormat),
    },
    { name: 'status', defaultFlex: 1, header: 'Tilauksen tila'}
  ]
  //, border: "none"
  const gridStyleOrders = { height: "auto" }

  // const checkProfileImage = () => {
  //   if (profileData?.image == null || profileData?.image == undefined || profileData?.image == "") {
  //     return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/DefaultImage.png"}></Image>)
  //   }
  //   else {
  //     return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/" + profileData.image}></Image>)
  //   }
  // }

    return (
      <div className="Profiili-Main">
        <div className="Profiili-UpperPartMain">
          <div className="Profiili-Esittely">
            <h1 className="Profiili-NimiOtsikko"> {profileData?.firstName}</h1>

              {/* {checkProfileImage()} */}
              <h3>Yhteystiedot</h3>
              <p> etunimi: {profileData?.firstName}</p>
              <p> sukunimi: {profileData?.lastName}</p>
              <p> email: {profileData?.email}</p>
              <p> puhelinnumero: {profileData?.phonenumber}</p>
              <h3>Osoitetiedot</h3>
              <p> kaupunki: {profileData?.city}</p>
              <p> osoite: {profileLocation?.address}</p>
              <p> postinumero: {profileLocation?.postalCode}</p>
              <p> talonnumero: {profileLocation?.houseNumber}</p>
            </div>
          <div className="Profiili-Tekstit">

          <h3>Tilaukset</h3>
          <ReactDataGrid
            showColumnMenuTool={false}
            rowHeight={25}
            idProperty="id"
            toggleRowSelectOnClick={false}
            //defaultSelected={1}
            //onSelectionChange={(e) => {setSelectedUser(e); IsDeleteButtonDisabled();}}
            style={gridStyleOrders}
            columns={TitlesOrders}
            //defaultFilterValue={UserFilterValue}
            dataSource={profileOrders}
            //enableFiltering={enableFiltering}
            />
            
            {message}
          </div>
          <div className="Profiili-valikko">
            <h2>Asetukset</h2>
            
            <div ref={target}>< a href="/ProfiiliMuokkaus">Muokkaa profiilia</a></div>
            {adminStatus ? (<div ref={target}>< a href="/Julkaisut">Luo julkaisuja</a></div>):null}
            
            {/* <Overlay target={target.current} show={show} placement="left">
              <Tooltip >
                <p>Tee profiilisi loppuun Muokkaa profiilia osiosta.</p>
              </Tooltip>
            </Overlay> */}
          </div>

        </div>
      </div>
    );
  

}

export { Profiili };