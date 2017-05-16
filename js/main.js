window.addEventListener('load', function () {
  var maxID = 0
  var fetchLimit = 15
  var spinner = document.getElementById('spinner')
  var loadMoreButton = document.getElementById('load-more')
  var form = document.getElementById('post-form')
  var submitPost = document.getElementById('submit-post')
  var items = document.getElementById('items')
  var refresh = document.getElementById('refresh')
  var refreshSpinner = document.getElementById('refresh-spinner')

  disable(refreshSpinner)
  refresh.addEventListener('click', loadNewest)
  setInterval(loadNewest, 2000)
  loadMoreButton.addEventListener('click', loadMore)
  submitPost.addEventListener('click', function(e) {
    e.preventDefault()
    formSubmit()
  })
  
  loadItems().then(function () { disable(spinner) })

  function loadItems() {
    return fetch('api/get-posts.php?limit=' + fetchLimit)
      .then(parseJSON)
      .then(function (result) {
        result.map(makeElement).forEach(function (element) {
          items.appendChild(element)
        })
      })
  }


  function loadMore() {
    loadNewest()
    spinner.style.display = 'initial'
    var localCount = items.children.length
    fetch('api/get-posts.php?offset=' + localCount + '&limit=' + fetchLimit)
      .then(parseJSON)
      .then(function (result) {
        return result.map(makeElement).forEach(function (element) {
          items.appendChild(element)
        })
      }).then(function() { disable(spinner) })
  }

  function loadNewest() {
    enable(refreshSpinner)
    fetch('api/max-id.php').then(parseJSON)
      .then(function (result) {
        var dbMax = result.max
        var difference = dbMax - maxID
        fetch('api/get-posts.php?&limit=' + difference)
          .then(parseJSON)
          .then(function (result) {
            return result.map(makeElement).reverse()
              .forEach(function (element) {
                items.insertBefore(element, items.firstChild)
              })
          }).then(function () { disable(refreshSpinner) })
      })
  }

  function formSubmit() {
    var formData = new FormData(form)
    fetch('api/add-post.php', {
      method: 'post',
      body: formData
    }).then(loadNewest)
    document.getElementById('text').value = ''
  }

  function deletePost(item) {
    fetch('api/delete-post.php?id=' + item.id).then(loadNewest)
  }

  function parseJSON(res) {
    return res.json()
  }

  function enable(element) {
    element.style.display = 'inline-block'
  }

  function disable(element) {
    element.style.display = 'none'
  }

  function makeElement(item) {
    if (item.id > maxID) maxID = item.id
    var items = document.getElementById('items')

    var content = document.createElement('div')
    content.className = 'd-flex w-100 justify-content-between'

    var text = document.createElement('p')
    text.textContent = item.text

    var deleteIcon = document.createElement('button')
    deleteIcon.className = 'material-icons delete-icon'
    deleteIcon.textContent = 'delete'

    content.appendChild(text)
    content.appendChild(deleteIcon)
    
    var meta = document.createElement('div')
    meta.className = 'd-flex w-100 justify-content-between'

    var user = document.createElement('small')
    user.textContent = item.user || 'Anonymous'
    var date = document.createElement('small')
    date.textContent = item.date

    meta.appendChild(user)
    meta.appendChild(date)

    var element = document.createElement('div')
    element.appendChild(content)
    element.appendChild(meta)
    element.className = 'list-group-item'

    deleteIcon.addEventListener('click', function () {
      element.remove()  
      deletePost(item)
    })
    
    return element
  }
})
