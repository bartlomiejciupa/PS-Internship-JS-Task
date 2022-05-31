'use strict';

const userInput = window.document.querySelector('.nb-news-input');
const newsList = window.document.querySelector('.news-list');

const loading = document.querySelector('.loading');
userInput.addEventListener('change', loadNews);

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight) {
    showLoading();
  }
});
function showLoading() {
  loading.classList.add('show');
  setTimeout(loadNews, 1000);
}

function loadNews(e) {
  let newsNumber = userInput.value;

  let url = `https://api.spaceflightnewsapi.net/v3/articles?_limit=${newsNumber}`;

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((news) => {
        let newsTitle = document.createElement('h2');
        let summaryField = document.createElement('p');
        let link = document.createElement('a');

        link.textContent = 'Read more';
        link.setAttribute('href', news.url);
        link.setAttribute('target', '_blank');
        newsTitle.textContent = news.title;

        if (news.summary.length - 200 <= 0) {
          summaryField.textContent = news.summary + ' ...';
        } else {
          summaryField.textContent = news.summary.substring(0, 200) + ' ...';
        }

        newsList.appendChild(newsTitle);
        newsList.appendChild(summaryField);
        newsList.appendChild(link);
        loading.classList.remove('show');
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
loadNews();

module.exports = { summaryField };
