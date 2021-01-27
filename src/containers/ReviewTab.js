import React from 'react';
import axios from 'axios';

import BorderColorIcon from '@material-ui/icons/BorderColor';
import Button from '@material-ui/core/Button';
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

import ReactPlayer from 'react-player';
import './ReviewTab.css';

const admin_key = process.env.REACT_APP_ADMIN_PASSWORD;

class ReviewTab extends React.Component {
    state = {
        isLoading: true,
        reviews: [],
        isModalOpen: false,
        isReviewOpen: false,
        isTrackOpened: false,
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
        this.setState({reviews: reviews.data, isLoading: false});
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
        const {isLoading, isModalOpen, isReviewOpen, isTrackOpened, reviews, reviewIndex, album_year, album_month, album_day, album_genre} = this.state;
        var tracklist = [];
        
        if (isReviewOpen) {
            tracklist = reviews[reviewIndex].tracklist.split('\n');
            console.log(tracklist);
        }
        
        console.log(admin_key);

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
                                            {reviews[reviewIndex].id}번째 Review입니다. ({reviews[reviewIndex].date} 작성)
                                        </div>
                                        <div className="review-title">
                                            {reviews[reviewIndex].title}
                                        </div>
                                        <Rating
                                            readOnly
                                            value={reviews[reviewIndex].rating}
                                            precision={0.5}
                                            style={{
                                                marginTop: '-1rem'
                                            }}
                                            size="large"
                                        /> <br/> <br/>
                                        <div className="review-album-detail">
                                            <div className="review-album-artist-date">
                                                <div className="album-artist">
                                                    [{reviews[reviewIndex].artist}]의 앨범 <br/>
                                                </div>
                                                <div className="album-date">
                                                    {reviews[reviewIndex].album_year}년 {reviews[reviewIndex].album_month}월 {reviews[reviewIndex].album_day}일 발매
                                                </div>
                                            </div>
                                        </div>
                                        <img src={'http://3.35.178.151:3000/images/review/'+reviews[reviewIndex].id+'.jpg'} alt="album cover"/>
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
                                                if (index === reviews[reviewIndex].best1) {
                                                    return (
                                                        <div>
                                                        <ListItem button dense={true}>
                                                            <ListItemIcon>
                                                                <StarIcon style={{ color:'#ff8080' }}/>
                                                            </ListItemIcon>
                                                            <ListItemText primary={
                                                                <span style={{ color: '#ff8080' }}>
                                                                    {track}
                                                                </span>
                                                            }/>
                                                        </ListItem>
                                                        </div>
                                                    );
                                                }
                                                else if (index === reviews[reviewIndex].best2) {
                                                    return (
                                                        <div>
                                                        <ListItem button dense={true}>
                                                            <ListItemIcon>
                                                                <StarHalfIcon style={{ color:'#ff8080' }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={
                                                                <span style={{ color: '#ff8080' }}>
                                                                    {track}
                                                                </span>
                                                            }/>
                                                        </ListItem>
                                                        </div>
                                                    );
                                                }
                                                else if (index === reviews[reviewIndex].best3) {
                                                    return (
                                                        <div>
                                                        <ListItem button dense={true}>
                                                            <ListItemIcon>
                                                                <StarBorderIcon style={{ color: '#ff8080' }} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={
                                                                <span style={{ color: '#ff8080' }}>
                                                                    {track}
                                                                </span>
                                                            }/>
                                                        </ListItem>
                                                        </div>
                                                    );
                                                }
                                                else {
                                                    return (
                                                        <div>
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
                                            {reviews[reviewIndex].text}
                                        </div>
                                        <br/>
                                        <div className="video-wrapper">
                                            <ReactPlayer
                                                url={reviews[reviewIndex].youtube}
                                                playing
                                                loop={true}
                                                controls={false}
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
                            <Button
                                variant="contained"
                                style={{
                                    marginTop: '1rem',
                                    marginRight: '2rem',
                                    float: 'right'
                                }}
                                color="default"
                                className="write-button"
                                startIcon={<BorderColorIcon/>}
                                onClick={this.openModal}
                            >글쓰기</Button>
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
                            <div className="pre-review-section">
                                {reviews.map((review, index) => {
                                    const imgsrc ="linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(http://3.35.178.151:3000/images/review/"+review.id+".jpg)"
                                    return (
                                            <div className="pre-review-wrapper">
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