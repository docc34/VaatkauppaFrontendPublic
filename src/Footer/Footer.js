import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'

const Footer = () => {

    return (
    <div className="Footer-Main-Container" >
        <div className="Footer-header">
            <h3 className="Footer-Header-Text">Yhteystiedot</h3>
        </div>
        
        <div className="Footer-Text-Container">

            <div className="Footer-Info-Containers" >
                <div>
                    <p>Nimi: </p>
                    <p>Sähköposti: </p>
                    <p>Puhelinnumero: </p>
                </div>
                <div className="Footer-Info-Data">
                    <p>Eemeli Antikainen</p>
                    <p>eemeli.antikainen@gmail.com</p>
                    <p>040 960 6973</p>
                </div>

            </div>
            <div className="Footer-Info-Containers" >
            <div >
                    <p>Nimi: </p>
                    <p>Sähköposti: </p>
                    <p>Puhelinnumero: </p>
                </div>

                <div className="Footer-Info-Data" >
                    <p>Maija Mehiläinen</p>
                    <p>yrityssähöposti@yritys.fi</p>
                    <p>123 456 7891</p>
                </div>
            </div>
        </div>

    </div>)
}

export { Footer }