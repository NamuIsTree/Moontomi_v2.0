import React from 'react';
import axios from 'axios';

import BorderColorIcon from '@material-ui/icons/BorderColor';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import Rating from '@material-ui/lab/Rating';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AlbumIcon from '@material-ui/icons/Album';
import ViewListIcon from '@material-ui/icons/ViewList';
import Divider from '@material-ui/core/Divider';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import ReactPlayer from 'react-player';
import './ReviewTab.css';

const admin_key = process.env.REACT_APP_ADMIN_PASSWORD;

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

class ReviewTab extends React.Component {
    state = {
        isLoading: true,
        reviews: [],
        filteredReviews: [],
        isModalOpen: false,
        isReviewOpen: false,
        isTrackOpened: false,
        sort_method: 0,
        value:[0, 50],
        reviewIndex: 0,
        text: '',
        tracklist: '',
        title: '',
        rating: 0.0,
        album_year: 1999,
        album_month: 1,
        album_day: 1,
        album_genre: 1,
        artist: '',
        counter: 0,
        password: '',
        best1: 0,
        best2: 0,
        best3: 0,
        youtube: ''
    }

    handlePostReview = async () => {
        if (this.state.password === admin_key) {
            const { text, tracklist, title, rating, album_year, album_month,
                    album_day, artist, best1, best2, best3, album_genre, 
                    comment, youtube } = this.state;

            var nowDate = new Date();
            const date = nowDate.getFullYear() + '/' + (nowDate.getMonth() + 1) + '/' + nowDate.getDate();

            const obj = {
                text: text,
                tracklist: tracklist,
                title: title,
                rating: rating,
                album_year: album_year,
                album_month: album_month,
                album_day: album_day,
                artist: artist,
                date: date,
                best1: best1,
                best2: best2,
                best3: best3,
                genre: album_genre,
                comment: comment,
                youtube: youtube
            }
            
            alert('포스트 되었습니다.');
            const response = await axios.post('http://3.35.178.151:8080/api/upload/review', obj);
            console.log(response);
        }
        else {
            alert('비밀번호가 틀렸습니다.')
        }
    }

    getReview = async () => {
        const reviews = await axios.post('http://3.35.178.151:8080/api/get/reviews')
        this.setState({reviews: reviews.data, filteredReviews: reviews.data, isLoading: false});
    }

    componentDidMount() {
        this.getReview();
    }

    openModal = () => {
        this.setState({
            isModalOpen: true,
            text: '',
            tracklist: '',
            title: '',
            rating: 0.0,
            album_year: 1999,
            album_month: 1,
            album_day: 1,
            artist: '',
            date: '',
            best1: 0,
            best2: 0,
            best3: 0,
            genre: 1,
            comment: '',
            youtube: ''
        });
    }

    closeModal = () => {
        this.setState({isModalOpen: false});
    }

    openReview = (index) => {
        this.setState({
            isReviewOpen: true,
            isTrackOpened: false,
            reviewIndex: index
        })
    }

    closeReview = () => {
        this.setState({
            isReviewOpen: false
        })
    }

    render() {
        const {isLoading, isModalOpen, isReviewOpen, isTrackOpened, sort_method, value, reviews, filteredReviews, reviewIndex, album_year, album_month, album_day, album_genre} = this.state;
        var tracklist = [];
        
        if (isReviewOpen) {
            tracklist = filteredReviews[reviewIndex].tracklist.split('\n');
        }

        var range_min = value[0] / 10, range_max = value[1] / 10;

        console.log(window.innerWidth);

        return (
            <div className="review-container">
                {isLoading ? (
                    <div className="loader">
                        Loading...
                    </div>
                ) : (
                    <div>
                        {isReviewOpen ? (
                            <div className="review-opened">
                                <div className="review">
                                    <div className="album-detail">
                                        <div className="review-order">
                                            {filteredReviews[reviewIndex].id}번째 Review입니다. ({filteredReviews[reviewIndex].date} 작성)
                                        </div>
                                        <div className="review-title">
                                            {filteredReviews[reviewIndex].title}
                                        </div>
                                        <Rating
                                            readOnly
                                            value={filteredReviews[reviewIndex].rating}
                                            precision={0.5}
                                            style={{
                                                marginTop: '-1rem'
                                            }}
                                            size="large"
                                        /> <br/> <br/>
                                        <div className="review-album-detail">
                                            <div className="review-album-artist-date">
                                                <div className="album-artist">
                                                    [{filteredReviews[reviewIndex].artist}]의 앨범 <br/>
                                                </div>
                                                <div className="album-date">
                                                    {filteredReviews[reviewIndex].album_year}년 {filteredReviews[reviewIndex].album_month}월 {filteredReviews[reviewIndex].album_day}일 발매
                                                </div>
                                            </div>
                                        </div>
                                        <img src={'http://3.35.178.151:3000/images/review/'+filteredReviews[reviewIndex].id+'.jpg'} alt="album cover"/>
                                    </div>
                                    <br/>
                                    <Divider variant="middle" />
                                    <div className="tracklist">
                                        <List component="nav">
                                            <ListItem 
                                                dense={true}
                                                button
                                                onClick={() => {
                                                    this.setState({isTrackOpened : !this.state.isTrackOpened})
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <ViewListIcon style={{ color: '#242d3c' }}/>
                                                </ListItemIcon>
                                                <ListItemText primary={
                                                    <span>
                                                        Track List
                                                    </span>
                                                }/>
                                                {isTrackOpened ? <ExpandLess /> : <ExpandMore />}
                                            </ListItem>
                                            <Collapse in={isTrackOpened} timeout="auto" unmountOnExit>
                                            {tracklist.map((track, index) => {
                                                if (index === filteredReviews[reviewIndex].best1) {
                                                    return (
                                                        <div key={index}>
                                                        <ListItem button dense={true}>
                                                            <ListItemIcon>
                                                                <StarIcon style={{ color:'#ff8080' }}/>
                                                            </ListItemIcon>
                                                            <ListItemText primary={
                                                                <span>
                                                                    <span style={{ color: '#ff8080' }}>
                                                                        {track}
                                                                    </span>
                                                                    {'   '}
                                                                    <span style={{ color: '#ff3333', fontSize: '0.7rem' }}>
                                                                        (추천!)
                                                                    </span>
                                                                </span>
                                                            }/>
                                                        </ListItem>
                                                        </div>
                                                    );
                                                }
                                                else if (index === filteredReviews[reviewIndex].best2) {
                                                    return (
                                                        <div key={index}>
                                                        <ListItem button dense={true}>
                                                            <ListItemIcon>
                                                                <StarHalfIcon style={{ color:'#ff8080' }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={
                                                                <span>
                                                                    <span style={{ color: '#ff8080' }}>
                                                                        {track}
                                                                    </span>
                                                                    {'   '}
                                                                    <span style={{ color: '#ff3333', fontSize: '0.7rem' }}>
                                                                        (추천!)
                                                                    </span>
                                                            </span>
                                                            }/>
                                                        </ListItem>
                                                        </div>
                                                    );
                                                }
                                                else if (index === filteredReviews[reviewIndex].best3) {
                                                    return (
                                                        <div key={index}>
                                                        <ListItem button dense={true}>
                                                            <ListItemIcon>
                                                                <StarBorderIcon style={{ color: '#ff8080' }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={
                                                                <span>
                                                                    <span style={{ color: '#ff8080' }}>
                                                                        {track}
                                                                    </span>
                                                                    {'   '}
                                                                    <span style={{ color: '#ff3333', fontSize: '0.7rem' }}>
                                                                        (추천!)
                                                                    </span>
                                                            </span>
                                                            }/>
                                                        </ListItem>
                                                        </div>
                                                    );
                                                }
                                                else {
                                                    return (
                                                        <div key={index}>
                                                        <ListItem button dense={true}>
                                                            <ListItemIcon>
                                                                <AlbumIcon style={{ color:'#242d3c' }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={
                                                                <span style={{ color: '#242d3c' }}>
                                                                    {track}
                                                                </span>
                                                            }/>
                                                        </ListItem>
                                                        </div>
                                                    );
                                                }
                                            })}
                                            </Collapse>
                                        </List>
                                        <Divider variant="middle" />
                                        <br/>
                                        <div className="review-text">
                                            {filteredReviews[reviewIndex].text}
                                        </div>
                                        <br/>
                                        <div className="video-wrapper">
                                            <ReactPlayer
                                                url={filteredReviews[reviewIndex].youtube}
                                                playing
                                                loop={true}
                                                controls={true}
                                                volume={0.8}
                                                width="320px"
                                                height="180px"
                                                style={{
                                                    display: 'inline-block'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <center>
                                    <Button
                                    variant="contained"
                                    color="secondary"
                                    style= {{
                                        marginTop: '1.5rem'
                                    }}
                                    onClick={() => {
                                        this.setState({isReviewOpen: false});
                                    }}
                                    >목록으로</Button>
                                </center>
                            </div>
                        ) : (
                        <div>
                            <div className="write-button">
                            <Button
                                variant="contained"
                                style={{
                                    marginTop: '1rem',
                                    marginRight: '2rem',
                                    marginBottom: '0.2rem',
                                    float: 'right'
                                }}
                                color="default"
                                className="write-button"
                                startIcon={<BorderColorIcon/>}
                                onClick={this.openModal}
                            >글쓰기</Button>
                            </div>
                            <Modal
                                open={isModalOpen}
                                onClose={this.closeModal}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Fade
                                    in={isModalOpen}
                                    style={{
                                        backgroundColor: 'white',
                                        border: '2px solid #000',
                                        width: '80%',
                                        padding: '1.5rem',
                                    }}
                                >
                                    <div className="write-modal">
                                        <center>
                                        1. 앨범명, 아티스트<br/><br/>
                                        <TextField
                                            label="앨범명"
                                            variant="outlined"
                                            onChange={(event) => {
                                                this.setState({title: event.target.value});
                                            }}
                                        />
                                        <TextField
                                            label="아티스트"
                                            style={{marginLeft:'1rem'}}
                                            variant="outlined"
                                            onChange={(event) => {
                                                this.setState({artist: event.target.value});
                                            }}
                                        /><br/><br/>
                                        2. 앨범 출시 년도 및 앨범 장르<br/> <br/>
                                        <TextField
                                            label="YYYY"
                                            value={album_year}
                                            style={{
                                                width:'60px'
                                            }}
                                            type="number"
                                            inputProps={{
                                                pattern: '[0-9]*'
                                            }}
                                            onChange={(event) => {
                                                this.setState({album_year: parseInt(event.target.value)});
                                            }}
                                        />
                                        <span className="date-slash">
                                            {'/'}
                                        </span>
                                        <TextField
                                            label="MM"
                                            value={album_month}
                                            style={{
                                                width:'40px'
                                            }}
                                            type="number"
                                            inputProps={{
                                                pattern: '[0-9]*'
                                            }}
                                            onChange={(event) => {
                                                this.setState({album_month: parseInt(event.target.value)});
                                            }}
                                        />
                                        <span className="date-slash">
                                            {'/'}
                                        </span>
                                        <TextField
                                            label="DD"
                                            value={album_day}
                                            style={{
                                                width:'40px'
                                            }}
                                            type="number"
                                            inputProps={{
                                                pattern: '[0-9]*'
                                            }}
                                            onChange={(event) => {
                                                this.setState({album_day: parseInt(event.target.value)});
                                            }}
                                        /> 
                                        <TextField
                                            label="장르"
                                            value={album_genre}
                                            style={{
                                                width: '40px',
                                                marginLeft: '1rem'
                                            }}
                                            type="number"
                                            inputProps={{
                                                pattern: '[0-9]*'
                                            }}
                                            onChange={(event) => {
                                                this.setState({album_genre: parseInt(event.target.value)});
                                            }}
                                        /> <br/><br/>
                                        3. 트랙리스트 <br/><br/>
                                        <TextField
                                            label="앨범 트랙"
                                            multiline
                                            rows={4}
                                            style={{width:'60%'}}
                                            variant="outlined"
                                            onChange={(event) => {
                                                this.setState({tracklist: event.target.value});
                                            }}
                                        /> <br/><br/>
                                        4. Best3 (트랙 번호)<br/>
                                        <TextField
                                            label="Best1"
                                            style={{
                                                width:'40px'
                                            }}
                                            type="number"
                                            inputProps={{
                                                pattern: '[0-9]*'
                                            }}
                                            onChange={(event) => {
                                                this.setState({best1: parseInt(event.target.value) - 1});
                                            }}
                                        />
                                        <TextField
                                            label="Best2"
                                            style={{
                                                marginLeft: '0.5rem',
                                                width:'40px'
                                            }}
                                            type="number"
                                            inputProps={{
                                                pattern: '[0-9]*'
                                            }}
                                            onChange={(event) => {
                                                this.setState({best2: parseInt(event.target.value) - 1});
                                            }}
                                        />
                                        <TextField
                                            label="Best3"
                                            style={{
                                                marginLeft: '0.5rem',
                                                width:'40px'
                                            }}
                                            type="number"
                                            inputProps={{
                                                pattern: '[0-9]*'
                                            }}
                                            onChange={(event) => {
                                                this.setState({best3: parseInt(event.target.value) - 1});
                                            }}
                                        /> <br/><br/>
                                        5. 별점 및 본문 작성 <br/>
                                        <Rating
                                            name="star-rating"
                                            size="large"
                                            value={this.state.rating}
                                            precision={0.5}
                                            onChange={(event, newValue) => {
                                                this.setState({rating: newValue});
                                            }}
                                        /> <br/>
                                        <TextField
                                            label="본문"
                                            multiline
                                            style={{width:'60%'}}
                                            rows={5}
                                            variant="outlined"
                                            onChange={(event) => {
                                                this.setState({text: event.target.value});
                                            }}
                                        /> <br/><br/>
                                        6. 한줄평 및 Youtube Link<br/><br/>
                                        <TextField
                                            label="한줄평"
                                            style={{width:'60%'}}
                                            variant="outlined"
                                            onChange={(event) => {
                                                this.setState({comment: event.target.value});
                                            }}
                                        /> <br/> <br/>
                                        <TextField 
                                            label="Youtube Link"
                                            style={{width:'60%'}}
                                            variant="outlined"
                                            onChange={(event) => {
                                                this.setState({youtube: event.target.value});
                                            }}
                                        /> <br/> <br/>
                                        <TextField
                                            label="관리자 비밀번호"
                                            type="password"
                                            onChange={(event) => {
                                                this.setState({password: event.target.value});
                                            }}
                                        /> 
                                        <Button
                                            variant="contained"
                                            style={{
                                                marginTop:'0.5rem',
                                                marginLeft: '1rem'
                                            }}
                                            color="secondary"
                                            onClick={this.handlePostReview}
                                        >
                                            포스트
                                        </Button>
                                        </center>
                                    </div>
                                </Fade>
                            </Modal>
                            <div className="controls">
                                <PrettoSlider 
                                    style={{
                                        width:"33.33333%",
                                        marginLeft:"33.33333%",
                                        marginRight:"33.33333%",
                                        marginTop:"3rem"
                                    }}
                                    valueLabelDisplay="on"
                                    scale={(x) => x / 10}
                                    max={50}
                                    value={value}
                                    onChange={(event, newValue) => {
                                        this.setState({value: newValue});
                                    }}
                                    defaultValue={value} 
                                />
                                <Button 
                                    variant="contained"
                                    style={{ 
                                        backgroundColor: '#242d3c', 
                                        color: '#ffffff',
                                        marginBottom: '1rem' 
                                    }}
                                    onClick={() => {
                                        var f_Reviews = reviews.filter(r => (r.rating >= range_min && r.rating <= range_max));
                                        switch(sort_method) {
                                            case 0:
                                                f_Reviews = f_Reviews.sort(function(a, b) {
                                                    return a.id - b.id;
                                                });
                                                break;
                                            case 1:
                                                f_Reviews = f_Reviews.sort(function(a, b) {
                                                    return b.id - a.id;
                                                })
                                                break;
                                            case 2:
                                                f_Reviews = f_Reviews.sort(function(a, b) {
                                                    return b.rating - a.rating;
                                                });
                                                break;
                                            case 3:
                                                f_Reviews = f_Reviews.sort(function(a, b) {
                                                    return a.rating - b.rating;
                                                });
                                                break;
                                            default:
                                                break;
                                        }
                                        this.setState({filteredReviews: f_Reviews});
                                    }}
                                >평점 범위 반영</Button>
                                <br/>
                                <ButtonGroup 
                                    aria-label="outlined primary button group"
                                >
                                    <Button 
                                    color={sort_method === 0 ? "secondary" : "primary"}
                                    onClick={() => {
                                        var f_Reviews = reviews.filter(review => (review.rating >= range_min && review.rating <= range_max));
                                        f_Reviews = f_Reviews.sort(function(a, b) {
                                            return a.id - b.id;
                                        });
                                        this.setState({
                                            sort_method: 0,
                                            filteredReviews: f_Reviews
                                        });
                                    }}>
                                        <div className="button0">
                                            작성 순
                                        </div>
                                    </Button>
                                    <Button 
                                    color={sort_method === 1 ? "secondary" : "primary"}
                                    onClick={() => {
                                        var f_Reviews = reviews.filter(review => (review.rating >= range_min && review.rating <= range_max));
                                        f_Reviews = f_Reviews.sort(function(a, b) {
                                            return b.id - a.id;
                                        });
                                        this.setState({
                                            sort_method: 1,
                                            filteredReviews: f_Reviews
                                        });
                                    }}>
                                        <div className="button1">
                                            작성 역순
                                        </div>
                                    </Button>
                                    <Button 
                                    color={sort_method === 2 ? "secondary" : "primary"}
                                    onClick={() => {
                                        var f_Reviews = reviews.filter(review => (review.rating >= range_min && review.rating <= range_max));
                                        f_Reviews = f_Reviews.sort(function(a, b) {
                                            return b.rating - a.rating;
                                        });
                                        this.setState({
                                            sort_method: 2,
                                            filteredReviews: f_Reviews
                                        });
                                    }}>
                                        <div className="button2">
                                            평점 순
                                        </div>
                                    </Button>
                                    <Button 
                                    color={sort_method === 3 ? "secondary" : "primary"}
                                    onClick={() => {
                                        var f_Reviews = reviews.filter(review => (review.rating >= range_min && review.rating <= range_max));
                                        f_Reviews = f_Reviews.sort(function(a, b) {
                                            return a.rating - b.rating;
                                        });
                                        this.setState({
                                            sort_method: 3,
                                            filteredReviews: f_Reviews
                                        });
                                    }}>
                                        <div className="button3">
                                            평점 역순
                                        </div>
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <div className="pre-review-section">
                                {filteredReviews.map((review, index) => {
                                    const imgsrc ="linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(http://3.35.178.151:3000/images/review/"+review.id+".jpg)"
                                    return (
                                            <div key={review.id} className="pre-review-wrapper">
                                                <div className="pre-review"
                                                    style={{
                                                        backgroundImage: imgsrc
                                                    }}
                                                    onClick={() => {
                                                        this.openReview(index);
                                                    }}
                                                >
                                                    <div className="pre-review-content">
                                                        <div className="pre-review-title">
                                                            {review.title}
                                                        </div>
                                                        <div className="pre-review-artist">
                                                            {review.artist}
                                                        </div>
                                                        <div className="pre-review-rating">
                                                            <Rating
                                                                value={review.rating}
                                                                precision={0.5}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="pre-review-comment">
                                                            <br/>{"\""+review.comment+"\""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    );
                                })}
                            </div>
                        </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default ReviewTab;