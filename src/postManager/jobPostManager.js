import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { Button, InputGroup, FormControl, Modal,CardGroup as CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


import '@inovua/reactdatagrid-community/index.css'

import { MakePost, Error, AdminStatus } from '../Utils/Functions';
//^Importataan kaikki paketit mitä tarvitaan

import { postPostService, postDeleteService, postModifyService } from '../services/postManager';

import './jobPostManager.css';
import { useCookies } from 'react-cookie';
import { useLocation } from "react-router-dom";

const PostManager = () => {
    var user = null;
    const [modifyDataModal, setModifyDataModal] = useState(false);
    const [postModalShow, setPostModalShow] = useState(false);
    const [postLabel, setPostLabel] = useState("");
    const [postPrice, setPostPrice] = useState(0);
    const [postPriceEndingAt, setPostPriceEndingAt] = useState(0);

    const [postHourEstimate, setPostHourEstimate] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [idJobPost, setIdJobPost] = useState("");
    const [storePostsData, setStorePostsData] = useState([]);

    //TODO:User objekti pitää ottaa käyttöön

    const [message, setMessage] = useState("");
    const [postModifyData, setPostModifyData] = useState([]);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const [cookies] = useCookies(['token']);


    const [adminStatus, setAdminStatus] = useState(false);
    const [searchObject, setSearchObject] = useState({jobPostTitle:null,priceSort:null});
    
    const search = useLocation().search;
    const jobPostTitle = new URLSearchParams(search).get('title');
    useEffect( async ()=>{
        setAdminStatus(await AdminStatus({token: cookies?.token}));
        await getStoreData({jobPostTitle:null,priceSort:null});
    },[]);

     // haetaan kaikki ilmoitukset 
     const getStoreData = async (i) => {
        if(i != null){
            try{
                const options = {
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${cookies.token}`}
                }

                let url = "https://vaatekauppayritysbackend.azurewebsites.net/api/Posts/?1=1";
                if( i?.jobPostTitle != "" && i?.jobPostTitle != null && i?.jobPostTitle != undefined){
                    url += "&title="+i.jobPostTitle;
                }
                else if(jobPostTitle != null && jobPostTitle != undefined){
                    url += "&title="+jobPostTitle;
                }
                if(i?.priceSort != "" && i?.priceSort != null && i?.priceSort != undefined){
                    url += "&sortPrice="+i?.priceSort;
                }


                let data = await fetch(url,options);
                let posts = await data.json();
                if (posts?.status == "Error") {
                    setMessage(posts.message);
                }
                else{
                    setMessage("");
                    setStorePostsData(posts);
                }
            }
            catch{
                setMessage("Fatal Error");
            }
        }
    }

    {/* nollaa kaikki ponnahdusikkunoiden arvot ja sulkee pnnahdusikkunat */ }
    const resetValues = () => {
        setPostModalShow(false);
        setModifyDataModal(false);
        setPostLabel("");
        setPostPrice(0);
        setPostHourEstimate("");
        setPostDescription("");

        setFile(null);
    }



    const receivePostDeleteData = async (data) => {

        if (window.confirm("Haluatko varmasti poistaa julkaisun")) {
            // if (data != undefined && data != null) {
            //     //const posts = await postDeleteService({ selectedPost: data, userId: profileId });
            //     if (posts.error) {
            //                     //TODO:Error

            //     }
            //     let post = posts.data;
            //     resetValues();
            //     getUserPosts();
            // }
        }
    }

    const receivePostModifyData = async (data) => {

        if (data != undefined && data != null) {
            setModifyDataModal(data);
            setPostLabel(data.label);
            setPostPrice(data.priceStartingAt);
            setPostHourEstimate(data.hourEstimate);
            setPostDescription(data.description);
            setIdJobPost(data.idJobPost);
        }

    }
    useEffect(async () => {
        if (postModifyData.length != 0 && postModifyData != null) {

            const posts = await postModifyService(postModifyData);
            if (posts.error) {
            //TODO:Error
            }
            let post = posts.data;
            resetValues();
            //getUserPosts();
        }

    }, [postModifyData]);

    const addOrEdit = async (formData)=>{
        if (formData != "" && formData != null) {

            const options = {
                method: 'POST',
                headers: { "Authorization": `Bearer ${cookies?.token}` },
                body: formData
            }
            //, 'Content-Type': 'application/x-www-form-urlencoded'
            //, 'Content-Type': 'image/png'
            try {
                let data = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Posts/image", options)
                let j = await data.json();
                if (j?.status != "Error") {
                    setMessage("Image added successfully.");
                    resetValues();
                }
                else {
                    setMessage(j?.message);
                }
            } catch {
                setMessage("Error!");
            }
        }
    }

    const handleFormSubmit = e =>{
        
        e.preventDefault();
        if( file != null){
            const formData = new FormData();
            formData.append("ImageLink", "imageName")
            formData.append("imageFile", file)
            formData.append("postId", 1)//TODO:Lisää tähän valitun julkaisun id
            //formData.append("description", attachmentDescription)
            addOrEdit(formData);
        }
    }
    // const validate=()=>{
    //     let temp = {};
    //     //temp.imageSource = imageSource ==defaultImageSource?false:true;
    //     //temp.description = attachmentDescription ==""?false:true;
    //     setErrors(temp);
    //     return Object.values(temp).every(x=>x==true)
    // }
    const setFileFromInput = e =>{
        if(e.target.files && e.target.files[0]){
        let imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = x=>{
            setFile(imageFile);

        }
        reader.readAsDataURL(imageFile);
        }
        else{
            setFile(null);
        }
    }
    const applyErrorClass= field =>((field in errors && errors[field] == false)?' invalid-field':'')
    

    if( adminStatus == true){
        return (<div className="PostManagerMainBox">
                <div>
                    <h1>Tee tuote ilmoitus</h1>
                    <Button variant="dark"  onClick={() => { setPostModalShow(true) }}>Tee työilmoitus</Button>
            {/* <Button variant="dark"  onClick={() => { deleteSelectedPosts();}}>Poista valitut</Button> */}
            <a href="/Profiili">Profiiliin</a>
                </div>
                <div>
                    <h3>Ilmoitukset</h3>
                    <CardColumns  className="Job-Post-CardColumns"> 
                        <MakePost data={storePostsData} mode={1}  receivePostDeleteData={receivePostDeleteData} receivePostModifyData={receivePostModifyData}/>
                    </CardColumns>
                </div>



            {/* modalin asetukset määritetään tässä */}
            <Modal
                show={postModalShow}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        {/* Otsikko */}
                        Luo ilmoitus
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Tässä on ponnahdusikkunan kehon sisältö */}
                    <div><label htmlFor="postLabel">Otsikko <input type="text" value={postLabel} id="postLabel" onChange={(e) => { setPostLabel(e.target.value); }}></input></label></div>
                    <div><label htmlFor="postPrice">Hinta <input type="number" value={postPrice} id="postPrice" onChange={(e) => { setPostPrice(e.target.value); }}></input></label></div>
                    <div><label htmlFor="postHourEstimate">Tuntiarvio <input id="postHourEstimate" value={postHourEstimate} type='number' onChange={e => setPostHourEstimate(e.target.value)}></input></label></div>
                    {/* <label htmlFor="postDescription">Kuvaus  </label> */}
                    <h3>Lisää kuva julkaisuun</h3>
                    <form onSubmit={handleFormSubmit}>
                        {/* <label htmlFor='attachmentDescription'>Picture description<input id="attachmentDescription" onChange={(e)=>{setAttachmentDescription(e.target.value);}} className="form-control"/></label> */}
                        {/*onChange={showPreview}*/}
                        <input onChange={setFileFromInput} type="file" accept='image/*' id="image-uploader" className={"form-control"+applyErrorClass("imageSource")}/>
                        <Button variant="dark"  type="submit">Save</Button>
                    </form>
                <div> <InputGroup>
                        <InputGroup.Text>Kuvaus</InputGroup.Text>
                        
                        <FormControl as="textarea" value={postDescription}  onChange={(e) => { setPostDescription(e.target.value); }} />
                    </InputGroup></div>
                
                    <Error message={message} />

                </Modal.Body>
                <Modal.Footer>
                    {/* Ilmoituksen footteri */}
                    {/* <Button variant="dark"  onClick={() => { setPostData({ userId: profileId, label: postLabel, priceStartingAt: postPriceStartingAt,priceEndingAt: postPriceEndingAt , hourEstimate: postHourEstimate, description: postDescription }); }}>Tallenna</Button> */}
                    <Button variant="dark"  onClick={() => { resetValues(); setMessage(""); }}>Peruuta</Button>
                </Modal.Footer>
            </Modal>


            {/* modalin asetukset määritetään tässä */}
            <Modal
                show={modifyDataModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        {/* Otsikko */}
                        Muokkaa ilmoitusta
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Tässä on ponnahdusikkunan kehon sisältö */}
                    <div><label htmlFor="postLabel">Otsikko <input type="text" value={postLabel} id="postLabel" onChange={(e) => { setPostLabel(e.target.value); }}></input></label></div>
                    <div><label htmlFor="postPrice">Hinta alken <input type="number" value={postPrice} id="postPrice" onChange={(e) => { setPostPrice(e.target.value); }}></input></label></div>
                    <div><label htmlFor="postHourEstimate">Tuntiarvio <input id="postHourEstimate" value={postHourEstimate} type='number' onChange={e => setPostHourEstimate(e.target.value)}></input></label></div>
                    
                    <div><InputGroup>
                        <InputGroup.Text>Kuvaus</InputGroup.Text>
                        
                        <FormControl as="textarea" value={postDescription}  onChange={(e) => { setPostDescription(e.target.value); }} />
                    </InputGroup>
                    <Error message={message} /></div>

                </Modal.Body>
                <Modal.Footer>
                    {/* Ilmoituksen footteri */}
                    {/* <Button variant="dark"  onClick={() => { setPostModifyData({ idJobPost: idJobPost, userId: profileId, label: postLabel, priceStartingAt: postPriceStartingAt,priceEndingAt: postPriceEndingAt, hourEstimate: postHourEstimate, description: postDescription }); }}>Tallenna</Button> */}
                    <Button variant="dark"  onClick={() => { resetValues(); setMessage(""); }}>Peruuta</Button>
                </Modal.Footer>
            </Modal>


        </div>)
    }
    else {
        return(<div>
            <p>Error 401</p>
        </div>)
    }
   
}

export { PostManager }