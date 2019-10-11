var tabs = document.querySelector('#tabs');

tabs.addEventListener('click', handler, false);

function handler (evt) {
    evt = evt || window.event;

    let target = evt.target || evt.srcElement;

    // console.log(evt)
    // console.log(target)
    // console.log(evt.currentTarget === tabs)
    // console.log(this === tabs)

    if (target.tagName !== 'LI') { return; }
    // console.log(document.querySelectorAll('li', this))
    // console.log(document.querySelectorAll('li', this).length)
    // document.querySelectorAll('li', this).forEach(function (node, index) {
    //     // console.log(node === target)
    //     node.classList[target === node ? 'add': 'remove']('active');
    // })

    [...document.querySelectorAll('li', this)].forEach(function (node, index) {
        // console.log(node === target)
        node.classList[target === node ? 'add': 'remove']('active');
    })

    // [...this.children].forEach(function (node, index) {
    //     // console.log(node === target)
    //     node.classList[target === node ? 'add' : 'remove']('active');
    // })
}