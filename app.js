const cheerio = require('cheerio');
const superagent = require('superagent');
const { save, saveMany } = require('./db/save');
const getschema = require('./db/getschema');
const trimSurplus = require('./trimSurplus');
const URL = require('./URL');

superagent.get(URL.QIDIAN.URL_SE, (err, res) => {
    if (err) {
        return;
    }
    let $ = cheerio.load(res.text);
    let bookids = [];
    $('#result-list li').each((i, el) => {
        bookids.push($(el).find('a.blue-btn').attr('data-bookid'));
    });

    var promises = bookids.map((el) => {
        return getBookInfo(el);
    });
    Promise.all(promises)
        .then((res) => {
            console.log('finish');
        })
        .catch((err) => {
            console.log(err);
        });
});

var getBookInfo = (bookid) => {
    return new Promise((resolve, reject) => {
        superagent.get(URL.QIDIAN.URL_INFO + bookid, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            let $ = cheerio.load(res.text);
            var bid = $('.book-detail-wrap #bookImg').attr('data-bid');
            var bname = $('.book-information .book-info h1 em').text();
            var bookintro = trimSurplus($('.book-content-wrap .book-intro p').eq(0).text());
            var booktag = trimSurplus($('.book-intro p.tag-wrap').text());
            var bookvolume = [];
            $('.volume-wrap .volume li').each((i, el) => {
                bookvolume.push({
                    bookid: bid,
                    bookname: bname,
                    title: $(el).find('a').text(),
                    url: $(el).find('a').attr('href').replace('//', ''),
                    status: 0
                })
            });
            var bookinfo = {
                bookid: bid,
                bookname: bname,
                intro: bookintro,
                tag: booktag
            };
            return save('BookInfo', bookinfo)
                .then((res) => {
                    console.log('正在爬取《' + bname + '》...');
                    return saveMany('BookVolume', bookvolume);
                })
                .then((res) => {
                    return getBookChapter(bookvolume);
                })
                .then((res) => {
                    console.log('爬取《' + bname + '》完成');
                    return 'success';
                }).catch((err) => {
                    reject(err);
                });
        });
    });
}

var getBookChapter = (bookvolume) => {
    var promises = bookvolume.map((el) => {
        return getBookChapterByUrl(el);
    });
    return Promise.all(promises);
}

var getBookChapterByUrl = (vol) => {
    console.log('正在爬取《' + vol.bookname + '》' + vol.title + '...');
    return new Promise((resolve, reject) => {
        superagent.get(vol.url, (err, res) => {
            if (err) {
                console.log('爬取失败：' + err.code + '《' + vol.bookname + '》' + vol.title);
                resolve(err);
                return;
            }
            let $ = cheerio.load(res.text);
            var chapter = $('#j_chapterBox .read-content').text();
            save('BookChapter', { bookid: vol.bookid, chapter: chapter })
                .then((res) => {
                    console.log('成功爬取《' + vol.bookname + '》' + vol.title);
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
}
