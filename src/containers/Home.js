// base
import React from 'react';
import axios from 'axios';
import Slider from 'react-slick';

// material-ui
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

// slick-carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Home.css"

function ShowAlbum ({index, id, name, artist}) {
    const imgsrc = "url(http://moontomi.duckdns.org/images/" + id + ".jpg)";
    var trophy;
    if (index === 1) {
        trophy = "http://moontomi.duckdns.org/images/gold.png";
    }
    else if (index === 2) {
        trophy = "http://moontomi.duckdns.org/images/silver.png";
    }
    else if (index === 3) {
        trophy = "http://moontomi.duckdns.org/images/bronze.png";
    }
    else {
        trophy = "http://moontomi.duckdns.org/images/unrank.png";
    }
    
    return (
        <div className="HOF-album"
             style = {{
                 backgroundImage: imgsrc
             }}
        >
            <div className="HOF-album-detail">
                <img src={trophy} alt="trophy"/>
                <div className="HOF-album-name"> 
                    {name}
                </div>
                <div className="HOF-album-artist">
                    {artist}
                </div>
            </div>
        </div>
    );
}

class Home extends React.Component {
    state = {
        isLoading: true,
        isHOF: true,
        ROFs : [],
        HOFs : [],
        albums : []
    }

    getAlbums = async () => {
        var url = "http://moontomi.duckdns.org:8081/api/albums";
        var albums = await axios.get(url);
        albums.data.sort(function(a, b) {
            return b.rating - a.rating;
        });

        const HOF = albums.data.slice(0, 10);
        const ROF = albums.data.slice(-10).reverse();

        this.setState({albums: HOF,
                       ROFs: ROF,
                       HOFs: HOF,
                       isLoading: false});
    }

    componentDidMount() {
        this.getAlbums();
    }

    render() {
        const settings = {
            className: "album-container",
            dots: true,
            infinite: true,
            autoplay: true,
            autoplaySpeed: 2500,
            slidesToShow: 3,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 0
                    }
                }
            ]
        }
        const {isLoading, isHOF, albums} = this.state;
        var order = 1;
        return (
            <section className="home-container">
                {isLoading ? (
                    <div className = "loader">
                        <span className = "loader-text">Loading Albums...</span>
                    </div>
                ) : (
                <div className="page_title">
                    <center>
                    <div className="HOF-title">
                        <img src="http://moontomi.duckdns.org/images/m_logo.png" alt="m_logo"/>
                        
                        <ButtonGroup 
                        orientation="vertical"
                        aria-label="outlined primary button group">
                            <Button 
                            color={isHOF ? "secondary" : "primary"}
                            onClick={() => {
                                this.setState({
                                    albums: this.state.HOFs,
                                    isHOF: true
                                });
                            }}>
                                <div className="HOF">
                                    명예의 전당
                                </div>
                            </Button>
                            <Button 
                            color={isHOF ? "primary" : "secondary"}
                            onClick={() => {
                                this.setState({
                                    albums: this.state.ROFs,
                                    isHOF: false
                                });
                            }}>
                                <div className="ROF">
                                    불명예의 전당
                                </div>
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="HOF-albums">
                        <Slider {...settings}>
                            {albums.map(album => (
                                <ShowAlbum 
                                    key = {order}
                                    index = {order++}
                                    id = {album.id}
                                    name = {album.name}
                                    artist = {album.artist}
                                />
                            ))}
                        </Slider>
                    </div>
                    </center>
                </div>
                )}
            </section>
        );
    }
};

export default Home;