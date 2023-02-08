import React, { useEffect, useState } from 'react';
import './ProductPage.css';

import {  Button, InputGroup, FormControl,  Modal, CardGroup as CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useLocation } from "react-router-dom";

import '@inovua/reactdatagrid-community/index.css'
import { MakePost, Error ,FormatDeliveryEstimateToDate} from '../Utils/Functions';
//^Importataan kaikki paketit mitä tarvitaan

import { useCookies } from 'react-cookie';
const ProductPage = () => {
    const [post, setPost] = useState("");
    const [message, setMessage] = useState("");
    
    const search = useLocation().search;
    const postId = new URLSearchParams(search).get('id');
    const [cookies, setCookie] = useCookies(['token']);
    
    // haetaan ilmoitus julkaisun id:n mukaan
    const getStoreData = async () => {
        try{

            let data = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Posts/"+postId,{
                method: 'GET'
            });
            let post = await data.json();
            if (post?.status == "Error") {
                setMessage(post.message);
            }
            else{
                setMessage("");
                setPost(post);
            }
        }
        catch{
            setMessage("Fatal Error");
        }
    }

    // get user list on page load
    useEffect(() => {
        getStoreData();
    }, []);


    return (
    <div className="Store-Post-Main-Container">
        <h1> {post?.label}</h1>
        <div className="Store-Post-Data-Container">
            <div className="Store-Post-Title-Container">
                <div className='Store-Post-Image-Container'>
                    <img className='Store-Post-Image' src={post?.imageLink}/>
                </div>
                {console.log(post)}
                {
                    post?.price ? (
                        <h4> Hinta: {post?.price}€<br/></h4> 
                    ): (null)
                }
                <Button variant="dark"  onClick={()=>{
                    if(cookies['shoppingCart'] == null || cookies['shoppingCart'] == undefined){
                        setCookie('shoppingCart', [{PostId:post?.id}], { path: '/' })
                    }
                    else{
                        var i = cookies['shoppingCart'];
                        var t = true;
                        i?.map((item,index)=>{
                            if(item?.PostId == post?.id){
                                t = false;
                            }
                        })

                        if(t == true)
                        {
                            i[i.length] ={PostId:post?.id}
                            setCookie('shoppingCart', JSON.stringify(i), { path: '/',expires: 0})
                            window.location.reload();
                        }
                    }}}
                >Lisää ostoskoriin</Button>
            </div>
            <div className='Store-Post-Product-Data-Container'>
                    <h4>Tuotetiedot</h4>
                {
                    post?.description ? (
                        <p> Kuvaus: {post?.description}<br/></p> 
                    ): (null)
                }
                            {
                    post?.size ? (
                        <p> Koko: {post?.size}<br/></p> 
                    ): (null)
                }
                            
                {
                    post?.color ? (
                        <p> Väri: {post?.color}<br/></p> 
                    ): (null)
                }
                {
                    post?.material ? (
                        <p>Materiaali: {post?.material}<br/></p> 
                    ): (null)
                }
                {
                    post?.length ? (
                        <p>Pituus: {post?.length}<br/></p> 
                    ):( null)
                }
                {
                    post?.sleeveLength ? 
                        <p> Hihan pituus: {post?.sleeveLength}<br/></p> 
                    : (null)
                }
                {/* TODO: Tee funktio joka laskee hintaan mukaan alennuksen ja veron ja jos alennusta on muuta tyylityksiä ehdollisella reneröinnillä */}
                {
                    post?.discount ? (
                        <p> Alennus: {post?.discount}<br/></p> 
                    ): (null)
                }

                <p>Tuotteen arvioitu kuljetusaika: <FormatDeliveryEstimateToDate deliveryDaysEstimateStarting={post?.deliveryDaysEstimateStarting} deliveryDaysEstimateEnding={post?.deliveryDaysEstimateEnding}/></p>

                <Error message={message}/>
            </div>
        </div>
    </div>)
}

export { ProductPage }