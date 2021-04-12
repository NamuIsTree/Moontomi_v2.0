import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Rating from '@material-ui/lab/Rating';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Filter1Icon from '@material-ui/icons/Filter1';
import Filter2Icon from '@material-ui/icons/Filter2';
import Filter3Icon from '@material-ui/icons/Filter3';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';

import './RegularEval.css'

class RegularEval extends React.Component {
    state = {
        isLoading: true,
        albums: [],
        comments: [],
        isModalOpen: false,
        ModalIndex: 0,
        ModalStar: 0,
        ModalBest1: 0,
        ModalBest2: 0,
        ModalBest3: 0,
        ModalHashedPassword: '',
        ModalPassword: '',
        ModalComment: '',
        album_id: 0,
        album_artist: '',
        album_genre: '',
        album_name: '',
        album_nation: '',
        album_list: [],
        album_year: 0,
        album_isOpen: false,
        album_comments: [],
        rating: 0.0
    }

    constructor(props) {
        super(props);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleUpdateAlbum = this.handleUpdateAlbum.bind(this);
        this.handleOpenComment = this.handleOpenComment.bind(this);
        this.handleCheckPassword = this.handleCheckPassword.bind(this);
    }

    handleOpenComment(event, index) {
        try {
            let InstantComment = this.state.album_comments;
            InstantComment[index].isOpen = 1;
            this.setState({album_comments: InstantComment});
        } catch(e) {}
    }

    handleEditComment = async () => {
        const { album_comments, ModalIndex, ModalStar, ModalBest1, ModalBest2, ModalBest3, ModalComment} = this.state;
        const obj = {
            id : album_comments[ModalIndex].id,
            star: ModalStar,
            best1: ModalBest1,
            best2: ModalBest2,
            best3: ModalBest3,
            comment: ModalComment
        };

        alert('평가 수정이 완료되었습니다.');
        const response = await axios.post('http://3.35.178.151:8080/api/change/comment', obj);
        console.log(response);
    }

    handleCheckPassword = async (event) => {
        const obj = {
            password: this.state.ModalPassword
        }
        const response = await axios.post('http://3.35.178.151:8080/api/check/password', obj);

        const targetHashedPassword = this.state.album_comments[this.state.ModalIndex].password;
        if (targetHashedPassword !== response.data) {
            alert('비밀번호가 틀렸습니다.');
        }
        else alert('비밀번호가 확인되었습니다.\n수정 완료 버튼을 눌러 평가 수정을 진행해주세요.\n평가 수정 버튼을 누른 후, 새로 고침 한 번 부탁드립니다.')

        this.setState({ModalHashedPassword: response.data});
    }

    openModal = (index) => {
        const {album_comments} = this.state;
        console.log(index);
        const star = album_comments[index].star;
        const best1 = album_comments[index].best1;
        const best2 = album_comments[index].best2;
        const best3 = album_comments[index].best3;
        const comment = album_comments[index].comment;

        this.setState({
            isModalOpen: true,
            ModalIndex: index,
            ModalStar: star,
            ModalBest1: best1,
            ModalBest2: best2,
            ModalBest3: best3,
            ModalPassword: '',
            ModalHashedPassword: '',
            ModalComment: comment
        });
    }

    closeModal = () => {
        this.setState({
            isModalOpen: false
        });
    }

    handleValueChange(event) {
        if (event.target.value > this.state.albums.length) event.target.value = this.state.albums.length;
        if (event.target.value < 1) event.target.value = 1;

        var name, artist, genre, nation, year, list, isOpen, comments, rating;

        comments = this.state.comments.filter(comment => comment.album_id === parseInt(event.target.value));

        this.state.albums.forEach(album => {
            if (album.id === parseInt(event.target.value)) {
                    name = album.name;
                    artist = album.artist;
                    genre = album.genre;
                    nation = album.nation;
                    year = album.year;
                    list = album.list.split('\n');
                    isOpen = album.isOpen;
                    rating = album.rating;
            }
        })

        comments.forEach(comment => {
            comment.isOpen = isOpen;
        })

        this.setState({
            album_id: event.target.value,
            album_name: name,
            album_artist: artist,
            album_genre: genre,
            album_nation: nation,
            album_year: year,
            album_list: list,
            album_comments: comments,
            rating: rating
        });
    }

    updateAlbum = async () => {
        let pw = prompt("관리자 비밀번호를 입력해 주세요.");
        if (pw === process.env.REACT_APP_ADMIN_PASSWORD) {
            const {album_id, rating} = this.state;
            const url = 'http://3.35.178.151:8080/api/change/album';
            const obj = {
                id: album_id,
                rating: rating
            };
            const response = await axios.post(url, obj);
            console.log(response);
            alert('업데이트 되었습니다.');
        }
        else {
            alert('비밀번호가 틀렸습니다.');
        }
    }

    handleUpdateAlbum(event) {
        event.preventDefault();

        if (window.confirm("정말 업데이트하시겠습니까?") === true) {
            this.updateAlbum()
            .then((response) => {
                console.log(response);
            })

            var target_id = this.state.albums.length + 1 - this.state.album_id;
            document.location.href = '/evaluate/' + target_id;
        }
    }

    getAlbums = async () => {
        const album = await axios.post('http://3.35.178.151:8080/api/get/albums/all');
        var id;

        if (isNaN(this.props.routeParams.id) === false) {
            id = Math.ceil(parseInt(this.props.routeParams.id));
            if (id < 1) id = 1;
            else if (id > album.data.length) id = album.data.length;
        }
        else id = 1;

        this.setState({
            album_id: album.data.length + 1 - id,
            album_name: album.data[album.data.length - id].name,
            album_artist: album.data[album.data.length - id].artist,
            album_genre: album.data[album.data.length - id].genre,
            album_nation: album.data[album.data.length - id].nation,
            album_year: album.data[album.data.length - id].year,
            album_list: album.data[album.data.length - id].list.split('\n'),
            album_isOpen: album.data[album.data.length - id].isOpen,
            albums: album.data
        })
    }

    getComments = async () => {
        const comment = await axios.post('http://3.35.178.151:8080/api/get/comments/all');
        var album_comments = comment.data.filter(c => c.album_id === parseInt(this.state.album_id));

        album_comments.forEach(comment => {
            comment.isOpen = this.state.album_isOpen;
        })

        this.setState({
            comments: comment.data,
            album_comments: album_comments,
            isLoading: false
        })
    }

    componentDidMount() {
        this.getAlbums();
        this.getComments();
    }

    render() {
        const {isLoading, isModalOpen, ModalIndex, album_id, album_name,
            ModalStar, ModalBest1, ModalBest2, ModalBest3, ModalComment, ModalPassword, ModalHashedPassword, 
            album_genre, album_comments, album_list} = this.state;
        const imgsrc = "http://3.35.178.151:3000/images/covers/" + album_id + ".jpg";
        
        var i, genrelist = [], genre = String(album_genre);
        for (i = 0; i < genre.length; i++) {
            var gi = '';
            switch (genre.charAt(i)) {
                case '1' :  gi = 'POP'; break;
                case '2' :  gi = 'R&B/Soul'; break;
                case '3' :  gi = 'Rock'; break;
                case '4' :  gi = 'J-POP'; break;
                case '5' :  gi = 'Jazz'; break;
                case '6' :  gi = 'HipHop'; break;
                case '7' :  gi = 'Electronic'; break;
                default  :  gi = 'Others'; break;
            }
            genrelist.push(gi);
        }

        var InstantData = [], total_preference = 0.0, total_rating = 0.0, cnt = 0;
        for (i = 0; i < album_list.length; i++)
            InstantData.push({ name: album_list[i], preference: 0.0 });
        
        album_comments.forEach(comment => {
            if (comment.isOpen === 1) {
                InstantData[comment.best1].preference += comment.star;
                InstantData[comment.best2].preference += comment.star * 0.7;
                InstantData[comment.best3].preference += comment.star * 0.5;
                total_preference += comment.star * 2.2;
                total_rating += comment.star;
                cnt += 1;
            }
        })

        if (cnt !== 0) total_rating /= cnt;
        else total_rating = 0.0;

        if (total_rating !== this.state.rating)
            this.setState({rating: total_rating});

        InstantData.sort(function(a, b) {
            return b.preference - a.preference;
        })

        var labels = [], data = [], top_preference = 0.0;
        InstantData.forEach(instant => {
            if (labels.length < 3) {
                labels.push(instant.name);
                data.push(instant.preference.toFixed(2));
                top_preference += instant.preference;
            }
        })

        var res = total_preference - top_preference;
        labels.push("Others");
        data.push(res.toFixed(2));

        return (
            <div className="regular-evaluation">
                {isLoading ? (
                    <div className="loader">
                        Loading Data...
                    </div>
                ) : (
                    <div className="regular-evaluation-container">
                        <div className="regular-evaluation-title">
                            <TextField
                                type="number"
                                value={album_id}
                                className="regular-evaluation-count"
                                inputProps={{
                                    pattern: '[0-9]*'
                                }}
                                name="album_id"
                                onChange={this.handleValueChange}
                            />
                            회 정기 음평회 <br/>
                        </div>
                        <div className="evaluation-album-title">
                            {album_name}
                        </div>
                        <div className="evaluation-album-artist">
                            [{this.state.album_artist}]의 {this.state.album_year}년도 앨범
                        </div>
                        <div className="genre-chips">
                        { genrelist.map((g, index) => {
                            return (<Chip key={index} size="small" label={g} variant="outlined" style={{ marginRight: "0.5rem" }}/>);
                        })}
                        </div>
                        <div className="album-information">
                            <div className="regular-evaluation-image">
                                <img src={imgsrc} alt="album cover"/>
                            </div>
                            <div className="regular-evaluation-analysis">
                                <div className="regular-evaluation-chart">
                                    트랙별 선호도 Chart (Top3) <br/> <br/>
                                <Doughnut
                                    options={{
                                        legend: {
                                            display: true,
                                            position: "bottom"
                                        }
                                    }}
                                    data = {{
                                        labels: labels,
                                        datasets: [
                                            {
                                                labels: labels,
                                                data: data,
                                                borderWidth: 2,
                                                backgroundColor: [
                                                    "rgba(238, 102, 121, 1)",
                                                    "rgba(98, 181, 229, 1)",
                                                    "rgba(255, 198, 0, 1)",
                                                    "rgba(0, 0, 0, 0.8)"
                                                ],
                                                fill: true
                                            }
                                        ] 
                                    }}
                                />
                                </div>
                                <div className="regular-evaluation-rating">
                                    ★{total_rating.toFixed(1) + '     '}     
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: '#2e8b57', color: '#ffffff' }}
                                        onClick={this.handleUpdateAlbum}
                                    >
                                        UPDATE
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="album-comments-container">
                            {album_comments.map((comment, index) => {
                                return (
                                    <div key= {comment.id} className="album-comment">
                                        <IconButton
                                                aria-label="edit comment"
                                                className="edit-button"
                                                onClick={(event) => {
                                                    this.openModal(index);
                                                }}
                                                style={{
                                                    marginTop: '-0.5rem'
                                                }}
                                            >
                                            <EditRoundedIcon />
                                        </IconButton>
                                        <span className="album-comment-name">
                                            [{comment.nickname}]
                                        </span>
                                        <span className="album-comment-name-additional">
                                            님의 평가입니다. (#{comment.id})
                                            <Modal
                                                open={isModalOpen}
                                                onClose={this.closeModal}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Fade 
                                                    in={isModalOpen}
                                                    style={{
                                                        backgroundColor: 'white',
                                                        border: '2px solid #000',
                                                        width: '30%',
                                                        padding: '3rem'
                                                    }}
                                                >
                                                    <div className="modal-edit-comment">
                                                        <center>
                                                            평가 수정(#{album_comments[ModalIndex].id}) <br/> <br/>
                                                            [{album_comments[ModalIndex].nickname}]님의 평가를 수정합니다. <br/> <br/>
                                                            1. 평점 <br/> <br/>
                                                            <Rating
                                                                name="star-rating"
                                                                size="large"
                                                                value={ModalStar / 2}
                                                                precision={0.5}
                                                                onChange={(event, newValue) => {
                                                                    this.setState({ModalStar: newValue * 2})
                                                                }}
                                                            /> <br/> <br/>

                                                            2. BEST 3 <br/> <br/>
                                                            <Autocomplete
                                                                id="combo-box-best1"
                                                                className="combo-box-best1"
                                                                fullWidth={true}
                                                                options={album_list}
                                                                getOptionLabel={(option) => option}
                                                                value={album_list[ModalBest1]}
                                                                renderInput={(params) => <TextField {...params} style={{textAlign: 'center'}} value={params.id} label="Best1" variant="outlined" />}
                                                                onChange={(event, newValue)=> {
                                                                    try {
                                                                        const idx = album_list.indexOf(newValue);
                                                                        this.setState({ModalBest1: idx});
                                                                    } catch(e) {}
                                                                }}
                                                            /> <br/>
                                                            <Autocomplete
                                                                id="combo-box-best2"
                                                                className="combo-box-best2"
                                                                fullWidth={true}
                                                                options={album_list}
                                                                getOptionLabel={(option) => option}
                                                                value={album_list[ModalBest2]}
                                                                renderInput={(params) => <TextField {...params} style={{textAlign: 'center'}} value={params.id} label="Best1" variant="outlined" />}
                                                                onChange={(event, newValue)=> {
                                                                    try {
                                                                        const idx = album_list.indexOf(newValue);
                                                                        this.setState({ModalBest2: idx});
                                                                    } catch(e) {}
                                                                }}
                                                            /> <br/>
                                                            <Autocomplete
                                                                id="combo-box-best3"
                                                                className="combo-box-best3"
                                                                fullWidth={true}
                                                                options={album_list}
                                                                getOptionLabel={(option) => option}
                                                                value={album_list[ModalBest3]}
                                                                renderInput={(params) => <TextField {...params} style={{textAlign: 'center'}} value={params.id} label="Best1" variant="outlined" />}
                                                                onChange={(event, newValue)=> {
                                                                    try {
                                                                        const idx = album_list.indexOf(newValue);
                                                                        this.setState({ModalBest3: idx});
                                                                    } catch(e) {}
                                                                }}
                                                            /> <br/>
                                                            3. 한줄평 <br/> <br/>
                                                            <TextField
                                                                fullWidth={true}
                                                                multiline
                                                                variant="outlined"
                                                                rows={4}
                                                                value={ModalComment}
                                                                onChange={(event)=> {
                                                                    try {
                                                                        this.setState({ModalComment: event.target.value});
                                                                    } catch(e) {}
                                                                }}
                                                            /> <br/> <br/>
                                                            4. 비밀번호 <br/> <br/>
                                                            <TextField
                                                                label="비밀번호"
                                                                required
                                                                variant="outlined"
                                                                value={ModalPassword}
                                                                onChange={(event) => {
                                                                    try {
                                                                        this.setState({ModalPassword: event.target.value});
                                                                    } catch(e) {}
                                                                }}
                                                            /> 
                                                            <br/> <br/>
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                onClick={this.handleCheckPassword}
                                                            >
                                                                비밀번호 확인
                                                            </Button>
                                                            <Button
                                                                color="secondary"
                                                                variant="contained"
                                                                disabled={(ModalHashedPassword === album_comments[ModalIndex].password) ? false : true}
                                                                style={{ marginLeft:'0.5rem' }}
                                                                onClick={this.handleEditComment}
                                                            >
                                                                수정 완료
                                                            </Button>
                                                        </center>
                                                    </div>
                                                </Fade>
                                            </Modal>
                                        </span>
                                        <div className="comment-detail">
                                        { comment.isOpen === 1 ? (
                                            <div className="opened-comment">
                                                <div className="album-comment-rating">
                                                    <Rating name="rating-star" value={comment.star / 2} precision={0.5} readOnly />
                                                </div>
                                                <div className="best-3">
                                                    <List>
                                                        Top 3
                                                        <ListItem
                                                            dense={true}
                                                        >
                                                            <ListItemIcon>
                                                                <Filter1Icon style={{ color: '#ffb400' }} />
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                <span className="best1">
                                                                    {album_list[comment.best1]}
                                                                </span>
                                                            </ListItemText>
                                                        </ListItem>
                                                        <ListItem
                                                            dense={true}
                                                        >
                                                            <ListItemIcon>
                                                                <Filter2Icon style={{ color: '4a4f5a' }} />
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                <span className="best2">
                                                                    {album_list[comment.best2]}
                                                                </span>
                                                            </ListItemText>
                                                        </ListItem>
                                                        <ListItem
                                                            dense={true}
                                                        >
                                                            <ListItemIcon>
                                                                <Filter3Icon style={{ color: '6e3732' }} />
                                                            </ListItemIcon>
                                                            <ListItemText>
                                                                <span className="best3">
                                                                    {album_list[comment.best3]}
                                                                </span>
                                                            </ListItemText>
                                                        </ListItem>
                                                    </List>
                                                </div>
                                                <div className="one-line-comment">
                                                    <span className="one-line-comment-detail">
                                                        {'<'}앨범 한줄평{'>'}
                                                    </span>
                                                    <br/> <br/>
                                                    <span className="one-line-comment-text">
                                                        {comment.comment}
                                                    </span>
                                                </div>
                                            </div>
                                            ) : (
                                                <div className="not-opened-comment">
                                                    <center>
                                                        <br/>다른 사람의 평가를 미리 보지 않도록 합시다.<br/>
                                                        <br/>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            className="open-button"
                                                            startIcon={<LockOpenIcon />}
                                                            onClick={(event) => {
                                                                console.log(index);
                                                                this.handleOpenComment(event, index);
                                                            }}
                                                        >
                                                            OPEN
                                                        </Button>
                                                    </center>
                                                </div>
                                            )
                                        }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default RegularEval;