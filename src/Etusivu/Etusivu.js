import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Etusivu.css'
import Carousel from 'react-bootstrap/Carousel';
import Spinner from 'react-bootstrap/Spinner';

const EtusivuTekstit = () => {
    const [posts, setPosts] = useState([]);
    var titleContainer =  null;

    const getCarouselPosts = async ()=>{
        try{
            var postsFetch = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Posts?take=3");

            var posts = await postsFetch.json();
            if(posts != null){
                setPosts(posts);
            }
        }
        catch(e){
            console.log(e);
        }
       
    }
    useEffect( async ()=>{
        titleContainer =  document.getElementById('EtusivuTitleMainContainerId');
        await getCarouselPosts();
    },[]);

    function fadeOutOnScroll(element) {

        if (element == null) {
            return;
        }
        else{
        var distanceToTop = window.pageYOffset + element.getBoundingClientRect().top;
        var elementHeight = element.offsetHeight;
        var scrollTop = document.documentElement.scrollTop;
        
        var opacity = 1;
        
        if (scrollTop > distanceToTop) {
            opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
        }
        
        if (opacity >= 0) {
            element.style.opacity = opacity;
        }
        }
        
        
    }
    
    function scrollHandler() {
        fadeOutOnScroll(titleContainer);
    }
    
    window.addEventListener('scroll', scrollHandler);

    const carouselItems = posts.map((e,i)=>{
        return(
            <Carousel.Item >
                <a href={"/Tuote?id="+e.id}>
                    <img
                    className="CarouselImages"
                    src={e.imageLink}
                    />
                </a>
                <Carousel.Caption >
                    <a href={"/Tuote?id="+e.id}>
                        <h3 className="CarouselTexts">{e.label}</h3>
                        <p  className="CarouselTexts">{e.description}</p>
                    </a>
                </Carousel.Caption>
            </Carousel.Item>
        )
    });
    
    return (
    <div className='EtusivuMainContainer'>
        <div id="EtusivuTitleMainContainerId" className="EtusivuTitleMainContainer">

        
            { posts?.length != 0 ?
                <Carousel>
                    {carouselItems}
                </Carousel>
                :
                <Spinner  animation="border" /> 
            }

        </div>
        <div  className='EtusivuTextsMainFlexContainer'>
        {/* Layout kusee t??h??n joteki */}
            <div className='EtusivuFlexBox'>

            </div>

            <div className='EtusivuTextsMainContainer'>
                <div>
                    <div className='EtusivuTextsContainer EtusivuTextsContainerType1'>
                    <h1 >Unnamed </h1>
                        <h4>Projektin tarkoitus</h4>
                        <h4 id='EtusivuDisclaimer'>Projekti on viel?? keskener??inen.</h4>
                        <p> Tyylitykset olen p????tt??nyt tehd?? viimesen?? joten t??ll??htekell?? sivut n??ytt??v??t t??lt??, mutta toiminnallisuutta on. Jos sivusta tai koodista on mit????n kysymyksi?? ota yhteytt?? eemeli.antikainen@gmail.com</p>
                        <p>Unnamed on minun keksim?? fiktiivinen vaatekauppa.</p>
                        <p>Projektin frontti on tehty reactjs:ll??. Backend on tehty Asp net core web api sovelluksena C# kielell??. Tietokanta on tehty MySql:l??ll??.</p>
                    </div>
                </div>
                <div>
                    <div className='EtusivuTextsContainer EtusivuTextsContainerType2'>
                        <h4>Sivun toiminnallisuutta ja teknist?? tietoa</h4>
                        <ul>
                            <li>K??ytt??j?? voi selata tuotteita ja tehd?? ostoksia maksaen paypalilla</li>
                            <li>K??ytt??j?? voi rekister??id?? k??ytt??j??n ja kirjautua sis????n, jotta tilaustiedot ja tehdyt tilaukset tallentuisi.</li>
                            <li>K??ytt??j?? voi tietenkin muokata ja poistaa profiilinsa</li>
                            <li>Admin k??ytt??j?? voi Luoda/muokata/poistaa tuotteita</li>
                        </ul>
                        <p>Tietokannat ja kuvat tallennetaan azuren pilvipalveluihin palvelimelle. Sivut ovat julkaistu azuren pilvipalveluihin halvimmalle koneelle koska olen opiskelija joten latausajat ovat mit?? ovat.</p>
                        <p>K??ytt??j?? voi selailla ja tehd?? tilauksia ilman k??ytt??j???? tai luoda k??ytt??j??tilin johon tallentuu yhteystiedot ja tehdyt tilaukset. Salasanankin voi palauttaa ja tilauksista laitetaan gmailia, taitaa tosin menn?? nyt roskapostiin koska minulla ei ole luotettua domainia mist?? l??het???? gmailia.</p>
                        <p>Maksaminen toimii paypalin sandbox ymp??rist??ss??. Sivu k??ytt???? keksej?? toiminnallisuuksiin.</p>
                        <p>K??ytt??j??t tallennetaan toistaiseksi kahteen eri tietokantaan. Toiseen tallennetaan tunnukset salattuna ja sit?? kautta hallinnoidaan k??ytt??jien rooleja. Toiseen tallennetaan k??ytt??j??tiedot ilman salasanaa ja kaikki k??ytt??j????n ja sivuihin liittyv?? muu data.</p>

                    </div>
                </div>
                <div>
                    <div className='EtusivuTextsContainer EtusivuTextsContainerType1'>
                        <h4>Linkit, liitteet</h4>
                        <p>Kuva p???? tietokannasta</p>

                    <img className="EtuSivuImages" src="https://vaatekauppastorage.blob.core.windows.net/ssmaindatabase/ssTietokannasta.PNG"/>
                    <p>Kuva kirjautumis tietokannasta</p>
                    <img className="EtuSivuImages" src="https://vaatekauppastorage.blob.core.windows.net/ssmaindatabase/ssKirjautumiskannasta.PNG"/>
                    </div>
                </div>
                
            </div>
            <div  className='EtusivuFlexBox'></div>
            
        </div>
        

        {/* <div className="flex-etusivu-container">
            <div className="flex-etusivu-tekstiloota-Vasen">
                <a href="/Rekisteroityminen" className="etusivu-muotoilu-otsikot"><img src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg" className="etusivu-muotoilu-Kuvat"></img></a>
                <p className="etusivu-muotoilu-tekstit">Jos haluat tehd?? ty??ilmoituksia sinun pit???? rekister??ity??</p>
            </div>
            <div className="flex-etusivu-tekstiloota-Oikea">
                <a href="/Kauppa" className="etusivu-muotoilu-otsikot"><img src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg" className="etusivu-muotoilu-Kuvat"></img></a>

                <p className="etusivu-muotoilu-tekstit">Jos haluat etsi?? ty??ntekij??it?? selaile kauppasivua</p>
            </div>
        </div> */}
    </div>
        
        )
}

export { EtusivuTekstit }

