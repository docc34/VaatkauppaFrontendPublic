import React,{useEffect, useState} from "react";
import { useCookies } from 'react-cookie';
import {Error, MakeShoppingCartItem,FormatDeliveryEstimateToDate} from '../Utils/Functions';
import { useLocation } from "react-router-dom";
    const paypalResponseObject = {
    "id":"7TF79262PP128420G",
    "intent":"CAPTURE",
    "status":"COMPLETED",
    "purchase_units":[
        {"reference_id":"1",
        "amount":{"currency_code":"EUR","value":"25.50"},
        "payee":{
            "email_address":"sb-doxy48783494@business.example.com",
            "merchant_id":"2T8SCRWHVEMCQ"
            },
        "description":"Perus t-paita täysin musta",
        "shipping":{
            "name":{
                "full_name":"John Doe"
                },
            "address":{
                "address_line_1":"Pursimiehenkatu 12",
                "admin_area_2":"Helsinki"
                ,"admin_area_1":"Suomi"
                ,"postal_code":"00150"
                ,"country_code":"FI"
                }
            },
        "payments":
            {
                "captures":[
                    {
                        "id":"9P431492LE322043H",
                        "status":"COMPLETED",
                        "amount":{
                            "currency_code":"EUR",
                            "value":"25.50"
                            },
                        "final_capture":true,
                        "seller_protection":{
                            "status":"ELIGIBLE",
                            "dispute_categories":[
                                "ITEM_NOT_RECEIVED","UNAUTHORIZED_TRANSACTION"
                                ]
                            },
                        "create_time":"2022-01-26T13:20:13Z",
                        "update_time":"2022-01-26T13:20:13Z"}
                    ]
            }
        },
        {"reference_id":"2","amount":{"currency_code":"EUR","value":"26.00"},"payee":{"email_address":"sb-doxy48783494@business.example.com","merchant_id":"2T8SCRWHVEMCQ"},"description":"Perus hyvä t-paita","shipping":{"name":{"full_name":"John Doe"},"address":{"address_line_1":"Pursimiehenkatu 12","admin_area_2":"Helsinki","admin_area_1":"Suomi","postal_code":"00150","country_code":"FI"}},"payments":{"captures":[{"id":"76470539VL397271H","status":"COMPLETED","amount":{"currency_code":"EUR","value":"26.00"},"final_capture":true,"seller_protection":{"status":"ELIGIBLE","dispute_categories":["ITEM_NOT_RECEIVED","UNAUTHORIZED_TRANSACTION"]},"create_time":"2022-01-26T13:20:01Z","update_time":"2022-01-26T13:20:01Z"}]}}],"payer":{"name":{"given_name":"John","surname":"Doe"},"email_address":"sb-xybis7895175@personal.example.com","payer_id":"XXRRV9ULGHDGG","address":{"country_code":"FI"}},"create_time":"2022-01-26T13:20:13Z","update_time":"2022-01-26T13:20:13Z",
        "links":[{"href":"https://api.sandbox.paypal.com/v2/checkout/orders/7TF79262PP128420G","rel":"self","method":"GET"}]
    };
    

    const ResponsePage = (o)=>{
        const [response, setResponse] = useState("");
        const [message, setMessage] = useState("");
        const [cookies,setCookie] = useCookies(['token']);
        const search = useLocation().search;
        const orderId = new URLSearchParams(search).get('id');
        
        const getOrder  = async ()=>{
            if(orderId != null && orderId != "" && response == ""){
                const answer = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Orders/"+orderId,{
                        method: 'GET',
                        headers: { "Authorization": `Bearer ${cookies.token}`}
                    });
                var parsedAnswer = await answer.json();

                if(parsedAnswer?.status != "Error"){
                    setResponse(parsedAnswer);
                }
                else{
                    setMessage(parsedAnswer?.message);
                }

            }
        }

        useEffect( async ()=>{
            await getOrder();
        },[]);
        // useEffect(async ()=>{
        //     if(posts != ""){
        //         try{
        //             var ids = o.paypalResponseObject.purchase_units.map(function(i) {
        //                 return i.reference_id;
        //               });

        //             const answer = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Posts/Shoppingcart",{
        //                 method: 'POST',
        //                 headers: {'Content-Type': 'application/json'},
        //                 body:JSON.stringify(ids)
        //             });
        //             let posts = await answer.json();
        //         if(posts?.status == "Error"){
        //             setMessage(posts?.message);
        //         }
        //         else{
        //             setPosts(posts);

        //             var orderItems = posts.map((e,i)=>{
        //                 return{
        //                   PostId:e?.id,
        //                   Amount:1
        //                 }//TODO: laita tähän tuotteiden määrä kun otat sen käyttöön.
        //               });
        //             var price = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Orders/price",{//TODO:Lisää tähän tuotteiden määrä kun teet sen
        //             method: 'POST',
        //             headers: {'Content-Type': 'application/json'},
        //             body:JSON.stringify(orderItems)
        //             });
        //             setPrice( await price.json());
        //         }
                
        //         }
        //         catch(e){
        //             setMessage(e);
        //         }
                
        //       }
        // },[o.order])
        //if(o.paypalResponseObject != null && o.paypalResponseObject != ""&& o.paypalResponseObject != undefined && o != null){
            var Starting = 0;
            var Ending = 2;
            o?.posts?.map((e)=>{
                if(e?.deliveryDaysEstimateStarting > Starting){
                    Starting = e?.deliveryDaysEstimateStarting
                }
                if(e?.deliveryDaysEstimateEnding > Ending){
                    Ending = e?.deliveryDaysEstimateEnding
                }
            });
            if(o != null && o != ""&& o != {}){
                return(<div>
                        {(o != null && o != ""&& o != {}) ? 
                        (<p>{response.o}</p>) : (<p>{response.price}</p>)
                        }
                        <h3>Tilaus {o?.order?.guid} tehty</h3>
                        <p>Ostetut tuotteet</p>
                        <MakeShoppingCartItem data={o?.posts} />
                        <p>Kokonaishinta:{o?.price}</p>
                        {/* TODO: Muotoile aika oikein */}
                        <p>Aika:{o?.order?.orderDate}</p> 
                        <p>Tilauksen status: {o?.order?.status}</p>
                        <p>Osoite:{o?.order?.location?.address}</p>
                        <p>Postinumero:{o?.order?.location?.postalCode}</p>
                        <p>Kaupunki:{o?.order?.location?.city.cityName}</p>
                        <FormatDeliveryEstimateToDate deliveryDaysEstimateStarting={Starting} deliveryDaysEstimateEnding={Ending}/> 
                        <Error message={message}/>
                        {/* {o?.paypalResponseObject?.id} */}
                    </div>)
            }
            else{
            return(<div>
                    <h3>Tilaus {response.order?.guid} tehty</h3>
                    <p>Ostetut tuotteet</p>
                    <MakeShoppingCartItem data={response.posts} />
                    <p>Kokonaishinta:{response.price}</p>
                    {/* TODO: Muotoile aika oikein */}
                    <p>Aika:{response.order?.orderDate}</p> 
                    <p>Tilauksen status: {response.order?.status}</p>
                    <p>Osoite:{response.order?.location?.address}</p>
                    <p>Postinumero:{response.order?.location?.postalCode}</p>
                    <p>Kaupunki:{response.order?.location?.city.cityName}</p>
                    <FormatDeliveryEstimateToDate deliveryDaysEstimateStarting={Starting} deliveryDaysEstimateEnding={Ending}/> 
                    <Error message={message}/>
                    {/* {o?.paypalResponseObject?.id} */}
                </div>)
            }
            
        //}
        //else{
            // return(<div>
            //     <p>Vastaus ei palautunut</p>
            // </div>)
        //}
    }

    export{ResponsePage}