window.addEventListener('load', function () {
  var maxID = 0
  var fetchLimit = 15
  var spinner = document.getElementById('spinner')
  var loadMoreButton = document.getElementById('load-more')
  var form = document.getElementById('post-form')
  var submitPost = document.getElementById('submit-post')
  var items = document.getElementById('items')
  var refresh = document.getElementById('refresh')

  refresh.addEventListener('click', loadNewest)
  loadMoreButton.addEventListener('click', loadMore)
  submitPost.addEventListener('click', function(e) {
    e.preventDefault()
    formSubmit()
  })
  
  loadItems().then(disableSpinner)

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
      }).then(disableSpinner)
  }

  function loadNewest() {
    enableSpinner()
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
          }).then(disableSpinner)
      })
  }

  function formSubmit() {
    var formData = new FormData(form)
    fetch('api/add-post.php', {
      method: 'post',
      body: formData
    }).then(function () {
      loadNewest()
    })
    document.getElementById('text').value = ''
  }

  function parseJSON(res) {
    return res.json()
  }

  function enableSpinner() {
    spinner.style.display = 'initial'
  }

  function disableSpinner() {
    spinner.style.display = 'none'
  }

  function makeElement(item) {
    if (item.id > maxID) maxID = item.id
    var items = document.getElementById('items')

    var content = document.createElement('div')
    content.className = 'd-flex w-100'

    var text = document.createElement('p')
    text.textContent = item.text

    // var number = document.createElement('strong')
    // number.className = 'number'
    // number.textContent = item.id

    // content.appendChild(number)
    content.appendChild(text)
    
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
    
    return element
  }
})
