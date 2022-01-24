function anonymous(cache,it
) {
let tR=''
tR+='<section class="test">\n  <main class="test__comm-list">\n    '
tR+=cache.comments(cache, { comment: it.comments })
tR+='  </main>\n</section>\n\n'
tR = cache.main(cache, Object.assign(it, {body: tR}, {viewName: 'test'}))
return tR
}