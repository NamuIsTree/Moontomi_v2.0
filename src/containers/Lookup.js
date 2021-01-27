import React from 'react';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';

import './Lookup.css';

const PrettoSlider = withStyles({
    root: {
    color: '#242d3c',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function LookupAlbum ({index, id, tot, name, artist, nation, rating}) {
    const imgsrc = "http://3.35.178.151/images/covers/" + id + ".jpg";

    return (
        <TableRow 
            hover 
            role="checkbox"
            tabIndex={-1} 
            style={{ cursor: 'pointer' }}
            onClick={() => {
                var linknum = tot + 1 - id;
                const linkto = '/evaluate/' + linknum;
                document.location.href = linkto;
            }}
        >
            <TableCell style={{fontSize: '1.05rem', fontFamily:'inherit', width:'16.66666%' }} align="center">
                {index+1}
            </TableCell>
            <TableCell style={{ width:'16.66666%' }} align="center">
                <img src={imgsrc} alt="album-cover" style={{width:'50%', minWidth:'100px'}}/>
            </TableCell>
            <TableCell style={{ fontSize: '1.05rem', fontFamily:'inherit', width:'16.66666%' }} align="center">
                {name}
            </TableCell>
            <TableCell style={{ fontSize: '1.05rem', fontFamily:'inherit', width:'16.66666%'}} align="center">
                {artist}
            </TableCell>
            <TableCell style={{ fontSize: '1.05rem', fontFamily:'inherit', width:'16.66666%' }} align="center">
                {nation}
            </TableCell>
            <TableCell style={{ fontSize: '1.05rem', fontFamily:'inherit', width:'16.66666%' }} align="center">
                {rating}
            </TableCell>
        </TableRow>
    )
}

const genrelist = [
    {id: 0, genre: 'ALL'},
    {id: 1, genre: 'POP'},
    {id: 2, genre: 'R&B/Soul'},
    {id: 3, genre: 'Rock'},
    {id: 4, genre: 'J-POP'},
    {id: 5, genre: 'Jazz'},
    {id: 6, genre: 'HipHop'},
    {id: 7, genre: 'Electronic'},
]

const columns = [
    {id: ''},
    {id: '앨범커버'},
    {id: '앨범명'},
    {id: '아티스트'},
    {id: '국가'},
    {id: '평점'}
]

class Lookup extends React.Component {
    state = {
        isLoading: true,
        selectedGenre: -1,
        searchtext: '',
        sort_method: 0,
        value: [0, 100],
        len: 0,
        albums: []
    }

    constructor(props) {
        super(props);
        this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    }

    handleSearchTextChange(event) {
        this.setState({searchtext: event.target.value});
    }

    getAlbum = async () => {
        var album = await axios.post('http://3.35.178.151:8080/api/get/albums/all');
        const len = album.data.length;

        album = album.data.filter(a => a.isOpen === 1);
        this.setState({isLoading: false, len: len, albums: album})
    }

    componentDidMount() {
        this.getAlbum();
    }

    render() {
        const {isLoading, value, len, searchtext, selectedGenre, sort_method, albums} = this.state;
        const range_min = value[0] / 10, range_max = value[1] / 10;
        var lookup_albums = albums.filter(album => (album.rating >= range_min && album.rating <= range_max));
        
        switch (sort_method) {
            case 0:
                lookup_albums = lookup_albums.sort(function(a, b) {
                    return a.id - b.id;
                });
                break;
            case 1:
                lookup_albums = lookup_albums.sort(function(a, b) {
                    return b.id - a.id;
                });
                break;
            case 2:
                lookup_albums = lookup_albums.sort(function(a, b) {
                    return b.rating - a.rating;
                });
                break;
            default:
                lookup_albums = lookup_albums.sort(function(a, b) {
                    return a.rating - b.rating;
                });
                break;
        }

        if (selectedGenre > 0) {
            lookup_albums = lookup_albums.filter(album => album.genre.toString().includes(selectedGenre.toString()));
        }

        lookup_albums = lookup_albums.filter(album => {
            const album_name = album.name.toLowerCase().replace(/\s/g, '');
            const album_artist = album.artist.toLowerCase().replace(/\s/g, '');
            const stext = searchtext.toLowerCase().replace(/\s/g, '');

            return album_name.includes(stext) || 
                   stext.includes(album_name) || 
                   album_artist.includes(stext) || 
                   stext.includes(album_artist);
        })
        
        return (
            <div className="lookup-page-container">
                {isLoading ? (
                    <div className="loader">
                        Loading...
                    </div>
                ) : (
                <div className="lookup-page">
                    <div className="lookup-page-slider">
                        <PrettoSlider 
                        style={{
                            width:"33.33333%",
                            marginLeft:"33.33333%",
                            marginRight:"33.33333%",
                            marginTop:"3rem"
                        }}
                        valueLabelDisplay="on"
                        scale={(x) => x / 10}
                        value={value}
                        onChange={(event, newValue) => {
                            this.setState({value: newValue});
                        }}
                        defaultValue={value} 
                        />
                    </div>
                    <div className="button-groups">
                    <ButtonGroup 
                        aria-label="outlined primary button group">
                            <Button 
                            color={sort_method === 0 ? "secondary" : "primary"}
                            onClick={() => {
                                this.setState({
                                    sort_method: 0
                                });
                            }}>
                                <div className="button0">
                                    음평회 순
                                </div>
                            </Button>
                            <Button 
                            color={sort_method === 1 ? "secondary" : "primary"}
                            onClick={() => {
                                this.setState({
                                    sort_method: 1
                                });
                            }}>
                                <div className="button1">
                                    음평회 역순
                                </div>
                            </Button>
                            <Button 
                            color={sort_method === 2 ? "secondary" : "primary"}
                            onClick={() => {
                                this.setState({
                                    sort_method: 2
                                });
                            }}>
                                <div className="button2">
                                    평점 순
                                </div>
                            </Button>
                            <Button 
                            color={sort_method === 3 ? "secondary" : "primary"}
                            onClick={() => {
                                this.setState({
                                    sort_method: 3
                                });
                            }}>
                                <div className="button3">
                                    평점 역순
                                </div>
                            </Button>
                    </ButtonGroup>
                    </div>
                    <br />
                    <TextField
                        className="search-bar"
                        id="input-with-icon"
                        label="검색(앨범명, 아티스트명)"
                        onChange={this.handleSearchTextChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        style={{
                            marginLeft: '2%',
                            marginTop: '0.5%',
                            borderColor: '242d3c',
                            border: '2px solid',
                            borderRadius: '12px',
                            color: '#242d3c'
                        }}
                        onClick={() => {
                            this.setState({
                                selectedGenre: (selectedGenre + 1) % 8
                            })
                        }}
                    >
                        <span className="genre-label">
                            {selectedGenre === -1 ? '장르 선택' : genrelist[selectedGenre].genre}
                        </span>
                    </Button>
                    <br />
                    <br />
                    <div className="lookup-albums">
                        <TableContainer className="table-container">
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                style={{ 
                                                    fontFamily:'inherit', 
                                                    width:'16.66666%',
                                                    fontSize:'1.1rem',
                                                    fontWeight:'400'
                                                }}
                                                align="center"
                                            >
                                                {column.id}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lookup_albums.map((album, index) => {
                                        return (
                                            <LookupAlbum
                                                index={index}
                                                key={album.id}
                                                id={album.id}
                                                tot={len}
                                                name={album.name}
                                                artist={album.artist}
                                                nation={album.nation}
                                                rating={album.rating}
                                            />
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
                )}
            </div>
        );
    }
}

export default Lookup;