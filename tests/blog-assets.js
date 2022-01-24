/* eslint-disable no-useless-escape */
const postsData = [
  {
    title: 'Post 0',
    author: 'Mr. N',
    published: '9.12.21',
    id: '74564654',
    tags: ['test', 'mountains', 'fading'],
    body: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu   
    ![preview](https://images.pexels.com/photos/9715781/pexels-photo-9715781.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260)`,
    preview:
      'It is _somw preview_ for postsList. Some details about this post. Description or something else    ![preview](https://images.pexels.com/photos/9715781/pexels-photo-9715781.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260)',
  },
  {
    title: 'Markdown example. ',
    author: 'Yevgeniy',
    published: '14.11.21',
    id: '34234324u',
    body: `
Paragraphs are separated by a blank line.

2nd paragraph. __Underline__, *Italic*, **bold**, and \`monospace\`. Itemized lists
look like:

  * this one
  * that one
  * the other one

Note that the actual text
content starts at 4-columns in.

> Block quotes are
> written like so.
>
> They can span multiple paragraphs,
> if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges. Three dots ... will be converted to an ellipsis.
Unicode is supported. ☺



An h2 header
------------

Here's a numbered list:

 1. first item
 2. second item
 3. third item

Note again how the actual text starts at 4 columns in (4 characters
from the left side). Here's a code sample:

    # Let me re-iterate ...
    for i in 1 .. 10 { do-something(i) }

As you probably guessed, indented 4 spaces. By the way, instead of
indenting the block, you can use delimited blocks, if you like:

~~~
define foobar() {
    print "Welcome to flavor country!";
}
~~~

(which makes copying & pasting easier). You can optionally mark the
delimited block for Pandoc to syntax highlight it:

~~~python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print(i)
~~~



### An h3 header ###

Now a nested list:

 1. First, get these ingredients:

      * carrots
      * celery
      * lentils

 2. Boil some water.

 3. Dump everything in the pot and follow
    this algorithm:

        find wooden spoon
        uncover pot
        stir
        cover pot
        balance wooden spoon precariously on pot handle
        wait 10 minutes
        goto first step (or shut off burner when done)

    Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including
that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar), to a [local
doc](local-doc.html), and to a [section heading in the current
doc](#an-h2-header).

Tables can look like this:   
   
| Command | Description |  
| :------ | :-------- |   
| git status | List all *new or modified* files |     
| git diff | Show file differences that **haven't been** staged |     
  
Table: Shoes sizes, materials, and colors.

(The above is the caption for the table.) Pandoc also supports
multi-line tables:

| h1    |    h2   |      h3 |
|:------|:-------:|--------:|
| 100   | [a][1]  | ![b][2] |
| *foo* | **bar** | ~~baz~~ |

A horizontal rule follows.

***

and images can be specified like so:

![example image](http://www.unexpected-vortices.com/sw/rippledoc/example-image.jpg "An exemplary image")

And note that you can backslash-escape any punctuation characters
which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.

# GFM

## Autolink literals

www.example.com, https://example.com, and contact@example.com.

## Footnote

A note[^1]

[^1]: alaverdy.

## Strikethrough

~one~ or ~~two~~ tildes.

## Table

| a | b  |  c |  d  |
| - | :- | -: | :-: |

## Tasklist

* [ ] to do
* [x] done
    `,
  },
  {
    title: 'Ut enim ad minima veniam, quis nostrum exercitationem',
    author: 'Mr. A',
    published: '8.11.21',
    id: '74564dsd65u4',
    tags: ['universal'],
    body: `
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
      totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
      nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi conse[pppp,quatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi conseq
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
      totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
      nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi conse[pppp,quatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi conseq
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
      totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
      nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi conse[pppp,quatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi conseq
    `,
  },
  {
    title: 'There are inserted for HTML YT video',
    author: 'Aleman',
    published: '1.11.21',
    id: '74564dsd65u4455',
    tags: ['universal', 'video'],
    body: `
<p><strong>Hey there</strong>, welcome to your new home on the web! </p><u>Underline, please</u>\n<!--kg-card-end: html--><p>Unlike social networks, 
this one is all yours. Publish your work on a custom domain, invite your audience to subscribe, send them new content by email newsletter, and offer premium subscriptions 
to generate sustainable recurring revenue to fund your work. </p><!--kg-card-begin: markdown--><p><u> underline </u></p>\n<!--kg-card-end: markdown--><p>hfgdjodgjdfg</p>
<p>Ghost is an independent, open source app, which means you can customize absolutely everything. Inside the admin area, you'll find straightforward controls for changing themes, 
colors, navigation, logos and settings — so you can set your site up just how you like it. No technical knowledge required.</p><figure class=\"kg-card kg-image-card\">
<img src=\"http://localhost:2368/content/images/2021/12/1614723752_141-p-foni-dlya-odezhdi-175.jpg\" class=\"kg-image\" alt loading=\"lazy\" width=\"2000\" height=\"1333\" srcset=\"http://localhost:2368/content/images/size/w600/2021/12/1614723752_141-p-foni-dlya-odezhdi-175.jpg 600w, 
http://localhost:2368/content/images/size/w1000/2021/12/1614723752_141-p-foni-dlya-odezhdi-175.jpg 1000w, http://localhost:2368/content/images/size/w1600/2021/12/1614723752_141-p-foni-dlya-odezhdi-175.jpg 1600w, 
http://localhost:2368/content/images/2021/12/1614723752_141-p-foni-dlya-odezhdi-175.jpg 2121w\" sizes=\"(min-width: 720px) 720px\"></figure><p>If you're feeling a little more adventurous, there's really no limit to what's possible. With just a little bit of HTML and CSS you can modify or build your very own theme from scratch, or connect to Zapier to explore advanced integrations. 
Advanced developers can go even further and build entirely custom workflows using the Ghost API.</p><p>dfgdgdfgd df <strong>jgjuhj</strong></p><p></p><p>This level of customization means that Ghost grows with you. It's easy to get started, but there's always another level of what's possible. So, you won't find yourself outgrowing the app in a few months time and wishing you'd chosen something more powerful!</p><hr><p>For now, you're probably just wondering what to do first. 
To help get you going as quickly as possible, we've populated your site with starter content (like this post!) covering all the key concepts and features of the product.</p><p>You'll find an outline of all the different topics below, with links to each section so you can explore the parts that interest you most.</p><p>Once you're ready to begin publishing and want to clear out these starter posts, you can delete the \"Ghost\" staff user. Deleting an author will automatically remove all of their posts, leaving you with a clean blank canvas.</p><h2 id=\"your-guide-to-ghost\">Your guide to Ghost</h2><ul><li><a href=\"http://localhost:2368/design/\">Customizing your brand and site settings</a></li><li><a href=\"http://localhost:2368/write/\">
Writing &amp; managing content, an advanced guide for creators</a></li><li><a href=\"http://localhost:2368/portal/\">Building your audience with subscriber signups</a></li><li><a href=\"http://localhost:2368/sell/\">Selling premium memberships with recurring revenue</a></li><li><a href=\"http://localhost:2368/grow/\">How to grow your business around an audience</a></li><li><a href=\"http://localhost:2368/integrations/\">
Setting up custom integrations and apps</a></li></ul><p>If you get through all those and you're hungry for more, you can find an extensive library of content for creators over on <a href=\"https://ghost.org/blog/\">the Ghost blog</a>.</p><hr><h2 id=\"getting-help\">Getting help</h2><p>If you need help, <a href=\"https://ghost.org/pricing/\">
Ghost(Pro)</a> customers can always reach our full-time support team by clicking on the <em>Ghost(Pro)</em> link inside their admin panel.</p><p>If you're a developer working with the codebase in a self-managed install, check out our <a href=\"https://forum.ghost.org\">developer community forum</a> to chat with other users.</p><p>Have fun!</p>
    `,
  },
  {
    title: 'Post 1',
    author: 'Mr. W',
    published: '4.11.21',
    id: '74564dsd654',
    tags: ['some', 'fish'],
    body: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi conse[pppp,quatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu`,
    preview: `__Sed ut perspiciatis__ unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu`,
  },
  {
    title: 'Another Post',
    author: 'Noone',
    published: '14.11.21',
    id: '74564dsdfd654',
    tags: ['blog', 'mountains', 'test'],

    body: `<u>Sed ut perspiciatis unde omnis iste</u> natus error sit voluptatem accusantium doloremque laudantium,    
    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi    
    __nesciunt__. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam al,
    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam al
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu`,
  },
  {
    title: 'Post 3',
    author: 'Mr. Night',
    published: '1.12.21',
    id: '74564654sd',
    tags: ['test', 'mountains', 'fading', 'some', 'blog'],

    body: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam vol dolorem eum fugiat quo voluptas nulla pariatu`,
    preview: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.       
    Nemo enim ipsam vol dolorem eum fugiat quo voluptas nulla pariatu Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam vol dolorem eum fugiat quo voluptas nulla pariatu`,
  },
  {
    title: 'Post 1s',
    author: 'Mr. W',
    published: '4.11.21',
    id: '74564dssad654',
    tags: ['ggwp', 'illi', 'blog'],
    body: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu`,
    preview: `__Sed ut perspiciatis__ unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu aerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu
      `,
  },
  {
    title: 'Another Post 1',
    author: 'Noone',
    published: '1.11.21',
    id: '74564dsds3ffd654',
    tags: ['blog', 'fading'],
    body: `<u>Sed ut perspiciatis unde omnis iste</u> natus error sit voluptatem accusantium doloremque laudantium,      
    ![preview](https://images.pexels.com/users/avatars/2673/free-nature-stock-257.png?auto=compress&fit=crop&h=256&w=256)
    ![preview](https://static-s.aa-cdn.net/img/ios/1055030031/63e2681c8a36306a8c3ba9284859a2f3?v=1)  
    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam al,
    ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui _dolorem_ ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam al
    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi 
    nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora 
    incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit 
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae 
    consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatu`,
  },
];

const formMetadata = () => {
  const archive = postsData.map((post) => ({
    title: post.title,
    id: post.id,
  }));

  const tags = [];

  postsData.forEach((post) => {
    if (!post.tags?.length) return;
    post.tags.forEach((tag) => {
      const alreadyIncludedTag = tags.find((currentTag) => {
        if (currentTag.value === tag) return true;
        return false;
      });
      if (alreadyIncludedTag) alreadyIncludedTag.count += 1;
      else tags.push({ value: tag, count: 1 });
    });
  });

  return { archive, tags };
};

const getAsyncPosts = ({ page, pageSize, tag }) => {
  return new Promise((resolve) => {
    let targetArray = [];

    if (tag) {
      targetArray = postsData.filter((post) => {
        if (post.tags?.includes(tag)) return true;
        return false;
      });
    } else {
      targetArray = postsData;
    }


    const reqData = targetArray.slice(page * pageSize, (page + 1) * pageSize);
    const metadata = formMetadata();

    const response = {
      meta: { length: targetArray.length, ...metadata },
      content: reqData,
    };

    setTimeout(() => {
      resolve(response);
    }, 0);
  });
};

const getAsyncPost = ({ id }) => {
  return new Promise((resolve) => {
    const reqPost = postsData.find((post) => {
      if (post.id === id) return post;
      return false;
    });

    setTimeout(() => {
      resolve(reqPost);
    }, 200);
  });
};

export default { postsData, getAsyncPosts, getAsyncPost }
