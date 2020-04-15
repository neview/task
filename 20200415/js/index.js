let yanchiModel = (function () {

    let columns = Array.from(document.querySelectorAll('.column')),
        _data = [];

    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', './json/data.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                _data = JSON.parse(xhr.responseText);
            };
        };
        xhr.send(null);
    };

    let bindMode = function bindMode() {
        _data = _data.map(item => {
            let w = item.width,
                h = item.height;
            h = h / (w / 230);
            item.width = 230;
            item.height = h;
            return item;
        });
        for (let i = 0; i < _data.length; i += 3) {
            let group = _data.slice(i, i + 3);
            group.sort((a, b) => {
                return a.height - b.height;
            });
            columns.sort((a, b) => {
                return b.offsetHeight - a.offsetHeight;
            });
            group.forEach((item, index) => {
                let {
                    pic,
                    title,
                    width,
                    height,
                    link
                } = item;
                let card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<a href="${link}">
                <div class="lazyImageBox" style = "height:${height}px">
                    <img src="" alt="" data-image = '${pic}'>
                </div>
                <p>${title}</p>
            </a>`;
                columns[index].appendChild(card);
            });
        };
    };

    let lazyFunc = function lazyFunc() {
        let lazyImageBoxs = document.querySelectorAll('.lazyImageBox');
        [].forEach.call(lazyImageBoxs, lazyImageBox => {
            let isload = lazyImageBox.getAttribute('isload');
            if(isload ==='true')return;
            let A = utils.offset(lazyImageBox).top + lazyImageBox.offsetHeight / 2;
            let B = document.documentElement.clientHeight + document.documentElement.scrollTop;
            if(B>=A){
                lazyImg(lazyImageBox);
            }
        })
    };

    let lazyImg = function lazyImg(lazyImageBox){
        let img = lazyImageBox.querySelector('img');
        let tempImage = new Image,
            dataImage = img.getAttribute('data-image');
        tempImage.src = dataImage;
        tempImage.onload = function(){
            img.src = dataImage;
            utils.css(img,'opacity',1);
        };
        tempImage = null;
        img.removeAttribute('data-image');
        lazyImageBox.setAttribute('isload','true');
    };

    let isrender;
    let someMode = function someMode(){
        let HTML = document.documentElement;
        if(HTML.clientHeight + HTML.scrollTop + HTML.clientHeight / 2 >=HTML.scrollHeight){
            if(isrender)return
            isrender = true;
            queryData();
            bindMode();
            lazyFunc();
            isrender = false;
        }
    };

    return {
        init() {
            queryData();
            bindMode();
            lazyFunc();
            window.onscroll = function(){
                lazyFunc();
                someMode();
            };
        }
    }
})();
yanchiModel.init();