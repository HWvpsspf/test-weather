$(function(){

    let myLat = 0, myLng = 0
    let key = '';



// 검색
    $('.search').on('keypress', function(e){
        // if(e.which == 13 && !e.shiftkey){
            if(e.keyCode == 13 ){
            let key = $(this).val();
            $(this).val('');
            // console.log(keyode);

            $('.searchbox').css({
                opacity: 0,
                width:'0px'
            });
            $('.five-day').slick('unslick');
            getWeather('', '', key);
        }
    });

    //input 한글금지
    $('.search').on('blur keyup', function(){
        $(this).val($(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g,''));
    });

    // let myLat='', myLng='';
    if(key == ''){
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                myLat = position.coords.latitude;
                myLng = position.coords.longitude;
                getWeather(myLat, myLng ,'')
                // alert(`내 위치는 위도 : ${myLat}, 경도 : ${myLng} 입니다`);
            });
        }
    }
//  $(window).on('load', function(){
//         $('.wrapper').css({
//             'background-image': 'url(../images/main01.jpg)',

//         });

//     });
        $('a.btn').click(function(e){
            e.preventDefault();
            let w = $('.searchbox').css('width');
            if(w != '350px'){

            $('.searchbox').css({
                opacity:1,
                width:'350px'
            });
            $('.search').focus();
        }else{
            $('.searchbox').css({
                opacity: 0,
                width:'0px'
            });

        }
    });
    // daySlide();
});

function daySlide(){
    $('.five-day').slick({
        centerMode:true,
        centerPadding: '20px',
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: false,
        dots: false,
        autoplay: true,
        autoplaySpeed: 3000
    });
}


function getWeather(lat, lon , city ){
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    let url = "//api.openweathermap.org/data/2.5/forecast";
    let apikey = "ad95a22425131405e9fe639575058c4b";
   let wdata; // favicon
    if(city == ''){
        wdata = {
            lat: lat,
            lon: lon,
            appid: apikey,
            units: 'metric',
            // lang: 'kr',
        }
    }else{
        wdata = {
            q: city,
            appid: apikey,
            units: 'metric',
            // lang: 'kr'
        }
    }

    backgroundImg();
    console.log(wdata);
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'GET',
        data: wdata,
        success: function(data, status , xht) {
            console.log(data);

            backgroundImg(data.list[0].weather[0].icon);//background

            $('#city').html(data.city.name); //도시명

            let nowTemp = data.list[0].main.temp.toFixed(1);//현재온도
            $('#temp').html(nowTemp);

            $('#descript').html(data.list[0].weather[0].description);//설명

            $('#feels-like').html(data.list[0].main.feels_like+'°');//체감온도

            $('#temp-min').html(data.list[0].main.temp_min);//최저기온

            $('#humidity').html(data.list[0].main.humidity);//습도

            $('#temp-max').html(data.list[0].main.temp_max);//최고기온

            //해뜨는 시각,해지는 시각
            //unix time to 현재시간 => new Date (unixtime*1000)
            let sr = new Date (data.city.sunrise*1000);//해뜨는
            let ss = new Date (data.city.sunset*1000);//해지는
            sr = transTime(sr.getHours()) + ":" + sr.getMinutes();
            ss = transTime(ss.getHours()) + ":" + ss.getMinutes();
            // console.log(ss);
            $('#sunrise').html(sr);
            $('#sunset').html(ss);

            $('#windy').html(data.list[0].wind.speed)//풍속
            let str = '', ftime, iconList, listTemp;
            let week = ['일','월','화','수','목','금','토'];
            for(let i = 1; i < data.list.length; i++){

                ftime = new Date(data.list[i].dt*1000); //날짜
                ftime = ftime.getDate()+"일("+week[ftime.getDay()]+")"+
                        ftime.getHours()+"시";

                // console.log(ftime.getFullYear()+"-"+ftime.getMonth()+"-"+ ftime.getDate()+"-"+ftime.getHours(),data.list[i].dt_txt, data.list[i].weather[0].icon);
                str += '<div class="three-times">';
                str += '<div class="five-date">'+ftime+'</div>';
                str += '<div class="five-icon">';
                str += '<img src="images/'+data.list[i].weather[0].icon+'.png" alt="'+data.list[i].weather[0].icon+'">';
                str += '</div>';
                str +=  '<p class="five-temp">'+data.list[i].main.temp+'°</p>';
                str +=  '<p class="five-descript">'+data.list[i].weather[0].description+'</p>';
                str +=  '</div>';
                }
                $('.five-day').html(str);
                daySlide();
                //아이콘
                //온도

            // backgroundImg();
        },
        error:function(xhr, status, error) {
            console.log(error);
        }
    })
}


function backgroundImg(icon){

    let img;
    if(icon == '50d' || icon == '11d' || icon == '01d' ||
       icon == '02d' || icon == '03d' || icon == '04d'){
        img = './images/main06.jpg';
    }else 
    if(icon == '50n' || icon == '11n' || icon == '01n' || icon == '02n' || icon == '03n' || icon == '04n'){
        img = './images/main01.jpg';
    }else 
    if(icon == '09d' || icon == '10d'){
        img = './images/main05.jpg';
    }else 
    if(icon == '09n' || icon == '10n'){
        img = './images/main05.jpg';
    }

    $('.wrapper').css({
        'background-image': 'url('+ img +')'

    });
}

function transTime(t) {
    t = Number(t);
    console.log(t);
    if(t < 12){
        t = "AM " + t;
    }else if(t > 12 && t < 24) {
        t = "PM " + t;
    }else{
        t = "AM 00";
    }
    return t;
}

// ad95a22425131405e9fe639575058c4b

// 내 위치는 위도 : 35.1001, 경도 : 129.0432 입니다
                //    37.4027        126.3719