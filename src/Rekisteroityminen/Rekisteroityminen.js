import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import './Rekisteroityminen.css'
import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie';

//Renderöi rekisteröitymissivun
const Rekisteroityminen = ()=>{
    const [loading, setLoading] = useState(false);
    const password = useFormInput('');
    const passwordAgain = useFormInput('');
    const firstName = useFormInput('');
    const lastName = useFormInput('');
    const email = useFormInput('');
    const phonenumber = useFormInput('');
    const [message, setMessage] = useState(null);
    const [cookies,setCookie] = useCookies(['loginModal']);
    //TODO: Avaa kirjautuminen
    let navigate = useNavigate();
    //Kutsutaan rekisteröitymisen backendiä
    useEffect( async()=>{
         if(loading != false){
          let post = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Authenticate/register", {
            
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({password: password.value,  firstName: firstName.value, lastName: lastName.value,email:email.value , phonenumber: phonenumber.value})
            });
            let tarkistus = await post.json();
            if(tarkistus.type != ""){
              setMessage(tarkistus.title);
            } 
            if(tarkistus.status =="Error")setMessage(tarkistus.message);
            else{
              setMessage("Käyttäjän luonti onnistui!");
              //navigate("/");
              setCookie('loginModal', "true", { path: '/' ,expires: 0});
              window.location.reload();
            }
            setLoading(false);
         }
        
    },[loading]);

return(
<div className="Registering-Main-Container"> 
  <div>
    <h2>Rekisteröityminen</h2>
  <Form>

    <Form.Group controlId="formBasicName">
      <Form.Label>Etunimi</Form.Label>
      <Form.Control   placeholder="Etunimi"{...firstName}/>
    </Form.Group>

    <Form.Group controlId="formBasicName">
      <Form.Label>Sukunimi</Form.Label>
      <Form.Control   placeholder="Sukunimi" {...lastName}/>
    </Form.Group>

    <Form.Group controlId="formBasicPassword">
      <Form.Label>Salasana</Form.Label>
      <Form.Control type="password" placeholder="Salasana"{...password}/>
    </Form.Group>

    <Form.Group controlId="formBasicPassword">
      <Form.Label>Salasana uudestaan</Form.Label>
      <Form.Control type="password" placeholder="Salasana uudestaan"{...passwordAgain}/>
    </Form.Group>

    <Form.Group controlId="formBasicEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email"  placeholder="Email" {...email}/>
    </Form.Group>

    <Form.Group controlId="formBasicPhonenumber">
      <Form.Label>Puhelinnumero</Form.Label>
      <Form.Control placeholder="Puhelinnumero"{...phonenumber}/>
    </Form.Group>
    <Button  variant="dark outline-secondary" onClick={()=>{if(passwordAgain.value == password.value){
      setLoading(true)}
      else
      {
        setMessage("Salasanat eivät täsmää");
      }
      }} disabled={loading} >Rekisteröidy</Button><br />

  </Form>
  <p>Salasanan pitää olla vähintään 8 merkkiä pitkä, sisältää isoja kirjaimia, erikoismerkkejä ja numeroita</p>
  <p>Onko sinulla jo käyttäjä. Voit kirjautua sisään  <a onClick={()=>{setCookie('loginModal', "true", { path: '/' ,expires: 0});window.location.reload();}}>Täältä</a> </p>
    <Error message={message}/>
  </div>
</div>
  )
}
const Error=(props)=>{
return(<p className="errorText">{props.message}</p>)
}
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
export {Rekisteroityminen}