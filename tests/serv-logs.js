function anonymous(it
) {
function escape(string){ return function XMLEscape(str) {
    const newStr = String(str);
    if (/[&<>"']/.test(newStr)) {
        return newStr.replace(/[&<>"']/g, replaceChar);
    }
    else {
        return newStr;
    }
}(string) }
function comments(it){let tR=''
tR+='<article class="comment">\n  <div class="comment__body">\n    <div class="comment__meta">\n      <span class="comment__author">'
tR+=escape(it.comment.author)
tR+='</span>\n      '
const date = new Date(it.comment.time)
tR+='      <span class="comment__time">'
tR+=escape(date.toLocaleString())
tR+='</span>\n      <span class="comment__id">№'
tR+=escape(it.comment.id)
tR+='</span>\n    </div>\n    <p class="comment__content">'
tR+=it.comment.content
tR+='</p>\n  </div>\n  <div class="comment__tree">\n    '
it.comment.kids.forEach( function(kidComment){
tR+=' \n      '
tR+=comments({comment: kidComment })
tR+=' \n    '
})
tR+='  </div>\n</article>\n'
return tR}
let tR=''
tR+='<section class="test">\n  <main class="test__comm-list">\n    '
tR+=comments({ comment: it.comments })
tR+='  </main>\n</section>\n\n'
return tR
}