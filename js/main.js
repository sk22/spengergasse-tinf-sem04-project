window.addEventListener('load', function () {
  var maxID = 0
  var fetchLimit = 15
  var spinner = document.getElementById('spinner')
  var loadMoreButton = document.getElementById('load-more')
  var postForm = document.getElementById('post-form')
  var loginForm = document.getElementById('login-form')
  var logoutButton = document.getElementById('logout')
  var registerButton = document.getElementById('register')
  var deleteAccountButton = document.getElementById('delete-account')
  var submitPost = document.getElementById('submit-post')
  var items = document.getElementById('items')
  var refresh = document.getElementById('refresh')
  var refreshSpinner = document.getElementById('refresh-spinner')
  var errorAlert = document.getElementById('error')

  logout()
  
  disableSpinner(refreshSpinner)
  refresh.addEventListener('click', loadNewest)
  setInterval(loadNewest, 2000)
  loadMoreButton.addEventListener('click', loadMore)

  postForm.addEventListener('submit', function (e) {
    e.preventDefault()
    var data = new FormData(postForm)
    addPost(data).then(function () {
      document.getElementById('text').value = ''
    })
  })

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault()
    login(new FormData(loginForm))
  })

  logoutButton.addEventListener('click', logout)
  deleteAccountButton.addEventListener('click', function () {
    deleteAccount().then(logout)
  })

  registerButton.addEventListener('click', function () {
    register(new FormData(loginForm))
  })
  
  loadItems().then(function () { disableSpinner(spinner) })

  function setError(err) {
    errorAlert.classList.remove('hidden')
    errorAlert.textContent = err.message
  }

  function unsetError() {
    errorAlert.classList.add('hidden')
    errorAlert.textContent = ''
  }

  function register(data) {
    return fetch('api/register.php', {
      method: 'post',
      body: data,
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) return res.json().then(setError)
      unsetError()
      login(data)
    })
  }

  function deleteAccount() {
    return fetch('api/delete-account.php', {
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) return res.json().then(setError)
      unsetError()
    })
  }

  function login(data) {
    return fetch('api/login.php', {
      method: 'post',
      body: data,
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) return parseJSON(res).then(setError)
      parseJSON(res).then(function (user) {
        unsetError()
        document.getElementById('post-form').classList.remove('hidden')
        document.getElementById('login-form').classList.add('hidden')
        document.getElementById('delete-account').classList.remove('hidden')
        document.getElementById('logout').classList.remove('hidden')
        document.getElementById('user').value = user.username
        document.getElementById('password').value = ''
      })
    })
  }

  function logout() {
    return fetch('api/logout.php', {
      credentials: 'same-origin'
    }).then(function () {
      document.getElementById('post-form').classList.add('hidden')
      document.getElementById('login-form').classList.remove('hidden')
      document.getElementById('delete-account').classList.add('hidden')
      document.getElementById('logout').classList.add('hidden')
      document.getElementById('user').value = ''
      window.scrollTo(0, 0)
    })
  }

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
      }).then(function() {
        disableSpinner(spinner)
      })
  }

  function loadNewest() {
    enableSpinner(refreshSpinner)
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
          }).then(function () {
            disableSpinner(refreshSpinner)
          })
      })
  }

  function addPost(data) {
    return fetch('api/add-post.php', {
      method: 'post',
      body: data,
      credentials: 'same-origin'
    }).then(function (res) {
      if (!res.ok) return parseJSON(res).then(setError)
      loadNewest()
      unsetError()
    })
  }

  function deletePost(item) {
    fetch('api/delete-post.php?id=' + item.id).then(loadNewest)
  }

  function parseJSON(res) {
    return res.json()
  }

  function enableSpinner(element) {
    element.style.display = 'inline-block'
  }

  function disableSpinner(element) {
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
    // content.appendChild(deleteIcon)
    
    var meta = document.createElement('div')
    meta.className = 'd-flex w-100 justify-content-between'

    var user = document.createElement('small')
    user.textContent = item.username || 'Anonymous'
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
