import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  Button,Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment'

import './Profiili.css';
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'

import { Error, CheckEmptyFields,handleInputChange } from '../Utils/Functions';
import { useCookies } from 'react-cookie';

//Renderöidään profiilin muokkaus
const ProfiiliMuokkaus = () => {
  //Muuttujat
  const [profileFirstLoad, setProfileFirstLoad] = useState(0);
  const [email, setEmail] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [cities, setCities] = useState([]);

  const [message, setMessage] = useState("");

  const [profileLocation, setProfileLocation] = useState([]);
  const [profileOrders, setProfileOrders] = useState([]);
  const [modifyUserObject, setModifyUserObject] = useState("");
  
  const [cookies] = useCookies(['token']);

  let navigate = useNavigate();
  function redirect() {
    //navigate("/Profiili");
  }

   // get user profile data
   const getProfileData = async () => {
      const options = {
        method: 'GET',
        headers: {"Authorization": `Bearer ${cookies.token}`}
      }

      const result = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/user",options)
      //const posts = await getProfilePostsService(cookies?.userId);
      if (result?.status == "Error") {
        setMessage(result.message);
      }
      else{
        var i = await result.json();

        setEmail(i?.email);
        setPhoneNumber(i?.phonenumber);
        setFirstName(i.firstName);
        setLastName(i.lastName);
        setProfileLocation(i?.location);
        setProfileOrders(i?.orders);
        setCityId(i?.location?.cityId);
        setAddress(i?.location?.address);
        setPostalCode(i?.location?.postalCode);
        // setProfileData(i);
        // setProfileLocation(i?.location);
        // setProfileOrders(i?.orders);
      }
    }

    const GetTableData = async () => {
      try{
        const options = {
          method: 'GET'
        }
        if(cities.length == 0){
          var i = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Cities",options);
          var data = await i.json();
          setCities(data);
        }
      }
      catch{
        setMessage("Error");
      }
    }
  
     // get user profile data
     const modifyProfileData = async () => {
      const options = {
        method: 'GET',
        headers: {"Authorization": `Bearer ${cookies.token}`}
      }
  
      const result = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/user",options)
      //const posts = await getProfilePostsService(cookies?.userId);
      if (result?.status == "Error") {
        setMessage(result.message);
      }
      else{
        var i = await result.json();

        setEmail(i?.email);
        setPhoneNumber(i?.phonenumber);
        setProfileLocation(i?.location);
        setProfileOrders(i?.orders);
        // setProfileData(i);
        // setProfileLocation(i?.location);
        // setProfileOrders(i?.orders);
      }
    }
  
    useEffect( async ()=>{
      if(CheckEmptyFields([modifyUserObject])){
        const options = {
          method: 'PUT',
          headers: {'Content-Type': 'application/json' ,"Authorization": `Bearer ${cookies.token}`},
          body:JSON.stringify(modifyUserObject)
        }
    
        const result = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/user",options);
        //const posts = await getProfilePostsService(cookies?.userId);
        if (result?.status == "Error") {
          setMessage(result.message);
        }
        else{
          navigate("/Profiili");
        }
      }
      else{

      }
    },[modifyUserObject]);

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

  const citiesToSelect = cities.map((e,i)=>{
    return(<option value={e.id}>{e.cityName}</option>);
  });

   // hakee taulukkodatat sivun ladatessa
   useEffect(() => {
    if (profileFirstLoad == 0) {
      GetTableData();
      getProfileData();
      setProfileFirstLoad(1);
    }
  }, []);

  return (
    <div className="Profiili-Main">
      <div className="Profiili-UpperPartMain">
        <div className="Profiili-Esittely">
          <h1 className="Profiili-NimiOtsikko"> {firstName}</h1>
            {message}
          <div>
            <h4>Yhteystiedot</h4>
            <Form.Group controlId="formBasicEtunimi">
              <Form.Label>Etunimi:</Form.Label>
              <Form.Control onBlur={(e)=>{handleInputChange(e)}} value={firstName} placeholder="Etunimi"onChange={(e)=>{setFirstName(handleInputChange(e));}}/>
            </Form.Group>
            <Form.Group controlId="formBasicSukunimi">
              <Form.Label>Sukunimi:</Form.Label>
              <Form.Control onBlur={(e)=>{handleInputChange(e)}} value={lastName} placeholder="Sukunimi"onChange={(e)=>{setLastName(handleInputChange(e));}}/>
            </Form.Group>
            <p>Sähköposti: {email}</p>
            <Form.Group controlId="formBasicPuhelinnumero">
              <Form.Label>Puhelinnumero:</Form.Label>
              <Form.Control onBlur={(e)=>{handleInputChange(e)}} value={phoneNumber} placeholder="Puhelinnumero"onChange={(e)=>{setPhoneNumber(handleInputChange(e));}}/>
            </Form.Group>
          </div>

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
        </div>

        {/* Asetukset osio */}
        <div className="Profiili-valikko">
          <h2>Asetukset</h2>
         <div><a href="/ProfiiliMuokkaus">Muokkaa profiilia</a></div> 
         
         <div> <Button variant="dark"  type="Button" onClick={()=>{navigate("/Profiili");}}>Peruuta</Button></div> 
         <div> 
           <Button variant="dark"  type="Button" onClick={() => { setModifyUserObject({
                firstname: firstName,
                lastname: lastName,
                phonenumber: phoneNumber,
                password:"0",
                location:{
                  address:address,
                  postalCode:postalCode,
                  houseNumber:houseNumber
                }
            }) }}>Tallenna</Button></div> 
        </div>
      </div>
      <div>
        <div>
          {/* TODO: Tähän kaupungin autofill ja hae kaupungit backendista*/}
          <Form.Group controlId="formBasicCity">
          <select value={cityId} onChange={(e)=>{setCityId(e.target.value);}}>
            <option value="">Valitse kaupunki</option>
            {citiesToSelect}
          </select>
          </Form.Group>
          <Form.Group controlId="formBasicAddress">
            <Form.Label>Osoite:</Form.Label>
            <Form.Control placeholder="Osoite" value={address} onChange={(e)=>{setAddress(e.target.value);}}/>
          </Form.Group>
          <Form.Group controlId="formBasicPhonenumber">
            <Form.Label>Postinumero:</Form.Label>
            <Form.Control placeholder="Postinumero" value={postalCode} onChange={(e)=>{setPostalCode(e.target.value);}}/>
          </Form.Group>
          <Form.Group controlId="formBasicHouseNumber">
            <Form.Label>Talonnumero:</Form.Label>
            <Form.Control placeholder="Talonnumero" value={houseNumber} onChange={(e)=>{setHouseNumber(e.target.value);}}/>
          </Form.Group>
        </div>
        <p>Jee ala osa profiilia</p>
      </div>
    </div>
  );
}


export { ProfiiliMuokkaus };