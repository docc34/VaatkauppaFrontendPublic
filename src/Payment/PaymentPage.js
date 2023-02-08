import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {  Button,Form,Tabs,Tab,Spinner } from 'react-bootstrap';

import {CheckEmptyFields, Paypal,handleInputChange} from '../Utils/Functions';
import './PaymentPage.css';
import { Error } from '../Utils/Functions';

import '@inovua/reactdatagrid-community/index.css'
import { useCookies } from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import {MakeShoppingCartItem} from '../Utils/Functions';
import {ResponsePage} from './ResponsePage';

function PaymentPage() {
  //#region 
  const search = useLocation().search;
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState("");
  const [loggedIn, setLoggedIn] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationObject, setLocationObject] = useState("");
  const [houseNumber, setHouseNumber] = useState("");

  const [tabKey, setTabKey] = useState("0");
  
  const [houseNumberPut, setHouseNumberPut] = useState("");
  const [postalCodePut, setPostalCodePut] = useState("");
  const [addressPut, setAddressPut] = useState("");
  const [cityPutId, setCityPutId] = useState("");
  const [locationObjectPut, setLocationObjectPut] = useState("");
  const [currentLocationId, setCurrentLocationId] = useState("");
  const [guid, setGuid] = useState("");
  
  const [putEnabled, setPutEnabled] = useState(true);
  const [paypalResponseObject, setPaypalResponseObject] = useState("");
  const [order, setOrder] = useState("");
  const [price, setPrice] = useState("");
  const [register, setRegister] = useState(false);
  
  const [cities, setCities] = useState([]);
  let navigate = useNavigate();
  //const Id = new URLSearchParams(search).get('id');
  const urlTabKey = new URLSearchParams(search).get('tabKey');
  const [cookies,setCookie,removeCookie] = useCookies(['token']);
  //var x = CheckEmptyFields(["Post number"], [Id]);
  //#endregion
  const GetJobPosts = async () => {
    if(posts == "" && cookies?.shoppingCart != null){
      try{
          const options = {
            method: 'GET',
            headers: {"Authorization": `Bearer ${cookies.token}`}
          }

          //En ole varma tarvitaanko tätä enää
          // if(cookies?.currentLocationId != 0 && cookies?.currentLocationId != null && cookies?.currentLocationId != undefined ){
          //   //Jos käyttäjällä ei ole käyttäjätiliä mutta sijainti on jo annettu aikaisemmin ja on vielä cookiessa tallella.
          //   var check = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Locations/"+cookies?.currentLocationId,options);
          //   var i = await check.json();
          //   if(i.status != "Error") {
          //     setPostalCodePut(i.postalCode);
          //     setAddressPut(i.address);
          //     setCityPutId(i.cityId);
          //     setCookie('currentLocationId', i.id, { path: '/'});
          //     // setCurrentLocationId(i.id);
          //     setLoggedIn(3);
              
          //     if(urlTabKey != null)setTabKey(urlTabKey.toString());
          //   }
          //   else{
          //     setMessage("Error");
          //   }
            
          // }
          // else{
            var guid = cookies?.Guid != undefined ? cookies?.Guid : null;
            var check = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Locations/user/"+ guid,options);
            var i = await check.json();

            if(i.status == "UserError" || i == null) {
              //Tila käyttäjälle joka ei ole kirjautunut sisään 
              setLoggedIn(1);
              console.log(1)
            }
            else if(i.status == "LocationError") {
              setLoggedIn(2);
            }
            else{
              setPostalCodePut(i.postalCode);
              setHouseNumberPut(i.houseNumber);
              setAddressPut(i.address);
              setCityPutId(i.cityId);
              setCookie('currentLocationId', i.id, { path: '/Maksu'});
              
              setCurrentLocationId(i.id);
              setLoggedIn(3);
              
              if(urlTabKey != null)setTabKey(urlTabKey.toString());
            }
            
          // }
          //Hakee julkaisut ostoskorin sisällön mukaan, keho ottaa listan juilkaisujen ideitä [2,4] jne
          const fetchPosts = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Posts/ShoppingCart",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(cookies?.shoppingCart)
          });
          let post = await fetchPosts.json();
          
          
          if(post.status == "Error" || fetchPosts.status == 400){
            setMessage(post?.message);
            setPosts([]);
          }
          else{ 
            setPosts(post);
            var orderItems = post.map((e,i)=>{
              return{
                PostId:e?.id,
                Amount:1
              }//TODO: laita tähän tuotteiden määrä kun otat sen käyttöön.
            });
  
            var price = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Orders/price",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(orderItems)
            });
            setPrice( await price.json());
            var guid = cookies.Guid != undefined && cookies.Guid != null ? cookies.Guid : guid;
            if(guid != null && guid != ""){
              setTabKey("1");
            }
        }
      }
      catch(e){
        console.log(e);
      }
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

  useEffect(async() => {
    if(putEnabled == false && CheckEmptyFields([locationObjectPut])){
      try{
        const options = {
          method:'PUT',
          headers: { 'Content-Type': 'application/json' ,"Authorization": `Bearer ${cookies.token}`},
          body:JSON.stringify(locationObjectPut)
        }
        var locationId = cookies.currentLocationId != undefined && cookies.currentLocationId != null ? cookies.currentLocationId : currentLocationId;
        let answer = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Locations/"+ locationId,options);
        let parsedAnswer = await answer.json();

        if(parsedAnswer?.status != "Error"){
          setMessage(parsedAnswer?.message);
          setPutEnabled(true);
        }
        else{
          setMessage(parsedAnswer?.message);
        }
      }
      catch{
        setMessage("Error");
      }
    }
  }, [locationObjectPut]);

  useEffect(async() => {
    if(locationObject != "" && CheckEmptyFields([locationObject])){
      if(register == true){
        try{const options = {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify(locationObject)
        }
        let answer = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Locations",options);
        let parsedAnswer = await answer.json();
  
        if(parsedAnswer?.status != "Error"){
          setMessage(parsedAnswer?.message);

          if(parsedAnswer?.message == "Location created succesfully")window.location.reload();

          else if(parsedAnswer?.message == "User created succesfully"){
            setCookie('loginModal', "true", { path: '/' ,expires: 0});window.location.reload();
          }

        }
        else{
          setMessage(parsedAnswer?.message);
        }}
        catch{
          setMessage("Error");
        }
      }
      else if(register == false){
        try{
          const options = {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify(locationObject)
          }
          let answer = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Locations",options);
          let parsedAnswer = await answer.json();

          if(parsedAnswer?.status != "Error"){
            // setCookie('userEmail', locationObject.user.email, { path: '/Maksu'});
            // setCookie('userFirstname', locationObject.user.firstname, { path: '/Maksu'});
            // setCookie('userLastname', locationObject.user.lastname, { path: '/Maksu'});
            //Tallenetaan sijainnin luonnin yhteydessä luotu guid cookiehen ja paikalliseen muuttujaan koska cookiet eivät ole jostainsyysä luotettavia
            setGuid(parsedAnswer.guid);
            setCurrentLocationId(parsedAnswer.locationId);
            setCookie('Guid', parsedAnswer.guid, { path: '/Maksu' });
            setCookie('currentLocationId', parsedAnswer.locationId, { path: '/Maksu'});
            //Haetaan postit uudestaan että saadaan juuri luotu sijainnin id talteen 
            //TODO: palauta sijainninluonnissa guid ja tallenna cookieen. Poista jobpostien haku
            setTabKey("1");
            //TODO:Lisää ilmoitus että tiedot tallennettu            
          }
          else{
            setMessage(parsedAnswer?.message);
          }
        }
        catch{
          setMessage("Error");
        }
      }
      
    }
  }, [locationObject]);
  
  useEffect(async () => {
    await GetJobPosts();
    await GetTableData();
  }, []);

  const citiesToSelect = cities.map((e,i)=>{
    return(<option value={e.id}>{e.cityName}</option>);
  });

  const RecieveOrder = (object)=>{
    //TODO: Määritä että paypal maksu on mennyt läpi
    if(object != null && object != undefined){
      setPaypalResponseObject(object);
      setTabKey("2");
      //Tyhjentää ostoskorin ostoksen jälkeen
      //TODO: Ota käyttöön
      //removeCookie('shoppingCart',{ path: '/' });
    }
  }

  //Aktivoituu kun paypal maksu menee läpi ja luo tilauksen
  useEffect(async ()=>{
    var locationId = cookies.currentLocationId != undefined && cookies.currentLocationId != null ? cookies.currentLocationId : currentLocationId;
    var Guid = cookies.Guid != undefined && cookies.Guid != null && cookies.Guid != "" ? cookies.Guid : guid;
    if(paypalResponseObject != "" && Guid != undefined && locationId != undefined){
      try{
        var orderItems = posts.map((e,i)=>{
          return{
            PostId:e?.id,
            Amount:1
          }//TODO: laita tähän tuotteiden määrä kun otat sen käyttöön.
        });


        var options = {
        method:'POST',
        headers: { 'Content-Type': 'application/json' ,"Authorization": `Bearer ${cookies.token}`},
        body:JSON.stringify({
          LocationId: locationId,
          OrderItems: orderItems,
          User:{
            Guid: Guid
          }
        })
        }

      let answer = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Orders",options);
      let parsedAnswer = await answer.json();

      if(parsedAnswer?.status == "Error"){
        setMessage(parsedAnswer?.message);
      }
      else{
        options = {
          method:'GET',
          headers: { "Authorization": `Bearer ${cookies.token}`}
        }
        //Post palauttaa Guid:n jolla haetaan juuri luotu order
        answer = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Orders/"+parsedAnswer.guid,options);
        parsedAnswer = await answer.json();
        //Poistetaan cookiet joihin tallennettiin ei kirjautuneen käyttäjän tiedot
        //Voi ottaa käyttöön että poista cookiehin tallennetut sijaintitiedot.
        removeCookie('Guid',{ path: '/Maksu' });
        removeCookie('currentLocationId',{ path: '/Maksu' });
        setOrder(parsedAnswer);
      }

    }
      catch(e){
        setMessage("Error");
      }
    }
    else{
      // setMessage("Error");
    }
  },[paypalResponseObject]);



  if(posts != "")
  {
    return (
      <div className='Payment-Page-Main-Container'>
        <div >
          <div>
            <a href="/Kauppa">Takaisin kauppaan</a>
          </div>

          <Tabs activeKey={tabKey} id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="0" title="Tilaustiedot" disabled>
              <h3>Ostoskori</h3>
              <MakeShoppingCartItem shoppingCart={true} data={posts} />
              {/* TODO: Laita tietojen anto/Maksaminen vaiheistettuun tabiin */}
              {loggedIn == 1 || loggedIn == 2 ?(
              <div className='Form-Address-Data-Container'>
                {/* TODO: Tähän kaupungin autofill ja hae kaupungit backendista*/}
                <Form.Group controlId="formBasicCity">
                </Form.Group>
                <Form.Group controlId="formBasicAddress">
                  <Form.Label>osoite</Form.Label>
                  <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Osoite"onChange={(e)=>{setAddress(handleInputChange(e));}}/>
                </Form.Group>
                <Form.Group controlId="formBasicPhonenumber">
                  <Form.Label>Postinumero</Form.Label>
                  <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Postinumero"onChange={(e)=>{setPostalCode(handleInputChange(e));}}/>
                </Form.Group>
                <Form.Group controlId="formBasicHouseNumber">
                  <Form.Label>Talonnumero</Form.Label>
                  <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Talonnumero"onChange={(e)=>{setHouseNumber(handleInputChange(e));}}/>
                </Form.Group>
                <Form.Group controlId="formBasicCity">
                  <Form.Label>Kaupunki</Form.Label>
                  <select onBlur={(e)=>{handleInputChange(e)}} onChange={(e)=>{setCityId(handleInputChange(e));}}>
                    <option value="">Valitse kaupunki</option>
                    {citiesToSelect}
                </select>
                </Form.Group>

              </div>):null}

              {/* Jos on kirjautunut mutta ei ole vielä antanut osoitetietoja */}
              {loggedIn == 2 ?(<Button variant="dark"  onClick={()=>{setLocationObject({
                userId:cookies.userId,
                cityId:cityId,
                address:address,
                postalCode:postalCode,
                houseNumber:houseNumber,
                user: null,
                orderItems:cookies?.shoppingCart
                });}}>Tallenna</Button>): null}

              {/* Jos ei ole kirjautunut */}
              {loggedIn == 1?
              (<div>                
                <div className='Form-User-Data-Container'>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Etunimi</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Etunimi" onChange={(e)=>{setFirstName(handleInputChange(e)); }}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicName">
                    <Form.Label>Sukunimi</Form.Label>
                    <Form.Control  onBlur={(e)=>{handleInputChange(e)}} placeholder="Sukunimi" onChange={(e)=>{setLastName(handleInputChange(e)); }}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="email"  placeholder="Email" onChange={(e)=>{setEmail(handleInputChange(e));}}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPhonenumber">
                    <Form.Label>Puhelinnumero</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Puhelinnumero"onChange={(e)=>{setPhonenumber(handleInputChange(e));}}/>
                  </Form.Group>

                  <label htmlFor='setRegisterInput'>Haluatko luoda käyttäjän tilauksen yhteydessä</label>

                  <input id="setRegisterInput" type="checkbox" onClick={(e)=>{setRegister(e.target.checked);console.log(e.target.checked)}}/>
                  {register == true ? (
                  <div>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Salasana</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="password" placeholder="Salasana"onChange={(e)=>{setPassword(handleInputChange(e)); }}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPasswordAgain">
                      <Form.Label>Salasana uudestaan</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="password" placeholder="Salasana uudestaan"onChange={(e)=>{setPasswordAgain(handleInputChange(e));}}/>
                    </Form.Group>
                    <p>Salasanan pitää olla vähintään 8 merkkiä pitkä, sisältää isoja kirjaimia, erikoismerkkejä ja numeroita</p>
                  </div>) : (null)}
                  <Error message={message}/>
                </div>

                <Button variant="dark" onClick={()=>{
                  if(register == true){
                    if(passwordAgain == password){
                      setLocationObject({
                        userId:"0",
                        cityId:cityId,
                        address:address,
                        postalCode:postalCode,
                        houseNumber:houseNumber,
                        user:{
                          password: password,  
                          firstname: firstName,
                          lastname: lastName,
                          email:email, 
                          phonenumber: phonenumber
                        }
                      });
                      }
                      else
                      {
                        setMessage("Salasanat eivät täsmää");
                      }
                  }
                  else{
                    setLocationObject({
                      userId:"0",
                      cityId:cityId,
                      address:address,
                      postalCode:postalCode,
                      houseNumber:houseNumber,
                      user:{ 
                        password:"0",  
                        firstname: firstName,
                        lastname: lastName,
                        email:email, 
                        phonenumber: phonenumber
                      }
                  })
                  }}} >Tallenna</Button>

              </div>) : null}

                {/* Jos on kirjautunut ja on sijaintitiedot */}
              {loggedIn == 3 ?
              (<div>
                  <p>Tarkasta että osoitetiedot ovat oikein</p>
                  <Button variant="dark"  disabled={!putEnabled} onClick={()=>{setPutEnabled(false);}}>Muokkaa tietoja</Button>
                  <Button variant="dark"  disabled={putEnabled} onClick={()=>{setPutEnabled(true);}}>Peruuta</Button>
                  <div>
                    {/* TODO: Tähän kaupungin autofill. */}
                    <Form.Group controlId="formBasicCity">

                    </Form.Group>
                    <Form.Group controlId="formBasicAddress">
                      <Form.Label>osoite</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} disabled={putEnabled}value={addressPut}placeholder="Osoite"onChange={(e)=>{setAddressPut(handleInputChange(e));}}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPhonenumber">
                      <Form.Label>Postinumero</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} disabled={putEnabled} value={postalCodePut}placeholder="Postinumero"onChange={(e)=>{setPostalCodePut(handleInputChange(e));}}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicHouseNumber">
                      <Form.Label>Talonnumero</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} disabled={putEnabled} value={houseNumberPut}placeholder="Talonnumero"onChange={(e)=>{setHouseNumberPut(handleInputChange(e));}}/>
                    </Form.Group>
                    <select disabled={putEnabled} value={cityPutId} onBlur={(e)=>{handleInputChange(e)}} onChange={(e)=>{setCityPutId(handleInputChange(e));}}>
                      <option value="">Valitse kaupunki</option>
                      {citiesToSelect}
                    </select>
                    <Button variant="dark"  disabled={putEnabled} type='Button' onClick={()=>{setLocationObjectPut({
                      Id:cookies.currentLocationId != undefined && cookies.currentLocationId != null ? cookies.currentLocationId : currentLocationId,
                      userId:cookies.userId,
                      cityId:cityPutId,
                      address:addressPut,
                      postalCode:postalCodePut,
                      houseNumber:houseNumberPut
                    });}}>Tallenna</Button>
                  </div>

                <Button variant="dark"  onClick={()=>{setTabKey("1")}}>Maksamaan</Button>
              </div>) : null}
            </Tab>
            
            <Tab eventKey="1" title="Maksaminen" disabled>
              <h3>Maksaminen</h3>
              <p>Tässä paypal sandbox tunnukset millä voi testata maksamista Email: sb-xybis7895175@personal.example.com Password: +^ChjA@9</p>
              <div className="container mt-5 p-3 rounded cart">
                <div className="row no-gutters">
                      <div className="col-md-8">
                          <div className="product-details mr-2">
                              <div className="d-flex flex-row align-items-center"><i className="fa fa-long-arrow-left"></i><span className="ml-2">Maksaminen</span></div>
                              <hr/>
                              <h6 className="mb-0">Ostoskori</h6>
                              <div className="d-flex justify-content-between"><span>Sinulla on {posts?.length} tuotetta ostoskorissa</span>
                                  {/* <div className="d-flex flex-row align-items-center"><span className="text-black-50">Sort by:</span>
                                      <div className="price ml-2"><span className="mr-1">price</span><i className="fa fa-angle-down"></i></div>
                                  </div> */}
                              </div>
                              <MakeShoppingCartItem shoppingCart={true} data={posts} />
                          </div>
                      </div>
                      <div className="col-md-4">
                          <div className="payment-info">
                              <div className="d-flex justify-content-between align-items-center">
                                <span>Card details</span>
                              </div>
                              <Paypal recieveOrder={RecieveOrder} posts={posts} token={cookies.token} guid={cookies.Guid != undefined && cookies.Guid != null ? cookies.Guid : guid}/>
                              <hr className="line"/>
                                {/* TODO:Hae tähän tuotteiden oikea veroprosentti */}
                              <div className="d-flex justify-content-between information"><span>Verot</span><span>24%</span></div>

                              <div className="d-flex justify-content-between information"><span>Kokonaishinta</span><span>{price}€</span></div>
                          </div>
                      </div>
                  </div>
              </div>
              {/* <div>
                {checkout ? (
                    <Paypal posts={posts} token={cookies.token}/>
                ):(
                <Button variant="dark"  onClick={()=>{setCheckout(true);}}>Checkout</Button>
                )}
              
              </div> */}
            <Button variant="dark"  onClick={()=>{setTabKey("0")}}>Peruuta</Button>
            {/* TODO: */}
            <p>HUOM POISTA OIKEALLE NAPPI </p>
            <Button variant="dark"  onClick={()=>{setTabKey("2")}}>Oikealle</Button>
            </Tab>
            <Tab eventKey="2" title="Tilaus valmis" disabled>
              <ResponsePage price={price} posts={posts} order={order} paypalResponseObject={paypalResponseObject} />
            {/* TODO: */}
            <p>HUOM POISTA VASEMMALLE NAPPI </p>
            <Button variant="dark"  onClick={()=>{setTabKey("1")}}>Vasemmalle</Button>
            </Tab>
          </Tabs>
          <div>
          </div>
        </div>
      </div>
    );
  }
  else{
    return(<div>
    {message != "" ? 
    (
      <p>{message}</p>
    ): cookies?.shoppingCart == null ?
    (
      <p>Shoppingcart was empty</p>
    ): 
    (
      <Spinner  animation="border" /> 

    )}
    

    </div>)
  }
}

export { PaymentPage };