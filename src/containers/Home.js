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

function ShowAlbum ({index, tot, id, name, artist}) {
    const imgsrc = "url(http://3.35.178.151/images/covers/" + id + ".jpg)";
    var trophy;
    if (index === 1) {
        trophy = "http://3.35.178.151/images/trophies/gold.png";
    }
    else if (index === 2) {
        trophy = "http://3.35.178.151/images/trophies/silver.png";
    }
    else if (index === 3) {
        trophy = "http://3.35.178.151/images/trophies/bronze.png";
    }
    else {
        trophy = "http://3.35.178.151/images/trophies/unrank.png";
    }
    
    var linknum = tot - id + 1;
    const imglink = '/evaluate/' + linknum; 

    return (
        <div className="HOF-album"
             style = {{
                 backgroundImage: imgsrc,
                 cursor: 'pointer'
             }}
             onClick={() => {
                 document.location.href = imglink
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
        albums : [],
        len : 0,
    }

    getAlbums = async () => {
        var url = "http://3.35.178.151:8080/api/get/albums/all";
        var albums = await axios.post(url);
        var album_len = albums.data.length;
        albums = albums.data.filter(album => album.isOpen === 1);
        albums.sort(function(a, b) {
            return b.rating - a.rating;
        });

        const HOF = albums.slice(0, 10);
        const ROF = albums.slice(-10).reverse();

        this.setState({albums: HOF,
                       ROFs: ROF,
                       HOFs: HOF,
                       len: album_len,
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
                    <br/>
                    <div className="HOF-title">
                        <ButtonGroup 
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
                    <div className= "HOF-wrapper">
                        <div className="HOF-albums">
                            <Slider {...settings}>
                                {albums.map(album => (
                                    <ShowAlbum 
                                        key = {order}
                                        index = {order++}
                                        tot = {this.state.len}
                                        id = {album.id}
                                        name = {album.name}
                                        artist = {album.artist}
                                    />
                                ))}
                            </Slider>
                        </div>
                    </div>
                    </center>
                    <div className="home-comment">
                        앨범 커버를 클릭하면, 해당 평가 페이지로 이동합니다.
                    </div>
                </div>
                )}
            </section>
        );
    }
};

export default Home;