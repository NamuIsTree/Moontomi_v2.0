import React from 'react';
import './Banner.css';

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const Banner = () => {
    return (
        <section className="Banner-section">
            <div className="ad-clickmon">
                { isMobile() ?
                    <iframe width="320" height="100" allowtransparency="true" src="https://mtab.clickmon.co.kr/pop/wp_m_320_100.php?PopAd=CM_M_1003067%7C%5E%7CCM_A_1087713%7C%5E%7CAdver_M_1046207&mon_rf=REFERRER_URL" frameborder="0" scrolling="no"></iframe>
                    :
                    <iframe width="728" height="90" allowtransparency="true" src="https://tab2.clickmon.co.kr/pop/wp_ad_728.php?PopAd=CM_M_1003067%7C%5E%7CCM_A_1087713%7C%5E%7CAdver_M_1046207&mon_rf=REFERRER_URL" frameborder="0" scrolling="no"></iframe>
                }
            </div>
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