
const developerKey_google = 'AIzaSyB7ae05ZDWxcvkjzZFPpgjmoRFQ_C89ZQg';
const clientId_google = '686887041548-hk26nfacbcflql93pk2nvikh9jv915sj.apps.googleusercontent.com';
const scope =  'https://www.googleapis.com/auth/drive.file ' + 
                'https://www.googleapis.com/auth/drive.readonly' 
                ;
const developerKey_dropbox = '42e6d76s4q98qf1';
const clientId_dropbox = 'alys2n5xor27of2';

let GoogleAuth;
let access_token;
var folder_id;
var books_list = [];
var settings = {};
var service = '';


class Book{
    constructor(author, title, content, id, time, img){
        this.author = author;
        this.title = title;
        this.id = id;
        this.content = content;
        this.all_doc = content;
        this.time = time;
        this.img = img;
    }


    get(id){
        if (this.id === id)
            return true;
        return false;
    }


    show() {
        let parser = new DOMParser();
        let xmlDOM = parser.parseFromString(this.all_doc, 'application/xml');
        this.content = xmlDOM.getElementsByTagName('body')[0].innerHTML;
        let titles = xmlDOM.getElementsByTagName('title');

        this.header ='<div id="oglavlenie">';
        for (var i = 0; i < titles.length; i++) {
            this.header += '<a href=#'+i+'>' + titles[i].getElementsByTagName('p')[0].innerHTML +'</a><br>'
            this.content = this.content.replace('<title','<h2 id ='+i+'');
            this.content = this.content.replace('</title>','</h2>');
        }
        this.header +='</div id="oglavlenie">';
        var ul = document.getElementById('libary');
        ul.classList.add('invisible');
        var book1 = document.getElementsByClassName('show_book')[0];
        book1.classList.remove('invisible');
        var book = document.getElementsByClassName('book-field')[0];
        var info_icon = document.getElementById('info_icon');
        book.classList.remove('invisible');
        book.innerHTML = this.header + this.content;
        book.id = this.id;
        info_icon.classList.remove('invisible');
        getCurPage();
        getTotalPages();
        showReadLine();
    }


    getPlaceOfElem(elem){
        let parser = new DOMParser();
        let xmlDOM = parser.parseFromString(this.all_doc, 'application/xml');
        var sections = xmlDOM.getElementsByTagName('section');
        var all_p = [];
        for (var i = 0; i < sections.length; i++) {
            all_p.push(sections[i].getElementsByTagName('p'));
        }
        console.log(elem.textContent);
        for (var i = 1; i < all_p.length; i++) {
            for (var j = 0; j < all_p[i].length; j++) {
                if(all_p[i][j].textContent === elem.textContent)
                    return [i, j];
            }
        }
    }


    setPage(section_id, p_id) {
        var contents = document.getElementsByClassName('book-field')[0];
        var sections =  contents.getElementsByTagName('section');
        var all_p = sections[section_id].getElementsByTagName('p');
        if(p_id >= all_p.length)
            p_id = all_p.length -1;
        all_p[p_id].classList.toggle('picked');
        var left = all_p[p_id].getBoundingClientRect();
        var book = document.getElementsByClassName('show_book')[0];
        var right = Number(contents.style.right.replace('px',''));
        var elem_pos = all_p[p_id].getBoundingClientRect().left;
        if(elem_pos > 0) {
            while(elem_pos > window.innerWidth){
                elem_pos -= window.innerWidth;
                right += window.innerWidth;
            }
        }
        else {
            while(elem_pos + window.innerWidth < window.innerWidth){
                elem_pos += window.innerWidth;
                right -= window.innerWidth;
            }
        }
        contents.style.right = right +'px';
        change_num = document.getElementById('cur_page');
        change_num.innerHTML = right/innerWidth + 1;
        procent_of_read = (Number(change_num.innerHTML ) - 1)/document.getElementById('total_pages').innerHTML;
        document.cookie = cur_page.id +'='+Math.floor(procent_of_read * 10000);
        updateSettings(cur_page.id, Math.floor(procent_of_read * 10000));
        document.cookie = 'current_book=' + contents.id;
        updateSettings('current_book', contents.id);
        var translate = document.getElementById('translate_page');
        translate.classList.toggle('active');
        contents.removeEventListener('click', handleClick);
        showReadLine();
    }

}


function onSingIn() {
    const authBt = document.getElementById('googleDrive');
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker');
    const menu = document.getElementById('mainmenu');
    const auth_menu = document.getElementById('main-auth');
    const main = document.getElementById('main');
    authBt.classList.add('invisible');
    signOutBtn.classList.remove('invisible');
    pickerBtn.classList.remove('invisible');
    menu.classList.remove('invisible');
    auth_menu.classList.add('invisible');
    main.classList.remove('invisible');
}



function onLogOut() {
    deleteCookie('current_book');
    deleteCookie('folder_id');
    const authBt = document.getElementById('googleDrive');
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker');
    const menu = document.getElementById('mainmenu');
    const auth_menu = document.getElementById('main-auth');
    const main = document.getElementById('main');
    const lab = document.getElementById('libary');
    const book_field = document.getElementsByClassName('book-field')[0];
    const load_circle = document.getElementById("loader");
    const info = document.getElementById("book_info");
    var info_icon = document.getElementById('info_icon');
    var translate_page = document.getElementById('translate_page').parentNode;
    translate_page.classList.add('invisible');
    info_icon.classList.add('invisible');
    info.classList.add('invisible');
    load_circle.classList.add('invisible');
    authBt.classList.remove('invisible');
    signOutBtn.classList.add('invisible');
    pickerBtn.classList.add('invisible');
    menu.classList.add('invisible');
    auth_menu.classList.remove('invisible');
    main.classList.add('invisible');
    lab.classList.add('invisible');
    deleteCookie('auth');
    book_field.innerHTML = ' ';
    book_field.id = '';
    var book = document.getElementsByClassName("book-wrapper");
    while ((el = book[0])) {
      el.parentNode.removeChild(el);
    }
    books_list = [];
}

function showSettings() {
    const main = document.getElementById('main');
    main.classList.add('invisible');
    const settings = document.getElementById('settings');
    settings.classList.remove('invisible');
    line = document.getElementById('read_line');
    line.classList.add('invisible');
    const info = document.getElementById("book_info");
    info.classList.add('invisible');
}

function showMain() {
    const main = document.getElementById('main');
    main.classList.remove('invisible');
    const settings = document.getElementById('settings');
    settings.classList.add('invisible');
    const info = document.getElementById("book_info");
    info.classList.add('invisible');

}


window.onApiLoad = function() {
    checkAuth();
    deleteCookie('current_book');
    if(getCookie('auth')) {
        onSingIn();
    }
    else {
        onLogOut();    
    }
    try {   
            gapi.load('auth2', function() {
            auth2 = gapi.auth2.init({
                client_id: clientId_google,
                prompt: 'select_account',
                scope: scope           
            }).then(function() {

                GoogleAuth = gapi.auth2.getAuthInstance();
                const authBt = document.getElementById('googleDrive')
                const signOutBtn = document.getElementById('googleDriveOff');
                const pickerBtn = document.getElementById('googlePicker')
                onAuthApiLoad();    
            });
        });
        } catch(err) {
            console.log(err);
        }
}


function onAuthApiLoad() {
    access_token = getCookie("access_token");
    if(getCookie('auth')) {
        if(getCookie('auth') === 'google'){
            service = new Google();
        }
        else if(getCookie('auth') === 'dropbox'){
           service = new Dropbox();
        }
        else if(getCookie('auth') === 'yandex'){
           service = new Yandex();
        }
       service.get_settings_from_file();
       service.getFolder(); 
    }
    const authBt = document.getElementById('googleDrive');
    const signOutBtn = document.getElementById('googleDriveOff');
    const pickerBtn = document.getElementById('googlePicker');
    const errorBtn = document.getElementById('folder_error_button');
    const bookPicker = document.getElementById("books");
    authBt.addEventListener('click', function() {
        if (!getCookie('auth')) {
            GoogleAuth.grantOfflineAccess({
                prompt: 'select_account', //select_account, consent
                scope: scope
            }).then(
                function(resp) {
                    onSingIn();
                    document.cookie = 'auth=google';
                    googleUser = GoogleAuth.currentUser.get();
                    googleUser.reloadAuthResponse().then(
                        function(authResponse) {
                            access_token = authResponse.access_token;
                            document.cookie = 'access_token='+access_token;
                            service = new Google();
                            service.get_settings_from_file();
                            service.getFolder(); // при нажатии на кнопку авторизации начинается поиск папки на гугл диске
                            if(getCookie('current_book')) {
                                service.getBook(getCookie('current_book'), false);
                            }
                            else {
                                showLibary();
                            }
                        }
                    );
                }
            );
            
        } 
        
    });

    signOutBtn.addEventListener('click', function() {
        GoogleAuth.signOut();
        onLogOut();
    });

    pickerBtn.addEventListener('click', function() {
        deleteCookie('current_book');
        delete settings['current_book'];
        service.write_in_settings();
        showLibary();
        
    });

    errorBtn.addEventListener('click', function() {
        service.getFolder(); // при нажатии на кнопку авторизации начинается поиск папки на гугл диске
        setTimeout(() => {
            if (folder_id === 'err' || folder_id === undefined){
                document.cookie = 'folder_id=no_folder';
               
                var block = document.getElementById('folder_error_button')
                block.innerHTML = 'Папка по прежнему не найдена';
             }
            else{
                document.cookie = 'folder_id='+folder_id;
                var block = document.getElementById('folder_error');
                block.classList.add('invisible');
                block = document.getElementById('folder_error_button');
                block.classList.add('invisible');

            }
        }, 1000)
    });
        
    if(getCookie('current_book')) {
        service.getBook(getCookie('current_book'), true);       
    } else {
        showLibary();
    }
}


function getCookie ( cookie_name )
{
    var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );
    if ( results ){
        return ( unescape ( results[2] ) );
    }
    else
        return null;
}


function deleteCookie ( cookie_name )
{
  var cookie_date = new Date ( );  // Текущая дата и время
  cookie_date.setTime ( cookie_date.getTime() - 1 );
  document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}


async function updateSettings(name, value) {
    settings[name] = value;
    service.write_in_settings();
}


function folderNotFound() {
    var block = document.getElementById('folder_error')
    block.classList.remove("invisible");
    var block = document.getElementById("folder_error_button");
    block.classList.remove("invisible");
}


async function addAnotherVersion() {
    var book_field = document.getElementsByClassName('book-field')[0];
    var id = book_field.id;
}

function showBookInfo() {
    var show_block = document.getElementById('book_info');
    show_block.classList.toggle("invisible");
    var elem = document.getElementsByClassName('book-field')[0];
    var cur_book = elem.id;
    if(getCookie('another_version_of:' + cur_book)) {
        var version_info = document.getElementById('version_info');
        var book_id = getCookie('another_version_of:' + cur_book);
        version_info.classList.remove('invisible');
/*        console.log(cur_book + ' ' + book_id);*/
        book_num = getBookById(book_id);
        showBookPreview(book_num, 'show_another_version')
    } else {
        var elem = document.getElementById('show_another_version');
        elem.innerHTML = '';
        var elem2 = document.getElementById('version_info');
        elem2.classList.add('invisible');
        activeCursor();
    }
}


function checkAuth() {
    var cur_href = window.location.href;
    var str = cur_href.split('?');
    if(str.length > 1) {
        var splitted = str[1];
        var web = str[0];
        console.log(str[0]);
        code = splitted.split('=')[1];
        if(splitted.includes('code=') && !getCookie('auth')){
            if(!splitted.includes('-')){
                var xhr = new XMLHttpRequest();
                var url = 'https://oauth.yandex.ru/token';
                body = "grant_type=authorization_code&code="+code +'&client_id=50e4c045cf91424d89bab8c634df41d5&client_secret=5b018bda88834af38c9447864800d286';
                xhr.open("POST", url, true);
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        var str = JSON.parse(xhr.responseText);

                        document.cookie='access_token=' + str['access_token'];
                        document.cookie='auth=yandex';
                        location.href = web;
                        location.hash = web;
                    }
                    else {
                        console.log(xhr.response)
                    }
                }
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.send(body);
            }
            else {
                body = "code="+code+"&grant_type=authorization_code&redirect_uri=http://localhost:3000/";
                var xhr = new XMLHttpRequest();
                var url = 'https://api.dropboxapi.com/oauth2/token';
                xhr.open("POST", url, true);
                xhr.onload = function() {
                    if(xhr.status === 200) {
                        var str = JSON.parse(xhr.responseText);
                        document.cookie='access_token=' + str['access_token'];
                        document.cookie='auth=dropbox';
                        location.href = web;
                        location.hash = web;
                    }
                    else {
                        console.log(xhr.response)
                    }
                }
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("Authorization", "Basic NDJlNmQ3NnM0cTk4cWYxOmFseXMybjV4b3IyN29mMg==");
                xhr.send(body);
            }
            
        }
    }

}


function getBookById(id){
    for(var i = 0 ; i < books_list.length; i++) {
        if(books_list[i].get(id))
            return i;
    }
    return null;
}
