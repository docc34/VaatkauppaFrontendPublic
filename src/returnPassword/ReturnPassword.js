import React, { useEffect, useState } from 'react';
import './ReturnPassword.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import {handleInputChange, Error} from '../Utils/Functions';
import {  Button,Form,Tabs,Tab } from 'react-bootstrap';


import '@inovua/reactdatagrid-community/index.css'

//^Importataan kaikki paketit mitä tarvitaan
import { useCookies } from 'react-cookie';
const ReturnPassword = () => {
    const [message, setMessage] = useState("");
    const [emailObject, setEmailObject] = useState("");
    const [emailTo, setEmailTo] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [returnCode, setReturnCode] = useState("");
    const [passwordObject, setPasswordObject] = useState("");
    const [codeValidated, setCodeValidated] = useState(false);
    const [returnCodeObject, setReturnCodeObject] = useState("");
    
    const [cookies, setCookies,removeCookie] = useCookies(['token']);
    
    useEffect(async()=>{
        if(emailObject != ""){
            try{
                const options = {
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${cookies.token}`}
                }
                var i = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Email/Send?toAddress="+emailObject,options);
                var response = await i.json();
                if(response?.status == "OK"){
                    setMessage(response?.message);
                    setEmailSent(true);
                }
                else{
                    setMessage(response?.message);
                }
            }
            catch{
                setMessage("Error");
            }
        }
    },[emailObject]);

    useEffect(async ()=>{
        if(returnCodeObject != "" && emailSent != false){
            try{
                const options = {
                method: 'GET',
                headers: {"Authorization": `Bearer ${cookies.token}`}
                }
                var i = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Email/Check?Code="+returnCodeObject,options);
                var response = await i.json();
                if(response?.status == "OK"){
                    setMessage(response?.message);
                    setCookies('returnCode', returnCodeObject, { path: '/SalasananPalautus'});
                    setCodeValidated(true);
                    setEmailSent(false);
                    setEmailObject("");
                    window.location.reload();
                }
                else{
                    setMessage(response?.message);
                    
                }
            }
            catch{
                setMessage("Error");
            }
        }
    },[returnCodeObject]);

    useEffect(async ()=>{
        if(passwordObject != ""){
            try{
                const options = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify(passwordObject)
                }
                
                var i = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Email/Change",options);
                var response = await i.json();
                if(response?.status == "OK"){
                    setMessage(response?.message);
                    removeCookie('returnCode',{ path: '/SalasananPalautus' }); 
                    setCookies('loginModal', "true", { path: '/' ,expires: 0});
                    window.location.reload();
                }
                else{
                    console.log(response);
                    setMessage(response?.message);
                }
            }
            catch{
                setMessage("Error");
            }
            
        }
    },[passwordObject]);

    if(emailSent == true && cookies?.returnCode == null || emailSent == true && cookies?.returnCode == undefined || emailSent == true && cookies?.returnCode == ""){
        return (
            <div className="Store-Post-Main-Box">
                <h1> Palauta salasana</h1>
                <p>Anna Sähköpostiisi lähetetty palautus koodi</p>
                <div className='Password-Return-Code-Container'>
                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Koodi</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}}  placeholder="Koodi"onChange={(e)=>{setReturnCode(handleInputChange(e)); }}/>
                    </Form.Group>
                </div>
                <p>Salasanan pitää olla vähintään 8 merkkiä pitkä, sisältää isoja kirjaimia, erikoismerkkejä ja numeroita</p>
                <h4>{message}</h4>

                <input className='Password-Return-Button' type="Button" onClick={()=>{
                    setReturnCodeObject(returnCode.replace(/\s+/g, ''));
                    }
                } value={'Tarkista'} variant="primary"/>
            </div>
        )
    }
    else if(codeValidated == true || cookies?.returnCode != null && cookies?.returnCode != undefined && cookies?.returnCode != ""){
        return (
            <div className="Store-Post-Main-Box">
                <h1> Palauta salasana</h1>
                <p>Anna Uusi salasana</p>
                <div className='Password-Return-Password-Container'>
                    <Form.Group controlId="formBasicPassword">
                    <Form.Label>Salasana</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="password" placeholder="Salasana"onChange={(e)=>{setPassword(handleInputChange(e)); }}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPasswordAgain">
                    <Form.Label>Salasana uudestaan</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="password" placeholder="Salasana uudestaan"onChange={(e)=>{setPasswordAgain(handleInputChange(e));}}/>
                    </Form.Group>
                </div>
                <p>Salasanan pitää olla vähintään 8 merkkiä pitkä, sisältää isoja kirjaimia, erikoismerkkejä ja numeroita</p>
                <h4>{message}</h4>

                <input className='Password-Return-Button' type="Button" onClick={()=>{
                    if(passwordAgain == password){
                        console.log("cookie: "+cookies?.returnCode);
                        console.log("object: "+returnCodeObject);
                        var code = cookies?.returnCode != null && cookies?.returnCode != undefined && cookies?.returnCode != "" ? cookies?.returnCode : returnCodeObject;
                        setPasswordObject({
                            password: password,
                            returnCode: code
                        });
                        }
                        else
                        {
                            setMessage("Salasanat eivät täsmää");
                        }
                    }
                } value={'Tallenna'} variant="primary"/>
            </div>
        )
    }
    else{
        return (
            <div className="Store-Post-Main-Box">
                <h1> Palauta salasana</h1>
                <p>Anna käyttäjätilisi sähköposti</p>
                <div className='Password-Return-Password-Container'>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="email"  placeholder="Email" onChange={(e)=>{setEmailTo(handleInputChange(e));}}/>
                    </Form.Group>
                </div>
                {/* TODO: Lisää ilmoitus että sähköposti on lähetetty ja vaihtoehto lähettää sähköposti uudestaan */}
                {message}
                <Button variant="dark"  className='Password-Return-Button' onClick={()=>{setEmailObject(emailTo)}}>Lähetä gmail</Button>
            </div>)
    }
    
}

export { ReturnPassword }