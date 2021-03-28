import React from 'react';
import './Banner.css';

const Banner = () => {
    return (
        <section className="Banner-section">
            <div className="Banner">
                <div className="Detail-Kim">
                    제작자 : 김주현 <br />
                    서강대학교 컴퓨터공학과 <br />
                    email : woonikim69@gmail.com <br />
                    github : github.com/NamuIsTree <br />
                </div>
                <div className="Detail-Moon">
                    운영자 : 문형규 <br />
                    한남대학교 미술교육과 <br />
                    Blog : https://blog.naver.com/hk12062006
                </div>
            </div>
        </section>
    )
}

export default Banner;
