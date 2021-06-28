function saveCustom() {
    theme = document.getElementById("example").classList[0];
    if (theme != undefined){
        document.cookie = 'theme=' + theme;
        updateSettings('theme', theme);
    }
    text = document.getElementById('text').style;
    for (var i = 0; i < text.length; i++) {
        document.cookie = text[i] + '=' + text[text[i]];
        console.log(text[i] + ' ' + text[text[i]])
        updateSettings(text[i], text[text[i]])
    }
    setSettings();
}


function setSettings() {

    set = document.getElementsByClassName('book-field')[0];
    text = document.getElementById('text');
    if(getCookie('line-height')){
        text.style.lineHeight = getCookie('line-height');
        set.style.lineHeight = getCookie('line-height');
    }
    if(getCookie('font-size') ){
        set.style.fontSize = getCookie('font-size');
        text.style.fontSize = getCookie('font-size');
    }
    if(getCookie('font-family')){
        
        set.style.fontFamily = getCookie('font-family');
        text.style.fontFamily = getCookie('font-family');
    }
    if(getCookie('theme')){
        set = document.getElementById('main');
        set.classList.remove('selector_default_theme');
        set.classList.remove('selector_dark_theme');
        set.classList.remove('selector_beige_theme');
        set.classList.add(getCookie('theme'));
        example = document.getElementById('example');
        example.classList.remove('selector_default_theme');
        example.classList.remove('selector_dark_theme');
        example.classList.remove('selector_beige_theme');
        example.classList.add(getCookie('theme'));
    }
}





function getTotalPages(){
    var w = window.innerWidth;
    cur_page = document.getElementsByClassName('book-field')[0];
    total_pages = document.getElementById('total_pages');
    total_pages.innerHTML = Math.ceil(cur_page.scrollWidth / w);
}


function nextPage() {
    var w = window.innerWidth;
    cur_page = document.getElementById('mainmenu');
    getTotalPages();
    change_num = document.getElementById('cur_page');
    if(Number(change_num.innerHTML) < Number(document.getElementById('total_pages').innerHTML)) {
        cur_right = cur_page.style.right.replace('px',''); 
        res = Number(cur_right) + (w);
        cur_page.style.right = res+ 'px'; 
        change_num.innerHTML = Number(change_num.innerHTML) + 1;
        procent_of_read = (Number(change_num.innerHTML)-1)/document.getElementById('total_pages').innerHTML;
        document.cookie = cur_page.id +'='+Math.floor(procent_of_read * 10000);
        updateSettings(cur_page.id, Math.floor(procent_of_read * 10000))
    }
    showReadLine();
}


function prevPage() {
    var w = window.innerWidth;
    cur_page = document.getElementsByClassName('book-field')[0];
    if(cur_page.style.right !== '' && cur_page.style.right !== '0px'){
        cur_right = cur_page.style.right.replace('px',''); 
        res = Number(cur_right) - (w);
        cur_page.style.right = res + 'px';
        getTotalPages();
        change_num = document.getElementById('cur_page');
        change_num.innerHTML -= 1;
        if (change_num.innerHTML == 1) {
            document.cookie = cur_page.id +'=0'
            updateSettings(cur_page.id, 0)
        }
        else {
            procent_of_read = (change_num.innerHTML -1)/document.getElementById('total_pages').innerHTML;
            document.cookie = cur_page.id +'='+Math.floor(procent_of_read * 10000);
            updateSettings(cur_page.id, Math.floor(procent_of_read * 10000))
        }
    }
    showReadLine();
}


function getCurPage(){
    var cur_page = document.getElementsByClassName('book-field')[0];
    procent_of_read = getCookie(cur_page.id);
    res = Math.round(procent_of_read / 10000 * Math.ceil(cur_page.scrollWidth / window.innerWidth))
    change_num = document.getElementById('cur_page');
    change_num.innerHTML = res + 1;
    res *= window.innerWidth;
    cur_page.style.right = res+ 'px';    
    showReadLine();
} 


function showReadLine() {
    sort_menu = document.getElementById("sort_menu");
    sort_menu.classList.add('invisible');
    read_line = document.getElementById("read_line");
    read_line.classList.remove('invisible');
    procent_of_read = getCookie(cur_page.id);
    change_num = document.getElementById('cur_page');
    read_line.style.width = Number(change_num.innerHTML-1) / (document.getElementById('total_pages').innerHTML-1) * 100  + "%";
}


function showMode1(){
    deleteCookie('show_mode')
    var book = document.getElementsByClassName("book-wrapper");
    for (var i = 0; i < book.length; i++) {
        book[i].classList.remove('list');
    }
    var imgs = document.getElementsByClassName("img-wrapper");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].classList.remove('list-img-wrapper');
    }
}


function showMode2(){
    document.cookie = 'show_mode=1'
    updateSettings("show_mode", 1)
    var book = document.getElementsByClassName("book-wrapper");
    for (var i = 0; i < book.length; i++) {
        book[i].classList.add('list');
    }
    var imgs = document.getElementsByClassName("img-wrapper");
    for (var i = 0; i < imgs.length; i++) {
        imgs[i].classList.add('list-img-wrapper');
    }
}


//-------------------- списки ------------------
window.onload = function() {
  let lists = document.getElementsByClassName('show_drop_down');
  for(let i = 0; i < lists.length; i++) {
    lists[i].addEventListener('click', function() {
        this.classList.toggle('active-drop-down');
        if(this.classList.contains('active-drop-down')) {
            var element = this.nextElementSibling;
            var count = 1;
            while(element) {
                element.style.display = 'block';
                element.value = count;
                element.addEventListener('click', function (count) {
                    hideDropDown(i);
                    if(i == 0) themeSelector(i, this.value); // nomer spiska
                    if(i == 1) lineHeightChange(i, this.value);
                    if(i == 2) fontSizeChange(i, this.value);
                    if(i == 3) fontFamilyChange(i, this.value);
                    if(i == 4) sortBookList(this.value);
                    if(i == 5) bookVersionHandler(i, this.value);
                    
                });
                element = element.nextElementSibling;
                count +=1;
            }
        }
        else {
            var element = this.nextElementSibling;
            while(element) {
                element.style.display = 'none';
                element = element.nextElementSibling;
            }
        }
    } );
  }
}


function hideDropDown(list_id) {
    let lists = document.getElementsByClassName('show_drop_down')[list_id];
    lists.classList.toggle('active-drop-down');
    var element = lists.nextElementSibling;
    while(element) {
        element.style.display = 'none';
        element = element.nextElementSibling;
    }
}


function themeSelector(list_id, picked_id) {
    let example = document.getElementById('example');
    let lists = document.getElementsByClassName('drop-down')[list_id];
    if(picked_id == 1) {
        example.classList.add('selector_default_theme');
        example.classList.remove('selector_dark_theme');
        example.classList.remove('selector_beige_theme');
    }
    if(picked_id == 2) {
        example.classList.add()
        example.classList.remove('selector_default_theme');
        example.classList.add('selector_dark_theme');
        example.classList.remove('selector_beige_theme');
    }
    if(picked_id == 3) {
        example.classList.add()
        example.classList.remove('selector_default_theme');
        example.classList.remove('selector_dark_theme');
        example.classList.add('selector_beige_theme');
    }
}


function lineHeightChange(list_id, picked_id) {
    var text = document.getElementById('text');
    var picked_child = document.getElementsByClassName('drop-down')[list_id].children[picked_id];
    res = picked_child.innerHTML;
    text.style.lineHeight = res;
}


function fontSizeChange(list_id, picked_id){
    var text = document.getElementById('text');
    //console.log(document.getElementsByClassName('drop-down')[list_id]);
    var picked_child = document.getElementsByClassName('drop-down')[list_id].children[picked_id];
    res = picked_child.innerHTML;
    text.style.fontSize = res + 'px';
}


function fontFamilyChange(list_id, picked_id) {
    var text = document.getElementById('text');
    var picked_child = document.getElementsByClassName('drop-down')[list_id].children[picked_id];
    res = picked_child.style.fontFamily;
    text.style.fontFamily = res;
}


function sortBookList(list_value) {
    if(list_value == 1){ // по автору 
        books_list.sort(byField('author'));
    }
    if(list_value == 2){  // по названию
        books_list.sort(byField('title'));
    }
    if(list_value == 3){  // по дате добавления
         books_list.sort(byField('time'));
    }
    showChangedLibary();
}


function byField(field) {
  return (a, b) => a[field] > b[field] ? 1 : -1;
}

function showChangedLibary(){
    var book_wrappers = document.getElementsByClassName('book-wrapper'); 
    var libary = document.getElementById('libary');
    for(var i = 0; i < books_list.length; i++) {
        var str = book_wrappers[i].children[1].innerHTML.trim();
        if(str != books_list[i].author) {
            for (var j = 0; j < books_list.length; j++) {
                var str1 = book_wrappers[j].children[1].innerHTML.trim();
                if(str1 === String(books_list[i].author)){
                    swapNodes(book_wrappers[i], book_wrappers[j])
                }
            }
        }
    }

}


function swapNodes(node1, node2) {
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;
    node1.replaceWith(node2);
    parent.insertBefore(node1, afterNode2);
}


async function showLibary() { // отобразить библиотеку книг
    var id_folder = getCookie('folder_id');
    var sort_menu = document.getElementById('sort_menu');
    var show_book = document.getElementsByClassName('show_book')[0];
    show_book.classList.add('invisible');
    sort_menu.classList.remove('invisible');
    line = document.getElementById('read_line');
    line.classList.add('invisible');
    if (id_folder === 'no_folder') { //путь до папки записан в куки

        folderNotFound();
    }
    else {
        service.getFilesFromFolder();
    }
}


function activeCursor() {
    var elem = document.getElementsByClassName('book-field')[0];
    var cur_book = elem.id;
    var selector = document.getElementById('anoter_book_version');
    var children = selector.children.length;
    var list_children = selector.children;
    var node = document.getElementById('changer_dropdown');
    if (list_children[0].getAttribute("value") != cur_book) {
        for(var i = children - 1; i > 0; i--) {
            list_children[i].remove();
        }
        children = 1;
    }
    if (children === 1) {
        for(var i = 0; i < books_list.length; i++) {
            if(!books_list[i].get(cur_book)) {
                var li = document.createElement('li');
                li.innerHTML = books_list[i].title + " / " + books_list[i].author;
                li.classList = books_list[i].id;
                selector.append(li);
            }
        } 
    }
    list_children[0].setAttribute("value", cur_book);
}


function showBookPreview(id, block) {
    var elem = document.getElementById(block);
    var change_book_version = document.getElementById('change_book_version');
    elem.innerHTML = '';
    let li = document.createElement('li');
    li.className = 'book-wrapper list';
    var author_str = books_list[id].author;
    var title = books_list[id].title;
    var img = books_list[id].img;
    var str = '<div class = "img-wrapper list-img-wrapper"><img src = "'+ img + '"></div><p class="author">';
    str +=  author_str + ' </p><p class="title"> '+ title;
    str += ' <i class="fa fa-times" aria-hidden="true" onclick = "remove_book_version()"></i></p> '
    li.innerHTML = str;
    elem.append(li);
    change_book_version.classList.add('invisible');
}


function removeBookVersion(){
    var book_field = document.getElementsByClassName('book-field')[0];
    var change_book_version = document.getElementById('change_book_version');
    var id = book_field.id;
    change_book_version.classList.remove('invisible')
    delete settings['another_version_of:' + id];
    delete settings['another_version_of:' + getCookie('another_version_of:' + id)]
    deleteCookie('another_version_of:' + getCookie('another_version_of:' + id));
    deleteCookie('another_version_of:' + id);
    service.write_in_settings();
    var show_block = document.getElementById('book_info');
    show_block.classList.toggle("invisible");
    showBookInfo();
}


function bookVersionHandler (id, value) {
    var drop_down = document.getElementsByClassName('drop-down')[id];
    var elem = document.getElementsByClassName('book-field')[0];
    var show_block = document.getElementById('book_info');
    var cur_book = elem.id;

    document.cookie = 'another_version_of:' + cur_book + '=' + drop_down.children[value].classList[0];
    updateSettings('another_version_of:' + cur_book, drop_down.children[value].classList[0]);
    document.cookie = 'another_version_of:' + drop_down.children[value].classList[0] + '=' + cur_book ;
    updateSettings('another_version_of:' + drop_down.children[value].classList[0], cur_book);
    show_block.classList.toggle("invisible");
    showBookInfo();
}


function translateBook() {
    var translate = document.getElementById('translate_page');
    translate.classList.toggle('active');
    var book = document.getElementsByClassName('book-field')[0];
    if (translate.classList.contains('active')) {
        book.addEventListener('click', handleClick);
    }
    else {
        book.removeEventListener('click', handleClick);
    }
}


function handleClick() {
    var elem = document.getElementsByClassName('book-field')[0];
    var current_book = elem.id;
    console.log(current_book)
    let target = event.target;
    if(target.tagName == 'P') {
        var res = books_list[getBookById(current_book)].getPlaceOfElem(target);
        books_list[getBookById(getCookie('another_version_of:' + current_book))].show();
        console.log(res[0],res[1])
        books_list[getBookById(getCookie('another_version_of:' + current_book))].setPage(res[0], res[1]);
    }
}