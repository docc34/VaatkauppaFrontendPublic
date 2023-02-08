import './PostCss.css';
import { Image, Card, Row, Col, Button,Spinner } from 'react-bootstrap';
import { MDBRating } from 'mdbreact';
import React,{useEffect, useRef, useState} from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment';
//Tässä on funktioita joita käytetään frontissa esim julkaisujen renderöintiin.
{/* Tähän funktioon annetaan kaikki tietokannasta haetut ilmoitukset ja se luo jokaisesta alla olevan html mukaisen ilmoituksen */ }
const MakePost = (p) => {
  const [cookies,setCookie] = useCookies(['token']);

  
    //Näin voi cutomoida kortin ulkonäköä
    //   <Card
    //   bg={variant.toLowerCase()}
    //   key={idx}
    //   text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
    //   style={{ width: '18rem' }}
    //   className="mb-2"
    //  ></Card>
    
    //#endregion
    if(p.data != null){
      
    return (
    <div>
      <Row xs={1} sm={1} md={2}  xl={4}  className="g-4" >
        {p.data.map((e, i) => {
          if(e!= null){
            const sendDataDelete = () => {
              p.receivePostDeleteData({ label: e.label, idjobPost: e.idJobPost }, i);
            }
      
            const sendDataModify = () => {
              p.receivePostModifyData({ idJobPost: e.idJobPost, label: e.label, priceStartingAt: e.priceStartingAt, priceEndingAt: e.priceEndingAt, hourEstimate: e.hourEstimate, description: e.description });
            }
            var url ="http://localhost:3000/Tuote?id="+e?.id;
            
            return (<Col>
              <Card className="Post-Card">
                <Card.Body>
                  <Card.Title><a href={url}className="font-weight-bold d-block">{e?.label}</a></Card.Title>
                  
                  <img className='ReviewLinkedImage' src={e?.imageLink}/>
                  
                  <p>Hinta: {e?.price}€</p>
                  {/* Tämä on ehdollista renderöintiä, pitää määrittää kenttiin jotka voi olla tyhjiä */}
                  {
                    e?.size ? (<Card.Text>
                      Koko: {e?.size}
                    </Card.Text> ):( null)
                  }
                  {
                    e?.color ? (<Card.Text>
                      Väri: {e?.color}
                    </Card.Text> ):( null)
                  }
                  {
                  e?.material ? (<Card.Text>
                    Materiaali: {e?.material}
                  </Card.Text> ): (null)
                  }
                  {
                  e?.length ? (<Card.Text>
                    Pituus: {e?.length}
                  </Card.Text> ):( null)
                  }
                  {
                  e?.sleeveLength ? (<Card.Text>
                    Hihan pituus: {e?.sleeveLength}
                  </Card.Text> ): (null)
                  }
                  {/* TODO: Tee funktio joka laskee hintaan mukaan alennuksen ja veron ja jos alennusta on muuta tyylityksiä ehdollisella reneröinnillä */}
                  {
                  e?.discount ? (<Card.Text>
                    Alennus: {e?.discount}%
                  </Card.Text> ): (null)
                  }

                  <div className="ProfileCardTitleContainer">
                  <Card.Text className="ProfileCardTitleLabelBox">
                    {e?.description}
                  </Card.Text>
                  </div>

                  <div className="ProfileCardTitleContainer">
                    {/* TODO: Tähän vois tähti arvostelut laittaa */}
                    {/* <Card.Text className="ProfileCardTitleLabelBox">
                      <MakeRatingStars/>
                    </Card.Text> */}
                    <Card.Text>
                      <Button variant="dark"  className='Post-Button' onClick={()=>{if(cookies['shoppingCart'] == null || cookies['shoppingCart'] == undefined){
                        setCookie('shoppingCart', [{PostId:e?.id}], { path: '/' })
                        window.location.reload();
                      }
                      else{
                        var i = cookies['shoppingCart'];
                        var t = true;
                        i?.map((item,index)=>{
                          if(item?.PostId == e?.id){
                            t = false;
                          }
                        })

                        if(t == true)
                        {
                          i[i.length] ={PostId:e?.id}
                          setCookie('shoppingCart', JSON.stringify(i), { path: '/',expires: 0})
                          window.location.reload();
                        }
                      }}}>Lisää ostoskoriin</Button>

                      {p.mode == 1 ? (<div>                
                          {/*  Tähän tekstin tilalle roskiksen logo */}
                          <input type="Button" onClick={(x) => { sendDataDelete() }} value="Poista" />
                          {/* Tähän tekstin tilalle kynän logo  */}
                          <input type="Button" onClick={(x) => { sendDataModify() }} value="Muokkaa" />
                        </div>)
                      : (null)
                      }
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>)
        }})}
      </Row>
    </div>
    )
  }
}

const MakeShoppingCartItem = (p) => {
  const [cookies,setCookie] = useCookies(['token']);
  if(p.data != null && p.data != ""){
    return (
    <div>
      {p.data.map((e, i) => {
        if(p?.shoppingCart == true){
          if(e!= null){
            return (
              <div className="d-flex justify-content-between align-items-center mt-3 p-2 items rounded">
                <div className="d-flex flex-row">
                  <img className="rounded  Post-Image" src={e?.imageLink} />
                  <div className="ml-2">
                    <span className="font-weight-bold d-block">{e?.label}</span>
                    <span className="ml-2">
                      {/* Tämä on ehdollista renderöintiä, pitää määrittää kenttiin jotka voi olla tyhjiä */}
                      {
                      e?.material ? (
                      <p>Materiaali: {e?.material}<br/></p> 
                      ): (null)
                      }
                      {
                      e?.length ? (
                      <p>Pituus: {e?.length}<br/></p> 
                      ):( null)
                      }
                      {
                      e?.sleeveLength ? 
                      <p> Hihan pituus: {e?.sleeveLength}<br/></p> 
                      : (null)
                      }
                      {/* TODO: Tee funktio. Jos alennusta on muuta tyylityksiä ehdollisella reneröinnillä */}
                      {
                      e?.discount ? (
                      <p> Alennus: {e?.discount}<br/></p> 
                      ): (null)
                      }
                      <p>Hinta: {e?.price}€</p>
                    </span>
                </div>
                <div className="d-flex flex-row align-items-center"><i className="fa fa-trash-o ml-3 text-black-50"></i> 
                <Button variant="dark"  onClick={()=>{
                  var i = cookies['shoppingCart'];
                  i?.map((item,index)=>{
                    if(item?.PostId == e?.id){
                        i.splice(index, 1)
                    }
                  })
                  
                  setCookie('shoppingCart', JSON.stringify(i), { path: '/',expires: 0})
                  
                  window.location.reload();
                }}>Poista ostoskorista</Button>
                </div>
              </div>  
            </div>
            )
          }
        }
        else{
          if(e!= null){
            return (
              <div className="d-flex justify-content-between align-items-center mt-3 p-2 items rounded">
                <div className="d-flex flex-row"><img className="rounded Post-Image" src={e?.imageLink} width="40"/>
                  <div className="ml-2"><span className="font-weight-bold d-block">{e?.label}</span><span className="spec">
                    {/* Tämä on ehdollista renderöintiä, pitää määrittää kenttiin jotka voi olla tyhjiä */}
                    {
                    e?.material ? (
                     <p>Materiaali: {e?.material}<br/></p> 
                    ): (null)
                    }
                    {
                    e?.length ? (
                     <p>Pituus: {e?.length}<br/></p> 
                    ):( null)
                    }
                    {
                    e?.sleeveLength ? 
                     <p> Hihan pituus: {e?.sleeveLength}<br/></p> 
                    : (null)
                    }
                    {/* TODO: Tee funktio joka laskee hintaan mukaan alennuksen ja veron ja jos alennusta on muuta tyylityksiä ehdollisella reneröinnillä */}
                    {
                    e?.discount ? (
                     <p> Alennus: {e?.discount}<br/></p> 
                    ): (null)
                    }
                  </span>
                </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="d-block">2</span>
                    <span class="d-block ml-5 font-weight-bold">{e?.price}</span>
                    <i class="fa fa-trash-o ml-3 text-black-50"></i> 
                </div>
              </div>  
            </div>
            )
          }
        }
    })
    }
  </div>
  )
}
    else {
      return(<div>
        <Spinner  animation="border" /> 
      </div>)
    }
}

const FormatDeliveryEstimateToDate = (v)=>{
  if(CheckEmptyFields([v.deliveryDaysEstimateStarting,v.deliveryDaysEstimateEnding]) && v.deliveryDaysEstimateStarting < v.deliveryDaysEstimateEnding){
    var d = new Date();
    var starting = d.setDate(d.getDate() + v.deliveryDaysEstimateStarting);
    var ending = d.setDate(d.getDate() + v.deliveryDaysEstimateEnding);

    starting = moment(starting).format('DD.MM.YYYY');//, HH:mm Jos haluaisi ottaa tunnit ja minuutit käyttöön.
    ending = moment(ending).format('DD.MM.YYYY');

    return starting +"-"+ending
  }
  else{
    return null
  }
}
const MakeRatingStars = (o) =>{
  //Tällä voi antaa tähdille custom tekstit
  // const [basic] = useState([
  //   {
  //     tooltip: 'Very Bad'
  //   },
  //   {
  //     tooltip: 'Poor'
  //   },
  //   {
  //     tooltip: 'Ok',
  //     choosed: true
  //   },
  //   {
  //     tooltip: 'Good'
  //   },
  //   {
  //     tooltip: 'Excellent'
  //   }
  // ]);
  return(
    <div>
      <MDBRating 
      iconSize="1x" 
      //data={basic}
      iconRegular
      
      />
    </div>
  )
}

//Näyttää tälle funktiolle annetun viestin käytän tätä errorien näyttämiseen
const Error = (props) => {
  return (<p className="errorText">{props.message}</p>)
}

const handleInputChange = (o)=>{
  if(o.target.value == null  || o.target.value == ""|| o.target.value == 0){
    o.target.setAttribute('style','border-color: #8f37aa; border-width: 2px')
    return null;
  }
  else{
    o.target.setAttribute('style','')
    return o.target.value;
  }
}

//Can also check objects but dosent tell what fields failed
const CheckEmptyFields = ( tarkistettavatTiedot)=>{
  let tarkistusStatus = true;
  //Object.values(obj) returns the objects values in an array
  //Tarkistaa onko tiedot tyhjiä ja palauttaa mitkä kentät on tyhjiä 
  try{
    tarkistettavatTiedot.map((e, i) => {
      if(typeof(e) == 'object'){
        Object.values(e).map((oe, oi) => {
          if (oe == null  || oe == "") {
            tarkistusStatus = false
          }
        });
      } 
      else{
        if (e == null || e == "") {
          tarkistusStatus = false
        }
      }
    });
    return tarkistusStatus
  }catch(e){
    console.log(e);
  }
  
}

// const CheckEmptyFieldsWithMessage = (tarkistusKentat, tarkistettavatTiedot)=>{

//   let tarkistusStatus = { status: true, kentat: "" };
//   let l = 0;
//   //Object.values(obj)

//   //Tarkistaa onko tiedot tyhjiä ja palauttaa mitkä kentät on tyhjiä
//   tarkistettavatTiedot.map((e, i) => {
//     if(typeof(e) == 'object'){
//       Object.values(e).map((oe, oi) => {
//         if (oe == null && l == 0 || oe == "" && l == 0) {
//           l++;
//           tarkistusStatus = { status: false, kentat: "Seuraavat kentät puuttuvat: "+ tarkistusKentat[i] }
//         }
//         else if(oe == null && l == 1 || oe == "" && l == 1){
//           tarkistusStatus = { status: false, kentat: tarkistusStatus.kentat + "," + tarkistusKentat[i] }
//         }
//       });
//     }
//       if (e == null && l == 0 || e == "" && l == 0) {
//           l++;
//           tarkistusStatus = { status: false, kentat: "Seuraavat kentät puuttuvat: "+ tarkistusKentat[i] }
//       }
//        else if(e == null && l == 1 || e == "" && l == 1){
      
//           tarkistusStatus = { status: false, kentat: tarkistusStatus.kentat + "," + tarkistusKentat[i] }
//       }

//   });
//   return tarkistusStatus
// }

const Paypal = (o)=>{
  const paypal = useRef();
  const [post, setPost] = useState("");
  const [user, setUser] = useState("");
  useEffect(async ()=>{
  try{
    const options = {
      method: 'GET',
      headers: {"Authorization": `Bearer ${o.token}`}
    }
    
    var user = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/user",options)
    if(user?.status != "Error" ){
      setUser(await user?.json());
    }
    else{
      //If the user hasnt logged in the location data will be retrieved by guid
      var user = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/user/guid/"+o.guid,options)
      
    }
  } 
  catch{

  }
  },[]);

  useEffect(()=>{
    //Luodaan napille funktiot
    if(o.posts != "" && user != ""&& user != null){
      window.paypal.Buttons({
        //Luodaan tilaus
        createOrder: (data, actions, error) =>{
          if(o.posts != "" && user != ""&& user != null){
          var i = {
            intent: "CAPTURE",
            payer:{
              email_address:user.email,
              name:{
                given_name:user.firstName,
                surname:user.lastName
              },
              phone_with_type:{
                phone_number:{
                  national_number:user.phonenumber
                }
              },
              address_portable:{
                address_line_1:user?.location?.address,
                postal_code:user?.location?.postalCode,
                country_code:"FI",
                admin_area_1:user?.province,
                admin_area_2:user?.city
              }
            },
            purchase_units:
              o.posts.map((e,i)=>{
                return({
                  description: e.description,
                  reference_id: e.id,
                  amount: {
                    currency_code:"EUR",
                    value: e.price
                    //, breakdown:{
                    //   tax_total:{
                    //     currency_code:"EUR",
                    //     value: e.tax
                    //   },
                    //   discount:{
                    //     currency_code:"EUR",
                    //     value: e?.discount
                    //   }
                    // }
                  }
                })
              })
              // TODO määritä shipping asetukset
            // ,application_context: {
            //   shipping_preference: 'NO_SHIPPING' 
            //   }
          };
          return actions.order.create(i)
          }
          else{
            return null;
          }
        },
        //Jos tilaus menee läpi toteutetaan on Approve funktio
        onApprove: async (data, actions) =>{
          //TODO: Julkaise ostoskorin sisältö ordereihin t
          //https://vaatekauppayritysbackend.azurewebsites.net/api/Orders/OrderItem
          const order = await (actions.order.capture()) 
          o.recieveOrder(order);
        },
        //Jos tilaus kaatuu tehdään onError funktio
        onError: (err) =>{
          console.log(err);
        }
        
      }).render(paypal.current)
    }
  },[user]);

  return(
  <div>
      <div ref={paypal}></div>
  </div>
  );
}

const AdminStatus = async function(o) {
  var adminStatus = false;

  try{
    const options = {
      method: 'GET',
      headers: {"Authorization": `Bearer ${o.token}`}
    }

    var statusFetch = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/authenticate/validateadmin",options);
    var status = await statusFetch.json();
    if(status = true){
      adminStatus = status;
    }
    else{
      return false;
    }
  }
  catch(e){
    return false;
  }

  return adminStatus;
}

export {
  MakePost,
  Error,
  CheckEmptyFields,
  Paypal,
  MakeShoppingCartItem,
  FormatDeliveryEstimateToDate,
  handleInputChange,
  AdminStatus
}
