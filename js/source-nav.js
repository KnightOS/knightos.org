var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.github.com/orgs/KnightOS/repos?type=public');
xhr.onload = function() {
  var repos = JSON.parse(this.responseText);
  var list = document.getElementById('github-list');
  repos.sort(function(a, b) {
    return new Date(b.pushed_at) - new Date(a.pushed_at);
  });
  list.innerHTML = '';
  for (var i = 0; i < repos.length; i++) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = repos[i].html_url;
    a.textContent = repos[i].name;
    li.appendChild(a);
    list.appendChild(li);
  }
};
xhr.send();
